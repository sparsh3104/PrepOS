import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { buildUserScopedStoragePath } from "@/lib/supabase/helpers";
import type { KnowledgeAttachment, KnowledgeFilters, KnowledgeNote, KnowledgeSort, NoteFormat } from "@/features/knowledge-base/types";
import type { TableInsert, TableUpdate } from "@/types/database";

const FOLDER_PREFIX = "folder:";
const FAVORITE_TAG = "favorite";
const FORMAT_PREFIX = "format:";

type NoteInsertInput = Omit<TableInsert<"knowledge_notes">, "user_id"> & {
  folder?: string;
  is_favorite?: boolean;
  format?: NoteFormat;
  attachments?: File[];
};

type NoteUpdateInput = TableUpdate<"knowledge_notes"> & {
  folder?: string;
  is_favorite?: boolean;
  format?: NoteFormat;
  attachments?: File[];
};

async function getSessionUserId() {
  const supabase = createSupabaseBrowserClient() as any;
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    throw new Error("Authentication required.");
  }

  return { userId: user.id, supabase };
}

function toNormalizedTag(value: string) {
  return value.trim().toLowerCase();
}

function extractFolder(tags: string[] | null) {
  if (!tags) {
    return null;
  }

  const folderTag = tags.find((tag) => tag.toLowerCase().startsWith(FOLDER_PREFIX));
  if (!folderTag) {
    return null;
  }

  return folderTag.slice(FOLDER_PREFIX.length).trim() || null;
}

function extractFormat(tags: string[] | null): NoteFormat {
  if (!tags) {
    return "markdown";
  }

  const formatTag = tags.find((tag) => tag.toLowerCase().startsWith(FORMAT_PREFIX));
  if (!formatTag) {
    return "markdown";
  }

  return formatTag.toLowerCase().includes("richtext") ? "richtext" : "markdown";
}

function hasFavoriteTag(tags: string[] | null) {
  if (!tags) {
    return false;
  }

  return tags.some((tag) => tag.toLowerCase() === FAVORITE_TAG);
}

function mergeTags(baseTags: string[] | null | undefined, folder?: string, isFavorite?: boolean, format?: NoteFormat) {
  const deduped = new Set<string>((baseTags || []).map((tag) => tag.trim()).filter(Boolean));

  Array.from(deduped).forEach((tag) => {
    const lower = tag.toLowerCase();
    if (lower.startsWith(FOLDER_PREFIX) || lower.startsWith(FORMAT_PREFIX) || lower === FAVORITE_TAG) {
      deduped.delete(tag);
    }
  });

  const trimmedFolder = folder?.trim();
  if (trimmedFolder) {
    deduped.add(`${FOLDER_PREFIX}${toNormalizedTag(trimmedFolder)}`);
  }

  if (isFavorite) {
    deduped.add(FAVORITE_TAG);
  }

  deduped.add(`${FORMAT_PREFIX}${format ?? "markdown"}`);
  return Array.from(deduped);
}

function normalizeNote(note: any): KnowledgeNote {
  return {
    ...note,
    folder: extractFolder(note?.tags ?? []),
    is_favorite: hasFavoriteTag(note?.tags ?? []),
    format: extractFormat(note?.tags ?? []),
  } as KnowledgeNote;
}

function applySort(query: any, sort: KnowledgeSort) {
  if (sort === "updated_asc") {
    return query.order("updated_at", { ascending: true });
  }

  if (sort === "title_asc") {
    return query.order("title", { ascending: true });
  }

  if (sort === "title_desc") {
    return query.order("title", { ascending: false });
  }

  if (sort === "created_desc") {
    return query.order("created_at", { ascending: false });
  }

  return query.order("updated_at", { ascending: false });
}

export async function createNote(input: NoteInsertInput) {
  const { userId, supabase } = await getSessionUserId();

  const payload: TableInsert<"knowledge_notes"> = {
    ...input,
    user_id: userId,
    content: input.content || "",
    tags: mergeTags(input.tags, input.folder, input.is_favorite, input.format),
  };

  const { data, error } = await supabase.from("knowledge_notes").insert(payload).select().single();
  if (error || !data) {
    throw new Error(error?.message ?? "Failed to create note.");
  }

  const files = input.attachments ?? [];
  for (const file of files) {
    await uploadAttachment(data.id, file);
  }

  return normalizeNote(data);
}

export async function updateNote(noteId: string, input: NoteUpdateInput) {
  const { userId, supabase } = await getSessionUserId();

  const incomingTags = input.tags ?? undefined;

  const updatePayload: TableUpdate<"knowledge_notes"> = {
    ...input,
    tags: mergeTags(incomingTags, input.folder, input.is_favorite, input.format),
  };

  const { data, error } = await supabase
    .from("knowledge_notes")
    .update(updatePayload)
    .eq("id", noteId)
    .eq("user_id", userId)
    .select()
    .single();

  if (error || !data) {
    throw new Error(error?.message ?? "Failed to update note.");
  }

  const files = input.attachments ?? [];
  for (const file of files) {
    await uploadAttachment(noteId, file);
  }

  return normalizeNote(data);
}

export async function deleteNote(noteId: string) {
  const { userId, supabase } = await getSessionUserId();

  const { data: attachmentRows } = await supabase
    .from("attachments")
    .select("id")
    .eq("linked_table", "knowledge_notes")
    .eq("linked_record_id", noteId)
    .eq("user_id", userId);

  for (const attachment of attachmentRows || []) {
    await deleteAttachment(attachment.id);
  }

  const { error } = await supabase
    .from("knowledge_notes")
    .delete()
    .eq("id", noteId)
    .eq("user_id", userId);

  if (error) {
    throw new Error(error.message);
  }

  return true;
}

export async function archiveNote(noteId: string) {
  return updateNote(noteId, { is_archived: true });
}

export async function restoreNote(noteId: string) {
  return updateNote(noteId, { is_archived: false });
}

export async function toggleBookmark(noteId: string) {
  const { userId, supabase } = await getSessionUserId();
  const { data: current, error: currentError } = await supabase
    .from("knowledge_notes")
    .select("is_bookmarked")
    .eq("id", noteId)
    .eq("user_id", userId)
    .single();

  if (currentError || !current) {
    throw new Error(currentError?.message ?? "Note not found.");
  }

  return updateNote(noteId, { is_bookmarked: !current.is_bookmarked });
}

export async function toggleFavorite(noteId: string) {
  const { userId, supabase } = await getSessionUserId();
  const { data: current, error: currentError } = await supabase
    .from("knowledge_notes")
    .select("tags")
    .eq("id", noteId)
    .eq("user_id", userId)
    .single();

  if (currentError || !current) {
    throw new Error(currentError?.message ?? "Note not found.");
  }

  const currentFavorite = hasFavoriteTag(current.tags || []);

  return updateNote(noteId, {
    tags: current.tags,
    is_favorite: !currentFavorite,
    format: extractFormat(current.tags || []),
    folder: extractFolder(current.tags || []) || undefined,
  });
}

function noteMatchesSearch(note: KnowledgeNote, search: string) {
  const q = search.trim().toLowerCase();
  if (!q) {
    return true;
  }

  const tagsText = (note.tags || []).join(" ").toLowerCase();
  const haystack = [note.title, note.content, note.subject, note.topic, note.subtopic, tagsText]
    .filter(Boolean)
    .join("\n")
    .toLowerCase();

  return haystack.includes(q);
}

export async function searchNotes(search: string) {
  const { userId, supabase } = await getSessionUserId();

  const query = search.trim();
  if (!query) {
    return filterNotes({
      archived: false,
      bookmarkedOnly: false,
      favoriteOnly: false,
      subject: "",
      topic: "",
      subtopic: "",
      tag: "",
      formulaOnly: false,
      search: "",
      currentFolder: "",
      sort: "updated_desc",
    });
  }

  const searchTerm = `%${query}%`;

  const { data, error } = await supabase
    .from("knowledge_notes")
    .select("*")
    .eq("user_id", userId)
    .or(
      `title.ilike.${searchTerm},content.ilike.${searchTerm},subject.ilike.${searchTerm},topic.ilike.${searchTerm},subtopic.ilike.${searchTerm}`,
    )
    .order("updated_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  const notes = ((data || []) as any[]).map((note) => normalizeNote(note));
  return notes.filter((note) => noteMatchesSearch(note, query));
}

export async function filterNotes(
  filters: KnowledgeFilters & {
    search: string;
    currentFolder: string;
    sort: KnowledgeSort;
  },
) {
  const { userId, supabase } = await getSessionUserId();

  let query = supabase.from("knowledge_notes").select("*").eq("user_id", userId);

  query = query.eq("is_archived", filters.archived);

  if (filters.bookmarkedOnly) {
    query = query.eq("is_bookmarked", true);
  }

  if (filters.formulaOnly) {
    query = query.eq("is_formula", true);
  }

  if (filters.subject.trim()) {
    query = query.ilike("subject", filters.subject.trim());
  }

  if (filters.topic.trim()) {
    query = query.ilike("topic", filters.topic.trim());
  }

  if (filters.subtopic.trim()) {
    query = query.ilike("subtopic", filters.subtopic.trim());
  }

  if (filters.tag.trim()) {
    query = query.contains("tags", [toNormalizedTag(filters.tag)]);
  }

  if (filters.currentFolder.trim()) {
    query = query.contains("tags", [`${FOLDER_PREFIX}${toNormalizedTag(filters.currentFolder)}`]);
  }

  query = applySort(query, filters.sort);

  const { data, error } = await query;

  if (error) {
    throw new Error(error.message);
  }

  let notes = ((data || []) as any[]).map((note) => normalizeNote(note));

  if (filters.favoriteOnly) {
    notes = notes.filter((note) => note.is_favorite);
  }

  if (filters.search.trim()) {
    notes = notes.filter((note) => noteMatchesSearch(note, filters.search));
  }

  return notes;
}

export async function uploadAttachment(noteId: string, file: File) {
  const { userId, supabase } = await getSessionUserId();

  const storagePath = buildUserScopedStoragePath(userId, `knowledge/${noteId}`, file.name);
  const uploadResult = await supabase.storage.from("uploads").upload(storagePath, file, {
    upsert: false,
  });

  if (uploadResult.error) {
    throw new Error(uploadResult.error.message);
  }

  const { data, error } = await supabase
    .from("attachments")
    .insert({
      user_id: userId,
      file_name: file.name,
      storage_path: storagePath,
      mime_type: file.type || "application/octet-stream",
      size: file.size,
      linked_table: "knowledge_notes",
      linked_record_id: noteId,
    })
    .select()
    .single();

  if (error || !data) {
    throw new Error(error?.message ?? "Failed to create attachment metadata.");
  }

  const signed = await supabase.storage.from("uploads").createSignedUrl(storagePath, 3600);

  return {
    ...(data as any),
    preview_url: signed.data?.signedUrl ?? null,
  } as KnowledgeAttachment;
}

export async function deleteAttachment(attachmentId: string) {
  const { userId, supabase } = await getSessionUserId();

  const { data: existing, error: fetchError } = await supabase
    .from("attachments")
    .select("id, storage_path")
    .eq("id", attachmentId)
    .eq("user_id", userId)
    .single();

  if (fetchError || !existing) {
    throw new Error(fetchError?.message ?? "Attachment not found.");
  }

  const removal = await supabase.storage.from("uploads").remove([existing.storage_path]);
  if (removal.error) {
    throw new Error(removal.error.message);
  }

  const { error } = await supabase.from("attachments").delete().eq("id", attachmentId).eq("user_id", userId);

  if (error) {
    throw new Error(error.message);
  }

  return true;
}

export async function getNoteAttachments(noteId: string) {
  const { userId, supabase } = await getSessionUserId();

  const { data, error } = await supabase
    .from("attachments")
    .select("*")
    .eq("user_id", userId)
    .eq("linked_table", "knowledge_notes")
    .eq("linked_record_id", noteId)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  const attachments: KnowledgeAttachment[] = [];

  for (const attachment of data || []) {
    const signed = await supabase.storage
      .from("uploads")
      .createSignedUrl((attachment as any).storage_path, 3600);

    attachments.push({
      ...(attachment as any),
      preview_url: signed.data?.signedUrl ?? null,
    } as KnowledgeAttachment);
  }

  return attachments;
}

export async function duplicateNote(noteId: string) {
  const { userId, supabase } = await getSessionUserId();

  const { data: source, error } = await supabase
    .from("knowledge_notes")
    .select("*")
    .eq("id", noteId)
    .eq("user_id", userId)
    .single();

  if (error || !source) {
    throw new Error(error?.message ?? "Note not found.");
  }

  const tags = (source as any).tags || [];

  return createNote({
    title: `${(source as any).title} (Copy)`,
    content: (source as any).content,
    subject: (source as any).subject,
    topic: (source as any).topic,
    subtopic: (source as any).subtopic,
    is_formula: (source as any).is_formula,
    is_bookmarked: false,
    is_archived: false,
    tags,
    folder: extractFolder(tags) || undefined,
    is_favorite: hasFavoriteTag(tags),
    format: extractFormat(tags),
  });
}

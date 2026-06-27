"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  Archive,
  ArchiveRestore,
  BookOpenText,
  Bookmark,
  Copy,
  Folder,
  Heart,
  Loader2,
  Plus,
  Search,
  Star,
  Trash2,
} from "lucide-react";
import { useEffect, useMemo } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { NoteEditorPanel } from "@/features/knowledge-base/components/note-editor-panel";
import {
  useKnowledgeFolders,
  useKnowledgeMutations,
  useKnowledgeNotes,
  useNoteAttachments,
} from "@/features/knowledge-base/hooks/use-knowledge-notes";
import type { KnowledgeNoteFormValues } from "@/features/knowledge-base/schemas";
import { useKnowledgeStore } from "@/store/knowledge.store";

function parseTags(raw: string | undefined) {
  return (raw || "")
    .split(",")
    .map((tag) => tag.trim().toLowerCase())
    .filter(Boolean);
}

function defaultNewNote() {
  return {
    title: "Untitled note",
    content: "",
    subject: null,
    topic: null,
    subtopic: null,
    tags: [],
    is_bookmarked: false,
    is_archived: false,
    is_formula: false,
    is_favorite: false,
    format: "markdown" as const,
  };
}

export function KnowledgeBasePage() {
  const {
    currentFolder,
    selectedNote,
    filters,
    search,
    sort,
    viewMode,
    setCurrentFolder,
    setSelectedNote,
    setFilters,
    setSearch,
    setSort,
    setViewMode,
    setLoading,
  } = useKnowledgeStore();

  const notesQuery = useKnowledgeNotes(search, sort, currentFolder, filters);
  const foldersQuery = useKnowledgeFolders();
  const mutations = useKnowledgeMutations(search, sort, currentFolder, filters);
  const attachmentsQuery = useNoteAttachments(selectedNote?.id ?? null);

  useEffect(() => {
    setLoading(notesQuery.isLoading);
  }, [notesQuery.isLoading, setLoading]);

  const selectedNoteFromList = useMemo(() => {
    if (!selectedNote || !notesQuery.data) {
      return selectedNote;
    }

    return notesQuery.data.find((note) => note.id === selectedNote.id) || selectedNote;
  }, [notesQuery.data, selectedNote]);

  const createNote = async () => {
    const created = await mutations.createNote.mutateAsync(defaultNewNote());
    setSelectedNote(created);
  };

  const saveNote = async (values: KnowledgeNoteFormValues, files: File[]) => {
    if (!selectedNoteFromList) {
      return;
    }

    const payload = {
      title: values.title,
      content: values.content || "",
      folder: values.folder || "",
      subject: values.subject || null,
      topic: values.topic || null,
      subtopic: values.subtopic || null,
      tags: parseTags(values.tags),
      is_bookmarked: values.is_bookmarked,
      is_archived: filters.archived,
      is_formula: values.is_formula,
      is_favorite: values.is_favorite,
      format: values.format,
      attachments: files,
    };

    const updated = await mutations.updateNote.mutateAsync({
      noteId: selectedNoteFromList.id,
      input: payload,
    });

    setSelectedNote(updated);
  };

  const activeCount = notesQuery.data?.length || 0;

  return (
    <section className="grid gap-4 xl:grid-cols-[260px_320px_1fr]">
      <aside className="space-y-4 rounded-xl border bg-card p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-muted-foreground">Folders</h2>
          <Button size="sm" onClick={createNote} disabled={mutations.createNote.isPending}>
            <Plus className="mr-2 h-4 w-4" /> New
          </Button>
        </div>

        <button
          type="button"
          onClick={() => setCurrentFolder("")}
          className="flex w-full items-center justify-between rounded-md border px-3 py-2 text-left text-sm hover:bg-accent"
        >
          <span>All Notes</span>
          <span className="text-xs text-muted-foreground">{activeCount}</span>
        </button>

        <div className="space-y-1">
          {(foldersQuery.data || []).map((folder) => (
            <button
              type="button"
              key={folder.folder}
              onClick={() => setCurrentFolder(folder.folder)}
              className="flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm text-muted-foreground transition hover:bg-accent hover:text-accent-foreground"
            >
              <span className="inline-flex items-center gap-2">
                <Folder className="h-4 w-4" /> {folder.folder}
              </span>
              <span className="text-xs">{folder.count}</span>
            </button>
          ))}

          {foldersQuery.data?.length === 0 ? (
            <p className="px-2 text-sm text-muted-foreground">No folders yet. Create a note to start organizing.</p>
          ) : null}
        </div>

        <div className="space-y-2 rounded-lg border border-dashed p-3">
          <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">Filters</h3>
          <label className="inline-flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              className="h-4 w-4"
              checked={filters.bookmarkedOnly}
              onChange={(event) => setFilters({ bookmarkedOnly: event.target.checked })}
            />
            Bookmarked
          </label>
          <label className="inline-flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              className="h-4 w-4"
              checked={filters.favoriteOnly}
              onChange={(event) => setFilters({ favoriteOnly: event.target.checked })}
            />
            Favorite
          </label>
          <label className="inline-flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              className="h-4 w-4"
              checked={filters.formulaOnly}
              onChange={(event) => setFilters({ formulaOnly: event.target.checked })}
            />
            Formula Notes
          </label>
          <label className="inline-flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              className="h-4 w-4"
              checked={filters.archived}
              onChange={(event) => {
                setFilters({ archived: event.target.checked });
                setSelectedNote(null);
              }}
            />
            Archive
          </label>
        </div>
      </aside>

      <div className="space-y-4 rounded-xl border bg-card p-4">
        <div className="space-y-2">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="pl-9"
              placeholder="Search title, tags, subject, topic, content"
              aria-label="Knowledge Base search"
            />
          </div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            <Input
              value={filters.subject}
              onChange={(event) => setFilters({ subject: event.target.value })}
              placeholder="Subject"
            />
            <Input value={filters.topic} onChange={(event) => setFilters({ topic: event.target.value })} placeholder="Topic" />
            <Input
              value={filters.subtopic}
              onChange={(event) => setFilters({ subtopic: event.target.value })}
              placeholder="Subtopic"
            />
            <Input value={filters.tag} onChange={(event) => setFilters({ tag: event.target.value })} placeholder="Tag" />
          </div>

          <select
            className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
            value={sort}
            onChange={(event) => setSort(event.target.value as typeof sort)}
          >
            <option value="updated_desc">Recently Updated</option>
            <option value="updated_asc">Oldest Updated</option>
            <option value="created_desc">Recently Created</option>
            <option value="title_asc">Title A-Z</option>
            <option value="title_desc">Title Z-A</option>
          </select>
        </div>

        {notesQuery.isLoading ? (
          <div className="flex min-h-[300px] items-center justify-center rounded-lg border border-dashed">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            <span className="text-sm text-muted-foreground">Loading notes...</span>
          </div>
        ) : null}

        {notesQuery.isError ? (
          <div className="flex min-h-[300px] items-center justify-center rounded-lg border border-dashed text-sm text-destructive">
            {(notesQuery.error as Error).message || "Unable to load notes."}
          </div>
        ) : null}

        {!notesQuery.isLoading && !notesQuery.isError ? (
          <div className="space-y-2">
            {notesQuery.data?.length === 0 ? (
              <div className="flex min-h-[280px] flex-col items-center justify-center rounded-lg border border-dashed text-center">
                <BookOpenText className="h-6 w-6 text-muted-foreground" />
                <p className="mt-2 text-sm text-muted-foreground">No notes match your current search and filters.</p>
                <Button className="mt-3" variant="outline" onClick={createNote}>
                  Create your first note
                </Button>
              </div>
            ) : (
              <motion.ul
                initial="hidden"
                animate="visible"
                variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.04 } } }}
                className="space-y-2"
              >
                {notesQuery.data?.map((note) => (
                  <motion.li
                    key={note.id}
                    variants={{ hidden: { opacity: 0, y: 6 }, visible: { opacity: 1, y: 0 } }}
                    className={`rounded-lg border p-3 transition hover:border-primary/50 ${selectedNoteFromList?.id === note.id ? "border-primary/60" : ""}`}
                  >
                    <button type="button" onClick={() => setSelectedNote(note)} className="w-full text-left">
                      <p className="truncate font-medium">{note.title}</p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {note.subject || "No subject"} {note.topic ? `• ${note.topic}` : ""}
                      </p>
                    </button>

                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => mutations.toggleBookmark.mutate(note.id)}
                        disabled={mutations.toggleBookmark.isPending}
                      >
                        <Bookmark className={`h-4 w-4 ${note.is_bookmarked ? "fill-current" : ""}`} />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => mutations.toggleFavorite.mutate(note.id)}
                        disabled={mutations.toggleFavorite.isPending}
                      >
                        <Heart className={`h-4 w-4 ${note.is_favorite ? "fill-current" : ""}`} />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={async () => {
                          const copy = await mutations.duplicateNote.mutateAsync(note.id);
                          setSelectedNote(copy);
                        }}
                        disabled={mutations.duplicateNote.isPending}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      {note.is_archived ? (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={async () => {
                            const restored = await mutations.restoreNote.mutateAsync(note.id);
                            setSelectedNote(restored);
                          }}
                          disabled={mutations.restoreNote.isPending}
                        >
                          <ArchiveRestore className="h-4 w-4" />
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={async () => {
                            const archived = await mutations.archiveNote.mutateAsync(note.id);
                            if (selectedNoteFromList?.id === note.id) {
                              setSelectedNote(archived);
                            }
                          }}
                          disabled={mutations.archiveNote.isPending}
                        >
                          <Archive className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={async () => {
                          await mutations.deleteNote.mutateAsync(note.id);
                          if (selectedNoteFromList?.id === note.id) {
                            setSelectedNote(null);
                          }
                        }}
                        disabled={mutations.deleteNote.isPending}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      {note.is_formula ? <Star className="h-4 w-4 text-amber-500" /> : null}
                    </div>
                  </motion.li>
                ))}
              </motion.ul>
            )}
          </div>
        ) : null}
      </div>

      <div className="min-h-[520px]">
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <Button size="sm" variant={viewMode === "editor" ? "default" : "outline"} onClick={() => setViewMode("editor")}>
            Editor
          </Button>
          <Button size="sm" variant={viewMode === "preview" ? "default" : "outline"} onClick={() => setViewMode("preview")}>
            Preview
          </Button>
          <Button size="sm" variant={viewMode === "split" ? "default" : "outline"} onClick={() => setViewMode("split")}>
            Split View
          </Button>
        </div>

        <AnimatePresence mode="wait">
          {!selectedNoteFromList ? (
            <motion.div
              key="empty-editor"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="flex min-h-[520px] flex-col items-center justify-center rounded-xl border border-dashed bg-card px-5 text-center"
            >
              <BookOpenText className="h-7 w-7 text-muted-foreground" />
              <p className="mt-2 text-sm text-muted-foreground">Select a note to edit, preview, bookmark, archive, or attach files.</p>
              <Button className="mt-3" onClick={createNote}>
                Create Note
              </Button>
            </motion.div>
          ) : (
            <motion.div
              key={selectedNoteFromList.id}
              initial={{ opacity: 0, x: 14 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -14 }}
            >
              <NoteEditorPanel
                note={selectedNoteFromList}
                viewMode={viewMode}
                saving={mutations.updateNote.isPending}
                attachments={attachmentsQuery.data || []}
                attachmentsLoading={attachmentsQuery.isLoading}
                onSave={saveNote}
                onUploadAttachment={async (file) => {
                  await mutations.uploadAttachment.mutateAsync({ noteId: selectedNoteFromList.id, file });
                }}
                onDeleteAttachment={async (attachmentId) => {
                  await mutations.deleteAttachment.mutateAsync({ attachmentId, noteId: selectedNoteFromList.id });
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

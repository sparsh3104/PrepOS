"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import { FileImage, FileText, FileUp, Save, Trash2 } from "lucide-react";
import { useEffect, useMemo, useRef } from "react";
import ReactMarkdown from "react-markdown";
import { useForm } from "react-hook-form";
import remarkGfm from "remark-gfm";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { knowledgeNoteSchema, type KnowledgeNoteFormValues } from "@/features/knowledge-base/schemas";
import type { KnowledgeAttachment, KnowledgeNote, KnowledgeViewMode } from "@/features/knowledge-base/types";

interface NoteEditorPanelProps {
  note: KnowledgeNote;
  viewMode: KnowledgeViewMode;
  saving: boolean;
  attachments: KnowledgeAttachment[];
  attachmentsLoading: boolean;
  onSave: (values: KnowledgeNoteFormValues, files: File[]) => Promise<void>;
  onUploadAttachment: (file: File) => Promise<void>;
  onDeleteAttachment: (attachmentId: string) => Promise<void>;
}

function getUserTags(tags: string[]) {
  return tags
    .filter((tag) => !tag.startsWith("folder:"))
    .filter((tag) => tag !== "favorite")
    .filter((tag) => !tag.startsWith("format:"));
}

function getFolder(tags: string[]) {
  return tags.find((tag) => tag.startsWith("folder:"))?.replace("folder:", "") || "";
}

export function NoteEditorPanel({
  note,
  viewMode,
  saving,
  attachments,
  attachmentsLoading,
  onSave,
  onUploadAttachment,
  onDeleteAttachment,
}: NoteEditorPanelProps) {
  const attachmentInputRef = useRef<HTMLInputElement | null>(null);

  const defaultValues = useMemo<KnowledgeNoteFormValues>(
    () => ({
      title: note.title,
      content: note.content,
      folder: getFolder(note.tags),
      subject: note.subject || "",
      topic: note.topic || "",
      subtopic: note.subtopic || "",
      tags: getUserTags(note.tags).join(", "),
      is_formula: note.is_formula,
      is_bookmarked: note.is_bookmarked,
      is_favorite: note.is_favorite,
      format: note.format,
    }),
    [note],
  );

  const form = useForm<KnowledgeNoteFormValues>({
    resolver: zodResolver(knowledgeNoteSchema),
    defaultValues,
  });

  useEffect(() => {
    form.reset(defaultValues);
  }, [defaultValues, form]);

  const format = form.watch("format");
  const content = form.watch("content") || "";

  const submit = form.handleSubmit(async (values) => {
    const files = Array.from(attachmentInputRef.current?.files || []);
    await onSave(values, files);
    if (attachmentInputRef.current) {
      attachmentInputRef.current.value = "";
    }
  });

  return (
    <div className="rounded-xl border bg-card p-4">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-muted-foreground">Editor</h2>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            size="sm"
            variant={format === "markdown" ? "default" : "outline"}
            onClick={() => form.setValue("format", "markdown")}
          >
            Markdown
          </Button>
          <Button
            type="button"
            size="sm"
            variant={format === "richtext" ? "default" : "outline"}
            onClick={() => form.setValue("format", "richtext")}
          >
            Rich Text
          </Button>
        </div>
      </div>

      <form className="space-y-4" onSubmit={submit}>
        <div className="grid gap-2">
          <Label htmlFor="kb_title">Title</Label>
          <Input id="kb_title" {...form.register("title")} />
          {form.formState.errors.title ? (
            <p className="text-xs text-destructive">{form.formState.errors.title.message}</p>
          ) : null}
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <div className="grid gap-2">
            <Label htmlFor="kb_folder">Folder</Label>
            <Input id="kb_folder" placeholder="formula-sheets" {...form.register("folder")} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="kb_tags">Tags</Label>
            <Input id="kb_tags" placeholder="algebra, shortcuts" {...form.register("tags")} />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          <div className="grid gap-2">
            <Label htmlFor="kb_subject">Subject</Label>
            <Input id="kb_subject" placeholder="Quant" {...form.register("subject")} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="kb_topic">Topic</Label>
            <Input id="kb_topic" placeholder="Algebra" {...form.register("topic")} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="kb_subtopic">Subtopic</Label>
            <Input id="kb_subtopic" placeholder="Quadratic equations" {...form.register("subtopic")} />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-sm">
          <label className="inline-flex items-center gap-2">
            <input type="checkbox" className="h-4 w-4" {...form.register("is_bookmarked")} /> Bookmark
          </label>
          <label className="inline-flex items-center gap-2">
            <input type="checkbox" className="h-4 w-4" {...form.register("is_favorite")} /> Favorite
          </label>
          <label className="inline-flex items-center gap-2">
            <input type="checkbox" className="h-4 w-4" {...form.register("is_formula")} /> Formula Note
          </label>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="kb_content">Content</Label>

          <div className={viewMode === "split" ? "grid gap-3 lg:grid-cols-2" : "grid gap-3"}>
            {viewMode !== "preview" ? (
              format === "markdown" ? (
                <Textarea id="kb_content" rows={14} {...form.register("content")} />
              ) : (
                <div className="rounded-md border border-input bg-background p-3">
                  <div
                    className="min-h-[260px] whitespace-pre-wrap outline-none"
                    contentEditable
                    suppressContentEditableWarning
                    onInput={(event) => {
                      form.setValue("content", event.currentTarget.innerHTML, { shouldDirty: true });
                    }}
                    dangerouslySetInnerHTML={{ __html: content }}
                  />
                </div>
              )
            ) : null}

            {viewMode !== "editor" ? (
              <div className="min-h-[260px] rounded-md border border-input bg-background p-3">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`${format}-${note.id}-${content.length}`}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.15 }}
                  >
                    {format === "markdown" ? (
                      <div className="space-y-2 text-sm text-muted-foreground">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>{content || "_No content yet._"}</ReactMarkdown>
                      </div>
                    ) : (
                      <div
                        className="text-sm text-muted-foreground"
                        dangerouslySetInnerHTML={{ __html: content || "<em>No content yet.</em>" }}
                      />
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
            ) : null}
          </div>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="kb_attachments">Upload Attachments</Label>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <Input
              id="kb_attachments"
              ref={attachmentInputRef}
              type="file"
              multiple
              accept=".png,.jpg,.jpeg,.pdf,.txt,.md"
            />
            <Button type="button" variant="outline" onClick={() => attachmentInputRef.current?.click()}>
              <FileUp className="mr-2 h-4 w-4" /> Browse
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">Supports image upload, PDF upload, and screenshot upload.</p>
        </div>

        <div className="flex items-center justify-end">
          <Button type="submit" disabled={saving}>
            <Save className="mr-2 h-4 w-4" /> {saving ? "Saving..." : "Save Note"}
          </Button>
        </div>
      </form>

      <div className="mt-5">
        <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">Attachments</h3>
        {attachmentsLoading ? <p className="mt-2 text-sm text-muted-foreground">Loading attachments...</p> : null}

        {!attachmentsLoading && attachments.length === 0 ? (
          <p className="mt-2 text-sm text-muted-foreground">No attachments linked to this note.</p>
        ) : null}

        <ul className="mt-3 space-y-2">
          {attachments.map((attachment) => {
            const isImage = attachment.mime_type.startsWith("image/");
            const isPdf = attachment.mime_type === "application/pdf";

            return (
              <li key={attachment.id} className="rounded-lg border p-2">
                <div className="flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{attachment.file_name}</p>
                    <p className="text-xs text-muted-foreground">{Math.round(attachment.size / 1024)} KB</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={async () => {
                        const fileInput = attachmentInputRef.current;
                        if (!fileInput || !fileInput.files || fileInput.files.length === 0) {
                          return;
                        }
                        await onUploadAttachment(fileInput.files[0]);
                        fileInput.value = "";
                      }}
                    >
                      Replace
                    </Button>
                    <Button type="button" size="sm" variant="destructive" onClick={() => onDeleteAttachment(attachment.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {attachment.preview_url ? (
                  <div className="mt-2 overflow-hidden rounded-md border bg-background">
                    {isImage ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={attachment.preview_url} alt={attachment.file_name} className="max-h-48 w-full object-cover" />
                    ) : isPdf ? (
                      <a
                        href={attachment.preview_url}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-2 px-3 py-2 text-sm text-primary hover:underline"
                      >
                        <FileText className="h-4 w-4" /> Open PDF preview
                      </a>
                    ) : (
                      <a
                        href={attachment.preview_url}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-2 px-3 py-2 text-sm text-primary hover:underline"
                      >
                        <FileImage className="h-4 w-4" /> Open attachment
                      </a>
                    )}
                  </div>
                ) : null}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

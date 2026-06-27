import type { TableRow } from "@/types/database";

export type NoteFormat = "markdown" | "richtext";
export type KnowledgeSort = "updated_desc" | "updated_asc" | "title_asc" | "title_desc" | "created_desc";
export type KnowledgeViewMode = "editor" | "preview" | "split";

export interface KnowledgeFilters {
  archived: boolean;
  bookmarkedOnly: boolean;
  favoriteOnly: boolean;
  subject: string;
  topic: string;
  subtopic: string;
  tag: string;
  formulaOnly: boolean;
}

export interface KnowledgeNote extends TableRow<"knowledge_notes"> {
  folder: string | null;
  is_favorite: boolean;
  format: NoteFormat;
}

export interface KnowledgeAttachment extends TableRow<"attachments"> {
  preview_url: string | null;
}

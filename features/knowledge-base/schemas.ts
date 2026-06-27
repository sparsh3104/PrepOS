import { z } from "zod";

export const knowledgeNoteSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters."),
  content: z.string().optional(),
  folder: z.string().optional(),
  subject: z.string().optional(),
  topic: z.string().optional(),
  subtopic: z.string().optional(),
  tags: z.string().optional(),
  is_formula: z.boolean().default(false),
  is_bookmarked: z.boolean().default(false),
  is_favorite: z.boolean().default(false),
  format: z.enum(["markdown", "richtext"]).default("markdown"),
});

export type KnowledgeNoteFormValues = z.input<typeof knowledgeNoteSchema>;

import { z } from "zod";

export const plannerTaskSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters."),
  description: z.string().optional(),
  category: z.string().optional(),
  subject: z.string().optional(),
  topic: z.string().optional(),
  subtopic: z.string().optional(),
  priority: z.coerce.number().min(1).max(5),
  estimated_minutes: z.coerce.number().min(0).optional(),
  actual_minutes: z.coerce.number().min(0).optional(),
  due_date: z.string().optional(),
  reminder_time: z.string().optional(),
  recurrence_rule: z.string().optional(),
  notes: z.string().optional(),
  status: z.enum(["pending", "in_progress", "completed", "skipped"]),
});

export type PlannerTaskFormValues = z.input<typeof plannerTaskSchema>;

import type { TableRow } from "@/types/database";

export type PlannerTask = TableRow<"daily_tasks"> & {
  category: string | null;
};

export type StudySession = TableRow<"study_sessions">;

export type PlannerView = "daily" | "weekly" | "monthly";

export interface PlannerFilters {
  quickFilter: "today" | "tomorrow" | "this_week" | "completed" | "pending" | "all";
  priority: "all" | "1" | "2" | "3" | "4" | "5";
  subject: string;
}

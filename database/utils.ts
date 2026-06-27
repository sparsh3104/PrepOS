import type { PublicTableName } from "@/types/database";

export const FOREIGN_KEY_CASCADE_RULES: Record<string, "cascade" | "set null" | "restrict"> = {
  "profiles.user_id->auth.users.id": "cascade",
  "daily_tasks.user_id->auth.users.id": "cascade",
  "study_sessions.user_id->auth.users.id": "cascade",
  "study_sessions.task_id->daily_tasks.id": "set null",
  "progress.user_id->auth.users.id": "cascade",
  "knowledge_notes.user_id->auth.users.id": "cascade",
  "flashcards.user_id->auth.users.id": "cascade",
  "flashcards.note_id->knowledge_notes.id": "set null",
  "error_logs.user_id->auth.users.id": "cascade",
  "error_logs.screenshot_attachment_id->attachments.id": "set null",
  "mock_tests.user_id->auth.users.id": "cascade",
  "mock_sections.mock_test_id->mock_tests.id": "cascade",
  "attachments.user_id->auth.users.id": "cascade",
  "notifications.user_id->auth.users.id": "cascade",
  "roadmap.user_id->auth.users.id": "cascade",
  "settings.user_id->auth.users.id": "cascade",
  "achievements.user_id->auth.users.id": "cascade",
  "activity_logs.user_id->auth.users.id": "cascade",
};

export function tableExists(tableName: string, tables: readonly PublicTableName[]) {
  return tables.includes(tableName as PublicTableName);
}

export const CORE_TABLES: readonly PublicTableName[] = [
  "profiles",
  "daily_tasks",
  "study_sessions",
  "progress",
  "knowledge_notes",
  "flashcards",
  "error_logs",
  "mock_tests",
  "mock_sections",
  "attachments",
  "notifications",
  "roadmap",
  "settings",
  "achievements",
  "activity_logs",
] as const;

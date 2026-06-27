import type { PublicTableName } from "@/types/database";

export interface DatabaseResult<T> {
  success: boolean;
  data: T | null;
  error: string | null;
  message: string;
}

export function createResult<T>(
  success: boolean,
  message: string,
  data: T | null = null,
  error: string | null = null,
): DatabaseResult<T> {
  return { success, data, error, message };
}

export function normalizeTableName(name: string): PublicTableName | null {
  const normalized = name.trim().toLowerCase().replace(/\s+/g, "_");
  const tableNames: PublicTableName[] = [
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
  ];

  return tableNames.includes(normalized as PublicTableName)
    ? (normalized as PublicTableName)
    : null;
}

export function buildUserScopedStoragePath(userId: string, directory: string, fileName: string) {
  const safeDirectory = directory.replace(/^\/+|\/+$/g, "");
  const safeFileName = fileName.replace(/\s+/g, "-").toLowerCase();

  return `${userId}/${safeDirectory}/${safeFileName}`;
}

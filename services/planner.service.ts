import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { buildUserScopedStoragePath } from "@/lib/supabase/helpers";
import type { TableInsert, TableUpdate } from "@/types/database";
import type { PlannerTask, StudySession } from "@/features/planner/types";

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

function mergeCategoryIntoNotes(notes: string | undefined, category: string | undefined) {
  const trimmedCategory = category?.trim();
  if (!trimmedCategory) {
    return notes?.trim() || null;
  }

  const withoutCategory = (notes || "")
    .split("\n")
    .filter((line) => !line.startsWith("Category:"))
    .join("\n")
    .trim();

  return [`Category: ${trimmedCategory}`, withoutCategory].filter(Boolean).join("\n");
}

function extractCategory(notes: string | null) {
  if (!notes) {
    return null;
  }

  const categoryLine = notes
    .split("\n")
    .find((line) => line.toLowerCase().startsWith("category:"));

  if (!categoryLine) {
    return null;
  }

  return categoryLine.replace(/category:/i, "").trim() || null;
}

function normalizeTask(task: any): PlannerTask {
  return {
    ...task,
    category: extractCategory(task?.notes ?? null),
  } as PlannerTask;
}

export async function createTask(
  input: Omit<TableInsert<"daily_tasks">, "user_id" | "attachment_count"> & {
    category?: string;
    attachments?: File[];
  },
) {
  const { userId, supabase } = await getSessionUserId();

  const payload: TableInsert<"daily_tasks"> = {
    ...input,
    notes: mergeCategoryIntoNotes(input.notes ?? undefined, input.category),
    user_id: userId,
    attachment_count: 0,
  };

  const { data, error } = await supabase.from("daily_tasks").insert(payload).select().single();
  if (error || !data) {
    throw new Error(error?.message ?? "Failed to create task.");
  }

  const files = input.attachments ?? [];
  if (files.length > 0) {
    let uploadedCount = 0;

    for (const file of files) {
      const storagePath = buildUserScopedStoragePath(userId, `planner/${data.id}`, file.name);
      const uploadResult = await supabase.storage.from("uploads").upload(storagePath, file, {
        upsert: false,
      });

      if (!uploadResult.error) {
        uploadedCount += 1;
        await supabase.from("attachments").insert({
          user_id: userId,
          file_name: file.name,
          storage_path: storagePath,
          mime_type: file.type || "application/octet-stream",
          size: file.size,
          linked_table: "daily_tasks",
          linked_record_id: data.id,
        });
      }
    }

    if (uploadedCount > 0) {
      await supabase
        .from("daily_tasks")
        .update({ attachment_count: uploadedCount })
        .eq("id", data.id)
        .eq("user_id", userId);
    }
  }

  return normalizeTask(data);
}

export async function updateTask(
  taskId: string,
  input: TableUpdate<"daily_tasks"> & { category?: string; attachments?: File[] },
) {
  const { userId, supabase } = await getSessionUserId();

  const updatePayload: TableUpdate<"daily_tasks"> = {
    ...input,
    notes: mergeCategoryIntoNotes(input.notes ?? undefined, input.category),
  };

  const { data, error } = await supabase
    .from("daily_tasks")
    .update(updatePayload)
    .eq("id", taskId)
    .eq("user_id", userId)
    .select()
    .single();

  if (error || !data) {
    throw new Error(error?.message ?? "Failed to update task.");
  }

  const files = input.attachments ?? [];
  if (files.length > 0) {
    const existing = data.attachment_count || 0;
    let uploadedCount = 0;

    for (const file of files) {
      const storagePath = buildUserScopedStoragePath(userId, `planner/${taskId}`, file.name);
      const uploadResult = await supabase.storage.from("uploads").upload(storagePath, file, {
        upsert: false,
      });

      if (!uploadResult.error) {
        uploadedCount += 1;
        await supabase.from("attachments").insert({
          user_id: userId,
          file_name: file.name,
          storage_path: storagePath,
          mime_type: file.type || "application/octet-stream",
          size: file.size,
          linked_table: "daily_tasks",
          linked_record_id: taskId,
        });
      }
    }

    if (uploadedCount > 0) {
      await supabase
        .from("daily_tasks")
        .update({ attachment_count: existing + uploadedCount })
        .eq("id", taskId)
        .eq("user_id", userId);
    }
  }

  return normalizeTask(data);
}

export async function deleteTask(taskId: string) {
  const { userId, supabase } = await getSessionUserId();
  const { error } = await supabase.from("daily_tasks").delete().eq("id", taskId).eq("user_id", userId);

  if (error) {
    throw new Error(error.message);
  }

  return true;
}

export async function completeTask(taskId: string) {
  return updateTask(taskId, { status: "completed" });
}

export async function moveTask(taskId: string, dueDate: string) {
  return updateTask(taskId, { due_date: dueDate });
}

export async function duplicateTask(taskId: string) {
  const { userId, supabase } = await getSessionUserId();
  const { data: source, error: sourceError } = await supabase
    .from("daily_tasks")
    .select("*")
    .eq("id", taskId)
    .eq("user_id", userId)
    .single();

  if (sourceError || !source) {
    throw new Error(sourceError?.message ?? "Task not found.");
  }

  const { id, created_at, updated_at, ...rest } = source as any;
  return createTask({
    ...rest,
    title: `${(source as any).title} (Copy)`,
  });
}

function getRangeForView(dateString: string, view: "daily" | "weekly" | "monthly") {
  const base = new Date(`${dateString}T00:00:00`);
  const start = new Date(base);
  const end = new Date(base);

  if (view === "daily") {
    end.setHours(23, 59, 59, 999);
  }

  if (view === "weekly") {
    const day = start.getDay();
    const diffToMonday = day === 0 ? -6 : 1 - day;
    start.setDate(start.getDate() + diffToMonday);
    end.setTime(start.getTime());
    end.setDate(end.getDate() + 6);
    end.setHours(23, 59, 59, 999);
  }

  if (view === "monthly") {
    start.setDate(1);
    end.setMonth(start.getMonth() + 1, 0);
    end.setHours(23, 59, 59, 999);
  }

  return { start: start.toISOString(), end: end.toISOString() };
}

async function getTasksByRange(dateString: string, view: "daily" | "weekly" | "monthly") {
  const { userId, supabase } = await getSessionUserId();
  const { start, end } = getRangeForView(dateString, view);

  const { data, error } = await supabase
    .from("daily_tasks")
    .select("*")
    .eq("user_id", userId)
    .gte("due_date", start)
    .lte("due_date", end)
    .order("due_date", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return ((data || []) as any[]).map((task) => normalizeTask(task));
}

export async function getDailyTasks(dateString: string) {
  return getTasksByRange(dateString, "daily");
}

export async function getWeeklyTasks(dateString: string) {
  return getTasksByRange(dateString, "weekly");
}

export async function getMonthlyTasks(dateString: string) {
  return getTasksByRange(dateString, "monthly");
}

export async function startStudySession(taskId: string) {
  const { userId, supabase } = await getSessionUserId();
  const { data: task } = await supabase
    .from("daily_tasks")
    .select("subject, topic")
    .eq("id", taskId)
    .eq("user_id", userId)
    .single();

  const { data, error } = await supabase
    .from("study_sessions")
    .insert({
      user_id: userId,
      task_id: taskId,
      subject: task?.subject ?? null,
      topic: task?.topic ?? null,
      started_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error || !data) {
    throw new Error(error?.message ?? "Unable to start study session.");
  }

  return data as StudySession;
}

export async function finishStudySession(sessionId: string) {
  const { userId, supabase } = await getSessionUserId();

  const { data: existing, error: fetchError } = await supabase
    .from("study_sessions")
    .select("started_at")
    .eq("id", sessionId)
    .eq("user_id", userId)
    .single();

  if (fetchError || !existing) {
    throw new Error(fetchError?.message ?? "Session not found.");
  }

  const endedAt = new Date();
  const startedAt = new Date(existing.started_at);
  const duration = Math.max(0, Math.round((endedAt.getTime() - startedAt.getTime()) / 60000));

  const { data, error } = await supabase
    .from("study_sessions")
    .update({
      ended_at: endedAt.toISOString(),
      duration_minutes: duration,
    })
    .eq("id", sessionId)
    .eq("user_id", userId)
    .select()
    .single();

  if (error || !data) {
    throw new Error(error?.message ?? "Unable to finish study session.");
  }

  return data as StudySession;
}

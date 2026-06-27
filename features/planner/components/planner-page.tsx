"use client";

import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, Calendar, ChevronRight, Loader2, Plus } from "lucide-react";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { usePlannerMutations, usePlannerTasks } from "@/features/planner/hooks/use-planner-tasks";
import type { PlannerTaskFormValues } from "@/features/planner/schemas";
import { DeleteTaskDialog } from "@/features/planner/components/delete-task-dialog";
import { TaskDetailDrawer } from "@/features/planner/components/task-detail-drawer";
import { TaskFormDialog } from "@/features/planner/components/task-form-dialog";
import { usePlannerStore } from "@/store/planner.store";

function stripCategoryFromNotes(notes: string | null) {
  if (!notes) {
    return "";
  }

  return notes
    .split("\n")
    .filter((line) => !line.toLowerCase().startsWith("category:"))
    .join("\n")
    .trim();
}

export function PlannerPage() {
  const {
    selectedDate,
    currentView,
    selectedTask,
    filters,
    setSelectedDate,
    setCurrentView,
    setSelectedTask,
    setFilters,
  } = usePlannerStore();

  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);

  const tasksQuery = usePlannerTasks(selectedDate, currentView);
  const mutations = usePlannerMutations(selectedDate, currentView);

  const filteredTasks = useMemo(() => {
    const tasks = tasksQuery.data ?? [];

    return tasks.filter((task) => {
      const taskDate = task.due_date ? new Date(task.due_date) : null;
      const now = new Date(`${selectedDate}T00:00:00`);

      if (filters.quickFilter === "today") {
        if (!taskDate || taskDate.toDateString() !== now.toDateString()) {
          return false;
        }
      }

      if (filters.quickFilter === "tomorrow") {
        const tomorrow = new Date(now);
        tomorrow.setDate(now.getDate() + 1);

        if (!taskDate || taskDate.toDateString() !== tomorrow.toDateString()) {
          return false;
        }
      }

      if (filters.quickFilter === "this_week") {
        const start = new Date(now);
        const day = start.getDay();
        const mondayOffset = day === 0 ? -6 : 1 - day;
        start.setDate(start.getDate() + mondayOffset);
        start.setHours(0, 0, 0, 0);

        const end = new Date(start);
        end.setDate(end.getDate() + 6);
        end.setHours(23, 59, 59, 999);

        if (!taskDate || taskDate < start || taskDate > end) {
          return false;
        }
      }

      if (filters.quickFilter === "completed" && task.status !== "completed") {
        return false;
      }

      if (filters.quickFilter === "pending" && task.status !== "pending") {
        return false;
      }

      if (filters.priority !== "all" && task.priority !== Number(filters.priority)) {
        return false;
      }

      if (filters.subject && (task.subject || "").toLowerCase() !== filters.subject.toLowerCase()) {
        return false;
      }

      return true;
    });
  }, [filters, selectedDate, tasksQuery.data]);

  const submitCreate = async (values: PlannerTaskFormValues, attachments: File[]) => {
    await mutations.createTask.mutateAsync({
      ...values,
      description: values.description || null,
      category: values.category || undefined,
      subject: values.subject || null,
      topic: values.topic || null,
      subtopic: values.subtopic || null,
      priority: Number(values.priority),
      estimated_minutes:
        values.estimated_minutes === undefined || values.estimated_minutes === ""
          ? null
          : Number(values.estimated_minutes),
      actual_minutes:
        values.actual_minutes === undefined || values.actual_minutes === ""
          ? 0
          : Number(values.actual_minutes),
      due_date: values.due_date ? new Date(`${values.due_date}T00:00:00`).toISOString() : null,
      reminder_time: values.reminder_time ? new Date(values.reminder_time).toISOString() : null,
      recurrence_rule: values.recurrence_rule || null,
      notes: values.notes || null,
      status: values.status,
      attachments,
    });
    setCreateOpen(false);
  };

  const submitEdit = async (values: PlannerTaskFormValues, attachments: File[]) => {
    if (!selectedTask) {
      return;
    }

    await mutations.updateTask.mutateAsync({
      taskId: selectedTask.id,
      input: {
        title: values.title,
        description: values.description || null,
        category: values.category || undefined,
        subject: values.subject || null,
        topic: values.topic || null,
        subtopic: values.subtopic || null,
        priority: Number(values.priority),
        estimated_minutes:
          values.estimated_minutes === undefined || values.estimated_minutes === ""
            ? null
            : Number(values.estimated_minutes),
        actual_minutes:
          values.actual_minutes === undefined || values.actual_minutes === ""
            ? 0
            : Number(values.actual_minutes),
        due_date: values.due_date ? new Date(`${values.due_date}T00:00:00`).toISOString() : null,
        reminder_time: values.reminder_time ? new Date(values.reminder_time).toISOString() : null,
        recurrence_rule: values.recurrence_rule || null,
        notes: values.notes || null,
        status: values.status,
        attachments,
      },
    });

    setEditOpen(false);
  };

  const startSession = async () => {
    if (!selectedTask) {
      return;
    }

    const session = await mutations.startStudySession.mutateAsync(selectedTask.id);
    setSessionId(session.id);
    setSelectedTask({ ...selectedTask, status: "in_progress" });
  };

  const finishSession = async () => {
    if (!sessionId) {
      return;
    }

    await mutations.finishStudySession.mutateAsync(sessionId);
    setSessionId(null);
  };

  return (
    <section className="grid gap-4 lg:grid-cols-[280px_1fr]">
      <aside className="space-y-4 rounded-xl border bg-card p-4">
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            Calendar Sidebar
          </h2>
          <Input
            type="date"
            value={selectedDate}
            onChange={(event) => setSelectedDate(event.target.value)}
            className="mt-3"
          />
        </div>

        <div>
          <label className="text-xs text-muted-foreground">View</label>
          <div className="mt-2 grid grid-cols-3 gap-2">
            {(["daily", "weekly", "monthly"] as const).map((view) => (
              <Button
                key={view}
                variant={currentView === view ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrentView(view)}
              >
                {view}
              </Button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs text-muted-foreground">Quick Filters</label>
          <select
            value={filters.quickFilter}
            onChange={(event) => setFilters({ quickFilter: event.target.value as typeof filters.quickFilter })}
            className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
          >
            <option value="all">All</option>
            <option value="today">Today</option>
            <option value="tomorrow">Tomorrow</option>
            <option value="this_week">This Week</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
          </select>

          <select
            value={filters.priority}
            onChange={(event) => setFilters({ priority: event.target.value as typeof filters.priority })}
            className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
          >
            <option value="all">All Priorities</option>
            <option value="1">Priority 1</option>
            <option value="2">Priority 2</option>
            <option value="3">Priority 3</option>
            <option value="4">Priority 4</option>
            <option value="5">Priority 5</option>
          </select>

          <Input
            placeholder="Filter by subject"
            value={filters.subject}
            onChange={(event) => setFilters({ subject: event.target.value })}
          />
        </div>
      </aside>

      <div className="rounded-xl border bg-card p-4">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-xl font-semibold">Planner Dashboard</h1>
            <p className="text-sm text-muted-foreground">Daily, weekly, and monthly planning with real task data.</p>
          </div>
          <div className="flex items-center gap-2">
            {sessionId ? (
              <Button variant="secondary" onClick={finishSession}>
                End Study Session
              </Button>
            ) : null}
            <Button onClick={() => setCreateOpen(true)}>
              <Plus className="mr-2 h-4 w-4" /> Create Task
            </Button>
          </div>
        </div>

        {tasksQuery.isLoading ? (
          <div className="flex min-h-[360px] items-center justify-center rounded-lg border border-dashed">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" /> Loading planner tasks...
            </div>
          </div>
        ) : null}

        {tasksQuery.isError ? (
          <div className="flex min-h-[360px] items-center justify-center rounded-lg border border-dashed">
            <div className="flex items-center gap-2 text-sm text-destructive">
              <AlertTriangle className="h-4 w-4" />
              {(tasksQuery.error as Error).message || "Unable to load tasks."}
            </div>
          </div>
        ) : null}

        {!tasksQuery.isLoading && !tasksQuery.isError ? (
          filteredTasks.length === 0 ? (
            <div className="flex min-h-[360px] flex-col items-center justify-center rounded-lg border border-dashed text-center">
              <Calendar className="h-6 w-6 text-muted-foreground" />
              <p className="mt-2 text-sm text-muted-foreground">No tasks found for the selected filters.</p>
              <Button className="mt-3" variant="outline" onClick={() => setCreateOpen(true)}>
                Add your first planner task
              </Button>
            </div>
          ) : (
            <motion.ul
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: { opacity: 1, transition: { staggerChildren: 0.04 } },
              }}
              className="space-y-2"
            >
              {filteredTasks.map((task) => (
                <motion.li
                  key={task.id}
                  variants={{ hidden: { opacity: 0, y: 6 }, visible: { opacity: 1, y: 0 } }}
                  className="group rounded-lg border p-3 transition hover:border-primary/50"
                >
                  <button
                    type="button"
                    onClick={() => setSelectedTask(task)}
                    className="flex w-full items-center justify-between text-left"
                  >
                    <div>
                      <p className="font-medium">{task.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {task.subject || "No subject"} • Priority {task.priority} • {task.status}
                      </p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground" />
                  </button>
                </motion.li>
              ))}
            </motion.ul>
          )
        ) : null}
      </div>

      <AnimatePresence>
        {selectedTask ? (
          <motion.div
            initial={{ opacity: 0, x: 36 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 36 }}
            transition={{ duration: 0.2 }}
          >
            <TaskDetailDrawer
              task={{ ...selectedTask, notes: stripCategoryFromNotes(selectedTask.notes) }}
              onClose={() => setSelectedTask(null)}
              onEdit={() => setEditOpen(true)}
              onDelete={() => setDeleteOpen(true)}
              onComplete={async () => {
                await mutations.completeTask.mutateAsync(selectedTask.id);
                setSelectedTask({ ...selectedTask, status: "completed" });
              }}
              onDuplicate={async () => {
                await mutations.duplicateTask.mutateAsync(selectedTask.id);
              }}
              onStartSession={startSession}
              busy={
                mutations.completeTask.isPending ||
                mutations.duplicateTask.isPending ||
                mutations.startStudySession.isPending
              }
            />
          </motion.div>
        ) : null}
      </AnimatePresence>

      <TaskFormDialog
        open={createOpen}
        mode="create"
        selectedDate={selectedDate}
        onOpenChange={setCreateOpen}
        onSubmit={submitCreate}
        submitting={mutations.createTask.isPending}
      />

      <TaskFormDialog
        open={editOpen}
        mode="edit"
        task={selectedTask}
        selectedDate={selectedDate}
        onOpenChange={setEditOpen}
        onSubmit={submitEdit}
        submitting={mutations.updateTask.isPending}
      />

      <DeleteTaskDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        loading={mutations.deleteTask.isPending}
        onConfirm={async () => {
          if (!selectedTask) {
            return;
          }

          await mutations.deleteTask.mutateAsync(selectedTask.id);
          setDeleteOpen(false);
          setSelectedTask(null);
        }}
      />
    </section>
  );
}

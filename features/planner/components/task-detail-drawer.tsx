"use client";

import { CalendarDays, Clock3, CopyPlus, Play, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { PlannerTask } from "@/features/planner/types";

interface TaskDetailDrawerProps {
  task: PlannerTask | null;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onComplete: () => Promise<void>;
  onDuplicate: () => Promise<void>;
  onStartSession: () => Promise<void>;
  busy: boolean;
}

const statusColor: Record<string, string> = {
  pending: "text-amber-500",
  in_progress: "text-blue-500",
  completed: "text-emerald-500",
  skipped: "text-rose-500",
};

export function TaskDetailDrawer({
  task,
  onClose,
  onEdit,
  onDelete,
  onComplete,
  onDuplicate,
  onStartSession,
  busy,
}: TaskDetailDrawerProps) {
  if (!task) {
    return null;
  }

  return (
    <aside className="fixed inset-y-0 right-0 z-40 w-full max-w-md border-l bg-card p-5 shadow-card">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold">{task.title}</h3>
          <p className={`text-sm capitalize ${statusColor[task.status] || "text-muted-foreground"}`}>
            {task.status.replace("_", " ")}
          </p>
        </div>
        <Button variant="ghost" onClick={onClose}>
          Close
        </Button>
      </div>

      <div className="mt-5 space-y-3 text-sm">
        <p>{task.description || "No description provided."}</p>

        <div className="grid grid-cols-2 gap-3 rounded-lg border p-3">
          <div>
            <p className="text-xs text-muted-foreground">Priority</p>
            <p className="font-medium">{task.priority}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Category</p>
            <p className="font-medium">{task.category || "-"}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Subject</p>
            <p className="font-medium">{task.subject || "-"}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Topic</p>
            <p className="font-medium">{task.topic || "-"}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-muted-foreground">
          <CalendarDays className="h-4 w-4" />
          <span>{task.due_date ? new Date(task.due_date).toLocaleString() : "No due date"}</span>
        </div>

        <div className="flex items-center gap-2 text-muted-foreground">
          <Clock3 className="h-4 w-4" />
          <span>
            Est: {task.estimated_minutes ?? 0}m | Actual: {task.actual_minutes ?? 0}m
          </span>
        </div>

        <div>
          <p className="text-xs text-muted-foreground">Notes</p>
          <p className="whitespace-pre-wrap">{task.notes || "No notes added."}</p>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-2">
        <Button onClick={onEdit} variant="outline" disabled={busy}>
          Edit
        </Button>
        <Button onClick={onDelete} variant="destructive" disabled={busy}>
          <Trash2 className="mr-2 h-4 w-4" /> Delete
        </Button>
        <Button onClick={onComplete} variant="secondary" disabled={busy || task.status === "completed"}>
          Mark Complete
        </Button>
        <Button onClick={onDuplicate} variant="outline" disabled={busy}>
          <CopyPlus className="mr-2 h-4 w-4" /> Duplicate
        </Button>
        <Button className="col-span-2" onClick={onStartSession} disabled={busy}>
          <Play className="mr-2 h-4 w-4" /> Start Study Session
        </Button>
      </div>
    </aside>
  );
}

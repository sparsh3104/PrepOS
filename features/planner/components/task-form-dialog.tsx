"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { plannerTaskSchema, type PlannerTaskFormValues } from "@/features/planner/schemas";
import type { PlannerTask } from "@/features/planner/types";

interface TaskFormDialogProps {
  open: boolean;
  mode: "create" | "edit";
  task?: PlannerTask | null;
  selectedDate: string;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: PlannerTaskFormValues, attachments: File[]) => Promise<void>;
  submitting: boolean;
}

function isoToLocalDateTimeValue(value: string | null | undefined) {
  if (!value) {
    return "";
  }

  const date = new Date(value);
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 16);
}

function toDateOnly(value: string | null | undefined) {
  if (!value) {
    return "";
  }

  return new Date(value).toISOString().slice(0, 10);
}

export function TaskFormDialog({
  open,
  mode,
  task,
  selectedDate,
  onOpenChange,
  onSubmit,
  submitting,
}: TaskFormDialogProps) {
  const defaultValues = useMemo<PlannerTaskFormValues>(
    () => ({
      title: task?.title ?? "",
      description: task?.description ?? "",
      category: task?.category ?? "",
      subject: task?.subject ?? "",
      topic: task?.topic ?? "",
      subtopic: task?.subtopic ?? "",
      priority: task?.priority ?? 3,
      estimated_minutes: task?.estimated_minutes ?? 0,
      actual_minutes: task?.actual_minutes ?? 0,
      due_date: toDateOnly(task?.due_date) || selectedDate,
      reminder_time: isoToLocalDateTimeValue(task?.reminder_time),
      recurrence_rule: task?.recurrence_rule ?? "",
      notes: task?.notes ?? "",
      status: task?.status ?? "pending",
    }),
    [selectedDate, task],
  );

  const form = useForm<PlannerTaskFormValues>({
    resolver: zodResolver(plannerTaskSchema),
    defaultValues,
    values: defaultValues,
  });

  const submit = form.handleSubmit(async (values) => {
    const files = Array.from((document.getElementById("task_attachments") as HTMLInputElement | null)?.files || []);
    await onSubmit(values, files);
    form.reset(defaultValues);
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{mode === "create" ? "Create Task" : "Edit Task"}</DialogTitle>
          <DialogDescription>
            Add task details including durations, reminder, recurrence, and attachments.
          </DialogDescription>
        </DialogHeader>

        <form className="grid gap-4" onSubmit={submit}>
          <div className="grid gap-2">
            <Label htmlFor="task_title">Title</Label>
            <Input id="task_title" {...form.register("title")} />
            {form.formState.errors.title ? (
              <p className="text-xs text-destructive">{form.formState.errors.title.message}</p>
            ) : null}
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="task_category">Category</Label>
              <Input id="task_category" placeholder="Practice / Revision" {...form.register("category")} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="task_subject">Subject</Label>
              <Input id="task_subject" placeholder="Quant / LRDI / VARC" {...form.register("subject")} />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="task_topic">Topic</Label>
              <Input id="task_topic" {...form.register("topic")} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="task_subtopic">Subtopic</Label>
              <Input id="task_subtopic" {...form.register("subtopic")} />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="grid gap-2">
              <Label htmlFor="task_priority">Priority</Label>
              <select
                id="task_priority"
                className="h-10 rounded-md border border-input bg-background px-3 text-sm"
                {...form.register("priority")}
              >
                <option value={1}>1 - High</option>
                <option value={2}>2</option>
                <option value={3}>3</option>
                <option value={4}>4</option>
                <option value={5}>5 - Low</option>
              </select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="task_estimated">Estimated (mins)</Label>
              <Input id="task_estimated" type="number" min={0} {...form.register("estimated_minutes")} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="task_actual">Actual (mins)</Label>
              <Input id="task_actual" type="number" min={0} {...form.register("actual_minutes")} />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="task_due_date">Due Date</Label>
              <Input id="task_due_date" type="date" {...form.register("due_date")} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="task_reminder">Reminder</Label>
              <Input id="task_reminder" type="datetime-local" {...form.register("reminder_time")} />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="task_recurrence">Recurring Rule</Label>
              <Input id="task_recurrence" placeholder="FREQ=DAILY;INTERVAL=1" {...form.register("recurrence_rule")} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="task_status">Status</Label>
              <select
                id="task_status"
                className="h-10 rounded-md border border-input bg-background px-3 text-sm"
                {...form.register("status")}
              >
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="skipped">Skipped</option>
              </select>
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="task_description">Description</Label>
            <Textarea id="task_description" rows={3} {...form.register("description")} />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="task_notes">Notes</Label>
            <Textarea id="task_notes" rows={4} {...form.register("notes")} />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="task_attachments">Attachments</Label>
            <Input id="task_attachments" type="file" multiple accept=".png,.jpg,.jpeg,.pdf,.txt,.md" />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? "Saving..." : mode === "create" ? "Create Task" : "Update Task"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

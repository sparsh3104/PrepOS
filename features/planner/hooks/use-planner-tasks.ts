"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import type { PlannerView } from "@/features/planner/types";
import {
  completeTask,
  createTask,
  deleteTask,
  duplicateTask,
  finishStudySession,
  getDailyTasks,
  getMonthlyTasks,
  getWeeklyTasks,
  moveTask,
  startStudySession,
  updateTask,
} from "@/services/planner.service";

function plannerQueryKey(selectedDate: string, view: PlannerView) {
  return ["planner", selectedDate, view] as const;
}

export function usePlannerTasks(selectedDate: string, view: PlannerView) {
  return useQuery({
    queryKey: plannerQueryKey(selectedDate, view),
    queryFn: async () => {
      if (view === "daily") {
        return getDailyTasks(selectedDate);
      }

      if (view === "weekly") {
        return getWeeklyTasks(selectedDate);
      }

      return getMonthlyTasks(selectedDate);
    },
  });
}

export function usePlannerMutations(selectedDate: string, view: PlannerView) {
  const queryClient = useQueryClient();
  const invalidate = () => queryClient.invalidateQueries({ queryKey: plannerQueryKey(selectedDate, view) });

  return {
    createTask: useMutation({ mutationFn: createTask, onSuccess: invalidate }),
    updateTask: useMutation({
      mutationFn: ({ taskId, input }: { taskId: string; input: Parameters<typeof updateTask>[1] }) =>
        updateTask(taskId, input),
      onSuccess: invalidate,
    }),
    deleteTask: useMutation({ mutationFn: deleteTask, onSuccess: invalidate }),
    completeTask: useMutation({ mutationFn: completeTask, onSuccess: invalidate }),
    moveTask: useMutation({
      mutationFn: ({ taskId, dueDate }: { taskId: string; dueDate: string }) => moveTask(taskId, dueDate),
      onSuccess: invalidate,
    }),
    duplicateTask: useMutation({ mutationFn: duplicateTask, onSuccess: invalidate }),
    startStudySession: useMutation({ mutationFn: startStudySession }),
    finishStudySession: useMutation({ mutationFn: finishStudySession }),
  };
}

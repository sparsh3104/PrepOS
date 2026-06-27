import { create } from "zustand";

import type { PlannerFilters, PlannerTask, PlannerView } from "@/features/planner/types";

interface PlannerStoreState {
  selectedDate: string;
  currentView: PlannerView;
  selectedTask: PlannerTask | null;
  filters: PlannerFilters;
  loading: boolean;
  setSelectedDate: (date: string) => void;
  setCurrentView: (view: PlannerView) => void;
  setSelectedTask: (task: PlannerTask | null) => void;
  setFilters: (filters: Partial<PlannerFilters>) => void;
  setLoading: (loading: boolean) => void;
}

export const usePlannerStore = create<PlannerStoreState>((set) => ({
  selectedDate: new Date().toISOString().slice(0, 10),
  currentView: "daily",
  selectedTask: null,
  filters: {
    quickFilter: "all",
    priority: "all",
    subject: "",
  },
  loading: false,
  setSelectedDate: (selectedDate) => set({ selectedDate }),
  setCurrentView: (currentView) => set({ currentView }),
  setSelectedTask: (selectedTask) => set({ selectedTask }),
  setFilters: (incoming) => set((state) => ({ filters: { ...state.filters, ...incoming } })),
  setLoading: (loading) => set({ loading }),
}));

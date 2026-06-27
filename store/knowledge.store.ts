import { create } from "zustand";

import type { KnowledgeFilters, KnowledgeNote, KnowledgeSort, KnowledgeViewMode } from "@/features/knowledge-base/types";

interface KnowledgeStoreState {
  currentFolder: string;
  selectedNote: KnowledgeNote | null;
  filters: KnowledgeFilters;
  search: string;
  sort: KnowledgeSort;
  viewMode: KnowledgeViewMode;
  loading: boolean;
  setCurrentFolder: (folder: string) => void;
  setSelectedNote: (note: KnowledgeNote | null) => void;
  setFilters: (filters: Partial<KnowledgeFilters>) => void;
  setSearch: (search: string) => void;
  setSort: (sort: KnowledgeSort) => void;
  setViewMode: (viewMode: KnowledgeViewMode) => void;
  setLoading: (loading: boolean) => void;
}

export const useKnowledgeStore = create<KnowledgeStoreState>((set) => ({
  currentFolder: "",
  selectedNote: null,
  filters: {
    archived: false,
    bookmarkedOnly: false,
    favoriteOnly: false,
    subject: "",
    topic: "",
    subtopic: "",
    tag: "",
    formulaOnly: false,
  },
  search: "",
  sort: "updated_desc",
  viewMode: "split",
  loading: false,
  setCurrentFolder: (currentFolder) => set({ currentFolder }),
  setSelectedNote: (selectedNote) => set({ selectedNote }),
  setFilters: (incoming) => set((state) => ({ filters: { ...state.filters, ...incoming } })),
  setSearch: (search) => set({ search }),
  setSort: (sort) => set({ sort }),
  setViewMode: (viewMode) => set({ viewMode }),
  setLoading: (loading) => set({ loading }),
}));

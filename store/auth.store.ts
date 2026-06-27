import { create } from "zustand";

interface AuthState {
  userId: string | null;
  isAuthenticated: boolean;
  setUser: (userId: string | null) => void;
  clearUser: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  userId: null,
  isAuthenticated: false,
  setUser: (userId) => set({ userId, isAuthenticated: Boolean(userId) }),
  clearUser: () => set({ userId: null, isAuthenticated: false }),
}));

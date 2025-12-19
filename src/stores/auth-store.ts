import { create } from "zustand";
import type { AuthState } from "@/lib/types";

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  setAccessToken: (token) => set({ accessToken: token }),
  clearAuth: () => set({ accessToken: null, authCheckPromise: null }),
  authCheckPromise: null,
  setAuthCheckPromise: (promise) => set({ authCheckPromise: promise }),
}));

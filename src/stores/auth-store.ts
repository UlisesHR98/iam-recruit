import { create } from "zustand";
import type { AuthState } from "@/lib/types";

const IS_NEW_ACCOUNT_KEY = "iam-recruit-is-new-account";

const getInitialIsNewAccount = (): boolean => {
  if (typeof window === "undefined") return false;
  const stored = sessionStorage.getItem(IS_NEW_ACCOUNT_KEY);
  return stored === "true";
};

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  isNewAccount: getInitialIsNewAccount(),
  setAccessToken: (token) => set({ accessToken: token }),
  setIsNewAccount: (isNew) => {
    if (typeof window !== "undefined") {
      if (isNew) {
        sessionStorage.setItem(IS_NEW_ACCOUNT_KEY, "true");
      } else {
        sessionStorage.removeItem(IS_NEW_ACCOUNT_KEY);
      }
    }
    set({ isNewAccount: isNew });
  },
  clearAuth: () => {
    if (typeof window !== "undefined") {
      sessionStorage.removeItem(IS_NEW_ACCOUNT_KEY);
    }
    set({ accessToken: null, isNewAccount: false, authCheckPromise: null });
  },
  authCheckPromise: null,
  setAuthCheckPromise: (promise) => set({ authCheckPromise: promise }),
}));

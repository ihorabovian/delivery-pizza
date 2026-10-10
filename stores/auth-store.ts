import { create } from "zustand";
import { persist } from "zustand/middleware";
import { signOut as signOutRequest } from "@/lib/api";
import { persistStorage } from "@/stores/storage";
import type { AuthUser } from "@/types/auth";

type AuthState = {
  token: string | null;
  user: AuthUser | null;
  setSession: (token: string, user: AuthUser) => void;
  signOut: () => Promise<void>;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      user: null,

      setSession: (token, user) => set({ token, user }),

      signOut: async () => {
        const { token } = get();
        set({ token: null, user: null });
        // Clear locally first: a failed request must not keep the user signed in
        if (token) await signOutRequest(token).catch(() => {});
      },
    }),
    {
      name: "auth",
      storage: persistStorage,
      partialize: ({ token, user }) => ({ token, user }),
      skipHydration: true,
    },
  ),
);

// Profile editing, log out and saved cards are available only when signed in
export const selectIsAuthenticated = (state: AuthState) => state.token !== null;

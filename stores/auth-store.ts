import { create } from "zustand";

type AuthState = {
  isAuthenticated: boolean;
  signOut: () => void;
};

// No sign-in yet, so this stays false: profile editing, log out and saved
// cards are disabled until auth sets it to true
export const useAuthStore = create<AuthState>()((set) => ({
  isAuthenticated: false,
  signOut: () => set({ isAuthenticated: false }),
}));

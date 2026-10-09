import { create } from "zustand";
import { persist } from "zustand/middleware";
import { persistStorage } from "@/stores/storage";

// Same fields as the backend profile, so a signed-in user can fill this store later
export type UserProfile = {
  name: string;
  phone: string;
  email: string;
};

type UserState = UserProfile & {
  updateProfile: (profile: UserProfile) => void;
  setPhone: (phone: string) => void;
  resetProfile: () => void;
};

const EMPTY_PROFILE: UserProfile = { name: "", phone: "", email: "" };

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      ...EMPTY_PROFILE,
      updateProfile: (profile) => set(profile),
      setPhone: (phone) => set({ phone }),
      resetProfile: () => set(EMPTY_PROFILE),
    }),
    {
      name: "user",
      storage: persistStorage,
      partialize: ({ name, phone, email }) => ({ name, phone, email }),
      skipHydration: true,
    },
  ),
);

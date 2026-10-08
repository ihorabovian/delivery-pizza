import { createJSONStorage } from "zustand/middleware";

// No localStorage on the server. Without a storage, persist() doesn't attach
// `store.persist`, which useHydrated and StoreRehydrate rely on.
const noopStorage = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {},
};

export const persistStorage = createJSONStorage(() =>
  typeof window !== "undefined" ? localStorage : noopStorage,
);

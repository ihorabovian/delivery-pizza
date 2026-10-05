import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type AddressState = {
  address: string;
  setAddress: (address: string) => void;
};

const noopStorage = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {},
};

export const useAddressStore = create<AddressState>()(
  persist(
    (set) => ({
      address: "",
      setAddress: (address) => set({ address }),
    }),
    {
      name: "address",
      storage: createJSONStorage(() =>
        typeof window !== "undefined" ? localStorage : noopStorage,
      ),
      skipHydration: true,
    },
  ),
);

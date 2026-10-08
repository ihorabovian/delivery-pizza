import { create } from "zustand";
import { persist } from "zustand/middleware";
import { persistStorage } from "@/stores/storage";

type AddressState = {
  address: string;
  setAddress: (address: string) => void;
};

export const useAddressStore = create<AddressState>()(
  persist(
    (set) => ({
      address: "",
      setAddress: (address) => set({ address }),
    }),
    {
      name: "address",
      storage: persistStorage,
      skipHydration: true,
    },
  ),
);

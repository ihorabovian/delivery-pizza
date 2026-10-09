import { create } from "zustand";
import { persist } from "zustand/middleware";
import { persistStorage } from "@/stores/storage";

export type SelectedAddress = {
  address: string;
  street: string;
  house: string;
};

type AddressState = SelectedAddress & {
  setAddress: (selected: SelectedAddress) => void;
};

export const useAddressStore = create<AddressState>()(
  persist(
    (set) => ({
      address: "",
      street: "",
      house: "",
      setAddress: (selected) => set(selected),
    }),
    {
      name: "address",
      storage: persistStorage,
      skipHydration: true,
    },
  ),
);

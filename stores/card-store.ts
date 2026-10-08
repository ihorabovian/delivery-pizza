import { create } from "zustand";
import { persist } from "zustand/middleware";
import { persistStorage } from "@/stores/storage";

// Only the last 4 digits are kept, never the full card number
export type SavedCard = {
  id: string;
  last4: string;
};

type CardState = {
  cards: SavedCard[];
  addCard: (last4: string) => void;
  removeCard: (id: string) => void;
};

export const useCardStore = create<CardState>()(
  persist(
    (set) => ({
      cards: [],

      addCard: (last4) =>
        set((state) =>
          state.cards.some((card) => card.last4 === last4)
            ? state
            : { cards: [...state.cards, { id: crypto.randomUUID(), last4 }] },
        ),

      removeCard: (id) =>
        set((state) => ({ cards: state.cards.filter((card) => card.id !== id) })),
    }),
    {
      name: "cards",
      storage: persistStorage,
      skipHydration: true,
    },
  ),
);

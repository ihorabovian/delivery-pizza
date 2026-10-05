import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { CartItem } from "@/types/cart";

export type Order = {
  number: string;
  items: CartItem[];
  total: number;
  address: string;
  createdAt: string;
  // Orders saved before cancelling existed have no status; they count as active
  status?: "active" | "cancelled";
};

type OrderState = {
  orders: Order[];
  addOrder: (order: Order) => void;
  cancelOrder: (number: string) => void;
};

export const isActiveOrder = (order: Order) => order.status !== "cancelled";

const noopStorage = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {},
};

export const useOrderStore = create<OrderState>()(
  persist(
    (set) => ({
      orders: [],
      addOrder: (order) =>
        set((state) => ({ orders: [order, ...state.orders] })),

      cancelOrder: (number) =>
        set((state) => ({
          orders: state.orders.map((order) =>
            order.number === number
              ? { ...order, status: "cancelled" as const }
              : order,
          ),
        })),
    }),
    {
      name: "orders",
      storage: createJSONStorage(() =>
        typeof window !== "undefined" ? localStorage : noopStorage,
      ),
      skipHydration: true,
    },
  ),
);

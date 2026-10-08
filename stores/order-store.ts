import { create } from "zustand";
import { persist } from "zustand/middleware";
import { persistStorage } from "@/stores/storage";
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

// No real delivery tracking yet: an order counts as active for an hour
// after it was placed, then moves to history
const ACTIVE_ORDER_MS = 60 * 60 * 1000;

export const isActiveOrder = (order: Order) =>
  order.status !== "cancelled" &&
  Date.now() - Date.parse(order.createdAt) < ACTIVE_ORDER_MS;

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
      storage: persistStorage,
      skipHydration: true,
    },
  ),
);

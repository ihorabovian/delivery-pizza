import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { useCatalog } from "@/components/catalog-context";
import { cancelPizzaOrder, fetchPizzaOrders } from "@/lib/api";
import { toOrder } from "@/lib/orders";
import { useAuthStore } from "@/stores/auth-store";
import { useOrderStore } from "@/stores/order-store";
import { useHydrated } from "@/stores/use-hydrated";
import type { PizzaOrder } from "@/types/cart";

// Signed-in users get their orders from the backend; guests keep them locally
export function useOrders() {
  const catalog = useCatalog();
  const authHydrated = useHydrated(useAuthStore.persist);
  const localHydrated = useHydrated(useOrderStore.persist);
  const token = useAuthStore((state) => state.token);
  const localOrders = useOrderStore((state) => state.orders);
  const cancelLocalOrder = useOrderStore((state) => state.cancelOrder);
  // Tagged with the token so a previous account's orders are never shown
  const [remote, setRemote] = useState<{
    token: string;
    orders: PizzaOrder[];
  } | null>(null);

  useEffect(() => {
    if (!token) return;

    let cancelled = false;
    fetchPizzaOrders(token)
      .catch((error: Error) => {
        toast.error(error.message);
        return [];
      })
      .then((orders) => {
        if (!cancelled) setRemote({ token, orders });
      });

    return () => {
      cancelled = true;
    };
  }, [token]);

  const remoteOrders = remote?.token === token ? remote.orders : null;

  const orders = useMemo(
    () =>
      token
        ? (remoteOrders ?? []).map((order) => toOrder(order, catalog))
        : localOrders,
    [token, remoteOrders, localOrders, catalog],
  );

  const ready = authHydrated && (token ? remoteOrders !== null : localHydrated);

  const cancelOrder = useCallback(
    async (number: string) => {
      if (!token) return cancelLocalOrder(number);

      try {
        const updated = await cancelPizzaOrder(token, number);
        setRemote((prev) =>
          prev?.token === token
            ? {
                token,
                orders: prev.orders.map((order) =>
                  order._id === updated._id ? updated : order,
                ),
              }
            : prev,
        );
      } catch (error) {
        toast.error((error as Error).message);
      }
    },
    [token, cancelLocalOrder],
  );

  return { orders, ready, cancelOrder };
}

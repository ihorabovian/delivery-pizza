"use client";

import { useEffect } from "react";
import { useAddressStore } from "@/stores/address-store";
import { useCartStore } from "@/stores/cart-store";
import { useOrderStore } from "@/stores/order-store";

// Stores use skipHydration so server HTML and the first client render match;
// restore persisted state after mount instead.
export function StoreRehydrate() {
  useEffect(() => {
    useCartStore.persist.rehydrate();
    useAddressStore.persist.rehydrate();
    useOrderStore.persist.rehydrate();
  }, []);

  return null;
}

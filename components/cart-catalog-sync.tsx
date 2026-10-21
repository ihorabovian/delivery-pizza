"use client";

import { useEffect } from "react";
import { useCatalog } from "@/components/catalog-context";
import { useCartStore } from "@/stores/cart-store";
import { useHydrated } from "@/stores/use-hydrated";

// The persisted cart can outlive the catalog: when the backend reseeds,
// product ids change and /pizzas/calculate fails with "Product … not found"
export function CartCatalogSync() {
  const catalog = useCatalog();
  const hydrated = useHydrated(useCartStore.persist);

  useEffect(() => {
    // An empty catalog means the fetch failed, not that every product is gone
    if (!hydrated || catalog.length === 0) return;

    useCartStore
      .getState()
      .removeMissingItems(new Set(catalog.map((pizza) => pizza._id)));
  }, [hydrated, catalog]);

  return null;
}

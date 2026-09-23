"use client";

import { createContext, useContext, ReactNode } from "react";
import type { Pizza } from "@/types/pizza";

const CatalogContext = createContext<Pizza[] | null>(null);

export function CatalogProvider({
  catalog,
  children,
}: {
  catalog: Pizza[];
  children: ReactNode;
}) {
  return (
    <CatalogContext.Provider value={catalog}>
      {children}
    </CatalogContext.Provider>
  );
}

export function useCatalog() {
  const context = useContext(CatalogContext);
  if (!context) throw new Error("useCatalog must be used within CatalogProvider");
  return context;
}

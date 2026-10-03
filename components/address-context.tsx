"use client";

import { createContext, useContext, useState, ReactNode } from "react";

const AddressContext = createContext<{
  address: string;
  setAddress: (address: string) => void;
} | null>(null);

export function AddressProvider({ children }: { children: ReactNode }) {
  const [address, setAddress] = useState("");

  return (
    <AddressContext.Provider value={{ address, setAddress }}>
      {children}
    </AddressContext.Provider>
  );
}

export function useAddress() {
  const context = useContext(AddressContext);
  if (!context)
    throw new Error("useAddress must be used within AddressProvider");
  return context;
}

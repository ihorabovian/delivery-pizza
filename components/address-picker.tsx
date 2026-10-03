"use client";

import { AddressSelect } from "@/components/address-select";
import { useAddress } from "@/components/address-context";
import { cn } from "@/lib/utils";

export function AddressPicker({ className }: { className?: string }) {
  const { address, setAddress } = useAddress();

  return (
    <div className={cn("w-48", className)}>
      <AddressSelect value={address} onChange={setAddress} />
    </div>
  );
}

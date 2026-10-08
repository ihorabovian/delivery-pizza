"use client";

import { AddressSelect } from "@/components/address-select";
import { useAddressStore } from "@/stores/address-store";
import { cn } from "@/lib/utils";

export function AddressPicker({ className }: { className?: string }) {
  const { address, setAddress } = useAddressStore();

  return (
    <div className={cn("w-48", className)}>
      <AddressSelect value={address} onChange={setAddress} />
    </div>
  );
}

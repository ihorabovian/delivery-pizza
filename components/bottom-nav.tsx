"use client";

import { History, Pizza, User } from "lucide-react";
import { useCart } from "@/components/cart-context";
import { CartSheet } from "@/components/cart-sheet";

const NAV_ITEMS = [
  { label: "Home", icon: Pizza, active: true },
  { label: "Orders", icon: History, active: false },
  { label: "Profile", icon: User, active: false },
];

export function BottomNav() {
  const { itemCount } = useCart();

  return (
    <div className="fixed inset-x-4 bottom-4 z-40 flex flex-col items-end gap-3 sm:hidden">
      {itemCount > 0 && (
        <CartSheet triggerClassName="h-13 px-6 shadow-lg" />
      )}

      <nav className="flex w-full rounded-full bg-neutral-50 p-1 shadow-lg">
        {NAV_ITEMS.map(({ label, icon: Icon, active }) => (
          <button
            key={label}
            type="button"
            className={
              active
                ? "flex flex-1 flex-col items-center gap-0.5 rounded-full bg-orange-50 py-2 text-[#f14e1d]"
                : "flex flex-1 flex-col items-center gap-0.5 rounded-full py-2 text-neutral-400"
            }
          >
            <Icon className="size-6" />
            <span className="text-xs">{label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}

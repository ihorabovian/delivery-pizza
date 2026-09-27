"use client";

import { History, Pizza, ShoppingBasket, User } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { useCart } from "@/components/cart-context";

const NAV_ITEMS = [
  { label: "Home", icon: Pizza, active: true },
  { label: "Orders", icon: History, active: false },
  { label: "Profile", icon: User, active: false },
];

export function BottomNav() {
  const { itemCount, totalPrice } = useCart();

  return (
    <div className="fixed inset-x-4 bottom-4 z-40 flex flex-col items-end gap-3 sm:hidden">
      {itemCount > 0 && (
        <button
          type="button"
          className="flex h-13 items-center gap-2 rounded-full bg-[#f14e1d] px-6 text-sm font-medium text-white shadow-lg"
        >
          <ShoppingBasket className="size-4" />
          {formatPrice(totalPrice)}
        </button>
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

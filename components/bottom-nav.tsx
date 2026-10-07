"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { History, Pizza, User } from "lucide-react";
import { CartSheet } from "@/components/cart-sheet";
import { selectItemCount, useCartStore } from "@/stores/cart-store";

const NAV_ITEMS = [
  { label: "Home", icon: Pizza, href: "/" },
  { label: "Orders", icon: History, href: "/orders" },
  { label: "Profile", icon: User, href: "/profile" },
];

const itemClassName = (active: boolean) =>
  active
    ? "flex flex-1 flex-col items-center gap-0.5 rounded-full bg-orange-50 py-2 text-[#f14e1d]"
    : "flex flex-1 flex-col items-center gap-0.5 rounded-full py-2 text-neutral-400";

export function BottomNav() {
  const itemCount = useCartStore(selectItemCount);
  const pathname = usePathname();

  return (
    <div className="fixed inset-x-4 bottom-4 z-40 flex flex-col items-end gap-3 sm:hidden">
      {itemCount > 0 && (
        <CartSheet triggerClassName="h-13 px-6 shadow-lg" />
      )}

      <nav className="flex w-full rounded-full bg-neutral-50 p-1 shadow-lg">
        {NAV_ITEMS.map(({ label, icon: Icon, href }) => (
          <Link
            key={label}
            href={href}
            className={itemClassName(pathname === href)}
          >
            <Icon className="size-6" />
            <span className="text-xs">{label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}

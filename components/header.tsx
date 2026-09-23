import Link from "next/link";
import { ChevronDown, Clock, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CartSheet } from "@/components/cart-sheet";
import { CategoryNav } from "@/components/category-nav";

export function SiteHeader() {
  return (
    <header className="border-b border-neutral-200 px-6 py-4 sm:px-10">
      <div className="flex items-center justify-between gap-6">
        <Link
          href="/"
          className="flex cursor-pointer items-center gap-2 text-lg font-bold tracking-tight"
        >
          <span aria-hidden>🍕</span>
          PIZZA
        </Link>

        <div className="flex items-center gap-4 text-sm text-neutral-600">
          <button
            type="button"
            className="hidden cursor-pointer items-center gap-1 hover:text-neutral-900 sm:flex"
          >
            Select delivery address
            <ChevronDown className="size-4" />
          </button>
          <button
            type="button"
            aria-label="Order history"
            className="cursor-pointer text-neutral-500 hover:text-neutral-900"
          >
            <Clock className="size-5" />
          </button>
          <button
            type="button"
            aria-label="Account"
            className="cursor-pointer text-neutral-500 hover:text-neutral-900"
          >
            <User className="size-5" />
          </button>
          <Button variant="secondary" className="rounded-full">
            Log in
          </Button>
        </div>
      </div>

      <div className="mt-6 flex items-center gap-4">
        <CategoryNav />
        <div className="ml-auto">
          <CartSheet />
        </div>
      </div>
    </header>
  );
}

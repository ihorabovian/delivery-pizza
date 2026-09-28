"use client";

import Link from "next/link";
import Image from "next/image";
import { ChevronDown, History, ShoppingBasket, User } from "lucide-react";
import pizzaIcon from "@/app/icon.png";
import avatarMascot from "@/public/avatar-mascot.png";
import { PIZZA_CATEGORIES, PIZZA_CATEGORY_LABELS } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import { useCart } from "@/components/cart-context";

export function SiteHeader() {
  const { totalPrice } = useCart();
  return (
    <header className="mx-auto w-full max-w-[1280px] px-4 py-4 sm:px-8 lg:px-10">
      {/* Mobile — compact address row + category chips */}
      <div className="sm:hidden">
        <div className="flex items-center justify-between gap-4">
          <button
            type="button"
            className="flex cursor-pointer items-center gap-2 text-sm text-foreground hover:text-foreground/80"
          >
            Select delivery address
            <ChevronDown className="size-4" />
          </button>
          <Image
            src={avatarMascot}
            alt=""
            className="size-8 shrink-0 rounded-full bg-orange-50"
            aria-hidden
          />
        </div>

        <nav className="mt-6 flex gap-2 overflow-x-auto">
          {PIZZA_CATEGORIES.map((category, index) => (
            <Button
              key={category}
              variant={index === 0 ? "default" : "outline"}
              className={
                index === 0
                  ? "h-8 shrink-0 rounded-full border-transparent bg-black px-3 text-xs font-bold text-white hover:bg-black/80"
                  : "h-8 shrink-0 rounded-full border-transparent bg-neutral-100 px-3 text-xs font-bold text-foreground hover:bg-neutral-200"
              }
              asChild
            >
              <a href={`/#${category}`}>{PIZZA_CATEGORY_LABELS[category]}</a>
            </Button>
          ))}
        </nav>
      </div>

      {/* Tablet/desktop */}
      <div className="hidden sm:block">
        <div className="flex items-center justify-between gap-4 rounded-full p-3">
          <Link
            href="/"
            className="flex cursor-pointer items-center gap-1 text-l font-extrabold uppercase tracking-tight text-foreground"
          >
            <Image src={pizzaIcon} alt="" className="size-6" aria-hidden />
            Pizza
          </Link>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-4">
              <button
                type="button"
                className="flex cursor-pointer items-center gap-2 text-sm font-medium text-foreground hover:text-foreground/80"
              >
                Select delivery address
                <ChevronDown className="size-4" />
              </button>
              <button
                type="button"
                aria-label="Order history"
                className="flex size-6 cursor-pointer items-center justify-center rounded-full bg-neutral-100 text-foreground hover:bg-neutral-200"
              >
                <History className="size-5" />
              </button>
              <button
                type="button"
                aria-label="Account"
                className="flex size-6 cursor-pointer items-center justify-center rounded-full bg-neutral-100 text-foreground hover:bg-neutral-200"
              >
                <User className="size-5" />
              </button>
            </div>
            <Button className="h-auto rounded-full bg-orange-50 px-5 py-2 text-base text-[#f14e1d] hover:bg-orange-100">
              Log in
            </Button>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between gap-4">
          <nav className="flex flex-wrap gap-2">
            {PIZZA_CATEGORIES.map((category, index) => (
              <Button
                key={category}
                variant={index === 0 ? "default" : "outline"}
                className={
                  index === 0
                    ? "h-12 rounded-full border-transparent bg-black px-6 text-base font-bold text-white hover:bg-black/80"
                    : "h-12 rounded-full border-transparent bg-neutral-100 px-6 text-base font-bold text-foreground hover:bg-neutral-200"
                }
                asChild
              >
                <a href={`/#${category}`}>{PIZZA_CATEGORY_LABELS[category]}</a>
              </Button>
            ))}
          </nav>

          <Button className="h-12 gap-2 rounded-full bg-[#f14e1d] px-7 text-base font-medium text-white hover:bg-[#f14e1d]/90">
            <ShoppingBasket className="size-5" />
            {formatPrice(totalPrice)}
          </Button>
        </div>
      </div>
    </header>
  );
}

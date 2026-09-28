"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronDown, History, ShoppingBasket, User } from "lucide-react";
import pizzaIcon from "@/app/icon.png";
import avatarMascot from "@/public/avatar-mascot.png";
import { PIZZA_CATEGORIES, PIZZA_CATEGORY_LABELS } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import { useCart } from "@/components/cart-context";
import type { PizzaCategory } from "@/types/pizza";

export function SiteHeader() {
  const { totalPrice } = useCart();
  const headerRef = useRef<HTMLElement>(null);
  const [headerHeight, setHeaderHeight] = useState(140);
  const [activeCategory, setActiveCategory] = useState<PizzaCategory>(
    PIZZA_CATEGORIES[0],
  );
  const isClickScrollingRef = useRef(false);
  const clickScrollTimeoutRef = useRef<ReturnType<typeof setTimeout>>(null);

  const scrollToCategory = (category: PizzaCategory) => {
    isClickScrollingRef.current = true;
    setActiveCategory(category);

    if (clickScrollTimeoutRef.current) {
      clearTimeout(clickScrollTimeoutRef.current);
    }
    clickScrollTimeoutRef.current = setTimeout(() => {
      isClickScrollingRef.current = false;
    }, 1000);
  };

  useEffect(() => {
    const handleScrollEnd = () => {
      isClickScrollingRef.current = false;
      if (clickScrollTimeoutRef.current) {
        clearTimeout(clickScrollTimeoutRef.current);
      }
    };
    window.addEventListener("scrollend", handleScrollEnd);
    return () => window.removeEventListener("scrollend", handleScrollEnd);
  }, []);

  useLayoutEffect(() => {
    const header = headerRef.current;
    if (!header) return;

    const updateHeaderHeight = () => {
      const height = header.offsetHeight;
      setHeaderHeight(height);
      document.documentElement.style.setProperty(
        "--header-height",
        `${height}px`,
      );
    };

    updateHeaderHeight();

    const resizeObserver = new ResizeObserver(updateHeaderHeight);
    resizeObserver.observe(header);

    return () => resizeObserver.disconnect();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (isClickScrollingRef.current) return;
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveCategory(entry.target.id as PizzaCategory);
          }
        }
      },
      { rootMargin: `-${headerHeight + 16}px 0px -70% 0px` },
    );

    for (const category of PIZZA_CATEGORIES) {
      const section = document.getElementById(category);
      if (section) observer.observe(section);
    }

    return () => observer.disconnect();
  }, [headerHeight]);

  return (
    <header
      ref={headerRef}
      className="sticky top-0 z-40 mx-auto w-full max-w-[1280px] bg-background px-4 py-4 sm:px-8 lg:px-10"
    >
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
          {PIZZA_CATEGORIES.map((category) => (
            <Button
              key={category}
              variant={category === activeCategory ? "default" : "outline"}
              className={
                category === activeCategory
                  ? "h-8 shrink-0 rounded-full border-transparent bg-black px-3 text-xs font-bold text-white hover:bg-black/80"
                  : "h-8 shrink-0 rounded-full border-transparent bg-neutral-100 px-3 text-xs font-bold text-foreground hover:bg-neutral-200"
              }
              asChild
            >
              <a
                href={`/#${category}`}
                onClick={() => scrollToCategory(category)}
              >
                {PIZZA_CATEGORY_LABELS[category]}
              </a>
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
            {PIZZA_CATEGORIES.map((category) => (
              <Button
                key={category}
                variant={category === activeCategory ? "default" : "outline"}
                className={
                  category === activeCategory
                    ? "h-12 rounded-full border-transparent bg-black px-6 text-base font-bold text-white hover:bg-black/80"
                    : "h-12 rounded-full border-transparent bg-neutral-100 px-6 text-base font-bold text-foreground hover:bg-neutral-200"
                }
                asChild
              >
                <a
                  href={`/#${category}`}
                  onClick={() => scrollToCategory(category)}
                >
                  {PIZZA_CATEGORY_LABELS[category]}
                </a>
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

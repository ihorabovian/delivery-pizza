"use client";

import { usePathname } from "next/navigation";
import { PIZZA_CATEGORIES, PIZZA_CATEGORY_LABELS } from "@/lib/constants";
import { Button } from "@/components/ui/button";

export function CategoryNav() {
  const pathname = usePathname();

  if (pathname !== "/") return null;

  return (
    <nav className="flex flex-wrap gap-2">
      {PIZZA_CATEGORIES.map((category, index) => (
        <Button
          key={category}
          variant={index === 0 ? "default" : "outline"}
          className={
            index === 0
              ? "rounded-full border-transparent bg-black text-white hover:bg-black/80"
              : "rounded-full border-transparent bg-neutral-100 hover:bg-neutral-200"
          }
          asChild
        >
          <a href={`/#${category}`}>{PIZZA_CATEGORY_LABELS[category]}</a>
        </Button>
      ))}
    </nav>
  );
}

"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Pizza } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { OrderCard } from "@/components/order-card";
import { useHydrated } from "@/stores/use-hydrated";
import { isActiveOrder, useOrderStore } from "@/stores/order-store";

const TABS = [
  { key: "active", label: "Active" },
  { key: "history", label: "History" },
] as const;

type TabKey = (typeof TABS)[number]["key"];

// Card width (480px) plus the gap between cards
const SCROLL_STEP = 520;

export function OrdersList() {
  const hydrated = useHydrated(useOrderStore.persist);
  const orders = useOrderStore((state) => state.orders);
  const cancelOrder = useOrderStore((state) => state.cancelOrder);
  const [tab, setTab] = useState<TabKey>("active");
  const scrollerRef = useRef<HTMLDivElement>(null);

  const visibleOrders = orders.filter((order) =>
    tab === "active" ? isActiveOrder(order) : !isActiveOrder(order),
  );

  const scrollByCard = (direction: -1 | 1) => {
    scrollerRef.current?.scrollBy({
      left: direction * SCROLL_STEP,
      behavior: "smooth",
    });
  };

  if (!hydrated) return null;

  return (
    <main className="mx-auto w-full max-w-[1280px] flex-1 px-4 py-10 sm:px-8 lg:px-10">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-3xl font-bold tracking-tight">My orders</h1>

        {visibleOrders.length > 0 && (
          <div className="hidden gap-2 sm:flex">
            <button
              type="button"
              aria-label="Previous orders"
              onClick={() => scrollByCard(-1)}
              className="flex size-8 cursor-pointer items-center justify-center rounded-full bg-muted hover:bg-muted/70"
            >
              <ChevronLeft className="size-4" />
            </button>
            <button
              type="button"
              aria-label="Next orders"
              onClick={() => scrollByCard(1)}
              className="flex size-8 cursor-pointer items-center justify-center rounded-full bg-muted hover:bg-muted/70"
            >
              <ChevronRight className="size-4" />
            </button>
          </div>
        )}
      </div>

      <div className="mt-6 flex w-82 rounded-full bg-muted p-1">
        {TABS.map(({ key, label }) => (
          <button
            key={key}
            type="button"
            onClick={() => setTab(key)}
            className={cn(
              "flex-1 cursor-pointer rounded-full px-3 py-2 text-base font-medium",
              tab === key && "bg-background",
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {visibleOrders.length === 0 ? (
        <div className="mt-6 flex w-full max-w-211 flex-col items-center gap-2 rounded-3xl bg-muted px-6 py-8">
          <Pizza className="size-8 text-[#f14e1d]" />
          <p className="text-xl">Nothing here yet</p>
          <p className="text-sm text-muted-foreground">
            Make a purchase and it will show up here
          </p>
          <Button
            asChild
            size="lg"
            className="mt-4 h-13 w-full rounded-full bg-[#f14e1d] text-white hover:bg-[#f14e1d]/90"
          >
            <Link href="/">Go to home</Link>
          </Button>
        </div>
      ) : (
        <div
          ref={scrollerRef}
          className="mt-6 flex snap-x gap-10 overflow-x-auto pb-2"
        >
          {visibleOrders.map((order) => (
            <OrderCard
              key={order.number}
              order={order}
              onCancel={
                isActiveOrder(order)
                  ? () => cancelOrder(order.number)
                  : undefined
              }
              className="w-full shrink-0 snap-start sm:w-120"
            />
          ))}
        </div>
      )}
    </main>
  );
}

"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatDate, formatOrderNumber, formatPrice } from "@/lib/utils";
import { useHydrated } from "@/stores/use-hydrated";
import { useOrderStore } from "@/stores/order-store";

export function OrderStatus({ number }: { number: string }) {
  const hydrated = useHydrated(useOrderStore.persist);
  const order = useOrderStore((state) =>
    state.orders.find((item) => item.number === number),
  );

  if (!hydrated) return null;

  if (!order) {
    return (
      <main className="mx-auto flex w-full max-w-[1280px] flex-1 flex-col items-center justify-center gap-4 px-6 py-20 text-center">
        <h1 className="text-2xl font-bold tracking-tight">Order not found</h1>
        <Button
          asChild
          className="h-13 rounded-full bg-[#f14e1d] px-6 text-white hover:bg-[#f14e1d]/90"
        >
          <Link href="/">View menu</Link>
        </Button>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-[1280px] flex-1 px-4 py-6 sm:px-8 lg:px-10">
      <nav className="flex items-center gap-1.5 text-sm text-muted-foreground">
        <span>Cart</span>
        <ChevronRight className="size-3.5" />
        <span>Checkout</span>
        <ChevronRight className="size-3.5" />
        <span className="font-medium text-foreground">Order accepted</span>
      </nav>

      <h1 className="mt-4 text-3xl font-bold tracking-tight break-all">
        Order №{formatOrderNumber(order.number)} is being prepared
      </h1>

      <div className="mt-8 flex w-full max-w-82 flex-col gap-4">
        {order.items.map((item) => (
          <div key={item.id} className="flex gap-4">
            <Image
              src={item.img}
              alt={item.name}
              width={66}
              height={69}
              className="size-16 shrink-0 object-contain"
            />
            <div className="flex flex-col gap-1">
              <span className="font-medium">
                {formatPrice(item.price * item.quantity)}
              </span>
              <span className="font-medium">{item.name}</span>
              <p className="text-sm text-muted-foreground">{item.summary}</p>
              <p className="text-sm text-muted-foreground">
                {item.description}
              </p>
            </div>
          </div>
        ))}

        <div className="flex flex-col gap-1">
          <span className="text-muted-foreground">Total</span>
          <span className="text-2xl">{formatPrice(order.total)}</span>
        </div>

        <div className="flex flex-col gap-1">
          <span className="text-muted-foreground">Delivery address</span>
          <span className="font-medium">{order.address}</span>
        </div>

        <div className="flex flex-col gap-1">
          <span className="text-muted-foreground">Delivery</span>
          <span className="font-medium">Free</span>
        </div>

        <div className="flex flex-col gap-1">
          <span className="text-muted-foreground">Order date</span>
          <span className="font-medium">
            {formatDate(new Date(order.createdAt))}
          </span>
        </div>

        <div className="mt-6 flex flex-col gap-2">
          <Button
            asChild
            size="lg"
            className="h-13 w-full rounded-full bg-[#f14e1d] text-white hover:bg-[#f14e1d]/90"
          >
            <Link href="/">View menu</Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="secondary"
            className="h-13 w-full rounded-full"
          >
            <Link href="/orders">Go to my orders</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}

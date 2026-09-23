"use client";

import Link from "next/link";
import { useCart } from "@/components/cart-context";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";

export default function CheckoutPage() {
  const { items, itemCount, totalPrice } = useCart();

  if (items.length === 0) {
    return (
      <main className="flex flex-1 flex-col items-center justify-center gap-4 px-6 py-20 text-center">
        <h1 className="text-2xl font-bold tracking-tight">
          Your cart is empty
        </h1>
        <p className="text-muted-foreground">
          Add something from the menu before checking out.
        </p>
        <Button asChild className="rounded-full">
          <Link href="/">Back to menu</Link>
        </Button>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-6 py-10 sm:px-10">
      <h1 className="text-2xl font-bold tracking-tight">Checkout</h1>
      <p className="mt-2 text-muted-foreground">
        Order placement isn&apos;t available yet — here&apos;s a summary of
        what&apos;s in your cart.
      </p>

      <ul className="mt-8 flex flex-col gap-4">
        {items.map((item) => (
          <li
            key={item.id}
            className="flex items-center gap-3 rounded-xl border border-border p-3"
          >
            <img
              src={item.img}
              alt={item.name}
              className="size-14 rounded-lg object-cover"
            />
            <div className="flex-1">
              <p className="font-semibold leading-snug">{item.name}</p>
              <p className="text-sm text-muted-foreground">{item.summary}</p>
            </div>
            <div className="text-right">
              <p className="font-medium">
                {formatPrice(item.price * item.quantity)}
              </p>
              <p className="text-sm text-muted-foreground">
                x{item.quantity}
              </p>
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-8 flex items-center justify-between border-t border-border pt-4">
        <span className="text-muted-foreground">
          {itemCount} {itemCount === 1 ? "item" : "items"}
        </span>
        <span className="text-lg font-semibold">
          {formatPrice(totalPrice)}
        </span>
      </div>
    </main>
  );
}

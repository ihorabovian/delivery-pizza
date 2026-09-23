"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronRight, ChevronDown, CreditCard, Check, Plus } from "lucide-react";
import { useCart } from "@/components/cart-context";
import { Button } from "@/components/ui/button";
import { formatDate, formatPrice } from "@/lib/utils";

const ORDER_DATE = formatDate(new Date());

function Breadcrumb({ step }: { step: "checkout" | "placed" }) {
  const steps = [
    { key: "cart", label: "Cart" },
    { key: "checkout", label: "Checkout" },
    { key: "placed", label: "Order placed" },
  ] as const;
  const activeIndex = steps.findIndex((item) => item.key === step);

  return (
    <nav className="flex items-center gap-1.5 text-sm text-muted-foreground">
      {steps.map((item, index) => (
        <span key={item.key} className="flex items-center gap-1.5">
          {index > 0 && <ChevronRight className="size-3.5" />}
          <span
            className={
              index <= activeIndex
                ? "font-medium text-foreground"
                : "text-muted-foreground/60"
            }
          >
            {item.label}
          </span>
        </span>
      ))}
    </nav>
  );
}

export default function CheckoutPage() {
  const { items, itemCount, totalPrice, clearCart } = useCart();
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [placed, setPlaced] = useState(false);

  const handlePlaceOrder = () => {
    if (!address.trim()) return;
    setPlaced(true);
    clearCart();
  };

  if (placed) {
    return (
      <main className="mx-auto w-full max-w-2xl flex-1 px-6 py-10 sm:px-10">
        <Breadcrumb step="placed" />
        <div className="mt-16 flex flex-col items-center gap-3 text-center">
          <h1 className="text-2xl font-bold tracking-tight">Order placed!</h1>
          <p className="text-muted-foreground">
            We&apos;re getting your order ready. It will arrive at{" "}
            {address}.
          </p>
          <Button asChild className="mt-4 rounded-full">
            <Link href="/">Back to menu</Link>
          </Button>
        </div>
      </main>
    );
  }

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
    <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-10 sm:px-10">
      <Breadcrumb step="checkout" />

      <h1 className="mt-4 text-2xl font-bold tracking-tight">
        Order details
      </h1>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_320px]">
        <div className="flex flex-col gap-6">
          <ul className="flex flex-col divide-y divide-border">
            {items.map((item) => (
              <li key={item.id} className="flex gap-3 py-4 first:pt-0">
                <img
                  src={item.img}
                  alt={item.name}
                  className="size-14 shrink-0 rounded-xl object-cover"
                />
                <div>
                  <p className="text-sm text-muted-foreground">
                    {formatPrice(item.price * item.quantity)}
                    {item.quantity > 1 ? ` · x${item.quantity}` : ""}
                  </p>
                  <p className="font-semibold leading-snug">{item.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {item.summary}
                  </p>
                </div>
              </li>
            ))}
          </ul>

          <div className="flex flex-col gap-1">
            <label htmlFor="address" className="text-sm text-muted-foreground">
              Delivery address
            </label>
            <div className="relative">
              <input
                id="address"
                value={address}
                onChange={(event) => setAddress(event.target.value)}
                placeholder="Enter delivery address"
                className="w-full rounded-lg border border-border bg-background py-2.5 pl-3 pr-9 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
              />
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-sm text-muted-foreground">Delivery</span>
            <span className="font-medium">Free</span>
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-sm text-muted-foreground">Order date</span>
            <span className="font-medium">{ORDER_DATE}</span>
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="phone" className="text-sm text-muted-foreground">
              Phone number
            </label>
            <input
              id="phone"
              type="tel"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              placeholder="+1"
              className="w-full max-w-xs rounded-lg border border-border bg-background py-2.5 px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            />
          </div>
        </div>

        <aside className="flex h-fit flex-col gap-5 rounded-2xl bg-muted/50 p-5">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              {itemCount} {itemCount === 1 ? "item" : "items"}
            </span>
            <span className="text-lg font-semibold">
              {formatPrice(totalPrice)}
            </span>
          </div>

          <div className="flex flex-col gap-2">
            <p className="text-sm font-semibold text-foreground/70 uppercase tracking-wide">
              Payment method
            </p>
            <div className="flex items-center justify-between rounded-xl border border-primary bg-primary/5 px-4 py-3">
              <div className="flex items-center gap-2">
                <CreditCard className="size-4 text-primary" />
                <span className="text-sm font-medium">Card</span>
              </div>
              <Check className="size-4 text-primary" />
            </div>

            <button
              type="button"
              disabled
              className="flex cursor-not-allowed items-center justify-center gap-2 rounded-xl border border-dashed border-border py-3 text-sm text-muted-foreground opacity-60"
            >
              <Plus className="size-4" />
              New card
            </button>
          </div>

          <div className="text-sm text-muted-foreground">
            Free delivery
          </div>

          <Button
            size="lg"
            className="w-full rounded-full"
            disabled={!address.trim()}
            onClick={handlePlaceOrder}
          >
            {address.trim() ? "Place order" : "Enter delivery address"}
          </Button>
        </aside>
      </div>
    </main>
  );
}

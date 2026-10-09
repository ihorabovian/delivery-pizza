"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ChevronRight, Check, Plus } from "lucide-react";
import { AddressSelect } from "@/components/address-select";
import { useAddressStore } from "@/stores/address-store";
import {
  selectItemCount,
  selectTotalPrice,
  useCartStore,
} from "@/stores/cart-store";
import { useHydrated } from "@/stores/use-hydrated";
import { useUserStore } from "@/stores/user-store";
import { Button } from "@/components/ui/button";
import { calculatePizzaOrder, createPizzaPayment } from "@/lib/api";
import { cn, formatDate, formatPrice } from "@/lib/utils";
import jbPayMascot from "@/public/jb-pay-mascot.svg";
import type { CalculateOrderResponse, CartItem } from "@/types/cart";

function toOrderedItem(item: CartItem) {
  return {
    _id: item.pizzaId,
    category: item.category,
    quantity: item.quantity,
    size: item.size,
    // Breakfast and wings have no options; the API rejects an empty string
    ...(item.option ? { option: item.option } : {}),
    toppings: item.toppings,
  };
}

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

function BrandLogo() {
  return (
    <span className="flex h-6 shrink-0 items-center rounded-full bg-foreground px-3 text-xs font-extrabold text-background">
      JB
    </span>
  );
}

export default function CheckoutPage() {
  const router = useRouter();
  const cartHydrated = useHydrated(useCartStore.persist);
  const { items } = useCartStore();
  const itemCount = useCartStore(selectItemCount);
  const totalPrice = useCartStore(selectTotalPrice);
  const { address, street, house, setAddress } = useAddressStore();
  // Phone lives in the persisted profile, so it survives leaving the checkout
  const { phone, setPhone } = useUserStore();
  const phoneDigits = phone.replace(/\D/g, "");
  const [placing, setPlacing] = useState(false);
  const [placeError, setPlaceError] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<"card" | "jbpay">("card");
  const [payWithoutSaving, setPayWithoutSaving] = useState(false);
  const [calculation, setCalculation] = useState<CalculateOrderResponse | null>(
    null,
  );
  const [calculating, setCalculating] = useState(false);
  const [calculateError, setCalculateError] = useState<string | null>(null);

  useEffect(() => {
    if (items.length === 0) return;

    let cancelled = false;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- standard data-fetching pattern: mark loading before the async call starts
    setCalculating(true);
    setCalculateError(null);

    calculatePizzaOrder(items.map(toOrderedItem))
      .then((result) => {
        if (!cancelled) setCalculation(result);
      })
      .catch((error: Error) => {
        if (!cancelled) setCalculateError(error.message);
      })
      .finally(() => {
        if (!cancelled) setCalculating(false);
      });

    return () => {
      cancelled = true;
    };
  }, [items]);

  const finalTotalPrice = calculation?.totalPrice ?? totalPrice;

  const canPlaceOrder =
    !!address.trim() &&
    !!phoneDigits &&
    !calculating &&
    !calculateError &&
    !placing;

  const handlePlaceOrder = async () => {
    if (!canPlaceOrder) return;
    setPlacing(true);
    setPlaceError(null);

    try {
      const order = await createPizzaPayment({
        items: items.map(toOrderedItem),
        person: { phone: phoneDigits },
        receiverAddress: {
          // Addresses saved before street/house were stored only have the full line
          street: street || address,
          house,
          // TODO: API requires apartment, but the design has no field for it yet
          apartment: "1",
          comment: "",
        },
      });
      router.push(`/payment?amount=${order.totalPrice}&order=${order._id}`);
    } catch (error) {
      setPlaceError((error as Error).message);
      setPlacing(false);
    }
  };

  // Wait for the persisted cart, otherwise "empty cart" flashes on reload
  if (!cartHydrated) return null;

  if (items.length === 0) {
    return (
      <main className="flex flex-1 flex-col items-center justify-center gap-4 px-6 py-20 text-center">
        <h1 className="text-2xl font-bold tracking-tight">
          Your cart is empty
        </h1>
        <p className="text-muted-foreground">
          Add something from the menu before checking out.
        </p>
        <Button
          asChild
          className="h-13 rounded-full bg-[#f14e1d] px-6 text-white hover:bg-[#f14e1d]/90"
        >
          <Link href="/">Back to menu</Link>
        </Button>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-[1280px] flex-1 px-4 py-6 sm:px-8 lg:px-10">
      <Breadcrumb step="checkout" />

      <h1 className="mt-4 text-2xl font-bold tracking-tight">Order details</h1>

      <div className="mt-6 flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex flex-col gap-10 lg:max-w-140 lg:flex-1">
          <ul className="flex flex-col">
            {items.map((item, index) => (
              <li
                key={item.id}
                className={cn(
                  "flex items-start gap-4 py-4 first:pt-0 last:pb-0",
                  index > 0 && "border-t border-border",
                )}
              >
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
                    {item.quantity > 1 ? ` · x${item.quantity}` : ""}
                  </span>
                  <p className="font-bold leading-snug">{item.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {item.summary}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              </li>
            ))}
          </ul>

          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-1">
              <label
                htmlFor="address"
                className="text-base font-medium text-muted-foreground"
              >
                Delivery address
              </label>
              <AddressSelect value={address} onChange={setAddress} />
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-base font-medium text-muted-foreground">
                Delivery
              </span>
              <span className="text-base font-medium">Free</span>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-base font-medium text-muted-foreground">
                Order date
              </span>
              <span className="text-base font-medium">{ORDER_DATE}</span>
            </div>

            <div className="flex flex-col gap-1">
              <label
                htmlFor="phone"
                className="text-sm font-medium text-foreground"
              >
                Phone
              </label>
              <input
                id="phone"
                type="tel"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                placeholder="+1"
                className="w-full max-w-xs rounded-full border border-border bg-background py-2.5 px-4 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
              />
            </div>
          </div>
        </div>

        <aside className="flex w-full flex-col gap-4 rounded-3xl bg-muted/60 p-6 lg:w-93">
          <div className="flex flex-col gap-1">
            <span className="text-base font-medium text-muted-foreground">
              {itemCount} {itemCount === 1 ? "item" : "items"}
            </span>
            <span className="text-2xl font-medium">
              {calculating ? "…" : formatPrice(finalTotalPrice)}
            </span>
            {calculateError && (
              <span className="text-sm text-destructive">{calculateError}</span>
            )}
            {calculation && (
              <span className="text-sm text-muted-foreground">
                Service fee: {formatPrice(calculation.commission.amount)}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-4">
            <p className="text-lg text-foreground">Payment method</p>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setPaymentMethod("card")}
                className="flex w-1/2 flex-col gap-3 rounded-2xl bg-background p-4 text-left"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex flex-col gap-1">
                    <BrandLogo />
                    <span className="text-base font-medium">Card</span>
                  </div>
                  <div
                    className={cn(
                      "flex size-5 shrink-0 items-center justify-center rounded-full",
                      paymentMethod === "card"
                        ? "bg-primary"
                        : "border-[1.5px] border-ring bg-background",
                    )}
                  >
                    {paymentMethod === "card" && (
                      <Check className="size-3 text-primary-foreground" />
                    )}
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod("jbpay")}
                className="relative flex w-1/2 flex-col gap-3 overflow-visible rounded-2xl bg-background p-4 text-left"
              >
                <Image
                  src={jbPayMascot}
                  alt=""
                  width={53}
                  height={88}
                  className="pointer-events-none absolute right-2 -top-8"
                  aria-hidden
                />
                <div className="flex items-center justify-between gap-2">
                  <div className="flex flex-col gap-1">
                    <BrandLogo />
                    <span className="text-base font-medium">JB Pay</span>
                  </div>
                  <div
                    className={cn(
                      "flex size-5 shrink-0 items-center justify-center rounded-full",
                      paymentMethod === "jbpay"
                        ? "bg-primary"
                        : "border-[1.5px] border-ring bg-background",
                    )}
                  >
                    {paymentMethod === "jbpay" && (
                      <Check className="size-3 text-primary-foreground" />
                    )}
                  </div>
                </div>
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <p className="text-lg text-foreground">Card for payment</p>
            <button
              type="button"
              onClick={handlePlaceOrder}
              disabled={!canPlaceOrder}
              className="flex w-33 cursor-pointer flex-col items-center gap-2 rounded-2xl bg-background p-2 py-4 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <span className="flex size-8 items-center justify-center rounded-full bg-muted">
                <Plus className="size-4" />
              </span>
              <span className="text-sm text-foreground">New card</span>
            </button>
          </div>

          <button
            type="button"
            onClick={() => setPayWithoutSaving((value) => !value)}
            className="flex cursor-pointer items-center gap-3 text-left"
          >
            <span
              className={cn(
                "flex size-5 shrink-0 items-center justify-center rounded-full",
                payWithoutSaving
                  ? "bg-primary"
                  : "border-[1.5px] border-ring bg-background",
              )}
            >
              {payWithoutSaving && (
                <Check className="size-3 text-primary-foreground" />
              )}
            </span>
            <span className="text-base font-medium">
              Don&apos;t save card
            </span>
          </button>

          <div className="flex flex-col items-center gap-2">
            <span className="text-sm font-medium text-muted-foreground">
              We&apos;ll deliver for free
            </span>
            <Button
              size="lg"
              className="h-13 w-full rounded-full bg-[#f14e1d] text-sm font-medium text-white hover:bg-[#f14e1d]/90"
              disabled={!canPlaceOrder}
              onClick={handlePlaceOrder}
            >
              {!address.trim()
                ? "Enter delivery address"
                : !phoneDigits
                  ? "Enter phone"
                  : "Place order"}
            </Button>
            {placeError && (
              <span className="text-center text-sm text-destructive">
                {placeError}
              </span>
            )}
          </div>
        </aside>
      </div>
    </main>
  );
}

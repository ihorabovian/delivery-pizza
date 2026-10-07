"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import pizzaIcon from "@/app/icon.png";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import { Check } from "lucide-react";
import { useAddressStore } from "@/stores/address-store";
import { useCardStore } from "@/stores/card-store";
import { useCartStore } from "@/stores/cart-store";
import { useOrderStore } from "@/stores/order-store";

function formatCardNumber(value: string) {
  return value
    .replace(/\D/g, "")
    .slice(0, 16)
    .replace(/(\d{4})(?=\d)/g, "$1 ");
}

function formatExpiry(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 4);
  if (digits.length < 3) return digits;
  return `${digits.slice(0, 2)}/${digits.slice(2)}`;
}

const inputClassName =
  "w-full rounded-full border border-border bg-background py-2.5 px-4 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50";

export function PaymentForm({
  amount,
  orderNumber,
}: {
  amount: number;
  orderNumber: string;
}) {
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [paying, setPaying] = useState(false);
  const [paid, setPaid] = useState(false);

  const isValid =
    cardNumber.replace(/\s/g, "").length >= 8 &&
    expiry.length === 5 &&
    cvv.length >= 3;

  // Demo payment: no gateway yet, so "success" is simulated after a short delay
  const handlePay = () => {
    setPaying(true);
    setTimeout(() => {
      const { items, clearCart } = useCartStore.getState();
      useOrderStore.getState().addOrder({
        number: orderNumber,
        items,
        total: amount,
        address: useAddressStore.getState().address,
        createdAt: new Date().toISOString(),
      });
      useCardStore.getState().addCard(cardNumber.replace(/\s/g, "").slice(-4));
      clearCart();
      setPaid(true);
    }, 1000);
  };

  if (paid) {
    return (
      <div className="flex w-full max-w-104.5 flex-col gap-8">
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-2">
            <span className="flex size-8 items-center justify-center rounded-full bg-green-500 text-white">
              <Check className="size-5" aria-hidden />
            </span>
            <h1 className="text-2xl font-bold tracking-tight">
              Payment successful
            </h1>
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <span className="text-sm text-muted-foreground">Service</span>
              <div className="flex items-center gap-1">
                <Image src={pizzaIcon} alt="" className="size-6" aria-hidden />
                <span className="text-base font-extrabold uppercase">Pizza</span>
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-sm text-muted-foreground">Amount</span>
              <span className="text-2xl font-normal">{formatPrice(amount)}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-sm text-muted-foreground">Order number</span>
              <span className="text-base">{orderNumber}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <Button
            asChild
            size="lg"
            className="h-13 w-full rounded-full bg-foreground text-background hover:bg-foreground/90"
          >
            <Link href={`/order/${orderNumber}`}>Back to site</Link>
          </Button>
          <p className="text-sm text-muted-foreground">
            This payment is not real. No money was charged.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-104.5">
      <h1 className="text-2xl font-bold tracking-tight">Payment</h1>

      <div className="mt-6 flex flex-col gap-1">
        <span className="text-sm text-muted-foreground">Service</span>
        <div className="flex items-center gap-1">
          <Image src={pizzaIcon} alt="" className="size-6" aria-hidden />
          <span className="text-lg font-extrabold uppercase tracking-tight">
            Pizza
          </span>
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-1">
        <span className="text-sm text-muted-foreground">Amount</span>
        <span className="text-2xl font-bold">{formatPrice(amount)}</span>
      </div>

      <div className="mt-6 flex flex-col gap-1">
        <span className="text-sm text-muted-foreground">Order number</span>
        <span className="text-2xl font-bold">{orderNumber}</span>
      </div>

      <div className="mt-6 flex flex-col gap-4 rounded-3xl bg-muted/50 p-6">
        <div className="flex flex-col gap-1">
          <label htmlFor="cardNumber" className="text-sm font-medium">
            Card number*
          </label>
          <input
            id="cardNumber"
            value={cardNumber}
            onChange={(event) =>
              setCardNumber(formatCardNumber(event.target.value))
            }
            placeholder="0000 0000"
            inputMode="numeric"
            autoComplete="cc-number"
            className={inputClassName}
          />
        </div>

        <div className="flex gap-4">
          <div className="flex flex-1 flex-col gap-1">
            <label htmlFor="expiry" className="text-sm font-medium">
              Expiry*
            </label>
            <input
              id="expiry"
              value={expiry}
              onChange={(event) =>
                setExpiry(formatExpiry(event.target.value))
              }
              placeholder="00/00"
              inputMode="numeric"
              autoComplete="cc-exp"
              className={inputClassName}
            />
          </div>
          <div className="flex flex-1 flex-col gap-1">
            <label htmlFor="cvv" className="text-sm font-medium">
              CVV*
            </label>
            <input
              id="cvv"
              value={cvv}
              onChange={(event) =>
                setCvv(event.target.value.replace(/\D/g, "").slice(0, 4))
              }
              placeholder="0000"
              inputMode="numeric"
              autoComplete="cc-csc"
              className={inputClassName}
            />
          </div>
        </div>
      </div>

      <Button
        size="lg"
        className="mt-6 h-13 w-full rounded-full bg-foreground text-background hover:bg-foreground/90"
        disabled={!isValid || paying}
        onClick={handlePay}
      >
        {paying ? "Processing…" : `Pay ${formatPrice(amount)}`}
      </Button>

      <p className="mt-4 text-center text-sm text-muted-foreground">
        This is a demo payment. No money will be charged.
      </p>
    </div>
  );
}

"use client";

import Link from "next/link";
import { Minus, Plus, ShoppingBasket, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useCart } from "@/components/cart-context";
import { useCatalog } from "@/components/catalog-context";
import { getPizzaImageUrl, getStartingPrice } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const SIZE_LABELS: Record<string, string> = {
  small: "Small",
  medium: "Medium",
  large: "Large",
};

export function CartSheet() {
  const { items, itemCount, totalPrice, addItem, removeItem, updateQuantity } =
    useCart();
  const catalog = useCatalog();

  const recommendations = ["breakfast", "wings", "milkshake"]
    .map((category) => catalog.find((pizza) => pizza.category === category))
    .filter((pizza) => pizza !== undefined);

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button className="rounded-full">
          <ShoppingBasket />
          {formatPrice(totalPrice)}
        </Button>
      </SheetTrigger>

      <SheetContent>
        <SheetHeader>
          <SheetTitle>Cart</SheetTitle>
          <SheetDescription className="sr-only">
            Items you have added to your cart
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-6">
          {items.length === 0 ? (
            <p className="mt-10 text-center text-sm text-muted-foreground">
              Your cart is empty
            </p>
          ) : (
            <ul className="flex flex-col gap-5">
              {items.map((item) => (
                <li key={item.id} className="flex gap-3">
                  <img
                    src={item.img}
                    alt={item.name}
                    className="size-16 shrink-0 rounded-xl object-cover"
                  />

                  <div className="flex flex-1 flex-col gap-1">
                    <div className="flex items-start justify-between gap-2">
                      <span className="font-semibold leading-snug">
                        {item.name}
                      </span>
                      <button
                        type="button"
                        aria-label={`Remove ${item.name}`}
                        onClick={() => removeItem(item.id)}
                        className="cursor-pointer text-destructive hover:text-destructive/80"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>

                    <p className="text-sm text-muted-foreground">
                      {item.summary}
                    </p>

                    <div className="mt-1 flex items-center justify-between">
                      <span className="font-medium">
                        {formatPrice(item.price * item.quantity)}
                      </span>

                      <div className="flex items-center gap-2 rounded-full bg-muted px-1 py-1">
                        <button
                          type="button"
                          aria-label="Decrease quantity"
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                          className="flex size-6 cursor-pointer items-center justify-center rounded-full hover:bg-background"
                        >
                          <Minus className="size-3.5" />
                        </button>
                        <span className="min-w-4 text-center text-sm font-medium">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          aria-label="Increase quantity"
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                          className="flex size-6 cursor-pointer items-center justify-center rounded-full hover:bg-background"
                        >
                          <Plus className="size-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}

          {items.length > 0 && recommendations.length > 0 && (
            <div className="mt-6">
              <p className="mb-3 text-sm font-semibold text-foreground/70 uppercase tracking-wide">
                Make it tastier
              </p>
              <div className="flex gap-3 overflow-x-auto pb-2">
                {recommendations.map((pizza) => {
                  const smallestSize = pizza.sizes.reduce((min, size) =>
                    size.price < min.price ? size : min,
                  );
                  const price = getStartingPrice(pizza);

                  return (
                    <button
                      key={pizza._id}
                      type="button"
                      onClick={() => {
                        addItem({
                          pizzaId: pizza._id,
                          name: pizza.name,
                          img: getPizzaImageUrl(pizza.img),
                          summary: SIZE_LABELS[smallestSize.type] ?? smallestSize.type,
                          price,
                        });
                        toast.success(`${pizza.name} added to cart`);
                      }}
                      className="flex w-28 shrink-0 cursor-pointer flex-col gap-2 rounded-xl border border-border p-2 text-left transition-colors hover:border-primary"
                    >
                      <img
                        src={getPizzaImageUrl(pizza.img)}
                        alt={pizza.name}
                        className="aspect-square w-full rounded-lg object-cover"
                      />
                      <span className="text-xs font-medium leading-tight">
                        {pizza.name}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        from {formatPrice(price)}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {items.length > 0 && (
          <SheetFooter>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                {itemCount} {itemCount === 1 ? "item" : "items"}
              </span>
              <span className="font-semibold">{formatPrice(totalPrice)}</span>
            </div>
            <SheetClose asChild>
              <Button size="lg" className="w-full rounded-full" asChild>
                <Link href="/checkout">Proceed to checkout</Link>
              </Button>
            </SheetClose>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
}

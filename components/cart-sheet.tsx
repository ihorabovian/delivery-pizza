"use client";

import Link from "next/link";
import Image from "next/image";
import { Minus, Plus, ShoppingBasket, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useCart } from "@/components/cart-context";
import { useCatalog } from "@/components/catalog-context";
import { getPizzaImageUrl, getStartingPrice } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { cn, formatPrice } from "@/lib/utils";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export function CartSheet({ triggerClassName }: { triggerClassName?: string }) {
  const { items, itemCount, totalPrice, addItem, removeItem, updateQuantity } =
    useCart();
  const catalog = useCatalog();

  const recommendations = ["breakfast", "wings", "milkshake"]
    .map((category) => catalog.find((pizza) => pizza.category === category))
    .filter((pizza) => pizza !== undefined);

  return (
    <Sheet>
      <SheetTrigger asChild>
        <button
          type="button"
          className={cn(
            "flex h-10 items-center gap-2 rounded-full bg-[#f14e1d] px-5 text-sm font-medium text-white hover:bg-[#f14e1d]/90",
            triggerClassName,
          )}
        >
          <ShoppingBasket className="size-4" />
          {formatPrice(totalPrice)}
        </button>
      </SheetTrigger>

      <SheetContent className="flex w-full flex-col gap-0 bg-background p-0 sm:max-w-119">
        <SheetHeader className="pb-0">
          <SheetTitle className="font-sans text-2xl font-bold">Cart</SheetTitle>
          <SheetDescription className="sr-only">
            Items you have added to your cart
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-6 py-6">
          {items.length === 0 ? (
            <p className="mt-10 text-center text-sm text-muted-foreground">
              Your cart is empty
            </p>
          ) : (
            <ul className="flex flex-col">
              {items.map((item, index) => (
                <li
                  key={item.id}
                  className={cn(
                    "flex flex-col gap-4 py-6 first:pt-0 last:pb-0",
                    index > 0 && "border-t border-border",
                  )}
                >
                  <div className="flex gap-4">
                    <Image
                      src={item.img}
                      alt={item.name}
                      width={66}
                      height={69}
                      className="size-16 shrink-0 object-contain"
                    />

                    <div className="flex flex-1 flex-col gap-1">
                      <span className="font-bold leading-snug">
                        {item.name}
                      </span>
                      <p className="text-sm text-muted-foreground">
                        {item.summary}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {item.description}
                      </p>
                    </div>

                    <button
                      type="button"
                      aria-label={`Remove ${item.name}`}
                      onClick={() => removeItem(item.id)}
                      className="flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-full hover:bg-muted"
                    >
                      <Trash2 className="size-4 text-destructive" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="font-medium">
                      {formatPrice(item.price * item.quantity)}
                    </span>

                    <div className="flex items-center gap-4">
                      <span className="text-sm font-medium text-[#f14e1d]">
                        Edit
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
              <p className="mb-3 text-lg font-bold text-foreground">
                Make it tastier
              </p>
              <div className="flex gap-2 overflow-x-auto pb-2">
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
                          category: pizza.category,
                          size: smallestSize.type,
                          option: pizza.options[0]?.type ?? "",
                          toppings: [],
                          name: pizza.name,
                          img: getPizzaImageUrl(pizza.img),
                          summary: `${smallestSize.volume} cm`,
                          description: pizza.description,
                          price,
                        });
                        toast.success(`${pizza.name} added to cart`);
                      }}
                      className="flex w-26 shrink-0 cursor-pointer flex-col gap-2 rounded-xl bg-muted p-2 text-left transition-colors hover:bg-muted/70"
                    >
                      <Image
                        src={getPizzaImageUrl(pizza.img)}
                        alt={pizza.name}
                        width={78}
                        height={78}
                        className="aspect-square w-full rounded-lg object-cover"
                      />
                      <span className="line-clamp-2 h-7 text-[10px] font-medium leading-tight">
                        {pizza.name}
                      </span>
                      <span className="text-sm text-foreground">
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
          <div className="flex flex-col gap-4 border-t border-border bg-background px-6 py-6 shadow-[0_-1px_47px_rgba(0,0,0,0.06)]">
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between text-base font-medium">
                <span>
                  {itemCount} {itemCount === 1 ? "item" : "items"}
                </span>
                <span>{formatPrice(totalPrice)}</span>
              </div>
              <div className="flex items-center justify-between text-base font-medium">
                <span>Delivery</span>
                <span>Free</span>
              </div>
            </div>
            <SheetClose asChild>
              <Button
                asChild
                size="lg"
                className="h-13 w-full rounded-full bg-[#f14e1d] text-sm font-medium text-white hover:bg-[#f14e1d]/90"
              >
                <Link href="/checkout">Proceed to checkout</Link>
              </Button>
            </SheetClose>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}

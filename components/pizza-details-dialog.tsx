"use client";

import { useState } from "react";
import Image from "next/image";
import { Check, X } from "lucide-react";
import { toast } from "sonner";
import type { Pizza, PizzaSize } from "@/types/pizza";
import { getPizzaImageUrl } from "@/lib/api";
import { PIZZA_SIZE_LABELS } from "@/lib/constants";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/stores/cart-store";
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

function formatLabel(slug: string): string {
  return slug
    .replace(/_/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export function PizzaDetailsDialog({ pizza }: { pizza: Pizza }) {
  const [sizeType, setSizeType] = useState(pizza.sizes[0]?.type);
  const [optionType] = useState(pizza.options[0]?.type);
  const [toppingTypes, setToppingTypes] = useState<string[]>([]);
  const [keptIngredientTypes, setKeptIngredientTypes] = useState<string[]>(
    pizza.ingredients.map((item) => item.type),
  );

  const size = pizza.sizes.find((item) => item.type === sizeType);
  const option = pizza.options.find((item) => item.type === optionType);
  const toppings = pizza.ingredients.filter((item) =>
    toppingTypes.includes(item.type),
  );

  const totalPrice =
    (size?.price ?? 0) +
    (option?.price ?? 0) +
    toppings.reduce((sum, topping) => sum + topping.price, 0);
  const addItem = useCartStore((state) => state.addItem);

  const addToCart = () => {
    const summaryParts = [
      size ? `${size.volume} cm` : null,
      option ? formatLabel(option.type) : null,
      toppings.length > 0
        ? toppings.map((item) => formatLabel(item.type)).join(", ")
        : null,
    ].filter(Boolean);

    addItem({
      pizzaId: pizza._id,
      category: pizza.category,
      size: size?.type ?? "",
      option: option?.type ?? "",
      toppings: toppings.map((item) => item.type),
      name: pizza.name,
      img: getPizzaImageUrl(pizza.img),
      summary: summaryParts.join(", "),
      description: pizza.description,
      price: totalPrice,
    });
    toast.success(`${pizza.name} added to cart`);
  };

  return (
    <DialogContent
      showCloseButton={false}
      className="fixed inset-0 top-0 left-0 z-50 grid h-dvh w-full max-w-full translate-x-0 translate-y-0 grid-cols-1 items-start gap-0 overflow-y-auto rounded-none bg-background p-0 sm:top-1/2 sm:left-1/2 sm:h-[85vh] sm:max-h-[85vh] sm:w-full sm:max-w-4xl sm:-translate-x-1/2 sm:-translate-y-1/2 sm:grid-cols-[1.1fr_1fr] sm:items-stretch sm:gap-0 sm:overflow-hidden sm:rounded-3xl sm:p-0 sm:shadow-2xl"
    >
      <DialogClose className="absolute right-4 top-4 z-10 flex size-8 cursor-pointer items-center justify-center rounded-full bg-background/80 text-foreground shadow-sm transition-colors hover:bg-muted">
        <X className="size-5" />
        <span className="sr-only">Close</span>
      </DialogClose>

      <div className="flex items-center justify-center px-6 pt-14 sm:min-h-0 sm:bg-muted/30 sm:px-10 sm:py-10">
        <div className="relative aspect-square w-full max-w-100 overflow-hidden rounded-2xl">
          <Image
            src={getPizzaImageUrl(pizza.img)}
            alt={pizza.name}
            fill
            sizes="(max-width: 640px) 100vw, 400px"
            className="object-cover"
          />
        </div>
      </div>

      <div className="flex flex-col gap-5 px-6 pb-8 sm:min-h-0 sm:overflow-y-auto sm:px-8 sm:py-8">
        <div className="text-center sm:text-left">
          <DialogTitle className="text-2xl font-bold tracking-tight">
            {pizza.name}
          </DialogTitle>
          {size && (
            <p className="mt-1 text-sm text-muted-foreground">
              {size.volume} cm
              {option ? `, ${formatLabel(option.type)}` : ""}
            </p>
          )}
          <DialogDescription className="mt-2 text-base text-muted-foreground leading-relaxed">
            {pizza.description}
          </DialogDescription>
        </div>

        {pizza.sizes.length > 0 && (
          <ToggleGroup
            type="single"
            value={sizeType}
            onValueChange={(value) => {
              if (value) setSizeType(value as PizzaSize["type"]);
            }}
            className="w-full rounded-full bg-muted p-1 sm:w-fit"
          >
            {pizza.sizes.map((item) => (
              <ToggleGroupItem
                key={item.type}
                value={item.type}
                className="flex-1 rounded-full px-5 py-1.5 text-sm font-medium text-muted-foreground data-[state=on]:bg-background data-[state=on]:text-foreground data-[state=on]:shadow-sm transition-all sm:flex-none"
              >
                {PIZZA_SIZE_LABELS[item.type]}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        )}

        <DialogClose asChild>
          <Button
            size="lg"
            className="w-full rounded-2xl font-semibold text-base sm:hidden"
            onClick={addToCart}
          >
            + {formatPrice(totalPrice)}
          </Button>
        </DialogClose>

        {pizza.ingredients.length > 0 && (
          <div>
            <p className="mb-3 text-lg font-bold text-foreground">
              Add toppings
            </p>
            <ToggleGroup
              type="multiple"
              value={toppingTypes}
              onValueChange={setToppingTypes}
              className="grid w-full grid-cols-2 gap-3 sm:grid-cols-3"
            >
              {pizza.ingredients.map((item) => {
                const selected = toppingTypes.includes(item.type);
                return (
                  <ToggleGroupItem
                    key={item.type}
                    value={item.type}
                    variant="outline"
                    className="relative h-auto w-full flex-col gap-1.5 rounded-xl border-border bg-background px-3 py-3 data-[state=on]:border-primary data-[state=on]:border-2 transition-all"
                  >
                    {selected && (
                      <span className="absolute -right-1.5 -top-1.5 flex size-5 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm">
                        <Check className="size-3" />
                      </span>
                    )}
                    <Image
                      src={getPizzaImageUrl(item.img)}
                      alt={formatLabel(item.type)}
                      width={56}
                      height={56}
                      className="size-14 rounded-lg object-cover"
                    />
                    <span className="text-center text-sm font-medium leading-tight">
                      {formatLabel(item.type)}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {formatPrice(item.price)}
                    </span>
                  </ToggleGroupItem>
                );
              })}
            </ToggleGroup>
          </div>
        )}

        {pizza.ingredients.length > 0 && (
          <div>
            <p className="mb-2 text-sm font-semibold text-foreground/70 uppercase tracking-wide">
              Remove ingredients
            </p>
            <div className="flex flex-wrap gap-2">
              {pizza.ingredients.map((item) => {
                const kept = keptIngredientTypes.includes(item.type);
                return (
                  <button
                    key={item.type}
                    type="button"
                    onClick={() =>
                      setKeptIngredientTypes((current) =>
                        kept
                          ? current.filter((type) => type !== item.type)
                          : [...current, item.type],
                      )
                    }
                    className={
                      kept
                        ? "flex cursor-pointer items-center gap-1.5 rounded-full bg-foreground px-4 py-2 text-sm font-medium text-background transition-all"
                        : "flex cursor-pointer items-center gap-1.5 rounded-full bg-muted px-4 py-2 text-sm font-medium text-muted-foreground transition-all"
                    }
                  >
                    {formatLabel(item.type)}
                    {kept && <X className="size-3.5" />}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <div>
          <p className="mb-2 text-sm font-semibold text-foreground/70 uppercase tracking-wide">
            Nutrition
          </p>

          <div className="flex flex-wrap gap-2">
            <span className="rounded-full bg-muted px-4 py-2 text-sm text-foreground">
              {pizza.calories} kcal
            </span>
            <span className="rounded-full bg-muted px-4 py-2 text-sm text-foreground">
              {pizza.protein} protein
            </span>
            <span className="rounded-full bg-muted px-4 py-2 text-sm text-foreground">
              {pizza.totalFat} fat
            </span>
            <span className="rounded-full bg-muted px-4 py-2 text-sm text-foreground">
              {pizza.carbohydrates} carbs
            </span>
          </div>
        </div>

        <DialogClose asChild>
          <Button
            size="lg"
            className="hidden w-full rounded-2xl font-semibold text-base sm:mt-auto sm:flex"
            onClick={addToCart}
          >
            Add for {formatPrice(totalPrice)}
          </Button>
        </DialogClose>
      </div>
    </DialogContent>
  );
}

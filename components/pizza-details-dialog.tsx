"use client";

import { useState } from "react";
import { toast } from "sonner";
import type { Pizza, PizzaSize } from "@/types/pizza";
import { getPizzaImageUrl } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { useCart } from "@/components/cart-context";
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

const SIZE_LABELS: Record<PizzaSize["type"], string> = {
  small: "Small",
  medium: "Medium",
  large: "Large",
};

function formatLabel(slug: string): string {
  return slug
    .replace(/_/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export function PizzaDetailsDialog({ pizza }: { pizza: Pizza }) {
  const [sizeType, setSizeType] = useState(pizza.sizes[0]?.type);
  const [optionType, setOptionType] = useState(pizza.options[0]?.type);
  const [toppingTypes, setToppingTypes] = useState<string[]>([]);

  const size = pizza.sizes.find((item) => item.type === sizeType);
  const option = pizza.options.find((item) => item.type === optionType);
  const toppings = pizza.ingredients.filter((item) =>
    toppingTypes.includes(item.type),
  );

  const totalPrice =
    (size?.price ?? 0) +
    (option?.price ?? 0) +
    toppings.reduce((sum, topping) => sum + topping.price, 0);
  const { addItem } = useCart();

  return (
    <DialogContent
      className="grid max-w-4xl gap-6 p-6 sm:max-w-4xl sm:grid-cols-2"
      showCloseButton
    >
      <div className="flex items-center justify-center min-h-100">
        <img
          src={getPizzaImageUrl(pizza.img)}
          alt={pizza.name}
          className="aspect-square w-full max-w-100 rounded-2xl object-cover"
        />
      </div>

      <div className="flex flex-col gap-5">
        <div>
          <DialogTitle className="text-2xl font-bold tracking-tight">
            {pizza.name}
          </DialogTitle>
          <DialogDescription className="mt-2 text-base text-muted-foreground leading-relaxed">
            {pizza.description}
          </DialogDescription>
        </div>

        {pizza.sizes.length > 0 && (
          <div>
            <p className="mb-2 text-sm font-semibold text-foreground/70 uppercase tracking-wide">
              Size
            </p>
            <ToggleGroup
              type="single"
              value={sizeType}
              onValueChange={(value) => {
                if (value) setSizeType(value as PizzaSize["type"]);
              }}
              className="w-fit rounded-full bg-muted p-1"
            >
              {pizza.sizes.map((item) => (
                <ToggleGroupItem
                  key={item.type}
                  value={item.type}
                  className="rounded-full px-5 py-1.5 text-sm font-medium text-muted-foreground data-[state=on]:bg-background data-[state=on]:text-foreground data-[state=on]:shadow-sm transition-all"
                >
                  {SIZE_LABELS[item.type]}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </div>
        )}

        {pizza.options.length > 0 && (
          <div>
            <p className="mb-2 text-sm font-semibold text-foreground/70 uppercase tracking-wide">
              Crust
            </p>
            <ToggleGroup
              type="single"
              value={optionType}
              onValueChange={(value) => {
                if (value) setOptionType(value);
              }}
              className="flex-wrap gap-2"
            >
              {pizza.options.map((item) => (
                <ToggleGroupItem
                  key={item.type}
                  value={item.type}
                  variant="outline"
                  className="rounded-full px-4 py-2 text-sm font-medium data-[state=on]:border-primary data-[state=on]:bg-primary/10 data-[state=on]:text-primary transition-all"
                >
                  {formatLabel(item.type)} · {item.price} ₽
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </div>
        )}

        {pizza.ingredients.length > 0 && (
          <div>
            <p className="mb-2 text-sm font-semibold text-foreground/70 uppercase tracking-wide">
              Toppings
            </p>
            <ToggleGroup
              type="multiple"
              value={toppingTypes}
              onValueChange={setToppingTypes}
              className="grid w-full grid-cols-3 gap-2"
            >
              {pizza.ingredients.map((item) => (
                <ToggleGroupItem
                  key={item.type}
                  value={item.type}
                  variant="outline"
                  className="h-auto w-full flex-col gap-2 rounded-xl border-border px-3 py-3 data-[state=on]:border-primary data-[state=on]:bg-primary/5 transition-all"
                >
                  <img
                    src={getPizzaImageUrl(item.img)}
                    alt={formatLabel(item.type)}
                    className="size-14 rounded-lg object-cover"
                  />
                  <span className="text-center text-sm font-medium leading-tight">
                    {formatLabel(item.type)}
                  </span>
                  <span className="text-sm font-medium text-primary">
                    {item.price} ₽
                  </span>
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </div>
        )}

        <DialogClose asChild>
          <Button
            size="lg"
            className="mt-2 w-full rounded-full font-semibold text-base"
            onClick={() => {
              const summary = [
                size && SIZE_LABELS[size.type],
                [option && formatLabel(option.type), ...toppings.map((topping) => formatLabel(topping.type))]
                  .filter(Boolean)
                  .join(", "),
              ]
                .filter(Boolean)
                .join(" · ");

              addItem({
                pizzaId: pizza._id,
                name: pizza.name,
                img: getPizzaImageUrl(pizza.img),
                summary,
                price: totalPrice,
              });
              toast.success(`${pizza.name} added to cart`);
            }}
          >
            Add to cart for {totalPrice}
          </Button>
        </DialogClose>
      </div>
    </DialogContent>
  );
}

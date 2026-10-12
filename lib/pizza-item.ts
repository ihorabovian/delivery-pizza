import type { PizzaIngredient, PizzaOption, PizzaSize } from "@/types/pizza";

export function formatLabel(slug: string): string {
  return slug
    .replace(/_/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export function getItemPrice(
  size: PizzaSize | undefined,
  option: PizzaOption | undefined,
  toppings: PizzaIngredient[],
): number {
  return (
    (size?.price ?? 0) +
    (option?.price ?? 0) +
    toppings.reduce((sum, topping) => sum + topping.price, 0)
  );
}

export function getItemSummary(
  size: PizzaSize | undefined,
  option: PizzaOption | undefined,
  toppings: PizzaIngredient[],
): string {
  return [
    size ? `${size.volume} cm` : null,
    option ? formatLabel(option.type) : null,
    toppings.length > 0
      ? toppings.map((item) => formatLabel(item.type)).join(", ")
      : null,
  ]
    .filter(Boolean)
    .join(", ");
}

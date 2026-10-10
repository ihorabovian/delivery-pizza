import type { PizzaCategory, PizzaSize } from "@/types/pizza";

export const PIZZA_CATEGORIES: PizzaCategory[] = [
  "pizza",
  "breakfast",
  "wings",
  "milkshake",
];

export const PIZZA_CATEGORY_LABELS: Record<PizzaCategory, string> = {
  pizza: "Pizzas",
  breakfast: "Breakfast",
  wings: "Wings",
  milkshake: "Milkshakes",
};

export const PIZZA_SIZE_LABELS: Record<PizzaSize["type"], string> = {
  small: "Small",
  medium: "Medium",
  large: "Large",
};

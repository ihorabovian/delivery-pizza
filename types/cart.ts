import type { PizzaCategory } from "@/types/pizza";

export type CartItem = {
  id: string;
  pizzaId: string;
  category: PizzaCategory;
  size: string;
  option: string;
  toppings: string[];
  name: string;
  img: string;
  summary: string;
  description: string;
  price: number;
  quantity: number;
};

export type PizzaOrderedItem = {
  _id: string;
  category: PizzaCategory;
  quantity: number;
  size: string;
  option?: string;
  toppings: string[];
};

export type CalculatedItem = {
  productId: string;
  name: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
};

export type CalculateOrderResponse = {
  success: true;
  items: CalculatedItem[];
  itemsPrice: number;
  commission: { amount: number; currency: string };
  totalPrice: number;
};

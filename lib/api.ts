import type { Pizza, PizzaCategory } from "@/types/pizza";
import type {
  CalculateOrderResponse,
  CreatePizzaPaymentRequest,
  PizzaOrder,
  PizzaOrderedItem,
} from "@/types/cart";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function fetchPizzaCatalog(): Promise<Pizza[]> {
  const response = await fetch(`${API_URL}/pizzas/catalog`, {
    next: { revalidate: 60 },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch pizza catalog");
  }

  const data = await response.json();

  return data.catalog;
}

export function getStartingPrice(pizza: Pizza): number {
  return Math.min(...pizza.sizes.map((size) => size.price));
}

export function getPizzaImageUrl(path: string): string {
  return path.startsWith("http") ? path : `${API_URL}${path}`;
}

export async function calculatePizzaOrder(
  items: PizzaOrderedItem[],
): Promise<CalculateOrderResponse> {
  const response = await fetch(`${API_URL}/pizzas/calculate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ items }),
  });

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(getErrorMessage(data) || "Failed to calculate order");
  }

  return data;
}

export async function createPizzaPayment(
  request: CreatePizzaPaymentRequest,
): Promise<PizzaOrder> {
  const response = await fetch(`${API_URL}/pizzas/payment`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
  });

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(getErrorMessage(data) || "Failed to create order");
  }

  return data.order;
}

// Business errors come as `reason`, validation errors as `message` (string or string[])
function getErrorMessage(data: { reason?: string; message?: string | string[] }) {
  return data.reason ?? [data.message].flat().join(", ");
}

export function groupPizzasByCategory(
  pizzas: Pizza[],
): Record<PizzaCategory, Pizza[]> {
  const groups: Record<PizzaCategory, Pizza[]> = {
    pizza: [],
    breakfast: [],
    wings: [],
    milkshake: [],
  };

  for (const pizza of pizzas) {
    groups[pizza.category].push(pizza);
  }

  return groups;
}

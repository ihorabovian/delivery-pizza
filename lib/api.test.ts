import { describe, it, expect, afterEach, vi } from "vitest";
import type { Pizza } from "@/types/pizza";
import { getStartingPrice, groupPizzasByCategory } from "@/lib/api";

function createMockPizza(overrides: Partial<Pizza> = {}): Pizza {
  return {
    _id: "1",
    category: "pizza",
    name: "Margherita",
    description: "Classic tomato and mozzarella",
    img: "/margherita.png",
    sizes: [
      { type: "small", price: 15, volume: 25 },
      { type: "medium", price: 20, volume: 30 },
      { type: "large", price: 25, volume: 35 },
    ],
    options: [],
    ingredients: [],
    calories: 800,
    protein: "30g",
    totalFat: "25g",
    carbohydrates: "90g",
    sodium: "1200mg",
    allergens: [],
    isVegetarian: false,
    isGlutenFree: false,
    isNovelty: false,
    isHit: false,
    ...overrides,
  };
}

describe("getStartingPrice", () => {
  it("returns the price of the cheapest size", () => {
    const pizza = createMockPizza({
      sizes: [
        { type: "small", price: 12, volume: 25 },
        { type: "medium", price: 18, volume: 30 },
        { type: "large", price: 22, volume: 35 },
      ],
    });

    expect(getStartingPrice(pizza)).toBe(12);
  });

  it("works regardless of the order sizes are listed in", () => {
    const pizza = createMockPizza({
      sizes: [
        { type: "large", price: 22, volume: 35 },
        { type: "small", price: 12, volume: 25 },
        { type: "medium", price: 18, volume: 30 },
      ],
    });

    expect(getStartingPrice(pizza)).toBe(12);
  });
});

describe("groupPizzasByCategory", () => {
  it("groups pizzas into their matching category", () => {
    const pizzas = [
      createMockPizza({ _id: "1", category: "pizza" }),
      createMockPizza({ _id: "2", category: "wings" }),
      createMockPizza({ _id: "3", category: "pizza" }),
    ];

    const groups = groupPizzasByCategory(pizzas);

    expect(groups.pizza).toHaveLength(2);
    expect(groups.wings).toHaveLength(1);
    expect(groups.breakfast).toHaveLength(0);
    expect(groups.milkshake).toHaveLength(0);
  });

  it("returns empty arrays for every category when given no pizzas", () => {
    const groups = groupPizzasByCategory([]);

    expect(groups.pizza).toEqual([]);
    expect(groups.breakfast).toEqual([]);
    expect(groups.wings).toEqual([]);
    expect(groups.milkshake).toEqual([]);
  });
});

describe("getPizzaImageUrl", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.resetModules();
  });

  it("returns the path unchanged when it is already an absolute URL", async () => {
    const { getPizzaImageUrl } = await import("@/lib/api");

    expect(getPizzaImageUrl("https://cdn.example.com/pizza.png")).toBe(
      "https://cdn.example.com/pizza.png",
    );
  });

  it("prefixes a relative path with the API URL", async () => {
    vi.stubEnv("NEXT_PUBLIC_API_URL", "https://api.example.com");
    vi.resetModules();
    const { getPizzaImageUrl } = await import("@/lib/api");

    expect(getPizzaImageUrl("/pizza.png")).toBe(
      "https://api.example.com/pizza.png",
    );
  });
});

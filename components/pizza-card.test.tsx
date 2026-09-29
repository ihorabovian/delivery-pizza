import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { PizzaCard } from "@/components/pizza-card";
import { CartProvider } from "@/components/cart-context";
import type { Pizza } from "@/types/pizza";

function renderPizzaCard(pizza: Pizza, featured?: boolean) {
  return render(
    <CartProvider>
      <PizzaCard pizza={pizza} featured={featured} />
    </CartProvider>,
  );
}

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

describe("PizzaCard", () => {
  it("renders the pizza name", () => {
    const pizza = createMockPizza({ name: "Pepperoni" });
    renderPizzaCard(pizza);

    expect(screen.getByText("Pepperoni")).toBeInTheDocument();
  });

  it("shows the lowest size price as the starting price", () => {
    const pizza = createMockPizza({
      sizes: [
        { type: "small", price: 12, volume: 25 },
        { type: "medium", price: 18, volume: 30 },
        { type: "large", price: 22, volume: 35 },
      ],
    });
    renderPizzaCard(pizza);

    expect(screen.getByText("from CA$12")).toBeInTheDocument();
  });

  it("shows no badge when the pizza has no special flags", () => {
    const pizza = createMockPizza();
    renderPizzaCard(pizza);

    expect(screen.queryByText("Hit")).not.toBeInTheDocument();
    expect(screen.queryByText("New")).not.toBeInTheDocument();
    expect(screen.queryByText("Vegan")).not.toBeInTheDocument();
    expect(screen.queryByText("Gluten-Free")).not.toBeInTheDocument();
  });

  it("shows the Hit badge when isHit is true", () => {
    const pizza = createMockPizza({ isHit: true });
    renderPizzaCard(pizza);

    expect(screen.getByText("Hit")).toBeInTheDocument();
  });

  it("prioritizes the Hit badge over other flags", () => {
    const pizza = createMockPizza({
      isHit: true,
      isNovelty: true,
      isVegetarian: true,
    });
    renderPizzaCard(pizza);

    expect(screen.getByText("Hit")).toBeInTheDocument();
    expect(screen.queryByText("New")).not.toBeInTheDocument();
  });

  it("shows the Vegan badge when isVegetarian is true and no higher-priority flag is set", () => {
    const pizza = createMockPizza({ isVegetarian: true });
    renderPizzaCard(pizza);

    expect(screen.getByText("Vegan")).toBeInTheDocument();
  });
});

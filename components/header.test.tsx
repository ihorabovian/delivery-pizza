import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { SiteHeader } from "@/components/header";
import { CartProvider } from "@/components/cart-context";

function renderHeader() {
  return render(
    <CartProvider>
      <SiteHeader />
    </CartProvider>,
  );
}

describe("SiteHeader", () => {
  it("renders all category labels", () => {
    renderHeader();

    expect(screen.getAllByText("Pizzas").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Breakfast").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Wings").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Milkshakes").length).toBeGreaterThan(0);
  });

  it("highlights the first category as active by default", () => {
    renderHeader();

    const pizzaLinks = screen.getAllByText("Pizzas");
    for (const link of pizzaLinks) {
      expect(link.closest("a")).toHaveClass("bg-black");
    }
  });

  it("shows the cart total price", () => {
    renderHeader();

    expect(screen.getAllByText("CA$0").length).toBeGreaterThan(0);
  });
});

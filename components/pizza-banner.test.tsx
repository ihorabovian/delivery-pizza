import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { PizzaBanner } from "@/components/pizza-banner";

describe("PizzaBanner", () => {
  it("renders the banner text", () => {
    render(<PizzaBanner />);

    expect(
      screen.getByText("Enjoy our pizza from anywhere in the world"),
    ).toBeInTheDocument();
  });

  it("merges a custom className with the default styles", () => {
    render(<PizzaBanner className="custom-class" />);

    const container = screen.getByText(
      "Enjoy our pizza from anywhere in the world",
    ).parentElement;

    expect(container).toHaveClass("custom-class");
    expect(container).toHaveClass("relative");
    expect(container).toHaveClass("rounded-[28px]");
  });

  it("renders the banner image as decorative", () => {
    render(<PizzaBanner />);

    const image = screen.getByRole("presentation", { hidden: true });
    expect(image).toHaveAttribute("alt", "");
  });
});

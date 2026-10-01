import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { SiteFooter } from "@/components/footer";
import { PIZZA_CATEGORIES, PIZZA_CATEGORY_LABELS } from "@/lib/constants";

describe("SiteFooter", () => {
  it("renders a menu link for every pizza category", () => {
    render(<SiteFooter />);

    for (const category of PIZZA_CATEGORIES) {
      const label = PIZZA_CATEGORY_LABELS[category];
      const link = screen.getByRole("link", { name: label });
      expect(link).toHaveAttribute("href", `/#${category}`);
    }
  });

  it("renders the contact links", () => {
    render(<SiteFooter />);

    expect(screen.getByText("Customer support")).toBeInTheDocument();
    expect(screen.getByText("Email us")).toBeInTheDocument();
    expect(screen.getByText("Feedback")).toBeInTheDocument();
    expect(screen.getByText("Contacts")).toBeInTheDocument();
  });

  it("renders the worldwide delivery message", () => {
    render(<SiteFooter />);

    expect(screen.getByText("Pizza delivery worldwide")).toBeInTheDocument();
  });

  it("renders the theme toggle buttons", () => {
    render(<SiteFooter />);

    expect(
      screen.getByRole("radio", { name: "Light theme" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("radio", { name: "System theme" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("radio", { name: "Dark theme" }),
    ).toBeInTheDocument();
  });
});

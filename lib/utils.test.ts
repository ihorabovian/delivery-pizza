import { describe, it, expect } from "vitest";
import { formatPrice } from "@/lib/utils";

describe("formatPrice", () => {
  it("formats a positive price as whole CAD dollars", () => {
    expect(formatPrice(25)).toBe("CA$25");
  });

  it("formats zero as CA$0", () => {
    expect(formatPrice(0)).toBe("CA$0");
  });

  it("rounds to the nearest whole dollar", () => {
    expect(formatPrice(19.99)).toBe("CA$20");
  });

  it("formats large prices with a thousands separator", () => {
    expect(formatPrice(1000)).toBe("CA$1,000");
  });
});

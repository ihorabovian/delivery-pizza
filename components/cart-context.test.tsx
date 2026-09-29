import { describe, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { CartProvider, useCart } from "@/components/cart-context";

describe("useCart", () => {
  it("throws when used outside of a CartProvider", () => {
    expect(() => renderHook(() => useCart())).toThrow(
      "useCart must be used within CartProvider",
    );
  });

  it("starts with an empty cart", () => {
    const { result } = renderHook(() => useCart(), {
      wrapper: CartProvider,
    });

    expect(result.current.itemCount).toBe(0);
    expect(result.current.totalPrice).toBe(0);
  });

  it("increments itemCount and totalPrice when adding an item", () => {
    const { result } = renderHook(() => useCart(), {
      wrapper: CartProvider,
    });

    act(() => {
      result.current.addItem(25);
    });

    expect(result.current.itemCount).toBe(1);
    expect(result.current.totalPrice).toBe(25);
  });

  it("accumulates multiple items", () => {
    const { result } = renderHook(() => useCart(), {
      wrapper: CartProvider,
    });

    act(() => {
      result.current.addItem(25);
      result.current.addItem(15);
      result.current.addItem(10);
    });

    expect(result.current.itemCount).toBe(3);
    expect(result.current.totalPrice).toBe(50);
  });
});

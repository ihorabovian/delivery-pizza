import "@testing-library/jest-dom";
import { vi } from "vitest";
import type { ImageProps } from "next/image";

vi.mock("next/image", () => ({
  default: ({
    src,
    alt,
    fill,
    sizes,
    className,
  }: ImageProps) => {
    const resolvedSrc =
      typeof src === "string"
        ? src
        : "default" in src
          ? src.default.src
          : src.src;
    void fill;
    void sizes;
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={resolvedSrc} alt={alt} className={className} />;
  },
}));

class MockIntersectionObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

class MockResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

global.IntersectionObserver =
  MockIntersectionObserver as unknown as typeof IntersectionObserver;
global.ResizeObserver =
  MockResizeObserver as unknown as typeof ResizeObserver;

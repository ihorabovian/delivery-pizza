# AGENTS.md

## Overview

Pizza delivery storefront (catalog browsing, currently no checkout/ordering flow yet). Next.js 16.3.5 App Router, React 19, TypeScript, Tailwind CSS v4, shadcn/ui (radix-ui based).

## Commands

- `npm run dev` — start dev server
- `npm run build` — production build
- `npm run lint` — ESLint

## Architecture

- `app/page.tsx` — server component. Fetches the pizza catalog and renders it grouped by category (pizza, breakfast, wings, milkshake).
- `app/layout.tsx` — root layout (fonts, `CatalogProvider`).
- `lib/api.ts` — data layer. `fetchPizzaCatalog()` hits `${NEXT_PUBLIC_API_URL}/pizzas/catalog` (revalidate: 60s), returns `Pizza[]`. Also has `getStartingPrice`, `getPizzaImageUrl`, `groupPizzasByCategory`.
- `lib/constants.ts` — `PIZZA_CATEGORIES` order + `PIZZA_CATEGORY_LABELS`.
- `lib/utils.ts` — `cn` (re-exported from `cn` package, not the usual clsx+tailwind-merge local helper), `formatPrice` (CAD currency formatting, e.g. `CA$25`).
- `types/pizza.ts` — `Pizza`, `PizzaSize`, `PizzaOption`, `PizzaIngredient`, `PizzaCategory` types. This is the source of truth for catalog shape.
- `types/cart.ts` — currently empty, cart types not yet defined.
- `stores/cart-store.ts` — Zustand `useCartStore` (items, addItem, removeItem, updateQuantity, clearCart) + `selectItemCount`/`selectTotalPrice`.
- `stores/address-store.ts` — Zustand `useAddressStore` (address, setAddress).
- `stores/order-store.ts` — Zustand `useOrderStore` (orders, addOrder, cancelOrder) + `isActiveOrder`. Orders are saved on successful (demo) payment.
- `stores/user-store.ts` — Zustand `useUserStore` (name, phone, email, updateProfile, resetProfile). Local profile on this level (no sign-in yet; backend `/api/users/profile` needs auth).
- `stores/card-store.ts` — Zustand `useCardStore` (cards, addCard, removeCard). Only the last 4 digits are saved, on successful payment.
- `app/(site)/profile` + `components/profile-view.tsx` — profile page: orders/cards tabs, `profile-edit-sheet.tsx`, `confirm-dialog.tsx` (logout, delete card).
- Cart, address, orders, user and cards persist to `localStorage` via `persist` with `skipHydration` and the shared `persistStorage` (`stores/storage.ts`); `components/store-rehydrate.tsx` restores them after mount. Use `useHydrated(store.persist)` (`stores/use-hydrated.ts`) before rendering persisted data.
- `components/catalog-context.tsx` — `CatalogProvider`/`useCatalog`: passes the server-fetched catalog to client components. Server data, not client state, so it stays a context.
- `components/pizza-card.tsx`, `components/pizza-details-dialog.tsx` — catalog card + detail dialog.
- `components/header.tsx`, `components/footer.tsx` — layout chrome.
- `components/ui/*` — shadcn/ui primitives (button, dialog, badge, toggle, toggle-group).

## Conventions

- Env var `NEXT_PUBLIC_API_URL` points to the backend serving `/pizzas/catalog`; image paths from the API may be relative and must go through `getPizzaImageUrl`.
- Prices are always in cents-free integers (whole CAD dollars) — `formatPrice` has no decimals.
- Server components fetch data (`app/page.tsx`); client components (`"use client"`) hold interaction state (cart, dialogs).

## Notes

- `.agents/` directory is gitignored — contains AI agent skills only
- Branch: `junior`

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

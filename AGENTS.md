# AGENTS.md

## Overview

Pizza delivery storefront: catalog, cart, checkout with orders created on the backend, demo card payment, OTP sign-in and a profile. Next.js 16.3.8 App Router, React 19, TypeScript, Tailwind CSS v4, shadcn/ui (radix-ui based).

## Commands

- `npm run dev` — start dev server
- `npm run build` — production build
- `npm run lint` — ESLint

## Rules

### Approach

- If an available skill fits the task, use it.
- Read the surrounding code before changing it, and match its style: naming, structure, comment density.
- Do what was asked and nothing more. If you notice something else worth fixing, mention it instead of changing it silently.
- When requirements are unclear or conflict (design vs. API, task vs. existing code), ask instead of guessing.
- For an unfamiliar library or a new major version, check its docs before writing code from memory.

### Code quality

- Keep code readable: separate logical blocks with blank lines, use clear names, avoid deep nesting.
- Don't copy-paste. Once something repeats three or more times, extract a function, component or constant.
- Keep a constant next to where it's used; move it to a shared file only when several places need it.
- No magic values (colors, numbers, strings) inline when a token or constant exists for them.
- Comments explain why, not what. Mark temporary workarounds with `// TODO` and the reason.
- Never put secrets or keys in client code or in git.

### Verification

- After changes, run the type check and the linter. Don't call something done without checking it.
- Check UI changes visually when you can.
- Be explicit about what was verified and what wasn't.

### Git

- Keep commits small and logical, each one building on its own. Use Conventional Commits for messages.
- Never force-push or rewrite pushed history unless explicitly asked.
- Ask before deleting files.

### Communication

- Keep answers short and to the point, and explain things clearly and simply.
- Don't repeat what was already said or restate the obvious.

## Architecture

- `app/(site)/page.tsx` — server component. Fetches the pizza catalog and renders it grouped by category (pizza, breakfast, wings, milkshake).
- `app/(site)/layout.tsx` — root layout for regular pages (fonts, header/footer, `CatalogProvider`).
- `lib/api.ts` — data layer. `fetchPizzaCatalog()` hits `${NEXT_PUBLIC_API_URL}/pizzas/catalog` (revalidate: 60s), returns `Pizza[]`. Also has `getStartingPrice`, `getPizzaImageUrl`, `groupPizzasByCategory`, and auth calls `requestOtp`, `signIn`, `signOut` (sent as `x-application: mobile`, so the session token comes back in the body and goes out as `Authorization: Bearer`; the web cookie flow can't work because the API's CORS is `origin: *`).
- `lib/constants.ts` — shared domain constants: `PIZZA_CATEGORIES` order, `PIZZA_CATEGORY_LABELS`, `PIZZA_SIZE_LABELS`. Constants used by a single component stay in that component.
- `lib/utils.ts` — `cn` (re-exported from `cn` package, not the usual clsx+tailwind-merge local helper), `formatPrice` (CAD currency formatting, e.g. `CA$25`).
- `types/pizza.ts` — `Pizza`, `PizzaSize`, `PizzaOption`, `PizzaIngredient`, `PizzaCategory` types. This is the source of truth for catalog shape.
- `types/cart.ts` — cart item, order request/response and price calculation types (`CartItem`, `PizzaOrder`, `CalculateOrderResponse`, …).
- `types/auth.ts` — `AuthUser`, `SignInResponse`.
- `stores/cart-store.ts` — Zustand `useCartStore` (items, addItem, removeItem, updateQuantity, clearCart) + `selectItemCount`/`selectTotalPrice`.
- `stores/address-store.ts` — Zustand `useAddressStore` (address, setAddress).
- `stores/order-store.ts` — Zustand `useOrderStore` (orders, addOrder, cancelOrder) + `isActiveOrder`. Orders are saved on successful (demo) payment.
- `stores/user-store.ts` — Zustand `useUserStore` (name, phone, email, updateProfile, resetProfile). Still a local profile: it isn't synced with the backend `/users/profile` yet, even after sign-in.
- `stores/card-store.ts` — Zustand `useCardStore` (cards, addCard, removeCard). Only the last 4 digits are saved, on successful payment.
- `stores/auth-store.ts` — Zustand `useAuthStore` (token, user, setSession, signOut) + `selectIsAuthenticated`. Persisted; gates Edit profile, Log out and saved cards.
- `app/(standalone)/` — pages without the site header/footer, sharing one root layout: `payment`, `sign-in` (`components/sign-in-form.tsx`: phone → OTP code; codes are listed at `${NEXT_PUBLIC_API_URL}/otps`). `/sign-in?redirect=/path` returns there after sign-in.
- `app/(site)/profile` + `components/profile-view.tsx` — profile page: orders/cards tabs, `profile-edit-sheet.tsx`, `confirm-dialog.tsx` (logout, delete card).
- Cart, address, orders, user and cards persist to `localStorage` via `persist` with `skipHydration` and the shared `persistStorage` (`stores/storage.ts`); `components/store-rehydrate.tsx` restores them after mount. Use `useHydrated(store.persist)` (`stores/use-hydrated.ts`) before rendering persisted data.
- `components/catalog-context.tsx` — `CatalogProvider`/`useCatalog`: passes the server-fetched catalog to client components. Server data, not client state, so it stays a context.
- `components/pizza-card.tsx`, `components/pizza-details-dialog.tsx` — catalog card + detail dialog.
- `components/header.tsx`, `components/footer.tsx` — layout chrome.
- `components/ui/*` — shadcn/ui primitives (button, dialog, sheet, sonner, badge, toggle, toggle-group).

## Conventions

- Env var `NEXT_PUBLIC_API_URL` points to the backend serving `/pizzas/catalog`; image paths from the API may be relative and must go through `getPizzaImageUrl`.
- Styling: brand orange is the `brand` theme color (`bg-brand`, `text-brand`), never a raw hex. Large pill buttons are `<Button variant="brand" size="xl">` (or `size="xl"` with another variant). Page width/gutters come from the `page-container` utility in `app/globals.css`.
- Prices are always in cents-free integers (whole CAD dollars) — `formatPrice` has no decimals.
- Server components fetch data (`app/(site)/page.tsx`); client components (`"use client"`) hold interaction state (cart, dialogs).

## Notes

- `.agents/` directory is gitignored — contains AI agent skills only
- Branch: `senior`

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

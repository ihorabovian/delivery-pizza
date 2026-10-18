# Pizza Delivery

A pizza delivery storefront: browse the catalog, build a cart, check out with an order created on the backend, pay with a demo card, sign in with an OTP code and manage your profile.

Built as the **Pizza delivery** task of the [Juniors Bootcamp](https://bootcamp-website-kappa.vercel.app/tasks/pizza), covering all three levels (junior, middle, senior).

**Live demo:** https://delivery-pizza-hwwfcjgjz-abovyan1903-4839s-projects.vercel.app/

## Links

- [Live demo](https://delivery-pizza-hwwfcjgjz-abovyan1903-4839s-projects.vercel.app/)
- [Task description](https://bootcamp-website-kappa.vercel.app/tasks/pizza)
- [Backend (API docs)](https://juniorbootcamp-backend.onrender.com/api/rest#description/introduction)
- [Design (Figma UI kit)](https://www.figma.com/design/dTtlKirZNUvr9POVt2lcRA/Juniors-Bootcamp-UI-kit?node-id=40005909-3917&p=f&t=zBKRByx0LcBaMhiH-0)

## The task

Launch a pizza service with a menu, order customization, a cart and checkout. The task focuses on the visual side, the cart and the sequence of steps from start to finish.

| Level  | Scope                                                                     |
| ------ | ------------------------------------------------------------------------- |
| Junior | Minimum viable result: the main screens and the key scenario.             |
| Middle | The full user flow, including payment.                                    |
| Senior | Adds authentication, a profile and order history, where the API allows it. |

## Features

- **Catalog** — pizzas, breakfast, wings and milkshakes grouped by category, with a details dialog (size, dough, ingredients).
- **Cart** — add, remove and change quantity; the total is calculated by the backend.
- **Checkout** — delivery address with geocoding autocomplete, contact details and order creation.
- **Payment** — demo card payment; a card can be saved for later.
- **Auth** — phone number + OTP code sign-in, session kept in the browser.
- **Profile** — edit name, phone and email; order history and saved cards.
- **Orders** — guests get a local order history; signed-in users get orders from the backend.

## Tech stack

- [Next.js](https://nextjs.org) 16 (App Router), React 19, TypeScript
- Tailwind CSS v4, [shadcn/ui](https://ui.shadcn.com) (Radix UI)
- [Zustand](https://zustand.docs.pmnd.rs) for client state (cart, address, orders, auth)
- Vitest + Testing Library, Storybook
- Deployed on [Vercel](https://vercel.com); backend hosted on Render

## Getting started

Requirements: Node.js 20+ and npm.

```bash
npm install
# create a .env file with the variables below
npm run dev
```

The dev server runs at http://localhost:3003.

### Environment variables

| Variable              | Description                                                             |
| --------------------- | ----------------------------------------------------------------------- |
| `NEXT_PUBLIC_API_URL` | Backend base URL, e.g. `https://juniorbootcamp-backend.onrender.com/api` |
| `GEOAPIFY_API_KEY`    | [Geoapify](https://www.geoapify.com) key used by the address autocomplete (server-side only) |

> The backend runs on a free Render plan, so the first request after a pause can take up to a minute.

## Scripts

| Command                | Description                  |
| ---------------------- | ---------------------------- |
| `npm run dev`          | Start the dev server         |
| `npm run build`        | Production build             |
| `npm run start`        | Run the production build     |
| `npm run lint`         | Run ESLint                   |
| `npm run test:run`     | Run unit tests once          |
| `npm run storybook`    | Start Storybook on port 6006 |

## Project structure

```
app/(site)/          Pages with the header and footer: catalog, checkout, orders, profile
app/(standalone)/    Pages without the site chrome: payment, sign-in
app/api/geocode/     Server route for address autocomplete
components/          UI components (components/ui holds shadcn/ui primitives)
lib/                 API client, constants and helpers
stores/              Zustand stores
types/               Shared TypeScript types
```

Authorized requests (profile, orders, cards) go through the same-origin `/backend/*` rewrite in `next.config.ts`, because the API's CORS allows only `GET`, `HEAD` and `POST`.

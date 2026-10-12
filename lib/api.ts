import type { Pizza, PizzaCategory } from "@/types/pizza";
import type { SavedCard } from "@/types/card";
import type {
  AuthUser,
  SignInResponse,
  UpdateProfileRequest,
} from "@/types/auth";
import type {
  CalculateOrderResponse,
  CreatePizzaPaymentRequest,
  PizzaOrder,
  PizzaOrderedItem,
} from "@/types/cart";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function fetchPizzaCatalog(): Promise<Pizza[]> {
  const response = await fetch(`${API_URL}/pizzas/catalog`, {
    next: { revalidate: 60 },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch pizza catalog");
  }

  const data = await response.json();

  return data.catalog;
}

export function getStartingPrice(pizza: Pizza): number {
  return Math.min(...pizza.sizes.map((size) => size.price));
}

export function getPizzaImageUrl(path: string): string {
  return path.startsWith("http") ? path : `${API_URL}${path}`;
}

export async function calculatePizzaOrder(
  items: PizzaOrderedItem[],
): Promise<CalculateOrderResponse> {
  const response = await fetch(`${API_URL}/pizzas/calculate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ items }),
  });

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(getErrorMessage(data) || "Failed to calculate order");
  }

  return data;
}

export async function createPizzaPayment(
  request: CreatePizzaPaymentRequest,
): Promise<PizzaOrder> {
  const response = await fetch(`${API_URL}/pizzas/payment`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
  });

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(getErrorMessage(data) || "Failed to create order");
  }

  return data.order;
}

// Paying the order's transaction moves the order out of "awaiting_payment";
// only then the backend lists it. A new card is saved to the order's phone.
export async function payTransaction(request: {
  transactionId: string;
  pan: string;
  expireDate: string;
  cvv: string;
  saveCard: boolean;
}): Promise<void> {
  const response = await fetch(`${API_URL}/transactions/pay`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...request, method: "new_card" }),
  });

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(getErrorMessage(data) || "Payment failed");
  }
}

// Sends a one-time code to the phone; resolves with the resend delay in ms.
// The code itself is shown on the backend's OTP codes page (see OTP_CODES_URL).
export async function requestOtp(phone: string): Promise<number> {
  const response = await fetch(`${API_URL}/otps/otp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ phone }),
  });

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(getErrorMessage(data) || "Failed to send code");
  }

  return data.retryDelay;
}

// The backend's "web" client gets an httpOnly cookie, which needs CORS with
// credentials (the API allows any origin, so it can't). "mobile" returns the
// session token in the body instead; it is sent back as a Bearer header.
const AUTH_CLIENT_HEADERS = { "x-application": "mobile" };

export async function signIn(
  phone: string,
  code: number,
): Promise<SignInResponse> {
  const response = await fetch(`${API_URL}/auth/sign-in`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...AUTH_CLIENT_HEADERS },
    body: JSON.stringify({ phone, code }),
  });

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(getErrorMessage(data) || "Failed to sign in");
  }

  return data;
}

export async function signOut(token: string): Promise<void> {
  await fetch(`${API_URL}/auth/sign-out`, {
    method: "POST",
    headers: { ...AUTH_CLIENT_HEADERS, Authorization: `Bearer ${token}` },
  });
}

export const OTP_CODES_URL = `${API_URL}/otps`;

// Business errors come as `reason`, validation errors as `message` (string or string[])
function getErrorMessage(data: {
  reason?: string;
  message?: string | string[];
}) {
  return data.reason ?? [data.message].flat().join(", ");
}

export function groupPizzasByCategory(
  pizzas: Pizza[],
): Record<PizzaCategory, Pizza[]> {
  const groups: Record<PizzaCategory, Pizza[]> = {
    pizza: [],
    breakfast: [],
    wings: [],
    milkshake: [],
  };

  for (const pizza of pizzas) {
    groups[pizza.category].push(pizza);
  }

  return groups;
}

// Same-origin proxy to the API (see next.config.ts); authorized requests
// include PATCH and DELETE, which the API's CORS doesn't allow
const PROXY_URL = "/backend";

async function requestAuthorized(
  token: string,
  path: string,
  init: RequestInit,
  fallbackMessage: string,
) {
  const response = await fetch(`${PROXY_URL}${path}`, {
    ...init,
    headers: {
      // The API rejects a JSON content type without a body (cancel, delete)
      ...(init.body ? { "Content-Type": "application/json" } : {}),
      ...AUTH_CLIENT_HEADERS,
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(getErrorMessage(data) || fallbackMessage);
  }

  return data;
}

export async function fetchProfile(token: string): Promise<AuthUser> {
  const data = await requestAuthorized(
    token,
    "/users/profile",
    {},
    "Failed to load profile",
  );
  return data.user;
}

export async function updateProfile(
  token: string,
  profile: UpdateProfileRequest,
): Promise<AuthUser> {
  const data = await requestAuthorized(
    token,
    "/users/profile",
    { method: "PATCH", body: JSON.stringify(profile) },
    "Failed to update profile",
  );
  return data.user;
}

export async function fetchPizzaOrders(token: string): Promise<PizzaOrder[]> {
  const data = await requestAuthorized(
    token,
    "/pizzas/orders",
    {},
    "Failed to load orders",
  );
  return data.orders;
}

export async function cancelPizzaOrder(
  token: string,
  orderId: string,
): Promise<PizzaOrder> {
  const data = await requestAuthorized(
    token,
    `/pizzas/orders/${orderId}/cancel`,
    { method: "PATCH" },
    "Failed to cancel order",
  );
  return data.order;
}

export async function fetchCards(token: string): Promise<SavedCard[]> {
  const data = await requestAuthorized(
    token,
    "/cards/cards",
    {},
    "Failed to load cards",
  );
  return data.cards;
}

export async function deleteCard(token: string, id: string): Promise<void> {
  await requestAuthorized(
    token,
    `/cards/cards/${id}`,
    { method: "DELETE" },
    "Failed to delete card",
  );
}

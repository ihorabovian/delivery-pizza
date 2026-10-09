export { cn } from "cn";

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: "CAD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })
    .format(price)
    .replace("$", "CA$");
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// The backend has no order number, only a Mongo _id; show its last 4 digits.
// Display only: links and lookups keep the full _id.
export function formatOrderNumber(id: string): string {
  const digits = id.replace(/\D/g, "");
  return digits.length >= 4 ? digits.slice(-4) : id.slice(-4).toUpperCase();
}

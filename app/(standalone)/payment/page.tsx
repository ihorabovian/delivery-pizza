import type { Metadata } from "next";
import { PaymentForm } from "@/components/payment-form";

export const metadata: Metadata = {
  title: "Payment",
};

export default async function PaymentPage({
  searchParams,
}: {
  searchParams: Promise<{ amount?: string; order?: string }>;
}) {
  const params = await searchParams;
  const amount = Number(params.amount) || 0;
  const orderNumber = params.order ?? "----";

  return (
    <main className="flex min-h-full items-center justify-center px-4 py-16">
      <PaymentForm amount={amount} orderNumber={orderNumber} />
    </main>
  );
}

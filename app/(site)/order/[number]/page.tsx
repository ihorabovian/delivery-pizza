import { OrderStatus } from "@/components/order-status";

export default async function OrderPage({
  params,
}: {
  params: Promise<{ number: string }>;
}) {
  const { number } = await params;

  return <OrderStatus number={number} />;
}

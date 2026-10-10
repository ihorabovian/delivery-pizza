import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { cn, formatDate, formatOrderNumber, formatPrice } from "@/lib/utils";
import type { Order } from "@/stores/order-store";

export function OrderCard({
  order,
  onCancel,
  className,
}: {
  order: Order;
  // Shown only when passed, e.g. for active orders
  onCancel?: () => void;
  className?: string;
}) {
  return (
    <article
      className={cn(
        "flex flex-col gap-4 rounded-3xl bg-muted p-6",
        className,
      )}
    >
      <div className="flex flex-col">
        <span className="text-sm text-muted-foreground">
          Order №{formatOrderNumber(order.number)}
        </span>
        <span>{formatDate(new Date(order.createdAt))}</span>
      </div>

      <ul className="flex flex-col gap-4">
        {order.items.map((item) => (
          <li key={item.id} className="flex items-center gap-4">
            <Image
              src={item.img}
              alt={item.name}
              width={66}
              height={69}
              className="size-16 shrink-0 object-contain"
            />
            <div className="flex flex-col">
              <span>{formatPrice(item.price * item.quantity)}</span>
              <span>{item.name}</span>
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-auto flex flex-col">
        <span className="text-sm text-muted-foreground">Total</span>
        <span className="text-2xl">{formatPrice(order.total)}</span>
      </div>

      <div className="flex flex-col gap-2">
        <Button
          variant="brand"
          asChild
          size="xl"
          className="w-full"
        >
          <Link href={`/order/${order.number}`}>Details</Link>
        </Button>
        {onCancel && (
          <Button
            variant="outline"
            size="xl"
            onClick={onCancel}
            className="w-full bg-transparent"
          >
            Cancel order
          </Button>
        )}
      </div>
    </article>
  );
}

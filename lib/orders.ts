import { getPizzaImageUrl } from "@/lib/api";
import { getItemPrice, getItemSummary } from "@/lib/pizza-item";
import type { Order } from "@/stores/order-store";
import type { CartItem, PizzaOrder } from "@/types/cart";
import type { Pizza } from "@/types/pizza";

// The backend stores only ids, so names, images and prices come from the catalog
function toCartItem(
  item: PizzaOrder["items"][number],
  catalog: Pizza[],
): CartItem | null {
  const pizza = catalog.find((entry) => entry._id === item._id);
  // An item removed from the catalog can't be shown
  if (!pizza) return null;

  const size = pizza.sizes.find((entry) => entry.type === item.size);
  const option = pizza.options.find((entry) => entry.type === item.option);
  const toppings = pizza.ingredients.filter((entry) =>
    item.toppings.includes(entry.type),
  );

  return {
    id: `${pizza._id}-${item.size}-${item.option ?? ""}-${item.toppings.join(",")}`,
    pizzaId: pizza._id,
    category: pizza.category,
    size: item.size,
    option: item.option ?? "",
    toppings: item.toppings,
    name: pizza.name,
    img: getPizzaImageUrl(pizza.img),
    summary: getItemSummary(size, option, toppings),
    description: pizza.description,
    price: getItemPrice(size, option, toppings),
    quantity: item.quantity,
  };
}

// Every other backend status (in_processing, waiting_courier, on_my_way) is active
const ORDER_STATUSES: Record<string, Order["status"]> = {
  success: "delivered",
  canceled: "cancelled",
};

export function toOrder(order: PizzaOrder, catalog: Pizza[]): Order {
  const { street, house } = order.receiverAddress;

  return {
    number: order._id,
    items: order.items
      .map((item) => toCartItem(item, catalog))
      .filter((item) => item !== null),
    total: order.totalPrice,
    address: [street, house].filter(Boolean).join(" "),
    createdAt: order.createdAt,
    status: ORDER_STATUSES[order.status] ?? "active",
    cancellable: order.cancellable,
  };
}

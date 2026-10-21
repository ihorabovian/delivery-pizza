import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { fn } from "storybook/test";
import { OrderCard } from "./order-card";
import type { Order } from "@/stores/order-store";

const mockOrder: Order = {
  number: "6a8c5c84535e32ef90471234",
  createdAt: "2026-10-19T12:30:00.000Z",
  address: "Main street 12, apt 4",
  total: 45,
  status: "active",
  items: [
    {
      id: "1",
      pizzaId: "6a8c5c84535e32ef904750e9",
      category: "pizza",
      size: "medium",
      option: "traditional_crust",
      toppings: [],
      name: "Pepperoni Passion",
      img: "https://juniorsbootcamp.ru/api/static/images/pizza/dzhuni_picca.webp",
      summary: "Medium, traditional crust",
      description: "",
      price: 20,
      quantity: 1,
    },
    {
      id: "2",
      pizzaId: "6a8c5c84535e32ef904750ea",
      category: "pizza",
      size: "large",
      option: "thin_crust",
      toppings: [],
      name: "Four Cheese",
      img: "https://juniorsbootcamp.ru/api/static/images/pizza/chetyre_syra.webp",
      summary: "Large, thin crust",
      description: "",
      price: 25,
      quantity: 1,
    },
  ],
};

const meta = {
  title: "Components/OrderCard",
  component: OrderCard,
  parameters: { layout: "centered" },
  decorators: [
    (Story) => (
      <div className="w-80">
        <Story />
      </div>
    ),
  ],
  args: { order: mockOrder },
} satisfies Meta<typeof OrderCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Active: Story = {
  args: { onCancel: fn() },
};

export const Delivered: Story = {
  args: { order: { ...mockOrder, status: "delivered" } },
};

export const Cancelled: Story = {
  args: { order: { ...mockOrder, status: "cancelled" } },
};

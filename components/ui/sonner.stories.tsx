import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { toast } from "sonner";
import { Button } from "./button";
import { Toaster } from "./sonner";

const meta = {
  title: "UI/Sonner",
  component: Toaster,
  parameters: { layout: "centered" },
  decorators: [
    (Story) => (
      <>
        <Story />
        <Toaster position="top-center" />
      </>
    ),
  ],
} satisfies Meta<typeof Toaster>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Toasts: Story = {
  render: () => (
    <div className="flex gap-4">
      <Button variant="outline" onClick={() => toast.success("Added to cart")}>
        Success
      </Button>
      <Button variant="outline" onClick={() => toast.error("Payment failed")}>
        Error
      </Button>
      <Button variant="outline" onClick={() => toast("Order placed")}>
        Default
      </Button>
    </div>
  ),
};

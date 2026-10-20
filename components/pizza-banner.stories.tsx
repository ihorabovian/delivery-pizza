import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { PizzaBanner } from "./pizza-banner";

const meta = {
  title: "Components/PizzaBanner",
  component: PizzaBanner,
  parameters: { layout: "centered" },
  // The banner is hidden below the lg breakpoint
  globals: { viewport: { value: "desktop", isRotated: false } },
} satisfies Meta<typeof PizzaBanner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

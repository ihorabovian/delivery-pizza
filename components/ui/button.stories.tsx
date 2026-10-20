import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Button } from "./button";

const VARIANTS = [
  "default",
  "brand",
  "secondary",
  "outline",
  "ghost",
  "destructive",
  "link",
] as const;

const SIZES = ["xs", "sm", "default", "lg", "xl"] as const;

const meta = {
  title: "UI/Button",
  component: Button,
  args: { children: "Add to cart" },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Brand: Story = {
  args: { variant: "brand", size: "xl" },
};

export const Disabled: Story = {
  args: { variant: "brand", size: "xl", disabled: true },
};

export const Variants: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-center gap-4">
      {VARIANTS.map((variant) => (
        <Button key={variant} {...args} variant={variant}>
          {variant}
        </Button>
      ))}
    </div>
  ),
};

export const Sizes: Story = {
  args: { variant: "brand" },
  render: (args) => (
    <div className="flex flex-wrap items-center gap-4">
      {SIZES.map((size) => (
        <Button key={size} {...args} size={size}>
          {size}
        </Button>
      ))}
    </div>
  ),
};

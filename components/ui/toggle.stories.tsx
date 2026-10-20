import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Toggle } from "./toggle";

const meta = {
  title: "UI/Toggle",
  component: Toggle,
  args: { children: "Extra cheese" },
} satisfies Meta<typeof Toggle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Outline: Story = {
  args: { variant: "outline" },
};

export const Pressed: Story = {
  args: { variant: "outline", defaultPressed: true },
};

export const Disabled: Story = {
  args: { variant: "outline", disabled: true },
};

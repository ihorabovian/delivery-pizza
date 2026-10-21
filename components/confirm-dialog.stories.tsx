import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { fn } from "storybook/test";
import { ConfirmDialog } from "./confirm-dialog";

const meta = {
  title: "Components/ConfirmDialog",
  component: ConfirmDialog,
  args: {
    open: true,
    onOpenChange: fn(),
    onConfirm: fn(),
  },
} satisfies Meta<typeof ConfirmDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Logout: Story = {
  args: { title: "Log out of your account?", confirmLabel: "Log out" },
};

export const DeleteCard: Story = {
  args: { title: "Delete this card?", confirmLabel: "Delete" },
};

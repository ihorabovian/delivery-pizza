import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ToggleGroup, ToggleGroupItem } from "./toggle-group";

const meta = {
  title: "UI/ToggleGroup",
  component: ToggleGroup,
  args: { type: "single", variant: "outline", defaultValue: "medium" },
  render: (args) => (
    <ToggleGroup {...args}>
      <ToggleGroupItem value="small">Small</ToggleGroupItem>
      <ToggleGroupItem value="medium">Medium</ToggleGroupItem>
      <ToggleGroupItem value="large">Large</ToggleGroupItem>
    </ToggleGroup>
  ),
} satisfies Meta<typeof ToggleGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Single: Story = {};

export const Joined: Story = {
  args: { spacing: 0 },
};

export const Vertical: Story = {
  args: { orientation: "vertical" },
};

import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { PizzaCard } from "./pizza-card";
import { Toaster } from "@/components/ui/sonner";
import type { Pizza } from "@/types/pizza";

const mockPizza: Pizza = {
  _id: "6a8c5c84535e32ef904750e9",
  category: "pizza",
  name: "Pepperoni Passion",
  description:
    "Classic pizza with spicy pepperoni, mozzarella cheese, and rich tomato sauce on hand-tossed dough.",
  img: "https://juniorsbootcamp.ru/api/static/images/pizza/dzhuni_picca.webp",
  sizes: [
    { type: "small", price: 15, volume: 25 },
    { type: "medium", price: 20, volume: 30 },
    { type: "large", price: 25, volume: 35 },
  ],
  options: [
    { type: "traditional_crust", price: 0 },
    { type: "thin_crust", price: 0 },
    { type: "stuffed_crust", price: 4 },
  ],
  ingredients: [
    {
      type: "mozzarella",
      price: 2,
      img: "https://juniorsbootcamp.ru/api/static/images/ingredient/mozzarella.png",
    },
    {
      type: "pepperoni",
      price: 3,
      img: "https://juniorsbootcamp.ru/api/static/images/ingredient/peperoni.png",
    },
    {
      type: "mushrooms",
      price: 2,
      img: "https://juniorsbootcamp.ru/api/static/images/ingredient/mushrooms.png",
    },
  ],
  calories: 780,
  protein: "32g",
  totalFat: "28g",
  carbohydrates: "85g",
  sodium: "1150mg",
  allergens: ["Milk", "Wheat"],
  isVegetarian: false,
  isGlutenFree: false,
  isNovelty: false,
  isHit: false,
};

const meta = {
  title: "Components/PizzaCard",
  component: PizzaCard,
  parameters: {
    layout: "centered",
  },
  decorators: [
    (Story) => (
      <>
        <div className="w-52 p-4">
          <Story />
        </div>
        <Toaster position="top-center" />
      </>
    ),
  ],
} satisfies Meta<typeof PizzaCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    pizza: mockPizza,
    featured: false,
  },
};

export const HitBadge: Story = {
  args: {
    pizza: {
      ...mockPizza,
      isHit: true,
    },
    featured: false,
  },
};

export const NoveltyBadge: Story = {
  args: {
    pizza: {
      ...mockPizza,
      name: "Four Cheese",
      img: "https://juniorsbootcamp.ru/api/static/images/pizza/chetyre_syra.webp",
      isNovelty: true,
    },
    featured: false,
  },
};

export const VeganBadge: Story = {
  args: {
    pizza: {
      ...mockPizza,
      name: "Margherita Fresh",
      img: "https://juniorsbootcamp.ru/api/static/images/pizza/margarita.png",
      isVegetarian: true,
    },
    featured: false,
  },
};

export const GlutenFreeBadge: Story = {
  args: {
    pizza: {
      ...mockPizza,
      name: "Veggie Delight",
      isGlutenFree: true,
    },
    featured: false,
  },
};

export const Featured: Story = {
  args: {
    pizza: {
      ...mockPizza,
      name: "Chef's Special Pizza",
      isHit: true,
    },
    featured: true,
  },
};

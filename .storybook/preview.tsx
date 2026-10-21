import type { Decorator, Preview } from "@storybook/nextjs-vite";
import { Manrope } from "next/font/google";
import "../app/globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin", "cyrillic"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

// The app themes via the `dark` class on <html>, so the toolbar does the same
const withTheme: Decorator = (Story, context) => {
  document.documentElement.classList.toggle(
    "dark",
    context.globals.theme === "dark",
  );

  return (
    <div className={`${manrope.variable} font-sans`}>
      <Story />
    </div>
  );
};

const preview: Preview = {
  decorators: [withTheme],
  globalTypes: {
    theme: {
      description: "Color theme",
      toolbar: {
        icon: "circlehollow",
        items: ["light", "dark"],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: { theme: "light" },
  parameters: {
    backgrounds: { disabled: true },
  },
};

export default preview;

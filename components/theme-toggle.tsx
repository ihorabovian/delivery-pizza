"use client";

import { useEffect, useState } from "react";
import { Monitor, Moon, Sun } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

type Theme = "light" | "system" | "dark";

function applyTheme(theme: Theme) {
  const isDark =
    theme === "dark" ||
    (theme === "system" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches);
  document.documentElement.classList.toggle("dark", isDark);
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("system");

  useEffect(() => {
    const stored = localStorage.getItem("theme") as Theme | null;
    if (stored) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- hydrating from localStorage after mount, matches SSR default first render
      setTheme(stored);
    }
  }, []);

  const handleChange = (value: string) => {
    if (!value) return;
    const next = value as Theme;
    setTheme(next);
    localStorage.setItem("theme", next);
    applyTheme(next);
  };

  return (
    <ToggleGroup
      type="single"
      value={theme}
      onValueChange={handleChange}
      className="gap-1 rounded-full bg-white p-1"
    >
      <ToggleGroupItem
        value="light"
        aria-label="Light theme"
        size="sm"
        className="rounded-full data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
      >
        <Sun className="size-4" />
      </ToggleGroupItem>
      <ToggleGroupItem
        value="system"
        aria-label="System theme"
        size="sm"
        className="rounded-full data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
      >
        <Monitor className="size-4" />
      </ToggleGroupItem>
      <ToggleGroupItem
        value="dark"
        aria-label="Dark theme"
        size="sm"
        className="rounded-full data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
      >
        <Moon className="size-4" />
      </ToggleGroupItem>
    </ToggleGroup>
  );
}

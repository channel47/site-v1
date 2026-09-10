"use client";

import { useSyncExternalStore } from "react";
import { Moon, Sun } from "@phosphor-icons/react";
import { getResolvedTheme, subscribeTheme } from "@/lib/theme";
import { toggleTheme } from "@/lib/theme-transition";

export function ThemeSwitcher() {
  const theme = useSyncExternalStore(subscribeTheme, getResolvedTheme, () => null);
  const label = theme === "dark" ? "Switch to light mode" : "Switch to dark mode";
  return (
    <button
      type="button"
      className="icon-btn utility-link theme-switch"
      aria-label={label}
      disabled={theme === null}
      onClick={(event) => toggleTheme(event.currentTarget)}
    >
      <span className="theme-glyph" data-theme-icon="light" aria-hidden="true"><Sun size={18} /></span>
      <span className="theme-glyph" data-theme-icon="dark" aria-hidden="true"><Moon size={18} /></span>
      <span className="control-caption" aria-hidden="true">{label}</span>
    </button>
  );
}

"use client";

import { useLayoutEffect } from "react";
import { watchTheme } from "@/lib/theme";

export function ThemeObserver() {
  // Also runs before paint when a client-side root error replaces the document.
  useLayoutEffect(watchTheme, []);
  return null;
}

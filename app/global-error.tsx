"use client";

import { RecoveryContent } from "@/components/site/recovery-content";
import { ThemeObserver } from "@/components/site/theme-observer";
import { THEME_BOOT } from "@/lib/theme";
import "./globals.css";

/** Root failures replace the layout, so this surface supplies its own theme. */
export default function GlobalError({ reset }: { reset: () => void }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>Page unavailable — Channel47</title>
        <meta name="theme-color" content="#f4f4f0" />
        <script dangerouslySetInnerHTML={{ __html: THEME_BOOT }} />
      </head>
      <body><ThemeObserver /><RecoveryContent retry={reset} /></body>
    </html>
  );
}

import type React from "react";
import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { JsonLd } from "@/components/site/json-ld";
import { BrowseNavigation } from "@/components/site/browse-navigation";
import { SkipLink } from "@/components/site/skip-link";
import { PageMotion } from "@/components/site/page-motion";
import { MotionBootstrap } from "@/components/site/motion-bootstrap";
import { SiteMeasurement } from "@/components/site/measurement";
import { getFeedItems } from "@/lib/content";
import { PUBLIC_PAGES } from "@/lib/discovery";
import { baseGraph, SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/seo";
import "./globals.css";

const sans = localFont({
  src: "./fonts/instrument-sans-latin.woff2",
  weight: "400 700",
  variable: "--font-instrument-sans",
  display: "swap",
});
const serif = localFont({
  src: [
    {
      path: "./fonts/instrument-serif-latin.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/instrument-serif-italic-latin.woff2",
      weight: "400",
      style: "italic",
    },
  ],
  variable: "--font-instrument-serif",
  display: "swap",
});

export const viewport: Viewport = {
  viewportFit: "cover",
  themeColor: "#f4f4f0",
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — things I’m making and figuring out`,
    template: `%s — ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  openGraph: {
    title: `${SITE_NAME} — things I’m making and figuring out`,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    siteName: SITE_NAME,
    type: "website",
  },
  icons: {
    icon: [
      { url: "/icon-light-32x32.png", media: "(prefers-color-scheme: light)" },
      { url: "/icon-dark-32x32.png", media: "(prefers-color-scheme: dark)" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: "/apple-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${sans.variable} ${serif.variable}`} suppressHydrationWarning>
      <head><MotionBootstrap /></head>
      <body>
        {/* Rendered here (not via `metadata.alternates`, which page-level
            canonicals would replace wholesale) — React hoists it to <head>. */}
        <link
          rel="alternate"
          type="application/rss+xml"
          title={SITE_NAME}
          href="/rss.xml"
        />
        {/* Site-wide entity graph (Organization + Person + WebSite) — see lib/seo.ts. */}
        <JsonLd data={baseGraph()} />
        <SiteMeasurement
          paths={[
            ...PUBLIC_PAGES.map((page) => page.path),
            ...getFeedItems().map((item) => item.href),
          ]}
        />
        <BrowseNavigation>
          <SkipLink />
          {children}
          <PageMotion />
        </BrowseNavigation>
      </body>
    </html>
  );
}

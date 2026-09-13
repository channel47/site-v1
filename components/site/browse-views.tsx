"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef } from "react";
import { List, SquaresFour } from "@phosphor-icons/react";
import { switchBrowseView } from "@/lib/browse-transition";

export type BrowseView = "collection" | "index";

export function BrowseViews({ current }: { current: BrowseView }) {
  const router = useRouter();
  const keyboard = useRef(false);
  const navigate = (event: { preventDefault: () => void }, href: string) => {
    event.preventDefault();
    switchBrowseView(href, () => router.push(href), keyboard.current);
  };
  return (
    <nav className="browse-views" data-view={current} aria-label="Browse views">
      <span className="browse-selection" aria-hidden="true" />
      <Link
        href="/"
        prefetch={true}
        className="icon-btn browse-view"
        aria-label="Collection — view as objects"
        aria-current={current === "collection" ? "page" : undefined}
        onClick={(event) => { keyboard.current = event.detail === 0; }}
        onNavigate={(event) => navigate(event, "/")}
      >
        <SquaresFour size={22} aria-hidden="true" />
        <span className="control-caption" aria-hidden="true">Collection</span>
      </Link>
      <Link
        href="/browse"
        prefetch={true}
        className="icon-btn browse-view"
        aria-label="Index — view as a list"
        aria-current={current === "index" ? "page" : undefined}
        onClick={(event) => { keyboard.current = event.detail === 0; }}
        onNavigate={(event) => navigate(event, "/browse")}
      >
        <List size={22} aria-hidden="true" />
        <span className="control-caption" aria-hidden="true">Index</span>
      </Link>
    </nav>
  );
}

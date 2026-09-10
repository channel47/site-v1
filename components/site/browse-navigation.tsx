"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { List, SquaresFour } from "@phosphor-icons/react";
import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ComponentProps,
  type ReactNode,
} from "react";
type Visit = { href: string; entry: string; scrollY: number };
const BrowseContext = createContext<{
  visit: Visit | null;
  remember: (entry: string) => void;
}>({ visit: null, remember: () => {} });
/** Preserve location and keyboard focus from both the object grid and index. */
export function BrowseNavigation({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [visit, setVisit] = useState<Visit | null>(null);
  const previousPath = useRef(pathname);
  useEffect(() => {
    const previous = previousPath.current;
    previousPath.current = pathname;
    if (
      !visit ||
      pathname === visit.entry.split("#")[0] ||
      pathname === previous
    )
      return;
    if (
      pathname === visit.href.split("?")[0] &&
      previous === visit.entry.split("#")[0]
    ) {
      const frame = requestAnimationFrame(() => {
        window.scrollTo({ top: visit.scrollY, behavior: "instant" });
        Array.from(
          document.querySelectorAll<HTMLAnchorElement>(
            ".st-row, .collection-link",
          ),
        )
          .find((link) => link.getAttribute("href") === visit.entry)
          ?.focus({ preventScroll: true });
        setVisit(null);
      });
      return () => cancelAnimationFrame(frame);
    }
    setVisit(null);
  }, [pathname, visit]);
  return (
    <BrowseContext.Provider
      value={{
        visit,
        remember: (entry) => {
          if (pathname === "/" || pathname === "/browse")
            setVisit({
              href: `${window.location.pathname}${window.location.search}`,
              entry,
              scrollY: window.scrollY,
            });
        },
      }}
    >
      {children}
    </BrowseContext.Provider>
  );
}
export function BrowseEntryLink(
  props: ComponentProps<typeof Link> & { href: string },
) {
  const { remember } = useContext(BrowseContext);
  return <Link {...props} onNavigate={() => remember(props.href)} />;
}
export function BackToBrowse({
  href,
  className,
}: {
  href: string;
  className?: string;
}) {
  const { visit } = useContext(BrowseContext);
  const pathname = usePathname();
  const router = useRouter();
  const returning = visit?.entry.split("#")[0] === pathname;
  const target = returning ? visit.href : href;
  const isIndex = target.startsWith("/browse");
  const label = isIndex ? "Index" : "Collection";
  const Icon = isIndex ? List : SquaresFour;
  return (
    <Link
      href={target}
      className={className}
      aria-label={`Back to ${label.toLowerCase()}`}
      onNavigate={
        returning
          ? (event) => {
              event.preventDefault();
              router.back();
            }
          : undefined
      }
    >
      <Icon size={18} aria-hidden="true" />
      <span>{label}</span>
    </Link>
  );
}

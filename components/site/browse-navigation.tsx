"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ArrowLeft, CaretRight, List, SquaresFour } from "@phosphor-icons/react";
import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ComponentProps,
  type ReactNode,
} from "react";
type Visit = { href: string; entry: string; scrollY: number; restoreFocus: boolean };
const BrowseContext = createContext<{
  visit: Visit | null;
  remember: (entry: string, restoreFocus: boolean) => void;
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
        if (visit.restoreFocus) {
          Array.from(
            document.querySelectorAll<HTMLAnchorElement>(
              ".st-row, .collection-link",
            ),
          )
            .find((link) => link.getAttribute("href") === visit.entry)
            ?.focus({ preventScroll: true });
        }
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
        remember: (entry, restoreFocus) => {
          if (pathname === "/" || pathname === "/browse")
            setVisit({
              href: `${window.location.pathname}${window.location.search}`,
              entry,
              scrollY: window.scrollY,
              restoreFocus,
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
  const keyboard = useRef(false);
  return (
    <Link
      {...props}
      onClick={(event) => {
        // Keyboard and assistive-technology activation have no pointer clicks.
        keyboard.current = event.detail === 0;
        props.onClick?.(event);
      }}
      onNavigate={() => remember(props.href, keyboard.current)}
    />
  );
}
export function BackToBrowse({
  href,
  className,
  breadcrumb = false,
}: {
  href: string;
  className?: string;
  breadcrumb?: boolean;
}) {
  const { visit } = useContext(BrowseContext);
  const pathname = usePathname();
  const router = useRouter();
  const returning = visit?.entry.split("#")[0] === pathname;
  const target = returning ? visit.href : href;
  const isIndex = target.startsWith("/browse");
  const label = isIndex ? "Index" : "Collection";
  return (
    <Link
      href={target}
      className={`${breadcrumb ? "icon-btn breadcrumb-origin" : "browse-return"} ${className ?? ""}`}
      aria-label={`Back to ${label.toLowerCase()}`}
      title={breadcrumb ? label : undefined}
      onNavigate={
        returning
          ? (event) => {
              event.preventDefault();
              router.back();
            }
          : undefined
      }
    >
      {breadcrumb ? (
        isIndex ? <List size={20} aria-hidden="true" /> : <SquaresFour size={20} aria-hidden="true" />
      ) : (
        <><ArrowLeft size={20} aria-hidden="true" /><span>Back to {label.toLowerCase()}</span></>
      )}
    </Link>
  );
}

export function ArticleBreadcrumb({ section, title }: { section: "notes" | "projects"; title: string }) {
  return (
    <nav className="article-breadcrumb" aria-label="Breadcrumb">
      <ol>
        <li><BackToBrowse href="/" breadcrumb /></li>
        <li className="breadcrumb-section">
          <CaretRight className="breadcrumb-separator" size={12} aria-hidden="true" />
          <Link href={`/browse?type=${section}`}>{section === "notes" ? "Notes" : "Projects"}</Link>
        </li>
        <li className="sr-only" aria-current="page">{title}</li>
      </ol>
    </nav>
  );
}

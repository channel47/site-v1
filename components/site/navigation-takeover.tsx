"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type MouseEvent,
  type FocusEvent,
  type KeyboardEvent,
} from "react";
import { ChatCircle, RssSimple, X } from "@phosphor-icons/react";
import { MarkLink } from "./mark-link";
import { UtilityLink } from "./utility-link";
import { SocialLinks } from "./social-links";
import { motionMilliseconds } from "@/lib/motion";

const LINKS = [
  { href: "/", title: "Collection" },
  { href: "/browse", title: "Index" },
  { href: "/about", title: "About" },
  {
    href: "/newsletter",
    title: "Letters",
    label: "Letters — occasional emails",
  },
];
const COPIES = [0, 1, 2, 3, 4];
const PRIMARY = 2;

/** Native scrolling supplies momentum; identical groups let its position wrap.
 * Only the middle group participates in Tab order and the accessibility tree. */
export function NavigationTakeover({ onDismiss, keyboard }: { onDismiss: () => void; keyboard: boolean }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const reel = useRef<HTMLElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  const destination = useRef<string | null>(null);
  const closing = useRef(false);
  const finished = useRef(false);
  const [exiting, setExiting] = useState(false);
  const [reduced, setReduced] = useState(false);
  const router = useRouter();

  const finish = useCallback(() => {
    if (finished.current) return;
    finished.current = true;
    dialog.current?.close();
    const href = destination.current;
    onDismiss();
    if (href) router.push(href);
  }, [onDismiss, router]);

  const requestClose = useCallback(
    (href?: string) => {
      if (closing.current) return;
      closing.current = true;
      destination.current = href ?? null;
      if (matchMedia("(prefers-reduced-motion: reduce)").matches) finish();
      else {
        const node = dialog.current;
        const wash = node?.querySelector<HTMLElement>(".takeover-wash");
        if (wash)
          node?.style.setProperty("--wash-exit-start", getComputedStyle(wash).transform);
        node?.querySelectorAll<HTMLElement>(".takeover-header, .navigation-reel, .takeover-footer")
          .forEach((element) => {
            const style = getComputedStyle(element);
            element.style.setProperty("--exit-opacity", style.opacity);
            element.style.setProperty("--exit-transform", style.transform);
          });
        setExiting(true);
      }
    },
    [finish],
  );

  // Capture the click before Next Link can navigate; finish the exit first.
  function follow(event: MouseEvent<HTMLElement>) {
    const link = (event.target as HTMLElement).closest<HTMLAnchorElement>("a");
    if (
      !link ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey ||
      event.button !== 0
    )
      return;
    const href = link.getAttribute("href");
    if (!href?.startsWith("/") || href === "/rss.xml") return;
    event.preventDefault();
    requestClose(href);
  }

  function centerFocusedLink(event: FocusEvent<HTMLElement>) {
    const link = event.target.closest<HTMLAnchorElement>("[data-primary] a");
    const node = reel.current;
    // Pointer focus must not move a neighboring link before the click completes.
    if (!link || !node || !link.matches(":focus-visible")) return;
    const row = link.getBoundingClientRect();
    node.scrollTo({
      top: node.scrollTop + row.top - node.getBoundingClientRect().top
        + (row.height - node.clientHeight) / 2,
      behavior: "instant",
    });
  }

  function moveFocus(event: KeyboardEvent<HTMLElement>) {
    if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;
    const links = Array.from(reel.current!.querySelectorAll<HTMLAnchorElement>("[data-primary] a"));
    const index = links.indexOf(event.target as HTMLAnchorElement);
    if (index === -1) return;
    event.preventDefault();
    const direction = event.key === "ArrowDown" ? 1 : -1;
    links[(index + direction + links.length) % links.length].focus();
  }

  useEffect(() => {
    const node = dialog.current;
    if (!node) return;
    const previous = document.body.style.overflow;
    const previousPadding = document.body.style.paddingRight;
    const gutter = window.innerWidth - document.documentElement.clientWidth;
    node.style.setProperty("--viewport-scrollbar", `${gutter}px`);
    document.body.style.paddingRight = `${gutter}px`;
    document.body.style.overflow = "hidden";
    // Scale one solid layer instead of repainting a clip over the entire reel.
    const sizeWash = () => {
      const trigger = node.parentElement?.querySelector(".menu-trigger");
      const bounds = trigger?.getBoundingClientRect();
      const x = bounds ? bounds.x + bounds.width / 2 : window.innerWidth;
      const y = bounds ? bounds.y + bounds.height / 2 : 0;
      const radius = Math.hypot(
        Math.max(x, window.innerWidth - x),
        Math.max(y, window.innerHeight - y),
      ) + 2;
      node.style.setProperty("--wash-x", `${x}px`);
      node.style.setProperty("--wash-y", `${y}px`);
      node.style.setProperty("--wash-size", `${radius * 2}px`);
    };
    sizeWash();
    window.addEventListener("resize", sizeWash);
    const media = matchMedia("(prefers-reduced-motion: reduce)");
    const preference = () => {
      setReduced(media.matches);
      if (media.matches && closing.current) finish();
    };
    preference();
    media.addEventListener("change", preference);
    node.showModal();
    // A pointer-opened dialog needs semantic focus, not a highlighted control.
    (keyboard ? closeButton.current : node)?.focus({ preventScroll: true });
    return () => {
      media.removeEventListener("change", preference);
      window.removeEventListener("resize", sizeWash);
      document.body.style.overflow = previous;
      document.body.style.paddingRight = previousPadding;
      node.close();
    };
  }, [keyboard, finish]);

  // A fallback also closes the dialog if animations are disabled by an extension.
  useEffect(() => {
    if (!exiting) return;
    const duration = motionMilliseconds(
      getComputedStyle(dialog.current!).getPropertyValue("--motion-menu-close"),
      640,
    );
    const timer = setTimeout(
      finish,
      duration + 80,
    );
    return () => clearTimeout(timer);
  }, [exiting, finish]);

  useEffect(() => {
    const node = reel.current;
    if (!node) return;
    let frame = 0;
    let cancelled = false;
    const rows = Array.from(node.querySelectorAll<HTMLElement>(".reel-row"));
    const primary = node.querySelector<HTMLElement>("[data-primary]");
    if (!primary) return;
    let rowHeight = 1;
    let groupHeight = 1;
    let viewportHeight = 0;

    const paint = () => {
      frame = 0;
      if (!reduced) {
        // Keep a full group above and below the visible region at all times.
        if (node.scrollTop < groupHeight) node.scrollTop += groupHeight;
        else if (node.scrollTop > groupHeight * 3)
          node.scrollTop -= groupHeight;
      }
      const center = node.scrollTop + node.clientHeight / 2;
      rows.forEach((row, index) => {
        const distance = reduced
          ? 0
          : Math.max(
              -2,
              Math.min(
                2,
                (index * rowHeight + rowHeight / 2 - center) / rowHeight,
              ),
            );
        row.style.setProperty("--reel-distance", String(distance));
        row.style.setProperty(
          "--reel-opacity",
          String(1 - Math.min(Math.abs(distance), 1.6) * 0.24),
        );
      });
    };
    const measure = () => {
      if (cancelled) return;
      const position = viewportHeight
        ? (node.scrollTop + viewportHeight / 2) / rowHeight
        : PRIMARY * LINKS.length + 0.5;
      rowHeight =
        primary.firstElementChild?.getBoundingClientRect().height || 1;
      groupHeight = primary.getBoundingClientRect().height;
      viewportHeight = node.clientHeight;
      node.scrollTop = reduced
        ? 0
        : position * rowHeight - viewportHeight / 2;
      paint();
    };
    const scroll = () => {
      if (!frame) frame = requestAnimationFrame(paint);
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(node);
    node.addEventListener("scroll", scroll, { passive: true });
    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
      observer.disconnect();
      node.removeEventListener("scroll", scroll);
    };
  }, [reduced]);

  return (
    <dialog
      ref={dialog}
      id="site-navigation"
      className="navigation-takeover"
      tabIndex={-1}
      data-exiting={exiting}
      data-reduced={reduced}
      aria-labelledby="navigation-title"
      onClickCapture={follow}
      onCancel={(event) => {
        event.preventDefault();
        requestClose();
      }}
    >
      <div
        className="takeover-wash"
        aria-hidden="true"
        onAnimationEnd={(event) => {
          if (exiting && event.animationName === "takeover-close") finish();
        }}
      />
      <h2 id="navigation-title" className="sr-only">
        Explore 47
      </h2>
      <div className="takeover-header">
        <MarkLink />
        <button
          ref={closeButton}
          type="button"
          className="icon-btn takeover-close"
          aria-label="Close menu"
          onClick={() => requestClose()}
          autoFocus={keyboard}
        >
          <X size={24} weight="light" />
        </button>
      </div>
      <nav
        ref={reel}
        className="navigation-reel"
        aria-label="Site navigation"
        onFocus={centerFocusedLink}
        onKeyDown={moveFocus}
      >
        {COPIES.map((copy) => (
          <div
            key={copy}
            className="reel-group"
            data-primary={copy === PRIMARY ? "true" : undefined}
            aria-hidden={copy === PRIMARY ? undefined : true}
          >
            {LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="reel-row"
                tabIndex={copy === PRIMARY ? 0 : -1}
                aria-label={link.label}
              >
                <span className="reel-word">{link.title}</span>
              </Link>
            ))}
          </div>
        ))}
      </nav>
      <footer className="takeover-footer">
        <SocialLinks />
        <nav className="takeover-utilities" aria-label="Contact and feed">
          <UtilityLink href="/session" label="Work together">
            <ChatCircle size={20} aria-hidden="true" />
          </UtilityLink>
          <UtilityLink href="/rss.xml" label="RSS feed">
            <RssSimple size={20} aria-hidden="true" />
          </UtilityLink>
        </nav>
      </footer>
    </dialog>
  );
}

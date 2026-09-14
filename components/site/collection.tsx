"use client";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent,
} from "react";
import { ArrowLeft, ArrowRight } from "@phosphor-icons/react";
import type { CollectionItem } from "@/lib/collection";
import { motionMilliseconds } from "@/lib/motion";
import { BrowseEntryLink, useReturningCollectionEntry } from "./browse-navigation";

const COPIES = [-2, -1, 0, 1, 2];
const PRIMARY_COPY = 2;

export function Collection({ items }: { items: CollectionItem[] }) {
  const returningEntry = useReturningCollectionEntry();
  const [active, setActive] = useState(() => Math.max(0, items.findIndex(item => item.href === returningEntry)));
  const [enhanced, setEnhanced] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [visible, setVisible] = useState(true);
  const [obscured, setObscured] = useState(false);
  const track = useRef<HTMLUListElement>(null);
  const gallery = useRef<HTMLElement>(null);
  const selected = useRef(active);
  const physical = useRef(active);
  const settleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const drag = useRef<{ x: number; left: number; moved: boolean } | null>(null);
  const dragged = useRef(false);
  const running = playing && !hovered && visible && !obscured;

  const scrollToSlide = useCallback((index: number, instant = false) => {
    const node = track.current;
    const slide = node?.children[index] as HTMLElement | undefined;
    if (!node || !slide) return;
    node.scrollTo({
      left: slide.offsetLeft - (node.clientWidth - slide.clientWidth) / 2,
      behavior: instant || matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth",
    });
  }, []);

  const moveBy = useCallback((direction: number) => {
    scrollToSlide(physical.current + direction);
  }, [scrollToSlide]);

  // Recenter only after native momentum or smooth scrolling has settled. Every
  // copy has identical visual states, so the position change is invisible.
  const recenter = useCallback(() => {
    if (drag.current || !items.length) return;
    const middle = PRIMARY_COPY * items.length + selected.current;
    if (physical.current === middle) return;
    physical.current = middle;
    scrollToSlide(middle, true);
  }, [items.length, scrollToSlide]);

  useLayoutEffect(() => setEnhanced(true), []);

  useLayoutEffect(() => {
    const node = track.current;
    if (!enhanced || !node || !items.length) return;
    const restore = () => {
      physical.current = PRIMARY_COPY * items.length + selected.current;
      scrollToSlide(physical.current, true);
    };
    restore();
    const observer = new ResizeObserver(restore);
    observer.observe(node);
    node.addEventListener("scrollend", recenter);
    return () => {
      observer.disconnect();
      node.removeEventListener("scrollend", recenter);
      if (settleTimer.current) clearTimeout(settleTimer.current);
    };
  }, [enhanced, items.length, recenter, scrollToSlide]);

  useEffect(() => {
    const media = matchMedia("(prefers-reduced-motion: reduce)");
    const preference = () => {
      if (media.matches) setPlaying(false);
    };
    preference();
    setPlaying(!media.matches && !returningEntry && items.length > 1);
    media.addEventListener("change", preference);
    return () => media.removeEventListener("change", preference);
    // Autoplay is an arrival choice; returning from a story remains manual.
  }, []);

  useEffect(() => {
    let inView = true;
    const visibility = () => setVisible(inView && !document.hidden);
    const observer = new IntersectionObserver(([entry]) => {
      inView = entry.intersectionRatio >= 0.5;
      visibility();
    }, { threshold: 0.5 });
    if (gallery.current) observer.observe(gallery.current);
    const menu = () => setObscured(!!document.querySelector("dialog[open]"));
    const dialogObserver = new MutationObserver(menu);
    dialogObserver.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ["open"] });
    menu();
    visibility();
    document.addEventListener("visibilitychange", visibility);
    return () => {
      observer.disconnect();
      dialogObserver.disconnect();
      document.removeEventListener("visibilitychange", visibility);
    };
  }, []);

  useEffect(() => {
    if (!running || items.length < 2) return;
    const duration = motionMilliseconds(getComputedStyle(document.documentElement).getPropertyValue("--collection-interval"), 12000);
    const timer = window.setTimeout(() => moveBy(1), duration);
    return () => window.clearTimeout(timer);
  }, [active, items.length, moveBy, running]);

  function syncPosition() {
    const node = track.current;
    if (!node) return;
    const center = node.scrollLeft + node.clientWidth / 2;
    let nearest = 0;
    let distance = Infinity;
    Array.from(node.children).forEach((child, index) => {
      const slide = child as HTMLElement;
      const delta = Math.abs(slide.offsetLeft + slide.clientWidth / 2 - center);
      if (delta < distance) { nearest = index; distance = delta; }
    });
    physical.current = nearest;
    selected.current = nearest % items.length;
    // A long, uninterrupted gesture can consume the spare copies. Move its
    // coordinate origin before an outer edge appears, preserving drag distance.
    if (enhanced && (nearest < items.length || nearest >= (COPIES.length - 1) * items.length)) {
      const middle = PRIMARY_COPY * items.length + selected.current;
      const offset = (node.children[middle] as HTMLElement).offsetLeft
        - (node.children[nearest] as HTMLElement).offsetLeft;
      physical.current = middle;
      if (drag.current) drag.current.left += offset;
      node.scrollBy({ left: offset, behavior: "instant" });
    }
    setActive(selected.current);
    // Fallback for browsers without scrollend. Do not interrupt a gesture.
    if (settleTimer.current) clearTimeout(settleTimer.current);
    settleTimer.current = setTimeout(recenter, 200);
  }

  function finishDrag(event: PointerEvent<HTMLUListElement>) {
    const node = event.currentTarget;
    if (!drag.current) return;
    const moved = drag.current.moved;
    drag.current = null;
    delete node.dataset.dragging;
    if (node.hasPointerCapture(event.pointerId)) node.releasePointerCapture(event.pointerId);
    if (moved) { syncPosition(); scrollToSlide(physical.current); }
  }

  if (!items.length) return null;
  return (
    <section
      ref={gallery}
      className="collection-shelf"
      aria-label="Projects and experiments"
      aria-roledescription="carousel"
      data-enhanced={enhanced}
      onPointerEnter={event => { if (event.pointerType === "mouse") setHovered(true); }}
      onPointerLeave={() => setHovered(false)}
      onFocusCapture={() => setPlaying(false)}
      onKeyDown={event => {
        if (!["ArrowRight", "ArrowLeft", "Home", "End"].includes(event.key) || event.altKey || event.ctrlKey || event.metaKey) return;
        event.preventDefault();
        setPlaying(false);
        if (event.key === "ArrowRight" || event.key === "ArrowLeft") moveBy(event.key === "ArrowRight" ? 1 : -1);
        else scrollToSlide(PRIMARY_COPY * items.length + (event.key === "Home" ? 0 : items.length - 1));
        // Keep keyboard focus on a stable control while the active story changes.
        if ((event.target as Element).closest(".collection-link")) track.current?.focus({ preventScroll: true });
      }}
    >
      <ul
        ref={track}
        id="collection-track"
        className="collection-track"
        aria-label="Explore the collection"
        tabIndex={enhanced ? 0 : undefined}
        onScroll={syncPosition}
        onWheel={() => setPlaying(false)}
        onPointerDown={event => {
          setPlaying(false);
          dragged.current = false;
          if (event.pointerType === "mouse" && event.button === 0) drag.current = { x: event.clientX, left: event.currentTarget.scrollLeft, moved: false };
        }}
        onPointerMove={event => {
          const start = drag.current;
          if (!start) return;
          const delta = event.clientX - start.x;
          if (!start.moved && Math.abs(delta) < 6) return;
          start.moved = true;
          dragged.current = true;
          event.currentTarget.dataset.dragging = "true";
          event.currentTarget.setPointerCapture(event.pointerId);
          event.currentTarget.scrollLeft = start.left - delta;
        }}
        onPointerUp={finishDrag}
        onPointerCancel={finishDrag}
        onLostPointerCapture={finishDrag}
        onClickCapture={event => {
          if (dragged.current) { event.preventDefault(); event.stopPropagation(); dragged.current = false; }
        }}
      >
        {(enhanced ? COPIES : [0]).flatMap(copy => items.map((item, index) => (
          <li
            key={`${copy}-${item.id}`}
            className="collection-slide"
            data-copy={copy}
            data-active={active === index}
            aria-hidden={copy !== 0 ? true : undefined}
            aria-label={`${index + 1} of ${items.length}`}
            aria-roledescription="slide"
            inert={enhanced && active !== index}
            style={{
              "--object-silhouette": item.silhouette,
              "--object-angle": active === index ? "0deg" : index % 2 ? "-4deg" : "4deg",
            } as CSSProperties}
          >
            <BrowseEntryLink
              href={item.href}
              className="collection-link"
              data-collection-primary={copy === 0 ? "true" : undefined}
              tabIndex={copy === 0 ? undefined : -1}
              draggable={false}
              aria-label={`${item.title} — ${item.label}`}
            >
              <div className="collection-piece">
                <div className="collection-space">
                  <div className="collection-art">
                    <img src={item.src} srcSet={item.srcSet} sizes="(max-width: 720px) 82vw, 460px" width={960} height={960} alt="" draggable={false} loading={copy === 0 && (index < 2 || index === active) ? "eager" : "lazy"} fetchPriority={copy === 0 && index === 0 ? "high" : "auto"} />
                  </div>
                </div>
                <span className="collection-caption" aria-hidden="true">
                  <span>{item.title}<ArrowRight size={16} aria-hidden="true" /></span>
                  <small>{item.label}</small>
                </span>
              </div>
            </BrowseEntryLink>
          </li>
        )))}
      </ul>
      {items.length > 1 && (
        <div className="collection-controls" role="group" aria-label="Collection controls">
          <button type="button" className="icon-btn" aria-label="Previous project" aria-controls="collection-track" onClick={() => { setPlaying(false); moveBy(-1); }}>
            <ArrowLeft size={18} aria-hidden="true" />
          </button>
          <button type="button" className="icon-btn" aria-label="Next project" aria-controls="collection-track" onClick={() => { setPlaying(false); moveBy(1); }}>
            <ArrowRight size={18} aria-hidden="true" />
          </button>
        </div>
      )}
      <span className="sr-only" aria-live={playing ? "off" : "polite"} aria-atomic="true">{active + 1} of {items.length}: {items[active].title}</span>
    </section>
  );
}

/** Preserved while the horizontal shelf is being explored. */
export function CollectionGrid({ items }: { items: CollectionItem[] }) {
  return (
    <ul className="collection-grid">
      {items.map((item, index) => (
        <li
          key={item.id}
          className="collection-object"
          style={
            {
              "--object-silhouette": item.silhouette,
            } as CSSProperties
          }
        >
          <BrowseEntryLink
            href={item.href}
            className="collection-link"
            aria-label={`${item.title} — ${item.label}`}
          >
            <div className="collection-piece">
              <div className="collection-space">
                <div className="collection-art">
                  <img
                    src={item.src}
                    srcSet={item.srcSet}
                    sizes="(max-width: 520px) 84vw, (max-width: 720px) 50vw, 490px"
                    width={960}
                    height={960}
                    alt=""
                    draggable={false}
                    loading={index < 2 ? "eager" : "lazy"}
                    fetchPriority={index === 0 ? "high" : "auto"}
                  />
                </div>
              </div>
              <span className="collection-caption" aria-hidden="true">
                <span>
                  {item.title}
                  <ArrowRight size={16} aria-hidden="true" />
                </span>
                <small>{item.label}</small>
              </span>
            </div>
          </BrowseEntryLink>
        </li>
      ))}
    </ul>
  );
}

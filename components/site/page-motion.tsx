"use client";

import { useLayoutEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { ARRIVAL_SELECTOR, SCROLL_ARRIVAL_SELECTOR, motionMilliseconds } from "@/lib/motion";

/** Enhance visible arrivals, never the act of reading or restoring a position.
 * Content is visible without JS; no hidden styles survive a cancelled animation. */
export function PageMotion() {
  const pathname = usePathname();
  const historyPath = useRef<string | null>(null);
  const firstPath = useRef<string | null>(pathname);
  const skipFirst = useRef<boolean | null>(null);

  useLayoutEffect(() => {
    const returning = () => { historyPath.current = location.pathname; };
    window.addEventListener("popstate", returning);
    return () => window.removeEventListener("popstate", returning);
  }, []);

  useLayoutEffect(() => {
    const navigation = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined;
    const root = document.documentElement;
    // Remember this through Strict Mode's setup/cleanup replay. Once the guard
    // fails open, late hydration must not hide the page for a second entrance.
    skipFirst.current ??= root.dataset.arrival !== "pending"
      || navigation?.type === "back_forward" || !!location.hash;
    if (firstPath.current !== pathname) firstPath.current = null;
    const restoring = historyPath.current === pathname
      || (firstPath.current === pathname && skipFirst.current);
    historyPath.current = null;
    const media = matchMedia("(prefers-reduced-motion: reduce)");
    const releaseGuard = () => { if (root.dataset.arrival === "pending") root.dataset.arrival = "ready"; };
    if (restoring || media.matches || !Element.prototype.animate) {
      releaseGuard();
      return;
    }

    const main = document.querySelector("main");
    if (!main) { releaseGuard(); return; }
    const tokens = getComputedStyle(root);
    const duration = motionMilliseconds(tokens.getPropertyValue("--motion-reveal"), 720);
    const step = motionMilliseconds(tokens.getPropertyValue("--motion-stagger"), 60);
    const easing = tokens.getPropertyValue("--ease-arrival").trim();
    const animations = new Map<Element, Animation>();
    const timers = new Set<ReturnType<typeof setTimeout>>();
    const begin = (nodes: Element[]) => {
      if (!nodes.length) return;
      const timer = setTimeout(() => {
        // A broken font/image cannot leave content hidden indefinitely.
        nodes.forEach((node) => {
          animations.get(node)?.cancel();
          animations.delete(node);
        });
        timers.delete(timer);
      }, 2500);
      timers.add(timer);
      const images = nodes.flatMap((node) => Array.from(node.querySelectorAll("img")));
      Promise.allSettled([
        document.fonts.ready,
        ...images.map((image) => image.decode()),
      ]).then(() => {
        clearTimeout(timer);
        timers.delete(timer);
        nodes.forEach((node) => animations.get(node)?.play());
      });
    };
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(({ target, isIntersecting }) => {
        if (!isIntersecting) return;
        begin([target]);
        observer.unobserve(target);
      });
    }, { threshold: 0.08 });

    // Read geometry as one batch before starting any animation.
    const targets = Array.from(main.querySelectorAll<HTMLElement>(ARRIVAL_SELECTOR))
      .map((node) => ({ node, bounds: node.getBoundingClientRect() }));
    const visibleNodes: Element[] = [];
    let visibleIndex = 0;
    targets.forEach(({ node, bounds }) => {
      if (!bounds.height || bounds.bottom <= 0) return;
      const object = node.matches(".collection-object");
      if (!object && bounds.height > innerHeight * 0.8) return;
      const visible = bounds.top < innerHeight;
      if (!visible && !node.matches(SCROLL_ARRIVAL_SELECTOR)) return;
      const delay = visible ? Math.min(visibleIndex++, 3) * step : 0;
      const animation = node.animate([
        { opacity: 0, filter: `blur(${object ? 6 : 3}px)`, transform: `translateY(${object ? 8 : 3}px)` },
        { opacity: 0.96, filter: "blur(0px)", transform: "translateY(0px)", offset: 0.75 },
        { opacity: 1, filter: "blur(0px)", transform: "translateY(0px)" },
      ], { duration, delay, easing, fill: "backwards", id: "47-arrive" });
      animation.pause();
      animation.currentTime = 0;
      animations.set(node, animation);
      animation.onfinish = () => { animations.delete(node); };
      if (visible) visibleNodes.push(node);
      else observer.observe(node);
    });
    // All visible artwork shares one start, after decoding. Every animation is
    // already holding its first frame when the pre-paint guard is removed.
    releaseGuard();
    begin(visibleNodes);

    const revealForInput = (event: Event) => {
      animations.forEach((animation, node) => {
        if (event.target instanceof Node && node.contains(event.target)) {
          animation.cancel();
          observer.unobserve(node);
          animations.delete(node);
        }
      });
    };
    const settle = () => {
      observer.disconnect();
      animations.forEach((animation) => animation.cancel());
      animations.clear();
      timers.forEach(clearTimeout);
      timers.clear();
    };
    const preference = () => { if (media.matches) settle(); };
    main.addEventListener("focusin", revealForInput);
    main.addEventListener("pointerdown", revealForInput);
    media.addEventListener("change", preference);
    window.addEventListener("pagehide", settle);
    return () => {
      settle();
      main.removeEventListener("focusin", revealForInput);
      main.removeEventListener("pointerdown", revealForInput);
      media.removeEventListener("change", preference);
      window.removeEventListener("pagehide", settle);
    };
  }, [pathname]);

  return null;
}

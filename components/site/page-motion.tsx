"use client";

import { useLayoutEffect, useRef } from "react";
import { usePathname } from "next/navigation";

const ARRIVALS = [
  ".collection-object",
  ".piece-head > h1", ".piece-lede", ".piece-byline",
  ".st-head", ".st-prose > :first-child", ".st-row",
  ".nl-capture", ".session-aside", ".about-follow",
].join(",");

/** Enhance visible arrivals, never the act of reading or restoring a position.
 * Content is visible without JS; no hidden styles survive a cancelled animation. */
export function PageMotion() {
  const pathname = usePathname();
  const historyPath = useRef<string | null>(null);
  const firstArrival = useRef(true);

  useLayoutEffect(() => {
    const returning = () => { historyPath.current = location.pathname; };
    window.addEventListener("popstate", returning);
    return () => window.removeEventListener("popstate", returning);
  }, []);

  useLayoutEffect(() => {
    const navigation = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined;
    const restoring = historyPath.current === pathname
      || (firstArrival.current && navigation?.type === "back_forward");
    firstArrival.current = false;
    historyPath.current = null;
    const media = matchMedia("(prefers-reduced-motion: reduce)");
    if (restoring || media.matches || !Element.prototype.animate) return;

    const main = document.querySelector("main");
    if (!main) return;
    const tokens = getComputedStyle(document.documentElement);
    const duration = parseFloat(tokens.getPropertyValue("--motion-reveal"));
    const step = parseFloat(tokens.getPropertyValue("--motion-stagger"));
    const easing = tokens.getPropertyValue("--ease-settle").trim();
    const animations = new Map<Element, Animation>();
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(({ target, isIntersecting }) => {
        if (!isIntersecting) return;
        animations.get(target)?.play();
        observer.unobserve(target);
      });
    }, { threshold: 0.08 });

    // Read geometry as one batch before starting any animation.
    const targets = Array.from(main.querySelectorAll<HTMLElement>(ARRIVALS))
      .map((node) => ({ node, bounds: node.getBoundingClientRect() }));
    let visibleIndex = 0;
    targets.forEach(({ node, bounds }) => {
      if (!bounds.height || bounds.bottom <= 0) return;
      const object = node.matches(".collection-object");
      if (!object && bounds.height > innerHeight * 0.8) return;
      const visible = bounds.top < innerHeight;
      if (!visible && !object) return;
      const delay = visible ? Math.min(visibleIndex++, 3) * step : 0;
      const animation = node.animate([
        { opacity: 0, filter: `blur(${object ? 8 : 4}px)`, transform: `translateY(${object ? 18 : 10}px)` },
        { opacity: 1, filter: "blur(0px)", transform: "translateY(0px)" },
      ], { duration, delay, easing, fill: "backwards", id: "47-arrive" });
      animations.set(node, animation);
      animation.onfinish = () => { animations.delete(node); };
      if (!visible) {
        animation.pause();
        observer.observe(node);
      }
    });

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

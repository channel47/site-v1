/** CSS optimizers may normalize milliseconds to seconds. WAAPI needs ms. */
export function motionMilliseconds(value: string, fallback: number): number {
  const match = value.trim().match(/^(\d*\.?\d+)(ms|s)$/);
  return match ? Number(match[1]) * (match[2] === "s" ? 1000 : 1) : fallback;
}

/** Shared by the first-paint guard and the hydrated arrival controller. */
export const ARRIVAL_SELECTOR = [
  ".collection-object",
  ".piece-head > h1", ".piece-lede", ".piece-byline",
  ".st-head", ".st-prose > :first-child", ".st-row",
  ".nl-capture", ".session-aside", ".about-follow",
].join(",");

export const ARRIVAL_BOOT = `(() => {
  const root = document.documentElement;
  const navigation = performance.getEntriesByType('navigation')[0];
  if (matchMedia('(prefers-reduced-motion: reduce)').matches ||
      navigation?.type === 'back_forward' || location.hash) return;
  root.dataset.arrival = 'pending';
  setTimeout(() => {
    if (root.dataset.arrival === 'pending') root.dataset.arrival = 'expired';
  }, 2000);
})();`;

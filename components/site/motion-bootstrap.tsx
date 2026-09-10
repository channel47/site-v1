import { ARRIVAL_BOOT, ARRIVAL_SELECTOR } from "@/lib/motion";

/** Runs before body paint. With JS blocked/disabled the page is simply visible;
 * delayed hydration fails open and must never hide already-visible content again. */
export function MotionBootstrap() {
  return (
    <>
      <style>{`html[data-arrival="pending"] main :is(${ARRIVAL_SELECTOR}) { opacity: 0; }
        @media (prefers-reduced-motion: reduce) {
          html[data-arrival="pending"] main :is(${ARRIVAL_SELECTOR}) { opacity: 1; }
        }`}</style>
      <script dangerouslySetInnerHTML={{ __html: ARRIVAL_BOOT }} />
    </>
  );
}

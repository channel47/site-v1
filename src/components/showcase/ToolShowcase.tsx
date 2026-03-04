import { useState, useEffect, useRef, useCallback } from 'react';
import { TOOLS } from './tool-data';
import SlideStage from './SlideStage';
import Minimap from './Minimap';
import SignupSlide from './SignupSlide';

const TOTAL_SLIDES = TOOLS.length + 1; // tools + signup
const LERP_FACTOR = 0.12;
const SNAP_TIMEOUT = 80;
const WHEEL_THRESHOLD = 50;
const TOUCH_THRESHOLD = 50;
const VIRTUAL_BUFFER = 1; // render current ± 1

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

/** Build a slug→index map for hash-based navigation */
const SLUG_MAP = new Map<string, number>();
TOOLS.forEach((t, i) => SLUG_MAP.set(t.id, i));
SLUG_MAP.set('subscribe', TOOLS.length);

function getInitialIndex(): number {
  if (typeof window === 'undefined') return 0;
  const hash = window.location.hash.replace('#', '');
  if (hash && SLUG_MAP.has(hash)) return SLUG_MAP.get(hash)!;
  return 0;
}

function ScrollHint() {
  return (
    <div className="showcase-scroll-hint" aria-hidden="true">
      <span className="showcase-scroll-hint__text">Scroll</span>
      <svg
        className="showcase-scroll-hint__chevron"
        width="16" height="16" viewBox="0 0 24 24"
        fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2"
        strokeLinecap="round" strokeLinejoin="round"
      >
        <path d="M6 9l6 6 6-6" />
      </svg>
    </div>
  );
}

export default function ToolShowcase() {
  const [activeIndex, setActiveIndex] = useState(getInitialIndex);
  const [isMobile, setIsMobile] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(() => getInitialIndex() > 0);

  const targetRef = useRef(getInitialIndex()); // target scroll position in "slide units"
  const currentRef = useRef(getInitialIndex()); // lerped current position
  const rafRef = useRef(0);
  const trackRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const snapTimerRef = useRef(0);
  const wheelAccumRef = useRef(0);
  const touchStartRef = useRef(0);
  const touchActiveRef = useRef(false);
  const prefersReducedMotionRef = useRef(false);

  // Update URL hash when active slide changes
  useEffect(() => {
    const slug = activeIndex < TOOLS.length ? TOOLS[activeIndex].id : 'subscribe';
    const newHash = `#${slug}`;
    if (window.location.hash !== newHash) {
      history.replaceState(null, '', newHash);
    }
  }, [activeIndex]);

  // Snap to nearest slide
  const snapTo = useCallback((index: number) => {
    const clamped = Math.max(0, Math.min(TOTAL_SLIDES - 1, index));
    targetRef.current = clamped;
    setActiveIndex(clamped);
    if (!hasInteracted) setHasInteracted(true);
  }, [hasInteracted]);

  // Go to specific slide
  const goTo = useCallback((index: number) => {
    const clamped = Math.max(0, Math.min(TOTAL_SLIDES - 1, index));
    targetRef.current = clamped;
    if (prefersReducedMotionRef.current) {
      currentRef.current = clamped;
    }
    setActiveIndex(clamped);
    if (!hasInteracted) setHasInteracted(true);
  }, [hasInteracted]);

  // RAF loop
  useEffect(() => {
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
    prefersReducedMotionRef.current = mql.matches;
    const onMotionChange = (e: MediaQueryListEvent) => {
      prefersReducedMotionRef.current = e.matches;
    };
    mql.addEventListener('change', onMotionChange);

    function tick() {
      const target = targetRef.current;
      const current = currentRef.current;

      if (prefersReducedMotionRef.current) {
        currentRef.current = target;
      } else if (Math.abs(target - current) > 0.001) {
        currentRef.current = lerp(current, target, LERP_FACTOR);
      } else {
        currentRef.current = target;
      }

      if (trackRef.current) {
        const y = -currentRef.current * 100;
        trackRef.current.style.transform = `translate3d(0, ${y}dvh, 0)`;
      }

      // Update progress bar
      if (progressRef.current) {
        const pct = (currentRef.current / (TOTAL_SLIDES - 1)) * 100;
        progressRef.current.style.width = `${pct}%`;
      }

      rafRef.current = requestAnimationFrame(tick);
    }

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafRef.current);
      mql.removeEventListener('change', onMotionChange);
    };
  }, []);

  // Wheel handler
  useEffect(() => {
    const el = trackRef.current?.parentElement;
    if (!el) return;

    function onWheel(e: WheelEvent) {
      e.preventDefault();
      wheelAccumRef.current += e.deltaY;

      if (Math.abs(wheelAccumRef.current) >= WHEEL_THRESHOLD) {
        const direction = wheelAccumRef.current > 0 ? 1 : -1;
        wheelAccumRef.current = 0;

        clearTimeout(snapTimerRef.current);
        const next = Math.max(0, Math.min(TOTAL_SLIDES - 1, Math.round(targetRef.current) + direction));
        snapTo(next);

        snapTimerRef.current = window.setTimeout(() => {
          snapTo(Math.round(targetRef.current));
        }, SNAP_TIMEOUT);
      }
    }

    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, [snapTo]);

  // Touch handlers
  useEffect(() => {
    const el = trackRef.current?.parentElement;
    if (!el) return;

    function onTouchStart(e: TouchEvent) {
      touchStartRef.current = e.touches[0].clientY;
      touchActiveRef.current = true;
    }

    function onTouchMove(e: TouchEvent) {
      if (!touchActiveRef.current) return;
      e.preventDefault();
    }

    function onTouchEnd(e: TouchEvent) {
      if (!touchActiveRef.current) return;
      touchActiveRef.current = false;
      const delta = touchStartRef.current - e.changedTouches[0].clientY;
      if (Math.abs(delta) > TOUCH_THRESHOLD) {
        const direction = delta > 0 ? 1 : -1;
        const next = Math.max(0, Math.min(TOTAL_SLIDES - 1, Math.round(targetRef.current) + direction));
        snapTo(next);
      }
    }

    el.addEventListener('touchstart', onTouchStart, { passive: true });
    el.addEventListener('touchmove', onTouchMove, { passive: false });
    el.addEventListener('touchend', onTouchEnd, { passive: true });
    return () => {
      el.removeEventListener('touchstart', onTouchStart);
      el.removeEventListener('touchmove', onTouchMove);
      el.removeEventListener('touchend', onTouchEnd);
    };
  }, [snapTo]);

  // Keyboard
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        e.preventDefault();
        goTo(Math.round(targetRef.current) + 1);
      } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        e.preventDefault();
        goTo(Math.round(targetRef.current) - 1);
      } else if (e.key === 'Home') {
        e.preventDefault();
        goTo(0);
      } else if (e.key === 'End') {
        e.preventDefault();
        goTo(TOTAL_SLIDES - 1);
      }
    }

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [goTo]);

  // Mobile detection
  useEffect(() => {
    const mql = window.matchMedia('(max-width: 900px)');
    setIsMobile(mql.matches);
    const onChange = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, []);

  // Virtual window: only render current ± VIRTUAL_BUFFER
  const visibleSlides = TOOLS.map((tool, i) => {
    if (Math.abs(i - activeIndex) > VIRTUAL_BUFFER) return null;
    return (
      <div
        key={tool.id}
        style={{ position: 'absolute', top: 0, left: 0, width: '100%', transform: `translateY(${i * 100}dvh)` }}
      >
        <SlideStage tool={tool} index={i} total={TOOLS.length} isActive={i === activeIndex} />
      </div>
    );
  });

  // Signup slide
  const signupIndex = TOOLS.length;
  const showSignup = Math.abs(signupIndex - activeIndex) <= VIRTUAL_BUFFER;

  return (
    <>
      {/* Progress bar */}
      <div ref={progressRef} className="showcase-progress" />

      <div className="showcase-stage">
        <div className="showcase-viewport">
          <div ref={trackRef} className="showcase-track">
            {visibleSlides}
            {showSignup && (
              <div
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', transform: `translateY(${signupIndex * 100}dvh)` }}
              >
                <SignupSlide />
              </div>
            )}
          </div>
        </div>

        {!isMobile && (
          <Minimap
            tools={TOOLS}
            activeIndex={activeIndex}
            onSelect={goTo}
            hasSignup
          />
        )}

        {isMobile && (
          <div className="showcase-dots" aria-hidden="true">
            {Array.from({ length: TOTAL_SLIDES }, (_, i) => (
              <div
                key={i}
                className={`showcase-dots__dot${i === activeIndex ? ' showcase-dots__dot--active' : ''}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Scroll hint — visible only on first slide before interaction */}
      {activeIndex === 0 && !hasInteracted && <ScrollHint />}
    </>
  );
}

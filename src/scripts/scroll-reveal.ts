/**
 * Scroll Reveal — unified IntersectionObserver system.
 *
 * - [data-reveal] elements: single-element reveal at threshold 0.12.
 * - [data-reveal-stagger] parents: triggers all [data-reveal-child] children.
 * - Counter-tick: [data-counter] elements count up on reveal.
 * - Reduced motion: all content visible immediately, no animations.
 */

export function initScrollReveal(): void {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReduced) {
    document.querySelectorAll('[data-reveal]').forEach(el => el.classList.add('is-visible'));
    document.querySelectorAll('[data-reveal-child]').forEach(el => el.classList.add('is-visible'));
    document.querySelectorAll('[data-reveal-stagger]').forEach(el => el.classList.add('is-visible'));
    document.querySelectorAll('[data-counter]').forEach(el => {
      const target = el.getAttribute('data-counter');
      if (target) (el as HTMLElement).textContent = target;
    });
    return;
  }

  // Single-element reveals
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  document.querySelectorAll('[data-reveal]').forEach(el => {
    revealObserver.observe(el);
  });

  // Parent-triggered stagger reveals
  const staggerObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          entry.target.querySelectorAll('[data-reveal-child]').forEach(child => {
            child.classList.add('is-visible');
          });
          staggerObserver.unobserve(entry.target);

          // Counter tick integration
          entry.target.querySelectorAll('[data-counter]').forEach(el => {
            animateCounter(el as HTMLElement);
          });
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  document.querySelectorAll('[data-reveal-stagger]').forEach(el => {
    staggerObserver.observe(el);
  });

  // Standalone counters (not inside stagger parents)
  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target as HTMLElement);
          counterObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  document.querySelectorAll('[data-counter]:not([data-reveal-stagger] [data-counter])').forEach(el => {
    counterObserver.observe(el);
  });
}

/** Animate a counter from 0 to its data-counter value */
function animateCounter(el: HTMLElement): void {
  const target = el.getAttribute('data-counter');
  if (!target) return;

  const num = parseInt(target, 10);
  if (isNaN(num)) {
    el.textContent = target;
    return;
  }

  const duration = 800;
  const start = performance.now();
  const suffix = target.replace(String(num), '');

  function tick(now: number) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    // Ease-out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.round(eased * num);
    el.textContent = current + suffix;

    if (progress < 1) {
      requestAnimationFrame(tick);
    }
  }

  requestAnimationFrame(tick);
}

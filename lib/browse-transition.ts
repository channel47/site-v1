type BrowseChange = {
  href: string;
  keyboard: boolean;
  committed: boolean;
  transition?: ViewTransition;
  resolve?: () => void;
  timer?: ReturnType<typeof setTimeout>;
  dispose?: () => void;
};

let active: BrowseChange | undefined;

function clear(change: BrowseChange) {
  clearTimeout(change.timer);
  change.dispose?.();
  if (active !== change) return;
  active = undefined;
  delete document.documentElement.dataset.browseTransition;
}

/** A newer click, history navigation, or leaving the document wins immediately. */
export function cancelBrowseTransition() {
  if (!active) return;
  const change = active;
  clear(change);
  change.resolve?.();
  change.transition?.skipTransition();
}

export function isBrowseTransitionTo(href: string) {
  return active?.href === href;
}

/** Use the same native snapshot mechanism as the theme reveal. Navigation
 * begins in the update callback; it never waits for an exit animation. */
export function switchBrowseView(href: string, navigate: () => void, keyboard: boolean) {
  cancelBrowseTransition();
  // Clicking the selected view (including clearing an Index filter) stays an
  // ordinary navigation. A same-path update has no page-arrival commit signal.
  if (window.location.pathname === href) {
    navigate();
    return;
  }
  const change: BrowseChange = { href, keyboard, committed: false };
  active = change;
  let navigated = false;
  const reduced = matchMedia("(prefers-reduced-motion: reduce)");
  const stop = () => { if (active === change) cancelBrowseTransition(); };
  const finishWithoutMotion = () => {
    if (active !== change) return;
    stop();
    if (!navigated) { navigated = true; navigate(); }
  };
  const preference = () => { if (reduced.matches) finishWithoutMotion(); };
  window.addEventListener("popstate", stop);
  window.addEventListener("pagehide", stop);
  reduced.addEventListener("change", preference);
  change.dispose = () => {
    window.removeEventListener("popstate", stop);
    window.removeEventListener("pagehide", stop);
    reduced.removeEventListener("change", preference);
  };
  // A slow or failed route/asset must never leave a snapshot covering the page.
  change.timer = setTimeout(finishWithoutMotion, 2500);

  if (reduced.matches || !document.startViewTransition ||
      document.documentElement.dataset.themeTransition) {
    navigated = true;
    navigate();
    return;
  }

  document.documentElement.dataset.browseTransition = "true";
  // Settle unfinished arrivals before photographing the outgoing layout.
  document.querySelector("main")?.getAnimations({ subtree: true })
    .filter(animation => animation.id === "47-arrive")
    .forEach(animation => animation.cancel());
  const update = () => {
    if (active !== change) return;
    return new Promise<void>((resolve) => {
      change.resolve = resolve;
      navigated = true;
      navigate();
    });
  };
  try {
    const transition = document.startViewTransition(update);
    change.transition = transition;
    // Snapshot failure still runs the navigation callback.
    void transition.ready.catch(() => {});
    void transition.finished.then(() => clear(change), () => clear(change));
  } catch {
    clear(change);
    change.resolve?.();
    if (!navigated) navigate();
  }
}

/** Called by the existing arrival controller after React commits the new main.
 * Visible content belongs to the snapshot; off-screen objects keep their normal
 * once-only scroll arrivals. Both use the same font/image readiness rule. */
export function completeBrowseTransition(pathname: string) {
  const change = active;
  if (!change) return false;
  if (change.href !== pathname) {
    cancelBrowseTransition();
    return false;
  }
  if (change.committed) return !!change.transition;
  change.committed = true;
  const focus = () => {
    if (change.keyboard) document.querySelector<HTMLElement>(
      `.browse-view[href="${change.href}"]`,
    )?.focus({ preventScroll: true });
  };
  if (!change.transition) {
    focus();
    clear(change);
    return false;
  }

  const images = Array.from(document.querySelectorAll<HTMLImageElement>("main img"))
    .filter(image => {
      const bounds = image.getBoundingClientRect();
      return bounds.bottom > 0 && bounds.top < innerHeight;
    });
  Promise.allSettled([document.fonts.ready, ...images.map(image => image.decode())])
    .then(() => {
      if (active !== change) return;
      focus();
      change.resolve?.();
    });
  return true;
}

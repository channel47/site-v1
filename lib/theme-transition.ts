import { getResolvedTheme, setThemeMode } from "./theme";

let active: ViewTransition | undefined;
let pending: "light" | "dark" | undefined;
let revision = 0;

/** A short color reveal from the control, using the menu's circular motion. */
export function toggleTheme(control: HTMLElement) {
  const next = (pending ?? getResolvedTheme()) === "dark" ? "light" : "dark";
  const current = ++revision;
  active?.skipTransition();
  pending = next;
  const root = document.documentElement;
  const reduced = matchMedia("(prefers-reduced-motion: reduce)");
  const apply = () => { if (revision === current) setThemeMode(next); };
  const clear = () => {
    if (revision !== current) return;
    active = undefined;
    pending = undefined;
    delete root.dataset.themeTransition;
    for (const property of ["--theme-x", "--theme-y", "--theme-radius"]) root.style.removeProperty(property);
  };

  if (reduced.matches || !document.startViewTransition) {
    apply();
    clear();
    return;
  }

  const rect = control.getBoundingClientRect();
  const x = rect.left + rect.width / 2;
  const y = rect.top + rect.height / 2;
  const radius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
  // The snapshot can use a different pixel scale under browser zoom. Percentages
  // keep its origin aligned with the actual control in both coordinate spaces.
  root.style.setProperty("--theme-x", `${x / innerWidth * 100}%`);
  root.style.setProperty("--theme-y", `${y / innerHeight * 100}%`);
  // CSS circle percentages use the viewport's normalized diagonal as their basis.
  root.style.setProperty("--theme-radius", `${radius / (Math.hypot(innerWidth, innerHeight) / Math.SQRT2) * 100}%`);
  root.dataset.themeTransition = "true";

  try {
    const transition = document.startViewTransition(apply);
    active = transition;
    const stop = () => { if (reduced.matches) transition.skipTransition(); };
    reduced.addEventListener("change", stop);
    // A skipped or superseded snapshot can reject ready; the update still runs.
    void transition.ready.catch(() => {});
    const finish = () => { reduced.removeEventListener("change", stop); clear(); };
    void transition.finished.then(finish, finish);
  } catch {
    // Appearance remains usable even if snapshot creation fails synchronously.
    apply();
    clear();
  }
}

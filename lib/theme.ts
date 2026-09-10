export type ThemeMode = "light" | "dark" | "system";

const STORAGE_KEY = "channel47-theme";
const CHANGE_EVENT = "channel47-theme-change";
const SYSTEM_QUERY = "(prefers-color-scheme: dark)";
const normalize = (value: string | null | undefined): ThemeMode =>
  value === "light" || value === "dark" ? value : "system";

/** Establish the saved appearance before body paint, independently of hydration. */
export const THEME_BOOT = `(() => {
  let mode = 'system';
  try {
    const saved = localStorage.getItem('${STORAGE_KEY}');
    if (saved === 'light' || saved === 'dark') mode = saved;
  } catch {}
  const root = document.documentElement;
  root.dataset.themeMode = mode;
  root.dataset.theme = mode === 'system'
    ? (matchMedia('${SYSTEM_QUERY}').matches ? 'dark' : 'light') : mode;
  const color = getComputedStyle(root).getPropertyValue('--page').trim();
  if (color) document.querySelector('meta[name="theme-color"]')?.setAttribute('content', color);
})();`;

export function getThemeMode(): ThemeMode {
  return normalize(document.documentElement.dataset.themeMode);
}

export function getResolvedTheme(): "light" | "dark" {
  return document.documentElement.dataset.theme === "dark" ? "dark" : "light";
}

function applyTheme(mode: ThemeMode) {
  const root = document.documentElement;
  root.dataset.themeMode = mode;
  root.dataset.theme = mode === "system"
    ? (matchMedia(SYSTEM_QUERY).matches ? "dark" : "light") : mode;
  const color = getComputedStyle(root).getPropertyValue("--page").trim();
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", color);
}

export function setThemeMode(mode: ThemeMode) {
  applyTheme(mode);
  try {
    if (mode === "system") localStorage.removeItem(STORAGE_KEY);
    else localStorage.setItem(STORAGE_KEY, mode);
  } catch { /* The current visit still works when storage is unavailable. */ }
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

export function subscribeTheme(listener: () => void) {
  window.addEventListener(CHANGE_EVENT, listener);
  return () => window.removeEventListener(CHANGE_EVENT, listener);
}

/** One observer lives in the root layout, including pages without a footer. */
export function watchTheme() {
  const system = matchMedia(SYSTEM_QUERY);
  const notify = () => window.dispatchEvent(new Event(CHANGE_EVENT));
  const updateSystem = () => { applyTheme(getThemeMode()); notify(); };
  const updateStorage = (event: StorageEvent) => {
    if (event.key !== STORAGE_KEY && event.key !== null) return;
    applyTheme(normalize(event.newValue));
    notify();
  };
  // A root error can replace <html> without executing an inline script again.
  // Preserve a live choice when storage is blocked; restore only a fresh root.
  let mode = getThemeMode();
  if (!document.documentElement.dataset.themeMode) {
    try { mode = normalize(localStorage.getItem(STORAGE_KEY)); } catch {}
  }
  applyTheme(mode);
  system.addEventListener("change", updateSystem);
  window.addEventListener("storage", updateStorage);
  return () => {
    system.removeEventListener("change", updateSystem);
    window.removeEventListener("storage", updateStorage);
  };
}

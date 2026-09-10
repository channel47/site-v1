import type { CapturePlacement, MeasurementDetails, MeasurementEvent } from "./measurement"

const ACTIVE_MILESTONES = [30, 90, 180, 300] as const
const IDLE_MS = 60_000
type Emit = (event: MeasurementEvent, details?: MeasurementDetails) => void

export function createReadingActivity() {
  return { activeMs: 0, lastSample: 0, activeUntil: 0, eligible: false, sent: new Set<string>() }
}
export type ReadingActivity = ReturnType<typeof createReadingActivity>

/** Accumulate only observed foreground time; a suspended timer is not reading. */
export function sampleReading(state: ReadingActivity, now: number, eligible: boolean, activity: boolean, emit: Emit) {
  const elapsed = now - state.lastSample
  if (state.eligible && elapsed >= 0 && elapsed <= 5000) {
    state.activeMs += Math.max(0, Math.min(now, state.activeUntil) - state.lastSample)
  }
  state.lastSample = now
  state.eligible = eligible
  if (activity && eligible) state.activeUntil = now + IDLE_MS
  for (const seconds of ACTIVE_MILESTONES) {
    const key = `active-${seconds}`
    if (state.activeMs >= seconds * 1000 && !state.sent.has(key)) {
      state.sent.add(key)
      emit("content_active", { active_seconds: seconds })
    }
  }
}

/** One controller per route entry, with state retained during effect replay. */
export function observeReading(state: ReadingActivity, emit: Emit, path: string) {
  const selector = /^\/(notes|projects)\/[a-z0-9-]+$/.test(path) ? `[data-reading-path="${path}"] > .st-prose` : undefined
  const once = (key: string, event: MeasurementEvent, details?: MeasurementDetails) => {
    if (state.sent.has(key)) return
    state.sent.add(key)
    emit(event, details)
  }
  const sample = (activity = false) => {
    const foreground = document.visibilityState === "visible" && document.hasFocus()
    // Next may stream the new body after the layout effect, or retain another
    // route in the DOM. Re-resolve only the current article on each sample.
    const rect = selector ? document.querySelector(selector)?.getBoundingClientRect() : undefined
    const visible = !!rect && rect.height > 0 && rect.bottom > 0 && rect.top < window.innerHeight
    sampleReading(state, performance.now(), foreground && visible, activity, emit)
    if (foreground && visible && rect) {
      const depth = (window.innerHeight - rect.top) / rect.height
      for (const mark of [50, 90] as const) {
        if (depth >= mark / 100) once(`depth-${mark}`, "content_depth", { depth: mark })
      }
      if (rect.bottom <= window.innerHeight) once("end", "content_end")
    }
    if (!foreground) return
    for (const node of document.querySelectorAll<HTMLElement>("[data-capture-placement]")) {
      const box = node.getBoundingClientRect()
      const visibleHeight = Math.min(box.bottom, window.innerHeight) - Math.max(box.top, 0)
      const placement = node.dataset.capturePlacement as CapturePlacement
      if (box.height > 0 && visibleHeight >= box.height / 2) {
        once(`newsletter-${placement}`, "newsletter_view", { placement })
      }
    }
  }
  const activity = () => sample(true)
  const pause = () => {
    sample()
    state.eligible = false
  }
  const visibility = () => document.visibilityState === "visible" ? activity() : pause()
  // Prevent gaps between effects or a restored page counting as active time.
  state.lastSample = performance.now()
  state.activeUntil = state.lastSample + IDLE_MS
  state.eligible = false
  activity()
  const timer = window.setInterval(sample, 1000)
  for (const event of ["scroll", "pointerdown", "keydown", "focus", "pageshow"]) window.addEventListener(event, activity, { passive: true })
  window.addEventListener("blur", pause)
  window.addEventListener("pagehide", pause)
  document.addEventListener("visibilitychange", visibility)
  return () => {
    pause()
    window.clearInterval(timer)
    for (const event of ["scroll", "pointerdown", "keydown", "focus", "pageshow"]) window.removeEventListener(event, activity)
    window.removeEventListener("blur", pause)
    window.removeEventListener("pagehide", pause)
    document.removeEventListener("visibilitychange", visibility)
  }
}

"use client"

import { useEffect, useMemo, useState } from "react"
import { generateSlots, type Slot } from "@/lib/slots"

type Errors = Partial<Record<"name" | "email" | "product" | "slot", string>>

type DayGroup = { key: string; label: string; slots: Slot[] }

const labelClass = "font-mono text-[11px] uppercase tracking-[0.08em] text-muted-foreground"
const fieldClass =
  "mt-2 w-full border-0 border-b border-border bg-transparent px-0 py-2 text-[15px] text-foreground placeholder:text-muted-foreground/50 focus-visible:border-accent focus-visible:outline-none"

function formatLocalTime(iso: string): string {
  return new Date(iso).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })
}

function groupByDay(slots: Slot[]): DayGroup[] {
  const groups = new Map<string, Slot[]>()
  for (const slot of slots) {
    const key = new Date(slot.startISO).toLocaleDateString([], { weekday: "long", month: "short", day: "numeric" })
    const list = groups.get(key) ?? []
    list.push(slot)
    groups.set(key, list)
  }
  return Array.from(groups, ([label, daySlots]) => ({ key: label, label, slots: daySlots }))
}

export function BookingCalendar() {
  // Slots are computed on the client so they render in the visitor's own
  // timezone; deferring to mount avoids an SSR/client hydration mismatch.
  const [slots, setSlots] = useState<Slot[]>([])
  const [selected, setSelected] = useState<string | null>(null)
  const [status, setStatus] = useState<"idle" | "submitting" | "done">("idle")
  const [errors, setErrors] = useState<Errors>({})
  const [serverError, setServerError] = useState<string | null>(null)
  const [localTz, setLocalTz] = useState<string>("")

  useEffect(() => {
    setSlots(generateSlots())
    setLocalTz(Intl.DateTimeFormat().resolvedOptions().timeZone ?? "")
  }, [])

  const days = useMemo(() => groupByDay(slots), [slots])
  const selectedLabel = selected
    ? `${new Date(selected).toLocaleDateString([], { weekday: "long", month: "long", day: "numeric" })} at ${formatLocalTime(selected)}`
    : null

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setErrors({})
    setServerError(null)

    if (!selected) {
      setErrors({ slot: "Pick an available time." })
      return
    }

    setStatus("submitting")
    const form = new FormData(event.currentTarget)
    const payload = {
      name: String(form.get("name") ?? ""),
      email: String(form.get("email") ?? ""),
      brandUrl: String(form.get("brandUrl") ?? ""),
      product: String(form.get("product") ?? ""),
      bottleneck: String(form.get("bottleneck") ?? ""),
      slotStart: selected,
    }

    try {
      const res = await fetch("/api/book-call", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; errors?: Errors; error?: string }

      if (!res.ok || !data.ok) {
        if (data.errors) setErrors(data.errors)
        if (data.error) setServerError(data.error)
        // A 409 means the slot vanished — drop it so they re-pick.
        if (res.status === 409) {
          setSlots((current) => current.filter((s) => s.startISO !== selected))
          setSelected(null)
        }
        setStatus("idle")
        return
      }
      setStatus("done")
    } catch {
      setServerError("Something went wrong. Please try again.")
      setStatus("idle")
    }
  }

  if (status === "done") {
    return (
      <div className="border-t border-accent pt-6">
        <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-accent">Confirmed</p>
        <p className="mt-4 text-xl leading-snug text-foreground">{selectedLabel}.</p>
        <p className="mt-3 font-mono text-[13px] leading-6 text-muted-foreground">
          The calendar invite is on its way to your inbox. See you then.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-10">
      <fieldset className="grid gap-5">
        <legend className={labelClass}>
          Pick a time{localTz ? ` · shown in ${localTz.replace(/_/g, " ")}` : ""}
        </legend>
        {days.length === 0 ? (
          <p className="font-mono text-[13px] text-muted-foreground">Loading availability…</p>
        ) : (
          <div className="grid gap-5">
            {days.map((day) => (
              <div key={day.key} className="grid gap-3 sm:grid-cols-[120px_1fr] sm:items-baseline">
                <span className="font-mono text-[12px] text-muted-foreground">{day.label}</span>
                <div className="flex flex-wrap gap-2">
                  {day.slots.map((slot) => {
                    const isSelected = selected === slot.startISO
                    return (
                      <button
                        type="button"
                        key={slot.startISO}
                        onClick={() => setSelected(slot.startISO)}
                        aria-pressed={isSelected}
                        className={`border px-3.5 py-2 font-mono text-[13px] transition-colors ${
                          isSelected
                            ? "border-accent bg-accent text-background"
                            : "border-border text-foreground hover:border-accent"
                        }`}
                      >
                        {formatLocalTime(slot.startISO)}
                      </button>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
        {errors.slot && <p className="font-mono text-[12px] text-accent">{errors.slot}</p>}
      </fieldset>

      <div className="grid gap-6">
        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="name" className={labelClass}>
              Name
            </label>
            <input id="name" name="name" type="text" autoComplete="name" className={fieldClass} placeholder="Your name" />
            {errors.name && <p className="mt-1.5 font-mono text-[12px] text-accent">{errors.name}</p>}
          </div>
          <div>
            <label htmlFor="email" className={labelClass}>
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              className={fieldClass}
              placeholder="you@brand.com"
            />
            {errors.email && <p className="mt-1.5 font-mono text-[12px] text-accent">{errors.email}</p>}
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="brandUrl" className={labelClass}>
              Store URL <span className="lowercase text-muted-foreground/50">(optional)</span>
            </label>
            <input id="brandUrl" name="brandUrl" type="text" inputMode="url" className={fieldClass} placeholder="yourstore.com" />
          </div>
          <div>
            <label htmlFor="product" className={labelClass}>
              What are you selling?
            </label>
            <input id="product" name="product" type="text" className={fieldClass} placeholder="The product" />
            {errors.product && <p className="mt-1.5 font-mono text-[12px] text-accent">{errors.product}</p>}
          </div>
        </div>

        <div>
          <label htmlFor="bottleneck" className={labelClass}>
            Where's the funnel leaking? <span className="lowercase text-muted-foreground/50">(optional)</span>
          </label>
          <textarea
            id="bottleneck"
            name="bottleneck"
            rows={2}
            className={`${fieldClass} resize-none`}
            placeholder="Cold traffic bounces, PDP won't convert, CPA creeping up…"
          />
        </div>
      </div>

      {serverError && <p className="font-mono text-[12px] text-accent">{serverError}</p>}

      <div className="flex flex-wrap items-center gap-5">
        <button
          type="submit"
          disabled={status === "submitting"}
          className="bg-accent px-6 py-3 font-mono text-[12px] uppercase tracking-[0.08em] text-background transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {status === "submitting" ? "Booking…" : "Confirm booking"}
        </button>
        {selectedLabel && <span className="font-mono text-[12px] text-muted-foreground">{selectedLabel}</span>}
      </div>
    </form>
  )
}

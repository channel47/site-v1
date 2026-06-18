"use client"

import { useState } from "react"

type Errors = Partial<Record<"name" | "email" | "product", string>>

// Your scheduling link (Cal.com, Calendly, SavvyCal…). Set in .env.local and in
// Vercel → Environment Variables. If unset, leads are still captured in Kit and
// the success message tells them you'll follow up to schedule.
const BOOKING_URL = process.env.NEXT_PUBLIC_BOOKING_URL ?? ""

const labelClass = "font-mono text-[11px] uppercase tracking-wide text-muted-foreground"
const fieldClass =
  "mt-2 w-full rounded-none border border-border bg-transparent px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus-visible:border-accent focus-visible:outline-none"

export function TeardownForm() {
  const [status, setStatus] = useState<"idle" | "submitting" | "done">("idle")
  const [errors, setErrors] = useState<Errors>({})
  const [serverError, setServerError] = useState<string | null>(null)

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setStatus("submitting")
    setErrors({})
    setServerError(null)

    const form = new FormData(event.currentTarget)
    const payload = {
      name: String(form.get("name") ?? ""),
      email: String(form.get("email") ?? ""),
      brandUrl: String(form.get("brandUrl") ?? ""),
      product: String(form.get("product") ?? ""),
      bottleneck: String(form.get("bottleneck") ?? ""),
    }

    try {
      const res = await fetch("/api/book-call", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      const data = (await res.json().catch(() => ({}))) as {
        ok?: boolean
        errors?: Errors
        error?: string
      }

      if (!res.ok || !data.ok) {
        if (data.errors) setErrors(data.errors)
        if (data.error) setServerError(data.error)
        setStatus("idle")
        return
      }

      // Lead captured. Hand them straight to the calendar if we have one.
      if (BOOKING_URL) {
        window.location.href = BOOKING_URL
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
      <div className="rounded-none border border-accent/40 bg-accent/5 p-6">
        <p className="font-mono text-[11px] uppercase tracking-wide text-accent">Booked in</p>
        <p className="mt-3 text-sm leading-7 text-foreground">
          You're on the list for a teardown. I'll reach out within two business days to lock a time.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className={labelClass}>
            Name
          </label>
          <input id="name" name="name" type="text" autoComplete="name" className={fieldClass} placeholder="Your name" />
          {errors.name && <p className="mt-1.5 font-mono text-[11px] text-accent">{errors.name}</p>}
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
          {errors.email && <p className="mt-1.5 font-mono text-[11px] text-accent">{errors.email}</p>}
        </div>
      </div>

      <div>
        <label htmlFor="brandUrl" className={labelClass}>
          Store URL <span className="normal-case text-muted-foreground/60">(optional)</span>
        </label>
        <input
          id="brandUrl"
          name="brandUrl"
          type="text"
          inputMode="url"
          className={fieldClass}
          placeholder="yourstore.com"
        />
      </div>

      <div>
        <label htmlFor="product" className={labelClass}>
          What are you selling?
        </label>
        <input
          id="product"
          name="product"
          type="text"
          className={fieldClass}
          placeholder="The product you'd put an advertorial in front of"
        />
        {errors.product && <p className="mt-1.5 font-mono text-[11px] text-accent">{errors.product}</p>}
      </div>

      <div>
        <label htmlFor="bottleneck" className={labelClass}>
          Where's the funnel leaking? <span className="normal-case text-muted-foreground/60">(optional)</span>
        </label>
        <textarea
          id="bottleneck"
          name="bottleneck"
          rows={3}
          className={`${fieldClass} resize-none`}
          placeholder="Cold traffic bounces, PDP doesn't convert, CPA creeping up…"
        />
      </div>

      {serverError && <p className="font-mono text-[11px] text-accent">{serverError}</p>}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="inline-flex items-center justify-center rounded-none bg-accent px-6 py-3 font-mono text-[12px] uppercase tracking-wide text-background transition-opacity hover:opacity-90 disabled:opacity-50"
      >
        {status === "submitting" ? "Booking…" : "Book my teardown"}
      </button>
      <p className="font-mono text-[11px] leading-5 text-muted-foreground">
        Free, 15 minutes. I'll pull up your funnel live and show you where an advertorial earns its place.
      </p>
    </form>
  )
}

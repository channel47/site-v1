"use client"

import { useRef, useEffect, useState, type FormEvent } from "react"
import { ScrambleTextOnHover } from "@/components/scramble-text"
import { BitmapChevron } from "@/components/bitmap-chevron"
import { cn } from "@/lib/utils"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

const scopeCards = [
  { title: "Research + Angle Map", note: "Customer language mining, segment definition, and a prioritized angle map." },
  { title: "Advertorial Strategy", note: "Swipe-file research and a page plan: lead, story, proof, product bridge, offer." },
  { title: "Page Draft + Build Handoff", note: "Production-ready copy and implementation direction for your stack." },
]

const platforms = ["Shopify", "WordPress", "Webflow", "Custom", "Not sure"]

type Status = "idle" | "loading" | "success" | "error"
type Errors = Record<string, string>

export function BuildSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const cardsRef = useRef<HTMLDivElement>(null)
  const formRef = useRef<HTMLDivElement>(null)

  const [status, setStatus] = useState<Status>("idle")
  const [message, setMessage] = useState("")
  const [errors, setErrors] = useState<Errors>({})
  const [showDetails, setShowDetails] = useState(false)
  const [form, setForm] = useState({
    name: "",
    email: "",
    brandUrl: "",
    platform: "",
    product: "",
    need: "",
    timeline: "",
    budget: "",
  })

  useEffect(() => {
    if (!sectionRef.current) return
    const ctx = gsap.context(() => {
      gsap.from(headerRef.current, {
        x: -60,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: { trigger: headerRef.current, start: "top 85%", toggleActions: "play none none reverse" },
      })
      const cards = cardsRef.current?.querySelectorAll("article")
      if (cards) {
        gsap.from(cards, {
          y: 50,
          opacity: 0,
          duration: 0.8,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: { trigger: cardsRef.current, start: "top 88%", toggleActions: "play none none reverse" },
        })
      }
      gsap.from(formRef.current, {
        y: 40,
        opacity: 0,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: { trigger: formRef.current, start: "top 90%", toggleActions: "play none none reverse" },
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  function update(field: keyof typeof form, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setStatus("loading")
    setMessage("")
    setErrors({})
    try {
      const res = await fetch("/api/request-build", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (res.ok && data.ok) {
        setStatus("success")
        setMessage(data.message ?? "Request received.")
      } else {
        setStatus("error")
        if (data.errors) setErrors(data.errors)
        setMessage(data.error ?? "Please fix the highlighted fields.")
      }
    } catch {
      setStatus("error")
      setMessage("Network error. Try again.")
    }
  }

  const inputClass =
    "w-full border border-border bg-background px-4 py-3 font-mono text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-accent focus:outline-none"
  const labelClass = "font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-2 block"

  return (
    <section ref={sectionRef} id="build" className="relative py-32 pl-6 md:pl-28 pr-6 md:pr-12 border-t border-border/30">
      <div ref={headerRef} className="mb-16 max-w-3xl">
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent">04 / Done For You</span>
        <h2 className="mt-4 font-[var(--font-bebas)] text-5xl md:text-7xl tracking-tight">
          WANT ME TO RUN THE WORKFLOW FOR YOUR BRAND?
        </h2>
        <p className="mt-6 max-w-xl font-mono text-sm text-muted-foreground leading-relaxed text-pretty">
          For ecommerce and D2C brands, I can turn your product, reviews, customer research, and offer into a
          production-ready landing page.
        </p>
      </div>

      <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-16">
        {scopeCards.map((card, index) => (
          <article
            key={card.title}
            className="group relative border border-border/40 p-6 md:p-8 transition-colors duration-500 hover:border-accent/60"
          >
            <div className="absolute inset-0 bg-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <span className="relative z-10 font-mono text-[10px] text-accent">{String(index + 1).padStart(2, "0")}</span>
            <h3 className="relative z-10 mt-4 font-[var(--font-bebas)] text-2xl tracking-tight group-hover:text-accent transition-colors duration-300">
              {card.title}
            </h3>
            <p className="relative z-10 mt-3 font-mono text-xs text-muted-foreground leading-relaxed">{card.note}</p>
          </article>
        ))}
      </div>

      <div ref={formRef} className="border border-border/40 bg-card p-6 md:p-10">
        {status === "success" ? (
          <div className="flex flex-col items-start gap-4 py-12">
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent">Request received</span>
            <p className="max-w-md font-[var(--font-bebas)] text-3xl tracking-tight leading-tight">{message}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="b-name" className={labelClass}>
                  Name <span className="text-accent">*</span>
                </label>
                <input id="b-name" className={inputClass} value={form.name} onChange={(e) => update("name", e.target.value)} placeholder="Your name" />
                {errors.name && <p className="mt-2 font-mono text-[11px] text-destructive">{errors.name}</p>}
              </div>

              <div>
                <label htmlFor="b-email" className={labelClass}>
                  Email <span className="text-accent">*</span>
                </label>
                <input id="b-email" type="email" className={inputClass} value={form.email} onChange={(e) => update("email", e.target.value)} placeholder="you@brand.com" />
                {errors.email && <p className="mt-2 font-mono text-[11px] text-destructive">{errors.email}</p>}
              </div>

              <div className="md:col-span-2">
                <label htmlFor="b-product" className={labelClass}>
                  What are you selling? <span className="text-accent">*</span>
                </label>
                <input id="b-product" className={inputClass} value={form.product} onChange={(e) => update("product", e.target.value)} placeholder="Product, category, and offer" />
                {errors.product && <p className="mt-2 font-mono text-[11px] text-destructive">{errors.product}</p>}
              </div>
            </div>

            {/* Optional details toggle */}
            <button
              type="button"
              onClick={() => setShowDetails((v) => !v)}
              aria-expanded={showDetails}
              className="group inline-flex items-center gap-3 self-start font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground hover:text-accent transition-colors duration-200"
            >
              <BitmapChevron
                className={cn(
                  "transition-transform duration-[400ms] ease-in-out",
                  showDetails ? "rotate-90" : "rotate-0",
                )}
              />
              <span>{showDetails ? "Hide project details" : "Add project details (optional)"}</span>
            </button>

            {showDetails && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-border/40 pt-6">
                <div>
                  <label htmlFor="b-url" className={labelClass}>
                    Brand / site URL
                  </label>
                  <input id="b-url" className={inputClass} value={form.brandUrl} onChange={(e) => update("brandUrl", e.target.value)} placeholder="https://" />
                </div>

                <div>
                  <label htmlFor="b-platform" className={labelClass}>
                    Platform
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {platforms.map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => update("platform", p)}
                        className={cn(
                          "border px-3 py-2 font-mono text-[11px] uppercase tracking-wider transition-colors duration-200",
                          form.platform === p
                            ? "border-accent bg-accent text-accent-foreground"
                            : "border-border text-muted-foreground hover:border-accent/60 hover:text-foreground",
                        )}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                  {errors.platform && <p className="mt-2 font-mono text-[11px] text-destructive">{errors.platform}</p>}
                </div>

                <div className="md:col-span-2">
                  <label htmlFor="b-need" className={labelClass}>
                    What do you need help with?
                  </label>
                  <textarea
                    id="b-need"
                    rows={4}
                    className={cn(inputClass, "resize-none")}
                    value={form.need}
                    onChange={(e) => update("need", e.target.value)}
                    placeholder="The page, the angle, the research, the full workflow..."
                  />
                </div>

                <div>
                  <label htmlFor="b-timeline" className={labelClass}>
                    Timeline
                  </label>
                  <input id="b-timeline" className={inputClass} value={form.timeline} onChange={(e) => update("timeline", e.target.value)} placeholder="e.g. launch in 4 weeks" />
                </div>

                <div>
                  <label htmlFor="b-budget" className={labelClass}>
                    Budget range
                  </label>
                  <input id="b-budget" className={inputClass} value={form.budget} onChange={(e) => update("budget", e.target.value)} placeholder="e.g. $3k–5k" />
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row sm:items-center gap-4 pt-2">
              <button
                type="submit"
                disabled={status === "loading"}
                className="group inline-flex items-center justify-center gap-3 border border-accent bg-accent px-8 py-3 font-mono text-xs uppercase tracking-widest text-accent-foreground hover:bg-transparent hover:text-accent transition-all duration-200 disabled:opacity-50"
              >
                <ScrambleTextOnHover text={status === "loading" ? "Sending" : "Request a Build"} as="span" duration={0.6} />
                <BitmapChevron className="transition-transform duration-[400ms] ease-in-out group-hover:rotate-45" />
              </button>
              {status === "error" && message && <p className="font-mono text-[11px] text-destructive">{message}</p>}
            </div>
          </form>
        )}
      </div>
    </section>
  )
}

"use client"

import { useRef, useEffect, useState, type FormEvent } from "react"
import { ScrambleTextOnHover } from "@/components/scramble-text"
import { BitmapChevron } from "@/components/bitmap-chevron"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

const included = [
  "Customer research skill",
  "Persona builder skill",
  "Angle generator skill",
  "Swipe-file builder",
  "Advertorial planning prompt",
  "Page-builder handoff prompt",
  "Example outputs from the lab",
  "Session notes and updates",
]

type Status = "idle" | "loading" | "success" | "error"

export function KitSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const bodyRef = useRef<HTMLDivElement>(null)

  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<Status>("idle")
  const [message, setMessage] = useState("")

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
      gsap.from(bodyRef.current, {
        y: 40,
        opacity: 0,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: { trigger: bodyRef.current, start: "top 88%", toggleActions: "play none none reverse" },
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setStatus("loading")
    setMessage("")
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "diy-kit" }),
      })
      const data = await res.json()
      if (res.ok && data.ok) {
        setStatus("success")
        setMessage(data.message ?? "You're on the list.")
        setEmail("")
      } else {
        setStatus("error")
        setMessage(data.error ?? "Something went wrong. Try again.")
      }
    } catch {
      setStatus("error")
      setMessage("Network error. Try again.")
    }
  }

  return (
    <section ref={sectionRef} id="kit" className="relative py-32 pl-6 md:pl-28 pr-6 md:pr-12 border-t border-border/30">
      <div ref={headerRef} className="mb-16 max-w-3xl">
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent">03 / DIY Kit</span>
        <h2 className="mt-4 font-[var(--font-bebas)] text-5xl md:text-7xl tracking-tight">
          GET THE CREATIVE STRATEGIST KIT
        </h2>
        <p className="mt-6 max-w-xl font-mono text-sm text-muted-foreground leading-relaxed text-pretty">
          Use the same skills from the lab to build your own research-backed advertorial workflow.
        </p>
      </div>

      <div ref={bodyRef} className="grid grid-cols-1 lg:grid-cols-2 gap-px bg-border/40 border border-border/40">
        {/* Included list */}
        <div className="bg-background p-8 md:p-10">
          <h3 className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-6">
            What&apos;s included
          </h3>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
            {included.map((item) => (
              <li key={item} className="flex items-start gap-3">
                <span className="mt-[6px] h-1.5 w-1.5 flex-shrink-0 bg-accent" aria-hidden="true" />
                <span className="font-mono text-xs text-foreground/80 leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
          <p className="mt-8 border-t border-border/30 pt-6 font-mono text-[11px] text-muted-foreground/70 leading-relaxed">
            No generic AI prompt pack. This is the working system from the Skills Lab.
          </p>
        </div>

        {/* Email capture */}
        <div className="bg-card p-8 md:p-10 flex flex-col justify-center">
          <h3 className="font-[var(--font-bebas)] text-3xl tracking-tight">SEND ME THE KIT</h3>
          <p className="mt-3 font-mono text-xs text-muted-foreground leading-relaxed">
            Drop your email and I&apos;ll send the kit plus future lab updates.
          </p>

          {status === "success" ? (
            <div className="mt-8 border border-accent/50 bg-accent/5 p-5">
              <p className="font-mono text-xs text-accent leading-relaxed">{message}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-8">
              <label htmlFor="kit-email" className="sr-only">
                Email address
              </label>
              <div className="flex flex-col sm:flex-row">
                <input
                  id="kit-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@brand.com"
                  className="flex-1 border border-border bg-background px-4 py-3 font-mono text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-accent focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="group inline-flex items-center justify-center gap-3 border border-accent bg-accent px-6 py-3 font-mono text-xs uppercase tracking-widest text-accent-foreground hover:bg-transparent hover:text-accent transition-all duration-200 disabled:opacity-50"
                >
                  <ScrambleTextOnHover text={status === "loading" ? "Sending" : "Send"} as="span" duration={0.5} />
                  <BitmapChevron className="transition-transform duration-[400ms] ease-in-out group-hover:rotate-45" />
                </button>
              </div>
              {status === "error" && (
                <p className="mt-3 font-mono text-[11px] text-destructive">{message}</p>
              )}
              <p className="mt-4 font-mono text-[10px] uppercase tracking-widest text-muted-foreground/60">
                Email only. No spam. Unsubscribe anytime.
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}

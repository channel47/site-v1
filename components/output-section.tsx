"use client"

import { useRef, useEffect } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

const panels = [
  { tag: "ANGLE", line: "Mechanism-led hook framed against the category's biggest objection." },
  { tag: "LEAD", line: "Problem → discovery → reframe. Earns the read before the pitch." },
  { tag: "PROOF STACK", line: "Reviews, demonstrations, and specifics ordered by skepticism." },
  { tag: "PAGE STRUCTURE", line: "Hook → problem → discovery → proof → product bridge → offer → CTA." },
  { tag: "BUILD NOTES", line: "Section-by-section implementation direction for Shopify, WordPress, or custom." },
]

export function OutputSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)

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
      const rows = panelRef.current?.querySelectorAll("[data-row]")
      if (rows) {
        gsap.from(rows, {
          opacity: 0,
          y: 16,
          duration: 0.5,
          stagger: 0.1,
          ease: "power2.out",
          scrollTrigger: { trigger: panelRef.current, start: "top 85%", toggleActions: "play none none reverse" },
        })
      }
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} id="output" className="relative py-32 pl-6 md:pl-28 pr-6 md:pr-12 border-t border-border/30">
      <div ref={headerRef} className="mb-16 max-w-3xl">
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent">06 / What this produces</span>
        <h2 className="mt-4 font-[var(--font-bebas)] text-5xl md:text-7xl tracking-tight">
          THE OUTPUT IS NOT A PROMPT. IT IS A LAUNCHABLE PAGE PLAN.
        </h2>
      </div>

      {/* System panel / code-block motif */}
      <div ref={panelRef} className="border border-border/50 bg-card max-w-4xl">
        <div className="flex items-center justify-between border-b border-border/40 px-5 py-3">
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
            page-plan.output
          </span>
          <div className="flex gap-1.5" aria-hidden="true">
            <span className="h-2 w-2 bg-muted-foreground/30" />
            <span className="h-2 w-2 bg-muted-foreground/30" />
            <span className="h-2 w-2 bg-accent/70" />
          </div>
        </div>

        <div className="divide-y divide-border/30">
          {panels.map((panel, index) => (
            <div
              key={panel.tag}
              data-row
              className="group grid grid-cols-1 sm:grid-cols-[160px_1fr] gap-1 sm:gap-6 px-5 py-5 hover:bg-accent/5 transition-colors duration-300"
            >
              <div className="flex items-center gap-3">
                <span className="font-mono text-[10px] text-muted-foreground/50">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-accent">{panel.tag}</span>
              </div>
              <p className="font-mono text-xs text-foreground/80 leading-relaxed">{panel.line}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

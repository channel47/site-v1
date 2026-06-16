"use client"

import { useRef, useEffect } from "react"
import { ScrambleTextOnHover } from "@/components/scramble-text"
import { BitmapChevron } from "@/components/bitmap-chevron"
import { cn } from "@/lib/utils"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

const steps = [
  {
    id: "customer-research",
    label: "Customer Research",
    note: "Pull language, objections, desires, proof points, and competitor patterns.",
  },
  {
    id: "persona-builder",
    label: "Persona Builder",
    note: "Turn research into practical buyer segments, not fluffy avatars.",
  },
  {
    id: "angle-generator",
    label: "Angle Generator",
    note: "Map hooks, promises, mechanisms, and objections by segment.",
  },
  {
    id: "swipe-file-builder",
    label: "Swipe File Builder",
    note: "Collect and annotate advertorials, ads, claims, proof structures, and page patterns.",
  },
  {
    id: "advertorial-planner",
    label: "Advertorial Planner",
    note: "Turn the angle into a page outline: lead, story, proof, product bridge, offer, CTA.",
  },
  {
    id: "page-builder",
    label: "Page Builder",
    note: "Generate production-ready copy and implementation direction for Shopify, WordPress, or custom builds.",
  },
]

export function SystemSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const listRef = useRef<HTMLOListElement>(null)
  const lineRef = useRef<HTMLDivElement>(null)

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

      const items = listRef.current?.querySelectorAll("li")
      if (items) {
        gsap.from(items, {
          x: -40,
          opacity: 0,
          duration: 0.7,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: { trigger: listRef.current, start: "top 85%", toggleActions: "play none none reverse" },
        })
      }

      if (lineRef.current) {
        gsap.fromTo(
          lineRef.current,
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: "none",
            scrollTrigger: { trigger: listRef.current, start: "top 80%", end: "bottom 60%", scrub: 1 },
          },
        )
      }
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} id="system" className="relative py-32 pl-6 md:pl-28 pr-6 md:pr-12 border-t border-border/30">
      <div ref={headerRef} className="mb-16 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
        <div>
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent">02 / The channel47 workflow</span>
          <h2 className="mt-4 font-[var(--font-bebas)] text-5xl md:text-7xl tracking-tight">
            A SKILLS PIPELINE FOR PERFORMANCE WORK
          </h2>
        </div>
        <p className="md:max-w-xs font-mono text-xs text-muted-foreground leading-relaxed md:text-right">
          Each skill is a playbook. The output of one becomes the input of the next, end to end.
        </p>
      </div>

      <ol ref={listRef} className="relative pl-8 md:pl-10">
        {/* progress line */}
        <div
          ref={lineRef}
          className="absolute left-[7px] md:left-[11px] top-2 bottom-2 w-px origin-top bg-accent/60"
          aria-hidden="true"
        />
        {steps.map((step, index) => (
          <li key={step.id} className="group relative pb-12 last:pb-0">
            {/* node */}
            <span className="absolute -left-8 md:-left-10 top-1 flex h-4 w-4 items-center justify-center">
              <span className="h-2 w-2 rounded-full bg-muted-foreground/50 group-hover:bg-accent group-hover:scale-150 transition-all duration-300" />
            </span>

            <div
              className={cn(
                "border border-border/40 bg-card/40 p-5 md:p-6",
                "transition-colors duration-300 group-hover:border-accent/50",
              )}
            >
              <div className="flex items-baseline gap-4">
                <span className="font-mono text-xs text-accent">{String(index + 1).padStart(2, "0")}</span>
                <h3 className="font-[var(--font-bebas)] text-2xl md:text-3xl tracking-tight group-hover:text-accent transition-colors duration-300">
                  {step.label}
                </h3>
              </div>
              <p className="mt-3 max-w-2xl font-mono text-xs md:text-sm text-muted-foreground leading-relaxed">
                {step.note}
              </p>
            </div>
          </li>
        ))}
      </ol>

      <div className="mt-14 pl-8 md:pl-10">
        <a
          href="#kit"
          className="group inline-flex items-center gap-3 border border-foreground/20 px-6 py-3 font-mono text-xs uppercase tracking-widest text-foreground hover:border-accent hover:text-accent transition-all duration-200"
        >
          <ScrambleTextOnHover text="Get the Skills Kit" as="span" duration={0.6} />
          <BitmapChevron className="transition-transform duration-[400ms] ease-in-out group-hover:rotate-45" />
        </a>
      </div>
    </section>
  )
}

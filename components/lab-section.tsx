"use client"

import { useRef, useEffect } from "react"
import { HighlightText } from "@/components/highlight-text"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

const timeline = [
  {
    marker: "Last lab",
    title: "Customer research → personas → angles",
    note: "Three skills demoed live: customer research, persona building, and angle generation.",
  },
  {
    marker: "Next lab",
    title: "Swipe file → advertorial planner → page builder",
    note: "Building the swipe file, planning the page, and turning strategy into a ready-to-build draft.",
  },
  {
    marker: "After the lab",
    title: "Kit updates, examples, and done-for-you builds",
    note: "Ongoing updates to the kit, new example outputs, and hands-on builds for brands.",
  },
]

export function LabSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const listRef = useRef<HTMLDivElement>(null)

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
      const rows = listRef.current?.querySelectorAll("article")
      if (rows) {
        gsap.from(rows, {
          x: -40,
          opacity: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: { trigger: listRef.current, start: "top 85%", toggleActions: "play none none reverse" },
        })
      }
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} id="lab" className="relative py-32 pl-6 md:pl-28 pr-6 md:pr-12 border-t border-border/30">
      <div ref={headerRef} className="mb-16 max-w-3xl">
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent">05 / The Skills Lab</span>
        <h2 className="mt-4 font-[var(--font-bebas)] text-4xl md:text-6xl lg:text-7xl tracking-tight leading-[0.95]">
          BUILT <HighlightText parallaxSpeed={0.5}>LIVE</HighlightText> WITH MARKETERS, NOT PACKAGED IN A VACUUM.
        </h2>
        <p className="mt-8 max-w-xl font-mono text-sm text-muted-foreground leading-relaxed text-pretty">
          I lead monthly Skills Labs inside The Vibe Marketers community. Each session builds the system in the open,
          then turns the work into kit updates and done-for-you builds.
        </p>
      </div>

      <div ref={listRef} className="divide-y divide-border/30 border-t border-b border-border/30">
        {timeline.map((item) => (
          <article
            key={item.marker}
            className="group grid grid-cols-1 md:grid-cols-[180px_1fr] gap-2 md:gap-8 py-8 transition-colors duration-300"
          >
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent pt-1">{item.marker}</span>
            <div>
              <h3 className="font-[var(--font-bebas)] text-2xl md:text-3xl tracking-tight group-hover:text-accent transition-colors duration-300">
                {item.title}
              </h3>
              <p className="mt-2 max-w-2xl font-mono text-xs md:text-sm text-muted-foreground leading-relaxed">
                {item.note}
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

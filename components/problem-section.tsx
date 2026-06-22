"use client"

import { useRef, useEffect } from "react"
import { cn } from "@/lib/utils"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

const cards = [
  {
    title: "Research gets scattered",
    note: "Reviews, ad comments, and competitor pages pile up in tabs and docs, but never turn into a usable angle.",
  },
  {
    title: "Angles get guessed",
    note: "The hook, promise, and mechanism get copied from whatever advertorial looked good last week.",
  },
  {
    title: "Pages get built too late",
    note: "Strategy and copy stall, so the page is rushed at the end instead of designed from insight.",
  },
]

export function ProblemSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)

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

      const articles = gridRef.current?.querySelectorAll("article")
      if (articles) {
        gsap.from(articles, {
          y: 60,
          opacity: 0,
          duration: 0.8,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: { trigger: gridRef.current, start: "top 88%", toggleActions: "play none none reverse" },
        })
      }
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      id="problem"
      className="relative py-32 pl-6 md:pl-28 pr-6 md:pr-12 border-t border-border/30"
    >
      <div ref={headerRef} className="mb-16 max-w-4xl">
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent">01 / Why this exists</span>
        <h2 className="mt-4 font-[var(--font-bebas)] text-4xl md:text-6xl lg:text-7xl tracking-tight leading-[0.95] text-balance">
          MOST ADVERTORIALS ARE COPIED FROM EXAMPLES. THE GOOD ONES ARE BUILT FROM CUSTOMER INSIGHT.
        </h2>
        <p className="mt-8 max-w-xl font-mono text-sm text-muted-foreground leading-relaxed text-pretty">
          Marketers already have reviews, product pages, ad comments, competitor pages, and customer language.
          The hard part is turning that raw material into a page angle, story, proof structure, and CTA flow that
          can actually ship.
        </p>
      </div>

      <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        {cards.map((card, index) => (
          <article
            key={card.title}
            className={cn(
              "group relative border border-border/40 p-6 md:p-8 flex flex-col justify-between min-h-[220px]",
              "transition-colors duration-500 hover:border-accent/60",
            )}
          >
            <div className="absolute inset-0 bg-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <span className="relative z-10 font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
              No. {String(index + 1).padStart(2, "0")}
            </span>
            <div className="relative z-10 mt-8">
              <h3 className="font-[var(--font-bebas)] text-3xl tracking-tight group-hover:text-accent transition-colors duration-300">
                {card.title}
              </h3>
              <div className="mt-4 w-12 h-px bg-accent/60 group-hover:w-full transition-all duration-500" />
              <p className="mt-6 font-mono text-xs text-muted-foreground leading-relaxed">{card.note}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

"use client"

import { useRef, useEffect } from "react"
import { ScrambleTextOnHover } from "@/components/scramble-text"
import { BitmapChevron } from "@/components/bitmap-chevron"
import { AnimatedNoise } from "@/components/animated-noise"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

export function CtaSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!sectionRef.current) return
    const ctx = gsap.context(() => {
      const children = contentRef.current?.children
      if (children) {
        gsap.from(children, {
          y: 40,
          opacity: 0,
          duration: 0.9,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: { trigger: contentRef.current, start: "top 85%", toggleActions: "play none none reverse" },
        })
      }
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      id="cta"
      className="relative overflow-hidden py-40 pl-6 md:pl-28 pr-6 md:pr-12 border-t border-border/30"
    >
      <AnimatedNoise opacity={0.04} />

      <div ref={contentRef} className="relative z-10 max-w-4xl">
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent">07 / Start here</span>
        <h2 className="mt-6 font-[var(--font-bebas)] text-[clamp(2.5rem,7vw,6rem)] leading-[0.92] tracking-tight text-balance">
          Start with the kit. Bring me in when you want it built.
        </h2>

        <div className="mt-12 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8">
          <a
            href="#kit"
            className="group inline-flex items-center justify-center gap-3 border border-accent bg-accent px-6 py-3 font-mono text-xs uppercase tracking-widest text-accent-foreground hover:bg-transparent hover:text-accent transition-all duration-200"
          >
            <ScrambleTextOnHover text="Get the Advertorial Kit" as="span" duration={0.6} />
            <BitmapChevron className="transition-transform duration-[400ms] ease-in-out group-hover:rotate-45" />
          </a>
          <a
            href="#build"
            className="group inline-flex items-center gap-3 border border-foreground/20 px-6 py-3 font-mono text-xs uppercase tracking-widest text-foreground hover:border-accent hover:text-accent transition-all duration-200"
          >
            <ScrambleTextOnHover text="Request a Done-For-You Build" as="span" duration={0.6} />
          </a>
        </div>
      </div>

      {/* Footer */}
      <div className="relative z-10 mt-32 pt-8 border-t border-border/20 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <p className="font-[var(--font-bebas)] text-2xl tracking-tight">CHANNEL47</p>
          <p className="mt-1 font-mono text-[11px] text-muted-foreground">
            by Jackson /{" "}
            <a href="https://x.com/ctrlswing" className="hover:text-accent transition-colors duration-200">
              @ctrlswing
            </a>
          </p>
        </div>
        <p className="max-w-xs font-mono text-[10px] uppercase tracking-widest text-muted-foreground md:text-right leading-relaxed">
          Built from monthly Skills Labs inside The Vibe Marketers.
        </p>
      </div>
    </section>
  )
}

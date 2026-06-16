"use client"

import { useEffect, useRef } from "react"
import { ScrambleTextOnHover } from "@/components/scramble-text"
import { SplitFlapText, SplitFlapAudioProvider } from "@/components/split-flap-text"
import { AnimatedNoise } from "@/components/animated-noise"
import { BitmapChevron } from "@/components/bitmap-chevron"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

const pipeline = ["research", "personas", "angles", "swipe file", "advertorial"]

export function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!sectionRef.current || !contentRef.current) return

    const ctx = gsap.context(() => {
      gsap.to(contentRef.current, {
        y: -100,
        opacity: 0,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative min-h-screen flex items-center pt-28 pb-20 md:py-0 pl-6 md:pl-28 pr-6 md:pr-12"
    >
      <AnimatedNoise opacity={0.03} />

      {/* Left vertical label */}
      <div className="absolute left-6 top-1/2 -translate-y-1/2 hidden md:block">
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground -rotate-90 origin-left block whitespace-nowrap">
          CHANNEL47 · SKILLS LAB
        </span>
      </div>

      {/* Main content */}
      <div ref={contentRef} className="flex-1 w-full max-w-5xl">
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent">
          CHANNEL47 · SKILLS LAB
        </span>

        <SplitFlapAudioProvider>
          <div className="relative mt-6">
            <SplitFlapText text="CHANNEL47" speed={80} />
          </div>
        </SplitFlapAudioProvider>

        <h1 className="mt-8 font-[var(--font-bebas)] text-[clamp(2.25rem,6vw,5rem)] leading-[0.95] tracking-tight text-balance max-w-3xl">
          Turn customer research into story-driven landing pages that are ready to build.
        </h1>

        <p className="mt-8 max-w-xl font-mono text-sm text-muted-foreground leading-relaxed text-pretty">
          A practical Skills Lab for ecommerce marketers. Use AI skills to move from customer research,
          personas, and angles into swipe files, page strategy, and production-ready landing page drafts.
        </p>

        {/* Pipeline panel */}
        <div className="mt-10 inline-flex max-w-full flex-wrap items-center gap-2 border border-border bg-card/50 px-4 py-3">
          {pipeline.map((step, i) => (
            <span key={step} className="inline-flex items-center gap-2">
              <span className="font-mono text-[11px] uppercase tracking-widest text-foreground/80">{step}</span>
              {i < pipeline.length - 1 && <span className="font-mono text-xs text-accent">{"→"}</span>}
            </span>
          ))}
        </div>

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
            className="font-mono text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors duration-200"
          >
            Request a Done-For-You Build
          </a>
        </div>

        <p className="mt-10 max-w-md font-mono text-[11px] leading-relaxed text-muted-foreground/70">
          Built live inside The Vibe Marketers, a Skool community for marketers shipping with AI.
        </p>
      </div>

      {/* Floating info tag */}
      <div className="absolute bottom-8 right-6 md:bottom-12 md:right-12 hidden sm:block">
        <div className="border border-border px-4 py-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          Creative Strategist / Lab Build
        </div>
      </div>
    </section>
  )
}

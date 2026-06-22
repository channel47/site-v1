"use client"

import { useState, useEffect, useCallback, useRef } from "react"

const CARDS = [
  {
    title: "Walkthroughs",
    desc: "Watch each system get built, live.",
    bg: "oklch(0.35 0.06 195)",
  },
  {
    title: "Systems",
    desc: "Plug-and-play workflows for every channel.",
    bg: "oklch(0.45 0.09 55)",
  },
  {
    title: "Principles",
    desc: "The frameworks underneath the tactics.",
    bg: "oklch(0.40 0.05 148)",
  },
  {
    title: "Agent Workflows",
    desc: "Claude Code agents that run your stack.",
    bg: "oklch(0.35 0.04 265)",
  },
  {
    title: "Templates",
    desc: "Start with structure, not a blank page.",
    bg: "oklch(0.42 0.08 32)",
  },
]

const VISIBLE = 3
const INTERVAL_MS = 4500

export function HeroCarousel() {
  const [offset, setOffset] = useState(0)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const totalSlides = CARDS.length - VISIBLE + 1

  const startTimer = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current)
    intervalRef.current = setInterval(() => {
      setOffset((o) => (o + 1) % totalSlides)
    }, INTERVAL_MS)
  }, [totalSlides])

  useEffect(() => {
    startTimer()
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [startTimer])

  const goTo = (i: number) => {
    setOffset(i)
    startTimer()
  }

  return (
    <div className="hero-carousel">
      <div className="carousel-viewport">
        <div
          className="carousel-track"
          style={{
            transform: `translateX(-${offset * (100 / VISIBLE)}%)`,
          }}
        >
          {CARDS.map((card) => (
            <div key={card.title} className="carousel-slide">
              <div className="carousel-card" style={{ backgroundColor: card.bg }}>
                <h3>{card.title}</h3>
                <p>{card.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="carousel-dots">
        {Array.from({ length: totalSlides }, (_, i) => (
          <button
            key={i}
            className={`carousel-dot${i === offset ? " is-active" : ""}`}
            onClick={() => goTo(i)}
            aria-label={`Go to slide group ${i + 1}`}
          />
        ))}
      </div>
    </div>
  )
}

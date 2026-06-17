"use client"

import { useCallback, useEffect, useRef, useState } from "react"

type Logo47Props = {
  className?: string
  delay?: number
  size?: "sm" | "lg"
}

const GLYPHS = ["█", "▓", "▒", "░", "▀", "▄", "▌", "▐", "■", "□", "▪", "▫", "◼", "◻", "▰", "▱"]

const LINES = [
  ["█", " ", "█", " ", "▀", "▀", "█"],
  ["▀", "▀", "█", " ", " ", "█"],
] as const

const TARGETS = LINES.flat()
const INITIAL_LOCKED = TARGETS.map((char) => char === " ")
const NON_SPACE_INDICES = TARGETS.map((char, index) => (char === " " ? -1 : index)).filter((index) => index !== -1)

function randomGlyph() {
  return GLYPHS[Math.floor(Math.random() * GLYPHS.length)]
}

function randomState() {
  return TARGETS.map((char) => (char === " " ? " " : randomGlyph()))
}

function shuffledIndices() {
  return [...NON_SPACE_INDICES].sort(() => Math.random() - 0.5)
}

function getReducedMotionPreference() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches
}

export function Logo47({ className, delay = 0, size = "sm" }: Logo47Props) {
  const [displayChars, setDisplayChars] = useState<string[]>(() => [...TARGETS])
  const [lockedChars, setLockedChars] = useState(() => TARGETS.map(() => true))
  const [flashingChars, setFlashingChars] = useState(() => TARGETS.map(() => false))
  const [phase, setPhase] = useState<"idle" | "animating" | "complete">("idle")

  const elementRef = useRef<HTMLSpanElement>(null)
  const intervalRef = useRef<number | null>(null)
  const timeoutsRef = useRef<number[]>([])
  const lockedRef = useRef([...INITIAL_LOCKED])
  const hasAnimatedRef = useRef(false)
  const isReplayingRef = useRef(false)

  const clearTimers = useCallback(() => {
    if (intervalRef.current !== null) {
      window.clearInterval(intervalRef.current)
      intervalRef.current = null
    }

    timeoutsRef.current.forEach((timeout) => window.clearTimeout(timeout))
    timeoutsRef.current = []
  }, [])

  const completeAnimation = useCallback(() => {
    if (intervalRef.current !== null) {
      window.clearInterval(intervalRef.current)
      intervalRef.current = null
    }

    setDisplayChars([...TARGETS])
    setLockedChars(TARGETS.map(() => true))
    setPhase("complete")
    isReplayingRef.current = false
  }, [])

  const lockChar = useCallback((index: number) => {
    lockedRef.current[index] = true

    setDisplayChars((chars) => {
      const next = [...chars]
      next[index] = TARGETS[index]
      return next
    })

    setLockedChars([...lockedRef.current])
    setFlashingChars((chars) => {
      const next = [...chars]
      next[index] = true
      return next
    })

    const flashTimeout = window.setTimeout(() => {
      setFlashingChars((chars) => {
        const next = [...chars]
        next[index] = false
        return next
      })
    }, 100)

    timeoutsRef.current.push(flashTimeout)
  }, [])

  const runAnimation = useCallback(
    (mode: "initial" | "replay") => {
      if (getReducedMotionPreference()) {
        clearTimers()
        lockedRef.current = TARGETS.map(() => true)
        setDisplayChars([...TARGETS])
        setLockedChars(TARGETS.map(() => true))
        setFlashingChars(TARGETS.map(() => false))
        setPhase("complete")
        isReplayingRef.current = false
        return
      }

      clearTimers()
      lockedRef.current = [...INITIAL_LOCKED]
      setDisplayChars(randomState())
      setLockedChars([...INITIAL_LOCKED])
      setFlashingChars(TARGETS.map(() => false))
      setPhase("animating")

      intervalRef.current = window.setInterval(() => {
        setDisplayChars((chars) =>
          chars.map((char, index) => {
            if (TARGETS[index] === " " || lockedRef.current[index]) {
              return TARGETS[index]
            }

            return randomGlyph()
          }),
        )
      }, 50)

      const indices = shuffledIndices()
      const baseDelay = mode === "initial" ? 300 : 100
      const lockDuration = mode === "initial" ? 800 : 400

      indices.forEach((charIndex, index) => {
        const progress = index / indices.length
        const easeOut = 1 - Math.pow(1 - progress, 2)
        const lockTime = baseDelay + easeOut * lockDuration

        const timeout = window.setTimeout(() => {
          lockChar(charIndex)

          if (index === indices.length - 1) {
            const completeTimeout = window.setTimeout(completeAnimation, mode === "initial" ? 150 : 100)
            timeoutsRef.current.push(completeTimeout)
          }
        }, lockTime)

        timeoutsRef.current.push(timeout)
      })
    },
    [clearTimers, completeAnimation, lockChar],
  )

  useEffect(() => {
    const element = elementRef.current

    if (!element) {
      return
    }

    if (getReducedMotionPreference()) {
      runAnimation("initial")
      hasAnimatedRef.current = true
      return
    }

    const startAnimation = () => {
      if (hasAnimatedRef.current) {
        return
      }

      hasAnimatedRef.current = true

      const timeout = window.setTimeout(() => runAnimation("initial"), delay)
      timeoutsRef.current.push(timeout)
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            startAnimation()
            observer.disconnect()
          }
        })
      },
      { threshold: 0.5 },
    )

    observer.observe(element)

    return () => {
      observer.disconnect()
      clearTimers()
    }
  }, [clearTimers, delay, runAnimation])

  const replayAnimation = useCallback(() => {
    if (!hasAnimatedRef.current || isReplayingRef.current || getReducedMotionPreference()) {
      return
    }

    isReplayingRef.current = true
    runAnimation("replay")
  }, [runAnimation])

  return (
    <span
      ref={elementRef}
      aria-label="47 logo"
      className={[`logo47 logo47--${size}`, phase === "animating" && "is-animating", phase === "complete" && "is-complete", className]
        .filter(Boolean)
        .join(" ")}
      onMouseEnter={replayAnimation}
      role="img"
    >
      <span aria-hidden="true" className="logo47__glyph">
        {LINES.map((line, lineIndex) => {
          const offset = LINES.slice(0, lineIndex).reduce((total, currentLine) => total + currentLine.length, 0)

          return (
            <span className="logo47__line" key={lineIndex}>
              {line.map((_, charIndex) => {
                const index = offset + charIndex

                return (
                  <span
                    className={[
                      "logo47__char",
                      lockedChars[index] && "is-locked",
                      flashingChars[index] && "is-flashing",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                    key={`${lineIndex}-${charIndex}`}
                  >
                    {displayChars[index]}
                  </span>
                )
              })}
            </span>
          )
        })}
      </span>
    </span>
  )
}

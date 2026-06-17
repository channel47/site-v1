"use client"

import { type CSSProperties, useCallback, useEffect, useRef, useState } from "react"

type Logo47Props = {
  className?: string
  delay?: number
  size?: "sm" | "lg"
}

type ScatterShape = "full" | "top" | "bottom" | "left" | "right" | "small" | "outline"

type LogoPiece = {
  h: number
  w: number
  x: number
  y: number
}

type PieceStyle = CSSProperties & {
  "--h": string
  "--w": string
  "--x": string
  "--y": string
}

const LOGO_WIDTH = 120
const LOGO_HEIGHT = 62

const PIECES: LogoPiece[] = [
  { x: 0, y: 0, w: 18, h: 46 },
  { x: 37, y: 0, w: 18, h: 62 },
  { x: 0, y: 31, w: 55, h: 15 },
  { x: 65, y: 0, w: 55, h: 15 },
  { x: 102, y: 0, w: 18, h: 31 },
  { x: 84, y: 31, w: 18, h: 31 },
]

const SCATTER_SHAPES: ScatterShape[] = ["full", "top", "bottom", "left", "right", "small", "outline"]

function randomShape() {
  return SCATTER_SHAPES[Math.floor(Math.random() * SCATTER_SHAPES.length)]
}

function randomState() {
  return PIECES.map(() => randomShape())
}

function shuffledPieceIndices() {
  return PIECES.map((_, index) => index).sort(() => Math.random() - 0.5)
}

function getReducedMotionPreference() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches
}

function pieceStyle(piece: LogoPiece): PieceStyle {
  return {
    "--h": `${(piece.h / LOGO_HEIGHT) * 100}%`,
    "--w": `${(piece.w / LOGO_WIDTH) * 100}%`,
    "--x": `${(piece.x / LOGO_WIDTH) * 100}%`,
    "--y": `${(piece.y / LOGO_HEIGHT) * 100}%`,
  }
}

export function Logo47({ className, delay = 0, size = "sm" }: Logo47Props) {
  const [shapes, setShapes] = useState<ScatterShape[]>(() => PIECES.map(() => "full"))
  const [lockedPieces, setLockedPieces] = useState(() => PIECES.map(() => true))
  const [flashingPieces, setFlashingPieces] = useState(() => PIECES.map(() => false))
  const [phase, setPhase] = useState<"idle" | "animating" | "complete">("idle")

  const elementRef = useRef<HTMLSpanElement>(null)
  const intervalRef = useRef<number | null>(null)
  const timeoutsRef = useRef<number[]>([])
  const lockedRef = useRef(PIECES.map(() => false))
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

    setShapes(PIECES.map(() => "full"))
    setLockedPieces(PIECES.map(() => true))
    setPhase("complete")
    isReplayingRef.current = false
  }, [])

  const lockPiece = useCallback((index: number) => {
    lockedRef.current[index] = true

    setShapes((currentShapes) => {
      const next = [...currentShapes]
      next[index] = "full"
      return next
    })

    setLockedPieces([...lockedRef.current])
    setFlashingPieces((pieces) => {
      const next = [...pieces]
      next[index] = true
      return next
    })

    const flashTimeout = window.setTimeout(() => {
      setFlashingPieces((pieces) => {
        const next = [...pieces]
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
        lockedRef.current = PIECES.map(() => true)
        setShapes(PIECES.map(() => "full"))
        setLockedPieces(PIECES.map(() => true))
        setFlashingPieces(PIECES.map(() => false))
        setPhase("complete")
        isReplayingRef.current = false
        return
      }

      clearTimers()
      lockedRef.current = PIECES.map(() => false)
      setShapes(randomState())
      setLockedPieces(PIECES.map(() => false))
      setFlashingPieces(PIECES.map(() => false))
      setPhase("animating")

      intervalRef.current = window.setInterval(() => {
        setShapes((currentShapes) =>
          currentShapes.map((shape, index) => (lockedRef.current[index] ? "full" : randomShape())),
        )
      }, 50)

      const indices = shuffledPieceIndices()
      const baseDelay = mode === "initial" ? 300 : 100
      const lockDuration = mode === "initial" ? 800 : 400

      indices.forEach((pieceIndex, index) => {
        const progress = index / indices.length
        const easeOut = 1 - Math.pow(1 - progress, 2)
        const lockTime = baseDelay + easeOut * lockDuration

        const timeout = window.setTimeout(() => {
          lockPiece(pieceIndex)

          if (index === indices.length - 1) {
            const completeTimeout = window.setTimeout(completeAnimation, mode === "initial" ? 150 : 100)
            timeoutsRef.current.push(completeTimeout)
          }
        }, lockTime)

        timeoutsRef.current.push(timeout)
      })
    },
    [clearTimers, completeAnimation, lockPiece],
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
        {PIECES.map((piece, index) => (
          <span
            className={[
              "logo47__piece",
              lockedPieces[index] && "is-locked",
              flashingPieces[index] && "is-flashing",
            ]
              .filter(Boolean)
              .join(" ")}
            data-shape={shapes[index]}
            key={`${piece.x}-${piece.y}-${index}`}
            style={pieceStyle(piece)}
          >
            <span className="logo47__fill" />
          </span>
        ))}
      </span>
    </span>
  )
}

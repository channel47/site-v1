"use client";

import Link from "next/link"
import { AnimatedMark, useMarkReplay } from "./animated-mark"
import {
  MARK_PATH,
  MARK_HEIGHT,
  MARK_VIEWBOX,
  MARK_WIDTH,
} from "@/components/site/mark"

/** Header marks replay on hover while retaining ordinary link navigation. */
export function MarkLink({ small = false }: { small?: boolean }) {
  const { motion, hover } = useMarkReplay();
  return (
    <Link href="/" aria-label="Channel47 — home" className={`st-mark${small ? " st-mark-small" : ""}`} onPointerEnter={small ? undefined : hover}>
      {small ? <svg
        viewBox={MARK_VIEWBOX}
        width={MARK_WIDTH}
        height={MARK_HEIGHT}
        fill="currentColor"
        aria-hidden
      >
        <path d={MARK_PATH} />
      </svg> : <AnimatedMark {...motion} />}
    </Link>
  )
}

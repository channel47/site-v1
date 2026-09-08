"use client"

import Link from "next/link"
import type { ComponentProps } from "react"
import { measure } from "./measurement"

export function MeasuredLink({ event, ...props }: ComponentProps<typeof Link> & {
  href: string
  event: "related_click" | "repository_click"
}) {
  const record = () => measure(event, event === "related_click" ? { target_path: props.href } : {})
  return <Link {...props} onClick={record} onAuxClick={(e) => { if (e.button === 1) record() }} />
}

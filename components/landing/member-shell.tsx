"use client"

import { useEffect, useState, type ReactNode } from "react"

export const STORAGE_KEY = "ch47_unlocked"
export const UNLOCK_EVENT = "ch47:unlock"

/**
 * Wraps the page and toggles the root `member-on` class. That single class
 * drives the on-the-list confirmation bar through CSS — so this is the only
 * client state the otherwise-static page needs.
 *
 * Joining the waitlist persists a flag in localStorage and fires
 * `window.dispatchEvent(new Event("ch47:unlock"))`, which reveals the bar.
 */
export function MemberShell({ children }: { children: ReactNode }) {
  const [member, setMember] = useState(false)

  useEffect(() => {
    try {
      if (localStorage.getItem(STORAGE_KEY) === "1") setMember(true)
    } catch {
      /* storage unavailable — stay logged out */
    }

    const onUnlock = () => setMember(true)
    window.addEventListener(UNLOCK_EVENT, onUnlock)
    return () => window.removeEventListener(UNLOCK_EVENT, onUnlock)
  }, [])

  return <div className={member ? "member-on" : undefined}>{children}</div>
}

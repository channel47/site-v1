"use client"

import { useEffect, useState, type ReactNode } from "react"

const STORAGE_KEY = "ch47_unlocked"
const UNLOCK_EVENT = "ch47:unlock"

/**
 * Wraps the page and toggles the root `member-on` class. That single class
 * drives every member/non-member swap (the code bar, the access CTA, the
 * struck-through price) through CSS — so this is the only client state the
 * otherwise-static page needs.
 *
 * Unlock is persisted in localStorage and can be triggered from anywhere via
 * `window.dispatchEvent(new Event("ch47:unlock"))` — the hook a future
 * code-entry flow will fire.
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

"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { createContext, useContext, useEffect, useRef, useState, type ComponentProps, type ReactNode } from "react"

type Visit = { href: string; entry: string; scrollY: number }
const BrowseContext = createContext<{
  visit: Visit | null
  remember: (entry: string) => void
}>({ visit: null, remember: () => {} })

/** Keep a browse → piece → back journey within this tab's navigation history.
 * Direct arrivals have an ordinary section link; no stale persisted history. */
export function BrowseNavigation({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const [visit, setVisit] = useState<Visit | null>(null)
  const previousPath = useRef(pathname)

  useEffect(() => {
    const previous = previousPath.current
    previousPath.current = pathname
    if (!visit || pathname === visit.entry || pathname === previous) return
    if (pathname === "/browse" && previous === visit.entry) {
      const frame = requestAnimationFrame(() => {
        window.scrollTo({ top: visit.scrollY, behavior: "instant" })
        const links = document.querySelectorAll<HTMLAnchorElement>(".st-row")
        Array.from(links).find((link) => link.getAttribute("href") === visit.entry)?.focus({ preventScroll: true })
        setVisit(null)
      })
      return () => cancelAnimationFrame(frame)
    }
    setVisit(null)
  }, [pathname, visit])

  return (
    <BrowseContext.Provider value={{ visit, remember: (entry) => {
      if (pathname === "/browse") {
        setVisit({ href: `${window.location.pathname}${window.location.search}`, entry, scrollY: window.scrollY })
      }
    } }}>
      {children}
    </BrowseContext.Provider>
  )
}

export function BrowseEntryLink(props: ComponentProps<typeof Link> & { href: string }) {
  const { remember } = useContext(BrowseContext)
  return <Link {...props} onNavigate={() => remember(props.href)} />
}

export function BackToBrowse({ href, children, className }: { href: string; children: ReactNode; className?: string }) {
  const { visit } = useContext(BrowseContext)
  const pathname = usePathname()
  const router = useRouter()
  const returning = visit?.entry === pathname
  return (
    <Link href={returning ? visit.href : href} className={className} onNavigate={returning ? (event) => {
      event.preventDefault()
      router.back()
    } : undefined}>
      {returning ? "← Back to results" : children}
    </Link>
  )
}

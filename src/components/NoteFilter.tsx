"use client"

import { useState } from "react"

interface NoteFilterProps {
  tags: readonly string[]
}

export default function NoteFilter({ tags }: NoteFilterProps) {
  const [active, setActive] = useState("all")

  function handleClick(tag: string) {
    setActive(tag)
    window.dispatchEvent(
      new CustomEvent("ch47:filter", { detail: { tag } })
    )
  }

  return (
    <div data-slot="note-filter" className="flex gap-2 flex-wrap">
      {tags.map((t) => (
        <button
          key={t}
          onClick={() => handleClick(t)}
          className={[
            "font-mono text-[10px] font-semibold tracking-[0.15em] uppercase",
            "px-3 py-1.5 rounded-tight border cursor-pointer",
            "transition-colors duration-100",
            "focus-visible:outline-2 focus-visible:outline-signal focus-visible:outline-offset-2",
            active === t
              ? "text-signal border-signal bg-[var(--signal-dim-alpha)]"
              : "text-stone border-smoke bg-transparent hover:text-bone hover:border-ash",
          ].join(" ")}
        >
          {t.toUpperCase()}
        </button>
      ))}
    </div>
  )
}

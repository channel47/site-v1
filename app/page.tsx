import { AdvertorialContent } from "./_offer/advertorial-content"
import { AdvertorialRuntime } from "./_offer/advertorial-runtime"

// channel47.dev — the home is the offer. "Advertorials, on tap." is channel47's
// single flagship today, so it lives at the canonical `/` (no redirect hop).
// AdvertorialContent is the server-rendered design tree (generated from
// design-import/Advertorials on Tap.dc.html); AdvertorialRuntime wires its
// interactive behaviors. Page metadata is inherited from app/layout.tsx, which
// already describes this offer. The old /advertorial URL 301s here (next.config).
export default function Page() {
  return (
    <>
      <AdvertorialContent />
      <AdvertorialRuntime />
    </>
  )
}

import { AdvertorialContent } from "./advertorial-content"
import { PageRuntime } from "./page-runtime"

// AdvertorialContent is the design markup compiled to a server-rendered React
// tree (fully crawlable). PageRuntime wires the interactive behaviors:
// brandmark scramble, scroll reveal, the click-to-open screenshot lightbox,
// style-hover effects, and the computed "first advertorial by {date}" line.
export default function Page() {
  return (
    <>
      <AdvertorialContent />
      <PageRuntime />
    </>
  )
}

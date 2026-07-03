import { jsonLd } from "@/lib/seo"

/**
 * Server-rendered JSON-LD block. Schema must be in the initial HTML response —
 * client-injected schema is invisible to curl-class fetchers and unreliable
 * for crawlers — so this renders inline wherever the graph belongs.
 */
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      // Serialized first-party entity data; `<` is escaped in jsonLd().
      dangerouslySetInnerHTML={{ __html: jsonLd(data) }}
    />
  )
}

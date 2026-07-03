import type { MetadataRoute } from "next"
import { SITE_URL } from "@/lib/seo"

/**
 * Humans-and-machines-welcome crawl policy (docs/AI-SEO.md, Layer 3).
 *
 * Channel 47's growth model depends on being known and recommended by AI
 * systems, so AI crawlers — training, search retrieval, and on-demand user
 * fetches alike — are explicitly allowed. The explicit per-bot groups signal
 * a deliberate policy and give us a place to diverge per-bot later.
 *
 * Disallowed for everyone:
 * - /api/subscribe — a POST capture endpoint, not content. /api and
 *   /api/search stay OPEN: they exist for agents, and on-demand fetchers
 *   (Claude-User, ChatGPT-User) respect robots.txt — blocking them would
 *   break the site-as-a-tool surface.
 * - /md/ — internal rewrite target for the markdown twins. The public
 *   machine URLs are `<content-url>.md`; indexing /md/* would just create
 *   duplicate-content noise.
 */

const DISALLOW = ["/api/subscribe", "/md/"]

// This list churns — verify against provider docs when revisiting.
const AI_CRAWLERS = [
  // Training
  "GPTBot",
  "ClaudeBot",
  "Google-Extended",
  "Applebot-Extended",
  "meta-externalagent",
  "CCBot",
  // Live retrieval / search
  "OAI-SearchBot",
  "Claude-SearchBot",
  "PerplexityBot",
  // On-demand user fetches
  "ChatGPT-User",
  "Claude-User",
  "Perplexity-User",
]

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: DISALLOW },
      ...AI_CRAWLERS.map((userAgent) => ({
        userAgent,
        allow: "/",
        disallow: DISALLOW,
      })),
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  }
}

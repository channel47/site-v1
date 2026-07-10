# AI-SEO — dual-engine visibility system

> How channel47.dev stays visible to humans, index crawlers (Google/Bing), and
> AI systems (ChatGPT, Claude, Perplexity, Gemini, live agents). Applied from
> the ai-seo skill's five-layer playbook, July 2026. This doc records what
> shipped, the decisions behind it, and the measurement loop that tells us
> whether it's working.

The premises the whole system rests on:

1. **GEO rides on SEO.** ChatGPT search retrieves largely via Bing, Gemini/AI
   Overviews via Google. Not indexed → not retrieved → not cited.
2. **LLMs cite what they can extract and corroborate.** Optimize passages
   (answer-first, self-contained) and citation mass (independent coverage),
   not just pages.
3. **Tokens are the new page weight.** Clean machine formats mean agents read
   more of the site, more accurately, at ~5% of the cost.

---

## What shipped, by layer

### Layer 1 — Entity foundation
- `lib/seo.ts` — the single source of entity truth: one org (Channel 47),
  one person (Jackson Dean), one canonical positioning string, stable `@id`
  anchors so every page joins ONE connected graph.
- Site-wide Organization + WebSite + Person JSON-LD (`app/layout.tsx`),
  server-rendered — never client-injected.
- `BlogPosting` + breadcrumbs on every post; `SoftwareSourceCode` +
  breadcrumbs on every skill/connector page; `ItemList` on `/skills`.
- All descriptions come from content frontmatter — the same string is the
  meta description and the schema description (triple consistency; asset
  pages also render it as the visible intro).
- `sameAs` lists only confirmed profiles (currently the GitHub org). **Add
  X/YouTube/LinkedIn/Skool profile URLs to `ORG_SAME_AS` and a Person
  `sameAs` as they're confirmed** — entity merging is how engines connect
  the site to profiles they already know.

### Layer 2 — Query-shaped content (rules for future content)
The templates enforce the plumbing; the content rules live with the writer:
- **Frontmatter `description` is the canonical answer string.** Write it as
  the one-to-two-sentence answer an engine could lift verbatim; ideally open
  the body with the same claim.
- **Answer first, expand after.** First sentence under any heading should
  survive being quoted alone; question-shaped H2s where natural.
- **One term, one meaning.** "Skill", "connector", "agent" — never vary the
  word for elegance; synonym variety splits relevance.
- Roadmap (unlocks on content, per the empty-shelf rule — see PLAN §6):
  - **Definitional posts** for the category's queries ("What is an agent
    skill?", "What is an MCP connector?", "Skills vs. MCP servers") — flat
    slugs, 400–800 dense words, answer in the first sentence.
  - **Glossary** of agentic-marketing vocabulary with `DefinedTerm` schema —
    the highest-leverage AEO asset class; builds the case for owning terms
    like "agentic operator". Ships when its content exists.
  - **"Complete Guide to X"** for emerging standards in the niche, published
    before consensus forms and maintained (real `dateModified`).

### Layer 3 — Agent-native infrastructure
| Surface | File | Notes |
|---|---|---|
| `robots.txt` | `app/robots.ts` | All AI crawlers explicitly welcomed; `/api/subscribe` and `/md/` excluded |
| `llms.txt` | `app/llms.txt/route.ts` | Curated agent map + operator hints, generated from content |
| Markdown twins | `proxy.ts` + `app/md/[section]/[slug]/route.ts` | Every post/skill/connector/workshop at `<url>.md`, YAML frontmatter, built from the same source as the HTML — cannot drift |
| Content negotiation | `proxy.ts` | `Accept: text/markdown` on canonical URLs returns the twin |
| `sitemap.xml` | `app/sitemap.ts` | Real lastmod from frontmatter; evergreen pages omit it rather than fake it |
| `sitemap.md` | `app/sitemap.md/route.ts` | Exhaustive agent-readable index + curl examples |
| `rss.xml` | `app/rss.xml/route.ts` | Full-content feed of everything, newest first (workshops join once recorded) |
| `/api` | `app/api/route.ts` | Versioned JSON discovery document with `nextActions` |
| `/api/search?q=` | `app/api/search/route.ts` | Public JSON search — the site as a callable tool |

### Layer 4 — Distribution
- **"Copy page"** (the markdown-twin copy button) on every post, asset, and
  workshop page (`components/site/copy-markdown.tsx`) — readers paste our
  exact framing into their own AI chats; distribution no crawler reaches.
- The installable artifacts already exist (`channel47/skills`,
  `channel47/mcps` + npm packages) — they are the flywheel. Keep install
  commands and canonical channel47.dev links in every README so adopters'
  write-ups and context windows carry our URLs.
- Owned channels: newsletter capture on every content page (already shipped),
  RSS (now shipped).

### Layer 5 — Measurement (see protocol below)

---

## Decisions (and why)

- **AI training bots are allowed** (GPTBot, Google-Extended, CCBot…). The
  tradeoff is content control vs. being *known* by future models. Channel47's
  business is being discovered and recommended by agents and the people who
  run them; the content is free by design. Allowing is the correct side of
  the trade here. Revisit if paid content moves on-site.
- **`/api` and `/api/search` are robots-ALLOWED.** On-demand fetchers
  (Claude-User, ChatGPT-User) respect robots.txt; blocking the machine APIs
  would break the site-as-a-tool surface. Only `/api/subscribe` (a POST
  capture endpoint) and `/md/` (internal rewrite target for the twins — the
  public URLs are `<url>.md`) are excluded.
- **`Vary: Accept`** is set in `next.config.mjs` for content routes and on
  the twin responses. Self-hosted `next start` overrides Vary on HTML
  documents (Next manages it for RSC); on Vercel the routing layer applies
  it, and the middleware runs before the cache either way.
- **Brand naming**: schema uses `name: "Channel 47"` (matches page titles)
  with `alternateName: "Channel47"`. The site currently mixes both spellings;
  consolidating on one everywhere (titles, prose, socials, repo READMEs)
  would sharpen the entity. Worth a pass when convenient.

## Post-deploy checklist (one-time)

1. Verify live: `curl https://channel47.dev/robots.txt`, `/llms.txt`,
   `/skills/creative-strategist.md`, `curl -H 'Accept: text/markdown'
   https://channel47.dev/posts/gaql`, `/api`, `/api/search?q=google+ads`.
   Or re-run the auditor: `python scripts/audit_ai_readiness.py
   https://channel47.dev` (baseline before this work: **3/14, 21%** —
   2026-07-03).
2. **Submit `sitemap.xml` to Google Search Console AND Bing Webmaster
   Tools.** Bing matters beyond its market share — it feeds ChatGPT search.
3. Validate a post, a skill, and the home page in Google's Rich Results
   Test / schema.org validator.
4. Start the monthly spot-check log (below).

## Measurement — four dashboards

1. **AI referral traffic** (Vercel Analytics): referrers `chatgpt.com`,
   `chat.openai.com`, `perplexity.ai`, `claude.ai`, `gemini.google.com`,
   `copilot.microsoft.com`. Growing = cited with links.
2. **AI bot activity** (Vercel logs / CDN): hits by GPTBot, ClaudeBot,
   PerplexityBot, OAI-SearchBot, and especially `*-User` agents — an
   on-demand fetch means a real user's AI session read that page right then.
   Watch whether bots fetch the `.md` twins.
3. **Classical search**: GSC + Bing Webmaster Tools impressions/position/
   coverage.
4. **Distribution**: GitHub stars/installs on `channel47/skills` and
   `channel47/mcps`, newsletter growth, brand-mention alerts for
   "Channel 47" / "Channel47" and coined terms.

## Monthly assistant spot-check

Once a month, fresh sessions, no history — ChatGPT (with search),
Perplexity, Claude, Gemini. Log per prompt per engine: **mentioned? cited?
accurate? position? who was cited instead?** Judge trends over 2–3 months;
single runs are noise. Keep the list stable; add, don't replace.

Starter prompt list:

1. What is Channel 47 (channel47.dev)?
2. Who is Jackson Dean, the marketer?
3. Best Claude/AI agent skills for marketers
4. Is there an MCP server for Google Ads?
5. Meta Ads MCP server
6. How do I query Google Ads with GAQL using an AI agent?
7. AI agent tools for media buying
8. How can ecommerce brands use AI agents for creative strategy?
9. Voice-of-customer research with AI — tools or skills?
10. MCP connectors for ad platforms (Google, Meta, TikTok, LinkedIn)
11. Best resources for learning agentic marketing
12. AI skills for writing ad creative from customer reviews
13. Automate Klaviyo/Kit newsletter work with AI agents
14. What is the Vibe Marketers community?
15. Free AI marketing tools that install into Claude Code or Cursor

When a result is wrong: fix triple consistency for that claim on-site, then
look at corroboration (which sources the engine cited instead). When absent:
the cited competitor usually has more third-party coverage or a cleaner
extractable passage — close that gap, don't just republish.

## Honest calibration

Proven levers: being indexed/rankable, server-rendered schema, extractable
answer-first passages, entity consistency, independent corroboration, real
dates. High-value for live agents: the twins, negotiation, RSS, search API —
real agent traffic consumes these today. Speculative but near-free:
`llms.txt` (no engine has confirmed consumption; agentic tools do fetch it).
Nobody can promise "you will be ChatGPT's answer" — the promise is maximal
retrievability, extractability, and corroboration, plus a monthly loop that
shows whether the needle moves.

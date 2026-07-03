# Channel47 — Direction Spec

> The working spec for channel47.dev. Originally the output of the positioning +
> sitemap + wireframe interview; **revised 2026-07-03** after a second interview that
> confirmed the plan stands, resolved every deferred item, and added the strip-down
> design doctrine. Decisions marked **[locked]** are confirmed; the "Interview log"
> at the bottom records what changed and why.

---

## 1. Positioning

**Channel47 is a personal education brand that teaches ecommerce / DTC operators to
become _agentic operators_** — running their brand's growth as a system of AI agents
and skills, drawn from years in the trenches of real ad accounts.

- **Model [locked]:** aihero.dev (Matt Pocock). "What Matt is to developers, I am to
  marketers." Mostly-free, practical, hands-on content is the engine; the email list
  is the spine; paid cohorts/courses are the destination.
- **Audience [locked]:** ecommerce / DTC founders and operators doing their own growth.
  The voice can speak CAC, AOV, creative testing, advertorials, Klaviyo flows.
- **Moat [locked]:** lived experience in real ad accounts. The ronin-sharpening-a-blade
  story — credibility earned in the trenches, not theory.
- **Promise:** help operators market more efficiently and scale to tens-of-thousands
  MRR by handing over repeatable, agentic systems.

### Brand architecture [locked]

- **Channel47 (channel47.dev) = the surface.** The brand, the "47" mark, the publication.
- **Jackson Dean = the understated mentor.** Present, signs his work, but not the loud
  face Matt is for aihero. A background operator.
- **Vibe Marketers (Skool) = interim.** The only current audience and the present paid
  destination — a bridge while the email list is built. Eventually workshops/courses
  move in-house onto channel47.dev and Skool fades.

### Money path [locked]

Free content + newsletter (top of funnel) → **Vibe Marketers** Skool community + cohort
workshops + courses (bottom). Journey: personal skill-building → monetizing by teaching.
Workshop CTAs point to **Skool now**, **self-hosted checkout later** (everything else on
the page identical).

### Home copy [locked — resolved 2026-07-03]

The SaaS-sounding live headline dies. Direction chosen: **descriptive and plain** —
the strip-down doctrine applies to copy too. No aspiration language on Home; the
promise/trenches narrative lives on **About** and in the posts.

- **Headline:** `Skills, connectors, and agents for marketers.`
- **Subhead:** `Built in real ad accounts by a working operator. Free to grab,
  live sessions monthly.`

---

## 2. Content taxonomy [locked]

Six first-class types remain the ultimate taxonomy. **But the surface only shows
populated types** — a card/filter/footer row appears when its type gets its first
real item. No empty shelves.

| Type | What it is | Launch state |
|------|-----------|--------------|
| **Posts** | First-person voice — asset-introduction stories, opinion, behind-the-scenes. | **Populated** — the 12 story pieces are Posts. |
| **Skills** | Agentic toolkit asset. | **Populated** — 6 assets from `channel47/skills`. |
| **Connectors** | Agentic toolkit asset (MCP connectors). | **Populated** — 6 assets from `channel47/mcps`. |
| **Workshops** | Live events (the monthly Vibe Marketers sessions). | **Populated** via the evergreen sessions page (§5). |
| **Articles** | Practical how-tos, video near the top. | Deferred until the first article exists. |
| **Agents** | Agentic toolkit asset. | Deferred until a real packaged agent exists. |

- **Stories = Posts [resolved].** The 12 shipped pieces in `content/stories/` are Posts;
  the Posts definition widens to "first-person voice — opinion, behind-the-scenes, and
  asset introductions." They route at `/posts/[slug]`; `/stories*` 301-redirects.
- No standalone "Video" type — video rides inside Articles.
- Skills / Agents / Connectors are **standalone assets**, not embedded in editorial.
  A Post/Article _links to_ the asset it uses.
- **Asset page source of truth [resolved]:** hand-authored markdown in this repo
  (`content/skills/`, `content/connectors/`), one file per asset — same pattern as
  posts. Frontmatter carries the technical facts (repo URL, install command, package);
  the body is web copy, not lifted docs.

---

## 3. Sitemap (launch → ultimate)

```
/                       Home
/browse                 Filterable catalog (chips: All + populated types)
/posts/[slug]           Post detail            (12 at launch; /stories* redirects here)
/skills                 Static flat index of all Skills (SEO crawl target)
/skills/[slug]          Skill detail        ── shared "asset" shell
/connectors/[slug]      Connector detail    ──
/workshops              Evergreen sessions page (upgrades to per-event pages when dated)
/newsletter             Dedicated subscribe page
/about                  Jackson's story (understated)
/privacy                Legal — required (email collection)
/terms                  Legal
[/articles/[slug]]      When Articles exist
[/agents/[slug]]        When Agents exist
[/workshops/[slug]]     When individual dated sessions get pages
[/glossary] [/faq]      Deferred until their content exists (empty-shelf rule)
[/login]                Deferred
```

- **URL structure [locked]:** typed prefixes over a flat `/[slug]`.
- **Skills index `/skills` [locked]:** single static server-rendered flat list of every
  Skill page — an SEO crawl target, Skills only, reached from a single footer link.

### Header nav [locked — revised 2026-07-03]

**Plain text links**, not icons: `Browse · Live · Newsletter` + the "47" glitch mark
(the mark is the only signature element in the header). The icon-with-hover-reveal nav
is dropped under the strip-down doctrine — zero decoding, zero reveal machinery.
Mobile: same links, they're short enough to keep visible; collapse only if they wrap.
The type cards on Home remain the primary navigation; the header doesn't repeat types.

### Footer [locked — trimmed 2026-07-03]

Links-only (no capture). Brand block + grouped nav + social row + legal.

```
[47] Channel47
"Skills, connectors, and agents for marketers."
by Jackson Dean

Learn            Live                 More
  Posts            Workshops            About
  Skills           Vibe Marketers →     Browse all
  Connectors                            Newsletter
                                        Skills index
─────────────────────────────────────────────────
© 2026 Channel47 · by Jackson Dean
Skool · YouTube · X · LinkedIn        Privacy · Terms
```

- Learn column lists **populated types only**; rows appear as types launch.
- Glossary/FAQ rows return when those pages exist.
- Social: Vibe Marketers (Skool — reuse `LINKS.join`), YouTube, X, LinkedIn.
- Legal: © + Privacy + Terms.

---

## 4. Design system [locked — strip-down doctrine added 2026-07-03]

The visual language stays: vivid riso type-cards on greige/neutral chrome, terracotta
accent, restrained editorial lists, light/dark by system preference, the "47" glitch
mark as the signature. On top of it, the doctrine:

> **Everything has a purpose. No eyebrow labels, no pulsating dots, no unnecessary UI
> elements. Purposeful animation and micro-interactions are what give the page life —
> nothing on the page moves unless the user caused it or it confirms an action.**

### Animation rules [locked]

| Tier | Verdict | Concretely |
|------|---------|-----------|
| Infinite ambient loops | **KILL** | Background blobs, grain shift, riso registration wobble, drifting halftone dot field — all removed. Dots/grain remain as **static** print texture on cards. |
| Run-once motif animation | **KEEP** | Each card's line-art schematic plays once on hover/focus (mobile: when carousel-centered). |
| Signature | **KEEP** | The "47" glitch scramble — on load and on hover only. |
| Feedback | **KEEP** | Form success pop-in, checkmark draw, error states. |

`prefers-reduced-motion` stays respected.

### Riso cards = type gateways [locked — count follows population]

One card per **populated** type — **four at launch** (Posts, Skills, Connectors,
Workshops), 2×2 on wide screens, snap carousel on mobile. Cards route to Browse
pre-filtered (`/browse?type=X`); the Workshops card routes to `/workshops`.
Motif = type identity; color = individuality. New motifs drawn for Posts and
Workshops join the existing Skills/Connectors line-art (the Agents motif is
shelved with its type). Six cards remain the end state.

---

## 5. Wireframes — key pages

### Home [locked — revised 2026-07-03]

```
┌─────────────────────────────────────────────┐
│ [47]              Browse · Live · Newsletter  │  text-link header
│                                               │
│           ◆ 47 mark (glitch)                  │
│   Skills, connectors, and agents              │  plain headline
│   for marketers.                              │
│   Built in real ad accounts by a working      │  subhead
│   operator. Free to grab, live sessions       │
│   monthly.                                    │
│                                               │
│   ┌──────┐ ┌──────┐                           │  four riso TYPE cards
│   │Posts │ │Skills│                           │  → Browse?type=… /
│   └──────┘ └──────┘                           │    /workshops
│   ┌──────┐ ┌──────┐                           │
│   │Conn. │ │Works.│                           │
│   └──────┘ └──────┘                           │
│                                               │
│   ▸ Next live: <title> · <date>   [Join →]    │  strip renders ONLY when a
│                                               │  session date exists
│   Latest from the channel                     │  3–5 recent items as
│   Title ……………  Post · Jun 2026                │  editorial rows (reuses
│   Title ……………  Skill                          │  the Browse row)
│                              Browse all →      │
│                                               │
│   "<1–2 line signed note — Jackson>"          │  earns the ask, his voice
│   [ email ……………… ] [ Subscribe ]             │  capture
│                                               │
│   Footer                                      │
└─────────────────────────────────────────────┘
```

Below-cards region survives strip-down intact: the feed proves the channel publishes,
the signed note earns the ask, capture is the business. Nothing else. The long-form
trenches narrative lives on **About**.

### Browse [locked]

Chips: All + populated types. Editorial text rows: title · type · date · one-liner.
Pre-filtered arrival from the type cards.

### Post [locked] (was "Article" template; Articles inherit later, adding video)

```
Title
small byline · date
────────────────────────
body …
┌ Grab this ───────────┐
│ → uses the «X» Skill │   highlighted artifact link (from `asset` frontmatter)
└──────────────────────┘
body …
────────────────────────
[ email capture ]
Related assets ▸ ▸ ▸
```

### Workshops — evergreen page [locked — resolved 2026-07-03]

Monthly cadence is real; the next date isn't pinned. One evergreen page until it is:

```
Live sessions — monthly, inside Vibe Marketers
What they are: live build-alongs — Jackson builds/runs an
  agentic workflow (a skill, a connector, a campaign system)
  live; attendees follow along.
Replays: recorded, replays live inside Skool.
[ Join Vibe Marketers → Skool ]
Get notified about the next one: [ email ] [ Notify ]
```

When a session gets a date: the Home next-live strip renders, and the dated session
can get its own `/workshops/[slug]` page on the state-driven upcoming→past template
from the original plan.

### Skill / Connector [locked]

Shared "asset" template: what it does → how to install/use (from frontmatter facts) →
the asset itself (repo link / install command, copy button) → related Posts that use
it → email capture.

### Newsletter [locked — framing resolved 2026-07-03]

Focused capture page. **Honest promise: "New skills, connectors, and posts as they
ship, plus the next live session."** No cadence commitment. The early-access
"one email when the first systems ship" framing dies with the early-access page.
Reuses the existing capture component (`/api/subscribe`, env-gated Kit, honest
"not wired up yet" fallback).

### About [locked]

Editorial single column: the trenches story, the ronin/blade narrative, what Channel47
is and who it's for. Understated headshot. Jackson signs his work here. Home carries
only the condensed 1–2 line signed note.

---

## 6. Phasing [locked — revised 2026-07-03]

**Phase 1 (ship):** Home (rebuilt: plain headline, text nav, 4 cards, feed + note +
capture) · Browse · Post/Skill/Connector detail templates · `/workshops` evergreen ·
`/skills` index · Newsletter · About · Privacy + Terms · footer · animation strip-down ·
`/stories*` → `/posts*` redirects. Workshop CTAs → **Skool**.

**Unlocks on content, not code:** Articles card+routes (first article) · Agents
card+routes (first packaged agent) · Glossary/FAQ (their content) · dated
`/workshops/[slug]` pages (next session pinned) · Home next-live strip (same).

**Deferred:** login/accounts · self-hosted checkout · in-house community features.

---

## Interview log — 2026-07-03

Decisions from the second interview (all previously-open items resolved):

1. **Plan stands** — this document is the spec; stuckness was execution stall, not strategy.
2. **Design strip-down doctrine** — keep the visual language, remove everything without
   a purpose; purposeful animation/micro-interactions only (§4).
3. **Animation tiers** — kill infinite ambient; keep run-once motif, glitch mark, feedback.
4. **Stories → Posts** at `/posts/[slug]`; Posts definition widened; `/stories*` redirects.
5. **Populated types only** — 4 cards at launch; Agents + Articles join when real.
6. **Launch set** — Posts + Skills + Connectors + Workshops.
7. **Asset pages hand-authored** in `content/skills|connectors/`, facts in frontmatter.
8. **Sessions** — monthly cadence, no date pinned → evergreen `/workshops` page; format
   is live build-alongs; replays live in Skool.
9. **Headline** — descriptive/plain, option A (§1 Home copy).
10. **Header** — plain text links, icon nav dropped.
11. **SEO pages** — `/skills` index + Privacy/Terms at launch; Glossary/FAQ deferred.
12. **Newsletter promise** — drops + session announcements, no cadence commitment.
13. **Home body** — latest feed + signed note + capture all survive.

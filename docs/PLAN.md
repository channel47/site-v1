# Channel47 — Direction Review

> Output of the positioning + sitemap + wireframe interview. This is the spec the
> build works from. Decisions marked **[locked]** were confirmed in the interview;
> items marked **[recommended]** are proposed defaults awaiting a yes/adjust.

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

### Copy note [locked]

The live headline — "An agentic operating system for performance marketers" — reads like
a SaaS product for sale. **Direction:** reframe to the education-brand / operator-promise
above (you, teaching — not a product). **Exact headline + subhead are deferred to the Home
build**, drafted against the real layout. Two reference poles to draft between:
operator-promise ("Become an agentic operator") vs trenches-credibility ("Agentic
marketing for ecommerce operators — from the trenches").

---

## 2. Content taxonomy [locked]

Six first-class types. Browse filters on these six.

| Type | What it is |
|------|-----------|
| **Articles** | Practical how-tos. Usually lead with a video embed near the top. |
| **Posts** | The personable counterpart — opinion, behind-the-scenes, the human voice. |
| **Skills** | Agentic toolkit asset. |
| **Agents** | Agentic toolkit asset. |
| **Connectors** | Agentic toolkit asset (MCP connectors). |
| **Workshops** | Live events. First-class alongside the rest; each has its own page. |

- No standalone "Video" type — video rides inside Articles.
- Skills / Agents / Connectors are **standalone assets**, not embedded in Articles.
  An Article _links to_ the asset it uses (one skill → reusable across many articles).

---

## 3. Sitemap (ultimate)

```
/                       Home
/browse                 Filterable catalog of everything (chips: All + 6 types)
/articles/[slug]        Article detail
/posts/[slug]           Post detail
/skills/[slug]          Skill detail        ── shared "asset" shell
/agents/[slug]          Agent detail        ──
/connectors/[slug]      Connector detail    ──
/workshops/[slug]       Workshop detail (state-driven: upcoming → past)
/newsletter             Dedicated subscribe page
/about                  Jackson's story (understated)
[/login]                Deferred
```

- **URL structure [recommended]:** typed prefixes (above) over a flat `/[slug]` — clearer
  for users, SEO, and the workshop special-casing.

### Header nav [locked]

Compact **icon** nav: **Browse · Live · Newsletter** + the "47" logo. Labels reveal on
hover **and keyboard focus** (real text in the DOM, not a tooltip — keeps SEO + a11y).
Mobile collapses to a single right-side hamburger. The six type-cards on Home _are_ the
primary navigation, so the header deliberately doesn't repeat the six types.

### Footer nav [locked]

Full link list — all six types + Newsletter + About. This is the SEO/completeness net
that lets the visible header stay minimal.

---

## 4. Design system [locked]

The current visual language stays — the **contrasting moods are a feature, not a bug:**

- **Vivid riso cards = the front door.** Greige/neutral page chrome lets the cards do the
  visual lifting. Light/dark by system preference, single terracotta accent.
- **Restrained editorial list = the library stacks.** Browse is neutral, fast, scannable.
- Barebones / minimal: no decorative eyebrow labels. Keep the "47" glitch mark and its
  motion as the signature.

### Riso cards = type gateways [locked]

The three riso cards become **six** — one per content type (Skills, Agents, Connectors,
Articles, Posts, Workshops). Each has its own **motif** + **color field**, and on click
routes to **Browse pre-filtered to that type**. They represent _types_, not individual
assets — so there are only ever six, and the full motion stays viable.

- Draw **3 new motifs** (Articles, Posts, Workshops) to join the existing Skills /
  Agents / Connectors line-art.
- Motif = type identity; color = individuality.

---

## 5. Wireframes — key pages

### Home  [locked]

```
┌─────────────────────────────────────────────┐
│ [47]                        ⬚ ⬚ ⬚  (icon nav)│  minimal header
│                                               │
│           ◆ 47 mark (glitch)                  │  hero
│           POV headline (reframed)             │
│                                               │
│   ┌────┐ ┌────┐ ┌────┐                        │  six riso TYPE cards
│   │Skil│ │Agen│ │Conn│                        │  → Browse?type=…
│   └────┘ └────┘ └────┘                        │
│   ┌────┐ ┌────┐ ┌────┐                        │
│   │Arti│ │Post│ │Work│                        │
│   └────┘ └────┘ └────┘                        │
│                                               │
│   ▸ Next live: <title> · <date>   [Join →]    │  quiet next-live strip
│                                               │  (collapses if none)
│   <narrative / trenches copy>                 │  earns the ask
│                                               │
│   [ email ……………… ] [ Get early access ]      │  capture (kept at bottom)
│                                               │
│   Footer — six types · Newsletter · About     │  SEO net
└─────────────────────────────────────────────┘
```

The current page, evolved — not rebuilt. Adds: icon header, 3 more type cards (6 total),
next-live strip, footer.

### Browse  [locked]

```
┌─────────────────────────────────────────────┐
│ [47]                        ⬚ ⬚ ⬚            │
│  [All] Articles Posts Skills Agents …  chips  │  filter (pre-set from card)
│                                               │
│  Title ……………………………  Article · Jun 2026       │  editorial text rows
│  Title ……………………………  Workshop · Jul 3 (live)  │  title·type·date·one-liner
│  Title ……………………………  Skill                    │
│  …                                            │
│  Footer                                       │
└─────────────────────────────────────────────┘
```

### Article  [locked]  (Posts inherit this minus video + artifact blocks)

```
Title
small byline · date
────────────────────────
[ video embed ]
practical body …
┌ Grab this ───────────┐
│ → uses the «X» Skill │   highlighted artifact link
└──────────────────────┘
body …
────────────────────────
[ email capture ]
Related assets ▸ ▸ ▸
```

### Workshop  [locked]  (one page, state-driven)

```
UPCOMING                          PAST (auto-flip)
Title                             Title
📅 date · time                    "Held <date>"
What we'll demo/build …           What we built …
Who it's for …                    [ replay / recap if available ]
[ Register → Skool ]              ┌ Missed it? ─────────────┐
(→ self-checkout later)          │ Get notified about the   │
                                 │ next: [ email ] [Notify] │
                                 └──────────────────────────┘
```

### Skill / Agent / Connector  [recommended]

Shared "asset" template: what it does → how to use/install → the asset itself
(copy/download) → related Articles that use it → email capture.

### Newsletter  [recommended]

Focused capture page: what you'll get, cadence, maybe 1–2 sample issues. The email
capture component already exists and posts to `/api/subscribe` (env-gated Kit, honest
"not wired up yet" fallback) — reuse it.

### About  [recommended]

Editorial single column: the trenches story, the ronin/blade narrative, what Channel47
is and who it's for. Understated headshot. Jackson signs his work here.

---

## 6. Phasing  [recommended]

**Phase 1 (ship):** Home (evolved) · Browse · the six detail templates · Newsletter ·
About · footer. Workshop CTAs → **Skool**. Reuse the existing honest email capture.

**Deferred:** login/accounts · self-hosted checkout (workshops stay on Skool) · any
in-house community features. Skool remains the paid destination until the list is built.

---

## Open items to confirm

Standing recommendations — accepted as defaults unless revised:

1. URL structure — typed prefixes (§3).
2. Skill/Agent/Connector asset template (§5).
3. Newsletter + About page treatments (§5).
4. Phase 1 scope (§6).

Resolved: Home headline wording deferred to the Home build (see Copy note, §1).

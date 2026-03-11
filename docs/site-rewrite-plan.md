# Channel47.dev Site Rewrite Plan

*Created: 2026-03-06*
*Status: Planning complete, ready for implementation*

## Overview

Rewriting channel47.dev from "3 MCP-connected platform plugins" to "2 open-source DTC-focused plugins." This doc covers all planning workstreams. Read before starting any site work.

---

## 1. Site Architecture

### Page Hierarchy (7 pages)

```
Homepage (/)
├── Plugins (/plugins)
│   ├── DTC Google Ads Playbook (/plugins/dtc-google-ads-playbook)
│   └── DTC Research Engine (/plugins/dtc-research-engine)
├── Guides (/guides)
│   └── [Guide slug] (/guides/[slug])
├── Subscribe (/subscribe)
└── Privacy (/privacy)
```

### Pages to Remove

| Current Page | Action | Redirect |
|-------------|--------|----------|
| `/notes` + `/notes/[slug]` | Remove | — |
| `/skills` + `/skills/[slug]` | Remove | — |
| `/mcps` + `/mcps/[slug]` | Remove | — |
| `/labs` | Remove | `/subscribe` |
| `/tools` | Remove | `/plugins` |
| `/ecosystem` | Remove | — |
| `/hire` | Remove | — |
| `/build` | Remove | — |
| `/coming-soon` | Remove | — |
| `/plugins/google-ads` | 301 | `/plugins` |
| `/plugins/microsoft-ads` | 301 | `/plugins` |
| `/plugins/meta-ads` | 301 | `/plugins` |
| `/plugins/paid-search` | 301 | `/plugins` |
| `/plugins/frontend-craft` | 301 | `/plugins` |
| `/rss.xml` | Remove | — |
| `/api/generate-skill` | Remove | — |
| `/api/deliver-skill` | Remove | — |

### Navigation

**Header:** `[Logo: channel47]  Plugins  Guides  Subscribe (signal CTA)`

**Footer:** `Plugins · Guides · Privacy` (left) / `Built by ctrlswing` (right)

**Breadcrumbs:** Plugin detail and guide detail pages only.

### URL Map

| Page | URL | Nav Location | Priority |
|------|-----|-------------|----------|
| Homepage | `/` | Header (logo) | High |
| Plugins hub | `/plugins` | Header | High |
| Google Ads Playbook | `/plugins/dtc-google-ads-playbook` | — | High |
| Research Engine | `/plugins/dtc-research-engine` | — | High |
| Guides hub | `/guides` | Header | Medium |
| Guide detail | `/guides/[slug]` | — | Medium |
| Subscribe | `/subscribe` | Header CTA | High |
| Privacy | `/privacy` | Footer | Low |
| API: subscribe | `/api/subscribe` | — (serverless) | — |

---

## 2. Content Strategy

### Existing Guides

| Guide | Verdict | Reason |
|-------|---------|--------|
| `claude-for-ppc.md` | **Rewrite** → `claude-for-dtc-google-ads.md` | References old MCP model. Reframe for 2 new plugins. |
| `connect-google-ads-to-claude.md` | **Kill** | MCP setup guide. Redirect → `/plugins/dtc-google-ads-playbook`. |
| `morning-brief-workflow.md` | **Kill** | References old MCP workflow. Redirect → `/plugins/dtc-google-ads-playbook`. |

### Content Pillars

| Pillar | SEO Target |
|--------|-----------|
| DTC Google Ads with Claude | "Claude Google Ads plugin", "DTC Google Ads AI" |
| Customer Research for DTC Ads | "DTC customer research", "voice of customer ads" |
| DTC Media Buying Frameworks | "DTC campaign architecture", "PMax strategy DTC" |

### New Guides (Backlog — ship #1 with relaunch, rest later)

1. **"How to Use Claude for DTC Google Ads"** — Rewrite of claude-for-ppc (Awareness)
2. **"Research-to-Ad Pipeline: From Reddit to Running Ads"** — Workflow walkthrough (Consideration)
3. **"DTC PMax Campaign Architecture Guide"** — Framework guide (Implementation)
4. **"How to Audit Your Google Ads with Claude"** — Walkthrough (Consideration)

### Content Collection Changes

**Keep:** `tools/plugins/` (replace 5 old entries with 2 new), `guides/`
**Remove:** `tools/skills/`, `tools/mcps/`, `notes/`, `newsletters/`, `social/`
**Update `content/config.ts`:** Remove `notes` collection. Simplify `tools` schema (remove `mcp`/`subagent` types, remove `source` field).

---

## 3. Free Tool Strategy

### Funnel

```
Discovery → Install → Activate → Subscribe → Community
(registry,   (zero     (/campaign-audit   (email on    (Discord
 Reddit,     friction)  or /full-pipeline   site)        when list
 GitHub)                = aha moment)                    hits mass)
```

### Key Insight

The plugin IS the lead magnet. The site's job:
1. Explain what the plugin does (pre-install visitors)
2. Show output examples (prove value before install)
3. Capture email (post-install visitors wanting community)

### Critical Addition: Output Examples

Add real output examples to plugin detail pages. Run `/campaign-audit` and `/full-pipeline`, format the output, embed on the pages. This is the "try before you install" moment and the single highest-leverage content addition.

---

## 4. Email Sequence (Kit/ConvertKit)

### Welcome Sequence (4 emails, 10 days)

| # | Send | Subject | Purpose | CTA |
|---|------|---------|---------|-----|
| 1 | Immediate | You're in. Here's what's next. | Welcome + install instructions + set expectations | Install the plugins |
| 2 | Day 2 | The $6M playbook, in one command. | Highlight playbook plugin + /campaign-audit output | Try /campaign-audit |
| 3 | Day 5 | What your customers say when you're not listening. | Highlight research engine + /full-pipeline output | Try /full-pipeline |
| 4 | Day 10 | What we're building (and why it's free). | Vision + tease Discord + ask for input | Reply with what you'd want |

**After sequence:** Silence until Discord launches or major plugin update. No filler. Respect the "not a newsletter" promise.

### Kit Setup

- Form tag: `community-interest`
- After sequence tag: `welcomed`
- Segment: Track opens on email #2 vs #3 to see which plugin drives more interest

---

## 5. AI SEO

### Target Queries

| Query | Goal |
|-------|------|
| "Claude Google Ads plugin" | #1 cited source |
| "DTC Claude plugins" | Create and own the category |
| "Google Ads AI plugin" | Cited alongside claude-ads |
| "DTC advertising AI tools" | Cited for the plugin niche |
| "customer research Claude plugin" | Own entirely |

### AI-Extractable Answer Blocks

Every page needs a 40-60 word passage in the first paragraph that directly answers "What is [this page about]?" Examples:

**Homepage:**
> channel47 builds free, open-source Claude plugins for DTC media buyers. Two plugins: dtc-google-ads-playbook codifies campaign architecture and daily optimization from a $6M+ Google Ads account. dtc-research-engine turns public customer voice data into personas, angles, and ad scripts. Both are MIT-licensed with zero setup.

**Playbook plugin:**
> dtc-google-ads-playbook is a free Claude plugin that codifies Google Ads campaign architecture, daily optimization, and ad copy strategy for DTC brands. Built from a $6M+ account generating 16,800+ conversions at $362 avg CPA. Includes 3 skills, 3 commands, and 1 agent.

**Research engine:**
> dtc-research-engine is a free Claude plugin that fetches real customer voice data from public sources and transforms it into personas, advertising angles, ad scripts, and platform-specific ad copy for DTC products. Five-stage pipeline: research, personas, angles, scripts, copy.

### Structural Requirements

- FAQ with `FAQPage` schema on homepage (update Q&As for new model)
- `SoftwareApplication` schema on plugin detail pages
- `Article` schema on guide pages with author attribution
- "Last updated: [date]" visible on every content page
- Author bio on guides: "Jackson Dean manages $100K-$200K+/day in DTC Google Ads spend."
- Comparison table on plugin pages (channel47 vs marketingskills vs claude-ads)

### robots.txt

Allow: `GPTBot`, `ChatGPT-User`, `PerplexityBot`, `ClaudeBot`, `anthropic-ai`, `Google-Extended`

### llms.txt

Create/update `/llms.txt` for AI crawlers describing the site and plugins.

---

## 6. Launch Strategy

### 4-Phase Soft Relaunch

| Phase | When | Actions |
|-------|------|---------|
| Pre-launch | Now → site rewrite done | Polish plugins, write output examples, set up Kit sequence, update site |
| Quiet launch | Site goes live | Deploy. Submit plugins to Claude registry. No announcement. |
| Reddit launch | 1-3 days post-deploy | First post r/PPC: "I codified my $6M DTC Google Ads account into a free Claude plugin." |
| Expand | Week 2-3 | r/ecommerce or r/DTC about research engine. X/Twitter thread. |

### Reddit Post Template (r/PPC)

**Title:** "I codified a $6M DTC Google Ads account into a free Claude plugin — here's what it does"

Structure: Context (scale) → What it does (3 bullets) → One output example → How to install → Link at end.

Rules: No self-promo in title. Lead with value. Answer every comment.

### Launch Checklist

- [ ] Site rewritten and deployed
- [ ] Email capture working (Kit tested)
- [ ] Welcome sequence built in Kit (4 emails)
- [ ] Plugin READMEs polished with output examples
- [ ] Plugins submitted to Claude registry
- [ ] Reddit post drafted for r/PPC
- [ ] X/Twitter thread drafted
- [ ] GitHub repos public and clean
- [ ] robots.txt allows AI crawlers
- [ ] llms.txt created
- [ ] Schema markup updated on all pages
- [ ] Old URLs 301 redirect
- [ ] GA4 events instrumented
- [ ] Meta pixel evaluated (keep or remove)

---

## 7. Page CRO

### Homepage Density Flow

```
LOW  → Hero: Position + install command + email CTA (dual-CTA)
HIGH → Proof bar: 2 plugins · 8 skills · $6M+ spend · 16,800+ conversions
HIGH → Plugin cards (2 plugins, detailed)
MED  → "How they work together" (research finds what to say → playbook runs it)
MED  → Output example (show real /campaign-audit or /full-pipeline result)
RUPT → Surface flip: "$6M+ in spend. 16,800+ conversions. $362 avg CPA."
LOW  → Email capture: "Join the community" (full-width, prominent)
LOW  → CTA void: "Browse the plugins."
```

### Key Homepage Changes

1. Add email CTA to hero (inline form, below install command)
2. Remove ProductCallout (PaidBrief)
3. Remove workshop/labs section
4. Update FAQ (rewrite all Q&As for 2-plugin model)
5. Add output example section
6. Update rupture (broader proof points, not old $3K waste anecdote)
7. Update proof bar metrics

### Plugin Detail Page Flow

```
Install command (top, prominent)
↓ One-liner
↓ Skills list
↓ Commands list
↓ Agent description
↓ Output example
↓ "Works with" → link to other plugin
↓ Email capture CTA
```

### CTA Copy

| Location | Old | New |
|----------|-----|-----|
| Hero secondary | "Get Build Notes" | "Join the community" |
| CTA void button | "Get Build Notes" | "Join the community" |
| Email submit text | "Subscribe" | "Join" or "I'm in" |

---

## 8. Schema Markup

### Homepage

```json
{
  "@graph": [
    { "@type": "Organization", "name": "channel47", "url": "https://channel47.dev",
      "description": "Free, open-source Claude plugins for DTC media buyers.",
      "founder": { "@type": "Person", "name": "Jackson Dean" },
      "sameAs": ["https://github.com/ctrlswing/...", "https://x.com/ctrlswing"] },
    { "@type": "WebSite", "name": "channel47", "url": "https://channel47.dev" },
    { "@type": "FAQPage", "mainEntity": [...] }
  ]
}
```

### Plugin Detail Pages

```json
{
  "@graph": [
    { "@type": "SoftwareApplication",
      "name": "dtc-google-ads-playbook",
      "applicationCategory": "DeveloperApplication",
      "operatingSystem": "Any",
      "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
      "author": { "@type": "Organization", "name": "channel47" },
      "softwareVersion": "1.0.0" },
    { "@type": "BreadcrumbList", "itemListElement": [...] }
  ]
}
```

### Guide Pages

```json
{
  "@graph": [
    { "@type": "Article",
      "headline": "...",
      "author": { "@type": "Person", "name": "Jackson Dean" },
      "datePublished": "...", "dateModified": "...",
      "publisher": { "@type": "Organization", "name": "channel47" } },
    { "@type": "BreadcrumbList", "itemListElement": [...] }
  ]
}
```

---

## 9. Analytics Tracking

### Events

| Event | Trigger | Properties |
|-------|---------|------------|
| `email_signup_submitted` | Form success | `location`, `tag` |
| `email_signup_failed` | Form error | `location`, `error_type` |
| `install_command_copied` | Copy button click | `plugin`, `location` |
| `plugin_card_clicked` | Plugin card click | `plugin`, `source_page` |
| `cta_clicked` | CTA link click | `text`, `location`, `destination` |
| `guide_read` | 75%+ scroll on guide | `guide_slug` |
| `faq_expanded` | FAQ accordion open | `question` |
| `outbound_clicked` | External link click | `destination`, `location` |

### GA4 Conversions

| Conversion | Event | Counting |
|------------|-------|----------|
| Email Signup | `email_signup_submitted` | Once per session |
| Install Copied | `install_command_copied` | Once per session |

### UTM Strategy

| Channel | source | medium | campaign |
|---------|--------|--------|----------|
| Reddit r/PPC | `reddit` | `social` | `ppc_launch` |
| Reddit r/DTC | `reddit` | `social` | `dtc_launch` |
| X/Twitter | `twitter` | `social` | `launch_thread` |
| Claude Registry | `claude_registry` | `referral` | `plugin_listing` |
| GitHub README | `github` | `referral` | `readme_link` |

### Cleanup

- Evaluate Meta pixel — remove if not running Meta ads
- Keep Vercel Analytics (lightweight, useful)

---

## 10. Copywriting Decisions

### SEO Title Tags

| Page | Title |
|------|-------|
| Homepage | `Open-Source Claude Plugins for DTC Media Buyers — channel47` |
| Plugins hub | `DTC Plugins for Claude — Google Ads Playbook & Research Engine — channel47` |
| Playbook | `DTC Google Ads Playbook Plugin for Claude — channel47` |
| Research | `DTC Research Engine Plugin for Claude — channel47` |
| Guides hub | `Guides — DTC Google Ads & Customer Research with Claude — channel47` |
| Subscribe | `Join the Community — channel47` |

### Meta Descriptions

| Page | Description |
|------|-------------|
| Homepage | "Free, open-source Claude plugins for DTC media buyers. Campaign architecture from a $6M+ Google Ads account. Customer research-to-creative pipeline. Zero setup." |
| Playbook | "A free Claude plugin codifying DTC Google Ads strategy from a $6M+ account. PMax architecture, daily optimization, ad copy — 3 skills, 3 commands, 1 agent." |
| Research | "A free Claude plugin that turns public customer data into DTC ad creative. Research, personas, angles, scripts, copy. One command: /full-pipeline." |

### Voice Rules

| Do | Don't |
|----|-------|
| "Open-source Claude plugins for DTC media buyers." | "AI-powered advertising optimization plugins." |
| "$6M+ in spend" / "16,800+ conversions" | "Proven results" / "Industry-leading" |
| "Join the community" | "Subscribe to our newsletter" |
| Lead with what it's built from | Lead with what it does |
| `claude plugin install dtc-google-ads-playbook@channel47` | "Get started today" |

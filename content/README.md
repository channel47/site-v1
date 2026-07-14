# Content

Editorial content for channel47.dev, stored as markdown with structured frontmatter and
read at build time by `lib/content.ts`. Publishing is adding a file.

## Structure

```
content/
├── notes/                Note detail pages (one per documented build)
├── posts/
│   ├── skills/          Posts introducing each skill in channel47/skills
│   └── connectors/      Posts introducing each MCP server in channel47/mcps
├── skills/              Skill asset pages (one per skill)
└── connectors/          Connector asset pages (one per MCP server)
```

- **Notes** (`/notes/[slug]`) — long-form writeups of a real agentic system Jackson
  has built and run: the problem, the workflow, the decisions that mattered, results,
  and current status. One file per documented build; the filename is the slug. Notes
  share the Post gold accent (`--c-note` aliases `--c-post`) and are told apart by a
  pixel glyph, not a new colour.
- **Posts** (`/posts/[slug]`) — first-person narratives from Jackson: opinion,
  behind-the-scenes, and asset introductions. One file per piece; the filename is the
  slug. Each asset-introduction post links to the standalone asset page it's about.
- **Assets** (`/skills/[slug]`, `/connectors/[slug]`) — hand-authored web copy for each
  skill and connector (PLAN §2: the site's copy is written for the web, not lifted from
  the source repos). Technical facts (repo URL, install command, package) live in
  frontmatter so templates render them consistently; slugs match the asset's name in its
  source repo.

## Frontmatter schemas

Note (`content/notes/*.md`):

```yaml
title: string          # headline, sentence case, e.g. "A simple architecture for agent-assisted recruiting"
slug: string           # matches filename, used for routing
description: string    # ≤160 chars — browse rows, index rows, meta description; also
                        # doubles as the article lede
date: YYYY-MM-DD
tags: [string]
sanitized: boolean      # optional — when true, the byline shows a "sanitized example"
                        # tag (the Note convention for real-but-anonymized systems)
video:                   # optional — real walkthrough footage shown near the top
  src: string            # root-relative MP4 path under public/
  poster: string         # root-relative poster image
  captions: string       # root-relative WebVTT captions (not SRT)
  duration: string       # ISO 8601 duration, e.g. PT4M17S
  caption: string        # optional visible caption below the player
```

Post (`content/posts/{skills,connectors}/*.md`):

```yaml
title: string          # headline
slug: string           # matches filename, used for routing
description: string    # ≤160 chars — browse rows, meta description
type: story            # legacy field, harmless
category: skills | connectors
asset:
  name: string         # asset slug — links the post to its asset page
  type: skill | mcp
  repo: string         # canonical GitHub URL
  install: string      # one-line install command
  package: string      # npm package (connectors only)
author: Jackson Dean
date: YYYY-MM-DD
tags: [string]
```

Asset (`content/skills/*.md`, `content/connectors/*.md`):

```yaml
title: string          # display name, e.g. "Google Ads MCP"
slug: string           # matches filename AND the asset's name in its source repo
description: string    # ≤160 chars — browse rows, index rows, meta description
repo: string           # canonical GitHub URL
install: string        # one-line install command (rendered as the "Grab it" block)
package: string        # npm package (connectors only)
date: YYYY-MM-DD
tags: [string]
pairing: string         # optional — one sentence on what this asset pairs with and
                        # why (may contain a single markdown link); renders under
                        # the install block, replacing the old repo/package row
screenshot: string      # optional — real screenshot path under public/
screenshotCaption: string
                        # optional — figure caption. With `screenshot`, captions the
                        # real image. Without it, still renders the figure as a
                        # riso-hatch placeholder captioned with what a screenshot
                        # would show. Omit both to skip the figure entirely.
askAnswer:              # optional — only add for a real worked example, never invented
  question: string
  columns: [string, string, string]  # optional header row, e.g. [Keyword, QS, Impr]
  rows:
    - label: string
      value: string
      value2: string    # optional
  caption: string
```

## Images ("framed stills")

Markdown images render as framed figures, not bare `<img>` tags: a hairline-bordered
field tinted with the page's content-type colour, with the screenshot floating on it
under a CSS drop-shadow. Alt text doubles as the visible figcaption.

```markdown
![The audit run that found the $412.](/posts/audit-run.png)
```

- Capture windows with `⌘⇧4 → Space → ⌥-click` (Option omits the native shadow) so the
  PNG keeps its rounded corners on a transparent background — the treatment depends on
  that transparency.
- Every real screenshot on the site — terminal *and* browser windows alike — uses this
  framed treatment. The riso hatch is strictly a placeholder for missing art, never a
  final state. (The asset-page figure in `components/site/asset-page.tsx` pre-dates the
  frame; migrate it to `.st-shot` when its first real screenshot lands.)
- Files live in `public/posts/`; reference them root-relative. No double quotes in paths.
- Write alt text as a real caption — it's shown under the figure in mono.
- The rendering is `marked.use()` in `lib/content.ts` + `.st-shot*` in `app/globals.css`.

`##` headings no longer draw a hairline rule — section spacing alone marks the break.
Use a markdown `---` (renders as `.st-prose hr`) when a piece genuinely needs a hard
visual divider inside a section; it's a deliberate, occasional mark, not a default.

## Note-only markdown conventions

Notes add four markdown conventions on top of the shared pipeline. All four are
implemented as small, additive hooks on the single shared `marked` instance in
`lib/content.ts` (see the file's top comment — renderer changes there affect every
content type, so each hook is written to be a no-op unless the exact pattern matches).
None of them require raw HTML in the markdown source.

**Placeholder figures** — before a real screenshot exists, use the `placeholder:` src
scheme instead of a real path:

```markdown
![A sanitized excerpt from the original message beside the instruction given to Claude](placeholder:visual-01)
```

Renders the striped accent placeholder slot (repeating 45° stripes, inset accent border,
lowercase mono tag pulled from the `placeholder:` value) instead of a real `.st-shot`
image. Swap to a real screenshot later by replacing the src with a real path and
re-writing the alt text as the caption — no other markup changes.

**RESULTS strip** — a paragraph that is *only* a `RESULTS · …` line, cells separated by
`|`, each cell's big number and small label split on the first `·`:

```markdown
RESULTS · 243 · candidates, first run | ~5 min · to surface them | ~1 hr · total setup
```

**STATUS strip** — a paragraph that is *only* a `STATUS · …` line, steps separated by `/`:

```markdown
STATUS · Sourcing complete / human review pending / outreach pending / interview results pending
```

**"Ships with this build" artifact box** — an H3 whose text starts with "Ships with this
build" (optionally followed by `· sanitized` or similar), immediately followed by a
bullet list. The heading becomes the box's mono header row and the list becomes its
bordered rows:

```markdown
### Ships with this build · sanitized

- the original workflow proposal
- the "interview me" prompt
```

Ordinary prose never starts a line with `RESULTS ·`, `STATUS ·`, or `Ships with this
build`, so all four hooks are inert everywhere else — posts, skills, connectors, and
workshops render exactly as before.

The end-of-Note newsletter invitation ("Want the next build when it ships? … Get
emails from the workshop →") is **not** part of the markdown — it's a template-level
component (`components/site/note-invitation.tsx`) rendered after every Note's
article, so don't duplicate that CTA in the article body.

## Editorial notes

- Every feature, command, query, and workflow referenced in posts and asset pages is
  real — pulled directly from the SKILL.md files in `channel47/skills` and the server
  READMEs in `channel47/mcps`.
- The anecdotes are drawn from Jackson's client verticals (pet, cookware, hearing, beauty,
  wellness, coaching) with clients anonymized and details written as illustrative
  composites. **Review the specific numbers and scenarios in each piece before
  publishing** and adjust any that should match a real account more closely.

# Content

Editorial content for channel47.dev, stored as markdown with structured frontmatter and
read at build time by `lib/content.ts`. Publishing is adding a file.

## Structure

```
content/
├── posts/
│   ├── skills/          Posts introducing each skill in channel47/skills
│   └── connectors/      Posts introducing each MCP server in channel47/mcps
├── skills/              Skill asset pages (one per skill)
└── connectors/          Connector asset pages (one per MCP server)
```

- **Posts** (`/posts/[slug]`) — first-person narratives from Jackson: opinion,
  behind-the-scenes, and asset introductions. One file per piece; the filename is the
  slug. Each asset-introduction post links to the standalone asset page it's about.
- **Assets** (`/skills/[slug]`, `/connectors/[slug]`) — hand-authored web copy for each
  skill and connector (PLAN §2: the site's copy is written for the web, not lifted from
  the source repos). Technical facts (repo URL, install command, package) live in
  frontmatter so templates render them consistently; slugs match the asset's name in its
  source repo.

## Frontmatter schemas

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

## Editorial notes

- Every feature, command, query, and workflow referenced in posts and asset pages is
  real — pulled directly from the SKILL.md files in `channel47/skills` and the server
  READMEs in `channel47/mcps`.
- The anecdotes are drawn from Jackson's client verticals (pet, cookware, hearing, beauty,
  wellness, coaching) with clients anonymized and details written as illustrative
  composites. **Review the specific numbers and scenarios in each piece before
  publishing** and adjust any that should match a real account more closely.

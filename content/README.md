# Content

Editorial content for channel47.dev, stored as markdown with structured frontmatter so it
can be wired into the site (or a CMS) without rewriting anything.

## Structure

```
content/
└── stories/
    ├── skills/          Story pieces introducing each skill in channel47/skills
    └── connectors/      Story pieces introducing each MCP server in channel47/mcps
```

One file per asset. The filename is the slug (`creative-strategist.md` → `/posts/creative-strategist`
or wherever stories land in routing). Every story is a first-person narrative from Jackson that
introduces the asset through a real-world use case, then hands the reader the install path.

## How this maps to the site (docs/PLAN.md)

- Stories are **Posts** in the six-type taxonomy — the personable, human-voice counterpart to
  how-to Articles. Each story _links to_ the standalone asset it introduces (a Skill or
  Connector detail page), exactly as the plan specifies for Articles ("An Article links to the
  asset it uses").
- The `asset` frontmatter block carries everything a "Grab this" callout needs: name, type,
  repo URL, and install command. Render it as the highlighted artifact link in the Article/Post
  template.
- `category` mirrors the type of the asset being introduced (`skills` | `connectors`) so Browse
  can cross-reference, and `tags` feed search/related-content.

## Frontmatter schema

```yaml
title: string          # story headline
slug: string           # matches filename, used for routing
description: string    # ≤160 chars — browse rows, meta description
type: story            # content piece type (renders as a Post)
category: skills | connectors
asset:
  name: string         # asset slug in its source repo
  type: skill | mcp
  repo: string         # canonical GitHub URL
  install: string      # one-line install command
  package: string      # npm package (connectors only)
author: Jackson Dean
date: YYYY-MM-DD
tags: [string]
```

## Editorial notes

- Every feature, command, query, and workflow referenced in a story is real — pulled directly
  from the SKILL.md files in `channel47/skills` and the server READMEs in `channel47/mcps`.
- The anecdotes are drawn from Jackson's client verticals (pet, cookware, hearing, beauty,
  wellness, coaching) with clients anonymized and details written as illustrative composites.
  **Review the specific numbers and scenarios in each piece before publishing** and adjust any
  that should match a real account more closely.

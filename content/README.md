# Content

Editorial content for channel47.dev, stored as markdown with structured frontmatter and
read at build time by `lib/content.ts`. Publishing is adding a file.

## Two public sections

- **Projects** (`/projects/[slug]`): software, tools, and experiments. Add a
  markdown file to `content/projects/` for a general project. Existing skills
  and connectors use the same public section, with their installation details.
- **Notes** (`/notes/[slug]`): short observations, experiments, longer write-ups,
  and workshop notes. Add a file to `content/notes/`; there is no minimum length
  or required tutorial structure. Legacy workshop and post formats can render
  here, but an event agenda alone does not qualify as a published note.

`lib/discovery.ts` defines section membership. `getContentEntries()` supplies
one inventory to navigation, feeds, search, and sitemaps. A duplicate slug within
one section fails the build instead of silently shadowing another piece.

The specialized source folders (`skills`, `connectors`, and the currently empty
`workshops` and `posts/{skills,connectors}` collections) represent **formats**,
not public sections. New general writing belongs in `notes`, not the legacy post format.
Old detail URLs redirect to their canonical project or note, including markdown
and social-image URLs. Media under `public/posts/` keeps its existing URLs.

## Minimal publishing workflow

Add one markdown file to `content/projects/` or `content/notes/`. Include a title,
description and date, followed by any length of
markdown. Tags, figures, FAQs, and video are optional. No cover image is needed.
Publishing a site entry does not send email; select existing entries for email
when useful, following the newsletter playbook.

The filename supplies the slug for notes and general projects. A note can be
a paragraph, an image with a caption, or a longer account of the work. Its page,
RSS entry, search entry, metadata, and social preview are built from that file.
The newest note leads the homepage automatically. No homepage edit is required.
The homepage uses its video poster or first real markdown image when available;
an optional `preview` chooses a different real image. Text-only notes get a
text-only feature. Related reading comes from links and shared tags in the
existing content. No extra summary, recommendation list, or cover is required.

For example, this is enough frontmatter in `content/notes/a-small-observation.md`:

```yaml
---
title: A small observation
description: A sentence about what I noticed.
date: YYYY-MM-DD
---
```

Replace the example with real content and a real date. The selected project
list is maintained in `HOME.selectedProjects` in `lib/site-content.ts`.

A project may optionally set `status` to `experiment`, `in-progress`, `available`,
or `archived`. Status is author-supplied; omit it when unnecessary. Put links to
software or repositories in the body. There is no required package or install
command for a general project.

## Frontmatter schemas

Note or general project (`content/notes/*.md`, `content/projects/*.md`):

```yaml
title: string          # headline, sentence case, e.g. "I was using Codex to write prompts for Google Flow"
slug: string           # optional; defaults to the filename, used for routing
description: string    # ≤160 chars — browse rows, index rows, meta description; also
                        # doubles as the article lede
date: YYYY-MM-DD
tags: [string]         # optional
status: experiment     # projects only, optional
sanitized: boolean      # optional — when true, the byline shows a "sanitized example"
                        # tag (the Note convention for real-but-anonymized systems)
video:                   # optional — real walkthrough footage shown near the top
  src: string            # root-relative MP4 path under public/
  poster: string         # root-relative poster image
  captions: string       # root-relative WebVTT captions (not SRT)
  duration: string       # ISO 8601 duration, e.g. PT4M17S
  caption: string        # optional visible caption below the player
preview:                 # optional homepage image override; use a real result
  src: string            # existing image path
  alt: string            # describe what the image shows
```

Post (`content/posts/{skills,connectors}/*.md`):

```yaml
title: string          # headline
slug: string           # matches filename, used for routing
description: string    # ≤160 chars — browse rows, meta description
category: skills | connectors
asset:
  name: string         # asset slug — links the post to its asset page
  type: skill | mcp
  repo: string         # canonical GitHub URL
  cardTitle: string    # optional title for the linked asset card
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
install: string        # one-line command, shown near the top with a copy button
package: string        # npm package (connectors only)
date: YYYY-MM-DD
tags: [string]
pairing: string         # optional — one sentence on what this asset pairs with and
                        # why (may contain a single markdown link); renders under
                        # the install block, replacing the old repo/package row
screenshot: string      # optional — real screenshot path under public/
screenshotCaption: string
                        # optional — figure caption. With `screenshot`, captions the
                        # real image. Without a screenshot, no figure renders.
askAnswer:              # optional — only add for a real worked example, never invented
  question: string
  columns: [string, string, string]  # optional header row, e.g. [Keyword, QS, Impr]
  rows:
    - label: string
      value: string
      value2: string    # optional
  caption: string
faqs:                   # optional — the "Common questions" accordion, rendered
  - q: string           # after the body and before the Share row (single-open
    a: string           # unfold rows; first open by default). Also emitted as
                        # FAQPage JSON-LD. Answers are real claims — write them
                        # from the page's own facts, never from a template.
```

Notes and workshops accept the same optional `faqs:` list; it renders the identical
"Common questions" section on their detail templates (`components/site/faq.tsx`).

## Images (editorial media and framed screenshots)

Markdown images render as clean, unframed editorial figures by default. Alt text
doubles as the visible figcaption.

Whiteboard illustrations follow the [infographic style system](../docs/infographic-style-system.md).

```markdown
![One of Flow's generated product directions.](/posts/flow-direction.jpg)
```

Captured interfaces opt into the framed screenshot treatment with the standard
markdown title `"screenshot"`. That adds a quiet field and CSS drop-shadow:

```markdown
![The audit run that found the $412.](/posts/audit-run.png "screenshot")
```

- Capture windows with `⌘⇧4 → Space → ⌥-click` (Option omits the native shadow) so the
  PNG keeps its rounded corners on a transparent background — the treatment depends on
  that transparency.
- Every real screenshot on the site — terminal *and* browser windows alike — should use
  the `"screenshot"` title. Photography, illustrations, and generated artwork stay
  unframed. Missing artwork is not a reason to delay a note; omit the figure until it exists.
- Files live in `public/posts/`; reference them root-relative. No double quotes in paths.
- Write alt text as a real caption — it's shown under the figure in mono.
- The rendering is `marked.use()` in `lib/content.ts` + `.st-media`/`.st-shot*` in
  `app/globals.css`.

Headings and section spacing establish hierarchy. Markdown `---` adds a spacing
break; the site does not use structural hairline dividers.

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

Renders a neutral placeholder slot for local drafting. Remove it before publishing
unless a real image is ready. Swap to a real screenshot later by replacing the src with a real path and
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
grouped rows:

```markdown
### Ships with this build · sanitized

- the original workflow proposal
- the "interview me" prompt
```

Ordinary prose never starts a line with `RESULTS ·`, `STATUS ·`, or `Ships with this
build`, so all four hooks are inert everywhere else — posts, skills, connectors, and
workshops render exactly as before.

Newsletter signup is provided by the shared page template. Do not duplicate a
subscription pitch inside the article body.

## Editorial standard

- Publish a real observation, decision, example, or useful artifact. A short note
  with one of those is enough; length and a tutorial structure are not requirements.
- Preserve Jackson's actual language and judgment. Do not manufacture a personal
  anecdote, result, or lesson to make a thin piece feel substantial.
- Event descriptions and topic lists alone do not belong in Notes. A workshop
  write-up needs something a reader can learn or see without having attended.
- Project documentation can be concise and factual. A working repository,
  installation instructions, and concrete capabilities provide reader value.
- Omit missing screenshots and unavailable download lists. Only claim that an
  artifact ships with a piece when readers can actually access it.
- Numbers, outcomes, and testimonials must come from the real source. Never use
  illustrative composites or placeholder praise as published evidence.

### Direct language

Say what you mean. Prefer a literal phrase when it conveys the idea clearly.
Do not substitute metaphor, flourish, or a clever turn of phrase for an exact
statement. For example, write “where an agent could help” instead of “where an
agent earns its place,” and “save time on recurring work” instead of “save time
that compounds.”

During review, ask what each phrase tells the reader. Replace decorative
metaphors, vague promises, staged revelations, and repeated conclusions with
the specific action, observation, or limitation. Cut the sentence if it adds
nothing. Preserve actual quotations, conversational qualifiers, and expressions
that carry Jackson's meaning. Direct language should still sound like him.

Apply this check to article titles and bodies, project descriptions, signup
copy, and service pages. It is an editing standard, not a requirement to make
every piece sound formal or technical.

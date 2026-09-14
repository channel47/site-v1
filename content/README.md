# Content

`content/notes/` and `content/projects/` are the only published collections. One Markdown file supplies the reading page, index, RSS, search, sitemap, metadata and Markdown twin through `lib/content.ts`. A duplicate URL fails validation.

The current selection includes a worked customer-research and ad-angle example in Claude, a note following the creative workflow from Google Flow references to complete static ads in Codex, a Google Ads MCP piece combining its development story, installation and safety details, the Vellum build story showing work on X-All product images, and projects about Valle Ballet and Born Simple, PhantomRack, and a recurring recruiting workflow. The former Flow note redirects to `/notes/codex-static-ads-google-flow`. The retired skill and other advertising-connector pages are removed; their source remains in Git history. The actual skill/tool repositories are independent and remain available.

## Editorial direction

Read [VOICE.md](VOICE.md) before choosing, drafting, or editing articles, site
copy, newsletters, or sharing text. It is the single working brief for the
site's voice. Publishing and media conventions live below.

## Publishing

Add a file to either collection. The filename supplies the slug unless explicitly set. There is no minimum length and no required cover.

```yaml
---
title: A clear title
description: A factual sentence about the piece.
date: YYYY-MM-DD
tags: [optional-topic]
---
```

Replace these examples with actual content and its real publication date.
Keep `date` stable when revising an existing piece: RSS, publication metadata,
and Markdown `publishedAt` use it. When the story belongs to another moment,
add `storyDate`. The byline, Collection, and Index use that date instead.
Use a quoted month (`"2026-01"`) when the source does not establish a day;
do not invent one. Without `storyDate`, browsing falls back to `date`.

## Direct language

Jackson's original **mannered-prose** reference is preserved here as background.
The working guidance is in [VOICE.md](VOICE.md).

> Mannered prose substitutes metaphor and flourish for direct statement. Instead
> of "a parameter worth varying," the mannered writer produces "a dial worth
> turning." Instead of "this point still matters," they write "this point earns
> its keep." The phrases exist to display the writer, not to convey the idea,
> and readers can tell. That is why mannered prose irritates: it makes the
> reader work harder so the writer can perform. It is also imprecise. Metaphors
> drag in connotations the writer did not choose and cannot control. The fix is
> to say what you mean. When a literal phrase is available, use it.

## Optional fields

| Field | Purpose |
| --- | --- |
| `slug` | Lowercase letters, numbers and hyphens. |
| `storyDate` | The main story's point in time: quoted `YYYY-MM` or `YYYY-MM-DD`. Controls the visible date and browsing order; must not be later than `updated` (or `date` when unrevised). Available separately in Markdown and search; never substitutes for publication metadata. |
| `updated` | Date of a substantive revision, on or after `date`. Used by sitemap and structured data; does not change story order, RSS publication order, or RSS identity. Do not bump it for routine builds. |
| `newsletter` | A short, article-specific reason to subscribe. The reading template adds the shared occasional-email cadence. |
| `preview: { src, alt }` | An existing image selected instead of the first Markdown image or video poster. |
| `video: { src, poster, captions, duration, caption, uploadDate }` | Actual MP4, poster, English WebVTT, ISO8601 duration and optional visible caption. Optional quoted `uploadDate` preserves the video's original date when moved to another article. |
| `gallery: { id, title, description, initial, images }` | An optional study using real local images. Each image has `src`, `label`, `alt`, `caption`, `width`, and `height`. `initial` is the zero-based opening image. Place a standalone link to the article's full canonical URL plus `#id` where the viewer belongs; this remains useful in feeds. |
| `faqs: [{ q, a }]` | Authored questions/answers. Rendered visibly and in structured data. |
| `sanitized` | Mark a real anonymized example in the byline. |
| `rssId` | Historical path used as feed identity after a source move. Do not change an established identity. |

Projects additionally accept `status` (`experiment`, `in-progress`, `available`, `archived`), `repo`, `install`, `package` and `pairing`. Installation is optional and renders in the shared reading template. Do not describe a repository as a hosted application.

## Media

Images are editorial figures with their alt text repeated as a visible caption:

```markdown
![A useful description of the actual image.](/posts/example.jpg)
```

Use the optional `"screenshot"` Markdown title to identify a captured interface. Display it directly, without an added frame, inset background or shadow. Article images share a subtle 8px corner radius; collection objects retain their silhouettes. Capture screenshots at their native resolution rather than enlarging a compressed preview. Omit unfinished figures rather than publishing placeholders. Standard Markdown handles paragraphs, headings, lists, code and blockquotes; the former custom results/status/ships-with grammars are gone.

State an illustrative example's status once; repeat qualifications only where
they affect interpretation. Reserve display blockquotes for strong quotations,
keep supporting excerpts in ordinary prose, and put reusable prompts in fenced
`text` blocks. Use images to show the work, including distinct treatments when
an article compares ideas.

Write each prompt paragraph on one source line and separate paragraphs with a
blank line. The browser wraps the text to fit the screen. Fenced blocks preserve
line breaks when displayed and copied, so use extra breaks only for intentional
structure such as lists or code.

Published media URLs under `public/posts/` and `public/email/` are kept stable, including images sent in newsletters. Do not delete an image solely because the current homepage does not use it.

For a frontmatter video, put a standalone Markdown link to its `src` where the
player should appear in the article. The reading page replaces that link with
the player and caption; Markdown and RSS keep the link. Without a placement
link, the player follows the story. Videos never move ahead of the opening
automatically.

## Collection artwork

Artwork is presentation data in `lib/collection.ts`, separate from article frontmatter. A new entry with an existing real image can appear automatically; a text-only entry is available through Index. Generate artwork only when a real asset does not fit and a cover would help.

Read [cover-art.md](../docs/cover-art.md) before making a render and [design-system.md](../docs/design-system.md) before changing layouts. The approved blue tablet relief is the visual benchmark. A cover may be abstract; the opened piece contains the information and original evidence.

Publishing content does not send email. Follow the existing [newsletter playbook](../docs/newsletter-playbook.md) for preparing and sending updates.

## Downloadable workflows

Keep authored skill source under `workflows/<name>/`. Run `node scripts/package-workflow.mjs <name>` to copy its explicit public-file allowlist into `public/downloads/` and build the version-one ZIP and checksum. Inspect the archive before publishing. The download's license applies to its instructions and documentation, not to brand assets in a companion article. Subsequent public releases should receive a new versioned filename so existing download URLs remain stable.

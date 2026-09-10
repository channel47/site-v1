# Content

`content/notes/` and `content/projects/` are the only published collections. One Markdown file supplies the reading page, index, RSS, search, sitemap, metadata and Markdown twin through `lib/content.ts`. A duplicate URL fails validation.

The current selection is the Google Flow reference experiment, the ELT/Codex ad experiment, the Google Ads MCP development note, and the Google Ads connector. The retired skill and other advertising-connector pages are removed; their source remains in Git history. The actual skill/tool repositories are independent and remain available.

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

Replace these examples with actual content and its real date. Use direct language and preserve the author's voice. Prefer a literal phrase over metaphor used only for flourish. Never invent experience, results, quotations, or proof to make a short piece feel substantial.

## Optional fields

| Field | Purpose |
| --- | --- |
| `slug` | Lowercase letters, numbers and hyphens. |
| `preview: { src, alt }` | An existing image selected instead of the first Markdown image or video poster. |
| `video: { src, poster, captions, duration, caption }` | Actual MP4, poster, English WebVTT, ISO8601 duration and optional visible caption. |
| `faqs: [{ q, a }]` | Authored questions/answers. Rendered visibly and in structured data. |
| `sanitized` | Mark a real anonymized example in the byline. |
| `rssId` | Historical path used as feed identity after a source move. Do not change an established identity. |

Projects additionally accept `status` (`experiment`, `in-progress`, `available`, `archived`), `repo`, `install`, `package` and `pairing`. Installation is optional and renders in the shared reading template. Do not describe a repository as a hosted application.

## Media

Images are editorial figures with their alt text repeated as a visible caption:

```markdown
![A useful description of the actual image.](/posts/example.jpg)
```

Use the optional `"screenshot"` Markdown title for a captured interface; it gives the image an inset surface and shadow. Omit unfinished figures rather than publishing placeholders. Standard Markdown handles paragraphs, headings, lists, code and blockquotes; the former custom results/status/ships-with grammars are gone.

Published media URLs under `public/posts/` and `public/email/` are kept stable, including images sent in newsletters. Do not delete an image solely because the current homepage does not use it.

## Collection artwork

Artwork is presentation data in `lib/collection.ts`, separate from article frontmatter. A new entry with an existing real image can appear automatically; a text-only entry is available through Index. Generate artwork only when a real asset does not fit and a cover would help.

Read [cover-art.md](../docs/cover-art.md) before making a render and [design-system.md](../docs/design-system.md) before changing layouts. The approved blue tablet relief is the visual benchmark. A cover may be abstract; the opened piece contains the information and original evidence.

Publishing content does not send email. Follow the existing [newsletter playbook](../docs/newsletter-playbook.md) for preparing and sending updates.

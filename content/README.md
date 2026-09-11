# Content

`content/notes/` and `content/projects/` are the only published collections. One Markdown file supplies the reading page, index, RSS, search, sitemap, metadata and Markdown twin through `lib/content.ts`. A duplicate URL fails validation.

The current selection includes a worked customer-research and ad-angle example in Claude, a note following the creative workflow from Google Flow references to complete static ads in Codex, and a Google Ads MCP piece combining its development story, installation and safety details. The former Flow note redirects to `/notes/codex-static-ads-google-flow`. The retired skill and other advertising-connector pages are removed; their source remains in Git history. The actual skill/tool repositories are independent and remain available.

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

Replace these examples with actual content and its real date. Follow the [direct-language guidance](#direct-language) below. Never invent experience, results, quotations, or proof to make a short piece feel substantial.

## Direct language

Jackson supplied the following **mannered-prose** prompt as the editorial
reference. Apply it when drafting or editing site copy, articles, newsletters,
and sharing text. Preserve his conversational syntax and meaningful qualifiers;
direct language does not mean making every sentence short or formal.

> Mannered prose substitutes metaphor and flourish for direct statement. Instead
> of "a parameter worth varying," the mannered writer produces "a dial worth
> turning." Instead of "this point still matters," they write "this point earns
> its keep." The phrases exist to display the writer, not to convey the idea,
> and readers can tell. That is why mannered prose irritates: it makes the
> reader work harder so the writer can perform. It is also imprecise. Metaphors
> drag in connotations the writer did not choose and cannot control. The fix is
> to say what you mean. When a literal phrase is available, use it.

During review, ask what each phrase tells the reader. Replace decorative
metaphors, vague promises, staged revelations, and repeated conclusions with
the specific action, observation, or limitation. Cut the sentence if it adds
nothing. Preserve actual quotations, conversational qualifiers, and expressions
that carry Jackson's meaning. Direct language should still sound like him.

Apply this check to article titles and bodies, project descriptions, signup
copy, and service pages. Avoid colons in titles and headings. This is an editing
standard, not a requirement to make every piece sound formal or technical.

Let the work, decisions, frustrations, and surprises give a personal piece its
structure. Introduce features when they matter to that experience. Avoid turning
a build story into a feature tour or restating what a screenshot already shows.
The Flow/Codex note is a useful voice reference for this balance.

State an illustrative example's status once, then keep qualifications where
they change a reader's decision. Avoid repeating the same disclaimer in the
body and captions. Reserve display blockquotes for a strong quotation;
supporting excerpts can stay in ordinary prose, and reusable prompts belong
in fenced `text` blocks. Use images to show the work as it develops, including
distinct creative treatments when the article compares ideas.

## Optional fields

| Field | Purpose |
| --- | --- |
| `slug` | Lowercase letters, numbers and hyphens. |
| `updated` | Date of a substantive revision, on or after `date`. Used by sitemap and structured data; does not change publication order or RSS identity. Do not bump it for routine builds. |
| `newsletter` | A short, article-specific reason to subscribe. The reading template adds the shared occasional-email cadence. |
| `preview: { src, alt }` | An existing image selected instead of the first Markdown image or video poster. |
| `video: { src, poster, captions, duration, caption, uploadDate }` | Actual MP4, poster, English WebVTT, ISO8601 duration and optional visible caption. Optional quoted `uploadDate` preserves the video's original date when moved to another article. |
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

Published media URLs under `public/posts/` and `public/email/` are kept stable, including images sent in newsletters. Do not delete an image solely because the current homepage does not use it.

## Collection artwork

Artwork is presentation data in `lib/collection.ts`, separate from article frontmatter. A new entry with an existing real image can appear automatically; a text-only entry is available through Index. Generate artwork only when a real asset does not fit and a cover would help.

Read [cover-art.md](../docs/cover-art.md) before making a render and [design-system.md](../docs/design-system.md) before changing layouts. The approved blue tablet relief is the visual benchmark. A cover may be abstract; the opened piece contains the information and original evidence.

Publishing content does not send email. Follow the existing [newsletter playbook](../docs/newsletter-playbook.md) for preparing and sending updates.

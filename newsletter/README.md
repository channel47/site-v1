# Channel47 broadcast source

This folder is the source of truth for Channel47 email presentation.
`channel47-wrapper.html` is the paste-ready source for the Kit HTML template;
it owns the branded header, content frame, site footer, unsubscribe link, and
physical-address token. Broadcast API content contains the issue body only, so
Kit applies exactly one presentation layer.

The standing send audience is every active Kit subscriber. The old
`ch47-subscribe` tag is not a broadcast boundary. Kit's active list excludes
cancelled, bounced, complained, and inactive records; the read-only `check`
command prints the live active count before any draft can be created.

The header uses `public/email/channel47-mark-v3.png`, a static, versioned logo
for the widest inbox compatibility and a fresh URL when image proxies have
cached an earlier failure. It keeps a transparent background and subtle light
keyline for reliable light/dark inbox contrast.

Run `pnpm brand:build` to regenerate the current PNG from the canonical
`components/site/mark.ts` outlines. The older v2 PNG, GIF, vector and Pillow
builder are retained only for historical emails; do not overwrite those assets.
Keep meaningful alt text on the image in case a recipient blocks remote images.

The Kit template uses the public PNG URL from `config.json`. The `render`
command swaps in an embedded data URI so local previews continue to work
offline. Keep the Kit template code synchronized with this file after every
wrapper change.

## Kit template setup

Kit's public API can list and select templates, but it cannot create or edit
their HTML. In Kit, create a new HTML template named `ch47-v2` and paste the
complete contents of `channel47-wrapper.html`. Do not paste the wrapper into a
Broadcast body. The template must retain exactly one `{{ message_content }}`
token plus `{{ unsubscribe_url }}` and `{{ address }}`.

`config.json` resolves `ch47-v2` by exact name while its ID is null. After Kit
lists exactly one matching HTML template, `check`, `draft`, and `update` use its
live ID automatically. Keeping the legacy `ch47` template separate provides a
rollback path.

## Draft issue files

Saving an issue here does not publish it or send email.

Each broadcast starts as an HTML file with small frontmatter:

```html
---
subject: A specific subject line
preview_text: One sentence that complements the subject.
description: Internal Kit description
primary_url: https://channel47.dev/notes/example
---
<p style="margin:0 0 20px;line-height:170%;">The opening paragraph.</p>
<p style="margin:0 0 20px;line-height:170%;">The rest of the email.</p>
<p style="margin:28px 0 0;line-height:170%;"><a href="https://channel47.dev/notes/example" style="color:#161718;text-decoration:underline;">Read the complete note →</a></p>
```

`subject`, `preview_text`, and `description` are required. `primary_url` records
the main link for editorial review. Keep issue HTML simple and inline the styles
that matter.

## Commands

From `site/`:

```sh
python3 scripts/kit-broadcast.py check
python3 scripts/kit-broadcast.py render newsletter/issues/ISSUE.html --output output/newsletter/preview.html
python3 scripts/kit-broadcast.py draft newsletter/issues/ISSUE.html
python3 scripts/kit-broadcast.py update BROADCAST_ID newsletter/issues/ISSUE.html
```

`check` is read-only. `render` is local-only. `draft` creates an unscheduled,
non-public Kit draft and cannot send or schedule it. `update` first verifies
that the target is an unscheduled, non-public draft for all subscribers, then
updates its template and reviewed issue body. It refuses sent, scheduled,
published, tagged, or segmented Broadcasts.

Before `draft`, review the subject, preview text, complete body, primary link,
sender, and live active-subscriber count with Jackson. Sending remains a
separate, explicitly confirmed action outside this script.

Run the local regression checks and render the compatibility fixture with:

```sh
python3 -m unittest discover -s tests -p 'test_kit_broadcast.py'
python3 scripts/kit-broadcast.py render newsletter/fixtures/client-qa.html --output output/newsletter/client-qa.html
```

## Compatibility rules

The wrapper uses a single-column presentation table, a fluid 600px container,
an Outlook-only fixed-width fallback, opaque backgrounds and separators,
web-safe fonts, and critical light-mode styles inline. Dark mode and the mobile
padding breakpoint are progressive enhancements; the email must remain readable
when a client strips the style block.

Issue HTML is part of the compatibility surface. Keep it to paragraphs,
headings, short lists, blockquotes, links, inline code, and responsive images.
Use absolute HTTPS URLs. Every image needs meaningful alt text, explicit source dimensions,
and `display:block;height:auto;max-width:100%`. Avoid layout divs, flexbox, grid,
scripts, forms, background images, custom fonts, transparent colors, raw long
URLs, and essential information that exists only in an image.

The public PNG must return HTTP 200 with an `image/png` content type before
`check` or `draft` will pass.

## Real-client acceptance matrix

Local rendering catches structure, width, overflow, and dark-mode regressions,
but Kit still resolves the template's compliance variables and may rewrite
links. After any wrapper or Kit-template change, send a Kit test email and
inspect the final delivered message in:

- Gmail web, Android, and iOS in light and dark modes
- Apple Mail on macOS and iOS in light and dark modes
- Classic Outlook for Windows, New Outlook or Outlook.com, and Outlook mobile
- Yahoo Mail web
- a narrow 320px viewport
- images-blocked and animation-disabled conditions

Confirm the fixed 600px desktop width, no mobile horizontal scrolling, readable
fallback fonts, intact spacing and borders, a complete static logo frame, one
hidden preview-text value, working links, and Kit's unsubscribe and physical
address footer. Also test one long issue so the delivered HTML stays comfortably
below Gmail's clipping limit.

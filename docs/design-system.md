# 47 design system

This is the canonical design reference. `app/tokens.css` owns values, `app/globals.css` owns component recipes, and [cover-art.md](cover-art.md) owns the collection artwork. Extend these sources; avoid parallel themes and one-off page systems.

## Direction

Four distinct objects on a shared surface. Quiet navigation gives way to one expressive moment: a cobalt screen with oversized italic links moving through a continuous vertical reel. The reading view pairs narrow editorial headlines with a precise, comfortable sans serif.

Keep the geometric 47 as the visible identity. Reuse `components/site/mark-blocks.ts`; do not redraw it. Domain and metadata identity remain `channel47.dev` and `channel47`. Avoid structural hairlines, generic cards, badges, decorative numbering and extra default labels.

## Type, space and shape

| Role | Canonical choice |
| --- | --- |
| Display | **Instrument Serif**, regular for article headlines and subheads; italic for the menu, Index heading and quotations. Weight 400, close tracking, compact line-height. Do not synthesize bold serif. |
| Reading / interface | **Instrument Sans**, variable 400–700. Body 18px desktop / 17px mobile at 1.75. Ledes are slightly larger, closer-tracked sans serif. |
| Utility | Small Instrument Sans, 11–14px. Uppercase with `--tracking-label` only for short metadata. Code uses the system monospace stack. |
| Font delivery | Local WOFF2 files in `app/fonts`, loaded through `next/font/local`. No runtime font-provider request. OFL licenses live beside the files. Social-preview fonts remain in `assets/fonts`. |
| Heading scale | `--text-heading` is 42–72px, with a 1.02 line-height. The text index has a deliberately larger italic heading; its entries stay sans serif. The menu has its own viewport-scaled display size. |
| Reading measure | `--reading-width`: 660px. `--media-width`: 960px. Header, introduction, body, installation, sharing and reading-end blocks align. Images and video may widen. |
| Spacing | `--space-1` through `--space-10`: 4, 8, 12, 16, 24, 36, 48, 72, 96, 144px. Small steps group related details; 72–144px intervals separate sections. Fluid page gutters respond to viewport width. Optical icon gaps and responsive adjustments may be smaller. |
| Corners | `--radius-control`: 999px, for circular icon buttons and pill-shaped actions/fields. `--radius-surface`: 16px, for installation/code/utility insets. `--radius-detail`: 2px, only for tiny inline details and focus boundaries. Images retain their actual silhouettes. |
| Controls | Minimum 48px hit area. Focus is a clear 2px outline; it changes to light ink inside the cobalt menu. The email input and submit action share one capsule, with a single focus treatment. |

Quotations are set as italic display text with breathing room, without a generic tinted quote box. Body paragraphs remain sans serif for sustained reading. Never use a display flourish to rewrite the author's voice.

## Color and motion

| Token role | Use |
| --- | --- |
| `--page` / `--surface` | Neutral mineral paper and a slightly deeper utility inset. Light only, so generated material objects keep their lighting. |
| `--ink` / `--body` / `--muted` | Headings and controls, sustained reading, supporting text. |
| `--accent` | Strong blue for actual links and focus. Saturated artwork does not become a category color. |
| `--takeover` / `--takeover-ink` | Cobalt and light ink reserved for the full-screen menu. This is the main color event in the interface. |
| Feedback | Success and error colors appear only for real feedback. |
| Timing | UI 320ms, disclosures 560ms, object response 760ms, initial blur reveal 1000ms, logo blocks 650ms. Menu wash opens in 900ms and closes in 640ms, using its own easing. Type arrives over 700ms after a 400ms delay; utility controls follow. Keep the page’s original blur reveal outside the menu. |
| Reduced motion | CSS removes animation and transform transitions. The menu presents one ordinary scrollable set of links, without cyclic copies or perspective. The full article video always requires user playback. |

The menu scroll uses native browser momentum. Do not add wheel interception, constant autoplay, background drifting or a second animation library to recreate that behavior. Movement comes from the reader's input. Preserve the centered position when the viewport changes. Keyboard focus scrolls only the reel, never the outer dialog. An interrupted opening exits from the current circle transform and content opacity, without flashing to the completed state.

## Components and states

| Component | Recipe / behavior |
| --- | --- |
| `SiteHeader` | The real 47 mark and one three-dot trigger, identical across screen sizes. No empty video-preview control. |
| `NavigationTakeover` | Native modal dialog with a transparent shell. A separate solid circle scales from the trigger to the farthest viewport corner; do not animate a clip over the entire dialog or blur the repeated reel. Partial words at the top and bottom suggest continuation without a written scroll instruction. Footer utilities are icons. Five visual copies support looping; only the central set is exposed to assistive technology and Tab navigation. All visible copies remain normal pointer links. |
| Menu keyboard behavior | Opening focuses Close. Tab remains inside the native dialog. Arrow keys move between the four main links. Escape closes, restores the trigger and preserves page position. Navigating waits for the exit transition. Reduced motion closes immediately. |
| `Collection` | Two columns, a maximum 980px width, with a viewport-height constraint on desktop to keep the small collection composed. Four square objects represent four pieces. Hover/focus reveals a compact caption and slowly lifts the object. Mobile opens with one tap. |
| `PiecePage` | One notes/projects template with aligned serif headline and sans-serif body. Optional full video, installation and FAQs. Original media remains documentary content; generated covers do not replace it. |
| `BrowseEntryLink` / `BackToBrowse` | Real Next links remember their source and restore the index/collection scroll and focused link when returning. Show a small grid icon with Collection, or a list icon with Index. The accessible label describes returning; the visible label stays short. Direct arrivals use Collection. |
| `Rows` | Spacious sans-serif titles with subordinate descriptions and compact type/date metadata. Filters stay in the URL. No row entrance replay on filtering. |
| `CopyButton` | Reports actual success/failure. Measurement fires only after successful copying. |
| `Faq` / `Unfold` | One answer open at a time. Buttons expose expanded state; closed panels are inert. Height/opacity settle gradually. |
| `Capture` | Shared capsule input/action. Idle, sending, accepted, unavailable and error states remain real. No fabricated success for an unconfigured service. |
| `ReadingEnd` | One actual related piece and one email invitation. The next title and direction cue occupy separate grid columns; the arrow never becomes an orphaned text glyph. Sharing stays grouped on the left with its label. |
| `DirectionCue` | A regular 20px right arrow inside a 48px circular surface. Internal navigation points right. In the menu it appears beside the word, independent of the serif and perspective; next-reading cues stay visible. A small horizontal response is enough. Never scale arrows with headline type. |
| `UtilityLink` | A 48px icon-only target with an accessible name and a compact label on hover/focus. Use the same Phosphor icon family as sharing. Work together uses a conversation icon; RSS uses its feed icon. Utility labels use Instrument Sans, never monospace. |
| `SiteFooter` | The canonical geometric mark at 28 × 14px inside a 48px link. Legal links and a conversation icon sit opposite it, including on mobile. No repeated name or wordmark. |
| Author portrait | A small rectangular photograph with the 2px detail radius and a restrained −3° angle, echoing the physical collection. The newsletter pairs it with the About Jackson heading and drops the repeated name/tagline. |

## Content and artwork

`content/notes` and `content/projects` are the only published collections. `lib/content.ts` supplies pages, feeds, search and metadata. `lib/collection.ts` maps one artwork object to each retained piece. The Google Flow video lives inside its article, not as a duplicate gallery object.

New pieces with a suitable existing image can join automatically; text-only pieces stay in Index until art is chosen. Keep high-resolution working renders in ignored `output/`; ship only responsive WebP variants in `public/collection/`. Do not add duplicate article snapshots to the client bundle.

## Verification before shipping

1. Run the README's type, content, measurement, SEO and production-build checks.
2. Inspect the actual collection, index, article and form at desktop and mobile widths.
3. Check the menu's complete reveal/exit, both loop directions, link destinations, Tab/arrow keys, Escape, focus restoration and preserved scroll. Confirm it covers the entire viewport without a scrollbar strip.
4. Check reduced motion, font loading, overflow, asset crops and title/body alignment.
5. Run the server checks for canonical URLs, Markdown twins, RSS identity, search, sitemaps, media and retired-page 404s.

Changes stay local until explicitly published. A successful build alone does not establish visual or interaction quality.

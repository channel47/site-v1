# 47 design system

This is the canonical design reference. `app/tokens.css` owns values, `app/globals.css` owns component recipes, and [cover-art.md](cover-art.md) owns the collection artwork. Extend these sources; avoid parallel themes and one-off page systems.

## Direction

Distinct objects on a shared surface. Quiet navigation gives way to one expressive moment: a cobalt screen with oversized italic links moving through a continuous vertical reel. The reading view pairs narrow editorial headlines with a precise, comfortable sans serif.

Keep the geometric 47 as the visible identity. Reuse `components/site/mark.ts`; do not redraw it. Domain and metadata identity remain `channel47.dev` and `channel47`. Avoid structural hairlines, generic cards, badges, decorative numbering and extra default labels.

## Mark

The master is a 48 × 24 silhouette: two 21-unit numerals separated by a 6-unit
channel. Stems are 7 units wide. The original open 4, square terminals and broad
proportions remain; a short 45° bridge makes the 7 continuous. Its diagonal is
approximately 7 units thick measured perpendicular to the stroke. Each numeral
is one closed path, eliminating seams between adjacent rectangles.

Use the shared outlines, never typeset “47” as a substitute. Leave at least
7 master units of clear space around standalone placements. In a control, its
48px hit area supplies the space. Header: 48 × 24px desktop, 40 × 20px mobile.
Footer: 28 × 14px. Avoid displaying the standalone mark below 24px wide; tiny
browser icons use the exported tile with a larger optical fill. Do not stretch,
round the corners, add shadows, or place the mark over busy imagery.

Default to ink on paper or white on dark. Cobalt is an available accent version.
The home mark assembles in six clipped sections over 1.4 seconds on arrival
and replay. A blue accent settles to ink; the complete master outline takes
over at rest to remove seams. Reduced motion immediately uses the static mark.
The isolated `/brand/refinement` preview shares `AnimatedMark` with the
header and includes replay, slow motion and color controls.
Inner-page and footer marks link home and remain static.

`pnpm brand:build` (Node 24) generates the SVG and transparent PNG masters in
`public/brand/`, the square avatar, browser and Apple icons, and the versioned
email PNG. Geometry comes from `components/site/mark.ts`; colors come from
`app/tokens.css`. SVG is the preferred scalable master; PNG exports are 1024px
wide, the avatar is 1024px square, and the email PNG is 3× its 52 × 28px display
canvas. The email alone has a subtle paper keyline for dark inboxes. Keep old
versioned email artwork unchanged so sent messages retain their original art.

## Type, space and shape

| Role | Canonical choice |
| --- | --- |
| Display | **Instrument Serif**, regular for article headlines and subheads; italic for the menu, Index heading and quotations. Weight 400, close tracking, compact line-height. Do not synthesize bold serif. |
| Reading / interface | **Instrument Sans**, variable 400–700. Body 18px desktop / 17px mobile at 1.75. Ledes are slightly larger, closer-tracked sans serif. |
| Utility | Small Instrument Sans, 11–14px. Sentence case throughout; close `--tracking-label` spacing for short metadata. Preserve acronyms and real brand names. Code uses the system monospace stack. |
| Font delivery | Local WOFF2 files in `app/fonts`, loaded through `next/font/local`. No runtime font-provider request. OFL licenses live beside the files. Social-preview fonts remain in `assets/fonts`. |
| Heading scale | `--text-heading` is 42–72px desktop / 40–56px mobile, with a 1.02 line-height. The text index has a deliberately larger italic heading; its entries stay sans serif. The menu has its own viewport-scaled display size. |
| Reading measure | `--reading-width`: 660px. `--media-width`: 960px. Header, introduction, body, installation, sharing and reading-end blocks align. Images and video may widen. |
| Spacing | `--space-1` through `--space-10`: 4, 8, 12, 16, 24, 36, 48, 72, 96, 144px. Small steps group related details; 72–144px intervals separate sections. Fluid page gutters respond to viewport width. Optical icon gaps and responsive adjustments may be smaller. |
| Corners | `--radius-control`: 999px, for circular icon buttons and pill-shaped actions/fields. `--radius-surface`: 16px, for installation/code/utility insets. `--radius-media`: 8px, for article photos, screenshots and video. `--radius-detail`: 2px, only for tiny inline details and focus boundaries. Collection objects retain their actual silhouettes. |
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
| Timing | Press 160ms, color/opacity 320ms, feedback 420ms, disclosures 560ms, object settling 860ms, page arrival 720ms with at most three 60ms stagger steps. The 1400ms logo assembly and 900ms/640ms menu wash retain their signature timing. Menu type arrives over 700ms, starting 36% into the wash; header/footer controls follow at 45%/55%. Menu content exits over 240ms. |
| Reduced motion | CSS removes animations, transitions and control displacement. `PageMotion` starts no animations and cancels active or waiting arrivals if the preference changes. The menu presents one ordinary scrollable set of links, without cyclic copies or perspective. The full article video always requires user playback. |

The menu scroll uses native browser momentum. Do not add wheel interception, constant autoplay, background drifting or a second animation library to recreate that behavior. Movement comes from the reader's input. Preserve the centered position when the viewport changes. Keyboard focus scrolls only the reel, never the outer dialog. An interrupted opening exits from the current circle transform and content opacity, without flashing to the completed state.

### Motion across a visit

Page arrivals use `--ease-arrival` for an immediate response with a short, soft finish. Text becomes sharp early; the final fraction only settles opacity. `--ease-settle` gives objects and controls a faster response with a soft finish; color uses `--ease-out`. The logo and wash keep their own established curves.

| Moment | Chosen behavior |
| --- | --- |
| Home mark | Preserve the six-piece blue-to-ink assembly and explicit replay. No perpetual glitch, hover replay or additional logo wobble. |
| New page | `PageMotion` sequences the visible heading, introduction and first content blocks. Text resolves from 3px blur and 3px below; objects from 6px blur and 8px below. At 75% eased progress both are sharp, in their final position and 96% opaque. The last few percent settle without a lingering blur. Visible artwork decodes and fonts finish loading before the sequence starts. Only the first viewport participates in long reading pages. Both About paragraphs and its follow row can arrive once on entering the viewport. |
| More collection objects | Objects below the viewport resolve once when they enter. They never animate out or repeat on reverse scrolling. Focusing or pressing an arriving object settles it immediately. |
| Returning / filtering | History restores fully visible content and the original scroll position. Index filters update without replaying rows. Cancelling a visit or entering the back-forward cache clears unfinished arrivals. |
| Object focus | Artwork lifts 10px, keeps a trace of its original angle, and expands 2.5%; its caption follows 80ms later. The link target stays still. Touch compresses just 1.5% over 160ms, then settles. No cursor tracking or parallax. |
| Menu trigger / wash | On desktop hover or keyboard focus, the three dots turn vertical to suggest the reel. The circle expands from that control. Type follows through a 24px rise; close freezes its current transform before fading, including an interrupted opening. |
| Menu scrolling | Keep native momentum, perspective and edge fades. No automatic scroll, snap interception or lagging spring applied to the scroll position. |
| Icon utilities | A circular surface expands underneath a stationary target. The glyph compresses slightly on press; labels arrive after a short dwell and leave promptly. The menu Close remains a bare X. |
| Index / directional links | Index titles change to blue on hover/focus; the active filter draws a short underline. Back, next-reading and session-proof arrows stay fixed while their color or surrounding surface changes. Body links and legal links remain still. |
| Questions | The panel opens over 560ms and fades over 320ms; the plus turns with the opening. Closing panels remain inert. No bounce or collapsing text scale. |
| Copy / forms | A real confirmation, error or sending state gets one 420ms settle. Submit and booking buttons compress on press. No repeated pulse, spinner added for decoration, or shake on error. |
| Reading / media / footer | Article paragraphs, photos, code, video controls and footer stay still as the reader scrolls. No progress decoration, floating portrait, autoplay video, footer entrance or scroll-delayed prose. |

Native Web Animations handle page arrivals; CSS handles controls and signatures. Keep values in `app/tokens.css`. JavaScript must read durations through `motionMilliseconds`: CSS optimization can return seconds even when the token was authored in milliseconds. The menu closes once, after its actual closing animation or a correctly converted fallback timer.

Article images reserve their intrinsic width and height before lazy loading. The shared Markdown renderer reads dimensions from local public assets, including SVGs, and refreshes that metadata when an asset changes. Keep these attributes when changing image presentation; a delayed download must not shift the following paragraphs. Portrait media also receives its aspect ratio as a CSS property: above 720px, the complete image fits within 72% of the viewport height, capped at 640px. Its explicit calculated width reserves the same space before loading. Never use two automatic dimensions or crop portrait ads to make them shorter. On phones the original full-width proportion remains.

`MotionBootstrap` prepares the initial hidden state before body paint. Hydration replaces it with paused animation frames before releasing the guard. A missing or blocked script leaves static HTML visible; delayed hydration fails open after two seconds and never hides that visible page again. Font/image readiness has a separate 2.5-second limit. Failed assets still reveal their caption; timed-out or cancelled arrivals cannot restart when an old promise resolves. Reduced motion, fragment links and history loads skip the initial guard. Do not revive per-page `an-blur` classes, whole-page opacity wrappers or delayed link interception. Only the menu waits for its intentional exit.

## Components and states

| Component | Recipe / behavior |
| --- | --- |
| `SkipLink` | Hidden during pointer and touch browsing, including restored focus. Reveals only after Tab input and while focus-visible. Pointer input and blur clear the reveal state; the link still targets the main landmark. |
| `SiteHeader` | The real 47 mark and one three-dot trigger, identical across screen sizes. No empty video-preview control. |
| `NavigationTakeover` | Native modal dialog with a transparent shell. A separate solid circle scales from the trigger to the farthest viewport corner; do not animate a clip over the entire dialog or blur the repeated reel. Partial words dissolve through a stationary 18% edge mask at the top and bottom, suggesting continuation without a written scroll instruction. Reduced motion uses an unmasked ordinary list. Footer utilities are icons. Five visual copies support looping; only the central set is exposed to assistive technology and Tab navigation. All visible copies remain normal pointer links. |
| Menu keyboard behavior | Keyboard opening focuses Close; pointer opening focuses the dialog itself. Close is a bare X, with a short underline for keyboard focus instead of a circle. Tab remains inside the native dialog. Arrow keys move between the four main links. Escape closes, restores the trigger and preserves page position. Navigating waits for the exit transition. Reduced motion closes immediately. |
| `Collection` | Two columns, a maximum 980px width, with a viewport-height constraint on tall desktop screens. Phones up to 520px use alternating five-of-six-column objects, one per row, with a short visible title. Each square object represents one piece. Hover/focus reveals the full caption and slowly lifts the object on larger screens. Mobile opens with one tap. |
| `PiecePage` | One notes/projects template with aligned serif headline and sans-serif body. Optional full video, installation and FAQs. The author’s name links to About beside a 44px portrait, with sentence-case date and reading metadata underneath. Installation follows the story. Original media remains documentary content; generated covers do not replace it. |
| `BrowseEntryLink` / `BackToBrowse` | Real Next links remember their source and restore the index/collection scroll when returning. Restore the focused link only when the piece was opened with a keyboard or assistive technology; pointer/touch visits must not acquire a focus outline on return. Show only a stationary 20px Phosphor ArrowLeft inside the shared 48px icon control. The accessible name and tooltip identify the return destination; direct arrivals return to Collection. Align the glyph with the reading measure. |
| `Rows` | Spacious sans-serif titles with subordinate descriptions and compact type/date metadata. Filters stay in the URL. No row entrance replay on filtering. |
| `CopyButton` | One button implementation for text and icon variants, with the same 18px Phosphor glyph, 48px target, hover color and two-second feedback everywhere. Reports actual success/failure with a check or warning icon. Measurement fires only after successful copying. Installation and code blocks share their inset recipe. In fenced blocks, the copy glyph aligns with the first text line in a reserved right-hand column; long code scrolls within the text column and never runs underneath the button. `CodeCopyButtons` enhances fenced blocks with Copy prompt or Copy code, preserving line breaks and excluding UI labels. Static HTML and feeds retain readable code without inert buttons. |
| `Faq` | One answer open at a time. Buttons expose expanded state; closed panels are inert. Height/opacity settle gradually. |
| `Capture` | Shared capsule input/action. Idle, sending, accepted, unavailable and error states remain real. No fabricated success for an unconfigured service. |
| `ReadingEnd` | One actual related piece and one email invitation. The next title and direction cue occupy separate grid columns; the arrow never becomes an orphaned text glyph. Sharing stays grouped on the left with a 12px label gap. Copy, link and social actions use 18px Phosphor icons; the Copy page control keeps its width during feedback. |
| `DirectionCue` | A regular 20px right arrow inside a stationary 48px circular surface. Internal navigation points right. Use it for next-reading and session-proof links. The glyph stays in place while the surface changes to blue. The menu is text only, with no arrows beside its links. Never scale arrows with headline type. |
| `UtilityLink` | A 48px icon-only target with an accessible name and a compact label on hover/focus. Use the same Phosphor icon family as sharing and disclosures; do not add hand-drawn SVG alternatives. Work together uses a conversation icon; RSS uses its feed icon. Utility labels use Instrument Sans, never monospace. |
| `SocialLinks` | One shared pair of 20px X and GitHub icons, each inside a 48px target. Blue on paper; light ink on the cobalt menu. Accessible profile names and labels on hover/focus supply context without persistent text or outbound arrows. Menu social profiles sit at lower left, opposite contact and RSS. External links keep native navigation. |
| About follow row | One blue envelope and Occasional emails on the left; the shared icon-only X and GitHub links align to the right. Keep at least 24px between the two groups; all targets are 48px tall. Social profiles live here and in the menu, not in the footer. |
| `SiteFooter` | The canonical geometric mark at 28 × 14px inside a 48px link. Privacy and Terms sit opposite, including on mobile. Contact remains in the menu; social profiles belong to About and the menu. No repeated name or wordmark. |
| `SessionPage` | One responsive offer panel and one body, with shared editorial headings, author portrait and direction cues. The offer moves above the body below 900px; phones retain the sticky booking action. No separate mobile biography or duplicated facts. |
| Author portrait | Use `AuthorPortrait`: the original square photograph, upright with a circular crop. No tilted postcard frame or tall crop. Keep it beside the related name or heading, not at the opposite edge: 44px byline, 56px newsletter/session, 80px About (64px on phones). |

## Mobile composition

Give the artwork enough space to show its material and lighting. On phones, alternate objects toward the left and right of the shared surface; do not reduce the desktop grid to four thumbnails. Keep only the title beneath each object, without a category or arrow. The image and title are one link, with a slight compression on touch. Tablet widths retain two columns. Short landscape windows remove the collection's height constraint, so rotation never makes the objects tiny.

Use 24px reading gutters, 17px body text and shorter 24–48px intervals within articles. Keep the headline and prose aligned. Mobile index entries stack their title, description and inline metadata instead of squeezing a date column beside the text. Sharing controls remain grouped; related reading keeps its arrow in a separate column.

Safe-area tokens protect the header, menu utilities, footer and booking action in portrait and landscape. The modal uses dynamic viewport height, with a compact header and type scale in short landscape windows. Preserve native scrolling and the selected reel position on resize. All primary controls retain 48px targets. Email fields stay 16px, request the email keyboard and disable capitalization; never disable browser zoom.

## Content and artwork

Social previews use Instrument Serif headlines and Instrument Sans labels,
with the canonical 47 mark. Piece cards reuse their collection cover; the
site-wide card is typographic. Render local artwork through Sharp to PNG for
Satori; retain the source files. The TTFs in `assets/fonts` are static versions
of the same locally hosted fonts, with provenance recorded beside them.

Article imagery must answer a reader's question. Start with the relationship,
comparison, or detail to explain, then choose objects that make it visible.
Integrate a few useful labels into materials (engraving, cable sleeves, printed
paper), keeping them legible at reading width. Keep the tactile lighting and
composition of the collection, with room for context inside article images.
Do not replace the prose with a photographed wall of text, add meaningless data
marks, or use generic objects whose only purpose is decoration.

Mix these illustrations with tightly framed real captures when the interface
or original work is the evidence. Never generate fake screenshots or account
results. Screenshots display directly with no frame, padding, surface or shadow;
use the shared 8px media radius. Crop source captures to make relevant details
readable without reconstructing their contents. Captions explain the takeaway and identify illustrative content;
important information must remain in accessible prose as well. The Google Ads
article uses a labeled connector and report still life, an actual MCP Inspector
capture, and the original dry-run fix. Their prompts and source provenance live
in [article-art-prompts.json](article-art-prompts.json).

`pnpm art:build` regenerates the packing storyboard from
`scripts/build-article-art.mjs`. Keep the storyboard explicitly illustrative.
Preserve older media URLs for feeds and sent links. The Flow video opens on
the existing blue tablet output, cropped by the player to 16:9; the source
recording and captions stay intact.

`content/notes` and `content/projects` are the only published collections. `lib/content.ts` supplies pages, feeds, search and metadata. `lib/collection.ts` maps one artwork object to each retained piece. The Google Flow video lives inside its article, not as a duplicate gallery object. The Google Ads build story and setup share `/projects/google-ads`; former note URLs redirect there, including Markdown and social previews.

New pieces with a suitable existing image can join automatically; text-only pieces stay in Index until art is chosen. Keep high-resolution working renders in ignored `output/`; ship only responsive WebP variants in `public/collection/`. Do not add duplicate article snapshots to the client bundle.

## Verification before shipping

1. Run the README's type, content, measurement, SEO and production-build checks.
2. Inspect the actual collection, index, article and form at desktop and mobile widths.
3. Check the menu's complete reveal/exit, both loop directions, link destinations, Tab/arrow keys, Escape, focus restoration and preserved scroll. Confirm it covers the entire viewport without a scrollbar strip.
4. Check reduced motion, font loading, overflow, asset crops and title/body alignment.
5. Run the server checks for canonical URLs, Markdown twins, RSS identity, search, sitemaps, media and retired-page 404s.

Changes stay local until explicitly published. A successful build alone does not establish visual or interaction quality.

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
Header marks replay a 960ms out-and-back cycle on mouse hover. Each cycle completes after pointer exit, and rapid re-entry cannot restart an unfinished cycle. Inner-page marks still navigate home immediately on click. The small footer mark stays static.

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
| Reading / interface | **Instrument Sans**, variable 400–700. Body 18px desktop / 17px mobile at 1.75. Article headers show the title and byline; descriptions are retained for metadata and indexes. The session page still uses a larger introductory lede. |
| Utility | Small Instrument Sans, 11–14px. Sentence case throughout; close `--tracking-label` spacing for short metadata. Preserve acronyms and real brand names. Code uses the system monospace stack. |
| Font delivery | Local WOFF2 files in `app/fonts`, loaded through `next/font/local`. No runtime font-provider request. OFL licenses live beside the files. Social-preview fonts remain in `assets/fonts`. |
| Heading scale | `--text-heading` is 42–72px desktop / 40–56px mobile, with a 1.02 line-height. The text index has a deliberately larger italic heading; its entries stay sans serif. The menu has its own viewport-scaled display size. |
| Related reading | `--text-navigation` is 30px desktop / 28px mobile, in regular Instrument Serif at 1.2 line-height. The Read next label uses 14px Instrument Sans. |
| Reading measure | `--reading-width`: 660px. `--media-width`: 960px. Header, introduction, body, installation, sharing and reading-end blocks align. Images and video may widen. |
| Spacing | `--space-1` through `--space-10`: 4, 8, 12, 16, 24, 36, 48, 72, 96, 144px. Small steps group related details; 72–144px intervals separate sections. Fluid page gutters respond to viewport width. Optical icon gaps and responsive adjustments may be smaller. |
| Corners | `--radius-control`: 999px, for circular icon buttons and pill-shaped actions/fields. `--radius-surface`: 16px, for installation/code/utility insets. `--radius-media`: 8px, for article photos, screenshots and video. `--radius-detail`: 2px, only for tiny inline details and focus boundaries. Collection objects retain their actual silhouettes. |
| Controls | Minimum 48px hit area. Focus is a clear 2px outline; it changes to light ink inside the cobalt menu. The email input and submit action share one capsule, with a single focus treatment. |

Quotations are set as italic display text with breathing room, without a generic tinted quote box. Body paragraphs remain sans serif for sustained reading, with 24px between paragraphs. The article body begins 48px below the byline on desktop and 36px on mobile. Never use a display flourish to rewrite the author's voice.

## Color and motion

| Token role | Use |
| --- | --- |
| `--page` / `--surface` | Mineral paper in Light; warm charcoal with pale reading ink in Dark. System follows the device. Original image colors are preserved; never invert or dim the media. |
| `--ink` / `--body` / `--muted` | Headings and controls, sustained reading, supporting text. |
| `--accent` | Strong blue for actual links and focus. Saturated artwork does not become a category color. |
| `--takeover` / `--takeover-ink` | Cobalt and light ink reserved for the full-screen menu. This is the main color event in the interface. |
| Feedback | Success and error colors appear only for real feedback. |
| Timing | Press 160ms, color/opacity 320ms, feedback 420ms, disclosures 560ms, object settling 860ms, page arrival 720ms with at most three 60ms stagger steps. The 1400ms logo assembly and 900ms/640ms menu wash retain their signature timing. Menu type arrives over 700ms, starting 36% into the wash; header/footer controls follow at 45%/55%. Menu content exits over 240ms. |
| Reduced motion | CSS removes animations, transitions and control displacement. `PageMotion` starts no animations and cancels active or waiting arrivals if the preference changes. The menu presents one ordinary scrollable set of links, without cyclic copies or perspective. The full article video always requires user playback. |

The menu scroll uses native browser momentum. Do not add wheel interception, constant autoplay, background drifting or a second animation library to recreate that behavior. Movement comes from the reader's input. On mobile, three rows fit the reel and its edge fade narrows to 8%, keeping the neighboring destinations readable above and below the centered link. Preserve the centered position when the viewport changes. Keyboard focus scrolls only the reel, never the outer dialog. An interrupted opening exits from the current circle transform and content opacity, without flashing to the completed state.

### Motion across a visit

Page arrivals use `--ease-arrival` for an immediate response with a short, soft finish. Text becomes sharp early; the final fraction only settles opacity. `--ease-settle` gives objects and controls a faster response with a soft finish; color uses `--ease-out`. The logo and wash keep their own established curves.

| Moment | Chosen behavior |
| --- | --- |
| Home mark | Preserve the six-piece blue-to-ink assembly and explicit replay. Hover briefly disassembles and reassembles the same six pieces over 960ms. No perpetual glitch or additional wobble. |
| New page | `PageMotion` sequences visible headings, bylines and utility-page introductions. Article body text is visible from first paint, so an opening paragraph never disappears while the next paragraph is already readable. Animated text resolves from 3px blur and 3px below; objects from 6px blur and 8px below. At 75% eased progress both are sharp, in their final position and 96% opaque. The last few percent settle without a lingering blur. Visible artwork decodes and fonts finish loading before the sequence starts. Only the first viewport participates in long reading pages. Both About paragraphs and its follow row can arrive once on entering the viewport. |
| Collection browsing | A native horizontal scroll shelf centers one object at a time. Neighboring objects keep a small tilt and scale down using the existing 860ms settling curve. Swipe, horizontal scroll, mouse drag and arrows all wrap in both directions. Five identical visual copies keep neighboring artwork present; after scrolling settles, the shelf recenters on the middle copy without a visual change. Only the primary copy participates in the accessibility tree and Tab order. Automatic advance waits 12 seconds per project, continues through the last-to-first boundary, pauses on hover, while offscreen, in a hidden tab or behind the menu, and stops on manual input or keyboard focus. Reduced motion disables automatic advance and animated scrolling. |
| Returning / filtering | History restores fully visible content and the original scroll position. Index filters update without replaying rows. Cancelling a visit or entering the back-forward cache clears unfinished arrivals. |
| Switching Collection / Index (preserved, currently hidden) | Explicit grid/list clicks reuse the theme switch's native view snapshots. The selection circle travels between stationary icons over the existing 420ms feedback duration and settling curve. Outgoing content fades over 160ms; incoming content uses the existing 3px rise and blur-to-sharp arrival over 420ms. Header and footer snapshots stay still; returning to Collection through the switch does not replay the logo assembly. Visible content skips the ordinary arrival to avoid a second blur. Off-screen objects retain their once-only scroll arrivals. Navigation begins after capture without waiting for an exit animation. |
| Object focus | Artwork lifts 10px, keeps a trace of its original angle, and expands 2.5%. The gallery label stays visible and stationary; its title and arrow change to blue. The link target stays still. Touch compresses just 1.5% over 160ms, then settles. No cursor tracking or parallax. |
| Menu trigger / wash | On desktop hover or keyboard focus, the three dots turn vertical to suggest the reel. The circle expands from that control. Type follows through a 24px rise; close freezes its current transform before fading, including an interrupted opening. |
| Menu scrolling | Keep native momentum, perspective and edge fades. No automatic scroll, snap interception or lagging spring applied to the scroll position. |
| Icon utilities | A circular surface expands underneath a stationary target. The glyph compresses slightly on press; labels arrive after a short dwell and leave promptly. The menu Close remains a bare X. |
| Index / directional links | Index titles change to blue on hover/focus; the active filter draws a short underline. Back, article-navigation and session-proof arrows stay fixed while their color or surrounding surface changes. Body links and legal links remain still. |
| Questions | The panel opens over 560ms and fades over 320ms; the plus turns with the opening. Closing panels remain inert. No bounce or collapsing text scale. |
| Copy / forms | A real confirmation, error or sending state gets one 420ms settle. Submit and booking buttons compress on press. No repeated pulse, spinner added for decoration, or shake on error. |
| Reading / media / footer | Article paragraphs, photos, code, video controls and footer stay still as the reader scrolls. No progress decoration, floating portrait, autoplay video, footer entrance or scroll-delayed prose. |

The theme preference is saved locally, applied to the page and browser chrome before body paint, and synchronized across tabs. Missing-page and runtime-error surfaces use the same palette; a replacement root restores the saved preference independently of the failed layout. The default follows live device changes until the visitor chooses light or dark. Storage failure must still allow switching for the current visit. A deliberate click reveals the new palette outward from the footer control over 720ms with a gentle acceleration and longer finish, using a circular reveal related to the menu; the sun and moon exchange through the shared 320/420ms icon timing. The origin is the button center, expressed as viewport percentages to preserve alignment when the snapshot’s pixel scale changes. Complete page snapshots retain text contrast through the reveal. Rapid clicks replace the active transition; reduced motion skips it, and older browsers still switch directly with the icon response. First paint, system updates and cross-tab changes do not run a page reveal.

Native Web Animations handle page arrivals; CSS handles controls and signatures. Keep values in `app/tokens.css`. JavaScript must read durations through `motionMilliseconds`: CSS optimization can return seconds even when the token was authored in milliseconds. The menu closes once, after its actual closing animation or a correctly converted fallback timer.

Article images reserve their intrinsic width and height before lazy loading. The shared Markdown renderer reads dimensions from local public assets, including SVGs, and refreshes that metadata when an asset changes. Keep these attributes when changing image presentation; a delayed download must not shift the following paragraphs. Portrait media receives its aspect ratio on the figure so the image and caption share a width: above 720px, the complete image fits within 72% of the viewport height, capped at 640px. Its explicit calculated width reserves the same space before loading. Never use two automatic dimensions or crop portrait ads to make them shorter. On phones the original full-width proportion remains. Image and video captions align with their media's left and right edges, including wider landscape figures and narrower portraits.

`MotionBootstrap` prepares the initial hidden state before body paint. Hydration replaces it with paused animation frames before releasing the guard. A missing or blocked script leaves static HTML visible; delayed hydration fails open after two seconds and never hides that visible page again. Font/image readiness has a separate 2.5-second limit. Failed assets still reveal their caption; timed-out or cancelled arrivals cannot restart when an old promise resolves. Reduced motion, fragment links and history loads skip the initial guard. Do not revive per-page `an-blur` classes, whole-page opacity wrappers or delayed link interception. Only the menu waits for its intentional exit.

## Components and states

| Component | Recipe / behavior |
| --- | --- |
| `SkipLink` | Hidden during pointer and touch browsing, including restored focus. Reveals only after Tab input and while focus-visible. Pointer input and blur clear the reveal state; the link still targets the main landmark. |
| `SiteHeader` | The real 47 mark and one three-dot trigger, identical across screen sizes. The centered `BrowseViews` control is temporarily hidden on Collection and Index through `SHOW_BROWSE_VIEWS` in `header.tsx`; its implementation and routes remain available. No empty video-preview control. |
| `BrowseViews` | Preserved for a possible return; currently hidden. A compact neutral capsule pairs the existing 22px Phosphor SquaresFour and List icons. Each is a real link with a 48px target, a descriptive accessible name, and a Collection or Index caption below on hover/focus. One shared circular selection surface and `aria-current` identify the current view. Hover/focus uses the shared surface expansion and blue accent; press uses the existing glyph compression. Keep it in the same header position on both pages, including filtered Index pages and phones. Modified clicks retain normal link behavior. Keyboard switching restores focus to the selected link; pointer switching does not add focus. |
| `NavigationTakeover` | Native modal dialog with a transparent shell. A separate solid circle scales from the trigger to the farthest viewport corner; do not animate a clip over the entire dialog or blur the repeated reel. Partial words dissolve through a stationary 18% edge mask at the top and bottom, suggesting continuation without a written scroll instruction. The current main destination is centered on opening and marked with `aria-current`, including filtered Index views. Pages without a matching menu destination start at Collection. Resize preserves the reader's current reel position. Reduced motion uses an unmasked ordinary list with enough end spacing to center any destination. Footer utilities are icons. Five visual copies support looping; only the central set is exposed to assistive technology and Tab navigation. All visible copies remain normal pointer links. |
| Menu keyboard behavior | Keyboard opening focuses Close; pointer opening focuses the dialog itself. Close is a bare X, with a short underline for keyboard focus instead of a circle. Tab remains inside the native dialog. Arrow keys move between the main links. Escape closes, restores the trigger and preserves page position. Navigating waits for the exit transition. Reduced motion closes immediately. |
| Tools | Product introductions at `/tools`, sourced from `lib/tools.ts`. The large italic page heading shares the Index scale. A compact original product logo, availability, description and destination links sit beside a wide, undistorted screenshot. On tablets and phones, the order is identity, preview, then details. Preview tabs use the same quiet underline as Index filters, with arrow-key, Home and End navigation. The full-size link opens the selected original screenshot in a new tab. Hosted destinations use the shared `DirectionCue`; source and build-story links stay secondary. Keep original image colors in both themes, with no perspective, added frame or shadow. Vellum uses its original outlined light/dark logo assets. Only available hosted, source and build-story links appear. |
| `Collection` | A short, personal introduction leads into a looping horizontal shelf with one centered object and glimpses of its neighbors. The active title, stationary arrow and subject align with the artwork's inset. One compact capsule groups previous and next; no position counter, progress strips or written browsing instructions. Inactive slides are inert after hydration; duplicate copies are hidden from assistive technology. Manual changes are announced, automatic changes are quiet. Native links and horizontal scrolling remain available without JavaScript. The original paired composition remains as `CollectionGrid`. |
| `PiecePage` | One notes/projects template with aligned serif headline and sans-serif body. Optional full video, installation and FAQs. The author’s name links to About beside a 44px portrait, with sentence-case date and reading metadata underneath. Installation follows the story. Original media remains documentary content; generated covers do not replace it. |
| `SharePopover` | A compact Share button beside the byline opens a right-aligned panel with Copy link, Copy page, X and LinkedIn. It uses the existing feedback timing and settle curve, with reduced motion respected. Selecting an action keeps the panel open so the copy button's checkmark and Copied state, or retry feedback, remain visible. Social links open in a new tab without dismissing the panel. Escape, outside click, the Share toggle, or focus moving to another control on the page close it; focus leaving the document does not. Escape restores focus to the trigger. Sharing appears only beside the byline. |
| `BrowseEntryLink` / `BackToBrowse` | Real Next links remember their source and restore the index/collection scroll and the selected collection object when returning. Restore the focused link only when the piece was opened with a keyboard or assistive technology; pointer/touch visits must not acquire a focus outline on return. Article headers use an ordered breadcrumb: a blue 20px Phosphor SquaresFour (Collection) or List (Index) return icon, a muted 12px Phosphor CaretRight separator, and a Notes or Projects category link. The icon has an accessible return label and native title. The current article title is included for assistive technology without visually duplicating the headline. Reading-end returns use a quiet 14px Instrument Sans “Back to collection” or “Back to index” label with a stationary 20px Phosphor ArrowLeft, distinct from the header breadcrumb. Direct arrivals return to Collection. All links retain 48px targets and align with the reading measure. |
| `Rows` | Spacious sans-serif titles with subordinate descriptions and compact type/date metadata. Filters stay in the URL. No row entrance replay on filtering. |
| `CopyButton` | One button implementation for text and icon variants, with the same 18px Phosphor glyph, 48px target, hover color and two-second feedback everywhere. Reports actual success/failure with a check or warning icon. Measurement fires only after successful copying. Installation and code blocks share their inset recipe. In fenced blocks, the copy glyph aligns with the first text line in a reserved right-hand column; long code scrolls within the text column and never runs underneath the button. `CodeCopyButtons` enhances fenced blocks with Copy prompt or Copy code, preserving line breaks and excluding UI labels. Static HTML and feeds retain readable code without inert buttons. |
| `Faq` | One answer open at a time. Buttons expose expanded state; closed panels are inert. Height/opacity settle gradually. |
| `Capture` | Shared capsule input/action. Idle, sending, accepted, unavailable and error states remain real. No fabricated success for an unconfigured service. |
| `ReadingEnd` | One related article under Read next, across notes and projects. Authored article links carry four points each and shared tags one; the shared inventory's story order breaks equal scores. Omit the link when no related piece exists and never link to the current article. Keep the label above its left-aligned title across the reading measure, with a separate 48px arrow column on the right. Use this same composition on phones. The whole entry is one link; title and arrow turn blue on hover/focus without displacement. One email invitation follows. Sharing stays grouped on the left with a 12px label gap. Copy, link and social actions use 18px Phosphor icons; the Copy page control keeps its width during feedback. |
| `DirectionCue` | A regular 20px right arrow inside a stationary 48px circular surface, used for related reading and session-proof links. The glyph stays in place while the surface changes to blue. Use --accent-ink on that fill so the arrow stays legible in both themes. The menu is text only, with no arrows beside its links. Never scale arrows with headline type. |
| `UtilityLink` | A 48px icon-only target with an accessible name and a compact label on hover/focus. Use the same Phosphor icon family as sharing and disclosures; do not add hand-drawn SVG alternatives. Work together uses a conversation icon; RSS uses its feed icon. Utility labels use Instrument Sans, never monospace. |
| `SocialLinks` | One shared pair of 20px X and GitHub icons, each inside a 48px target. Blue on paper; light ink on the cobalt menu. Accessible profile names and labels on hover/focus supply context without persistent text or outbound arrows. Menu social profiles sit at lower left, opposite contact and RSS. External links keep native navigation. |
| About follow row | One blue envelope and Occasional emails on the left; the shared icon-only X and GitHub links align to the right. Keep at least 24px between the two groups; all targets are 48px tall. Social profiles live here and in the menu, not in the footer. |
| `SiteFooter` | The canonical geometric mark at 28 × 14px inside a 48px link. Privacy, Terms and one unframed 18px theme icon sit opposite. One click changes between light and dark within a 48px native button. The sun or moon shows the current appearance; its accessible name and hover/focus label describe the next action. There is no menu or intermediate System click. Keep the footer in one row on phones, with wrapping only as a narrow-width fallback. The collection now includes the same footer. Contact remains in the menu; social profiles belong to About and the menu. No repeated name or wordmark. |
| `SessionPage` | One responsive offer panel and one body, with shared editorial headings, author portrait and direction cues. The offer moves above the body below 900px; phones retain the sticky booking action. No separate mobile biography or duplicated facts. |
| Author portrait | Use `AuthorPortrait`: the original square photograph, upright with a circular crop. No tilted postcard frame or tall crop. Keep it beside the related name or heading, not at the opposite edge: 44px byline, 56px newsletter/session, 80px About (64px on phones). |

## Collection composition

Use the same newest-first story order as Index, falling back to publication
when no story date is set. Preserve the source's date precision and use the
shared title/path tie-breaks. Cover metadata selects artwork and labels, never
display order. Article bylines and Index show the story date in the existing
month/year treatment; publication dates remain separate in feeds and metadata.

Center one object on a horizontally scrolling shelf. Keep the newest-first order
and use native scroll snapping; leave vertical page scrolling alone. The active
object is upright, while neighbors use the established four-degree tilt and a
smaller scale. A narrow edge fade suggests continuation. Keep original artwork,
lighting, title and subject. Slide width responds to desktop height as well as
width so the controls remain close to the object on shorter laptop screens.

The introduction is a centered Instrument Sans paragraph with Jackson's name
and the site's focus on AI experiments. His name links to About. There is no
visible headline; a screen-reader heading identifies the Collection. Leave 36px between the
paragraph and shelf, in addition to the artwork's own inset. A single neutral capsule
groups previous and next, each with a 48px target. The 12-second
automatic advance loops into the first piece without rewinding across the
shelf. Returning from a story restores the selected primary object, with
automatic movement stopped. There is no separate play/pause button: any manual
browsing or keyboard focus stops autoplay for the visit, and reduced motion
keeps it off from arrival. Resize preserves selection. Without JavaScript,
one ordinary set of real story links remains horizontally scrollable.

The former paired grid remains in `CollectionGrid` and `.collection-grid` for
reconsideration. The Index route and view-switch implementation are preserved;
`SHOW_BROWSE_VIEWS` controls their header visibility.

## Mobile composition

Keep the same horizontal shelf on phones, with a large centered object and
small glimpses of its neighbors. The introduction keeps a comfortable 350px measure.
The same compact control capsule keeps its 48px hit areas. Both directions
loop continuously, with no empty end of the shelf. Keep the title, arrow and subject beneath the object, using a
14px title and 12px subject. The image and label remain one link, with a slight
compression on touch. Native swiping selects another object; one tap opens it.

Use 24px reading gutters, 17px body text and shorter 24–48px intervals within articles. Keep the headline and prose aligned. Mobile index entries stack their title, description and inline metadata instead of squeezing a date column beside the text. Sharing controls remain grouped; article navigation keeps each arrow in a separate column.

The shared page fills at least the viewport height. The footer sits at the bottom on short pages and follows the content on longer pages, with its existing bottom spacing and safe-area inset. Its left and right edges use the same page gutters as the header, without the article's width cap.

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
5. Run `pnpm test:theme` for first paint, storage denial, OS changes and preference synchronization.
6. Run the server checks for canonical URLs, Markdown twins, RSS identity, search, sitemaps, media and retired-page 404s.

Changes stay local until explicitly published. A successful build alone does not establish visual or interaction quality.

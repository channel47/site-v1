# Design System: Channel 47

Channel 47 is a dark, signal-led product and publishing site for practitioner-built Claude plugins, guides, and build notes. The design should feel like premium operator tooling: quiet, precise, field-tested, and slightly mysterious. It is not a SaaS landing page, not a generic AI gradient site, and not a loud developer playground.

This document defines the target visual system for future work. It is based on the current site tokens in `src/styles/main.css`, the layout conventions in Astro components, and the strongest patterns from the other repo design docs: exact token roles, component-level recipes, motion rules, and clear non-negotiables.

## 1. Visual Theme & Atmosphere

Channel 47 lives in a warm black terminal environment. The canvas is not pure black and not blue-black. It is a smoked, brown-black field (`#0C0A09`) with warm gray rules and a single amber signal. The feeling should be closer to a private trading desk, night-shift control room, or well-worn field notebook for media buyers than to a consumer SaaS dashboard.

The interface is restrained, but not plain. Its premium quality comes from discipline: sparse pages, exact alignment, thin rules, slow reveal, high-contrast type, and one accent color used with intention. The site should feel expensive because every element has a job.

The signature visual idea is "signal in the void." Most surfaces sit in quiet dark neutrals. Amber appears as a small line, label, command, badge, focus ring, or CTA. Light surfaces are rare rupture moments: they invert the emotional register, create contrast, and make proof points land harder.

### Key Characteristics

- Dark-first warm black canvas, never cool navy or generic charcoal.
- Mono-first body language with display type reserved for major hierarchy.
- One dominant accent: amber signal (`#F59E0B`), used sparingly.
- Thin 1px rules, precise rows, command-line affordances, and measured spacing.
- Minimal radius (`2px`) for a technical, instrument-panel feel.
- No decorative cards around whole sections. Sections are bands, rows, or clean constrained layouts.
- Motion should feel like tuning, lock-in, scan, or signal acquisition, not bounce or spectacle.
- Light surface inversions are reserved for high-value proof, objections, or conversion pivots.
- Premium polish means less ornament, more confidence, more whitespace, and more exact states.

## 2. Color Palette & Roles

All colors should use the existing `@theme` tokens unless a new token is deliberately added to `src/styles/main.css`.

### Core Dark Scale

| Token | Hex | Role |
| --- | --- | --- |
| `--color-void` | `#0C0A09` | Page canvas, deepest backgrounds, dark section base |
| `--color-soot` | `#1C1917` | Inputs, elevated dark surfaces, subtle panel backgrounds |
| `--color-smoke` | `#292524` | Primary hairline borders and separators |
| `--color-ash` | `#44403C` | Stronger borders, inactive icons, structural dividers |
| `--color-stone` | `#78716C` | Muted labels, secondary nav text, attribution |
| `--color-dust` | `#A8A29E` | Long-form secondary copy and readable muted text |
| `--color-bone` | `#E7E5E4` | Primary body text on dark surfaces |
| `--color-chalk` | `#F5F0EB` | Highest emphasis headings and key text |

### Light Inversion Scale

| Token | Hex | Role |
| --- | --- | --- |
| `--color-canvas` | `#FAF7F2` | Full-width rupture sections only |
| `--color-paper` | `#F0EBE3` | Secondary light panels, if needed |
| `--color-ink` | `#1C1917` | Text on light surfaces |
| `--color-light-border` | `#D6D3CD` | Rules and borders on light surfaces |

### Signal Accent

| Token | Hex | Role |
| --- | --- | --- |
| `--color-signal` | `#F59E0B` | Primary accent, CTAs, labels, active states, bars |
| `--color-signal-hover` | `#FBBF24` | CTA hover and stronger interactive emphasis |
| `--color-signal-dim` | `#B45309` | Darker amber text on light surfaces |
| `--color-signal-wash` | `#451A03` | Deep amber wash for tiny dark accents only |
| `--signal-dim-alpha` | `rgba(245, 158, 11, 0.12)` | Low-intensity accent backgrounds and focus glow |

### Semantic States

| Token | Hex | Role |
| --- | --- | --- |
| `--color-success` | `#22c55e` | Email success, completed states |
| `--color-destructive` | `#ef4444` | Form validation, failed states |

### Color Rules

- Amber is a signal, not decoration. Do not use it as a broad page background.
- Never introduce purple, blue-purple gradients, beige-heavy themes, or cold blue dark palettes.
- Dark surfaces should layer through the warm gray scale, not shadows.
- Light sections must be rare. One light rupture per page is often enough.
- Borders should usually be `smoke`; use `ash` when the component needs stronger structure.
- Body text must never drop below `stone` for meaningful copy. `ash` is for decorative or disabled details only.

## 3. Typography

### Font Families

| Role | Token | Stack | Usage |
| --- | --- | --- | --- |
| Mono | `--font-family-mono` | JetBrains Mono, SF Mono, Cascadia Code, monospace | Body, labels, commands, nav, rows, inputs |
| Display | `--font-family-display` | Space Grotesk, Inter, system-ui, sans-serif | Hero and section headlines |
| Serif | `--font-family-serif` | Source Serif 4, Georgia, serif | Editorial pull quotes or rare long-form emphasis |

### Type Scale

| Role | Family | Size | Weight | Line Height | Letter Spacing | Color |
| --- | --- | --- | --- | --- | --- | --- |
| Hero Headline | Display | `clamp(3rem, 8vw, 6.5rem)` | 700 | 1.0 | `-0.04em` | `chalk` |
| Compact Hero Headline | Display | `clamp(2.75rem, 7vw, 5.5rem)` | 700 | 1.0 | `-0.04em` | `chalk` |
| Section Headline | Display | `clamp(1.75rem, 4vw, 2.5rem)` | 600 | 1.1 | `-0.02em` | `chalk` |
| Article Heading | Display | `clamp(2.25rem, 6vw, 4rem)` | 700 | 1.05 | `-0.03em` | `chalk` |
| Body | Mono | `14px` | 400 | 1.6 | `0.02em` | `bone` |
| Body Large | Mono | `15px` | 400 | 1.7 | `0.02em` | `dust` |
| Label | Mono | `11px` | 500 | 1.2 | `0.15em` | `signal` |
| Button | Mono | `11px-12px` | 600 | 1 | `0.1em-0.12em` | contextual |
| Row Title | Mono | `13px-14px` | 500 | 1.4 | `0.02em` | `bone` |
| Row Description | Mono | `14px` | 400 | 1.7 | `0.02em` | `dust` |
| Meta | Mono | `10px-11px` | 500 | 1.2 | `0.12em-0.15em` | `stone` |

### Typography Rules

- Mono is the default voice. It creates the "operator console" character.
- Display type is for major hierarchy only. Do not use it for labels, nav, metadata, inputs, or rows.
- Labels, nav, badges, and buttons are uppercase with positive tracking.
- Body copy is sentence case. Do not uppercase paragraphs.
- Do not scale fonts directly with viewport width outside controlled `clamp()` values.
- Letter spacing should be deliberate and never negative on body or mono text.
- Long-form article prose may use the serif face sparingly for pull quotes, but the core article body should stay readable and consistent with existing prose styles.
- If a line feels too clever, make it more direct. The typography should carry confidence, not hype.

## 4. Layout System

### Widths

- Standard content: `.wrap` = `max-width: 1060px`, centered, responsive side padding.
- Narrow content: `.wrap-narrow` = `max-width: 672px`, centered, responsive side padding.
- Article content should favor narrow measures unless it contains a directory, code block, or comparison table.

### Density Rhythm

Pages should alternate density intentionally:

1. Low density: hero or page introduction.
2. High density: directory rows, proof list, guide list, or command details.
3. Low density: rupture, proof, or objection breaker.
4. Medium density: signup, CTA, or next step.

Avoid stacking multiple high-density sections without a quiet break.

### Section Rules

- Sections are full-width bands or unframed constrained layouts.
- Do not wrap a whole section in a decorative card.
- Use rules, spacing, and surface changes to separate sections.
- Use light rupture sections only for proof, contrast, or important conversion pivots.
- Hero sections should start the actual experience. Do not add marketing filler before useful content.

### Grid And Rows

- Directories use row-based lists, not card grids by default.
- Rows should feel like an index: index number, name, description, badge, type.
- Use `border-bottom: 1px solid var(--color-smoke)` and a first-row top border.
- On hover, prefer a tiny amber side rule or low-opacity amber wash over large background fills.

## 5. Component Recipes

### Buttons

#### Primary Signal Button

Use for the main conversion action.

```css
display: inline-flex;
align-items: center;
justify-content: center;
height: 48px;
padding: 0 32px;
font-family: var(--font-family-mono);
font-size: 12px;
font-weight: 600;
text-transform: uppercase;
letter-spacing: 0.12em;
color: var(--color-void);
background: var(--color-signal);
border: none;
border-radius: var(--radius-tight);
transition:
  background var(--dur-quick) var(--ease-out),
  box-shadow var(--dur-quick) var(--ease-out),
  transform var(--dur-instant) var(--ease-sharp);
```

Hover:

- Background: `var(--color-signal-hover)`
- Shadow: `0 4px 20px rgba(245, 158, 11, 0.3)`
- Transform: `translateY(-1px)`

#### Text Command Button

Use for "Copy", install commands, and utility actions.

- Background: none.
- Border: none unless the button needs a visible hit area.
- Text: signal amber, mono, uppercase, 10px-11px.
- Hover: signal-hover.
- Focus: 2px amber outline.

### Inputs And Signup Forms

Inputs are technical controls, not soft marketing fields.

- Background: `soot` or transparent in attached inline forms.
- Border: `1px solid smoke` or `ash` for higher contrast.
- Radius: `var(--radius-tight)`.
- Height: 48px default, 52px for prominent signup.
- Font: mono, 16px to prevent iOS zoom.
- Focus: amber border, void background, subtle amber glow.
- Error: destructive border with short shake or pulse.
- Success: success border and icon state.

Attached input/button rows should split radius: input left corners, button right corners.

### Directory Rows

Directory rows are the core reusable product-listing pattern.

- First row gets a top border.
- Each row gets a bottom border.
- Layout: index column, main content, metadata/badge area.
- Hover: very subtle amber wash plus optional 2px vertical signal rule.
- Badge states:
  - Live: signal fill, void text.
  - Dev: ash border, dust text.
  - Soon: smoke border, stone text.
- Descriptions can clamp on mobile, but full text should breathe on desktop.

### Nav

The nav should feel like persistent glass over the void, not a heavy app shell.

- Fixed top, full width.
- Background: `bg-void/70`.
- Backdrop blur around 12px.
- Logo left, links right.
- Desktop links are uppercase mono, 11px, `stone`, signal on hover.
- Mobile menu uses a simple two-line burger and a rule-separated vertical panel.
- Keep the nav quiet. It should not compete with the hero.

### Footer

The footer is a low-volume terminal footer.

- Top border: `smoke`.
- Link text: mono, 12px, `stone`.
- Hover: signal.
- Attribution must say `ctrlswing`, not `jackson`.
- Avoid large newsletter or social blocks in the footer unless a page lacks a better conversion moment.

### Article And Guide Cards

Content cards should feel editorial but still native to the console system.

- Prefer rules and row rhythm over elevated cards.
- Titles can use display type.
- Metadata stays mono and uppercase.
- Hover may shift title to signal, but do not flood the whole card with amber.
- Use Source Serif only for rare article quote moments, never as a broad brand pivot.

### Rupture Sections

Ruptures are high-value contrast moments.

- Background: `canvas`.
- Text: `ink`.
- Accent: vertical amber bar or small label.
- Copy should be specific: numbers, proof, consequences, or practitioner insight.
- Do not put generic CTAs in rupture sections. Make the CTA contextual.

## 6. Motion & Interaction

Motion should suggest signal acquisition.

### Timing

| Token | Value | Usage |
| --- | --- | --- |
| `--dur-instant` | `100ms` | Button press, small hover states |
| `--dur-quick` | `200ms` | Input focus, link color, menu states |
| `--dur-measured` | `400ms` | Reveals, row entrance, card transitions |
| `--ease-out` | `cubic-bezier(0.16, 1, 0.3, 1)` | Reveals and soft movement |
| `--ease-sharp` | `cubic-bezier(0.33, 1, 0.68, 1)` | Snappy UI response |

### Allowed Motion Patterns

- Fade up on entrance.
- Clip reveal for large headlines.
- Horizontal or vertical amber line draw.
- Subtle row background fade.
- Logo character scramble and lock-in.
- Loading spinner or icon swap in forms.

### Motion Rules

- Respect `prefers-reduced-motion`.
- Never use springy, bouncy, elastic, or playful easing.
- Do not animate layout dimensions in ways that shift content.
- Stagger list reveals, but cap the perceived delay. Six stagger steps is enough.
- Functional state changes must be fast. Editorial reveals can be measured.

## 7. Copy And Content Design

Channel 47 copy should sound like an experienced operator showing the work.

### Voice

- Specific over grand.
- Field-tested over visionary.
- Calm over excited.
- Direct over clever.
- Practitioner language over platform jargon.

### Vocabulary Rules

Follow the product marketing context vocabulary:

- External copy says "workflow" instead of "skill" when describing user-facing value.
- External copy says "account connection" instead of "MCP server".
- Do not use "tool calls", "stdio", "GAQL", or "API" in marketing copy.
- Install commands may use exact CLI syntax.
- Proof points should vary by page. Do not overuse the same `$3K` waste stat.

### CTA Rules

- CTAs should name the next useful action.
- Avoid generic "Learn more" when a specific action exists.
- Use install commands where relevant. They are part of the product experience.
- Newsletter CTAs should mention Build Notes when that is the actual destination.

## 8. Accessibility And Usability

- All interactive elements need visible focus states.
- Focus rings should use signal amber and enough offset to clear borders.
- Text contrast must remain high on both dark and light surfaces.
- Do not rely on amber alone to communicate status.
- Hit targets should be at least 44px tall for nav, menu, buttons, and touch controls.
- Inputs need labels, even when visually hidden.
- The mobile menu must maintain `aria-expanded`, `aria-controls`, and `hidden` correctly.
- Respect `prefers-reduced-motion`.
- Do not hide essential content behind scroll reveal if JavaScript fails.

## 9. Implementation Rules

- Source of truth for tokens is `src/styles/main.css`.
- Add tokens before adding one-off hex values.
- Prefer shared component classes in `@layer components` for cross-page patterns.
- Use scoped component styles for component-specific behavior and animation.
- Use `:global()` only when a scoped component must respond to an ancestor state.
- Prefer `[data-*]` selectors for JavaScript hooks.
- Guard client initializers with `data-initialized`.
- Astro components should keep markup direct and readable.
- React should remain limited to cases that need it, such as shadcn/ui compatibility.
- Do not add a new design dependency for a one-off effect.

## 10. Premium Polish Checklist

Before shipping a visual change, check:

- The page still feels warm black, amber signal, and mono-first.
- Amber appears only where attention or action is needed.
- Borders, rows, and spacing line up precisely.
- No section is trapped inside a decorative card.
- Buttons and controls use `2px` radius or less unless a component has a functional reason.
- Mobile text fits without overflow or viewport-width font scaling.
- Hover states are calm and useful.
- Focus states are visible.
- Motion respects reduced-motion preferences.
- User-facing copy avoids internal jargon and generic AI hype.

## 11. Anti-Patterns

Do not introduce:

- Purple, blue-purple, beige, tan, brown-orange, or cold slate-blue themes.
- Gradient orb backgrounds, bokeh blobs, or decorative glows.
- Rounded SaaS cards with big shadows.
- Hero sections that look like marketing templates.
- Generic AI sparkle effects.
- Dense icon systems where text would be clearer.
- Multiple accent colors competing with amber.
- Large amber backgrounds except for small buttons or badges.
- Cards inside cards.
- Copy that explains the interface instead of giving the user a useful next step.

## 12. North Star

Channel 47 should feel like a premium command center for people who actually manage accounts. The design earns trust by being exact, calm, and specific. Every page should look like it was built by someone who knows where the waste is hiding, not by someone trying to impress other designers.

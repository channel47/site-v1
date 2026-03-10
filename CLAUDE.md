# Channel 47 Site

Astro 5 → channel47.dev via Vercel. Single-page landing with hero card and email capture.

## What Exists

- `src/pages/index.astro` — hero card landing page (dark card on cream, 2-column grid, email capture)
- `src/pages/api/subscribe.ts` — Kit email subscription endpoint (server-side, requires `KIT_API_KEY`)
- `src/components/EmailSignup.astro` — reusable email form (inline, default, prominent variants)
- `src/components/LogoAnimated.astro` — animated "47" logo with scramble → lock-in effect
- `src/layouts/BaseLayout.astro` — HTML shell (meta, fonts, structured data, scroll reveal)
- `src/styles/main.css` — design system (tokens, component CSS, keyframes, scroll reveal)
- `src/scripts/scroll-reveal.ts` — IntersectionObserver: `[data-reveal]`, `[data-reveal-stagger]`, `[data-counter]`
- `src/scripts/nav-scroll.ts` — hide/show nav on scroll (targets `[data-nav]`, ready for Nav component)

## Design System (main.css)

- Light-first. Body + Headlines: Geist. Mono: Geist Mono. Accent: amber `#fcaa2d`.
- Warm gray neutrals (not pure gray). `--color-bg: #fffef2`.
- Dark panel surface: `--color-panel: #18181a` with rgba white overlay scale:
  - `--color-panel-fg` (0.85), `--color-panel-fg-muted` (0.6), `--color-panel-fg-dim` (0.5)
  - `--color-panel-dim` (0.35), `--color-panel-tint` (0.05), `--color-panel-tint-hover` (0.08)
  - `--color-panel-divider` (0.10), `--color-panel-border` (0.15)
- Light surface tokens: `--color-fg`, `--color-fg-muted`, `--color-fg-dim`, `--color-border`, `--color-surface`, `--color-surface-raised`
- Component patterns in `@layer components`:
  - `.btn` (--primary, --secondary, --ghost) + sizes (--sm, --lg)
  - `.badge` (--default, --primary, --success, --destructive)
  - `.card` (default + --flat)
  - `.label` (+ --muted)
  - `.code` (inline), `.code-block` (+ `__header`)
  - `.divider` (+ --panel)
  - `.email-signup`, `.email-form` (inline), `.email-signup--default`, `.email-signup--prominent`
- Scroll reveal: `[data-reveal]`, `[data-reveal-child]`, `[data-reveal-stagger]`, `[data-stagger="1-4"]`
- Brand reference page: `/brand` (noindex, excluded from sitemap)

## Commands

```bash
npm run dev      # localhost:4321+
npm run build
npm run preview
```

## Environment

`KIT_API_KEY` for subscribe endpoint.

## Conventions

- Guard double-init with `data-initialized` attribute
- State classes: `.is-visible`, `.is-loading`, `.is-success`, `.is-error`
- `[data-*]` attributes for JS targeting
- Footer attribution: `ctrlswing`, not `jackson`
- Email framing: "Join the community", not "Subscribe to the newsletter"
- No MCP, no PaidBrief, no "tool calls" or "API" in user-facing copy
- Use design tokens — no hardcoded rgba values in page-level CSS
- Use `:focus-visible` (not `:focus`) for keyboard focus indicators

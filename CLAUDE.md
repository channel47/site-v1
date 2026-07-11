# channel47 site

Marketing site at channel47.dev. Next.js 16 (App Router) + plain CSS — no framework,
no Tailwind. Content is markdown read at build time. Deployed on Vercel. Uses pnpm.

## Structure

```
app/             # routes; globals.css holds ALL styles + design tokens
components/      # site/ (shared chrome) and landing/
content/         # markdown content — read content/README.md before authoring
lib/content.ts   # build-time markdown loader + marked config (renderer hooks live here)
public/          # static assets; screenshots for posts go in public/posts/
```

## Commands

```bash
pnpm dev
pnpm build
pnpm typecheck
pnpm check:seo-surfaces
```

## Design rules

- Tokens and patterns in `app/globals.css` are transcribed from a locked design file —
  read its header comment before touching styles. Hard edges everywhere (no
  border-radius), content-type colour only on hover/press/selection, never at rest.
- Light/dark tokens are deliberately declared three times (`:root`, OS-dark media
  query, explicit `[data-theme]`) — a new token must be added to all three blocks.
- Brand name is lowercase `channel47` everywhere.

## Gotchas

- Markdown images render as framed figures ("framed stills"): `marked.use()` in
  `lib/content.ts` + `.st-shot*` in `globals.css`. The screenshot PNG must carry its
  own rounded corners on transparency — the CSS adds no radius and supplies the shadow.
  Authoring workflow is in `content/README.md`.
- `marked.use()` mutates the shared marked instance for all three parse sites
  (posts, assets, workshops) — renderer changes affect every content type.

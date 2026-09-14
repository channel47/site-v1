# Product gallery release recovery

Recovered on 2026-09-14 from the staged working tree on
`codex/product-gallery-article`, based on `8fcd745` (`origin/main`). The file
names and changes match the owner's screenshot of the interrupted task.

The saved work includes the article, seven-image gallery, storefront review
capture, public workflow source and download, internal release skill, and
sharing drafts. The implementation was already present when recovery began;
this recovery completed verification and saved a local Git checkpoint.

## Review and resume

- Article: `content/notes/product-gallery-codex.md`.
- Public workflow: `workflows/make-product-galleries/`.
- Download: `public/downloads/make-product-galleries-v1.zip`.
- Source evidence summary: `docs/content/product-gallery-source-notes.md`.
- Media provenance: `docs/content/product-gallery-media.json`.
- Prepared sharing text: `output/sharing/notes/product-gallery-codex/` (ignored).
- Preview: `http://127.0.0.1:3174/notes/product-gallery-codex` while the local
  server is running. Restart with `pnpm dev --hostname 127.0.0.1 --port 3174`.

The original publication task could not be retrieved from this host's task
list. The configured connection to the other machine failed authentication,
so its last conversation and publication authorization remain unverified.
The existing editorial source notes were preserved without claiming a new
independent review of that conversation. The precise cause of the interruption
is unknown.

## Verification completed

- TypeScript, SEO surfaces, production build, content model, measurement,
  motion, browse transitions, and theme checks passed.
- `scripts/check-content-surfaces.py` passed against the running site,
  including all eight canonical pages, Markdown, search, feeds, sitemaps,
  social previews, media, redirects, and retired routes.
- Browser review at 1440px desktop and 390px mobile: all seven gallery
  selections loaded; arrow-key and End navigation selected the correct
  panels; mobile had no horizontal overflow and gallery tabs were 48px tall.
- Reviewed the gallery, reading layout, and mobile download section in light
  and dark themes. Browser evidence is in ignored `output/recovery-*.png`.
- The actual browser download matched the packaged ZIP byte for byte.
  Its SHA-256 and four files matched both the canonical workflow source and
  the readable public copies.
- The copy-prompt control successfully wrote the exact prompt through the
  browser's native clipboard API. Clipboard reading was unavailable in the
  test browser; verification observed the successful native write.
- Packaging was exercised in a temporary directory: only the four allowlisted
  files shipped, stale ZIP entries were removed on rebuild, and invalid
  workflow names were rejected.
- No uncaught page errors were reported. The Vercel analytics script returned
  its expected local-preview 404; production analytics was not exercised.

No remote branch or matching pull request existed at recovery time. This
checkpoint is local; publication and sending the prepared sharing material
remain separate actions.

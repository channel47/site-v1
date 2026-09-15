# Vellum editorial notes

Published September 10, 2026 at `/projects/vellum`. The canonical article is `content/projects/vellum.md`. Rewritten locally September 14 around the missing direct-generation option and the documented X-All session. The three source screenshots remain in place. Jackson chose a direct invitation to try the app for the closing CTA, replacing the generic product brief. His interest in open sourcing is tentative and is described as something he is considering, not as an available repository or commitment. Nothing has been published from this rewrite.

- Add one completed X-All example with the original references, a few consequential iterations, and the final asset in its actual page placement. Identify which work came from Vellum; do not attribute every image on X-All to it.
- Add a specific Flow failure alongside its input and output if it helps explain a Vellum decision. The ignored-edit example comes from Jackson's published Flow/Codex account; it does not establish the technical cause.
- Ask Jackson what Vellum improved in practice and what remains frustrating. The current article describes motivation and functionality, not demonstrated quality, time, cost, or consistency gains.
- The supplied grid, agent conversation, and image-viewer screenshots are placed in the article. Capture Subjects and Placements when they contain useful work to show. Keep unfinished visual placeholders out of the article.
- Published screenshots live in `public/posts/vellum/`. The alternate grid capture remains in `docs/content/assets/vellum/2026-09-10/`. Original PNGs are preserved locally under ignored `output/vellum-sources/2026-09-10/` and in the supplied Desktop files.
- Update external-agent access only when its actual scope is known. The proposed agent interface is not described as shipped; Vellum already has an internal application API.

### Source basis

Jackson's account in the Channel47 task on September 10, 2026 supplies the origin, Flow experience, design preferences, X-All status, and proposed external-agent access. His published `content/notes/codex-static-ads-google-flow.md` supplies the account of Flow sometimes ignoring requested edits. The **Restore direct render flow** task supplies the decision to bring direct generation back. Vellum's current README, under **From generation to delivery**, and `packages/shared/src/schema.ts` support the descriptions of modes, subjects, and placements.

Jackson's September 10 screenshots supply the visible X-All board and the Glass Wipes exchange. Statements from the embedded agent are attributed to that conversation; its product interpretation, completion counts, and proposed before/after imagery are not independent evidence of product performance. No completed Shopify placement or original input reference is supplied by these screenshots.

The article deliberately makes no categorical claim that Flow has no API. On September 10, 2026, a search of Google's public documentation found its [embedded agent](https://support.google.com/flow/answer/17093911) and [project and asset controls](https://support.google.com/flow/answer/16935308?hl=en), but no documented public API or MCP interface for external agents to query that workspace. Google's [generation API](https://ai.google.dev/gemini-api/docs/veo) is a separate capability. Recheck before making a comparison in the published piece.

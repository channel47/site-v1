---
name: channel47-release
description: Turn a completed Codex workflow and its actual artifacts into a Channel47 article, selected media, a reusable skill download, and a verified publication preview.
---

# Channel47 release

Package useful work as a readable first-person story and a reproducible workflow. Honor the user's requested deliverables and publishing scope. Use actual evidence; do not infer results from polished outputs.

## Locate the work and the site

Use the source conversation's available context and inspect its selected artifacts. If another task is the source, retrieve its visible conversation and outputs through available tools. Read it without interrupting or steering it. Record a cutoff when work is ongoing; distinguish completed actions from plans and requests. Filter retrieval to relevant text and files rather than replaying large binary tool payloads.

Find the channel47 site checkout from the supplied project or machine-specific `CHANNEL47_SITE_DIR` setting. Read its `README.md`, applicable instructions, `content/VOICE.md`, and `content/README.md`. The voice brief outranks assumptions inferred from existing articles. Read the design and discovery guides only for affected surfaces.

If source and site are on different hosts, first create a portable handoff with selected files, relative references, source facts, uncertainties, and output hashes. Use configured authorized transfer access; do not assume a reverse SSH connection. Preserve the package for retry and use its stable release ID to avoid duplicates. Missing access should not prevent independent drafting, but must not be reported as a completed handoff.

## Extract and shape

Identify what the owner wanted, why they tried it, the decisions or corrections that changed the work, what actually happened, and what remains unknown. Exclude private account data, secrets, raw internal policies, irrelevant conversation, and assets unsuitable for redistribution.

Choose the story's shape from those facts. Give a new reader enough context. Develop the moments that changed expectations before stating their meaning. Vary sentence and paragraph length; remove repeated explanations, generic lessons, and unsupported feelings. Read the draft aloud or perform a deliberate sentence-by-sentence rhythm pass.

Choose media that answers a reader's question. Preserve real screenshots and original outputs; distinguish illustrations from observations. Put visual breaks where they support the story, not at mechanical word-count intervals. Prefer existing article components and media conventions. Keep important information in readable text.

## Make it usable

Generalize the useful process into an original `SKILL.md` with honest requirements, source handling, workflow decisions, review criteria, and deliverables. Keep the project example out of general defaults. Use the available skill-authoring guidance. Document whether behavioral validation extends beyond the original example.

Provide a working download and a starter prompt with clear setup instructions. Reuse the site's allowlisted workflow packaging script where available. A hosted-demo CTA appears only when a working authorized integration exists and has been tested. A downloadable skill is a complete usable path when hosted execution is outside scope or unavailable.

Keep the internal publication skill separate from the public task skill. Store canonical public skill source in `workflows/`; put only deliberately packaged assets in `public/downloads/`.

## Prepare and verify the release

Use the site's normal content collection, metadata, related links, media, and share preparation. Preserve source and editorial notes outside the public page. Keep drafts out of deployed content until publication is authorized; a local branch can contain the proposed publication for review.

Check the narrative against the evidence and the packaged skill against the actual workflow. Run relevant repository checks and the required pre-release suite. Verify the rendered article at mobile and desktop widths, every media item and CTA, keyboard interactions, downloads, prompt copying, social preview, and discovery surfaces. Test newly added packaging scripts and inspect the archive contents.

Prepare sharing material through the site's existing script. Sending messages or emails requires explicit authorization. Use the available publishing authorization without asking again; otherwise finish the local preview and all independent validation before identifying the final publishing action.

Return the article/preview, skill download, changed files, validation results, and any precise remaining publication step. Do not claim hosted generation, deployment, or conversion improvements that did not happen.

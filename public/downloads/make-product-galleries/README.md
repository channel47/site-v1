# Make product galleries

A reusable workflow for product gallery artwork, extracted from Channel47's X-All gallery experiment.

## Use it

Unzip this folder and ask your agent to install its `SKILL.md` as a personal skill. In Codex, start a new task after installation and invoke `$make-product-galleries` with your product assets and brief. Alternatively, attach `SKILL.md` directly and ask an image-capable agent to follow it.

You need your own product photograph, verified product facts, and access to image generation or editing. A visual reference is useful but optional. The skill itself is instructions, not an image generator or a hosted service. Model usage is provided by your agent environment.

Start with:

```text
Use $make-product-galleries to create a gallery for the attached product. Treat my packshot as the appearance reference and my supplied facts as the factual source. Review the visual reference, propose a sequence, establish a direction with one image, then generate and review the set. Prepare local files for review.
```

Use `brief.md` if you want help gathering inputs. Do not copy the X-All example's product claims into another product's gallery.

## What's included

- `SKILL.md`: the reusable workflow.
- `brief.md`: an optional blank product brief.
- `README.md`: setup and requirements.
- `LICENSE`: permission to reuse these authored instructions.

This version was extracted from one worked product-gallery session and reviewed against its recorded corrections. It has not been demonstrated across a broad product benchmark. The download includes no third-party skill code, private source conversations, or X-All artwork.

Version: 1.0.0. Companion article: https://channel47.dev/notes/product-gallery-codex

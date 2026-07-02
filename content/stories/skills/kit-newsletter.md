---
title: "The Newsletter I Send Without Opening a Dashboard"
slug: kit-newsletter
description: "Drafting, scheduling, and checking Kit broadcasts from the terminal — how the kit-newsletter skill removed the friction between writing and sending."
type: story
category: skills
asset:
  name: kit-newsletter
  type: skill
  repo: https://github.com/channel47/skills/tree/main/skills/distribution/kit-newsletter
  install: npx skills add channel47/skills --skill kit-newsletter
author: Jackson Dean
date: 2026-07-02
tags: [newsletter, kit, convertkit, email, distribution]
---

My newsletter workflow used to have a seam in it, and the seam is where issues went to die.

Writing happened in one place — my editor, usually right after finishing whatever build the
issue was about, when the details were still hot. Sending happened somewhere else entirely:
log into Kit, new broadcast, paste, watch the formatting break, fix the formatting, hunt
for the right template, second-guess the subject line in a UI clearly designed for someone
else's workflow. Twenty minutes of friction, minimum.

Twenty minutes doesn't sound like a killer. But friction compounds at the worst boundary —
the one between "written" and "sent." I had finished drafts that aged a week in that gap.
An issue about something timely, sent late, is a different and worse issue.

The `kit-newsletter` skill closed the seam. It bundles a small Python CLI around Kit's V4
API — stdlib only, nothing to install — and teaches the agent every operation I'd otherwise
click through. Now the send happens in the same conversation as the writing:

> "Draft this week's issue from the notes above, subject 'The $1,400 keyword',
> and stage it in Kit."

The agent writes the issue, converts it to email-safe HTML — simple tags, no div soup,
because Kit's template handles the outer styling — shows me the content for review, and
creates the broadcast:

```bash
python3 scripts/kit-api.py broadcasts create \
  --subject "The \$1,400 keyword" \
  --content "$(cat /tmp/issue.html)" \
  --preview "What eleven quiet days of broad match cost"
```

The design decision I appreciate most is the default: **that creates a draft.** Nothing
sends. The skill only schedules a broadcast when I explicitly ask for a send time, and even
then it confirms the date with me first, because a scheduled broadcast *will* go out. An
automation that touches thousands of inboxes should have exactly this posture — eager to
stage, reluctant to fire.

The rest of Kit is reachable the same way, which turned out to matter more than I expected:

- **Subscriber operations** — look someone up, add them with tags, and it upserts rather
  than duplicating if they already exist.
- **Tags** — list, create, apply. Segmentation stops being a chore you save up.
- **Sequences** — drop a subscriber into a drip series from the same conversation where
  you decided they belonged there.
- **Stats** — `broadcasts stats` pulls open and click numbers, so "how did last week's
  issue do?" is a question, not a login.

There's an operational honesty to the skill I want to call out because it's the difference
between a demo and a tool: it knows Kit's rate limit is 120 requests per rolling minute and
tells the agent to space out bulk work like mass-tagging. It knows list endpoints paginate
at 50 and how to cursor through. It knows a 401 means the key is bad and a 429 means back
off. The failure modes are documented, so the agent handles them instead of improvising.

Setup is one environment variable — `KIT_API_KEY`, from Kit's developer settings — and the
first command in any session is an account check to confirm auth before anything else runs.

My issues go out the day they're written now. The seam is gone, and it turns out the seam
was the whole problem.

## Grab it

```
npx skills add channel47/skills --skill kit-newsletter
```

Pairs beautifully with [content-miner](https://github.com/channel47/skills/tree/main/skills/distribution/content-miner):
one skill surfaces the issue from your week, the other stages it in Kit — same
conversation, no dashboard.

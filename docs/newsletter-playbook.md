# Channel47 newsletter playbook

This is the operating brief for Channel47 broadcasts in Kit. The newsletter is
the distribution layer for work already being built and published, not a
separate content machine.

## Subscriber promise

> Occasional emails with new projects, experiments, and notes. No fixed schedule.

Every email should stand on its own. A reader should get the useful idea without
clicking. Links are for screenshots, full prompts, diagrams, downloadable
assets, related tools, and updates that deepen the email.

## When to send

Send when there is one useful idea with real first-hand evidence behind it.
Good triggers include:

- a system that shipped or changed materially
- a recurring workflow that became easier
- an implementation decision worth reusing
- a failure that changed the approach
- a project, experiment, or note worth sharing, even while unfinished
- a reader workflow breakdown shared with permission

There is no required weekly cadence. One worthwhile email beats a roundup sent
to satisfy a schedule.

## Writing and format

Use the [site’s voice brief](../content/VOICE.md) for all newsletter writing.
Keep each broadcast to one topic with one primary link; additional links
should support the same topic. Let the material determine its structure.

Keep HTML email-safe: paragraphs, headings, links, emphasis, short lists,
and occasional blockquotes or images.

## Kit template brief

Use the Kit HTML template named `ch47-v2`, sourced from
`newsletter/channel47-wrapper.html`. The email should feel related to the
current site without reproducing the web interface inside an inbox.

- Mostly editorial, single-column layout
- Approximately 600px maximum content width
- Off-white background (`#fdfdfc`) and near-black ink (`#161718`)
- System sans-serif type with a comfortable reading size and line height
- Small, hard-edged 47 mark on a transparent background with a subtle light
  keyline; the current template uses the static, versioned PNG
- Underlined text links; use color sparingly rather than assigning a content
  type color to every issue
- Hard edges and minimal decoration
- Quiet sender and unsubscribe footer supplied by Kit
- Responsive on mobile without relying on complex CSS

Template design belongs in Kit. Broadcast content should remain simple enough
to survive a future template change without being rewritten.

## Draft-to-send workflow

For an existing published piece, `pnpm share:pack /notes/SLUG` prepares local
sharing text, an existing image reference, and an email starter using its
opening paragraphs. It also supplies tagged links using the piece's slug as
the campaign. Review and edit the starter as needed; it has not been posted or
created in Kit. Command details live in the site's README. Keep the same
campaign when sharing the piece elsewhere so source comparisons remain useful.

The reusable request is:

> Turn this Channel47 note, build, or conversation into the next broadcast.

For each request:

1. Read the source material and verify every factual claim.
2. Propose three subject lines and one preview-text option.
3. Draft the full email in plain, email-safe HTML.
4. Show Jackson the subject, preview text, body, primary link, and intended
   audience for review.
5. After approval, create a **draft** in Kit using the `ch47-v2` HTML template.
6. Verify the sender, audience, links, preview text, and mobile rendering in
   Kit.
7. Schedule or send only after Jackson explicitly confirms the final date,
   time, timezone, and audience.

The standing audience is the full active Kit list, regardless of which site,
form, import, or tag originally brought someone in. Kit excludes cancelled,
bounced, complained, and inactive records from that active audience. Before a
draft is created, show Jackson the current active count; do not reintroduce the
legacy `ch47-subscribe` tag as a send boundary.

### Implementation

Template setup, configuration, issue format, local previews, draft commands,
and client compatibility checks live in
[newsletter/README.md](../newsletter/README.md). Keep that file as the technical
source of truth and this playbook focused on editorial decisions.

## Safety gates

- Draft creation is allowed after content approval.
- A draft must not include a send time by default.
- Scheduling and sending always require a separate explicit confirmation.
- Reconfirm the Kit template and live active-subscriber count before every send.
- Keep the verified `jackson@channel47.dev` sender as the default unless Jackson
  requests another address.
- Complete a real test send in the client matrix documented in
  `newsletter/README.md` after any wrapper or Kit-template change.

## Post-send review

Review each broadcast after roughly 72 hours and record:

- recipients
- opens and open rate, treated as directional
- unique clicks and click rate
- replies or useful reader responses
- unsubscribes and complaints
- the subject line and central angle
- one thing to repeat or change next time

The purpose is to learn which problems and examples resonate, not to optimize
every issue into a funnel.

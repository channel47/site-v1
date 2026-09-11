# Channel47 whiteboard infographic system

Historical art study, superseded for the current articles by real screenshots
and contextual imagery. Current collection covers follow [cover-art.md](../cover-art.md);
interface rules follow [design-system.md](../design-system.md).

## The idea

Generated infographics should look like clean diagrams somebody actually drew
on a real whiteboard to explain an idea to another person. The image can be
highly composed, but the surface, marker lines, lettering, and small signs of use
should remain physically believable.

This is not a branded artifact. Do not add a Channel47 logo, fictional label, or
recurring prop. Consistency comes from the whiteboard, camera, drawing grammar,
and level of restraint.

## Visual grammar

- Use a real warm-white magnetic whiteboard photographed straight-on.
- Light it evenly with soft room light or daylight. Avoid cinematic lighting.
- Draw in near-black dry-erase marker with one clear accent route.
- Keep the handwriting human and highly legible. Use sentence case only.
- Leave abundant negative space around the diagram.
- Allow one faint eraser ghost and one or two real markers in the tray.
- Keep the board clean: no tape scraps, logos, decorative magnets, or clutter.
- Use one claim and one obvious reading direction per image.
- Let the diagram explain the idea before the reader reaches the caption.

## Accent

Use one functional marker color for a route, an outcome circle or an underline.
The existing Google Ads diagrams use gold `#a27f30`. Keep it to roughly 10–15%
of the marks and retain it when extending that set. It is a property of the
illustration, not a site category color. Do not restore the retired skill,
connector or workshop palettes to the interface.

## Information limits

Each image should contain:

- one short heading;
- one visual claim;
- three to five short labels;
- roughly 20 embedded words at most;
- no essential nuance that appears only inside the generated image.

Put exact details and accessibility context in the article caption. If a count
is part of the claim, the marks on the board must match it exactly.

## Composition templates

### Convergence

Many tally marks, dots, or short paths gather into a smaller set of outcomes.
Use for simplification, prioritization, or tool architecture.

### Sequence

Three to five large states move left to right along one marker path. Use for a
journey or repeated process.

### Guardrail

A gate, stop mark, or crossed-out path visibly interrupts a route. Use for a
safety control or a lesson learned from unintended behavior.

### Before and after

Two halves of the board show a changed workflow. Keep the same objects and
labels on both sides so the difference is immediately visible.

### Annotated evidence

Do not regenerate proof as a whiteboard drawing. Use the real screenshot or
photograph and add only a few separate callouts if the article needs them.

## Reusable image-generation prompt

Use the `infographic-diagram` taxonomy.

```text
Create a landscape 3:2 editorial infographic about [single claim].

Exact visible text only:
“[short sentence-case heading]”
“[label one]”
“[label two]”
“[label three]”

Composition: [convergence / sequence / guardrail / before and after].
[Describe exactly how every mark and label maps to the information. State every
required count explicitly.]

Photograph a real clean warm-white magnetic whiteboard straight-on in even soft
daylight. Draw the diagram in neat but unmistakably human near-black dry-erase
marker. Use [accent name and hex], for exactly
one functional route, outcome circle, or underline; keep all other marks
neutral. Use abundant negative space, one faint eraser ghost, and no more than
two markers resting in the tray.
Make the message immediately understandable to a nontechnical reader at article
column width.

Avoid logos, brand marks, all-caps text, extra words, tape scraps, decorative
magnets, clutter, cinematic lighting, generic corporate icons, polished digital
vector geometry, fake software interfaces, and watermarks.
```

## Quality check

Before publishing, confirm:

- Every word is correct and in sentence case.
- Every visible count matches the written claim.
- The message is understandable before reading the caption.
- The image remains legible at article-column width and on mobile.
- Marker lines look physically drawn rather than digitally overlaid.
- Eraser ghosts and props do not compete with the labels.
- The caption states the takeaway, and alt text describes the idea and reading
  order rather than only saying “a whiteboard.”
- No private data, account identifiers, logos, invented metrics, or unsupported
  product claims appear.

## Current Google Ads MCP set

All four existing diagrams use gold for their main route or underline:

- `public/posts/google-ads-mcp-whiteboard-journey.jpg`
- `public/posts/google-ads-mcp-whiteboard-three-tools.jpg`
- `public/posts/google-ads-mcp-whiteboard-incident.jpg`
- `public/posts/google-ads-mcp-whiteboard-kpi-scan.jpg`

The three-tools diagram uses two five-mark tally groups plus three marks to show
13 commands. The KPI diagram intentionally contains no account names, offer
names, or metric values; green and red dots communicate comparison state only.

## Generation record

Mode: built-in image generation, followed by one referenced-image correction.

Initial prompt:

```text
Generate exactly one brand-new real-world infographic. Exact visible text only:
“Thirteen commands became three”, “13 commands”, “Find accounts”, “Read data”,
“Make changes”. Sentence case only, never all caps. Landscape 3:2 editorial
image, taxonomy infographic-diagram. Photograph a real clean warm-white magnetic
whiteboard straight-on in even daylight. Draw a highly legible diagram in neat
but unmistakably human black dry-erase marker: exactly thirteen small black
magnetic dots or short tally marks at left beneath “13 commands”; one clean
yellow-gold marker route gathers them and branches to three open hand-drawn
boxes at right, each with one action label. Heading centered across the top.
Keep abundant negative space, one faint eraser ghost, and perhaps one marker
resting in the tray so it feels used in real life. Clean and confident rather
than messy or sterile. No logos, no brand marks, no tape scraps, no extra words,
no all-caps, no fake software UI, no polished vector geometry, no corporate
icons, no watermark.
```

Correction prompt:

```text
Preserve the real whiteboard, framing, lighting, exact sentence-case text,
yellow-gold route, three boxes, labels, marker tray, and all other composition
details. Change only the tally area under “13 commands”: replace it with exactly
thirteen black tally marks, formatted as two conventional five-mark tally groups
plus one group of three (5 + 5 + 3 = 13), clearly separated. Leave clean natural
whiteboard where the removed marks were. Do not add or change anything else.
```

Journey prompt:

```text
Generate one brand-new whiteboard infographic. Exact visible text only: “One API
led to another”, “Mid-2025”, “Drip MCP”, “November 2025”, “Google Ads API”,
“January 7, 2026”, “Public release”. Sentence case only; never all caps.
Landscape 3:2 editorial image, taxonomy infographic-diagram. Photograph a real
clean warm-white magnetic whiteboard straight-on in even soft daylight. Draw a
simple left-to-right journey in neat, unmistakably human near-black dry-erase
marker: one restrained Note-gold line close to #a27f30 connects exactly three
large milestone circles. Milestone one pairs “Mid-2025” with “Drip MCP”;
milestone two pairs “November 2025” with “Google Ads API”; milestone three pairs
“January 7, 2026” with “Public release”. Center the heading across the top. Make
the chronology immediately clear to a nontechnical reader, with generous
negative space, one faint eraser ghost, and no more than two markers in the tray.
No logos, brand marks, tape, decorative magnets, icons, extra text, all-caps,
fake UI, vector-clean digital styling, or watermark.
```

Incident prompt:

```text
Generate one brand-new whiteboard infographic. Exact visible text only: “What
the server said vs what happened”, “Test only”, “Server report”, “No changes”,
“Google Ads account”, “2 live ads”. Sentence case only; never all caps.
Landscape 3:2 editorial image, taxonomy infographic-diagram. Photograph a real
clean warm-white magnetic whiteboard straight-on in even soft daylight. In neat,
unmistakably human black dry-erase marker, draw “Test only” in one box at left.
From it, one restrained yellow-gold route splits into exactly two parallel paths.
The upper path is labeled “Server report” and ends at a clean box reading “No
changes”. The lower path is labeled “Google Ads account” and ends at a clean box
reading “2 live ads”; circle that outcome once with a restrained rust-red marker
to emphasize the mismatch. Center the heading across the top. The contradiction
must be immediately obvious to a nontechnical reader. Use generous negative
space, one faint eraser ghost, and no more than two markers in the tray. No logos,
brand marks, tape, decorative magnets, extra words, all-caps, fake UI,
vector-clean digital styling, corporate icons, or watermark.
```

KPI prompt:

```text
Generate one brand-new privacy-safe whiteboard infographic. Exact visible text
only: “My Monday KPI scan”, “12+ accounts”, “7 days”, “Ads + CRM”, “Offer
report”, “Spend”, “Revenue”, “Convs”, “ROAS”, “7d”, “30d”, “~5 minute scan”.
Sentence case only; never all caps. Landscape 3:2 editorial image, taxonomy
infographic-diagram. Photograph a real clean warm-white magnetic whiteboard
straight-on in even soft daylight. Draw a clear left-to-right workflow in neat,
unmistakably human black dry-erase marker. At left, two small boxes read “12+
accounts” and “7 days”; their restrained yellow-gold paths join at a circle
reading “Ads + CRM”. The path continues to a large central hand-drawn table
titled “Offer report” with exactly six column headings: “Spend”, “Revenue”,
“Convs”, “ROAS”, “7d”, “30d”. Show three anonymous rows using short black
strokes only, with a few tiny green and rust-red dots in the 7d and 30d columns;
do not show any numbers, account names, campaign names, offer names, or values.
The path ends at one box reading “~5 minute scan”. Center “My Monday KPI scan”
across the top. Make the workflow and report anatomy immediately obvious to a
nontechnical reader at article width. Use generous negative space, one faint
eraser ghost, and no more than two markers in the tray. No logos, brand marks,
tape, decorative magnets, extra words, all-caps, invented metrics, private data,
fake spreadsheet UI, vector-clean digital styling, corporate icons, or
watermark.
```

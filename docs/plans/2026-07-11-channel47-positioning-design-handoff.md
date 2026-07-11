# channel47 Positioning and Design Handoff

**Date:** July 11, 2026  
**Status:** Strategy approved; ready for design exploration  
**Project:** `channel47.dev` marketing site  
**Primary codebase:** `site-v1/`

## Purpose

This brief defines the next evolution of channel47: broader positioning, a new
paid working-session offer, a Builds content type, and the supporting
information architecture and copy system.

The next design pass should translate this strategy into coherent key-page
designs. It should not treat the assignment as a full rebrand or replace the
site's existing visual language.

## Governing idea

channel47 is Jackson Dean's public workshop for practical agentic systems.

Marketing is where much of the existing work originated, but it is no longer
the boundary of the brand. The broader capability is finding recurring work,
giving agents a useful role within it, and building systems that save time in
small but compounding ways.

The site should help visitors do three things:

1. Explore systems, tools, and workshops Jackson has created.
2. Subscribe for self-contained updates from the workshop.
3. Pay for a working session about a recurring workflow of their own.

## Strategic positioning

### Primary audience

People responsible for getting work done who have a recurring workflow they
would like to make easier. They may be founders, department leads,
solopreneurs, or individual knowledge workers.

The initial offer is best suited to someone who can name a real process. It can
also accommodate someone who is interested in agents but needs help identifying
the right process to improve.

The offer is not primarily positioned as debugging support for an existing,
half-built automation.

### Desired outcome

The promise is intentionally modest: find practical ways to create meaningful
time savings that compound over weeks and months. This is not positioned as
enterprise transformation, a moonshot, or an all-purpose AI consultancy.

### Category position

The brand should feel like a maker sharing useful work in public, with enough
explanation for other people to adapt it. It should not read like a consultant
manufacturing authority or a teacher packaging a formal course.

## Scope and non-goals

### In scope

- Global navigation and mobile navigation
- Homepage hero and category hierarchy
- Browse All taxonomy
- Builds index treatment and Build detail template
- Newsletter page and newsletter promise
- Working-session offer page
- Contextual calls to action across content types
- Copy principles and representative copy
- Responsive behavior for the key conversion path

### Out of scope for this design pass

- A full visual rebrand
- A new logo, typography system, color system, or illustration language
- A standalone About page
- Recurring advisory packages
- Public done-for-you service packages
- A custom checkout or scheduling system
- A dedicated Writing category before relevant content exists
- A bespoke featured-case-study block on the homepage
- A Shopify Build

## Existing visual system to preserve

The current codebase is the visual source of truth. Read `CLAUDE.md` and the
header comments in `app/globals.css` before proposing changes.

Preserve these characteristics:

- Hard edges and no decorative border radius
- Existing typography and content spine
- Restrained use of color
- Content-type color appearing mainly through interaction and state
- Existing responsive shell and spacing logic
- Existing Browse rows and filter interaction
- Existing expandable homepage category rows
- Lowercase `channel47` when the name must be written

Avoid typing the brand name into the homepage supporting copy simply to explain
the site. The logo already carries the identity, and the literal wordmark is not
a preferred hero element.

This should feel like the next version of the current site, not a replacement
site that happens to contain the same content.

## Information architecture

### Primary navigation

Keep the primary navigation deliberately small:

1. Logo, linking home
2. Browse all
3. Newsletter
4. Book a session

`Book a session` should be visually distinct, but it does not need to become a
conventional filled button. The design agent should explore a treatment native
to the site's restrained visual system.

`Browse all` should be a direct link, not a dropdown. Skills, Connectors,
Builds, and Workshops belong inside the Browse interface and footer rather than
competing in the primary navigation.

Mobile navigation should expose the same destinations. Do not add destinations
solely to make the menu appear fuller.

### Footer

The footer may carry the deeper sitemap and utility links:

- Builds
- Skills
- Connectors
- Workshops
- Browse all
- Newsletter
- GitHub and social profiles
- Machine-readable formats and legal pages

Do not add About to the footer or primary navigation as a destination. Jackson's
identity should be expressed through the homepage bio, bylines, Builds, workshop
pages, and the working-session page.

The existing `/about` route should eventually be retired or redirected rather
than redesigned. The exact technical treatment can be decided during
implementation.

## Page system

### Homepage

The homepage should preserve its current overall composition. Avoid adding a
new featured-Build block or turning it into a case-study landing page.

#### Working hero copy

> **Building agentic systems for everyday work.**
>
> Skills, connectors, workshops, and practical guidance for making recurring
> work easier with agents.

Primary action: `Book a working session`  
Supporting booking metadata: `60 minutes · $250 · Four sessions each month`  
Secondary action: `Browse the workshop →`

The action hierarchy is locked; the visual treatment is not. The earlier test
with a heavy black button felt too conventional. Explore quieter treatments
that still establish booking as the primary action.

Newsletter capture should move out of the hero and appear farther down the
homepage, after visitors have encountered the site's work.

#### Homepage content rows

Preserve the existing expandable category-row pattern. Use this order:

1. Builds
2. Skills
3. Connectors
4. Workshops

The recruiting system should appear within the Builds row. It should not receive
a bespoke featured treatment.

### Browse All

Preserve the existing restrained, filterable catalog and chronological row
treatment.

Initial filters:

1. All
2. Builds
3. Skills
4. Connectors
5. Workshops

Do not add domain filters such as Marketing, Recruiting, or Operations yet.
Those may remain tags and metadata until the library is large enough to justify
another interaction layer.

Do not launch an empty Writing category. If several genuinely non-Build essays
exist later, `Writing` may become a fifth content type. Prefer `Writing` over
`Posts` in the interface because it describes what the visitor will encounter,
not the publishing mechanism.

The Browse page should focus on discovery and opening content. It does not need
an interrupting conversion block.

### Builds

Builds are annotated blueprints for systems Jackson has actually created and
used. They teach readers how to create a version themselves without becoming
full tutorials or chronological build logs.

#### Default Build anatomy

1. The recurring problem and why it mattered
2. The finished workflow at a glance
3. The important decisions behind the approach
4. Prompts, instructions, or supporting artifacts that carry the method
5. Enough implementation detail to create a similar version
6. Limitations, variations, and what Jackson might change next time

Show the actual tools when they help explain the system. Do not force every
Build to become a platform comparison or a tool-specific tutorial.

Builds should use real or sanitized examples. Never expose confidential company,
candidate, customer, or account information.

#### End-of-Build invitation

Each Build may end with a quiet contextual invitation:

> **Have a workflow you've been thinking about?**
>
> Bring it to a working session and we'll explore how I would approach it using
> the tools you already work with.
>
> **Learn about working sessions →**

This should feel like the natural next step after reading a useful system
breakdown, not a sales block inserted into an article.

### Skill and Connector pages

The primary action remains using or installing the asset. Newsletter capture is
the secondary relationship-building action.

Do not force the working-session offer onto every asset page. The global
navigation already keeps it available.

### Workshop pages

Upcoming workshops should point to the current registration destination in the
Vibe Marketers Skool community.

Past workshops should emphasize newsletter signup for future sessions.

### Newsletter page

The newsletter is the distribution layer for the public workshop, not a
separate content machine.

#### Subscriber promise

> **Occasional emails about agentic systems I'm building, how they work, and the
> parts you can reuse in your own work.**

Each email should stand on its own. The useful idea must not be withheld behind
a click. Website links should deepen the email with screenshots, complete
prompts, system diagrams, downloadable assets, related tools, and future
updates.

#### Recurring newsletter formats

- Build breakdowns
- Small workflow ideas
- New skill, connector, or workshop releases explained through the problem
  behind them
- Occasional reader workflow breakdowns, shared with permission

A typical issue contains:

1. A concrete problem
2. The system or workflow Jackson tried
3. One important decision
4. A reusable prompt, framework, or takeaway
5. A link to a complete Build or relevant asset when one exists
6. A quiet mention of working-session availability when genuinely relevant

The welcome email may invite subscribers to reply with one recurring workflow
they wish were easier. This creates audience research, editorial ideas, and
potential working-session leads without turning the newsletter into a funnel.

### Working-session page

This page should feel like a normal channel47 content page, not an aggressively
optimized consulting landing page.

Its job is to explain the offer, establish enough trust, and send a qualified
visitor to an external paid booking flow.

#### Offer

**Name:** Agentic Systems Working Session  
**Length:** 60 minutes  
**Price:** $250 USD  
**Capacity:** Four sessions each month

#### Core promise

> Bring one recurring workflow from your work or business. We'll think through
> how agents could make it easier using tools that fit the way you already work.

The session is open-ended in solution but bounded around one workflow. It may
involve conversation, diagrams, tool recommendations, process mapping, or live
experimentation. A finished build is not required for the session to be useful.

#### Fit language

Good fit:

- A recurring process feels slower or more manual than it should
- The visitor wants practical guidance shaped around familiar tools
- The visitor has an idea but is unsure how to turn it into a system

Expectation boundary:

> It is probably not the right fit if you primarily need someone to debug an
> existing automation or implement a large project during the call.

The phrase `during the call` matters. It protects the one-hour engagement
without ruling out a later build or recurring advisory relationship when the
mutual fit is strong.

Do not advertise recurring advisory or done-for-you packages. Those may be
offered privately after a session based on mutual fit.

#### Suggested page hierarchy

1. Offer title, duration, price, and monthly capacity
2. Two or three sentences explaining the session
3. Early booking action
4. What working together looks like
5. Selected Builds as concrete proof
6. Small personal block with Jackson's photo and short bio
7. One specific, plain testimonial
8. Expectation boundary
9. Final booking action

Avoid a testimonial carousel, logo wall, rating treatment, invented metrics, or
long FAQ designed to manufacture objections.

## Booking and payment flow

Booking and payment will happen externally through [Cal.com](https://cal.com/)
and Stripe.

The website flow is:

`Homepage, navigation, or Build → Working-session page → Cal.com → Choose time
and pay → Confirmation`

The design does not need an embedded scheduler or custom checkout.

Planned Cal.com event configuration:

- 60-minute one-to-one event
- $250 USD required before confirmation
- Four-bookings-per-month limit
- Narrow recurring availability blocks
- Approximately 48 hours' minimum notice
- 15-minute buffer around the call
- Google Meet or Zoom location
- Three required intake questions:
  1. What recurring workflow would you like to discuss?
  2. What tools are currently involved?
  3. What would make this workflow meaningfully easier?
- Optional field for relevant links or context
- Short cancellation and rescheduling policy

Jackson likes Cal.com but does not yet have a Stripe account. Stripe setup and
the final booking URL are launch tasks, not design blockers.

## CTA behavior by surface

| Surface | Primary next step |
| --- | --- |
| Homepage | Book a session or browse; newsletter farther down |
| Build | Quiet invitation to discuss the reader's workflow |
| Skill | Install or use the skill, then subscribe |
| Connector | Install or use the connector, then subscribe |
| Upcoming workshop | Register through the Skool community |
| Past workshop | Subscribe for future sessions |
| Browse All | Open content without an interrupting conversion block |
| Newsletter page | Subscribe |
| Working-session page | Pay and schedule externally |

## Voice and copy system

### Voice definition

A maker sharing useful work in public, with enough explanation for someone else
to adapt it.

### Principles

- Begin with a real problem or observation
- Explain decisions in plain language
- Show the useful parts of the work
- Prefer modest, specific claims over sweeping AI promises
- Teach without sounding like a course
- Use first person when experience matters, not in every sentence
- Let tools support the story rather than becoming the story
- Avoid generic AI commentary and trend-chasing copy
- Avoid unnecessary em dashes
- Avoid phrases such as `field notes` that feel more written than spoken

### Representative samples

#### Homepage or section introduction

> Most of the systems here started with work I was tired of doing the same way
> twice. Some pull data together. Some help with research. Others turn a loose
> process into something an agent can run on a schedule. When something works,
> I share the useful parts here.

#### Build opening

> We had several open roles and a list of companies we tend to hire from.
> Finding relevant candidates meant checking the roles, searching those
> companies one at a time, and moving anything promising into a spreadsheet.
>
> I wanted to see how much of that process an agent could handle without
> removing the human judgment from hiring.

#### Explaining a decision

> I could have asked the agent to search broadly for anyone matching the job
> title. That produced too much noise. Starting with companies we already
> respect gave the system a useful constraint and made the output easier to
> review.

#### Helping someone adapt a Build

> You do not need the same recruiting stack to make this useful. The important
> pieces are a clear list of roles, a source of candidate criteria, and
> somewhere for the agent to return its findings. A database, spreadsheet, or
> project-management tool could all serve that purpose.

#### Introducing a reusable asset

> I built this skill because I kept giving agents the same background before
> asking them to work on a brand. It packages that context once so the next task
> can start from a better place.

## Editorial priorities

### Initial Build queue

1. Recruiting candidate-sourcing system
2. Weekly advertising and sales KPI review system
3. Future systems only after they have been used enough to explain what worked

The recruiting Build should launch with or before the broader repositioning.
Without at least one non-marketing example, the new headline will feel more
aspirational than proven.

### Priority order

1. Systems Jackson actually uses
2. Repeatable systems that create small, compounding time savings
3. Reusable components such as skills and connectors
4. Workshop-derived Builds
5. Reader workflow breakdowns
6. Conceptual writing only when grounded in direct experience

Avoid manufacturing a publishing backlog. Two strong Builds are enough to
launch the category.

Do not prioritize generic product-news summaries, trend commentary, or listicles
such as `ten AI tools to try` unless direct experience materially changes the
recommendation.

## Personal credibility and proof

The site does not need a standalone About page. Establish trust through:

- Existing homepage bio
- Jackson's photo and short bio on the working-session page
- First-person Build reasoning
- Workshop history inside Vibe Marketers
- Selected Builds
- One specific testimonial

Yuli's existing paid weekly coaching relationship is internal validation for
the model, but no testimonial should be invented or published without her
approval. Her current $100 session rate reflects an early-client arrangement
and should not anchor the public $250 offer.

## Copy and discovery migration

The current site is marketer-specific in more places than the visible homepage.
Implementation must audit and update relevant copy across:

- Homepage and category descriptions
- Global layout title and description
- Browse page metadata
- Newsletter page
- Footer and homepage bio
- Structured data and person descriptions
- Open Graph copy and generated social cards
- `llms.txt`, sitemap descriptions, RSS descriptions, and discovery manifests
- SEO and AI-discovery documentation
- Any remaining About-page references
- Content descriptions that incorrectly claim the entire library is only for
  marketers

Do not erase the site's legitimate marketing history. Reframe it as a major
source of proof rather than the limit of the brand.

## Analytics and success signals

Track enough to learn whether the repositioning works:

- Working-session page visits
- Outbound clicks to Cal.com
- Completed paid bookings, reconciled through Cal.com or Stripe
- Browse filter usage, particularly Builds
- Build reads and completion proxies
- Newsletter subscriptions
- Clicks from Builds to the working-session page

Four paid sessions per month is the initial capacity ceiling, not a conversion
target the design should chase at the expense of the site's character.

## Locked decisions and design latitude

| Locked | Open for design exploration |
| --- | --- |
| Broader agentic-systems positioning | Exact responsive line breaks and spacing |
| Existing visual system remains the source of truth | Primary booking action treatment |
| Minimal four-item navigation including logo | Mobile menu composition and motion |
| No About page | Personal block layout on working-session page |
| Builds added to Home and Browse | Build thumbnail or preview treatment within existing patterns |
| No bespoke featured Build block | How Builds distinguish themselves without breaking the system |
| Newsletter moves below the homepage hero | Exact newsletter placement lower on Home |
| $250, 60 minutes, four sessions monthly | Booking metadata typography and grouping |
| External Cal.com and Stripe flow | Transition treatment to the external booking page |
| One testimonial maximum at launch | Testimonial layout |
| Recruiting and KPI Builds are initial proof | Sanitized mock content used during design |

## Required design outputs

Create responsive designs for these key surfaces and states:

1. Global desktop navigation
2. Global mobile navigation, closed and open
3. Homepage with revised hero, booking action, category rows, and relocated
   newsletter capture
4. Browse All with the Builds filter and a mixed content list
5. Build detail page with realistic recruiting-system content
6. End-of-Build contextual working-session invitation
7. Working-session offer page
8. Newsletter page

Also show how the existing Skill, Connector, and Workshop detail templates
inherit the new navigation and CTA rules without requiring full redesigns.

Use realistic copy from this brief. Do not use lorem ipsum or invent customer
results.

## Launch dependencies

- Publish the sanitized recruiting Build
- Prepare the KPI review Build or a credible preview
- Obtain permission and exact wording for one testimonial
- Confirm the photo used on the working-session page
- Create and verify the Stripe account
- Configure and test the Cal.com event
- Finalize cancellation and rescheduling terms
- Add the production Cal.com URL
- Complete the visible and machine-readable copy migration
- Verify analytics events across the new journey

## Acceptance criteria

The design direction is successful when:

- A first-time visitor understands that channel47 extends beyond marketing
- The site still feels recognizably like the current channel47
- Builds feel like a natural addition to the existing content system
- Booking is clearly available without making the site feel like a consulting
  funnel
- The working-session offer is understandable without a free discovery call
- Newsletter signup remains valuable but no longer defines the homepage hero
- The recruiting Build supplies credible non-marketing proof
- Every content type leads to a contextually appropriate next step
- Desktop and mobile preserve a calm, restrained composition

## Recommended rollout sequence

1. Design the updated navigation, Home, Browse, Build detail, newsletter, and
   working-session surfaces.
2. Write and publish the sanitized recruiting Build.
3. Create Stripe and configure the paid Cal.com event.
4. Implement the new templates and CTA logic.
5. Migrate visible, SEO, structured, and machine-readable copy.
6. Test the complete journey from content to payment and confirmation.
7. Launch with four monthly sessions available.
8. Review behavior after the first month before adding more categories,
   packages, or conversion elements.


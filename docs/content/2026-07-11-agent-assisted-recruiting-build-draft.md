# A Simple Architecture for Agent-Assisted Recruiting

## Production status

- Content type: Build
- Draft status: Copy approved for design
- Framing: First working version
- Public company details: Generalized
- Primary CTA: Agentic Systems Working Session
- Screenshot status: Pending access to the source machine
- Future update: Add review, outreach, interview, and Apollo-plan results

## Article copy

A coworker recently asked whether we could build an agent to help with recruiting.

The company had been relying on recruiting agencies to fill several open roles.
Too many weak-fit candidates were making it into long interviews, creating a
poor experience for everyone involved.

The alternative seemed straightforward. Start with companies we already
believed did this work well, then identify people at those companies whose
experience matched our open roles.

The first version took about an hour to set up. Its first sourcing run returned
243 candidates across five open roles in about five minutes.

This is how it came together.

## Starting with the actual request

The message from my coworker did more than describe the recruiting problem. It
also included a rough outline for a system that could replace the agencies we
had been using.

The agent would start with our open roles and a list of companies we respected.
It would find people at those companies whose experience matched what we
needed, then pass them to someone on the team for review. Approved candidates
would move into an outreach queue.

I pasted the entire message into Claude. Before I hit send, I added one more
instruction.

> Let's build this. But before we do, interview me relentlessly about the task
> until you are confident and aligned.

The outline was a good start, but it left some important decisions unresolved.
Claude's questions forced us to decide where human judgment belonged, how
candidate data should be gathered, where the team would review the work, and
how the process should run over time.

We did not start building until those choices were clear.

That conversation turned a rough idea into a plan we could actually build.

VISUAL 01 · A sanitized excerpt from the original message beside the
instruction given to Claude

## Keeping the system simple

A Google Sheet sits at the center of the system. It has four main tabs.

- Roles holds job descriptions, salary ranges, location details, and the person
  responsible for outreach.
- Companies holds the names and URLs of companies we want to hire from.
- Candidates holds names, locations, current companies, job titles, LinkedIn
  profiles, and a dropdown for approving or rejecting each person.
- Outreach Queue holds draft messages for candidates who have been approved.

A recurring task in Claude Cowork runs every Monday and Thursday morning.

Claude reads the current roles and target companies, then queries Apollo for
people whose experience might fit. It removes duplicates and adds new results
to the Candidates tab.

The same task checks for anyone who has been approved. For those candidates,
Claude prepares personalized connection notes and follow-up messages in the
Outreach Queue. Someone from the company still reviews and sends the messages
manually.

Once the task finishes, Claude posts a summary in Slack. The message shows how
many candidates were found for each role, identifies anything that needs
attention, and tells the team what to do next.

There is no separate recruiting application or database. Claude uses built-in
connectors to work with Google Sheets and Slack. Apollo provides licensed
candidate data through an API key, which avoids relying on browser automation
to scrape LinkedIn.

VISUAL 02 · A diagram showing Cowork, Apollo, the four Sheet tabs, human review,
and Slack as one recurring loop

VISUAL 03 · A screenshot of the Candidates tab in a sanitized duplicate of the
Google Sheet

## The first run

Most of the setup time went toward creating the Apollo account, starting its
trial, and connecting the API key. Everything else was relatively
straightforward.

The first run returned 243 candidates across five open roles, all from companies
on our target list.

Claude also flagged a small number of records where a person's name or title
might not match the LinkedIn profile. The data may have been stale, so those
rows were marked for someone to verify manually.

I spot-checked some of the results. The people I reviewed worked at the intended
companies and had job titles related to our open roles. The quality was better
than I expected, especially given how quickly the system had been assembled.

That does not mean it has already worked.

The team still needs to review the full list, approve candidates, send the
outreach, and see how those conversations progress. The 243 candidates are an
output, not the outcome.

Apollo was on a [14-day free
trial](https://knowledge.apollo.io/hc/en-us/articles/5288168088205-Access-a-Free-Trial-of-Apollo)
when we built this. Once the trial ends, we will decide which plan, if any,
makes sense based on the quality of the outreach results and the API limits we
need.

VISUAL 04 · A sanitized screenshot of the Slack completion message

RESULTS STRIP · About one hour of setup / five roles / 243 candidates / about a
five-minute run

## What happens next

Only about 20–30% of the candidates introduced by recruiting agencies were
making it past the first interview.

The new process will be a meaningful improvement if it sends a higher
percentage of qualified people into follow-up interviews while reducing what we
spend on recruiting agencies.

I plan to update this Build as candidates move through the process. The next
version should include how many people were approved, how outreach performed,
and whether the interviews were any better.

For now, the useful result is that a recurring problem became a working system
in about an hour.

The important parts were not complicated. Start with the actual request. Let
the agent question you before it builds anything. Keep the shared workspace
simple. Leave human judgment at the points where it matters.

The next proof will not be the 243 candidates. It will be whether more of the
right people make it through the interview process.

STATUS · Sourcing complete / human review pending / outreach pending /
interview results pending

If you have a recurring workflow that might benefit from a system like this, a
working session is a place to think through how you could build your own version
using the tools you already use.

## Visual production plan

### Visual 01 — original request and instruction

Recreate this as a two-panel editorial artifact rather than publishing the
original internal message. Keep the coworker's proposed workflow on the left
and Jackson's instruction to Claude on the right.

### Visual 02 — recurring workflow

This is the primary explanatory visual.

```text
Monday and Thursday task
          ↓
Read Roles + Companies
          ↓
      Query Apollo
          ↓
Deduplicate + add Candidates
          ↓
     Human approval
          ↓
Draft messages in Outreach Queue
          ↓
      Manual sending

Claude posts a Slack summary after each run
```

Use the site's restrained visual system. Prefer hard edges, simple arrows,
minimal color, and no decorative agent imagery.

### Visual 03 — Google Sheet

Create a sanitized duplicate instead of blurring the production Sheet. Keep the
four-tab structure and show the Candidates tab with five or six fictional rows.
Include different review states and one fictional profile-verification warning.

### Visual 04 — Slack summary

Create a sanitized copy of the real completion message in a private test
channel, then capture that version. Preserve the 243-candidate total, five-role
breakdown, review instructions, profile-warning note, and recurring schedule.

Remove internal names, company details, avatars, workspace details, links, and
identifiable role titles.

## Source captures to collect next week

- Beginning of the Cowork thread
- Claude's first scoping questions
- Final plan or PRD excerpt
- Scheduled-task instructions
- Scheduled-task timing screen
- Google Sheet tab bar
- Each Sheet tab individually
- Candidate rows with the review dropdown
- Automatically flagged candidate row
- Full Slack completion message
- Outreach drafts, if any exist by then

## Capture and redaction rules

- Capture PNGs at Retina resolution.
- Crop tightly enough for text to remain readable at the site's article width.
- For full Mac windows, use `⌘⇧4`, then Space, then Option-click to omit the
  native shadow and retain transparent corners.
- Never capture an API key.
- Check browser tabs, sidebars, avatars, comments, URLs, document history, and
  account menus for identifying information.
- Prefer replacing sensitive data in a duplicate over blurring the original.
- Use solid opaque redaction when replacement is not practical.
- Keep untouched source captures outside the public repository.
- Write alt text as an editorial caption because the site displays it beneath
  screenshots.

## Future-results update

When the team has used the workflow, update the Build with as many of these as
are available.

- Candidates approved and rejected
- Outreach drafts created
- Messages sent
- Replies and positive replies
- Phone interviews completed
- Candidates advancing to follow-up interviews
- Comparison with the approximate 20–30% agency benchmark
- Decision on the Apollo plan
- Any changes made after the first review cycle


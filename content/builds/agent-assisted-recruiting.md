---
title: A simple architecture for agent-assisted recruiting
slug: agent-assisted-recruiting
description: A recruiting system that reads our open roles and a short list of companies we admire, pulls licensed candidate data, and drafts outreach for a person to approve. The first run surfaced 243 relevant candidates in about five minutes.
date: 2026-07-11
tags: [recruiting, claude-cowork, apollo, google-sheets, slack]
sanitized: true
---

## The problem

A coworker recently asked whether we could build an agent to help with recruiting. The company had been relying on recruiting agencies to fill several open roles, and too many weak-fit candidates were making it into long interviews — a poor experience for everyone involved. The goal was a system that could find people at companies we already respected without taking the human judgment out of hiring.

## Starting with the actual request

The message from my coworker did more than describe the recruiting problem. It also included a rough outline for a system that could replace the agencies we had been using: start with our open roles and a list of companies we respected, find people at those companies whose experience matched what we needed, then pass them to someone on the team for review. Approved candidates would move into an outreach queue.

I pasted the entire message into Claude. Before I hit send, I added one more instruction.

> Let's build this. But before we do, interview me relentlessly about the task until you are confident and aligned.

The outline was a good start, but it left some important decisions unresolved. Claude's questions forced us to decide where human judgment belonged, how candidate data should be gathered, where the team would review the work, and how the process should run over time. We did not start building until those choices were clear. That conversation turned a rough idea into a plan we could actually build.

![A sanitized excerpt from the original message beside the instruction given to Claude](placeholder:visual-01)

## The workflow at a glance

It runs twice a week, on Monday and Thursday. One run looks like this:

1. Reads the current roles and target companies from the shared Sheet.
2. Queries Apollo for people whose experience might fit.
3. Dedupes new results against everyone already in the sheet.
4. Writes new candidates to the Candidates tab.
5. Flags any record where a name or title might not match the LinkedIn profile.
6. Drafts outreach for approved candidates and posts a Slack summary.

A Google Sheet sits at the center of the system, with four main tabs: Roles (job descriptions, salary ranges, location, owner), Companies (names and URLs of companies we want to hire from), Candidates (names, locations, current companies, job titles, LinkedIn profiles, and an approve/reject dropdown), and Outreach Queue (draft messages for approved candidates). There is no separate recruiting application or database — Claude uses built-in connectors to work with Google Sheets and Slack, and Apollo provides licensed candidate data through an API key, which avoids relying on browser automation to scrape LinkedIn.

![A diagram showing Cowork, Apollo, the four Sheet tabs, human review, and Slack as one recurring loop](placeholder:visual-02)

![A screenshot of the Candidates tab in a sanitized duplicate of the Google Sheet](placeholder:visual-03)

RESULTS · 243 · candidates, first run | ~5 min · to surface them | ~1 hr · total setup

Most of the setup hour was creating the Apollo account and connecting its API key. Everything else was relatively straightforward. The first run returned 243 candidates across five open roles, all from companies on our target list. Claude also flagged a small number of records where a person's name or title might not match the LinkedIn profile — the data may have been stale, so those rows were marked for someone to verify manually.

I spot-checked some of the results. The people I reviewed worked at the intended companies and had job titles related to our open roles. The quality was better than I expected, especially given how quickly the system had been assembled. That does not mean it has already worked — the team still needs to review the full list, approve candidates, send the outreach, and see how those conversations progress. The 243 candidates are an output, not the outcome.

![A sanitized screenshot of the Slack completion message](placeholder:visual-04)

## The decisions that mattered

Several choices shaped how trustworthy and maintainable the system turned out to be.

**Google Sheets as the shared workspace.** Everyone on the team already knows how to use it, so there's no new tool to learn and no dashboard to build.

**Apollo for candidate data.** A licensed API key beats scraping LinkedIn — it's more reliable and doesn't put the company's accounts at risk.

**A person approves every candidate** before any outreach goes out. The agent sources and drafts; it doesn't decide who gets contacted.

**Claude drafts the outreach,** but a person on the team reviews and sends every message manually.

**Slack gets a short report after every run,** so the team always knows what happened without opening the sheet.

## How it got built

The first version took about an hour to set up, most of it going toward the Apollo trial and API key. The rest came together quickly once the plan was clear — which is what the interview step was for.

> "Interview me until your understanding is even better than what you can derive from this initial context."

That one instruction, added before any building started, is doing more work than anything else in this Build. It turned a rough outline into a plan with clear boundaries around what the agent should and shouldn't decide on its own.

## Make your own version

You don't need our exact stack to build something like this — the roles, companies, and candidate source can all change. The one rule worth keeping: a person stays between the agent and any outreach.

### Ships with this build · sanitized

- the original workflow proposal
- the "interview me" prompt
- the sheet layout
- the scheduled-task instructions
- the first Slack report

## Limitations, and what I'd change

This is a fast sourcing step, not a hiring result. It doesn't score or rank candidates beyond matching them to a role and company list, and it leans on Apollo's data being current. Next time I'd add a light scoring pass before candidates hit the review queue, so the person approving them spends less time on marginal fits.

Only about 20–30% of the candidates introduced by recruiting agencies were making it past the first interview. The new process will be a meaningful improvement if it sends a higher percentage of qualified people into follow-up interviews while reducing what we spend on recruiting agencies. I plan to update this Build as candidates move through the process — the next version should include how many people were approved, how outreach performed, and whether the interviews were any better.

STATUS · Sourcing complete / human review pending / outreach pending / interview results pending

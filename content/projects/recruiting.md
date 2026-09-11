---
title: "A recruiting workflow in a Google Sheet"
slug: recruiting
description: "A coworker's recruiting idea became a recurring workflow in Claude Cowork and Google Sheets. It has since led to interviews and one hire."
date: 2026-09-11
tags: [recruiting, claude-cowork, google-sheets, automation, agents]
sanitized: true
preview:
  src: /projects/recruiting/opengraph-image
  alt: "A recruiting workflow in a Google Sheet, with the teal card-selector artwork."
---

In July 2026, a coworker asked whether we could build an agent to help with recruiting. The company was using agencies to fill several open roles, but too many candidates were spending time in long interviews for jobs that weren't a good fit.

The coworker's message included an idea for where to look instead. Start with companies we thought did this work well. Find people there whose experience might fit our roles, then have someone on the team review them before reaching out.

We built a first version in about an hour. It used Claude Cowork, Apollo, a Google Sheet, and Slack. The first sourcing run returned 243 candidates across five roles in about five minutes.

## Working out what to build

I pasted the coworker's full message into Claude and added this instruction:

```text
Let's build this. But before we do, interview me relentlessly about the task until you are confident and aligned.
```

The message gave us a direction, but it left decisions open. Where would candidate data come from? Who would decide whether someone was worth contacting? Where would the team review the list, and how often should the agent run?

We worked through those choices with Claude before building, including which steps the agent would handle and which needed someone on the team.

## Four tabs and a recurring task

The shared workspace is a Google Sheet with four tabs:

- **Roles:** Job descriptions, salary ranges, location details, and the person responsible for outreach.
- **Companies:** Names and URLs of the companies we want to source from.
- **Candidates:** Names, locations, companies, job titles, LinkedIn profiles, and a dropdown for approving or rejecting each person.
- **Outreach Queue:** Draft messages for candidates the team has approved.

A recurring task in Claude Cowork is set to run every Monday and Thursday morning. It reads the roles and target companies, queries Apollo for people whose experience might fit, removes duplicates, and adds the new results to Candidates.

Apollo supplies the candidate data through an API key. Claude uses built-in connectors for Google Sheets and Slack, so we didn't need a separate recruiting app or database, or browser automation to scrape LinkedIn.

On each run, the task also checks for approved candidates. It prepares personalized connection notes and follow-up messages for them in Outreach Queue. Someone on the team reviews and sends those messages manually.

When the run finishes, Claude posts a summary in Slack: how many candidates it found for each role, anything that needs attention, and what the team should do next. The Sheet holds the work; Slack tells people it's ready to review.

## What the first run gave us

Most of the setup time went into creating the Apollo account, starting the trial, and connecting the API key. The rest was relatively straightforward.

The candidates came from companies on our target list. Claude flagged a few records where the name or job title might not match the LinkedIn profile. Stale data was one possible explanation, and those rows needed someone to check them.

I spot-checked some of the list. The people I reviewed worked at the intended companies and had titles related to our open roles. Given how quickly we'd put the system together, the results were better than I expected.

There was still plenty to do. A relevant title doesn't tell us whether someone wants to move or would be a good fit. At that point, the full review, outreach, and interviews were all ahead of us.

We were using Apollo's [14-day free trial](https://knowledge.apollo.io/hc/en-us/articles/5288168088205-Access-a-Free-Trial-of-Apollo). The plan was to decide what to pay for after seeing the outreach results and understanding the API limits we'd need.

## Interviews and a hire

As of September 11, the workflow has led to interviews and one new hire. I still want to see how it compares with the agencies across the whole hiring process.

Only about 20–30% of the candidates introduced by agencies were making it past the first interview. I'm interested in whether a higher share advances through our new process, and whether we can reduce agency spending.

If you're trying to put together a recurring task of your own, we can work through it in a [working session](/session).

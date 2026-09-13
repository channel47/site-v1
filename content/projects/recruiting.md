---
title: "A recruiting workflow in a Google Sheet"
slug: recruiting
description: "A coworker's idea became a recurring recruiting workflow in Claude Cowork and Google Sheets. The first run gave us a candidate list to work through."
date: 2026-09-11
storyDate: "2026-07"
updated: 2026-09-13
tags: [recruiting, claude-cowork, google-sheets, automation, agents]
sanitized: true
preview:
  src: /projects/recruiting/opengraph-image
  alt: "A recruiting workflow in a Google Sheet, with the teal card-selector artwork."
---

A coworker asked whether we could build an agent to help with recruiting. We had several open roles and were using agencies to fill them, but too many candidates were spending time in long interviews for jobs that weren't a good fit. Only about 20–30% of the people agencies introduced were making it past the first interview.

The coworker's message proposed a place to start: companies we thought did this work well. We could look for people there whose experience seemed relevant, review them ourselves, and decide whom to contact. It was specific enough to try, with several decisions still to make.

I pasted the full message into Claude and added this instruction:

```text
Let's build this. But before we do, interview me relentlessly about the task until you are confident and aligned.
```

We needed to decide where the candidate data would come from, who would review it, and how often the work should run. We also needed somewhere the team could use the results. Working through those questions with Claude helped us decide which steps to give the agent and which to keep with a person.

The first version took about an hour to build. It used Claude Cowork to run the task, Apollo as the source of professional contact data, a Google Sheet for the shared work, and Slack for notifications. Most of the setup time went into opening the Apollo account, starting the trial, and connecting its API key. Claude used connectors for Sheets and Slack.

The Sheet had four tabs, each holding a different part of the process. Roles contained the job descriptions, salary ranges, locations, and the person responsible for outreach. Companies held the names and URLs of businesses we wanted to source from. Those two tabs gave the agent its starting information.

The results went into Candidates: names, locations, employers, job titles, and LinkedIn profiles, with a dropdown for approving or rejecting each person. Outreach Queue held draft messages for the people the team approved. Someone could see the candidate, make a decision, and later review the proposed message in the same Sheet.

![The recruiting workflow: Roles and Companies guide a scheduled Cowork task that searches Apollo and adds candidates. The team approves candidates, Cowork drafts outreach, and a person reviews and sends it. Each run ends with a Slack summary.](/posts/recruiting-workflow.svg)

We set the task to run every Monday and Thursday morning. It reads the roles and target companies, searches Apollo for relevant people, removes duplicates, and adds new records to Candidates. It also checks for approvals from the team and prepares personalized connection notes and follow-up messages for those people in Outreach Queue.

The messages stay there until someone reviews and sends them manually. When the run finishes, Claude posts a Slack summary with the candidate count for each role, any issues, and the next steps for the team. The Sheet holds the work, and the notification tells people there's something ready to review.

On its first sourcing run, the agent returned 243 candidates across five roles in about five minutes. That was a list of people to investigate. We hadn't yet reviewed everyone, contacted them, or learned whether they wanted to move.

I spot-checked some of the records. The people I looked at worked at the intended companies and had titles related to our open roles. Given how quickly we'd put the workflow together, the results were better than I expected. The coworker's idea had become a list we could work through.

There were problems to check, too. Claude flagged records where a name or job title might not match the LinkedIn profile. Stale data was one possible explanation. Those rows needed a person to resolve the discrepancy before deciding whether to make contact. Even an accurate title couldn't tell us whether someone would be a good fit for the job.

We began on Apollo's [14-day trial](https://knowledge.apollo.io/hc/en-us/articles/5288168088205-Access-a-Free-Trial-of-Apollo). At the time, the plan was to choose what to pay for after seeing the outreach results and understanding the API limits we'd need. Getting the first list was enough to begin the experiment; it left the value of the recurring process to be seen.

By September, the recurring workflow had led to interviews and one new hire.

I still want to compare it with the agencies across the full hiring process. The questions now are how many of the people we approve respond, how many advance through interviews, and whether we can reduce agency spending. The first run showed we could find people to consider quickly. The next comparison needs to tell us how well we're choosing them.

If you're putting together a recurring task of your own, we can work through it in a [working session](/session).

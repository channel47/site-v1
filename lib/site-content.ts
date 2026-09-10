
/**
 * Sitewide copy and structural data — single source of truth for everything
 * the chrome and Home render. Kept here rather
 * than inline so copy edits never touch presentation.
 */

/** External links, kept in one place. */
export const LINKS = {
  join:
    "https://www.skool.com/the-vibe-marketers/about?ref=be313e8087da44cca0ecd7edd9ac0775",
  x: "https://x.com/ctrlswing",
  github: "https://github.com/ctrlswing",
  linkedin: "https://linkedin.com/in/ctrlswing",
  // More social profiles join the footer row as they're confirmed — never guess a URL.
  // Consumed by /session for the Cal.com booking CTA. The session offer is
  // demoted from primary CTA (2026-07): only the footer links to /session.
  booking: "https://cal.com/ctrlswing/15min",
} as const

/** Home copy and a small project selection. The latest note is automatic. */
export const HOME = {
  headline: "Things I’m making and figuring out.",
  subhead:
    "I’m Jackson. I build software, experiment with AI, and write about what I learn along the way. channel47 is where I share the work.",
  /** The bio block between "Browse all" and the footer. */
  name: "Jackson Dean",
  tagline: "Buying media · making software · following my curiosity",
  avatar: "/jackson.jpeg",
  bio: "I buy media for a living. Along the way, I build tools for myself, try out ideas, and follow the ones that catch my attention. Some become useful software. Others leave me with something worth sharing. This is where I keep both, including the work in progress.",
} as const

/** Working-session offer page. Keep the published offer facts intact. */
export const SESSION = {
  title: "Agentic Systems Working Session",
  intro:
    "Bring one recurring workflow from your work or business. We'll think through how agents could make it easier, using tools that fit the way you already work: conversation, diagrams, tool recommendations, process mapping, or live experimentation. A finished build isn't required for the hour to be useful.",
  introShort:
    "Bring one recurring workflow. In sixty minutes we map it together and decide where an agent could help.",
  steps: [
    "You bring one recurring workflow, and the tools already involved.",
    "We map how it works today, and where the time goes.",
    "We find where an agent could help, and where it shouldn't.",
    "You leave with a concrete approach and the next few steps, in tools you already use.",
  ],
  offer: {
    label: "Book a working session",
    rows: [
      { label: "Duration", value: "60 minutes" },
      { label: "Price", value: "$250 USD" },
      { label: "Format", value: "One to one, live" },
      { label: "Capacity", value: "Four a month" },
    ],
    cta: "Book a session",
    microcopy:
      "Booking and payment happen on Cal.com. You'll pick a time and pay to confirm.",
  },
  personal: {
    name: "Jackson Dean",
    meta: "7 years buying media · building agentic systems",
    bio: "I run ad accounts for a living and build agentic systems for the recurring work around them. I use agents for recurring tasks, such as pulling account data and preparing weekly reports. I share what I learn here.",
    bioShort:
      "I run ad accounts for a living and build agentic systems for the recurring work around them. I use agents to pull account data and prepare weekly reports.",
  },
  boundary: {
    label: "What the session covers",
    body: "It's probably not the right fit if you primarily need someone to debug an existing automation or implement a large project during the call. The hour is for thinking through one workflow together.",
    bodyShort:
      "Not the right fit if you mainly need someone to debug an existing automation or ship a large project during the call. The hour is for thinking through one workflow together.",
  },
} as const

/** Sitewide email-capture copy. */
export const CAPTURE = {
  cta: "Subscribe",
  helper:
    "Occasional emails with new projects, experiments, and notes. No fixed schedule.",
  successTitle: "You're on the list.",
  successHelper: "You'll hear from me when there is something new to share.",
} as const

/** External links, kept in one place. */
export const LINKS = {
  x: "https://x.com/ctrlswing",
  github: "https://github.com/ctrlswing",
  booking: "https://cal.com/ctrlswing/15min",
} as const

/** Shared author biography. */
export const AUTHOR = {
  name: "Jackson Dean",
  avatar: "/jackson.jpeg",
  bio: "I buy media for a living. I also use AI to explore ideas and make things I couldn’t make before, from a ballet website for my fiancée to tools for my own work.",
} as const

/** Working-session offer page. Keep the published offer facts intact. */
export const SESSION = {
  title: "Agentic Systems Working Session",
  intro:
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
    bio: "I run ad accounts for a living and build agentic systems for the recurring work around them. I use agents for recurring tasks, such as pulling account data and preparing weekly reports. I share what I learn here.",
  },
  boundary: {
    label: "What the session covers",
    body: "It's probably not the right fit if you primarily need someone to debug an existing automation or implement a large project during the call. The hour is for thinking through one workflow together.",
  },
} as const

/** Sitewide email-capture copy. */
export const CAPTURE = {
  title: "Follow the experiments.",
  cta: "Subscribe",
  helper:
    "Occasional emails about what I’m making, what I’m learning, and where it leads next. No fixed schedule.",
  successTitle: "You're on the list.",
  successHelper: "You'll hear from me when there is something new to share.",
} as const

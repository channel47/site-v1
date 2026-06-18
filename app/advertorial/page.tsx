import type { Metadata } from "next"
import { Logo47 } from "@/components/logo-47"
import { BookingCalendar } from "@/components/booking-calendar"

export const metadata: Metadata = {
  title: "Advertorial teardown — channel47",
  description:
    "The page between the ad and the checkout. Book a free teardown and see where an advertorial earns its place in your funnel. Tue & Thu, 2–4pm PT.",
}

const STAGES = [
  { index: "01", name: "The ad", note: "Wins the click. A hook and a promise — nothing more." },
  {
    index: "02",
    name: "The advertorial",
    note: "Earns the belief. Turns a cold, skeptical click into a warm buyer.",
    signal: true,
  },
  { index: "03", name: "The checkout", note: "Takes the order. By now the selling is already done." },
]

const PROCESS = ["Customer research", "Personas", "Angles", "Advertorial"]

export default function AdvertorialPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="mx-auto flex w-full max-w-[var(--page-max)] items-center justify-between px-[var(--page-gutter)] py-6">
        <a href="/" className="group flex items-center gap-3" aria-label="channel47 home">
          <Logo47 delay={120} />
          <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-muted-foreground transition-colors group-hover:text-foreground">
            channel47
          </span>
        </a>
        <a
          href="#book"
          className="border-b border-foreground/70 pb-0.5 font-mono text-[11px] uppercase tracking-[0.08em] text-foreground transition-colors hover:border-accent hover:text-accent"
        >
          Book a teardown
        </a>
      </header>

      {/* Hero — typography is the product */}
      <section className="mx-auto w-full max-w-[var(--page-max)] px-[var(--page-gutter)] pb-24 pt-16 sm:pt-24">
        <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
          The page between the ad and the checkout
        </p>

        <div className="mt-10 grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(240px,340px)] lg:items-end">
          <h1 className="font-display text-[clamp(3.25rem,9vw,8.5rem)] font-semibold leading-[0.88] tracking-[-0.02em]">
            <span className="reveal-line">
              <span>The missing</span>
            </span>
            <span className="reveal-line">
              <span>page between</span>
            </span>
            <span className="reveal-line">
              <span>ad and sale.</span>
            </span>
          </h1>

          <p className="max-w-sm text-pretty text-lg leading-[1.5] text-muted-foreground lg:pb-3">
            Most funnels send cold traffic straight from an ad to a product page and wonder why it stalls. The
            advertorial is the page in between — built from <span className="mark">real customer language</span>:
            research, personas, angles, then the page.
          </p>
        </div>

        <div className="mt-16 flex flex-col gap-6">
          <span className="rule-grow block h-px w-full bg-accent" aria-hidden="true" />
          <div className="flex flex-wrap items-center gap-x-8 gap-y-3 font-mono text-[12px] text-muted-foreground">
            <a href="#book" className="text-foreground transition-colors hover:text-accent">
              → Book a free teardown
            </a>
            <span>15 minutes · live · Tue &amp; Thu, 2–4pm PT</span>
          </div>
        </div>
      </section>

      {/* Where it fits — editorial sequence, no cards */}
      <section className="mx-auto w-full max-w-[var(--page-max)] px-[var(--page-gutter)] py-20">
        <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground">Where it fits</p>
        <div className="mt-10 border-t border-border">
          {STAGES.map((stage) => (
            <div
              key={stage.index}
              className="grid grid-cols-[auto_1fr] items-baseline gap-x-6 gap-y-2 border-b border-border py-8 sm:grid-cols-[5rem_minmax(0,16rem)_1fr] sm:gap-x-10"
            >
              <span
                className={`font-mono text-[12px] ${stage.signal ? "text-accent" : "text-muted-foreground"}`}
              >
                {stage.index}
              </span>
              <h2
                className={`font-display text-3xl font-medium tracking-[-0.01em] sm:text-4xl ${
                  stage.signal ? "text-foreground" : "text-foreground/90"
                }`}
              >
                {stage.name}
              </h2>
              <p className="col-span-2 max-w-md font-mono text-[13px] leading-6 text-muted-foreground sm:col-span-1">
                {stage.note}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* The system — the exact process, as a line not a grid of boxes */}
      <section className="mx-auto w-full max-w-[var(--page-max)] px-[var(--page-gutter)] py-20">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-end">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground">Built live</p>
            <h2 className="mt-8 font-display text-[clamp(2rem,4vw,3.25rem)] font-medium leading-[1.02] tracking-[-0.015em]">
              The exact process I&rsquo;ll run on your funnel.
            </h2>
          </div>
          <p className="max-w-md text-pretty text-base leading-7 text-muted-foreground lg:pb-2">
            An agent skill runs the work in order — research the buyer, generate the personas, pull the angles, draft
            the advertorial. On the call I&rsquo;ll run the first stage against your real product, live, so you can see
            exactly where it earns its place.
          </p>
        </div>

        <ol className="mt-14 flex flex-wrap items-center gap-x-5 gap-y-4 font-display text-2xl font-medium tracking-[-0.01em] sm:text-3xl">
          {PROCESS.map((step, i) => (
            <li key={step} className="flex items-center gap-5">
              <span>{step}</span>
              {i < PROCESS.length - 1 && (
                <span className="font-mono text-accent" aria-hidden="true">
                  →
                </span>
              )}
            </li>
          ))}
        </ol>
      </section>

      {/* Book — the real calendar */}
      <section id="book" className="scroll-mt-6 border-t border-border">
        <div className="mx-auto grid w-full max-w-[var(--page-max)] gap-14 px-[var(--page-gutter)] py-20 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground">Take the next step</p>
            <h2 className="mt-8 font-display text-[clamp(2.5rem,5vw,4.5rem)] font-semibold leading-[0.92] tracking-[-0.02em]">
              Book a free teardown.
            </h2>
            <p className="mt-8 max-w-sm text-pretty text-base leading-7 text-muted-foreground">
              Tell me what you&rsquo;re selling and I&rsquo;ll pull your funnel apart on a 15-minute call — where
              it&rsquo;s leaking, and the advertorial angle that plugs it. No deck, no obligation.
            </p>
            <p className="mt-8 font-mono text-[12px] leading-6 text-muted-foreground">
              Availability: Tuesdays &amp; Thursdays, 2–4pm PT.
            </p>
          </div>
          <div>
            <BookingCalendar />
          </div>
        </div>
      </section>

      <footer className="border-t border-border">
        <div className="mx-auto flex w-full max-w-[var(--page-max)] items-center justify-between px-[var(--page-gutter)] py-7 font-mono text-[11px] uppercase tracking-[0.08em] text-muted-foreground">
          <span>channel47</span>
          <a className="transition-colors hover:text-foreground" href="mailto:jackson@channel47.dev">
            jackson@channel47.dev
          </a>
        </div>
      </footer>
    </main>
  )
}

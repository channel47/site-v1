import type { Metadata } from "next"
import { Logo47 } from "@/components/logo-47"
import { TeardownForm } from "@/components/teardown-form"

export const metadata: Metadata = {
  title: "Advertorial teardown — channel47",
  description:
    "The page that sits between the ad and the checkout. See where an advertorial earns its place in your funnel — book a free 15-minute teardown.",
}

const STAGES = [
  {
    tag: "01 / The ad",
    title: "Wins the click",
    body: "A hook and a promise. Its whole job is to interrupt the scroll and earn the next tap — nothing more.",
  },
  {
    tag: "02 / The advertorial",
    title: "Earns the belief",
    body: "The missing middle. Editorial-style proof that turns a cold, skeptical click into a warm buyer who already understands why the product is right for them.",
    highlight: true,
  },
  {
    tag: "03 / The PDP / checkout",
    title: "Takes the order",
    body: "By the time they land here, the selling is done. The page just has to remove friction and close.",
  },
]

export default function AdvertorialPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="mx-auto flex w-full max-w-[var(--page-max)] items-center justify-between px-[var(--page-gutter)] py-5">
        <a href="/" className="group flex items-center gap-3" aria-label="channel47 home">
          <Logo47 delay={120} />
          <span className="font-mono text-[11px] uppercase text-muted-foreground transition-colors group-hover:text-foreground">
            channel47
          </span>
        </a>
        <nav className="flex items-center gap-5 font-mono text-[11px] uppercase text-muted-foreground">
          <a className="transition-colors hover:text-foreground" href="#book">
            Book a teardown
          </a>
        </nav>
      </header>

      {/* Hero */}
      <section className="mx-auto w-full max-w-[var(--page-max)] px-[var(--page-gutter)] pb-16 pt-10 sm:pt-16">
        <p className="font-mono text-[11px] uppercase tracking-wide text-muted-foreground">
          The page between the ad and the checkout
        </p>
        <h1 className="mt-6 max-w-4xl text-balance text-5xl font-medium leading-[0.98] sm:text-7xl">
          Your ad gets the click. Your advertorial gets the sale.
        </h1>
        <p className="mt-8 max-w-2xl text-pretty font-mono text-sm leading-7 text-muted-foreground">
          Most ecommerce funnels send cold traffic straight from an ad to a product page and wonder why it doesn't
          convert. The fix is the page in the middle — the advertorial. I build them with an agent skill that runs
          customer research, generates personas, and writes the angles before a word of copy gets drafted.
        </p>
        <div className="mt-10 flex flex-wrap items-center gap-4">
          <a
            href="#book"
            className="inline-flex items-center justify-center rounded-none bg-accent px-6 py-3 font-mono text-[12px] uppercase tracking-wide text-background transition-opacity hover:opacity-90"
          >
            Book a free teardown
          </a>
          <span className="font-mono text-[11px] uppercase text-muted-foreground">15 minutes · live · no pitch deck</span>
        </div>
      </section>

      {/* Where it fits */}
      <section className="border-y border-border">
        <div className="mx-auto w-full max-w-[var(--page-max)] px-[var(--page-gutter)] py-16">
          <p className="font-mono text-[11px] uppercase tracking-wide text-muted-foreground">Where it fits</p>
          <div className="mt-8 grid gap-px overflow-hidden border border-border sm:grid-cols-3">
            {STAGES.map((stage) => (
              <div
                key={stage.tag}
                className={`flex flex-col gap-3 p-6 ${stage.highlight ? "bg-accent/[0.06]" : "bg-background"}`}
              >
                <p
                  className={`font-mono text-[11px] uppercase tracking-wide ${
                    stage.highlight ? "text-accent" : "text-muted-foreground"
                  }`}
                >
                  {stage.tag}
                </p>
                <h2 className="text-2xl font-medium leading-tight">{stage.title}</h2>
                <p className="font-mono text-[13px] leading-6 text-muted-foreground">{stage.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Proof — drop the advertorial you build live here */}
      <section className="mx-auto w-full max-w-[var(--page-max)] px-[var(--page-gutter)] py-16">
        <p className="font-mono text-[11px] uppercase tracking-wide text-muted-foreground">Built live</p>
        <h2 className="mt-6 max-w-3xl text-balance text-3xl font-medium leading-tight sm:text-4xl">
          This is the exact process I'll run on your funnel.
        </h2>
        <p className="mt-6 max-w-2xl font-mono text-sm leading-7 text-muted-foreground">
          Research the buyer → generate the personas → pull the angles → draft the advertorial. On the teardown I'll show
          you the first stage of it against your real product, live, so you can see exactly where it earns its place.
        </p>
        <ol className="mt-10 grid gap-px overflow-hidden border border-border sm:grid-cols-4">
          {["Customer research", "Personas", "Angles", "Advertorial"].map((step, i) => (
            <li key={step} className="flex flex-col gap-2 bg-background p-5">
              <span className="font-mono text-[11px] text-muted-foreground">{String(i + 1).padStart(2, "0")}</span>
              <span className="text-sm font-medium">{step}</span>
            </li>
          ))}
        </ol>
      </section>

      {/* Book */}
      <section id="book" className="border-t border-border scroll-mt-8">
        <div className="mx-auto grid w-full max-w-[var(--page-max)] gap-12 px-[var(--page-gutter)] py-16 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-wide text-muted-foreground">Take the next step</p>
            <h2 className="mt-6 max-w-md text-balance text-4xl font-medium leading-[1.02]">
              Book a free advertorial teardown.
            </h2>
            <p className="mt-6 max-w-md font-mono text-sm leading-7 text-muted-foreground">
              Tell me what you're selling and I'll pull your funnel apart on a 15-minute call — where it's leaking, and
              the advertorial angle that plugs it. No deck, no obligation.
            </p>
          </div>
          <div className="lg:pt-2">
            <TeardownForm />
          </div>
        </div>
      </section>

      <footer className="border-t border-border">
        <div className="mx-auto flex w-full max-w-[var(--page-max)] items-center justify-between px-[var(--page-gutter)] py-6 font-mono text-[11px] uppercase text-muted-foreground">
          <span>channel47</span>
          <a className="transition-colors hover:text-foreground" href="mailto:jackson@channel47.dev">
            jackson@channel47.dev
          </a>
        </div>
      </footer>
    </main>
  )
}

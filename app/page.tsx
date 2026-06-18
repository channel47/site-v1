import { Logo47 } from "@/components/logo-47"

export default function Page() {
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
          <a className="transition-colors hover:text-foreground" href="mailto:jackson@channel47.dev">
            Contact
          </a>
        </nav>
      </header>

      <section className="mx-auto grid min-h-[calc(100vh-84px)] w-full max-w-[var(--page-max)] items-center gap-12 px-[var(--page-gutter)] py-16 lg:grid-cols-[minmax(0,0.82fr)_280px]">
        <div>
          <p className="font-mono text-[11px] uppercase text-muted-foreground">
            New site in progress
          </p>
          <h1 className="mt-6 max-w-3xl text-balance text-5xl font-medium leading-[0.98] sm:text-7xl lg:text-8xl">
            Clean slate. Same signal.
          </h1>
          <p className="mt-8 max-w-xl text-pretty font-mono text-sm leading-7 text-muted-foreground">
            channel47 is being rebuilt around the parts that still feel true: practical AI workflows, ecommerce
            creative strategy, and the little blocky mark that survived the mess.
          </p>
        </div>

        <div className="hidden justify-self-end lg:block">
          <Logo47 delay={220} size="lg" />
        </div>
      </section>
    </main>
  )
}

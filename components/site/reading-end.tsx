import { MeasuredLink } from "./measured-link";
import { getNextRead } from "@/lib/content";
import { Capture } from "./capture";
import { BackToBrowse } from "./browse-navigation";
import { DirectionCue } from "./direction-cue";
export function ReadingEnd({ href, newsletter }: { href: string; newsletter?: string }) {
  const next = getNextRead(href);
  return (
    <aside className="reading-end" aria-label="Keep exploring">
      {next ? (
        <nav aria-label="Related reading">
          <MeasuredLink href={next.href} className="next-read" event="related_click">
            <span className="next-read-label">Read next</span>
            <span className="next-read-title">{next.title}</span>
            <DirectionCue />
          </MeasuredLink>
        </nav>
      ) : null}
      <section className="reading-subscribe" aria-label="Subscribe">
        <h2>Follow what I’m working on.</h2>
        <Capture placement="article_end" helper={newsletter ? `${newsletter} Occasional emails, no fixed schedule.` : undefined} />
      </section>
      <BackToBrowse href="/" className="reading-back" />
    </aside>
  );
}

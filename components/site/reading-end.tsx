import { MeasuredLink } from "./measured-link";
import { getNextRead } from "@/lib/content";
import { Capture } from "./capture";
import { BackToBrowse } from "./browse-navigation";
import { DirectionCue } from "./direction-cue";
export function ReadingEnd({ href }: { href: string }) {
  const next = getNextRead(href);
  return (
    <aside className="reading-end" aria-label="Keep exploring">
      {next ? (
        <MeasuredLink
          href={next.href}
          className="next-read"
          event="related_click"
        >
          <span className="utility-label">Next</span>
          <span className="next-read-title">{next.title}</span>
          <DirectionCue />
        </MeasuredLink>
      ) : null}
      <section className="reading-subscribe" aria-label="Subscribe">
        <h2>Follow what I’m working on.</h2>
        <Capture placement="article_end" />
      </section>
      <BackToBrowse href="/" className="reading-back" />
    </aside>
  );
}

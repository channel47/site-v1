"use client";

import Link from "next/link";
import { useState } from "react";
import { AnimatedMark } from "./animated-mark";
import { MARK_PATH, MARK_VIEWBOX } from "./mark";
import styles from "./mark-study.module.css";

export function MarkStudy() {
  const [play, setPlay] = useState(0);
  const [slow, setSlow] = useState(false);
  const [tone, setTone] = useState("reversed");
  const replay = () => setPlay((value) => value + 1);

  return (
    <main id="main-content" className={styles.sheet}>
      <header className={styles.header}>
        <Link href="/">channel47</Link><span>Identity / Motion study</span>
      </header>
      <section className={styles.stage} data-tone={tone} data-slow={slow} aria-label="Animated logo preview">
        <button className={styles.hero} onClick={replay} aria-label="Replay Channel47 logo animation">
          <AnimatedMark play={play} />
        </button>
        <span className={styles.hint} aria-hidden="true">Tap the mark to replay</span>
      </section>
      <div className={styles.controls}>
        <div className={styles.playback} role="group" aria-label="Playback">
          <button className={styles.replay} onClick={replay}>Replay animation</button>
          <button aria-pressed={slow} onClick={() => { setSlow(!slow); replay(); }}>Slow motion</button>
        </div>
        <div className={styles.tones} role="group" aria-label="Preview color">
          {[["reversed", "Reversed"], ["ink", "Ink"], ["cobalt", "Cobalt"]].map(([value, label]) => (
            <button key={value} aria-pressed={tone === value} onClick={() => { setTone(value); replay(); }}>{label}</button>
          ))}
        </div>
      </div>
      <p className={styles.reduced}>Your reduced-motion setting is on. The finished mark stays still.</p>
      <div className={styles.intro}>
        <h1>The mark,<br /> in motion.</h1>
        <p>Six parts find their place. A blue signal follows the build, then fades into the finished 47. A more expressive entrance, with the same precise silhouette at rest.</p>
      </div>
      <section className={styles.scale} aria-label="Logo at interface sizes">
        <h2>From the big moment to the small details.</h2>
        <div className={styles.samples}>
          {[96, 48, 40, 28].map((width) => (
            <figure key={width}>
              <svg viewBox={MARK_VIEWBOX} width={width} height={width / 2} fill="currentColor" aria-hidden="true"><path d={MARK_PATH} /></svg>
              <figcaption>{width}px</figcaption>
            </figure>
          ))}
        </div>
      </section>
      <footer className={styles.footer}>
        <Link href="/">See it on the site ↗</Link>
        <a href="/brand/channel47-mark-ink.svg" download>SVG master ↓</a>
        <span>One entrance. Replay whenever you like.</span>
      </footer>
    </main>
  );
}

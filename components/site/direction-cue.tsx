import { ArrowRight } from "@phosphor-icons/react/dist/ssr";

/** A fixed-size destination cue, separate from the display typography. */
export function DirectionCue() {
  return (
    <span className="direction-cue" aria-hidden="true">
      <ArrowRight size={20} weight="regular" />
    </span>
  );
}

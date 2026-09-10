import { AUTHOR } from "@/lib/site-content";

/** The original square crop, upright and shared by every author placement. */
export function AuthorPortrait({ alt = AUTHOR.name }: { alt?: string }) {
  return (
    <img
      src={AUTHOR.avatar}
      alt={alt}
      width={64}
      height={64}
      className="author-portrait"
    />
  );
}

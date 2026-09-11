import { getContentEntries, getEntryPreview } from "./content";

/** Presentation only. Article text remains in content/. */
const COVERS = [
  {
    id: "ballet-site",
    href: "/projects/ballet-born-simple",
    label: "Websites",
    image: "ballet-pointe",
    angle: -2,
  },
  {
    id: "phantomrack",
    href: "/projects/phantomrack",
    label: "Audio experiment",
    image: "phantom-faders",
    angle: 2,
  },
  {
    id: "recruiting",
    href: "/projects/recruiting",
    label: "Recruiting workflow",
    image: "recruiting-selector",
    angle: -2,
  },
  {
    id: "vellum",
    href: "/projects/vellum",
    label: "Creative workspace",
    image: "vellum-contact-sheet",
    angle: -2,
  },
  {
    id: "research-lens",
    href: "/notes/customer-research-ad-angles-claude",
    label: "Creative strategy",
    image: "research-loupe",
    angle: -2,
  },
  {
    id: "flow-specimen",
    href: "/notes/codex-static-ads-google-flow",
    label: "Creative workflow",
    image: "elt-specimen",
    angle: -3,
  },
  {
    id: "ads-story",
    href: "/projects/google-ads",
    label: "Story & source",
    image: "ads-plug",
    angle: 2,
  },
] as const;
export interface CollectionItem {
  id: string;
  href: string;
  title: string;
  label: string;
  src: string;
  srcSet?: string;
  angle: number;
  silhouette?: string;
}
export function getCollectionItems(): CollectionItem[] {
  const entries = getContentEntries();
  const entriesByPath = new Map(
    entries.map(
      ({ collection, item }) => [`${collection.basePath}/${item.slug}`, item],
    ),
  );
  const covers: CollectionItem[] = COVERS.map((cover) => {
    const entry = entriesByPath.get(cover.href);
    if (!entry)
      throw new Error(`Cover has no published piece: ${cover.href}`);
    return {
      ...cover,
      title: entry.title,
      // The approved covers share this photographed footprint. Dark mode
      // clips only the white studio surround; the source files stay untouched.
      silhouette: "inset(8.8% 8.7% 8.8% 8.8% round 0.6%)",
      src: `/collection/${cover.image}.webp`,
      srcSet: `/collection/${cover.image}-480.webp 480w, /collection/${cover.image}.webp 960w`,
    };
  });
  // New real images can join without custom art. Text-only pieces remain in Index.
  for (const { collection, item } of entries) {
    const href = `${collection.basePath}/${item.slug}`;
    if (covers.some((cover) => cover.href === href)) continue;
    const preview = getEntryPreview(item);
    if (preview)
      covers.push({
        id: `${collection.key}-${item.slug}`,
        href,
        title: item.title,
        label: collection.singularLabel,
        src: preview.src,
        angle: 0,
      });
  }
  return covers;
}

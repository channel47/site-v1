import { getContentEntries, getEntryPreview } from "./content";

/** Presentation only. Article text remains in content/. */
const COVERS = [
  {
    id: "research-lens",
    href: "/notes/customer-research-ad-angles-claude",
    title: "Turning customer research into ad angles with Claude",
    label: "Creative strategy",
    image: "research-lens",
    angle: -2,
  },
  {
    id: "flow-specimen",
    href: "/notes/codex-static-ads-google-flow",
    title: "From Google Flow to making whole ads in Codex",
    label: "Creative workflow",
    image: "flow-specimen",
    angle: -3,
  },
  {
    id: "ads-story",
    href: "/projects/google-ads",
    title: "How I built my Google Ads MCP",
    label: "Story & source",
    image: "ads-channels",
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
  const paths = new Set(
    entries.map(
      ({ collection, item }) => `${collection.basePath}/${item.slug}`,
    ),
  );
  const covers: CollectionItem[] = COVERS.map((cover) => {
    if (!paths.has(cover.href.split("#")[0]))
      throw new Error(`Cover has no published piece: ${cover.href}`);
    return {
      ...cover,
      // The three approved slabs share this photographed footprint. Dark mode
      // clips only the white studio surround; the source files stay untouched.
      silhouette: "inset(8.8% 8.7% 8.8% 8.8% round 0.6%)",
      src: `/collection/${cover.image}.webp`,
      srcSet: `/collection/${cover.image}-480.webp 480w, /collection/${cover.image}.webp 960w`,
    };
  });
  // New real images can join without custom art. Text-only pieces remain in Index.
  for (const { collection, item } of entries) {
    const href = `${collection.basePath}/${item.slug}`;
    if (covers.some((cover) => cover.href.split("#")[0] === href)) continue;
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

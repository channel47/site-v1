import { getContentEntries, getEntryPreview } from "./content";

/** Presentation only. Article text remains in content/. */
const COVERS = [
  {
    id: "flow-specimen",
    href: "/notes/google-flow-reference-led-product-imagery",
    title: "Two references. Then Flow.",
    label: "Image study",
    image: "flow-specimen",
    angle: -3,
  },
  {
    id: "elt",
    href: "/notes/codex-static-ads-google-flow",
    title: "Making the whole ad in Codex",
    label: "ELT · experiment",
    image: "elt-square",
    angle: 2,
  },
  {
    id: "ads-story",
    href: "/notes/google-ads-mcp",
    title: "How I built my Google Ads MCP",
    label: "Build notes",
    image: "ads-channels",
    angle: 2,
  },
  {
    id: "ads-connector",
    href: "/projects/google-ads",
    title: "Google Ads MCP",
    label: "Connector",
    image: "ads-connection",
    angle: -2,
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

import type { Metadata } from "next";
import { Collection } from "@/components/site/collection";
import { SiteHeader } from "@/components/site/header";
import { SiteFooter } from "@/components/site/footer";
import { getCollectionItems } from "@/lib/collection";
import { getEditorialPreview } from "@/lib/editorial-preview";
export const metadata: Metadata = { alternates: { canonical: "/" } };
export default function Page() {
  const items = getCollectionItems();
  const preview = getEditorialPreview("vellum");
  if (preview) items.push(preview.cover);
  return (
    <div className="st-page collection-page">
      <SiteHeader home />
      <main id="main-content" className="collection-main">
        <h1 className="sr-only">Projects and experiments by Jackson Dean</h1>
        <Collection items={items} />
      </main>
      <SiteFooter />
    </div>
  );
}

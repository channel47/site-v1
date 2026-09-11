import type { Metadata } from "next";
import { Collection } from "@/components/site/collection";
import { SiteHeader } from "@/components/site/header";
import { SiteFooter } from "@/components/site/footer";
import { getCollectionItems } from "@/lib/collection";
export const metadata: Metadata = { alternates: { canonical: "/" } };
export default function Page() {
  const items = getCollectionItems();
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

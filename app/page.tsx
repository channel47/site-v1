import type { Metadata } from "next";
import Link from "next/link";
import { Collection } from "@/components/site/collection";
import { SiteHeader } from "@/components/site/header";
import { SiteFooter } from "@/components/site/footer";
import { getCollectionItems } from "@/lib/collection";
export const metadata: Metadata = { alternates: { canonical: "/" } };
export default function Page() {
  const items = getCollectionItems();
  return (
    <div className="st-page collection-page">
      <SiteHeader home browseView="collection" />
      <main id="main-content" className="collection-main">
        <h1 className="sr-only">Collection</h1>
        <div className="collection-intro">
          <p>
            I’m <Link href="/about">Jackson</Link>. I experiment with AI to
            understand what it’s capable of and, in turn, what I might be capable
            of. This is a collection of that work, with ideas you can take further.
          </p>
        </div>
        <Collection items={items} />
      </main>
      <SiteFooter />
    </div>
  );
}

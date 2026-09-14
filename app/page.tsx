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
        <div className="collection-intro">
          <h1>Things I’m making <i>and figuring out.</i></h1>
          <p>
            I’m <Link href="/about">Jackson</Link>. I buy media for a living, build tools for myself,
            and follow the ideas that catch my attention. This is where I share
            what I’m learning along the way.
          </p>
        </div>
        <Collection items={items} />
      </main>
      <SiteFooter />
    </div>
  );
}

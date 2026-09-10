import Link from "next/link";
import { SiteHeader } from "@/components/site/header";
import { SiteFooter } from "@/components/site/footer";
import { AUTHOR } from "@/lib/site-content";
import { pageMetadata } from "@/lib/seo";
import { AuthorPortrait } from "@/components/site/author-portrait";
import { SocialLinks } from "@/components/site/social-links";
import { EnvelopeSimple } from "@phosphor-icons/react/dist/ssr";
export const metadata = pageMetadata({
  title: "About Jackson",
  description: AUTHOR.bio,
  path: "/about",
});
export default function AboutPage() {
  return (
    <div className="st-page">
      <SiteHeader />
      <main id="main-content" className="st-shell about-page">
        <header className="st-head author-heading about-heading">
          <AuthorPortrait alt="" />
          <h1 className="st-h1">I’m Jackson.</h1>
        </header>
        <div className="st-prose">
          <p>{AUTHOR.bio}</p>
          <p>
            This collection brings together experiments with images, software,
            and the work of making things.
          </p>
        </div>
        <div className="about-follow">
          <Link href="/newsletter" className="about-email">
            <EnvelopeSimple size={18} aria-hidden="true" />
            Occasional emails
          </Link>
          <SocialLinks />
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

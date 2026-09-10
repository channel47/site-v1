import Link from "next/link";
import { SiteHeader } from "@/components/site/header";
import { SiteFooter } from "@/components/site/footer";
import { AUTHOR, LINKS } from "@/lib/site-content";
import { pageMetadata } from "@/lib/seo";
import { ArrowUpRight, EnvelopeSimple, GithubLogo, XLogo } from "@phosphor-icons/react/dist/ssr";
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
        <img
          src={AUTHOR.avatar}
          alt="Jackson Dean"
          width={96}
          height={120}
          className="author-portrait about-avatar"
        />
        <header className="st-head">
          <h1 className="st-h1">I’m Jackson.</h1>
        </header>
        <div className="st-prose">
          <p>{AUTHOR.bio}</p>
          <p>
            This collection brings together experiments with images, software,
            and the work of making things.
          </p>
        </div>
        <nav className="about-links" aria-label="More from Jackson">
          <Link href="/newsletter"><EnvelopeSimple size={18} aria-hidden="true" />Occasional emails</Link>
          <a href={LINKS.x}><XLogo size={16} aria-hidden="true" />X<ArrowUpRight size={12} aria-hidden="true" /></a>
          <a href={LINKS.github}><GithubLogo size={18} aria-hidden="true" />GitHub<ArrowUpRight size={12} aria-hidden="true" /></a>
        </nav>
      </main>
      <SiteFooter />
    </div>
  );
}

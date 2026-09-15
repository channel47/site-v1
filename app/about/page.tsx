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
            There’s efficiency AI, which helps me get through work faster, and
            there’s what I think of as opportunity AI: being able to do something
            I couldn’t do before. Opportunity is the part that excites me. When
            I experiment with a model, I’m exploring its capabilities and, in
            turn, my own.
          </p>
          <p>
            I want that exploration to help me develop skills of my own. Some
            of the appeal is being able to express myself in ways I haven’t been
            able to before, without needing every new interest to pay off
            professionally. I’m also interested in how those abilities might
            let us contribute more to the culture we’re part of.
          </p>
          <p>
            This site is a personal portfolio and a place to keep those
            experiments. The projects and essays are a way to show how my
            thinking develops, and to connect ideas that continue from one
            project to the next.
          </p>
          <p>
            You can <Link href="/browse">browse the projects and essays</Link>
            {" "}or <Link href="/tools">explore the tools</Link>. If something
            interests you, take the idea and see what you can do with it.
          </p>
        </div>
        <div className="about-follow">
          <Link href="/newsletter" className="about-email">
            <EnvelopeSimple size={18} aria-hidden="true" />
            Follow by email
          </Link>
          <SocialLinks />
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

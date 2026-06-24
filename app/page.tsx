import { LINKS, TESTIMONIALS } from "@/lib/landing-content"
import { MemberShell } from "@/components/landing/member-shell"
import { MemberBar } from "@/components/landing/member-bar"
import { Nav } from "@/components/landing/nav"
import { CategoryStack } from "@/components/landing/category-stack"
import { Testimonial } from "@/components/landing/testimonial"
import { SectionHeading } from "@/components/landing/section-heading"
import { SystemsCoverflow } from "@/components/landing/systems-coverflow"
import { AccessSection } from "@/components/landing/access-section"
import { FaqList } from "@/components/landing/faq-list"
import { SiteFooter } from "@/components/landing/site-footer"

const bodyText = {
  fontSize: "var(--text-base)",
  lineHeight: 1.62,
  color: "var(--ink-soft)",
} as const

const linkStyle = {
  color: "var(--accent-ink)",
  borderBottom: "1px solid oklch(0.52 0.145 38 / 0.4)",
} as const

export default function Page() {
  return (
    <MemberShell>
      <MemberBar />
      <Nav />

      <div id="top" style={{ maxWidth: 660, margin: "0 auto", padding: "0 28px" }}>
        {/* Hero */}
        <CategoryStack />

        {/* Intro */}
        <section style={{ paddingTop: 64 }}>
          <p style={bodyText}>
            Seven years ago I started out as a performance marketer. After{" "}
            <span style={{ fontWeight: 600 }}>$3M+</span> across Facebook,
            Google, Pinterest, TikTok, Bing and — lately — ChatGPT ads, I’ve
            learned a thing or two about driving paid traffic.
          </p>
          <p style={{ ...bodyText, marginTop: 18 }}>
            But more importantly, I learned about the underlying{" "}
            <span style={{ color: "var(--ink-strong)", fontWeight: 600 }}>systems</span> it
            takes to drive{" "}
            <span style={{ color: "var(--ink-strong)", fontWeight: 600 }}>effective</span>{" "}
            traffic — the kind that doesn’t just hit KPI targets, but beats
            them.
          </p>
          <p style={{ ...bodyText, marginTop: 16 }}>
            With the advent of agentic tools like Claude Code, Codex and others,
            those systems are now directly transferable — both as concrete
            artifacts and as an educational layer.
          </p>
          <p
            style={{
              fontSize: "var(--text-base)",
              lineHeight: 1.6,
              color: "var(--ink-strong)",
              marginTop: 18,
              fontWeight: 600,
            }}
          >
            Channel 47 provides both.
          </p>
        </section>

        <Testimonial {...TESTIMONIALS[0]} />

        {/* The Systems */}
        <section style={{ paddingTop: 64 }}>
          <SectionHeading>The Systems</SectionHeading>
          <p style={bodyText}>
            Everything I build lives here. It’s organized into shelves —
            the&nbsp;<strong>systems</strong>, the live{" "}
            <strong>walkthroughs</strong> that show how each was made, the{" "}
            <strong>principles</strong> underneath them, and the way I actually{" "}
            <strong>collaborate</strong> with agents to get there.
          </p>
          <p style={{ ...bodyText, marginTop: 16 }}>
            Browse the shelf below. Open any system to see exactly what it does,
            what’s inside, and what it costs.
          </p>
        </section>

        <SystemsCoverflow />

        <Testimonial {...TESTIMONIALS[1]} />

        {/* Operator */}
        <section style={{ paddingTop: 64 }}>
          <SectionHeading>Operator</SectionHeading>
          <p style={bodyText}>
            I’ve spent seven years and over $3M in managed ad spend running
            paid acquisition across nearly every channel. Along the way I scaled
            D2C offers past <strong>$10M in annualized return</strong>, and
            during the pandemic built what became one of the world’s largest
            spore banks at{" "}
            <a
              href={LINKS.fungus}
              target="_blank"
              rel="noopener"
              className="ul"
              style={linkStyle}
            >
              fungusheadshop.com
            </a>
            .
          </p>
          <p style={{ ...bodyText, marginTop: 16 }}>
            Lately I’ve been turning my own workflow into open-source agents
            and MCP connectors for Google, Bing, Klaviyo, Drip and Shopify — full
            control over the stack I run every day. The patterns that actually
            win are repeatable, so I encoded them.
          </p>
          <p style={{ fontSize: "var(--text-sm)", lineHeight: 1.62, color: "var(--ink-soft)", marginTop: 22 }}>
            I teach all of it live, every month, as a mentor inside the Vibe
            Marketers —{" "}
            <a
              href={LINKS.join}
              target="_blank"
              rel="noopener"
              className="ul"
              style={linkStyle}
            >
              come build with me →
            </a>
          </p>
        </section>

        <Testimonial {...TESTIMONIALS[2]} />

        <AccessSection />

        {/* Questions */}
        <section style={{ paddingTop: 64 }}>
          <SectionHeading marginBottom={18}>Questions</SectionHeading>
          <FaqList />
        </section>

        <SiteFooter />
      </div>
    </MemberShell>
  )
}

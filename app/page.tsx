import { HeroCarousel } from "./_landing/hero-carousel"
import { ScrollReveal } from "./_landing/scroll-reveal"

const JOIN_URL = "https://www.skool.com/the-vibe-marke"
const BOOK_URL = "https://cal.com/ctrlswing/15min"
const ACCESS_PRICE = "$249"

export default function Page() {
  return (
    <>
      <ScrollReveal />

      {/* ── NAV ── */}
      <nav className="nav">
        <span className="logo">47</span>
        <a href={JOIN_URL} className="nav-login">Login</a>
      </nav>

      {/* ── HERO ── */}
      <section className="hero">
        <h1>A living library of agentic systems and tools for performance marketers.</h1>
        <HeroCarousel />
      </section>

      {/* ── STORY ── */}
      <section className="story reveal">
        <p>
          Seven years ago I started out as a performance marketer. After $3M+
          across Facebook, Google, Pinterest, TikTok, Bing and — lately —
          ChatGPT ads, I&rsquo;ve learned a thing or two about driving paid traffic.
        </p>
        <p>
          But more importantly, I learned about the underlying{" "}
          <strong>systems</strong> it takes to drive <strong>effective</strong>{" "}
          traffic — the kind that doesn&rsquo;t just hit KPI targets, but beats them.
        </p>
        <p>
          With the advent of agentic tools like Claude Code, Codex and others,
          those systems are now directly transferable — both as concrete
          artifacts and as an educational layer.
        </p>
        <p>
          <strong>Channel 47 provides both.</strong>
        </p>
      </section>

      {/* ── TESTIMONIAL 1 ── */}
      <section className="testimonial reveal">
        <blockquote>
          &ldquo;Very few people have managed to systematize marketing the way
          Jackson has. If you spend money on ads, this is for you.&rdquo;
        </blockquote>
        <cite>
          <span className="avatar-placeholder" />
          <span>Performance marketer &amp; community member</span>
        </cite>
      </section>

      <div className="section-divider"><hr /></div>

      {/* ── THE SYSTEMS ── */}
      <section className="systems-section reveal">
        <h2>The Systems</h2>
        <p className="systems-intro">
          Everything I build lives here. It&rsquo;s organized into shelves — the{" "}
          <strong>systems</strong>, the live <strong>walkthroughs</strong> that
          show how each was made, the <strong>principles</strong> underneath
          them, and the way I actually <strong>collaborate</strong> with agents
          to get there.
        </p>
        <p className="systems-browse">
          Browse the shelf below. Open any system to see exactly what it does,
          what&rsquo;s inside, and what it costs.
        </p>
        <div className="systems-scroll">
          {[
            { title: "Research & Personas", emoji: "🔍" },
            { title: "Angle Generator", emoji: "📐" },
            { title: "Advertorial Builder", emoji: "📝" },
            { title: "Paid Search System", emoji: "🎯" },
            { title: "Ad Creative Generator", emoji: "🎨" },
            { title: "Email Flows", emoji: "📬" },
          ].map((card) => (
            <div key={card.title} className="system-card">
              <div className="system-card-image">{card.emoji}</div>
              <div className="system-card-title">{card.title}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── TESTIMONIAL 2 ── */}
      <section className="testimonial reveal">
        <blockquote>
          &ldquo;I bought one system expecting a prompt and got a whole workflow.
          It paid for itself on the first campaign.&rdquo;
        </blockquote>
        <cite>
          <span className="avatar-placeholder" />
          <span>Paid acquisition lead</span>
        </cite>
      </section>

      <div className="section-divider"><hr /></div>

      {/* ── OPERATOR ── */}
      <section className="operator reveal">
        <h2>Operator</h2>
        <p>
          I&rsquo;ve spent seven years and over $3M in managed ad spend running
          paid acquisition across nearly every channel. Along the way I scaled
          D2C offers past $10M in annualized return, and during the pandemic
          built what became one of the world&rsquo;s largest spore banks at
          fungusheadshop.com.
        </p>
        <p>
          Lately I&rsquo;ve been turning my own workflow into open-source agents
          and MCP connectors for Google, Bing, Klaviyo, Drip and Shopify — full
          control over the stack I run every day. The patterns that actually win
          are repeatable, so I encoded them.
        </p>
        <p>
          I teach all of it live, every month, as a mentor inside the Vibe
          Marketers —{" "}
          <a href={JOIN_URL} className="inline-link">
            come build with me&nbsp;&rarr;
          </a>
        </p>
      </section>

      {/* ── TESTIMONIAL 3 ── */}
      <section className="testimonial reveal">
        <blockquote>
          &ldquo;He thinks like an operator, not a freelancer. The research
          alone reframed how we talk about the product.&rdquo;
        </blockquote>
        <cite>
          <span className="avatar-placeholder" />
          <span>Brand founder</span>
        </cite>
      </section>

      <div className="section-divider"><hr /></div>

      {/* ── ACCESS ── */}
      <section className="access reveal">
        <h2>Access</h2>
        <p className="access-body">
          One payment gets you the entire library — every system, every MCP
          connector, every walkthrough and principle — plus everything I add
          from here on. No subscription, no seat fees. You buy in once and
          it&rsquo;s yours.
        </p>
        <a href={JOIN_URL} className="cta-button">
          Get lifetime access — {ACCESS_PRICE}&nbsp;&rarr;
        </a>
        <div className="access-meta">
          <span className="strikethrough">$970+ separately</span>
          <span className="forever">One payment. Yours forever.</span>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="faq reveal">
        <h2>Questions</h2>

        <details>
          <summary>
            Do I need to be technical to run these?
            <span className="toggle-icon">+</span>
          </summary>
          <p className="faq-answer">
            No. Each system includes step-by-step instructions. Many can be run
            with a single Claude Code command — you paste the prompt, it runs
            the workflow. If you can follow a recipe, you can run these.
          </p>
        </details>

        <details>
          <summary>
            What&rsquo;s the difference between buying access and hiring you?
            <span className="toggle-icon">+</span>
          </summary>
          <p className="faq-answer">
            Access gives you the full library to run yourself. Hiring me means
            I build and run your campaigns directly. Access is the systems;
            hiring is the operator.
          </p>
        </details>

        <details>
          <summary>
            I&rsquo;m in the Vibe Marketers — is it really free?
            <span className="toggle-icon">+</span>
          </summary>
          <p className="faq-answer">
            Yes. If you&rsquo;re an active member of the Vibe Marketers, you
            get the full library at no extra cost. It&rsquo;s included with
            your membership.
          </p>
        </details>

        <details>
          <summary>
            How often do you add to the library?
            <span className="toggle-icon">+</span>
          </summary>
          <p className="faq-answer">
            I ship new systems and updates monthly, sometimes more. Everything
            I build for clients and personal projects ends up in the library.
          </p>
        </details>

        <details>
          <summary>
            Can I just hire you to run my marketing?
            <span className="toggle-icon">+</span>
          </summary>
          <p className="faq-answer">
            Absolutely.{" "}
            <a href={BOOK_URL} className="inline-link" style={{ color: "var(--hover-warm)" }}>
              Book a 15-minute call
            </a>{" "}
            and we&rsquo;ll scope it. Done-for-you engagements start at a
            different price point, but you get a real operator, not an agency.
          </p>
        </details>

        <details>
          <summary>
            Who is this for?
            <span className="toggle-icon">+</span>
          </summary>
          <p className="faq-answer">
            Performance marketers who spend money on paid acquisition —
            Facebook, Google, TikTok, search, whatever the channel. Whether
            you&rsquo;re in-house, freelance, or running your own brand.
          </p>
        </details>
      </section>

      {/* ── FOOTER ── */}
      <footer className="site-footer">
        <p>&copy; 2026 Channel 47</p>
      </footer>
    </>
  )
}

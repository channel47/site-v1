"use client"

import { useState, useEffect } from "react"

const JOIN_URL =
  "https://www.skool.com/the-vibe-marketers/about?ref=be313e8087da44cca0ecd7edd9ac0775"
const BOOK_URL = "https://cal.com/ctrlswing/15min"

const HERO_CARDS = [
  {
    label: "SYSTEMS",
    title: "Agentic Systems",
    desc: "Complete AI-powered workflows for every marketing function. From research to deployed campaigns.",
    accent: "#cc4b1e",
  },
  {
    label: "WALKTHROUGHS",
    title: "Step-by-Step Guides",
    desc: "Watch each system in action on real campaigns. Every decision explained, every output shown.",
    accent: "#1e7d8c",
  },
  {
    label: "PRINCIPLES",
    title: "Strategic Frameworks",
    desc: "The thinking behind every system. Understand why it works — so you can adapt it to anything.",
    accent: "#b07d24",
  },
  {
    label: "AI COLLABORATION",
    title: "Working with AI",
    desc: "How to use AI as a thinking partner, not just a tool. Prompting, reviewing, iterating.",
    accent: "#50539e",
  },
]

const SYSTEMS = [
  {
    name: "Research & Personas",
    short: "Deep customer intelligence",
    desc: "Build psychographic personas from real data. Map buying triggers, objections, and desire language your market actually uses.",
    bullets: [
      "Reddit, review & forum mining",
      "Psychographic persona builder",
      "Voice-of-customer extraction",
      "Buying trigger mapping",
    ],
    parts: ["Research Agent", "Persona Builder", "VOC Extractor"],
    price: "$197",
  },
  {
    name: "Angle Generator",
    short: "High-converting messaging at scale",
    desc: "Transform research into dozens of tested angles. Each one mapped to a persona, a trigger, and a proof point.",
    bullets: [
      "Persona-to-angle mapping",
      "Hook & headline generation",
      "A/B variant creation",
      "Proof point matching",
    ],
    parts: ["Angle Engine", "Hook Generator", "Variant Builder"],
    price: "$147",
  },
  {
    name: "Advertorial Builder",
    short: "Editorial presell pages",
    desc: "Create the editorial presell page that closes the gap between your ad and your checkout — so cold traffic lands already sold.",
    bullets: [
      "Story-led page structure",
      "Objection handling flow",
      "Social proof integration",
      "CTA optimization",
    ],
    parts: ["Page Architect", "Copy Agent", "Proof Integrator"],
    price: "$197",
  },
  {
    name: "Paid Search System",
    short: "Systematic search campaigns",
    desc: "Structure, optimize, and scale paid search campaigns with a system that compounds performance over time.",
    bullets: [
      "Keyword architecture",
      "Ad copy generation",
      "Bid strategy templates",
      "Quality score optimization",
    ],
    parts: ["Keyword Architect", "Ad Copy Agent", "Performance Optimizer"],
    price: "$147",
  },
  {
    name: "Ad Creative Generator",
    short: "Scroll-stopping creative",
    desc: "Produce creative concepts with systematic variation. Test more, learn faster, scale what works.",
    bullets: [
      "Concept-to-creative pipeline",
      "Format adaptation",
      "Hook variation engine",
      "Performance pattern library",
    ],
    parts: ["Concept Generator", "Format Adapter", "Hook Engine"],
    price: "$147",
  },
  {
    name: "Email Flows",
    short: "Automated nurture sequences",
    desc: "Build email sequences that nurture cold leads into buyers. Every email mapped to a stage in the buying journey.",
    bullets: [
      "Journey-mapped sequences",
      "Subject line optimization",
      "Segmentation logic",
      "Conversion triggers",
    ],
    parts: ["Sequence Architect", "Copy Agent", "Trigger Builder"],
    price: "$127",
  },
]

const FAQS = [
  {
    q: "What do I actually get?",
    a: "Lifetime access to all six systems, including walkthroughs, strategic principles, and the AI collaboration guides. Everything is available immediately — no drip, no waiting.",
  },
  {
    q: "Is this just ChatGPT prompts?",
    a: "No. These are complete agentic systems built on real AI infrastructure. They include custom agents, structured workflows, and operational frameworks — not copy-paste prompts.",
  },
  {
    q: "How long does each system take to learn?",
    a: "Most people deploy their first system within a day. The walkthroughs show every step, and the principles explain why each decision was made — so you're not just following instructions, you're building understanding.",
  },
  {
    q: "Do I need coding skills?",
    a: "No. The systems are designed for marketers, not engineers. If you can use ChatGPT, you can run these systems.",
  },
  {
    q: "Will this work for my niche?",
    a: "The systems are built on universal marketing principles — research, angles, creative, and conversion. They've been used across ecommerce, SaaS, local services, and info products.",
  },
  {
    q: "What if it's not for me?",
    a: "There are no refunds on digital products, but you can book a free 15-minute call before purchasing if you want to make sure it's a fit.",
  },
]

const SANS = "var(--font-space-grotesk), 'Space Grotesk', system-ui, sans-serif"
const SERIF =
  "var(--font-newsreader), Georgia, 'Times New Roman', serif"

function Logo47({ fill = "#252119", size = 24 }: { fill?: string; size?: number }) {
  const w = (size * 46) / 24
  return (
    <svg
      width={w}
      height={size}
      viewBox="0 0 46 24"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="47"
      style={{ display: "block" }}
    >
      <rect x="0" y="0" width="7" height="18" fill={fill} />
      <rect x="7" y="12" width="7" height="6" fill={fill} />
      <rect x="14" y="0" width="7" height="24" fill={fill} />
      <rect x="25" y="0" width="14" height="6" fill={fill} />
      <rect x="39" y="0" width="7" height="12" fill={fill} />
      <rect x="32" y="12" width="7" height="12" fill={fill} />
    </svg>
  )
}

const COL: React.CSSProperties = {
  maxWidth: 660,
  margin: "0 auto",
  padding: "0 28px",
}

const LABEL: React.CSSProperties = {
  fontFamily: SANS,
  fontSize: 11,
  letterSpacing: "0.16em",
  textTransform: "uppercase",
  color: "#9a9485",
  marginBottom: 14,
  fontWeight: 500,
}

const H2: React.CSSProperties = {
  fontFamily: SERIF,
  fontSize: 32,
  fontWeight: 500,
  letterSpacing: "-0.015em",
  color: "#1b1916",
  margin: "0 0 14px 0",
  lineHeight: 1.15,
}

const QUOTE: React.CSSProperties = {
  fontFamily: SERIF,
  fontStyle: "italic",
  fontSize: 27,
  lineHeight: 1.34,
  letterSpacing: "-0.01em",
  color: "#1b1916",
  borderLeft: "3px solid #cc4b1e",
  paddingLeft: 28,
  margin: "0 0 56px 0",
}

export function LandingPage() {
  const [activeCard, setActiveCard] = useState(0)
  const [openModal, setOpenModal] = useState<number | null>(null)
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveCard((c) => (c + 1) % HERO_CARDS.length)
    }, 4400)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    if (openModal === null) return
    document.body.style.overflow = "hidden"
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenModal(null)
    }
    window.addEventListener("keydown", handler)
    return () => {
      document.body.style.overflow = ""
      window.removeEventListener("keydown", handler)
    }
  }, [openModal])

  return (
    <>
      {/* ── NAV ── */}
      <nav
        style={{
          position: "sticky",
          top: 0,
          zIndex: 100,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "18px 28px",
          maxWidth: 716,
          margin: "0 auto",
          background: "rgba(235,231,223,0.85)",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
        }}
      >
        <Logo47 />
        <a
          href="#access"
          style={{
            fontFamily: SANS,
            fontSize: 12,
            fontWeight: 500,
            letterSpacing: "0.04em",
            textTransform: "uppercase",
            color: "#252119",
            border: "1px solid #c4bfb4",
            borderRadius: 12,
            padding: "7px 18px",
            textDecoration: "none",
          }}
        >
          Login
        </a>
      </nav>

      {/* ── HERO ── */}
      <div style={COL}>
        <section style={{ paddingTop: 64, paddingBottom: 56 }}>
          <h1
            style={{
              fontFamily: SERIF,
              fontSize: 41,
              lineHeight: 1.08,
              letterSpacing: "-0.02em",
              fontWeight: 400,
              color: "#1b1916",
              margin: 0,
            }}
          >
            A living library of agentic systems and tools for performance
            marketers.
          </h1>

          <div
            style={{
              position: "relative",
              height: 195,
              marginTop: 48,
            }}
          >
            {HERO_CARDS.map((card, i) => {
              const depth =
                (i - activeCard + HERO_CARDS.length) % HERO_CARDS.length
              const isFront = depth === 0
              return (
                <div
                  key={i}
                  style={{
                    position: "absolute",
                    left: 0,
                    right: 0,
                    top: 0,
                    transform: `translateY(${depth * 10}px) scale(${1 - depth * 0.035})`,
                    zIndex: HERO_CARDS.length - depth,
                    opacity: isFront
                      ? 1
                      : Math.max(0.35, 1 - depth * 0.25),
                    background: isFront ? card.accent : "#faf8f1",
                    color: isFront ? "#f1ede4" : "#37332b",
                    borderRadius: 14,
                    padding: "26px 30px",
                    transition:
                      "transform 0.6s cubic-bezier(0.4,0,0.2,1), opacity 0.6s cubic-bezier(0.4,0,0.2,1), background 0.6s",
                    border: isFront ? "none" : "1px solid #e7e1d3",
                  }}
                >
                  <div
                    style={{
                      fontFamily: SANS,
                      fontSize: 10,
                      letterSpacing: "0.16em",
                      textTransform: "uppercase",
                      opacity: isFront ? 0.8 : 0.5,
                      marginBottom: 10,
                      fontWeight: 500,
                    }}
                  >
                    {card.label}
                  </div>
                  <div
                    style={{
                      fontFamily: SERIF,
                      fontSize: 21,
                      fontWeight: 500,
                      letterSpacing: "-0.015em",
                      lineHeight: 1.2,
                      marginBottom: 8,
                    }}
                  >
                    {card.title}
                  </div>
                  <div style={{ fontSize: 15, lineHeight: 1.5, opacity: isFront ? 0.9 : 0.7 }}>
                    {card.desc}
                  </div>
                </div>
              )
            })}
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: 8,
              marginTop: 20,
            }}
          >
            {HERO_CARDS.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveCard(i)}
                aria-label={`Show card ${i + 1}`}
                style={{
                  width: 7,
                  height: 7,
                  borderRadius: "50%",
                  background: i === activeCard ? "#cc4b1e" : "#c4bfb4",
                  border: "none",
                  cursor: "pointer",
                  transition: "background 0.3s",
                  padding: 0,
                }}
              />
            ))}
          </div>
        </section>

        {/* ── INTRO ── */}
        <section style={{ paddingBottom: 56 }}>
          <p style={{ marginBottom: 24 }}>
            Most marketers are still building campaigns from scratch every time.
            No systems. No compounding. Just instinct and an ever-growing list of
            AI tools they barely use.
          </p>
          <p style={{ marginBottom: 24 }}>
            The ones winning — the ones running profitable traffic at scale —
            have something different. They have systems. Repeatable, agentic
            workflows that turn research into angles, angles into ads, ads into
            landing pages, and landing pages into revenue.
          </p>
          <p style={{ marginBottom: 24 }}>
            These aren&apos;t prompt templates or ChatGPT tricks. They&apos;re
            complete operational systems — built on real AI infrastructure — that
            handle the heavy lifting while you make the strategic decisions.
          </p>
          <p>
            Channel 47 provides both. The systems themselves, and the
            understanding to adapt them. Built by an operator who&apos;s deployed
            them across $3M+ in ad spend.
          </p>
        </section>

        {/* ── QUOTE 1 ── */}
        <blockquote style={QUOTE}>
          &ldquo;Very few people have managed to systematize marketing at this
          level. Jackson has.&rdquo;
        </blockquote>
      </div>

      {/* ── THE SYSTEMS ── */}
      <section style={{ paddingBottom: 56 }}>
        <div style={COL}>
          <div style={LABEL}>THE LIBRARY</div>
          <h2 style={H2}>The Systems</h2>
          <p style={{ color: "#37332b", marginBottom: 32 }}>
            Six complete systems. Each one handles a different stage of the
            performance marketing workflow — from initial research through to
            deployed campaigns.
          </p>
        </div>

        <div
          className="coverflow-shelf"
          style={{
            display: "flex",
            gap: 16,
            overflowX: "auto",
            overflowY: "hidden",
            padding: "0 max(28px, calc(50% - 330px))",
            WebkitOverflowScrolling: "touch",
          }}
        >
          {SYSTEMS.map((sys, i) => (
            <button
              key={i}
              onClick={() => setOpenModal(i)}
              style={{
                flex: "none",
                width: 260,
                background: "#faf8f1",
                borderRadius: 14,
                padding: "28px 24px",
                border: "1px solid #e7e1d3",
                cursor: "pointer",
                textAlign: "left",
                transition: "transform 0.3s, box-shadow 0.3s",
                fontFamily: "inherit",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)"
                e.currentTarget.style.boxShadow =
                  "0 12px 32px -8px rgba(37,33,25,0.12)"
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = ""
                e.currentTarget.style.boxShadow = ""
              }}
            >
              <div
                style={{
                  fontFamily: SANS,
                  fontSize: 10,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "#9a9485",
                  marginBottom: 14,
                  fontWeight: 500,
                }}
              >
                SYSTEM {String(i + 1).padStart(2, "0")}
              </div>
              <div
                style={{
                  fontFamily: SERIF,
                  fontSize: 20,
                  fontWeight: 500,
                  color: "#1b1916",
                  letterSpacing: "-0.015em",
                  lineHeight: 1.2,
                  marginBottom: 8,
                }}
              >
                {sys.name}
              </div>
              <div style={{ fontSize: 14, lineHeight: 1.55, color: "#9a9485" }}>
                {sys.short}
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* ── REMAINING CONTENT ── */}
      <div style={COL}>
        {/* ── QUOTE 2 ── */}
        <blockquote style={QUOTE}>
          &ldquo;I bought one system expecting a prompt. What I got was an entire
          workflow that replaced three tools I was paying for.&rdquo;
        </blockquote>

        {/* ── OPERATOR ── */}
        <section style={{ paddingBottom: 56 }}>
          <div style={LABEL}>THE OPERATOR</div>
          <h2 style={H2}>Jackson Dean</h2>
          <p style={{ marginBottom: 20 }}>
            Built from $3M+ in managed ad spend across DTC ecommerce. $10M+ in
            tracked return. Every system in this library was built in production,
            not in theory.
          </p>
          <p style={{ marginBottom: 20 }}>
            Currently mentoring inside{" "}
            <a
              href={JOIN_URL}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: "#cc4b1e",
                textDecoration: "underline",
                textUnderlineOffset: 3,
              }}
            >
              Vibe Marketers
            </a>
            , a community of operators using AI to run better campaigns.
          </p>
          <p>
            <a
              href="https://fungusheadshop.co"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: "#9a9485",
                fontSize: 15,
                textDecoration: "underline",
                textUnderlineOffset: 3,
              }}
            >
              fungusheadshop.co
            </a>
          </p>
        </section>

        {/* ── QUOTE 3 ── */}
        <blockquote style={QUOTE}>
          &ldquo;He thinks like an operator, not a freelancer. Every system shows
          it.&rdquo;
        </blockquote>

        {/* ── ACCESS ── */}
        <section
          id="access"
          style={{ textAlign: "center", paddingBottom: 64 }}
        >
          <a
            href={JOIN_URL}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-block",
              background: "#14110d",
              color: "#f1ede4",
              fontFamily: SANS,
              fontSize: 16,
              fontWeight: 600,
              letterSpacing: "0.02em",
              padding: "18px 44px",
              borderRadius: 10,
              textDecoration: "none",
              transition: "transform 0.25s, box-shadow 0.25s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)"
              e.currentTarget.style.boxShadow =
                "0 12px 28px -8px rgba(20,17,13,0.35)"
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = ""
              e.currentTarget.style.boxShadow = ""
            }}
          >
            Get lifetime access — $249
          </a>
          <div
            style={{
              marginTop: 16,
              fontFamily: SANS,
              fontSize: 14,
              color: "#9a9485",
            }}
          >
            <span style={{ textDecoration: "line-through" }}>
              $870+ separately
            </span>
          </div>
          <div
            style={{
              marginTop: 8,
              fontFamily: SANS,
              fontSize: 13,
              color: "#9a9485",
              letterSpacing: "0.02em",
            }}
          >
            One payment · yours forever
          </div>
        </section>

        {/* ── FAQ ── */}
        <section style={{ paddingBottom: 80 }}>
          <div style={LABEL}>QUESTIONS</div>
          <h2 style={H2}>Questions</h2>
          <div style={{ marginTop: 18 }}>
            {FAQS.map((faq, i) => (
              <div
                key={i}
                style={{
                  borderTop: "1px solid #d8d3c8",
                  ...(i === FAQS.length - 1
                    ? { borderBottom: "1px solid #d8d3c8" }
                    : {}),
                }}
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  style={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "20px 0",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    fontFamily: SERIF,
                    fontSize: 16,
                    fontWeight: 600,
                    color: "#1b1916",
                    textAlign: "left",
                    lineHeight: 1.4,
                  }}
                >
                  {faq.q}
                  <span
                    style={{
                      fontFamily: SANS,
                      fontSize: 20,
                      color: "#cc4b1e",
                      flexShrink: 0,
                      marginLeft: 16,
                      transition: "transform 0.25s",
                      transform:
                        openFaq === i ? "rotate(45deg)" : "none",
                      display: "inline-block",
                    }}
                  >
                    +
                  </span>
                </button>
                <div
                  style={{
                    maxHeight: openFaq === i ? 300 : 0,
                    overflow: "hidden",
                    transition:
                      "max-height 0.35s cubic-bezier(0.4,0,0.2,1)",
                  }}
                >
                  <p
                    style={{
                      fontSize: 15,
                      lineHeight: 1.6,
                      color: "#9a9485",
                      paddingBottom: 20,
                      margin: 0,
                    }}
                  >
                    {faq.a}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── FOOTER ── */}
        <footer
          style={{
            borderTop: "1px solid #d8d3c8",
            padding: "28px 0 48px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Logo47 fill="#9a9485" size={18} />
          <span
            style={{
              fontFamily: SANS,
              fontSize: 12,
              color: "#9a9485",
            }}
          >
            © 2026 channel47
          </span>
        </footer>
      </div>

      {/* ── SYSTEM MODAL ── */}
      {openModal !== null && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 1000,
            background: "rgba(37,33,25,0.6)",
            backdropFilter: "blur(6px)",
            WebkitBackdropFilter: "blur(6px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 28,
          }}
          onClick={() => setOpenModal(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "#faf8f1",
              borderRadius: 18,
              padding: "40px 36px",
              maxWidth: 520,
              width: "100%",
              maxHeight: "85vh",
              overflowY: "auto",
              position: "relative",
            }}
          >
            <button
              onClick={() => setOpenModal(null)}
              aria-label="Close"
              style={{
                position: "absolute",
                top: 16,
                right: 16,
                width: 32,
                height: 32,
                borderRadius: "50%",
                background: "#e7e1d3",
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 14,
                color: "#37332b",
                fontFamily: SANS,
              }}
            >
              ✕
            </button>

            <div
              style={{
                ...LABEL,
                marginBottom: 10,
              }}
            >
              SYSTEM {String(openModal + 1).padStart(2, "0")}
            </div>
            <h3
              style={{
                fontFamily: SERIF,
                fontSize: 28,
                fontWeight: 500,
                letterSpacing: "-0.015em",
                color: "#1b1916",
                margin: "0 0 8px 0",
                lineHeight: 1.15,
              }}
            >
              {SYSTEMS[openModal].name}
            </h3>
            <p
              style={{
                fontSize: 16,
                lineHeight: 1.6,
                color: "#37332b",
                marginBottom: 24,
              }}
            >
              {SYSTEMS[openModal].desc}
            </p>

            <ul style={{ listStyle: "none", padding: 0, margin: "0 0 28px 0" }}>
              {SYSTEMS[openModal].bullets.map((b, bi) => (
                <li
                  key={bi}
                  style={{
                    display: "flex",
                    alignItems: "baseline",
                    gap: 10,
                    padding: "6px 0",
                    fontSize: 15,
                    color: "#37332b",
                  }}
                >
                  <span
                    style={{
                      color: "#cc4b1e",
                      fontSize: 7,
                      flexShrink: 0,
                      marginTop: 5,
                    }}
                  >
                    ●
                  </span>
                  {b}
                </li>
              ))}
            </ul>

            <div style={{ ...LABEL, marginBottom: 10 }}>INCLUDES</div>
            <div
              style={{
                display: "flex",
                gap: 8,
                flexWrap: "wrap",
                marginBottom: 28,
              }}
            >
              {SYSTEMS[openModal].parts.map((p, pi) => (
                <span
                  key={pi}
                  style={{
                    fontFamily: SANS,
                    fontSize: 12,
                    fontWeight: 500,
                    color: "#37332b",
                    background: "#e7e1d3",
                    borderRadius: 6,
                    padding: "5px 12px",
                  }}
                >
                  {p}
                </span>
              ))}
            </div>

            <div
              style={{
                borderTop: "1px solid #d8d3c8",
                paddingTop: 24,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 16,
                flexWrap: "wrap",
              }}
            >
              <div>
                <span
                  style={{
                    fontFamily: SERIF,
                    fontSize: 28,
                    fontWeight: 500,
                    color: "#1b1916",
                  }}
                >
                  {SYSTEMS[openModal].price}
                </span>
                <span
                  style={{
                    fontFamily: SANS,
                    fontSize: 12,
                    color: "#9a9485",
                    marginLeft: 8,
                  }}
                >
                  separately
                </span>
              </div>
              <a
                href={JOIN_URL}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-block",
                  background: "#14110d",
                  color: "#f1ede4",
                  fontFamily: SANS,
                  fontSize: 13,
                  fontWeight: 600,
                  padding: "12px 24px",
                  borderRadius: 8,
                  textDecoration: "none",
                }}
              >
                Get lifetime access
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

#!/usr/bin/env python3
"""
AI Search Readiness Auditor (stdlib-only).

Checks a site against the dual-engine (SEO + GEO/AEO) infrastructure layers:
robots.txt AI-crawler policy, llms.txt, sitemaps, RSS, markdown twins,
Accept: text/markdown content negotiation, and per-page essentials
(title, meta description, canonical, server-rendered JSON-LD, OG tags).

Usage:
    python audit_ai_readiness.py https://example.com [--samples 3] [--json]

Caveats (also printed in the report):
- Raw HTTP cannot see JS-injected schema. "No JSON-LD in server HTML" is a
  finding to verify with Google's Rich Results Test, not proof of absence.
- This audits machine-facing infrastructure, not rankings or content quality.
"""

import argparse
import json
import re
import ssl
import sys
import urllib.request
import urllib.error
from urllib.parse import urlparse, urljoin

UA = "ai-seo-readiness-audit/1.0 (+https://github.com/ai-seo-skill)"
TIMEOUT = 15

AI_BOTS = [
    "GPTBot", "ChatGPT-User", "OAI-SearchBot",
    "ClaudeBot", "Claude-User", "Claude-SearchBot",
    "PerplexityBot", "Perplexity-User",
    "Google-Extended", "CCBot", "Bytespider",
    "Applebot-Extended", "meta-externalagent", "Amazonbot",
]


def fetch(url, accept=None, method="GET"):
    """Fetch a URL. Returns dict with status, headers, body (text), error."""
    headers = {"User-Agent": UA}
    if accept:
        headers["Accept"] = accept
    req = urllib.request.Request(url, headers=headers, method=method)
    ctx = ssl.create_default_context()
    try:
        with urllib.request.urlopen(req, timeout=TIMEOUT, context=ctx) as r:
            body = r.read(2_000_000)  # cap at 2MB
            try:
                text = body.decode("utf-8", errors="replace")
            except Exception:
                text = ""
            return {
                "status": r.status,
                "headers": {k.lower(): v for k, v in r.headers.items()},
                "body": text,
                "final_url": r.geturl(),
                "error": None,
            }
    except urllib.error.HTTPError as e:
        return {"status": e.code, "headers": {}, "body": "", "final_url": url, "error": str(e)}
    except Exception as e:
        return {"status": None, "headers": {}, "body": "", "final_url": url, "error": str(e)}


def extract_head(html):
    """Pull SEO-relevant head elements from raw HTML."""
    def first(pattern):
        m = re.search(pattern, html, re.I | re.S)
        return m.group(1).strip() if m else None

    ld_blocks = re.findall(
        r"<script[^>]*application/ld\+json[^>]*>(.*?)</script>", html, re.I | re.S
    )
    ld_types = []
    for b in ld_blocks:
        ld_types += re.findall(r'"@type"\s*:\s*"([^"]+)"', b)

    return {
        "title": first(r"<title[^>]*>(.*?)</title>"),
        "meta_description": first(r'<meta[^>]+name=["\']description["\'][^>]+content=["\']([^"\']*)'),
        "canonical": first(r'<link[^>]+rel=["\']canonical["\'][^>]+href=["\']([^"\']*)'),
        "robots_meta": first(r'<meta[^>]+name=["\']robots["\'][^>]+content=["\']([^"\']*)'),
        "og_tags": sorted(set(re.findall(r'property=["\'](og:[a-z:_]+)["\']', html, re.I))),
        "jsonld_blocks": len(ld_blocks),
        "jsonld_types": sorted(set(ld_types)),
        "h1_count": len(re.findall(r"<h1[\s>]", html, re.I)),
    }


def check_robots(base):
    r = fetch(urljoin(base, "/robots.txt"))
    out = {"present": r["status"] == 200, "ai_bots_named": [], "ai_bots_blocked": [],
           "sitemap_declared": False, "raw_status": r["status"]}
    if not out["present"]:
        return out
    body = r["body"]
    out["sitemap_declared"] = bool(re.search(r"^\s*sitemap\s*:", body, re.I | re.M))
    # Parse per-agent groups
    groups = re.split(r"(?im)^\s*user-agent\s*:\s*", body)
    for g in groups[1:]:
        lines = g.splitlines()
        agent = lines[0].strip()
        rules = "\n".join(lines[1:])
        for bot in AI_BOTS:
            if agent.lower() == bot.lower():
                out["ai_bots_named"].append(bot)
                # Blocked if a `Disallow: /` (exactly root) appears in this group
                if re.search(r"(?im)^\s*disallow\s*:\s*/\s*$", rules):
                    out["ai_bots_blocked"].append(bot)
    # A blanket `User-agent: *` + `Disallow: /` blocks everyone
    star = re.search(r"(?is)user-agent\s*:\s*\*\s*(.*?)(?=user-agent\s*:|\Z)", body)
    out["blanket_block"] = bool(star and re.search(r"(?im)^\s*disallow\s*:\s*/\s*$", star.group(1)))
    return out


def check_llms_txt(base):
    r = fetch(urljoin(base, "/llms.txt"))
    ok = r["status"] == 200 and len(r["body"].strip()) > 20 and "<html" not in r["body"][:500].lower()
    out = {"present": ok, "raw_status": r["status"], "size": len(r["body"]) if ok else 0,
           "has_h1": False, "link_count": 0}
    if ok:
        out["has_h1"] = bool(re.search(r"(?m)^# \S", r["body"]))
        out["link_count"] = len(re.findall(r"https?://", r["body"]))
    full = fetch(urljoin(base, "/llms-full.txt"))
    out["llms_full_present"] = full["status"] == 200 and "<html" not in full["body"][:500].lower()
    return out


def check_sitemap(base):
    r = fetch(urljoin(base, "/sitemap.xml"))
    out = {"present": r["status"] == 200 and "<" in r["body"][:200],
           "raw_status": r["status"], "url_count": 0, "has_lastmod": False,
           "sample_urls": [], "is_index": False}
    if not out["present"]:
        return out
    body = r["body"]
    if "<sitemapindex" in body:
        out["is_index"] = True
        children = re.findall(r"<loc>\s*([^<]+?)\s*</loc>", body)[:2]
        locs = []
        for c in children:
            rc = fetch(c.strip())
            locs += re.findall(r"<loc>\s*([^<]+?)\s*</loc>", rc["body"])
            out["has_lastmod"] = out["has_lastmod"] or "<lastmod>" in rc["body"]
    else:
        locs = re.findall(r"<loc>\s*([^<]+?)\s*</loc>", body)
        out["has_lastmod"] = "<lastmod>" in body
    out["url_count"] = len(locs)
    # Prefer content-looking URLs; skip utility/transactional pages
    skip = re.compile(
        r"(login|signup|sign-up|register|cart|checkout|privacy|terms|contact|about"
        r"|newsletter|subscribe|unsubscribe|pricing|search|thanks|confirm|account"
        r"|tag/|category/|author/|page/\d)", re.I)
    content = [u for u in locs if urlparse(u).path.strip("/") and not skip.search(u)]
    # Article-like slugs (multi-word, hyphenated last segment) first — these are
    # the pages where twins/schema/meta matter most.
    articleish = [u for u in content
                  if urlparse(u).path.rstrip("/").split("/")[-1].count("-") >= 2]
    out["sample_urls"] = (articleish + [u for u in content if u not in articleish])[:50]
    out["markdown_sitemap_present"] = fetch(urljoin(base, "/sitemap.md"))["status"] == 200
    return out


def check_rss(base, home_html):
    # Look for declared feed first, then common paths
    m = re.search(r'<link[^>]+type=["\']application/(?:rss|atom)\+xml["\'][^>]+href=["\']([^"\']+)', home_html or "", re.I)
    candidates = ([m.group(1)] if m else []) + ["/rss.xml", "/feed.xml", "/feed", "/rss", "/atom.xml"]
    for c in candidates:
        r = fetch(urljoin(base, c))
        if r["status"] == 200 and re.search(r"<(rss|feed)[\s>]", r["body"][:1000], re.I):
            return {"present": True, "url": urljoin(base, c)}
    return {"present": False, "url": None}


def check_page(url):
    """Audit one content URL: head essentials + markdown twin + negotiation."""
    page = fetch(url)
    result = {"url": url, "status": page["status"], "head": None,
              "md_twin": False, "md_twin_frontmatter": False,
              "content_negotiation": False}
    if page["status"] != 200:
        return result
    result["head"] = extract_head(page["body"])

    # Markdown twin
    twin_url = url.rstrip("/") + ".md"
    twin = fetch(twin_url)
    ct = twin["headers"].get("content-type", "")
    body_looks_md = twin["status"] == 200 and "<html" not in twin["body"][:300].lower()
    if body_looks_md and ("markdown" in ct or "text/plain" in ct or twin["body"].lstrip().startswith(("---", "#"))):
        result["md_twin"] = True
        result["md_twin_frontmatter"] = twin["body"].lstrip().startswith("---")

    # Content negotiation on canonical URL
    neg = fetch(url, accept="text/markdown")
    nct = neg["headers"].get("content-type", "")
    if neg["status"] == 200 and ("markdown" in nct or (
            "<html" not in neg["body"][:300].lower() and neg["body"].lstrip().startswith(("---", "#")))):
        result["content_negotiation"] = True
    return result


def score_and_report(base, robots, llms, sitemap, rss, home, pages):
    checks = []  # (label, passed(bool|None), weight, note)

    def add(label, passed, weight, note=""):
        checks.append({"label": label, "passed": passed, "weight": weight, "note": note})

    # Layer: crawl access
    add("robots.txt present", robots["present"], 2)
    add("robots.txt declares sitemap", robots.get("sitemap_declared", False), 1)
    blocked = robots.get("ai_bots_blocked", []) or (["ALL (blanket)"] if robots.get("blanket_block") else [])
    add("AI crawlers not blocked", not blocked, 3,
        f"blocked: {', '.join(blocked)}" if blocked else
        (f"explicitly named: {', '.join(robots['ai_bots_named'])}" if robots.get("ai_bots_named") else
         "no explicit AI-bot rules (allowed by default)"))
    # Layer: discovery
    add("sitemap.xml present", sitemap["present"], 3, f"{sitemap['url_count']} URLs")
    add("sitemap has lastmod", sitemap.get("has_lastmod", False), 1)
    add("RSS feed", rss["present"], 1, rss["url"] or "")
    add("llms.txt present", llms["present"], 2,
        f"{llms['size']}B, {llms['link_count']} links" if llms["present"] else "")
    add("markdown sitemap (/sitemap.md)", sitemap.get("markdown_sitemap_present", False), 1)
    # Layer: homepage head
    if home:
        add("homepage title", bool(home.get("title")), 2, (home.get("title") or "")[:70])
        add("homepage meta description", bool(home.get("meta_description")), 2)
        add("homepage JSON-LD in server HTML", home.get("jsonld_blocks", 0) > 0, 2,
            ", ".join(home.get("jsonld_types", [])[:6]) or "verify with Rich Results Test — may be JS-injected")
        add("Organization/WebSite schema", any(t in ("Organization", "WebSite") for t in home.get("jsonld_types", [])), 2)
    # Layer: sampled content pages
    if pages:
        n = len(pages)
        def frac(key):
            return sum(1 for p in pages if p.get(key)) / n
        def headfrac(key):
            return sum(1 for p in pages if p.get("head") and p["head"].get(key)) / n
        add("canonical tags on content pages", headfrac("canonical") >= 0.67, 2,
            f"{int(headfrac('canonical')*n)}/{n} pages")
        add("meta descriptions on content pages", headfrac("meta_description") >= 0.67, 2,
            f"{int(headfrac('meta_description')*n)}/{n} pages")
        add("JSON-LD on content pages (server HTML)",
            sum(1 for p in pages if p.get("head") and p["head"]["jsonld_blocks"] > 0) / n >= 0.67, 2,
            "verify JS-injection with Rich Results Test if failing")
        add("markdown twins (<url>.md)", frac("md_twin") >= 0.5, 3, f"{int(frac('md_twin')*n)}/{n} pages")
        twins = [p for p in pages if p.get("md_twin")]
        add("twin YAML frontmatter",
            bool(twins) and sum(1 for p in twins if p["md_twin_frontmatter"]) / len(twins) >= 0.5, 1,
            f"{sum(1 for p in twins if p['md_twin_frontmatter'])}/{len(twins)} twins" if twins else "no twins found")
        add("Accept: text/markdown negotiation", frac("content_negotiation") >= 0.5, 2,
            f"{int(frac('content_negotiation')*n)}/{n} pages")

    earned = sum(c["weight"] for c in checks if c["passed"])
    total = sum(c["weight"] for c in checks)
    return checks, earned, total


def recommendations(checks):
    recs = []
    fixmap = {
        "AI crawlers not blocked": "Unblock AI crawlers in robots.txt (or confirm blocking is a deliberate content-control decision).",
        "sitemap.xml present": "Generate and submit sitemap.xml to Google Search Console AND Bing Webmaster Tools (Bing feeds ChatGPT search).",
        "llms.txt present": "Ship /llms.txt (see references/agent-native-infrastructure.md §2). Cheap insurance + agent documentation.",
        "markdown twins (<url>.md)": "Serve markdown twins at <url>.md — the highest-value agent surface (see agent-native-infrastructure.md §3).",
        "Accept: text/markdown negotiation": "Add content negotiation so canonical URLs return markdown to agents (agent-native-infrastructure.md §4).",
        "homepage JSON-LD in server HTML": "Server-render Organization + WebSite + Person JSON-LD (entity-and-schema.md §1). If a JS plugin injects it, move it server-side.",
        "JSON-LD on content pages (server HTML)": "Server-render Article/BlogPosting schema per page (entity-and-schema.md §2).",
        "canonical tags on content pages": "Add self-referencing canonicals to all unique pages.",
        "meta descriptions on content pages": "Write unique meta descriptions — use the canonical answer string (triple consistency rule).",
        "RSS feed": "Publish full-content RSS; aggregators and AI pipelines still consume it.",
        "markdown sitemap (/sitemap.md)": "Optional: add a markdown discovery index for agents.",
        "sitemap has lastmod": "Emit real lastmod dates; freshness affects recrawl and retrieval.",
        "robots.txt declares sitemap": "Add a Sitemap: line to robots.txt.",
    }
    for c in checks:
        if c["passed"] is False and c["label"] in fixmap:
            recs.append(f"[w{c['weight']}] {fixmap[c['label']]}")
    return recs


def main():
    ap = argparse.ArgumentParser(description="Audit a site's AI-search (SEO+GEO) readiness")
    ap.add_argument("url", help="Base URL, e.g. https://example.com")
    ap.add_argument("--samples", type=int, default=3, help="Content pages to sample from the sitemap (default 3)")
    ap.add_argument("--json", action="store_true", help="Emit machine-readable JSON instead of a report")
    args = ap.parse_args()

    base = args.url if args.url.startswith("http") else "https://" + args.url
    base = base.rstrip("/")

    home_resp = fetch(base + "/")
    home = extract_head(home_resp["body"]) if home_resp["status"] == 200 else None

    robots = check_robots(base)
    llms = check_llms_txt(base)
    sitemap = check_sitemap(base)
    rss = check_rss(base, home_resp["body"] if home_resp["status"] == 200 else "")

    pages = []
    for u in sitemap.get("sample_urls", [])[: args.samples]:
        pages.append(check_page(u))

    checks, earned, total = score_and_report(base, robots, llms, sitemap, rss, home, pages)
    recs = recommendations(checks)

    if args.json:
        print(json.dumps({"base": base, "score": earned, "max": total, "checks": checks,
                          "recommendations": recs, "pages": pages}, indent=2))
        return

    pct = round(100 * earned / total) if total else 0
    print(f"\n{'='*62}\nAI SEARCH READINESS AUDIT — {base}\nScore: {earned}/{total} ({pct}%)\n{'='*62}")
    for c in checks:
        mark = "PASS" if c["passed"] else "FAIL"
        note = f"  — {c['note']}" if c["note"] else ""
        print(f"  [{mark}] (w{c['weight']}) {c['label']}{note}")
    if pages:
        print(f"\nSampled pages ({len(pages)}):")
        for p in pages:
            flags = []
            if p["md_twin"]:
                flags.append("md-twin")
            if p["content_negotiation"]:
                flags.append("negotiation")
            if p.get("head") and p["head"]["jsonld_types"]:
                flags.append("ld:" + ",".join(p["head"]["jsonld_types"][:3]))
            print(f"  - {p['url']}  [{' | '.join(flags) or 'no agent surfaces'}]")
    if recs:
        print(f"\nTop recommendations (by weight):")
        for r in sorted(recs, reverse=True):
            print(f"  - {r}")
    print("\nCaveats: raw HTTP can't see JS-injected schema (verify 'FAIL' schema findings"
          "\nwith Google's Rich Results Test). This audits infrastructure, not rankings.\n")


if __name__ == "__main__":
    main()

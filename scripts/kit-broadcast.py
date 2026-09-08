#!/usr/bin/env python3
"""Render Channel47 email HTML and create safe, unscheduled Kit drafts."""

from __future__ import annotations

import argparse
import base64
import json
import os
import sys
import urllib.error
import urllib.parse
import urllib.request
from html.parser import HTMLParser
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parents[1]
WORKSPACE = ROOT.parent
NEWSLETTER_DIR = ROOT / "newsletter"
CONFIG_FILE = NEWSLETTER_DIR / "config.json"
WRAPPER_FILE = NEWSLETTER_DIR / "channel47-wrapper.html"
KIT_BASE = "https://api.kit.com/v4"
CONTENT_MARKER = "{{ message_content }}"
UNSUBSCRIBE_URL_MARKER = "{{ unsubscribe_url }}"
ADDRESS_MARKER = "{{ address }}"
LEGACY_CONTENT_MARKER = "%%ISSUE_CONTENT%%"
TEMPLATE_LOGO_URL = "https://channel47.dev/email/channel47-mark-v2.png"
LOGO_FILE = ROOT / "public" / "email" / "channel47-mark-v2.png"
LOGO_CONTENT_TYPE = "image/png"
MAX_RENDERED_BYTES = 95_000
ALLOWED_ISSUE_TAGS = {
    "a",
    "b",
    "blockquote",
    "br",
    "code",
    "em",
    "h1",
    "h2",
    "h3",
    "i",
    "img",
    "li",
    "ol",
    "p",
    "span",
    "strong",
    "ul",
}
FORBIDDEN_STYLE_TOKENS = (
    "animation",
    "background-image",
    "display:flex",
    "display:grid",
    "float:",
    "position:",
    "rgba(",
    "transition",
)


class IssueHTMLValidator(HTMLParser):
    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.errors: list[str] = []

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        self._validate_tag(tag, attrs)

    def handle_startendtag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        self._validate_tag(tag, attrs)

    def _validate_tag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        if tag not in ALLOWED_ISSUE_TAGS:
            self.errors.append(f"unsupported <{tag}> element")
            return
        values = {key.lower(): value or "" for key, value in attrs}
        style = values.get("style", "").lower().replace(" ", "")
        for token in FORBIDDEN_STYLE_TOKENS:
            if token in style:
                self.errors.append(f"unsupported CSS {token!r} on <{tag}>")
        if tag in {"p", "h1", "h2", "h3", "li", "blockquote"} and "line-height:" not in style:
            self.errors.append(f"<{tag}> elements must include an inline line-height")
        if tag == "a":
            href = values.get("href", "")
            if href != UNSUBSCRIBE_URL_MARKER and not href.startswith(
                ("https://", "mailto:")
            ):
                self.errors.append(
                    "links must use an absolute HTTPS URL, mailto URL, or the "
                    "Kit unsubscribe marker"
                )
            if "color:" not in style or "text-decoration:" not in style:
                self.errors.append("links must include inline color and text-decoration")
        if tag == "img":
            src = values.get("src", "")
            if not src.startswith("https://"):
                self.errors.append("images must use an absolute HTTPS URL")
            if not values.get("alt", "").strip():
                self.errors.append("images must include meaningful alt text")
            if not values.get("width"):
                self.errors.append("images must include a width attribute")
            fluid_without_fixed_height = (
                "width:100%" in style
                and "height:auto" in style
                and "max-width:" in style
            )
            if not values.get("height") and not fluid_without_fixed_height:
                self.errors.append(
                    "images without a height attribute must use a fluid inline width"
                )
            for required in ("display:block", "height:auto", "max-width:"):
                if required not in style:
                    self.errors.append(f"images must include {required} inline")


def validate_wrapper(wrapper: str) -> None:
    required = (
        CONTENT_MARKER,
        TEMPLATE_LOGO_URL,
        UNSUBSCRIBE_URL_MARKER,
        ADDRESS_MARKER,
        '<table class="ch47-shell"',
        'role="presentation"',
        'max-width:600px',
        '<!--[if mso]>',
        'bgcolor="#fdfdfc"',
    )
    missing = [token for token in required if token not in wrapper]
    if missing:
        raise RuntimeError(f"Email wrapper is missing compatibility tokens: {missing}")
    if wrapper.count(CONTENT_MARKER) != 1:
        raise RuntimeError("Kit email template must contain exactly one message_content token")
    forbidden = (
        LEGACY_CONTENT_MARKER,
        "../public/email/",
        "rgba(",
        "display:flex",
        "display:grid",
        "<script",
        "<form",
    )
    normalized = wrapper.lower().replace(" ", "")
    found = [
        token
        for token in forbidden
        if token.lower().replace(" ", "") in normalized
    ]
    if found:
        raise RuntimeError(f"Email wrapper contains risky compatibility tokens: {found}")


def validate_issue_html(body: str) -> None:
    validator = IssueHTMLValidator()
    validator.feed(body)
    validator.close()
    if validator.errors:
        raise ValueError("Email HTML failed compatibility checks: " + "; ".join(validator.errors))


def validate_rendered_size(rendered: str) -> None:
    size = len(rendered.encode("utf-8"))
    if size >= MAX_RENDERED_BYTES:
        raise ValueError(
            f"Rendered email is {size} bytes; keep it below {MAX_RENDERED_BYTES} "
            "to leave room for Kit's template and link rewriting"
        )


def load_env_file(path: Path) -> None:
    if not path.exists():
        return
    for raw in path.read_text().splitlines():
        line = raw.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, value = line.split("=", 1)
        key = key.strip()
        value = value.strip().strip("'").strip('"')
        if key and key.replace("_", "").isalnum() and key not in os.environ:
            os.environ[key] = value


def load_runtime() -> tuple[dict[str, Any], str]:
    load_env_file(WORKSPACE / ".env.local")
    load_env_file(ROOT / ".env.local")
    config = json.loads(CONFIG_FILE.read_text())
    wrapper = WRAPPER_FILE.read_text()
    if config.get("logo_url") != TEMPLATE_LOGO_URL:
        raise RuntimeError(
            f"Configured logo must match the Kit template URL {TEMPLATE_LOGO_URL}"
        )
    validate_wrapper(wrapper)
    return config, wrapper


def parse_issue(path: Path) -> tuple[dict[str, str], str]:
    raw = path.read_text()
    lines = raw.splitlines()
    if not lines or lines[0].strip() != "---":
        raise ValueError(f"{path} must start with --- frontmatter")
    try:
        end = next(i for i, line in enumerate(lines[1:], start=1) if line.strip() == "---")
    except StopIteration as exc:
        raise ValueError(f"{path} is missing the closing --- frontmatter marker") from exc

    meta: dict[str, str] = {}
    for line in lines[1:end]:
        if not line.strip() or line.lstrip().startswith("#"):
            continue
        if ":" not in line:
            raise ValueError(f"Invalid frontmatter line: {line}")
        key, value = line.split(":", 1)
        meta[key.strip()] = value.strip()

    for key in ("subject", "preview_text", "description"):
        if not meta.get(key):
            raise ValueError(f"{path} is missing required frontmatter: {key}")

    body = "\n".join(lines[end + 1 :]).strip()
    if not body:
        raise ValueError(f"{path} has no email body")
    validate_issue_html(body)
    return meta, body


def validate_api_content(body: str) -> None:
    """Reject a nested template before body HTML reaches Kit's content field."""
    validate_issue_html(body)
    normalized = body.lower().replace(" ", "")
    wrapper_tokens = (
        CONTENT_MARKER,
        LEGACY_CONTENT_MARKER,
        'class="ch47-shell"',
        "<style",
        "<table",
        "<!--[ifmso]",
    )
    found = [
        token
        for token in wrapper_tokens
        if token.lower().replace(" ", "") in normalized
    ]
    if found:
        raise ValueError(
            "Kit broadcast content must contain issue body HTML only; "
            f"found wrapper tokens: {found}"
        )


def render_template_preview(template: str, body: str, logo_url: str) -> str:
    """Assemble the Kit HTML template and body for local visual QA only."""
    validate_api_content(body)
    return (
        template.replace(CONTENT_MARKER, body)
        .replace(TEMPLATE_LOGO_URL, logo_url)
        .replace(UNSUBSCRIBE_URL_MARKER, "https://channel47.dev/#unsubscribe-preview")
        .replace(ADDRESS_MARKER, "Channel47 preview address")
    )


def preview_document(fragment: str) -> str:
    """Wrap an assembled template in a browser-friendly document for local QA."""
    return """<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="color-scheme" content="light dark">
  <meta name="supported-color-schemes" content="light dark">
  <title>Channel47 email preview</title>
</head>
<body style="margin:0;padding:0;background:#fdfdfc;">
""" + fragment + "\n</body>\n</html>\n"


def inline_logo_url() -> str:
    encoded = base64.b64encode(LOGO_FILE.read_bytes()).decode("ascii")
    return f"data:{LOGO_CONTENT_TYPE};base64,{encoded}"


def api_request(
    method: str,
    path: str,
    *,
    params: dict[str, Any] | None = None,
    data: dict[str, Any] | None = None,
) -> dict[str, Any]:
    api_key = os.environ.get("KIT_API_KEY", "").strip()
    if not api_key:
        raise RuntimeError("KIT_API_KEY is missing from the parent or site .env.local")
    url = f"{KIT_BASE}{path}"
    if params:
        url += "?" + urllib.parse.urlencode(params)
    req = urllib.request.Request(
        url,
        data=json.dumps(data).encode("utf-8") if data is not None else None,
        headers={
            "X-Kit-Api-Key": api_key,
            "Content-Type": "application/json",
            "Accept": "application/json",
        },
        method=method,
    )
    try:
        with urllib.request.urlopen(req, timeout=30) as response:
            raw = response.read().decode("utf-8")
            return json.loads(raw) if raw else {}
    except urllib.error.HTTPError as exc:
        detail = exc.read().decode("utf-8", errors="replace")
        raise RuntimeError(f"Kit HTTP {exc.code}: {detail}") from exc


def verify_public_logo(url: str) -> dict[str, Any]:
    if not url.startswith("https://"):
        raise RuntimeError("Configured email logo must use an absolute HTTPS URL")
    request = urllib.request.Request(url, method="HEAD")
    try:
        with urllib.request.urlopen(request, timeout=30) as response:
            content_type = response.headers.get_content_type()
            if response.status != 200:
                raise RuntimeError(f"Email logo returned HTTP {response.status}")
            if content_type != LOGO_CONTENT_TYPE:
                raise RuntimeError(
                    f"Email logo returned {content_type!r}; expected {LOGO_CONTENT_TYPE!r}"
                )
            return {
                "status": response.status,
                "content_type": content_type,
                "content_length": response.headers.get("Content-Length"),
            }
    except urllib.error.HTTPError as exc:
        raise RuntimeError(f"Email logo returned HTTP {exc.code}: {url}") from exc


def verify_config(config: dict[str, Any]) -> dict[str, Any]:
    account_response = api_request("GET", "/account")
    account = account_response.get("account", account_response)
    templates = api_request("GET", "/email_templates", params={"per_page": 500}).get(
        "email_templates", []
    )
    configured_template_id = config.get("template_id")
    if configured_template_id is None:
        matches = [
            item for item in templates if item.get("name") == config["template_name"]
        ]
        if len(matches) != 1:
            raise RuntimeError(
                f"Expected exactly one Kit template named {config['template_name']!r}; "
                f"found {len(matches)}"
            )
        template = matches[0]
    else:
        template = next(
            (item for item in templates if item.get("id") == configured_template_id),
            None,
        )
    audience = config["audience"]
    if audience.get("type") != "all_active_subscribers":
        raise RuntimeError(
            "Channel47 broadcasts must target all active Kit subscribers; "
            f"found audience type {audience.get('type')!r}"
        )
    if not template:
        raise RuntimeError(f"Configured Kit template {configured_template_id} was not found")
    if template.get("name") != config["template_name"]:
        raise RuntimeError(
            f"Configured template name drifted: expected {config['template_name']!r}, "
            f"found {template.get('name')!r}"
        )
    if template.get("category") != "HTML":
        raise RuntimeError(
            f"Configured template must be an HTML template; found {template.get('category')!r}"
        )
    sending_addresses = account.get("sending_addresses", [])
    sender = next(
        (item for item in sending_addresses if item.get("email_address") == config["sender"]),
        None,
    )
    if not sender:
        raise RuntimeError(f"Configured sender {config['sender']!r} was not found")
    if sender.get("status") != "confirmed" or not sender.get("is_verified"):
        raise RuntimeError(
            f"Configured sender {config['sender']!r} is not confirmed and verified"
        )
    if sender.get("from_name") != config.get("sender_name"):
        raise RuntimeError(
            f"Configured sender name drifted: expected {config.get('sender_name')!r}, "
            f"found {sender.get('from_name')!r}"
        )
    if not sender.get("is_dmarc_configured"):
        raise RuntimeError(f"Configured sender {config['sender']!r} does not have DMARC configured")
    subscribers = api_request(
        "GET",
        "/subscribers",
        params={
            "status": "active",
            "per_page": 1,
            "include_total_count": "true",
            "slim": "true",
        },
    )
    total = subscribers.get("pagination", {}).get("total_count")
    if total is None:
        raise RuntimeError("Kit did not return the active subscriber total")
    return {
        "template": template,
        "sender": sender,
        "audience": audience,
        "audience_count": total,
    }


def cmd_check(config: dict[str, Any]) -> None:
    verified = verify_config(config)
    print("Kit account and broadcast configuration are valid")
    print(f"  Template: {verified['template']['name']} ({verified['template']['id']})")
    print(
        f"  Sender: {config['sender_name']} <{config['sender']}> "
        "(verified; DMARC configured)"
    )
    print(f"  Audience: {verified['audience']['name']}; {verified['audience_count']} subscriber(s)")
    logo = verify_public_logo(config["logo_url"])
    print(f"  Logo: {config['logo_url']} ({logo['content_type']}; HTTP {logo['status']})")
    print("  Safety: draft-only; no scheduling or sending path")


def cmd_render(issue_path: Path, output: Path | None, wrapper: str) -> None:
    meta, body = parse_issue(issue_path)
    rendered = preview_document(
        render_template_preview(wrapper, body, inline_logo_url())
    )
    validate_rendered_size(rendered)
    if output:
        output.write_text(rendered)
        print(f"Rendered {output}")
    else:
        print(rendered)


def build_draft_payload(
    meta: dict[str, str], body: str, config: dict[str, Any], template_id: int
) -> dict[str, Any]:
    """Build an all-active-subscriber draft with no scheduling capability."""
    if config["audience"].get("type") != "all_active_subscribers":
        raise RuntimeError("Refusing to build a draft for a restricted legacy audience")
    validate_api_content(body)
    if not isinstance(template_id, int):
        raise RuntimeError("A verified Kit HTML template ID is required")
    # Kit documents an omitted subscriber_filter as the all-subscriber default.
    # The platform applies deliverability state and excludes non-active records.
    return {
        "email_template_id": template_id,
        "email_address": config["sender"],
        "content": body,
        "description": meta["description"],
        "public": False,
        "published_at": None,
        "send_at": None,
        "thumbnail_alt": None,
        "thumbnail_url": None,
        "preview_text": meta["preview_text"],
        "subject": meta["subject"],
    }


def subscriber_filter_types(broadcast: dict[str, Any]) -> set[str]:
    return {
        item.get("type")
        for group in broadcast.get("subscriber_filter") or []
        for mode in ("all", "any", "none")
        for item in group.get(mode) or []
        if item.get("type")
    }


def verify_all_subscriber_filter(broadcast: dict[str, Any]) -> None:
    groups = broadcast.get("subscriber_filter") or []
    if not groups:
        return
    canonical_all_subscribers = [
        {"all": [{"type": "all_subscribers"}]}
    ]
    if groups != canonical_all_subscribers:
        raise RuntimeError(
            "Kit returned an unexpected restricted audience: "
            f"{subscriber_filter_types(broadcast)}"
        )


def verify_editable_draft(broadcast: dict[str, Any]) -> None:
    if broadcast.get("status") != "draft":
        raise RuntimeError(
            f"Refusing to update broadcast with status {broadcast.get('status')!r}"
        )
    if broadcast.get("send_at") is not None:
        raise RuntimeError("Refusing to update a scheduled Kit broadcast")
    if broadcast.get("published_at") is not None or broadcast.get("public"):
        raise RuntimeError("Refusing to update a published Kit broadcast")
    verify_all_subscriber_filter(broadcast)


def verify_saved_draft(
    broadcast: dict[str, Any], *, expected_template_id: int, expected_body: str
) -> None:
    verify_editable_draft(broadcast)
    template = broadcast.get("email_template") or {}
    if template.get("id") != expected_template_id:
        raise RuntimeError(
            f"Kit saved template {template.get('id')!r}; expected {expected_template_id}"
        )
    saved_body = broadcast.get("content")
    if saved_body != expected_body:
        raise RuntimeError("Kit saved content that differs from the reviewed issue body")
    validate_api_content(saved_body)


def cmd_draft(issue_path: Path, config: dict[str, Any], wrapper: str) -> None:
    meta, body = parse_issue(issue_path)
    assembled = render_template_preview(wrapper, body, config["logo_url"])
    validate_rendered_size(assembled)
    verified = verify_config(config)
    verify_public_logo(config["logo_url"])
    template_id = verified["template"]["id"]
    payload = build_draft_payload(meta, body, config, template_id)
    result = api_request("POST", "/broadcasts", data=payload)
    broadcast = result.get("broadcast", result)
    verify_saved_draft(
        broadcast,
        expected_template_id=template_id,
        expected_body=body,
    )
    print("Created unscheduled Kit draft")
    print(f"  ID: {broadcast.get('id')}")
    print(f"  Subject: {broadcast.get('subject')}")
    print(f"  Template: {verified['template']['name']}")
    print(f"  Audience: {verified['audience']['name']} ({verified['audience_count']} active)")
    print("  send_at: null")


def cmd_update(
    broadcast_id: int,
    issue_path: Path,
    config: dict[str, Any],
    wrapper: str,
) -> None:
    meta, body = parse_issue(issue_path)
    assembled = render_template_preview(wrapper, body, config["logo_url"])
    validate_rendered_size(assembled)
    verified = verify_config(config)
    verify_public_logo(config["logo_url"])

    current_result = api_request("GET", f"/broadcasts/{broadcast_id}")
    current = current_result.get("broadcast", current_result)
    if current.get("id") != broadcast_id:
        raise RuntimeError("Kit returned the wrong broadcast during the safety check")
    verify_editable_draft(current)

    template_id = verified["template"]["id"]
    payload = build_draft_payload(meta, body, config, template_id)

    # Kit represents the whole active list on saved broadcasts as an
    # `all_subscribers` filter, but its update endpoint only accepts tag or
    # segment filters. Omitting subscriber_filter preserves the unrestricted
    # audience and lets Kit continue applying active/deliverable status.

    result = api_request("PUT", f"/broadcasts/{broadcast_id}", data=payload)
    broadcast = result.get("broadcast", result)
    verify_saved_draft(
        broadcast,
        expected_template_id=template_id,
        expected_body=body,
    )
    print("Updated unscheduled Kit draft")
    print(f"  ID: {broadcast.get('id')}")
    print(f"  Subject: {broadcast.get('subject')}")
    print(f"  Template: {verified['template']['name']} ({template_id})")
    print(f"  Audience: {verified['audience']['name']} ({verified['audience_count']} active)")
    print("  send_at: null")


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    subparsers = parser.add_subparsers(dest="command", required=True)
    subparsers.add_parser("check", help="Verify live Kit template, sender, and audience configuration")
    render = subparsers.add_parser("render", help="Render a local HTML preview")
    render.add_argument("issue", type=Path)
    render.add_argument("--output", type=Path)
    draft = subparsers.add_parser("draft", help="Create an unscheduled, non-public Kit draft")
    draft.add_argument("issue", type=Path)
    update = subparsers.add_parser("update", help="Safely update an existing unscheduled Kit draft")
    update.add_argument("broadcast_id", type=int)
    update.add_argument("issue", type=Path)
    args = parser.parse_args()

    try:
        config, wrapper = load_runtime()
        if args.command == "check":
            cmd_check(config)
        elif args.command == "render":
            cmd_render(args.issue, args.output, wrapper)
        elif args.command == "draft":
            cmd_draft(args.issue, config, wrapper)
        elif args.command == "update":
            cmd_update(args.broadcast_id, args.issue, config, wrapper)
        return 0
    except (OSError, ValueError, KeyError, json.JSONDecodeError, RuntimeError) as exc:
        print(f"Error: {exc}", file=sys.stderr)
        return 1


if __name__ == "__main__":
    sys.exit(main())

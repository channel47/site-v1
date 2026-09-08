from __future__ import annotations

import importlib.util
import json
import unittest
from pathlib import Path
from unittest.mock import patch


ROOT = Path(__file__).resolve().parents[1]
MODULE_PATH = ROOT / "scripts" / "kit-broadcast.py"
SPEC = importlib.util.spec_from_file_location("kit_broadcast", MODULE_PATH)
assert SPEC and SPEC.loader
kit_broadcast = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(kit_broadcast)


class KitBroadcastTests(unittest.TestCase):
    def setUp(self) -> None:
        self.config = json.loads((ROOT / "newsletter" / "config.json").read_text())
        self.wrapper = (ROOT / "newsletter" / "channel47-wrapper.html").read_text()
        self.fixture = ROOT / "newsletter" / "fixtures" / "client-qa.html"

    def test_wrapper_has_conservative_email_layout(self) -> None:
        kit_broadcast.validate_wrapper(self.wrapper)
        normalized = self.wrapper.lower().replace(" ", "")
        self.assertNotIn("rgba(", normalized)
        self.assertNotIn("display:flex", normalized)
        self.assertNotIn("display:grid", normalized)
        self.assertIn("<!--[ifmso]>", normalized)
        self.assertIn('role="presentation"', self.wrapper)
        self.assertEqual(1, self.wrapper.count(kit_broadcast.CONTENT_MARKER))
        self.assertIn(kit_broadcast.UNSUBSCRIBE_URL_MARKER, self.wrapper)
        self.assertIn(kit_broadcast.ADDRESS_MARKER, self.wrapper)
        self.assertIn(kit_broadcast.TEMPLATE_LOGO_URL, self.wrapper)
        self.assertIn("Forwarded this email?", self.wrapper)
        self.assertIn("https://channel47.dev/newsletter?utm_source=forwarded_email", self.wrapper)
        self.assertIn("https://channel47.dev/jackson.jpeg", self.wrapper)
        self.assertIn('alt="Jackson Dean"', self.wrapper)
        content_index = self.wrapper.index(kit_broadcast.CONTENT_MARKER)
        byline_index = self.wrapper.index('class="ch47-byline"')
        footer_rule_index = self.wrapper.index('class="ch47-footer ch47-rule-top"')
        self.assertLess(content_index, byline_index)
        self.assertLess(byline_index, footer_rule_index)
        self.assertIn("https://channel47.dev/email/social-x-v2.png", self.wrapper)
        self.assertIn("https://channel47.dev/email/social-github-v2.png", self.wrapper)
        self.assertIn("https://channel47.dev/email/social-linkedin-v2.png", self.wrapper)
        self.assertIn('aria-label="X"', self.wrapper)
        self.assertIn('aria-label="GitHub"', self.wrapper)
        self.assertIn('aria-label="LinkedIn"', self.wrapper)
        self.assertNotIn("/>X</a>", self.wrapper)
        self.assertNotIn("/>GitHub</a>", self.wrapper)
        self.assertNotIn("/>LinkedIn</a>", self.wrapper)
        self.assertNotIn(kit_broadcast.LEGACY_CONTENT_MARKER, self.wrapper)

    def test_byline_spacing_is_owned_by_email_safe_cell_padding(self) -> None:
        self.assertIn(
            'class="ch47-copy" bgcolor="#fdfdfc" valign="top" '
            'style="padding:24px 28px 0;',
            self.wrapper,
        )
        self.assertIn(
            'class="ch47-byline" bgcolor="#fdfdfc" '
            'style="padding:32px 28px 36px;',
            self.wrapper,
        )
        self.assertIn("padding: 20px 20px 0 !important;", self.wrapper)
        self.assertIn("padding: 28px 20px 32px !important;", self.wrapper)

    def test_fixture_renders_as_small_standalone_preview(self) -> None:
        meta, body = kit_broadcast.parse_issue(self.fixture)
        fragment = kit_broadcast.render_template_preview(
            self.wrapper,
            body,
            "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==",
        )
        rendered = kit_broadcast.preview_document(fragment)
        kit_broadcast.validate_rendered_size(rendered)
        self.assertNotIn(kit_broadcast.CONTENT_MARKER, rendered)
        self.assertNotIn(kit_broadcast.UNSUBSCRIBE_URL_MARKER, rendered)
        self.assertNotIn(kit_broadcast.ADDRESS_MARKER, rendered)
        self.assertNotIn(kit_broadcast.TEMPLATE_LOGO_URL, rendered)
        self.assertNotIn(meta["preview_text"], rendered)
        self.assertIn('<meta name="viewport"', rendered)

    def test_draft_payload_targets_the_active_list_without_a_filter(self) -> None:
        meta, body = kit_broadcast.parse_issue(self.fixture)
        payload = kit_broadcast.build_draft_payload(meta, body, self.config, 6000000)
        self.assertNotIn("subscriber_filter", payload)
        self.assertIsNone(payload["send_at"])
        self.assertIsNone(payload["published_at"])
        self.assertFalse(payload["public"])
        self.assertEqual(meta["preview_text"], payload["preview_text"])
        self.assertEqual(6000000, payload["email_template_id"])
        self.assertEqual(body, payload["content"])
        self.assertNotIn("ch47-shell", payload["content"])
        self.assertNotIn("<style", payload["content"])
        self.assertNotIn(self.config["logo_url"], payload["content"])

    def test_live_config_check_uses_active_subscribers_not_tags(self) -> None:
        calls: list[tuple[str, dict | None]] = []

        def fake_api_request(method: str, path: str, **kwargs: object) -> dict:
            calls.append((path, kwargs.get("params")))
            if path == "/account":
                return {
                    "account": {
                        "sending_addresses": [
                            {
                                "email_address": "jackson@channel47.dev",
                                "from_name": "Jackson",
                                "status": "confirmed",
                                "is_verified": True,
                                "is_dmarc_configured": True,
                            }
                        ]
                    }
                }
            if path == "/email_templates":
                return {
                    "email_templates": [
                        {"id": 6000000, "name": "ch47-v2", "category": "HTML"}
                    ]
                }
            if path == "/subscribers":
                return {"subscribers": [], "pagination": {"total_count": 53}}
            raise AssertionError(f"Unexpected API path {path}")

        with patch.object(kit_broadcast, "api_request", side_effect=fake_api_request):
            verified = kit_broadcast.verify_config(self.config)

        self.assertEqual(53, verified["audience_count"])
        self.assertEqual(6000000, verified["template"]["id"])
        self.assertEqual("Jackson", verified["sender"]["from_name"])
        self.assertFalse(any(path.startswith("/tags") for path, _ in calls))
        subscriber_params = next(params for path, params in calls if path == "/subscribers")
        self.assertEqual("active", subscriber_params["status"])

    def test_legacy_restricted_audience_is_rejected(self) -> None:
        restricted = dict(self.config)
        restricted["audience"] = {
            "type": "tag",
            "id": 42,
            "name": "ch47-subscribe",
        }
        with self.assertRaises(RuntimeError):
            kit_broadcast.build_draft_payload(
                {}, '<p style="line-height:170%;">Body</p>', restricted, 6000000
            )

    def test_issue_validator_rejects_web_layout_and_relative_links(self) -> None:
        with self.assertRaises(ValueError):
            kit_broadcast.validate_issue_html(
                '<div style="display:flex"><a href="/relative">Bad</a></div>'
            )
        with self.assertRaises(ValueError):
            kit_broadcast.validate_issue_html(
                '<p style="line-height:170%;"><a href="{{ arbitrary_token }}" '
                'style="color:#161718;text-decoration:underline;">Bad</a></p>'
            )
        with self.assertRaises(ValueError):
            kit_broadcast.validate_issue_html("<p>Missing inline fallback styles.</p>")

    def test_issue_validator_accepts_kit_unsubscribe_marker(self) -> None:
        kit_broadcast.validate_issue_html(
            '<p style="line-height:170%;"><a href="{{ unsubscribe_url }}" '
            'style="color:#161718;text-decoration:underline;">Unsubscribe</a></p>'
        )

    def test_issue_validator_accepts_a_fluid_image_without_fixed_height(self) -> None:
        kit_broadcast.validate_issue_html(
            '<p align="center" style="line-height:100%;">'
            '<img src="https://channel47.dev/email/example.jpg" width="360" '
            'alt="A useful example" '
            'style="display:block;width:100%;max-width:360px;height:auto;" />'
            "</p>"
        )

    def test_payload_rejects_a_nested_wrapper(self) -> None:
        meta, _ = kit_broadcast.parse_issue(self.fixture)
        with self.assertRaises(ValueError):
            kit_broadcast.build_draft_payload(
                meta,
                '<table class="ch47-shell"><tr><td>Nested</td></tr></table>',
                self.config,
                6000000,
            )

    def test_update_replaces_nested_content_with_issue_body_only(self) -> None:
        meta, body = kit_broadcast.parse_issue(self.fixture)
        calls: list[tuple[str, str, dict | None]] = []
        current_filter = [{"all": [{"type": "all_subscribers"}]}]

        def fake_api_request(
            method: str, path: str, **kwargs: object
        ) -> dict:
            data = kwargs.get("data")
            calls.append((method, path, data if isinstance(data, dict) else None))
            if method == "GET":
                return {
                    "broadcast": {
                        "id": 123456,
                        "status": "draft",
                        "send_at": None,
                        "published_at": None,
                        "public": False,
                        "subscriber_filter": current_filter,
                    }
                }
            if method == "PUT":
                assert isinstance(data, dict)
                return {
                    "broadcast": {
                        **data,
                        "id": 123456,
                        "status": "draft",
                        "email_template": {"id": 6000000, "name": "ch47-v2"},
                    }
                }
            raise AssertionError(f"Unexpected API call {method} {path}")

        verified = {
            "template": {"id": 6000000, "name": "ch47-v2"},
            "audience": self.config["audience"],
            "audience_count": 53,
        }
        with (
            patch.object(kit_broadcast, "api_request", side_effect=fake_api_request),
            patch.object(kit_broadcast, "verify_config", return_value=verified),
            patch.object(kit_broadcast, "verify_public_logo", return_value={}),
        ):
            kit_broadcast.cmd_update(
                123456, self.fixture, self.config, self.wrapper
            )

        put_data = next(data for method, _, data in calls if method == "PUT")
        assert put_data is not None
        self.assertEqual(meta["subject"], put_data["subject"])
        self.assertEqual(body, put_data["content"])
        self.assertEqual(6000000, put_data["email_template_id"])
        self.assertNotIn("subscriber_filter", put_data)
        self.assertIsNone(put_data["send_at"])
        self.assertFalse(put_data["public"])

    def test_update_refuses_a_scheduled_broadcast(self) -> None:
        def fake_api_request(method: str, path: str, **_: object) -> dict:
            if method == "GET":
                return {
                    "broadcast": {
                        "id": 123456,
                        "status": "draft",
                        "send_at": "2026-07-17T17:00:00Z",
                        "published_at": None,
                        "public": False,
                        "subscriber_filter": [
                            {"all": [{"type": "all_subscribers"}]}
                        ],
                    }
                }
            raise AssertionError("A scheduled broadcast must not be updated")

        verified = {
            "template": {"id": 6000000, "name": "ch47-v2"},
            "audience": self.config["audience"],
            "audience_count": 53,
        }
        with (
            patch.object(kit_broadcast, "api_request", side_effect=fake_api_request),
            patch.object(kit_broadcast, "verify_config", return_value=verified),
            patch.object(kit_broadcast, "verify_public_logo", return_value={}),
            self.assertRaises(RuntimeError),
        ):
            kit_broadcast.cmd_update(
                123456, self.fixture, self.config, self.wrapper
            )

    def test_editable_draft_rejects_unsafe_states_and_audiences(self) -> None:
        safe = {
            "id": 123456,
            "status": "draft",
            "send_at": None,
            "published_at": None,
            "public": False,
            "subscriber_filter": [
                {"all": [{"type": "all_subscribers"}]}
            ],
        }
        unsafe_cases = {
            "sent": {**safe, "status": "sent"},
            "public": {**safe, "public": True},
            "published": {**safe, "published_at": "2026-07-16T07:00:00Z"},
            "tag": {
                **safe,
                "subscriber_filter": [{"all": [{"type": "tag", "id": 42}]}],
            },
            "segment": {
                **safe,
                "subscriber_filter": [
                    {"all": [{"type": "segment", "id": 99}]}
                ],
            },
            "inverted all subscribers": {
                **safe,
                "subscriber_filter": [
                    {"none": [{"type": "all_subscribers"}]}
                ],
            },
        }

        kit_broadcast.verify_editable_draft(safe)
        kit_broadcast.verify_editable_draft({**safe, "subscriber_filter": []})
        for name, broadcast in unsafe_cases.items():
            with self.subTest(name=name), self.assertRaises(RuntimeError):
                kit_broadcast.verify_editable_draft(broadcast)


if __name__ == "__main__":
    unittest.main()

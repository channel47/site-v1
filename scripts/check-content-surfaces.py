"""Read-only regression checks against a local dev or production server.
Run: python3 scripts/check-content-surfaces.py http://localhost:3101
For a development server with the editorial preview: add --draft-preview.
"""
import json
import re
import struct
import sys
import xml.etree.ElementTree as ET
from html.parser import HTMLParser
from pathlib import Path
from urllib.request import Request, urlopen
from urllib.error import HTTPError

origin = sys.argv[1] if len(sys.argv) > 1 else 'http://localhost:3100'
draft_preview = '--draft-preview' in sys.argv[2:]
site = 'https://channel47.dev'


def fetch(path, accept=None):
    req = Request(origin + path, headers={'Accept': accept} if accept else {})
    with urlopen(req) as response:
        assert response.status == 200, path
        return response.read(), response.url.removeprefix(origin)


def expect_not_found(path):
    try:
        urlopen(origin + path)
    except HTTPError as error:
        assert error.code == 404, (path, error.code)
    else:
        raise AssertionError('Unexpected public page or asset: ' + path)


class Page(HTMLParser):
    def __init__(self, html):
        super().__init__()
        self.rows = []
        self.objects = []
        self.images = []
        self.videos = 0
        self.canonical = None
        self.feed(html)

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == 'link' and attrs.get('rel') == 'canonical':
            self.canonical = attrs['href']
        if tag == 'a' and attrs.get('class') == 'st-row':
            self.rows.append(attrs['href'])
        if tag == 'a' and attrs.get('class') == 'collection-link':
            self.objects.append(attrs['href'])
        if tag == 'img' and attrs.get('src', '').startswith('/collection/'):
            self.images.append(attrs['src'])
        if tag == 'video':
            self.videos += 1


expected = {'projects': [], 'notes': []}
legacy = []
for folder, group in [('projects', 'projects'), ('notes', 'notes')]:
    for source in Path('content', folder).glob('*.md'):
        slug_match = re.search(r'^slug: *([^\n]+)', source.read_text(), re.M)
        slug = slug_match.group(1).strip(' "\'') if slug_match else source.stem
        path = f'/{group}/{slug}'
        expected[group].append(path)
        historical = re.search(r'^rssId: *([^\n]+)', source.read_text(), re.M)
        if historical:
            legacy.append((historical.group(1).strip(), path))

all_paths = expected['projects'] + expected['notes']
assert len(set(all_paths)) == len(all_paths)
home, _ = fetch('/')
collection = Page(home.decode())
assert len(collection.objects) == len(set(collection.objects)), 'Duplicate collection object'
allowed_paths = set(all_paths) | ({'/preview/vellum'} if draft_preview else set())
assert set(collection.objects).issubset(allowed_paths), 'Collection points to an unpublished piece'
if draft_preview:
    assert '/preview/vellum' in collection.objects
    draft, _ = fetch('/preview/vellum')
    assert b'Unpublished draft' in draft
    assert b'name="robots" content="noindex, nofollow"' in draft
    assert b'Editorial notes for the next revision' not in draft
    for name in ['x-all-grid', 'x-all-agent', 'x-all-disposal-viewer']:
        media_path = f'/preview/vellum/media/{name}.webp'
        assert media_path.encode() in draft
        image, _ = fetch(media_path)
        assert image[:4] == b'RIFF' and image[8:12] == b'WEBP'
    expect_not_found('/preview/unknown')
    expect_not_found('/preview/vellum/media/unknown.webp')
else:
    expect_not_found('/preview/vellum')
    expect_not_found('/preview/vellum/media/x-all-grid.webp')
assert collection.videos == 0, 'The Flow walkthrough belongs inside its article'
assert '/collection/elt-specimen.webp' in collection.images
assert '/collection/research-loupe.webp' in collection.images
assert '/collection/ads-plug.webp' in collection.images
for image in collection.images:
    image_bytes, _ = fetch(image)
    assert image_bytes[:4] == b'RIFF' and image_bytes[8:12] == b'WEBP', image
for group, paths in expected.items():
    html, _ = fetch('/browse?type=' + group)
    assert set(Page(html.decode()).rows) == set(paths), group
    for path in paths:
        html, _ = fetch(path)
        assert Page(html.decode()).canonical == site + path, path
        md, _ = fetch(path + '.md')
        negotiated, _ = fetch(path, 'text/markdown')
        assert md == negotiated, path
        assert f'canonical: "{site}{path}"' in md.decode(), path
        assert f'group: "{group}"' in md.decode(), path
        png, _ = fetch(path + '/opengraph-image')
        assert png[:8] == b'\x89PNG\r\n\x1a\n' and struct.unpack('>II', png[16:24]) == (1200, 630), path

for old, new in legacy:
    for suffix in ['', '.md', '/opengraph-image']:
        _, final = fetch(old + suffix)
        assert final == new + suffix, (old, final)

# The build story and installation page now resolve to one Google Ads piece.
for suffix in ['', '.md', '/opengraph-image']:
    body, final = fetch('/notes/google-ads-mcp' + suffix)
    assert final == '/projects/google-ads' + suffix, final
merged, final = fetch('/notes/google-ads-mcp', 'text/markdown')
assert final == '/projects/google-ads'
assert b'My first MCP' in merged and b'npx @channel47/google-ads-mcp@latest' in merged

# The Flow experiment and Codex follow-up share one canonical note.
flow_old = '/notes/google-flow-reference-led-product-imagery'
creative = '/notes/codex-static-ads-google-flow'
for suffix in ['', '.md', '/opengraph-image']:
    _, final = fetch(flow_old + suffix)
    assert final == creative + suffix, final
_, final = fetch('/md' + flow_old)
assert final == creative + '.md', final
combined, _ = fetch(creative)
assert Page(combined.decode()).videos == 1
assert b'google-flow-reference-led-product-imagery.vtt' in combined
assert b'codex-static-ads-composited-pass.jpg' in combined
assert b'codex-static-ads-native-pass.jpg' in combined
merged, final = fetch(flow_old, 'text/markdown')
assert final == creative
assert b'I attached two reference images' in merged and b'The part I wanted to save' in merged

for old, group in [('skills', 'projects'), ('connectors', 'projects'), ('posts', 'notes'), ('workshops', 'notes')]:
    html, final = fetch('/browse?type=' + old)
    assert final == '/browse?type=' + group, final
    assert set(Page(html.decode()).rows) == set(expected[group])

xml, _ = fetch('/sitemap.xml')
root = ET.fromstring(xml)
urls = [e.text for e in root.findall('{*}url/{*}loc')]
assert site + '/notes/google-ads-mcp' not in urls
assert site + flow_old not in urls
assert all(site + path in urls for path in all_paths)
assert not any('/preview/' in url for url in urls)
assert not any(re.match(site + r'/(skills|connectors|posts|workshops)/', u) for u in urls)
for index in ['/llms.txt', '/sitemap.md']:
    body, _ = fetch(index)
    text = body.decode()
    assert '## Projects' in text and '## Notes' in text
    assert not re.search(r'^## (Skills|Connectors|Posts|Workshops)$', text, re.M)
    assert all(site + path in text for path in all_paths)
    assert '/preview/vellum' not in text
api, _ = fetch('/api')
assert [r['name'] for r in json.loads(api)['resources']] == ['projects', 'notes']
search, _ = fetch('/api/search?q=google')
results = json.loads(search)['results']
assert sum(r['url'] == site + '/projects/google-ads' for r in results) == 1
assert all(r['url'] != site + '/notes/google-ads-mcp' for r in results)
assert all(r['url'] != site + flow_old for r in results)
assert sum(r['url'] == site + creative for r in results) == 1
assert results
assert all(r['url'].startswith(site + '/' + r['group'] + '/') for r in results)
draft_search, _ = fetch('/api/search?q=vellum')
assert not json.loads(draft_search)['results'], 'Draft must not enter public search'
rss, _ = fetch('/rss.xml')
feed = ET.fromstring(rss)
assert not any(i.findtext('link') == site + flow_old for i in feed.findall('./channel/item'))
creative_items = [i for i in feed.findall('./channel/item') if i.findtext('link') == site + creative]
assert len(creative_items) == 1
assert creative_items[0].findtext('guid') == site + creative
for item in feed.findall('./channel/item'):
    assert re.match(site + r'/(projects|notes)/', item.findtext('link'))
assert b'/preview/vellum' not in rss
for old, new in legacy:
    items = [i for i in feed.findall('./channel/item') if i.findtext('link') == site + new]
    if items:
        assert items[0].findtext('guid') == site + old, old
# Retired pieces must disappear everywhere, not merely from the gallery.
retired = ['ad-recon', 'brief-me', 'creative-strategist', 'make-static-ads', 'bing-ads', 'linkedin-ads', 'meta-ads', 'pinterest-ads', 'tiktok-ads']
for slug in retired:
    retired_path = '/projects/' + slug
    assert site + retired_path not in urls
    assert not any(i.findtext('link') == site + retired_path for i in feed.findall('./channel/item'))
    for suffix in ['', '.md']:
        expect_not_found(retired_path + suffix)
# Media paths under /posts must not be mistaken for retired article routes.
media, path = fetch('/posts/codex-static-ads-native-pass.jpg')
assert media[:2] == b'\xff\xd8' and path.startswith('/posts/')
print(f'Passed: {len(all_paths)} canonical pages and their markdown, negotiated responses, social previews; {len(legacy) * 3} legacy redirects; browse filters, search, both sitemaps, RSS identity, media URLs, draft isolation, and retired-page 404s.')

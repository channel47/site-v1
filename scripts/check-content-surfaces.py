"""Read-only regression checks against a local dev or production server.
Run: python3 scripts/check-content-surfaces.py http://localhost:3101
"""
import json
import re
import struct
import sys
import xml.etree.ElementTree as ET
from html.parser import HTMLParser
from pathlib import Path
from email.utils import parsedate_to_datetime
from urllib.request import Request, urlopen
from urllib.error import HTTPError

origin = sys.argv[1] if len(sys.argv) > 1 else 'http://localhost:3100'
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
        self.object_labels = {}
        self.images = []
        self.videos = 0
        self.dates = []
        self.reading_blocks = []
        self.related_reads = []
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
            self.object_labels[attrs['href']] = attrs.get('aria-label', '')
        if tag == 'img' and attrs.get('src', '').startswith('/collection/'):
            self.images.append(attrs['src'])
        if tag == 'video':
            self.videos += 1
        if tag == 'time':
            self.dates.append(attrs.get('datetime'))
        classes = attrs.get('class', '').split()
        if tag == 'a' and 'next-read' in classes:
            assert attrs.get('rel') not in ['prev', 'next'], 'Related reading is not chronological pagination'
            self.related_reads.append(attrs['href'])
        assert 'adjacent-read' not in classes, 'Chronological pagination has been replaced by related reading'
        if 'piece-prose' in classes:
            self.reading_blocks.append('prose')
        if 'piece-video' in classes:
            self.reading_blocks.append('video')


expected = {'projects': [], 'notes': []}
titles = {}
publication_dates = {}
story_dates = {}
revision_dates = {}
legacy = []
for folder, group in [('projects', 'projects'), ('notes', 'notes')]:
    for source in Path('content', folder).glob('*.md'):
        slug_match = re.search(r'^slug: *([^\n]+)', source.read_text(), re.M)
        slug = slug_match.group(1).strip(' "\'') if slug_match else source.stem
        path = f'/{group}/{slug}'
        expected[group].append(path)
        title = re.search(r'^title: *([^\n]+)', source.read_text(), re.M).group(1)
        titles[path] = title.strip(' "\'')
        def date_field(name):
            match = re.search(rf'^{name}: *([^\n]+)', source.read_text(), re.M)
            return match.group(1).strip(' "\'') if match else None
        publication_dates[path] = date_field('date')
        story_dates[path] = date_field('storyDate') or publication_dates[path]
        revision_dates[path] = date_field('updated') or publication_dates[path]
        historical = re.search(r'^rssId: *([^\n]+)', source.read_text(), re.M)
        if historical:
            legacy.append((historical.group(1).strip(), path))

all_paths = expected['projects'] + expected['notes']
assert len(set(all_paths)) == len(all_paths)
home, _ = fetch('/')
collection = Page(home.decode())
assert len(collection.objects) == len(set(collection.objects)), 'Duplicate collection object'
assert set(collection.objects).issubset(set(all_paths)), 'Collection points to an unpublished piece'
for path in collection.objects:
    assert collection.object_labels[path].startswith(titles[path] + ' — '), path
assert '/projects/vellum' in collection.objects
new_projects = ['ballet-born-simple', 'phantomrack', 'recruiting']
expect_not_found('/preview')
for slug in new_projects:
    assert '/projects/' + slug in collection.objects
    expect_not_found('/preview/drafts/' + slug)
    article, _ = fetch('/projects/' + slug)
    assert Page(article.decode()).dates == [story_dates['/projects/' + slug]], slug
    for editorial_text in [b'Unpublished draft', b'Source basis', b'Production status', b'Before publication']:
        assert editorial_text not in article, (slug, editorial_text)
    result, _ = fetch('/api/search?q=' + ('ballet' if slug == 'ballet-born-simple' else slug))
    match = next(item for item in json.loads(result)['results'] if item['url'] == site + '/projects/' + slug)
    assert match['date'] == '2026-09-11', slug
    assert match.get('storyDate', match['date']) == story_dates['/projects/' + slug], slug
phantom, _ = fetch('/projects/phantomrack')
for audio in ['hiphop-dry.mp3', 'hiphop-wet.mp3']:
    path = '/posts/phantomrack/' + audio
    assert path.encode() in phantom
    body, _ = fetch(path)
    assert len(body) > 1000, path
for cover in ['ballet-pointe', 'phantom-faders', 'recruiting-selector']:
    assert '/collection/' + cover + '.webp' in collection.images
expect_not_found('/preview/vellum')
expect_not_found('/preview/vellum/media/x-all-grid.webp')
vellum, _ = fetch('/projects/vellum')
assert b'Editorial notes' not in vellum and b'Unpublished draft' not in vellum
for name in ['x-all-grid', 'x-all-agent', 'x-all-disposal-viewer']:
    media_path = f'/posts/vellum/{name}.webp'
    assert media_path.encode() in vellum
    image, _ = fetch(media_path)
    assert image[:4] == b'RIFF' and image[8:12] == b'WEBP'
assert collection.videos == 0, 'The Flow walkthrough belongs inside its article'
assert '/collection/elt-specimen.webp' in collection.images
assert '/collection/research-loupe.webp' in collection.images
assert '/collection/ads-plug.webp' in collection.images
for image in collection.images:
    image_bytes, _ = fetch(image)
    assert image_bytes[:4] == b'RIFF' and image_bytes[8:12] == b'WEBP', image
index, _ = fetch('/browse')
index_page = Page(index.decode())
assert collection.objects == [path for path in index_page.rows if path in collection.objects], 'Collection and Index share story order'
assert index_page.dates == [story_dates[path] for path in index_page.rows]
assert index_page.dates == sorted(index_page.dates, reverse=True), 'Browsing is newest-story-first'
assert story_dates['/projects/ballet-born-simple'] == '2026-01'
assert story_dates['/projects/google-ads'] == '2026-01'
assert story_dates['/projects/recruiting'] == '2026-07'
for group, paths in expected.items():
    html, _ = fetch('/browse?type=' + group)
    assert set(Page(html.decode()).rows) == set(paths), group
    for path in paths:
        html, _ = fetch(path)
        article = Page(html.decode())
        assert article.canonical == site + path, path
        assert article.dates == [story_dates[path]], path
        graphs = [json.loads(block) for block in re.findall(r'<script type="application/ld\+json">(.*?)</script>', html.decode())]
        nodes = [node for graph in graphs for node in graph.get('@graph', []) if node.get('@id') in [site + path + '#article', site + path + '#code']]
        assert len(nodes) == 1, path
        assert nodes[0]['dateModified'] == revision_dates[path], path
        if nodes[0]['@type'] == 'Article':
            assert nodes[0]['datePublished'] == publication_dates[path], path
        assert len(article.related_reads) <= 1, (path, article.related_reads)
        assert all(target in all_paths and target != path for target in article.related_reads), (path, article.related_reads)
        md, _ = fetch(path + '.md')
        negotiated, _ = fetch(path, 'text/markdown')
        assert md == negotiated, path
        assert f'canonical: "{site}{path}"' in md.decode(), path
        assert f'group: "{group}"' in md.decode(), path
        assert f'publishedAt: "{publication_dates[path]}"' in md.decode(), path
        assert f'updatedAt: "{revision_dates[path]}"' in md.decode(), path
        if story_dates[path] != publication_dates[path]:
            assert f'storyDate: "{story_dates[path]}"' in md.decode(), path
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
ads_source = Path('content/projects/google-ads.md').read_text().split('---', 2)[2].strip().encode()
assert ads_source in merged and b'npx @channel47/google-ads-mcp@latest' in merged

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
assert Page(combined.decode()).reading_blocks == ['prose', 'video', 'prose'], 'The walkthrough follows its introduction and keeps the following prose'
assert b'google-flow-reference-led-product-imagery.vtt' in combined
assert b'codex-static-ads-composited-pass.jpg' in combined
assert b'codex-static-ads-native-pass.jpg' in combined
merged, final = fetch(flow_old, 'text/markdown')
assert final == creative
creative_source = Path('content/notes/codex-static-ads-google-flow.md').read_text().split('---', 2)[2].strip().encode()
assert creative_source in merged, 'The legacy URL must serve the complete current article'

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
vellum_search, _ = fetch('/api/search?q=vellum')
assert any(r['url'] == site + '/projects/vellum' for r in json.loads(vellum_search)['results'])
rss, _ = fetch('/rss.xml')
feed = ET.fromstring(rss)
feed_items = feed.findall('./channel/item')
feed_dates = [parsedate_to_datetime(item.findtext('pubDate')) for item in feed_items]
assert feed_dates == sorted(feed_dates, reverse=True), 'RSS retains publication order'
assert parsedate_to_datetime(feed.findtext('./channel/lastBuildDate')).date().isoformat() == max(revision_dates.values())
for item in feed_items:
    path = item.findtext('link').removeprefix(site)
    assert parsedate_to_datetime(item.findtext('pubDate')).date().isoformat() == publication_dates[path], path
for slug in new_projects:
    items = [item for item in feed.findall('./channel/item') if item.findtext('link') == site + '/projects/' + slug]
    assert len(items) == 1, slug
    assert items[0].findtext('guid') == site + '/projects/' + slug
    assert '11 Sep 2026' in items[0].findtext('pubDate'), slug
assert sum(i.findtext('link') == site + '/projects/vellum' for i in feed.findall('./channel/item')) == 1
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
print(f'Passed: {len(all_paths)} canonical pages and their markdown, negotiated responses, social previews; {len(legacy) * 3} legacy redirects; browse filters, search, both sitemaps, RSS identity, publication dates, media URLs, new covers, and retired-page and preview 404s.')

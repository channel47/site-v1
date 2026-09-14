const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const os = require('node:os')
const { execFileSync } = require('node:child_process')
const root = process.cwd()
const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'ch47-content-test-'))
try {
  execFileSync('pnpm', ['exec', 'tsc', 'lib/content.ts', 'lib/discovery.ts', '--outDir', temp, '--target', 'ES2022', '--module', 'commonjs', '--esModuleInterop', '--skipLibCheck'], { cwd: root, stdio: 'pipe' })
  fs.symlinkSync(path.join(root, 'node_modules'), path.join(temp, 'node_modules'), 'dir')
  process.chdir(temp)
  function fixture(format, slug, extra = '', { date = '2026-09-07', title = `Test ${slug}` } = {}) {
    const dir = path.join(temp, 'content', format)
    fs.mkdirSync(dir, { recursive: true })
    fs.writeFileSync(path.join(dir, `${slug}.md`), `---\ntitle: ${title}\nslug: ${slug}\ndescription: Synthetic regression fixture\ndate: ${date}\n${extra}---\nA short entry.\n`)
  }
  const content = require(path.join(temp, 'content.js'))
  const discovery = require(path.join(temp, 'discovery.js'))
  assert.equal(content.getNextRead('/notes/missing'), undefined, 'An empty inventory has no recommendation')
  fixture('notes', 'current', 'tags: [agents, images]\n')
  assert.equal(content.getNextRead('/notes/current'), undefined, 'An article must never recommend itself')
  fixture('notes', 'unrelated', '', { date: '2026-09-12' })
  assert.equal(content.getNextRead('/notes/current'), undefined, 'Do not force an unrelated recommendation')
  fixture('notes', 'weak-match', 'tags: [agents]\n', { date: '2026-09-11' })
  fixture('projects', 'strong-match', 'tags: [agents, images]\nupdated: 2026-09-12\n')
  assert.equal(content.getNextRead('/notes/current').href, '/projects/strong-match', 'Relevance outranks recency and content format')
  fixture('notes', 'duplicate-tags', 'tags: [agents, agents, agents]\n', { date: '2026-09-12' })
  assert.equal(content.getNextRead('/notes/current').href, '/projects/strong-match', 'Repeated tags must not inflate relevance')
  fixture('projects', 'recent-match', 'tags: [agents, images]\n', { date: '2026-09-11', title: 'A recent match' })
  assert.equal(content.getNextRead('/notes/current').href, '/projects/recent-match', 'Story recency (falling back to publication) breaks equal relevance; revisions do not')
  fixture('projects', 'same-day-match', 'tags: [agents, images]\n', { date: '2026-09-11', title: 'Z same-day match' })
  assert.equal(content.getNextRead('/notes/current').href, '/projects/recent-match', 'Same-day ties retain the deterministic feed order')
  fixture('projects', 'linked-match', '', { date: '2026-09-05' })
  fs.appendFileSync(path.join(temp, 'content/notes/current.md'), '\n[Worked example](/projects/linked-match#result)\n\n```text\n[An example URL](/notes/unrelated)\n```\n')
  assert.equal(content.getNextRead('/notes/current').href, '/projects/linked-match', 'Authored links, including section links, outweigh loose topic overlap; code examples are not links')
  assert.equal(content.getNextRead('/projects/linked-match').href, '/notes/current', 'An incoming article link also establishes relevance')
  assert.equal(content.getNextRead('/notes/missing'), undefined, 'Unknown articles do not receive arbitrary suggestions')
  fs.unlinkSync(path.join(temp, 'content/projects/linked-match.md'))
  assert.equal(content.getNextRead('/notes/current').href, '/projects/recent-match', 'Removed destinations cannot be recommended')
  for (const href of ['/notes/current', '/notes/unrelated', '/notes/weak-match', '/notes/duplicate-tags', '/projects/strong-match', '/projects/recent-match', '/projects/same-day-match']) {
    fs.rmSync(path.join(temp, 'content', `${href.slice(1)}.md`), { force: true })
  }
  fixture('projects', 'retrospective', 'storyDate: "2026-01"\nupdated: 2026-09-12\n', { date: '2026-09-11' })
  fixture('notes', 'summer-note', '', { date: '2026-07-24' })
  fixture('notes', 'summer-work', 'storyDate: 2026-07-15\n', { date: '2026-09-12' })
  const datedItems = content.getFeedItems()
  assert.deepEqual(datedItems.map(item => item.href), ['/notes/summer-note', '/notes/summer-work', '/projects/retrospective'], 'Browsing follows the work, not when a retrospective was published')
  assert.equal(datedItems[2].date, '2026-09-11', 'Story dates never overwrite publication dates')
  assert.equal(datedItems[2].updated, '2026-09-12', 'Later revisions do not move a story forward')
  assert.equal(content.getStoryDate(datedItems[2]), '2026-01', 'Unknown days retain month precision')
  assert.equal(content.getStoryDate(datedItems[0]), '2026-07-24', 'Undated stories fall back to publication')
  assert.equal(content.shortDate('2026-01'), 'Jan 2026')
  assert.equal(content.shortDate('2026-01-31'), 'Jan 2026')
  fixture('notes', 'summer-work', 'storyDate: 2026-07-15\nupdated: 2026-09-12\n', { date: '2026-09-12' })
  assert.deepEqual(content.getFeedItems().map(item => item.href), datedItems.map(item => item.href), 'A revision leaves browsing order unchanged')
  fixture('notes', 'later-version', 'storyDate: "2026-09"\nupdated: 2026-09-12\n', { date: '2026-07-02' })
  assert.equal(content.getStoryDate(content.getNoteBySlug('later-version')), '2026-09', 'A revised story may describe a moment after original publication')
  for (const storyDate of ['2026-13', '2026-02-31', '2026-09-31', '2026-09-13', '2027-01', 'yesterday', '47']) {
    fixture('notes', 'invalid-story', `storyDate: "${storyDate}"\nupdated: 2026-09-12\n`)
    assert.throws(() => content.getNotes(), /Invalid story date/)
    fs.unlinkSync(path.join(temp, 'content/notes/invalid-story.md'))
  }
  for (const href of ['/projects/retrospective', '/notes/summer-note', '/notes/summer-work', '/notes/later-version']) {
    fs.unlinkSync(path.join(temp, 'content', `${href.slice(1)}.md`))
  }
  fixture('projects', 'personal-tool', 'status: experiment\n')
  fixture('notes', 'observation')
  fixture('skills', 'retired-skill')
  assert.deepEqual(discovery.CONTENT_GROUPS.map(g => g.key), ['projects', 'notes'])
  const items = content.getFeedItems()
  assert.equal(items.length, 2)
  assert.equal(items.filter(i => i.group === 'projects').length, 1)
  assert.equal(items.filter(i => i.group === 'notes').length, 1)
  assert(items.every(i => i.href.startsWith(`/${i.group}/`)))
  const project = content.getProjectBySlug('personal-tool')
  assert.equal(project.status, 'experiment')
  assert.deepEqual(project.tags, [])
  assert.equal(project.install, undefined)
  fixture('projects', 'installable', 'repo: https://example.com/source\ninstall: example install\nrssId: /connectors/installable\n')
  const installed = content.getProjectBySlug('installable')
  assert.equal(installed.install, 'example install')
  assert.equal(installed.rssId, '/connectors/installable')
  assert(project.html.includes('A short entry.'))
  const quickNote = path.join(temp, 'content/notes/quick-note.md')
  fs.writeFileSync(quickNote, '---\ntitle: Quick note\ndescription: A real observation\ndate: 2026-09-07\n---\nOne paragraph.\n')
  const note = content.getNoteBySlug('quick-note')
  assert.equal(note.slug, 'quick-note')
  assert.equal(note.updated, undefined)
  fixture('notes', 'revised-note', 'updated: 2026-09-10\nnewsletter: More worked examples.\n')
  const revised = content.getNoteBySlug('revised-note')
  assert.equal(revised.date, '2026-09-07', 'A revision must not replace the publication date')
  assert.equal(revised.updated, '2026-09-10')
  assert.equal(revised.newsletter, 'More worked examples.')
  assert.equal(content.getFeedItems().find(item => item.href === '/notes/revised-note').updated, '2026-09-10')
  for (const updated of ['2026-09-06', '2026-13-10', '2026-02-31', 'yesterday']) {
    fixture('notes', 'invalid-revision', `updated: "${updated}"\n`)
    assert.throws(() => content.getNotes(), /Invalid revision date/)
    fs.unlinkSync(path.join(temp, 'content/notes/invalid-revision.md'))
  }
  assert.deepEqual(note.tags, [])
  assert.equal(content.getEntryPreview(note), undefined)
  const media = path.join(temp, 'public/posts')
  fs.mkdirSync(media, { recursive: true })
  fs.writeFileSync(path.join(media, 'diagram.svg'), '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 900"></svg>')
  fs.copyFileSync(path.join(root, 'public/posts/customer-research-ad-overnight.webp'), path.join(media, 'ad.webp'))
  fs.copyFileSync(path.join(root, 'public/posts/google-flow-tablet-grid-blue.jpg'), path.join(media, 'tablets.jpg'))
  fs.writeFileSync(path.join(temp, 'outside.svg'), '<svg xmlns="http://www.w3.org/2000/svg" width="47" height="47"></svg>')
  fs.appendFileSync(quickNote, '\n![Diagram](/posts/diagram.svg)\n\n![Ad](/posts/ad.webp)\n\n![Tablets](/posts/tablets.jpg)\n\n![Remote](https://example.com/image.jpg)\n\n![Missing](/posts/missing.jpg)\n\n![Outside](/%2e%2e/outside.svg)\n')
  const illustrated = content.getNoteBySlug('quick-note').html
  assert.match(illustrated, /alt="Diagram" width="1600" height="900"/, 'SVG layout is reserved before loading')
  assert.match(illustrated, /alt="Ad" width="1122" height="1402"/, 'Portrait WebP layout is reserved before loading')
  assert.match(illustrated, /alt="Ad"[^>]+data-orientation="portrait"/, 'Portrait media can fit a desktop viewport without cropping')
  assert.doesNotMatch(illustrated, /alt="Diagram"[^>]+data-orientation/, 'Landscape diagrams retain their wide presentation')
  assert.match(illustrated, /alt="Tablets" width="1200" height="1200"/, 'JPEG layout is reserved before loading')
  for (const alt of ['Remote', 'Missing', 'Outside']) {
    assert.match(illustrated, new RegExp(`alt="${alt}" loading="lazy"`), 'External, missing or out-of-public paths do not read arbitrary files')
  }
  fs.writeFileSync(path.join(media, 'diagram.svg'), '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1800 1200"></svg>')
  const changed = new Date(Date.now() + 2000)
  fs.utimesSync(path.join(media, 'diagram.svg'), changed, changed)
  assert.match(content.getNoteBySlug('quick-note').html, /alt="Diagram" width="1800" height="1200"/, 'Replacing artwork refreshes its cached dimensions')
  fs.appendFileSync(quickNote, '\n```text\nKeep <source> & evidence.\n\nDo not invent claims.\n```\n\n```sh\nnpx example --help\n```\n')
  const withCode = content.getNoteBySlug('quick-note').html
  assert.match(withCode, /<div class="st-code"><pre><code class="language-text">Keep &lt;source&gt; &amp; evidence\./, 'Copyable prompts retain safe escaped Markdown rendering')
  assert.equal((withCode.match(/<span class="code-copy"><\/span>/g) || []).length, 2, 'Each code block has one enhancement slot without inert buttons in feeds')
  const video = { src: '/walkthrough.mp4', poster: '/poster.jpg', captions: '/captions.vtt', duration: 'PT1M' }
  function videoParts(markdown, metadata = video) {
    return content.splitArticleAtVideo({ markdown, html: content.renderArticleMarkdown(markdown), video: metadata })
  }
  const introduction = 'Opening paragraph.\n\nSecond paragraph.\n\n## The experiment\n\nSome context.\n\n'
  const continuation = '\n\nWhat happened next.\n\n```text\nKeep this prompt.\n```\n'
  const placement = '[Watch the walkthrough.](/walkthrough.mp4)'
  const placed = videoParts(introduction + placement + continuation)
  assert.equal(placed.beforeVideo, content.renderArticleMarkdown(introduction), 'All opening paragraphs and context remain before the chosen video placement')
  assert.equal(placed.afterVideo, content.renderArticleMarkdown(continuation), 'Following prose and copyable prompts remain after the player')
  for (const markdown of [
    introduction,
    '[Watch the walkthrough.](/walkthrough.mp4) Then keep reading.',
    '> [Watch the walkthrough.](/walkthrough.mp4)',
    '```text\n[Watch the walkthrough.](/walkthrough.mp4)\n```',
    '[A different video.](/another.mp4)',
  ]) {
    assert.deepEqual(videoParts(markdown), { beforeVideo: content.renderArticleMarkdown(markdown), afterVideo: '' }, 'Without a standalone matching link, preserve the complete story before the video')
  }
  const linkedHtml = content.renderArticleMarkdown(introduction + placement)
  assert.deepEqual(content.splitArticleAtVideo({ markdown: introduction + placement, html: linkedHtml }), { beforeVideo: linkedHtml, afterVideo: '' }, 'Ordinary articles keep their video links')
  assert.deepEqual(content.getEntryPreview({ ...note, markdown: '![Draft](placeholder:later)\n\n![A result](/result.jpg)' }), { src: '/result.jpg', alt: 'A result' })
  assert.deepEqual(content.getEntryPreview({ ...note, video: { poster: '/poster.jpg', caption: 'A walkthrough' } }), { src: '/poster.jpg', alt: 'A walkthrough' })
  assert.deepEqual(content.getEntryPreview({ ...note, preview: { src: '/selected.jpg', alt: 'Selected result' }, markdown: '![Other](/other.jpg)' }), { src: '/selected.jpg', alt: 'Selected result' })
  const gallery = { id: 'study', title: 'Study', description: 'Actual outputs.', images: [{ src: '/posts/tablets.jpg', label: 'One', alt: 'Tablets', caption: 'The original result.', width: 1200, height: 1200 }] }
  function galleryParts(markdown) {
    return content.splitArticleAtGallery({ markdown, html: content.renderArticleMarkdown(markdown), gallery })
  }
  for (const link of ['[Explore](#study)', '[Explore](https://channel47.dev/notes/example#study)']) {
    const parts = galleryParts(introduction + link + continuation)
    assert.equal(parts.placed, true)
    assert.equal(parts.beforeGallery, content.renderArticleMarkdown(introduction), 'Gallery placement preserves the preceding story')
    assert.equal(parts.afterGallery, content.renderArticleMarkdown(continuation), 'Gallery placement preserves the following copyable prompt')
  }
  for (const markdown of ['Read [Explore](#study) here.', '> [Explore](#study)', '```text\n[Explore](#study)\n```', '[Other](#another)', '[External](https://example.com/#study)']) {
    const parts = galleryParts(markdown)
    assert.equal(parts.placed, false, 'Only a standalone authored study link becomes interactive')
    assert.equal(parts.beforeGallery, content.renderArticleMarkdown(markdown))
  }
  fixture('notes', 'gallery-invalid', 'gallery:\n  id: study\n  title: Study\n  description: Actual outputs\n  images: []\n')
  assert.throws(() => content.getNotes(), /Invalid gallery/, 'An empty study cannot render broken gallery controls')
  fs.unlinkSync(path.join(temp, 'content/notes/gallery-invalid.md'))
  fixture('projects', 'bad-status', 'status: shipped-ish\n')
  assert.throws(() => content.getProjects(), /Invalid project status/)
  fs.unlinkSync(path.join(temp, 'content/projects/bad-status.md'))
  fs.writeFileSync(path.join(temp, 'content/projects/alias.md'), '---\ntitle: Alias\nslug: personal-tool\ndescription: Duplicate URL fixture\ndate: 2026-09-09\n---\nDuplicate.\n')
  assert.throws(() => content.getContentEntries(), /Duplicate content URL/)
  console.log('Content model passed: story/publication dates, month precision, chronology, sections, canonical paths, image dimensions and local-path boundaries, minimal publishing, preview fallbacks, relevant reading recommendations, status validation, collision detection.')
} finally {
  process.chdir(root)
  fs.rmSync(temp, { recursive: true, force: true })
}

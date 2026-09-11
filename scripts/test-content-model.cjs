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
  function fixture(format, slug, extra = '') {
    const dir = path.join(temp, 'content', format)
    fs.mkdirSync(dir, { recursive: true })
    fs.writeFileSync(path.join(dir, `${slug}.md`), `---\ntitle: Test ${slug}\nslug: ${slug}\ndescription: Synthetic regression fixture\ndate: 2026-09-07\n${extra}---\nA short entry.\n`)
  }
  fixture('projects', 'personal-tool', 'status: experiment\n')
  fixture('notes', 'observation')
  fixture('skills', 'retired-skill')
  const content = require(path.join(temp, 'content.js'))
  const discovery = require(path.join(temp, 'discovery.js'))
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
  assert.equal(content.getNextRead('/notes/quick-note'), undefined, 'Unrelated pieces should not be recommended')
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
  fixture('notes', 'related-note', 'tags: [test-topic]\n')
  fixture('projects', 'related-project', 'tags: [test-topic]\n')
  assert.equal(content.getNextRead('/projects/related-project').href, '/notes/related-note')
  assert.equal(content.getNextRead('/notes/related-note').href, '/projects/related-project')
  fixture('projects', 'bad-status', 'status: shipped-ish\n')
  assert.throws(() => content.getProjects(), /Invalid project status/)
  fs.unlinkSync(path.join(temp, 'content/projects/bad-status.md'))
  fs.writeFileSync(path.join(temp, 'content/projects/alias.md'), '---\ntitle: Alias\nslug: personal-tool\ndescription: Duplicate URL fixture\ndate: 2026-09-09\n---\nDuplicate.\n')
  assert.throws(() => content.getContentEntries(), /Duplicate content URL/)
  console.log('Content model passed: sections, canonical paths, image dimensions and local-path boundaries, minimal publishing, preview fallbacks, related reading, status validation, collision detection.')
} finally {
  process.chdir(root)
  fs.rmSync(temp, { recursive: true, force: true })
}

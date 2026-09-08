const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const os = require('node:os')
const vm = require('node:vm')
const ts = require('typescript')
const { execFileSync } = require('node:child_process')
const root = process.cwd()
const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'ch47-measurement-test-'))
try {
  execFileSync('pnpm', ['exec', 'tsc', 'lib/sharing.ts', '--outDir', temp, '--target', 'ES2022', '--module', 'commonjs', '--esModuleInterop', '--skipLibCheck'], { stdio: 'pipe' })
  fs.symlinkSync(path.join(root, 'node_modules'), path.join(temp, 'node_modules'), 'dir')
  const policy = require(path.join(temp, 'measurement.js'))
  const paths = ['/', '/newsletter', '/browse', '/notes/example', '/projects/tool']
  for (const channel of Object.keys(policy.SHARE_CHANNELS)) {
    const link = new URL(policy.taggedShareUrl('/notes/example', channel))
    const arrival = policy.arrivalAttribution(link, '', paths)
    assert.equal(arrival.source, channel)
    assert.equal(arrival.campaign, 'example')
  }
  assert.throws(() => policy.taggedShareUrl('https://outside.example', 'x'))
  assert.equal(policy.arrivalAttribution(new URL('https://channel47.dev/private/email@example.com'), '', paths), undefined)
  const clean = policy.arrivalAttribution(new URL('https://channel47.dev/notes/example?email=private@example.com&utm_source=unknown&utm_campaign=private@example.com'), 'https://private.example/secret?email=private@example.com', paths)
  assert.deepEqual(clean, { landing_path: '/notes/example', source: 'other', medium: 'referral', campaign: '' })
  assert(!JSON.stringify(clean).includes('private'))
  assert.deepEqual(policy.sanitizeAnalyticsEvent({ type: 'event', url: 'https://channel47.dev/notes/example?email=private@example.com#secret' }, paths), { type: 'event', url: 'https://channel47.dev/notes/example' })
  assert.equal(policy.sanitizeAnalyticsEvent({ url: 'https://channel47.dev/private' }, paths), null)
  assert.equal(policy.restoreAttribution({ ...clean, landing_path: '/private' }, paths), undefined)
  assert.deepEqual(policy.restoreAttribution({ ...clean, email: 'private@example.com' }, paths), clean)

  // Exercise the actual client module with mocked hooks, storage and analytics.
  // No browser, provider API, or real subscriber is used by this test.
  function client(storageDenied = false) {
    let pathname = '/notes/example'
    const events = []
    let sdkReady = false
    const effects = []
    const ref = { current: null }
    const storage = new Map()
    const window = { location: { href: policy.taggedShareUrl(pathname, 'newsletter'), pathname } }
    const exports = {}
    const context = {
      exports, URL, window, document: { referrer: '' },
      sessionStorage: {
        getItem: key => { if (storageDenied) throw Error('denied'); return storage.get(key) ?? null },
        setItem: (key, value) => { if (storageDenied) throw Error('denied'); storage.set(key, value) },
      },
      require: name => {
        if (name === 'react') return { useEffect: fn => effects.push(fn), useRef: () => ref }
        if (name === 'next/navigation') return { usePathname: () => pathname }
        if (name === 'react/jsx-runtime') return { jsx: () => null }
        if (name === '@vercel/analytics/next') return { Analytics: () => null }
        if (name === '@vercel/analytics') return { inject: () => { sdkReady = true }, track: (name, data) => { assert(sdkReady, 'SDK must initialize before events'); events.push({ name, data }) } }
        if (name === '@/lib/measurement') return policy
        throw Error(`Unexpected module ${name}`)
      },
    }
    const source = fs.readFileSync(path.join(root, 'components/site/measurement.tsx'), 'utf8')
    const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX } }).outputText
    vm.runInNewContext(compiled, context)
    const render = (next = pathname) => {
      if (next !== pathname) { pathname = next; window.location = { pathname, href: 'https://channel47.dev' + pathname } }
      exports.SiteMeasurement({ paths })
      effects.splice(0).forEach(fn => fn())
    }
    return { exports, render, events }
  }
  for (const denied of [false, true]) {
    const app = client(denied)
    app.render(); app.render()
    assert.equal(app.events.filter(e => e.name === 'content_open').length, 1, 'Strict Mode must not double-count the opening')
    app.render('/newsletter')
    app.exports.measure('newsletter_result', { placement: 'newsletter', status: 'accepted', email: 'private@example.com', target_path: '/private' })
    const event = app.events.at(-1)
    assert.equal(event.data.page, '/newsletter')
    assert.equal(event.data.landing_path, '/notes/example')
    assert.equal(event.data.last_content_path, '/notes/example')
    assert.equal(event.data.source, 'newsletter')
    assert.equal(event.data.status, 'accepted')
    assert.equal(event.data.email, undefined)
    assert.equal(event.data.target_path, undefined)
    app.render('/private')
    const count = app.events.length
    app.exports.measure('install_copy')
    assert.equal(app.events.length, count)
  }

  const sharing = require(path.join(temp, 'sharing.js'))
  const pack = sharing.buildSharePack('/notes/codex-static-ads-google-flow')
  assert(pack.email.includes('I had been using'))
  assert(pack.email.includes('href="https://channel47.dev/notes/google-flow-reference-led-product-imagery"'))
  assert(pack.email.includes('utm_source=newsletter'))
  assert(pack.email.startsWith('---\nsubject: I was using Codex'))
  fs.writeFileSync(path.join(temp, 'newsletter.html'), pack.email)
  execFileSync('python3', ['scripts/kit-broadcast.py', 'render', path.join(temp, 'newsletter.html'), '--output', path.join(temp, 'preview.html')], { cwd: root, stdio: 'pipe' })
  assert(!pack.email.includes('send_at:'))
  assert(pack.image.url.endsWith('/posts/codex-static-ads-native-pass.jpg'))
  assert.throws(() => sharing.buildSharePack('/notes/not-published'), /No published entry/)
  const project = sharing.buildSharePack('/projects/google-ads')
  assert.equal(project.image, undefined)
  assert(project.email.includes('Explore the project'))
  console.log('Passed: attribution vocabulary, query/referrer redaction, navigation, duplicate-effect protection, denied storage, event field filtering, source-based sharing, absolute email links and missing-entry rejection.')
} finally {
  fs.rmSync(temp, { recursive: true, force: true })
}

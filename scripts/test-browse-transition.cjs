const assert = require('node:assert/strict')
const fs = require('node:fs')
const vm = require('node:vm')
const ts = require('typescript')

const compiled = ts.transpileModule(fs.readFileSync('lib/browse-transition.ts', 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
}).outputText
const deferred = () => {
  let resolve, reject
  const promise = new Promise((yes, no) => { resolve = yes; reject = no })
  return { promise, resolve, reject }
}
async function flush() { for (let i = 0; i < 8; i++) await Promise.resolve() }

function app({ reduced = false, supported = true, throws = false, theme = false, fonts = Promise.resolve() } = {}) {
  const handlers = new Map(), timers = new Map(), transitions = [], routes = [], focused = []
  const media = { matches: reduced }
  const events = {
    addEventListener(name, fn) { handlers.set(name, fn) },
    removeEventListener(name, fn) { if (handlers.get(name) === fn) handlers.delete(name) },
  }
  Object.assign(media, events)
  const root = { dataset: theme ? { themeTransition: 'true' } : {} }
  let cancelledArrival = false
  const images = []
  const document = {
    documentElement: root,
    fonts: { ready: fonts },
    querySelector(selector) {
      if (selector === 'main') return { getAnimations: () => [{ id: '47-arrive', cancel() { cancelledArrival = true } }] }
      return { focus(options) { focused.push({ selector, options }) } }
    },
    querySelectorAll() { return images },
  }
  if (supported) document.startViewTransition = update => {
    if (throws) throw Error('Snapshot unavailable')
    const ready = deferred(), finished = deferred()
    const transition = {
      ready: ready.promise, finished: finished.promise, skipped: false,
      async capture() { await update(); ready.resolve() },
      finish() { finished.resolve() },
      fail() { ready.reject(Error('Snapshot failed')); finished.resolve() },
      skipTransition() { this.skipped = true; ready.reject(Error('Skipped')); finished.resolve() },
    }
    transitions.push(transition)
    return transition
  }
  const window = { ...events, location: { pathname: '/' } }
  const exports = {}
  vm.runInNewContext(compiled, {
    exports, document, window, innerHeight: 800, matchMedia: () => media,
    setTimeout(fn) { const id = {}; timers.set(id, fn); return id },
    clearTimeout(id) { timers.delete(id) },
  })
  return {
    ...exports, root, media, timers, transitions, routes, focused, images, window, handlers,
    cancelledArrival: () => cancelledArrival,
    start(href = '/browse', keyboard = false) {
      exports.switchBrowseView(href, () => routes.push(href), keyboard)
    },
    commit(href = '/browse') {
      window.location.pathname = href
      return exports.completeBrowseTransition(href)
    },
    emit(name) { handlers.get(name)?.() },
    expire() { [...timers.values()].forEach(fn => fn()) },
  }
}

async function verify() {
  const a = app(), image = deferred()
  a.images.push({ getBoundingClientRect: () => ({ top: 100, bottom: 200 }), decode: () => image.promise })
  a.start('/browse', true)
  assert.equal(a.isBrowseTransitionTo('/browse'), true)
  assert.equal(a.cancelledArrival(), true)
  assert.deepEqual(a.routes, [], 'Capture the old view before starting navigation')
  const capture = a.transitions[0].capture()
  assert.deepEqual(a.routes, ['/browse'], 'Navigation does not wait for an exit animation')
  assert.equal(a.commit(), true, 'Visible arrivals are owned by the snapshot')
  let captured = false; capture.then(() => { captured = true })
  await flush(); assert.equal(captured, false, 'The incoming artwork is decoded before capture')
  image.resolve(); await capture
  assert.equal(a.focused.length, 1, 'Keyboard switching restores focus to the selected link')
  a.transitions[0].finish(); await flush()
  assert.equal(a.root.dataset.browseTransition, undefined)
  assert.equal(a.timers.size, 0)
  assert.equal(a.handlers.size, 0)

  const pointer = app()
  pointer.start(); const pointerCapture = pointer.transitions[0].capture()
  pointer.commit(); await pointerCapture
  assert.equal(pointer.focused.length, 0, 'Pointer switching must not add keyboard focus')
  pointer.transitions[0].finish(); await flush()

  for (const options of [{ reduced: true }, { supported: false }, { theme: true }]) {
    const fallback = app(options)
    fallback.start()
    assert.deepEqual(fallback.routes, ['/browse'])
    assert.equal(fallback.transitions.length, 0)
    assert.equal(fallback.commit(), false)
    assert.equal(fallback.handlers.size, 0)
  }
  const broken = app({ throws: true }); broken.start()
  assert.deepEqual(broken.routes, ['/browse'], 'A synchronous snapshot failure still navigates once')
  assert.equal(broken.root.dataset.browseTransition, undefined)

  const same = app(); same.start('/')
  assert.equal(same.transitions.length, 0)
  assert.equal(same.timers.size, 0, 'Selected-view clicks and same-path filters cannot wait on a missing route commit')

  const rapid = app(); rapid.start()
  const obsolete = rapid.transitions[0]
  rapid.start('/')
  await obsolete.capture(); await flush()
  assert.equal(obsolete.skipped, true)
  assert.deepEqual(rapid.routes, ['/'], 'A superseded snapshot callback cannot navigate to its stale target')

  for (const interruption of ['change', 'timeout']) {
    const beforeCapture = app(); beforeCapture.start()
    if (interruption === 'change') { beforeCapture.media.matches = true; beforeCapture.emit('change') }
    else beforeCapture.expire()
    await beforeCapture.transitions[0].capture(); await flush()
    assert.deepEqual(beforeCapture.routes, ['/browse'], 'Skipping motion before capture still completes the requested navigation exactly once')
  }

  for (const interruption of ['popstate', 'pagehide', 'change', 'timeout', 'other-route']) {
    const pending = app({ fonts: new Promise(() => {}) })
    pending.start(); const capturePending = pending.transitions[0].capture()
    if (interruption === 'change') pending.media.matches = true
    if (interruption === 'timeout') pending.expire()
    else if (interruption === 'other-route') pending.commit('/about')
    else pending.emit(interruption)
    await capturePending; await flush()
    assert.equal(pending.root.dataset.browseTransition, undefined, `Clean up after ${interruption}`)
    assert.equal(pending.transitions[0].skipped, true)
    assert.equal(pending.handlers.size, 0)
  }

  const failedImage = app()
  failedImage.images.push({ getBoundingClientRect: () => ({ top: 0, bottom: 100 }), decode: () => Promise.reject(Error('Missing cover')) })
  failedImage.start(); const failedCapture = failedImage.transitions[0].capture()
  failedImage.commit(); await failedCapture
  failedImage.transitions[0].fail(); await flush()
  assert.equal(failedImage.root.dataset.browseTransition, undefined, 'Failed images and snapshots leave usable content')

  const staleFinish = app(); staleFinish.start()
  const oldCapture = staleFinish.transitions[0].capture()
  staleFinish.commit(); await oldCapture
  staleFinish.start('/')
  await flush()
  assert.equal(staleFinish.isBrowseTransitionTo('/'), true, 'An old completion cannot clear the newer switch')
  staleFinish.cancelBrowseTransition()

  console.log('Browse transitions passed: route commits, asset readiness, keyboard focus, selected-view clicks, rapid reversal, history, reduced motion, snapshot failure, timeout and cleanup.')
}
verify().catch(error => { console.error(error); process.exitCode = 1 })

const assert = require('node:assert/strict')
const fs = require('node:fs')
const vm = require('node:vm')
const ts = require('typescript')
const motion = {}
vm.runInNewContext(ts.transpileModule(fs.readFileSync('lib/motion.ts', 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText, { exports: motion })
const tokens = fs.readFileSync('app/tokens.css', 'utf8')
const token = key => tokens.match(new RegExp(`${key}:\\s*([^;]+)`))[1]

// Exercise the actual lifecycle against browser doubles. No browser settings,
// network calls, timers or subscriber records are changed by these tests.
function app({ reduced = false, historyDocument = false, gate = 'pending', fonts = Promise.resolve(), hash = '' } = {}) {
  class Events {
    handlers = new Map()
    addEventListener(name, fn) { this.handlers.set(name, fn) }
    removeEventListener(name) { this.handlers.delete(name) }
    emit(name, event = {}) { this.handlers.get(name)?.(event) }
  }
  class Node {}
  class Element extends Node {
    constructor(top, object = false) { super(); this.top = top; this.object = object; this.plays = [] }
    getBoundingClientRect() { return { top: this.top, bottom: this.top + 100, height: 100 } }
    matches() { return this.object }
    images = []
    querySelectorAll() { return this.images }
    contains(node) { return this === node }
    animate(frames, options) {
      const animation = {
        state: 'running', options, frames,
        pause() { this.state = 'paused' },
        play() { this.state = 'running' },
        cancel() { this.state = 'cancelled' },
      }
      this.plays.push(animation)
      return animation
    }
  }
  const window = new Events()
  const media = Object.assign(new Events(), { matches: reduced })
  const main = new Events()
  let nodes = []
  main.querySelectorAll = () => nodes
  const observers = []
  class IntersectionObserver {
    constructor(callback) { this.callback = callback; this.targets = new Set(); observers.push(this) }
    observe(node) { this.targets.add(node) }
    unobserve(node) { this.targets.delete(node) }
    disconnect() { this.targets.clear() }
    enter(node) { this.callback([{ target: node, isIntersecting: true }]) }
  }
  let pathname = '/'
  let cursor = 0
  const refs = []
  const hooks = []
  const pending = []
  const location = { pathname, hash }
  const exports = {}
  const root = { dataset: { arrival: gate } }
  const timers = new Map()
  const source = fs.readFileSync('components/site/page-motion.tsx', 'utf8')
  const compiled = ts.transpileModule(source, { compilerOptions: {
    module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022,
  } }).outputText
  vm.runInNewContext(compiled, {
    exports, Element, Node, IntersectionObserver, window, location, innerHeight: 800,
    setTimeout(fn) { const id = {}; timers.set(id, fn); return id },
    clearTimeout(id) { timers.delete(id) },
    performance: { getEntriesByType: () => [{ type: historyDocument ? 'back_forward' : 'navigate' }] },
    matchMedia: () => media,
    document: { querySelector: () => main, documentElement: root, fonts: { ready: fonts } },
    // Match the optimized CSS returned by the real browser, including seconds.
    getComputedStyle: () => ({ getPropertyValue: key => token(key).replace(/([\d.]+)ms$/, (_, ms) => `${Number(ms) / 1000}s`) }),
    require: name => {
      if (name === '@/lib/motion') return motion
      if (name === 'next/navigation') return { usePathname: () => pathname }
      if (name === 'react') return {
        useRef(value) { const i = cursor++; return refs[i] ??= { current: value } },
        useLayoutEffect(fn, deps) {
          const i = cursor++
          const old = hooks[i]
          if (!old || deps.some((dep, j) => dep !== old.deps[j])) {
            pending.push(() => { old?.cleanup?.(); hooks[i] = { deps, fn, cleanup: fn() } })
          }
        },
      }
      throw Error(`Unexpected import: ${name}`)
    },
  })
  return {
    window, media, main, observers, root, timers,
    expire() { [...timers.values()].forEach(fn => fn()) },
    node: (top, object) => new Element(top, object),
    render(next, nextNodes, history = false) {
      location.pathname = next
      if (history) window.emit('popstate')
      pathname = next; nodes = nextNodes; cursor = 0
      exports.PageMotion()
      pending.splice(0).forEach(fn => fn())
    },
    unmount() { hooks.forEach(hook => hook?.cleanup?.()) },
    replayEffects() { hooks.forEach(hook => hook?.cleanup?.()); hooks.forEach(hook => { if (hook) hook.cleanup = hook.fn() }) },
  }
}

async function flush() { for (let i = 0; i < 6; i++) await Promise.resolve() }
function deferred() {
  let resolve, reject
  const promise = new Promise((yes, no) => { resolve = yes; reject = no })
  return { promise, resolve, reject }
}

function boot({ reduced = false, history = false, hash = '' } = {}) {
  const root = { dataset: {} }
  let expire
  vm.runInNewContext(motion.ARRIVAL_BOOT, {
    document: { documentElement: root },
    matchMedia: () => ({ matches: reduced }),
    performance: { getEntriesByType: () => [{ type: history ? 'back_forward' : 'navigate' }] },
    location: { hash }, setTimeout(fn) { expire = fn },
  })
  return { root, expire }
}

async function verify() {
for (const [value, expected] of [['1400ms', 1400], ['1.4s', 1400], [' .14s ', 140], ['0s', 0], ['', 640], ['invalid', 640]]) {
  assert.equal(motion.motionMilliseconds(value, 640), expected, `Read CSS time correctly: ${value}`)
}
const guard = boot()
assert.equal(guard.root.dataset.arrival, 'pending', 'Cold documents establish the guard before body paint')
guard.expire()
assert.equal(guard.root.dataset.arrival, 'expired', 'Missing hydration fails open')
const hydrated = boot()
hydrated.root.dataset.arrival = 'ready'; hydrated.expire()
assert.equal(hydrated.root.dataset.arrival, 'ready', 'Hydration cannot be expired by an obsolete timer')
for (const settings of [{ reduced: true }, { history: true }, { hash: '#example' }]) {
  assert.equal(boot(settings).root.dataset.arrival, undefined, 'Reduced motion, history and fragment links are visible from first paint')
}
const a = app()
const heading = a.node(100), proseBelow = a.node(1000), artworkBelow = a.node(1100, true)
a.render('/', [heading, proseBelow, artworkBelow])
assert.equal(heading.plays[0].state, 'paused', 'The initial frame is held until fonts and images are ready')
assert.equal(heading.plays[0].options.duration, 1400, 'Optimized CSS seconds must not turn an arrival into a 1.4ms jump')
assert.equal(heading.plays[0].options.easing, token('--ease-arrival'))
assert.equal(a.root.dataset.arrival, 'ready', 'Paused animation takes over the first frame from the CSS guard')
await flush()
assert.equal(heading.plays[0].state, 'running')
assert.equal(proseBelow.plays.length, 0, 'Reading content below the fold must remain static')
assert.equal(artworkBelow.plays[0].state, 'paused', 'An off-screen object waits until it enters')
a.observers[0].enter(artworkBelow)
await flush()
assert.equal(artworkBelow.plays[0].state, 'running')
assert.equal(a.observers[0].targets.size, 0, 'An object reveals only once')
a.main.emit('focusin', { target: heading })
assert.equal(heading.plays[0].state, 'cancelled', 'Keyboard input immediately settles its target')
a.media.matches = true; a.media.emit('change')
assert.equal(artworkBelow.plays[0].state, 'cancelled', 'Changing reduced motion cancels active movement')

const b = app()
b.render('/browse', [b.node(100)])
const filtered = b.node(100)
b.render('/browse', [filtered])
assert.equal(filtered.plays.length, 0, 'Filtering must not replay the page entrance')
b.render('/browse', [filtered], true)
b.render('/notes/example', [b.node(100)])
const returned = b.node(100)
b.render('/browse', [returned], true)
assert.equal(returned.plays.length, 0, 'History restoration must not replay arrivals')
const fresh = b.node(100)
b.render('/about', [fresh])
assert.equal(fresh.plays.length, 1, 'Ordinary navigation still reveals a new page')
b.window.emit('pagehide')
assert.equal(fresh.plays[0].state, 'cancelled', 'A cached page must not retain an unfinished reveal')
b.unmount()
assert.equal(b.window.handlers.size, 0)
assert.equal(b.media.handlers.size, 0)

const d = app(), pressed = d.node(100), waiting = d.node(1200, true)
d.render('/', [pressed, waiting])
d.main.emit('pointerdown', { target: pressed })
assert.equal(pressed.plays[0].state, 'cancelled', 'Pointer input immediately settles its target')
d.render('/about', [d.node(100)])
assert.equal(waiting.plays[0].state, 'cancelled', 'Rapid navigation cannot leave a hidden object in a cached page')

for (const settings of [{ reduced: true }, { historyDocument: true }, { gate: 'expired' }, { gate: '' }, { hash: '#example' }]) {
  const c = app(settings), node = c.node(100)
  c.render('/', [node])
  assert.equal(node.plays.length, 0, 'Reduced motion, history and expired first-paint guards must not hide visible content')
}

const font = deferred(), image = deferred(), ready = app({ fonts: font.promise })
const title = ready.node(100), art = ready.node(200, true)
art.images.push({ decode: () => image.promise })
ready.render('/', [title, art])
assert.equal(art.plays[0].options.delay, 140)
await flush()
assert.equal(title.plays[0].state, 'paused', 'A font still loading holds the entrance')
font.resolve(); await flush()
assert.equal(title.plays[0].state, 'paused', 'All visible artwork must decode before the shared entrance starts')
image.resolve(); await flush()
assert.equal(title.plays[0].state, 'running')
assert.equal(art.plays[0].state, 'running')
assert.equal(ready.timers.size, 0, 'Readiness clears its safety timer')

const slow = deferred(), timeout = app({ fonts: slow.promise }), slowNode = timeout.node(100)
timeout.render('/', [slowNode]); timeout.expire()
assert.equal(slowNode.plays[0].state, 'cancelled', 'A stalled asset fails open, never leaving content hidden')
slow.resolve(); await flush()
assert.equal(slowNode.plays[0].state, 'cancelled', 'Late readiness must not replay a timed-out arrival')

const failed = app(), broken = failed.node(100, true)
broken.images.push({ decode: () => Promise.reject(Error('Missing image')) })
failed.render('/', [broken]); await flush()
assert.equal(broken.plays[0].state, 'running', 'An image error still reveals its caption and fallback')

const pendingImage = deferred(), leaving = app(), abandoned = leaving.node(100, true)
abandoned.images.push({ decode: () => pendingImage.promise })
leaving.render('/', [abandoned]); leaving.unmount()
pendingImage.resolve(); await flush()
assert.equal(abandoned.plays[0].state, 'cancelled', 'Resolving an image after unmount cannot replay motion')
assert.equal(leaving.timers.size, 0)

const strict = app(), replayed = strict.node(100)
strict.render('/', [replayed]); strict.replayEffects(); await flush()
assert.equal(replayed.plays[0].state, 'cancelled')
assert.equal(replayed.plays[1].state, 'running', 'Strict Mode cleanup/replay must retain a single working entrance')
strict.unmount()

console.log('Motion passed: CSS time units, first-paint guards, font/image readiness, failed and stalled assets, Strict Mode, navigation, history, filters, input, reduced motion and cleanup.')
}
verify().catch(error => { console.error(error); process.exitCode = 1 })

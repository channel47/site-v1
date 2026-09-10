const assert = require('node:assert/strict')
const fs = require('node:fs')
const vm = require('node:vm')
const ts = require('typescript')

// Exercise the actual lifecycle against browser doubles. No browser settings,
// network calls, timers or subscriber records are changed by these tests.
function app({ reduced = false, historyDocument = false } = {}) {
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
    contains(node) { return this === node }
    animate(frames, options) {
      const animation = {
        state: 'running', options,
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
  const location = { pathname }
  const exports = {}
  const source = fs.readFileSync('components/site/page-motion.tsx', 'utf8')
  const compiled = ts.transpileModule(source, { compilerOptions: {
    module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022,
  } }).outputText
  vm.runInNewContext(compiled, {
    exports, Element, Node, IntersectionObserver, window, location, innerHeight: 800,
    performance: { getEntriesByType: () => [{ type: historyDocument ? 'back_forward' : 'navigate' }] },
    matchMedia: () => media,
    document: { querySelector: () => main, documentElement: {} },
    getComputedStyle: () => ({ getPropertyValue: key => ({
      '--motion-reveal': '920ms', '--motion-stagger': '80ms', '--ease-settle': 'ease-out',
    })[key] }),
    require: name => {
      if (name === 'next/navigation') return { usePathname: () => pathname }
      if (name === 'react') return {
        useRef(value) { const i = cursor++; return refs[i] ??= { current: value } },
        useLayoutEffect(fn, deps) {
          const i = cursor++
          const old = hooks[i]
          if (!old || deps.some((dep, j) => dep !== old.deps[j])) {
            pending.push(() => { old?.cleanup?.(); hooks[i] = { deps, cleanup: fn() } })
          }
        },
      }
      throw Error(`Unexpected import: ${name}`)
    },
  })
  return {
    window, media, main, observers,
    node: (top, object) => new Element(top, object),
    render(next, nextNodes, history = false) {
      location.pathname = next
      if (history) window.emit('popstate')
      pathname = next; nodes = nextNodes; cursor = 0
      exports.PageMotion()
      pending.splice(0).forEach(fn => fn())
    },
    unmount() { hooks.forEach(hook => hook?.cleanup?.()) },
  }
}

const a = app()
const heading = a.node(100), proseBelow = a.node(1000), artworkBelow = a.node(1100, true)
a.render('/', [heading, proseBelow, artworkBelow])
assert.equal(heading.plays[0].state, 'running')
assert.equal(proseBelow.plays.length, 0, 'Reading content below the fold must remain static')
assert.equal(artworkBelow.plays[0].state, 'paused', 'An off-screen object waits until it enters')
a.observers[0].enter(artworkBelow)
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

for (const settings of [{ reduced: true }, { historyDocument: true }]) {
  const c = app(settings), node = c.node(100)
  c.render('/', [node])
  assert.equal(node.plays.length, 0, 'Reduced-motion and restored documents remain fully visible')
}
console.log('Motion passed: new arrivals, quiet reading and filters, history restoration, one-time artwork reveals, input interruption, reduced motion and lifecycle cleanup.')

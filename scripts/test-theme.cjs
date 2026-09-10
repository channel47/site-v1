const assert = require('node:assert/strict')
const fs = require('node:fs')
const vm = require('node:vm')
const ts = require('typescript')
const code = ts.transpileModule(fs.readFileSync('lib/theme.ts', 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
}).outputText

function browser({ saved, dark = false, blocked = false, reduced = false } = {}) {
  class Events {
    handlers = new Map()
    addEventListener(name, listener) {
      if (!this.handlers.has(name)) this.handlers.set(name, new Set())
      this.handlers.get(name).add(listener)
    }
    removeEventListener(name, listener) {
      const set = this.handlers.get(name)
      set?.delete(listener)
      if (!set?.size) this.handlers.delete(name)
    }
    dispatchEvent(event) { this.handlers.get(event.type)?.forEach(fn => fn(event)) }
  }
  const properties = new Map()
  const root = { dataset: {}, style: {
    setProperty(key, value) { properties.set(key, value) },
    removeProperty(key) { properties.delete(key) },
  } }
  const window = new Events()
  const system = Object.assign(new Events(), { matches: dark })
  const reduce = Object.assign(new Events(), { matches: reduced })
  const storage = new Map(saved === undefined ? [] : [['channel47-theme', saved]])
  const localStorage = {
    getItem(key) { if (blocked) throw Error('Blocked'); return storage.get(key) ?? null },
    setItem(key, value) { if (blocked) throw Error('Blocked'); storage.set(key, value) },
    removeItem(key) { if (blocked) throw Error('Blocked'); storage.delete(key) },
  }
  let chrome
  const context = vm.createContext({
    exports: {}, window, localStorage, matchMedia: query => query.includes('reduced-motion') ? reduce : system,
    Event: class { constructor(type) { this.type = type } },
    document: { documentElement: root, querySelector: () => ({ setAttribute: (_, color) => { chrome = color } }) },
    getComputedStyle: () => ({ getPropertyValue: () => root.dataset.theme === 'dark' ? '#1b1c19' : '#f4f4f0' }),
  })
  vm.runInContext(code, context)
  const theme = context.exports
  vm.runInContext(theme.THEME_BOOT, context)
  return { theme, root, window, system, reduce, storage, context, properties, chrome: () => chrome }
}

for (const [options, mode, resolved] of [
  [{}, 'system', 'light'],
  [{ dark: true }, 'system', 'dark'],
  [{ saved: 'light', dark: true }, 'light', 'light'],
  [{ saved: 'dark' }, 'dark', 'dark'],
  [{ saved: 'invalid', dark: true }, 'system', 'dark'],
  [{ saved: 'light', dark: true, blocked: true }, 'system', 'dark'],
]) {
  const { root, chrome } = browser(options)
  assert.equal(root.dataset.themeMode, mode, 'Saved mode is validated before paint')
  assert.equal(root.dataset.theme, resolved, 'Correct palette is established without waiting for React')
  assert.equal(chrome(), resolved === 'dark' ? '#1b1c19' : '#f4f4f0', 'Browser chrome matches before hydration too')
}

const b = browser()
const stop = b.theme.watchTheme()
let notifications = 0
const unsubscribe = b.theme.subscribeTheme(() => notifications++)
b.system.matches = true
b.system.dispatchEvent({ type: 'change' })
assert.equal(b.root.dataset.theme, 'dark', 'System mode follows live OS changes')
assert.equal(b.chrome(), '#1b1c19', 'Browser chrome follows the actual page color')
b.theme.setThemeMode('light')
assert.equal(b.storage.get('channel47-theme'), 'light')
b.system.dispatchEvent({ type: 'change' })
assert.equal(b.root.dataset.theme, 'light', 'An explicit choice is never overridden by the OS')
b.window.dispatchEvent({ type: 'storage', key: 'unrelated', newValue: 'dark' })
assert.equal(b.root.dataset.theme, 'light', 'Other storage keys cannot change appearance')
b.window.dispatchEvent({ type: 'storage', key: 'channel47-theme', newValue: 'dark' })
assert.equal(b.theme.getThemeMode(), 'dark', 'Other tabs keep the selected control synchronized')
b.theme.setThemeMode('system')
assert.equal(b.storage.size, 0, 'System removes the saved override')
assert.equal(b.root.dataset.theme, 'dark')
b.theme.setThemeMode('light')
b.window.dispatchEvent({ type: 'storage', key: null, newValue: null })
assert.equal(b.theme.getThemeMode(), 'system', 'Clearing storage returns other tabs to System')
assert.ok(notifications >= 6)
unsubscribe(); stop()
assert.equal(b.window.handlers.size, 0)
assert.equal(b.system.handlers.size, 0)
const replay = b.theme.watchTheme(); replay()
assert.equal(b.window.handlers.size, 0, 'Effect replay leaves no duplicate observers')

const privateBrowser = browser({ blocked: true })
privateBrowser.theme.setThemeMode('dark')
assert.equal(privateBrowser.root.dataset.theme, 'dark', 'Storage failures never break the current visit')
const stopPrivate = privateBrowser.theme.watchTheme()
assert.equal(privateBrowser.root.dataset.theme, 'dark', 'Remounting preserves an unsaved choice when storage is blocked')
stopPrivate()

const rootError = browser({ saved: 'dark' })
rootError.root.dataset = {}
const stopError = rootError.theme.watchTheme()
assert.equal(rootError.root.dataset.theme, 'dark', 'A replacement error document restores the saved preference')
assert.equal(rootError.chrome(), '#1b1c19')
stopError()

async function transitions() {
  const source = ts.transpileModule(fs.readFileSync('lib/theme-transition.ts', 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText
  const control = { getBoundingClientRect: () => ({ left: 340, top: 760, width: 48, height: 48 }) }
  function harness(options = {}) {
    const b = browser(options)
    Object.assign(b.context, { exports: {}, require: () => b.theme, innerWidth: 400, innerHeight: 850 })
    const captures = []
    if (options.supported !== false) b.context.document.startViewTransition = update => {
      if (options.throws) throw Error('Snapshot unavailable')
      let ready, rejectReady, finish
      const capture = {
        ready: new Promise((resolve, reject) => { ready = resolve; rejectReady = reject }),
        finished: new Promise(resolve => { finish = resolve }),
        run() { update(); ready() },
        fail() { update(); rejectReady(Error('Hidden document')); finish() },
        finish,
        skipTransition() { this.skipped = true },
      }
      captures.push(capture)
      return capture
    }
    vm.runInContext(source, b.context)
    return { ...b, toggle: () => b.context.exports.toggleTheme(control), captures }
  }
  for (const options of [{ dark: true, supported: false }, { dark: true, reduced: true }, { dark: true, throws: true }]) {
    const b = harness(options)
    b.toggle()
    assert.equal(b.root.dataset.theme, 'light', 'One click flips the resolved system appearance, including fallback paths')
    assert.equal(b.storage.get('channel47-theme'), 'light', 'A deliberate click saves the choice')
    assert.equal(b.root.dataset.themeTransition, undefined)
    assert.equal(b.properties.size, 0)
    b.toggle()
    assert.equal(b.root.dataset.theme, 'dark', 'The next click switches straight back')
  }
  const b = harness({ dark: true })
  b.toggle()
  assert.equal(b.properties.get('--theme-x'), '91%')
  assert.equal(Number.parseFloat(b.properties.get('--theme-y')), 784 / 850 * 100)
  const radius = Number.parseFloat(b.properties.get('--theme-radius')) / 100 * Math.hypot(400, 850) / Math.SQRT2
  assert.ok(radius >= Math.hypot(364, 784) - 0.001, 'Reveal covers the farthest viewport corner')
  // A snapshot at another zoom level must retain the same relative center.
  for (const scale of [0.67, 1, 1.25, 2]) {
    assert.ok(Math.abs(Number.parseFloat(b.properties.get('--theme-x')) / 100 * (400 * scale) - 364 * scale) < 0.001)
  }
  b.captures[0].run()
  assert.equal(b.root.dataset.theme, 'light')
  b.captures[0].finish()
  await Promise.resolve()
  assert.equal(b.properties.size, 0, 'Finished transitions remove transient styling')
  assert.equal(b.reduce.handlers.size, 0, 'Finished transitions remove preference listeners')

  const rapid = harness({ dark: true })
  rapid.toggle(); rapid.toggle()
  assert.equal(rapid.captures[0].skipped, true, 'A new click supersedes the current transition')
  rapid.captures[0].run(); rapid.captures[0].finish()
  await Promise.resolve()
  assert.equal(rapid.root.dataset.theme, 'dark', 'A stale capture cannot apply an earlier choice')
  assert.equal(rapid.root.dataset.themeTransition, 'true', 'Old cleanup cannot remove a new reveal')
  rapid.captures[1].run()
  assert.equal(rapid.root.dataset.theme, 'dark', 'Two rapid clicks return to the starting appearance')
  rapid.reduce.matches = true
  rapid.reduce.dispatchEvent({ type: 'change' })
  assert.equal(rapid.captures[1].skipped, true, 'Enabling reduced motion stops an active reveal')
  rapid.captures[1].finish()
  await Promise.resolve()
  assert.equal(rapid.reduce.handlers.size, 0)
  assert.equal(rapid.properties.size, 0)

  const failed = harness()
  failed.toggle(); failed.captures[0].fail()
  await Promise.resolve()
  assert.equal(failed.root.dataset.theme, 'dark', 'Skipped snapshots still apply the requested appearance')
  assert.equal(failed.root.dataset.themeTransition, undefined)
  assert.equal(failed.reduce.handlers.size, 0)
}
transitions().then(() => console.log('Theme passed: first paint, preferences, OS and tab sync, storage denial, chrome, direct toggle, transition geometry, rapid clicks, reduced motion, snapshot failures and cleanup.')).catch(error => { console.error(error); process.exitCode = 1 })

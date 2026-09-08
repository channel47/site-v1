#!/usr/bin/env node
// Local only: compile the canonical loader, then prepare reviewable sharing files.
const fs = require('node:fs')
const os = require('node:os')
const path = require('node:path')
const { execFileSync } = require('node:child_process')
const root = path.resolve(__dirname, '..')
const args = process.argv.slice(2)
const href = args[0]
if (!href || args.slice(1).some(arg => arg !== '--force')) {
  console.error('Usage: pnpm share:pack /notes/SLUG [--force]')
  process.exit(1)
}
const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'ch47-share-'))
try {
  process.chdir(root)
  execFileSync('pnpm', ['exec', 'tsc', 'lib/sharing.ts', '--outDir', temp, '--target', 'ES2022', '--module', 'commonjs', '--esModuleInterop', '--skipLibCheck'], { cwd: root, stdio: 'pipe' })
  fs.symlinkSync(path.join(root, 'node_modules'), path.join(temp, 'node_modules'), 'dir')
  const pack = require(path.join(temp, 'sharing.js')).buildSharePack(href)
  const directory = path.join(root, 'output/sharing', href.split('/')[1], pack.slug)
  const files = { 'share.md': pack.markdown, 'newsletter.html': pack.email }
  if (!args.includes('--force') && Object.keys(files).some(name => fs.existsSync(path.join(directory, name)))) {
    throw new Error(`Review files already exist at ${directory}. Use --force to replace them.`)
  }
  fs.mkdirSync(directory, { recursive: true })
  for (const [name, content] of Object.entries(files)) fs.writeFileSync(path.join(directory, name), content)
  console.log(`Prepared ${directory}\nLocal files only. Nothing posted, uploaded, scheduled, or sent.`)
} catch (error) {
  console.error(error.message)
  if (error.stdout) console.error(error.stdout.toString())
  process.exitCode = 1
} finally {
  fs.rmSync(temp, { recursive: true, force: true })
}

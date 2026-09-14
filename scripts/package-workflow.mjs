import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';

const name = process.argv[2];
if (!name || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(name)) {
  throw new Error('Usage: node scripts/package-workflow.mjs <workflow-name>');
}
const root = process.cwd();
const source = path.join(root, 'workflows', name);
const destination = path.join(root, 'public', 'downloads');
const files = ['SKILL.md', 'brief.md', 'README.md', 'LICENSE'];
for (const file of files) {
  if (!fs.statSync(path.join(source, file)).isFile()) throw new Error(`Missing ${file}`);
}
fs.mkdirSync(path.join(destination, name), { recursive: true });
for (const file of files) fs.copyFileSync(path.join(source, file), path.join(destination, name, file));
const zip = path.join(destination, `${name}-v1.zip`);
// Explicit filenames keep private notes and unreviewed additions out of releases.
// Write a new archive so an old entry cannot survive a changed allowlist.
const temporary = `${zip}.next.zip`;
fs.rmSync(temporary, { force: true });
execFileSync('zip', ['-X', '-q', temporary, ...files.map(file => `${name}/${file}`)], { cwd: path.dirname(source) });
fs.renameSync(temporary, zip);
const hash = createHash('sha256').update(fs.readFileSync(zip)).digest('hex');
fs.writeFileSync(`${zip}.sha256`, `${hash}  ${path.basename(zip)}\n`);
console.log(`Packaged ${name}: ${fs.statSync(zip).size} bytes, SHA-256 ${hash}`);

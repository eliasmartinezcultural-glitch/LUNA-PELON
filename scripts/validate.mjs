import fs from 'node:fs';
import { spawnSync } from 'node:child_process';

const required = ['index.html','styles.css','src/main.js','src/data.js','README.md','ARCHITECTURE.md','CORE-CONTRACT.md','package.json'];
for (const file of required) {
  if (!fs.existsSync(file)) throw new Error(`Missing required file: ${file}`);
}

const html = fs.readFileSync('index.html','utf8');
if (!html.includes('src/main.js')) throw new Error('Entrypoint src/main.js is not referenced by index.html');
if (!html.includes('styles.css')) throw new Error('styles.css is not referenced by index.html');

const main = fs.readFileSync('src/main.js','utf8');
const data = fs.readFileSync('src/data.js','utf8');
if (!main.includes("./data.js")) throw new Error('main.js is disconnected from data.js');
if (!data.includes("VERSION")) throw new Error('data.js has no VERSION source of truth');

for (const file of ['src/main.js','src/data.js']) {
  const result = spawnSync(process.execPath, ['--check', file], { encoding: 'utf8' });
  if (result.status !== 0) throw new Error(`Syntax check failed for ${file}: ${result.stderr || result.stdout}`);
}

const version = data.match(/VERSION\s*=\s*['\"]([^'\"]+)/)?.[1];
if (!version) throw new Error('Could not resolve VERSION from data.js');
if (!html.includes(version)) throw new Error(`index.html version mismatch: expected ${version}`);
if (!fs.readFileSync('CORE-CONTRACT.md','utf8').includes(version)) throw new Error('Core contract version mismatch');

console.log(`LUNA PELÓN validation OK — ${version}`);

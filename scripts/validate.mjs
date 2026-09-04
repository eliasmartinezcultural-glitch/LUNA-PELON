import fs from 'node:fs';
import { spawnSync } from 'node:child_process';

const required = ['index.html','styles.css','src/main.js','src/data.js','src/core/runtime-contract.js','README.md','ARCHITECTURE.md','CORE-CONTRACT.md','package.json'];
for (const file of required) {
  if (!fs.existsSync(file)) throw new Error(`Missing required file: ${file}`);
}

const html = fs.readFileSync('index.html','utf8');
if (!html.includes('src/main.js')) throw new Error('Entrypoint src/main.js is not referenced by index.html');
if (!html.includes('styles.css')) throw new Error('styles.css is not referenced by index.html');
if (!html.includes('type="module"')) throw new Error('ES module entrypoint is missing');

const main = fs.readFileSync('src/main.js','utf8');
const data = fs.readFileSync('src/data.js','utf8');
const contract = fs.readFileSync('src/core/runtime-contract.js','utf8');
if (!main.includes("./data.js")) throw new Error('main.js is disconnected from data.js');
if (!main.includes("./core/runtime-contract.js")) throw new Error('main.js is disconnected from runtime contract');
if (!data.includes('VERSION')) throw new Error('data.js has no VERSION source of truth');
if (!main.includes('sanitizeState')) throw new Error('main.js does not sanitize persisted state');
if (!main.includes('try{')) throw new Error('Persistence load is not guarded against malformed data');
if (!contract.includes('createInitialState') || !contract.includes('sanitizeState')) throw new Error('Runtime contract is incomplete');

for (const file of ['src/main.js','src/data.js','src/core/runtime-contract.js']) {
  const result = spawnSync(process.execPath, ['--check', file], { encoding: 'utf8' });
  if (result.status !== 0) throw new Error(`Syntax check failed for ${file}: ${result.stderr || result.stdout}`);
}

const version = data.match(/VERSION\s*=\s*['\"]([^'\"]+)/)?.[1];
if (!version) throw new Error('Could not resolve VERSION from data.js');
for (const [file,content] of [['index.html',html],['CORE-CONTRACT.md',fs.readFileSync('CORE-CONTRACT.md','utf8')],['ARCHITECTURE.md',fs.readFileSync('ARCHITECTURE.md','utf8')]]) {
  if (!content.includes(version)) throw new Error(`${file} version mismatch: expected ${version}`);
}

console.log(`LUNA PELÓN validation OK — ${version}`);

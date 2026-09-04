import fs from 'node:fs';
import { spawnSync } from 'node:child_process';

const required = [
  'index.html','styles.css','src/main.js','src/data.js','src/core/runtime-contract.js',
  'src/core/state.js','src/core/event-bus.js','src/core/engine.js',
  'src/systems/input.js','src/systems/movement.js','src/systems/interaction.js','src/systems/persistence.js',
  'README.md','ARCHITECTURE.md','CORE-CONTRACT.md','CHANGE-PROTOCOL.md','package.json'
];
for (const file of required) if (!fs.existsSync(file)) throw new Error(`Missing required file: ${file}`);

const html = fs.readFileSync('index.html','utf8');
const data = fs.readFileSync('src/data.js','utf8');
const main = fs.readFileSync('src/main.js','utf8');
const engine = fs.readFileSync('src/core/engine.js','utf8');
const state = fs.readFileSync('src/core/state.js','utf8');
const interaction = fs.readFileSync('src/systems/interaction.js','utf8');
const persistence = fs.readFileSync('src/systems/persistence.js','utf8');

if (!html.includes('src/main.js') || !html.includes('styles.css') || !html.includes('type="module"')) throw new Error('Entrypoint contract failed');
if (!data.includes('VERSION')) throw new Error('data.js has no VERSION source of truth');
if (!main.includes("./core/engine.js")) throw new Error('main.js is not connected to the engine');
if (!engine.includes("../systems/input.js") || !engine.includes("../systems/movement.js") || !engine.includes("../systems/interaction.js") || !engine.includes("../systems/persistence.js")) throw new Error('Engine is missing a required system connection');
if (!engine.includes("./state.js") || !engine.includes("./event-bus.js")) throw new Error('Engine is missing core connections');
if (!state.includes('createGameState') || !state.includes('sanitizeGameState')) throw new Error('State contract is incomplete');
if (!interaction.includes("mission:completed") || !interaction.includes("history:discovered")) throw new Error('Interaction events are not connected');
if (!persistence.includes('try') || !persistence.includes('SAVE_KEY')) throw new Error('Persistence safety contract failed');

const filesToCheck = required.filter(file => file.endsWith('.js') || file.endsWith('.mjs'));
for (const file of filesToCheck) {
  const result = spawnSync(process.execPath, ['--check', file], { encoding: 'utf8' });
  if (result.status !== 0) throw new Error(`Syntax check failed for ${file}: ${result.stderr || result.stdout}`);
}

const version = data.match(/VERSION\s*=\s*['\"]([^'\"]+)/)?.[1];
if (!version) throw new Error('Could not resolve VERSION from data.js');
for (const [file, content] of [
  ['index.html', html],
  ['CORE-CONTRACT.md', fs.readFileSync('CORE-CONTRACT.md','utf8')],
  ['ARCHITECTURE.md', fs.readFileSync('ARCHITECTURE.md','utf8')],
  ['CHANGE-PROTOCOL.md', fs.readFileSync('CHANGE-PROTOCOL.md','utf8')]
]) if (!content.includes(version)) throw new Error(`${file} version mismatch: expected ${version}`);

console.log(`LUNA PELÓN validation OK — ${version}`);

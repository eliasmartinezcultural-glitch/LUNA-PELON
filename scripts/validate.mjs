import fs from 'node:fs';
import { spawnSync } from 'node:child_process';

const required = [
  'index.html','styles.css','src/main.js','src/data.js','src/presentation/world-renderer.js','src/core/runtime-contract.js',
  'src/core/state.js','src/core/event-bus.js','src/core/engine.js','src/core/world.js','src/core/entity.js',
  'src/systems/input.js','src/systems/collision.js','src/systems/transitability.js','src/systems/spatial.js','src/systems/interaction.js','src/systems/persistence.js',
  'src/systems/navigation.js','src/systems/npc.js','src/systems/time.js',
  'tests/core-contract.test.mjs','README.md','ARCHITECTURE.md','CORE-CONTRACT.md','CHANGE-PROTOCOL.md','package.json'
];
for (const file of required) if (!fs.existsSync(file)) throw new Error(`Missing required file: ${file}`);

const html = fs.readFileSync('index.html','utf8');
const data = fs.readFileSync('src/data.js','utf8');
const main = fs.readFileSync('src/main.js','utf8');
const renderer = fs.readFileSync('src/presentation/world-renderer.js','utf8');
const engine = fs.readFileSync('src/core/engine.js','utf8');
const state = fs.readFileSync('src/core/state.js','utf8');
const world = fs.readFileSync('src/core/world.js','utf8');
const entity = fs.readFileSync('src/core/entity.js','utf8');
const collision = fs.readFileSync('src/systems/collision.js','utf8');
const transitability = fs.readFileSync('src/systems/transitability.js','utf8');
const spatial = fs.readFileSync('src/systems/spatial.js','utf8');
const interaction = fs.readFileSync('src/systems/interaction.js','utf8');
const persistence = fs.readFileSync('src/systems/persistence.js','utf8');
const navigation = fs.readFileSync('src/systems/navigation.js','utf8');
const npc = fs.readFileSync('src/systems/npc.js','utf8');
const time = fs.readFileSync('src/systems/time.js','utf8');
const pkg = JSON.parse(fs.readFileSync('package.json','utf8'));

if (!html.includes('src/main.js') || !html.includes('styles.css') || !html.includes('type="module"')) throw new Error('Entrypoint contract failed');
if (!data.includes("VERSION='v0.6.0'")) throw new Error('Living world version source is incorrect');
for (const requiredField of ['zones:', 'roads:', 'farms:', 'buildings:', 'obstacles:', 'points:']) if (!data.includes(requiredField)) throw new Error(`World data contract is incomplete: ${requiredField}`);
if (!data.includes('schedule:') || !data.includes('speed:')) throw new Error('NPC routine data contract is incomplete');
if (pkg.version !== '0.6.0') throw new Error(`package.json version mismatch: ${pkg.version}`);
if (pkg.scripts?.test !== 'node --test tests/core-contract.test.mjs') throw new Error('Test script contract is missing');
if (!main.includes("./core/engine.js") || !main.includes("./presentation/world-renderer.js")) throw new Error('main.js presentation/core connections failed');
if (!renderer.includes('world.roads') || !renderer.includes('world.farms') || !renderer.includes('world.buildings')) throw new Error('Renderer is not data-driven');
if (!engine.includes("../systems/navigation.js") || !engine.includes("../systems/npc.js") || !engine.includes("../systems/time.js")) throw new Error('Living world systems are not connected');
if (!engine.includes('createEntityRegistry') || !engine.includes('state.playerId') || !engine.includes('dynamicEntities')) throw new Error('Living entity runtime integration failed');
if (!engine.includes('getSurfaceAt') || !engine.includes('getMovementModifier')) throw new Error('Transitability integration failed');
if (!state.includes('PLAYER_ENTITY_ID') || !state.includes('playerId')) throw new Error('Stable player identity contract failed');
if (!world.includes('roads') || !world.includes('farms') || !world.includes('buildings') || !world.includes('river')) throw new Error('Semantic world model is incomplete');
if (!entity.includes('createEntity') || !entity.includes('createEntityRegistry') || !entity.includes('setPosition')) throw new Error('Entity contract is incomplete');
if (!collision.includes('dynamicEntities') || !collision.includes('overlapsCircleEntity')) throw new Error('Dynamic collision contract is incomplete');
if (!transitability.includes('getSurfaceAt') || !transitability.includes('getMovementModifier') || !transitability.includes('isTraversable')) throw new Error('Transitability contract is incomplete');
if (!spatial.includes('findNearby') || !spatial.includes('findById')) throw new Error('Spatial system contract is incomplete');
if (!interaction.includes("entity:interacted") || !interaction.includes("mission:completed") || !interaction.includes("history:discovered")) throw new Error('Interaction events are not connected');
if (!persistence.includes('try') || !persistence.includes('SAVE_KEY')) throw new Error('Persistence safety contract failed');
if (!navigation.includes('findPath') || !navigation.includes('maxIterations')) throw new Error('Navigation contract is incomplete');
if (!npc.includes('activeSchedule') || !npc.includes('getRuntime')) throw new Error('NPC system contract is incomplete');
if (!time.includes('MINUTES_PER_DAY') || !time.includes('getMinutes')) throw new Error('World clock contract is incomplete');

const filesToCheck = required.filter(file => file.endsWith('.js') || file.endsWith('.mjs'));
for (const file of filesToCheck) {
  const result = spawnSync(process.execPath, ['--check', file], { encoding: 'utf8' });
  if (result.status !== 0) throw new Error(`Syntax check failed for ${file}: ${result.stderr || result.stdout}`);
}

const test = spawnSync(process.execPath, ['--test', 'tests/core-contract.test.mjs'], { encoding: 'utf8' });
if (test.status !== 0) throw new Error(`Core tests failed: ${test.stderr || test.stdout}`);

const version = data.match(/VERSION\s*=\s*['\"]([^'\"]+)/)?.[1];
if (!version) throw new Error('Could not resolve VERSION from data.js');
for (const [file, content] of [
  ['index.html', html],
  ['CORE-CONTRACT.md', fs.readFileSync('CORE-CONTRACT.md','utf8')],
  ['ARCHITECTURE.md', fs.readFileSync('ARCHITECTURE.md','utf8')],
  ['CHANGE-PROTOCOL.md', fs.readFileSync('CHANGE-PROTOCOL.md','utf8')]
]) if (!content.includes(version)) throw new Error(`${file} version mismatch: expected ${version}`);

console.log(`LUNA PELÓN validation OK — ${version} — syntax + contracts + tests`);

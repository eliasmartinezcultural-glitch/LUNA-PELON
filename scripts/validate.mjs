import fs from 'node:fs';
import { spawnSync } from 'node:child_process';

const required = ['index.html','styles.css','src/main.js','src/data.js','src/content/memories.js','src/content/characters.js','src/content/dialogues.js','src/content/missions.js','src/presentation/world-renderer.js','src/core/runtime-contract.js','src/core/state.js','src/core/event-bus.js','src/core/engine.js','src/core/world.js','src/core/entity.js','src/systems/input.js','src/systems/collision.js','src/systems/transitability.js','src/systems/spatial.js','src/systems/interaction.js','src/systems/persistence.js','src/systems/navigation.js','src/systems/npc.js','src/systems/time.js','src/systems/dialogue.js','src/systems/mission.js','tests/core-contract.test.mjs','README.md','ARCHITECTURE.md','CORE-CONTRACT.md','CHANGE-PROTOCOL.md','package.json'];
for (const file of required) if (!fs.existsSync(file)) throw new Error(`Missing required file: ${file}`);
const read = (file) => fs.readFileSync(file, 'utf8');
const html=read('index.html'), data=read('src/data.js'), main=read('src/main.js'), renderer=read('src/presentation/world-renderer.js'), engine=read('src/core/engine.js'), state=read('src/core/state.js'), world=read('src/core/world.js'), entity=read('src/core/entity.js'), interaction=read('src/systems/interaction.js'), pkg=JSON.parse(read('package.json'));
if (!html.includes('src/main.js') || !html.includes('styles.css') || !html.includes('type="module"') || !html.includes('data-dir="interact"')) throw new Error('Entrypoint/mobile interaction contract failed');
if (!data.includes("VERSION='v0.8.0'") || !data.includes("./content/memories.js") || !data.includes("./content/characters.js") || !data.includes("./content/dialogues.js") || !data.includes("./content/missions.js")) throw new Error('Content composition contract failed');
for (const field of ['zones:','roads:','farms:','buildings:','obstacles:','points:']) if (!data.includes(field)) throw new Error(`World data contract is incomplete: ${field}`);
if (!data.includes('schedule:') || !data.includes('speed:') || !data.includes('dialogue:')) throw new Error('NPC content contract is incomplete');
if (!data.includes('MISSION=getMissionById') || !data.includes('DISCOVERY=')) throw new Error('Mission/discovery composition contract is incomplete');
if (pkg.version !== '0.8.0') throw new Error(`package.json version mismatch: ${pkg.version}`);
if (pkg.scripts?.test !== 'node --test tests/core-contract.test.mjs') throw new Error('Test script contract is missing');
if (!main.includes("./core/engine.js") || !main.includes("./presentation/world-renderer.js")) throw new Error('main.js connections failed');
if (!renderer.includes('world.roads') || !renderer.includes('world.farms') || !renderer.includes('world.buildings')) throw new Error('Renderer is not data-driven');
if (!engine.includes("../systems/navigation.js") || !engine.includes("../systems/npc.js") || !engine.includes("../systems/time.js") || !engine.includes("../systems/dialogue.js") || !engine.includes("../systems/mission.js")) throw new Error('Gameplay systems are not connected');
if (!engine.includes('createEntityRegistry') || !engine.includes('state.playerId') || !engine.includes('dynamicEntities')) throw new Error('Living entity runtime integration failed');
if (!state.includes('GAME_SCHEMA_VERSION = 3') || !state.includes('PLAYER_ENTITY_ID') || !state.includes('dialogue') || !state.includes('mission: {')) throw new Error('Persistent gameplay state contract failed');
if (!world.includes('roads') || !world.includes('farms') || !world.includes('buildings') || !world.includes('river')) throw new Error('Semantic world model is incomplete');
if (!entity.includes('createEntity') || !entity.includes('createEntityRegistry') || !entity.includes('setPosition')) throw new Error('Entity contract is incomplete');
if (!interaction.includes("entity:interacted") || !interaction.includes("history:discovered")) throw new Error('Interaction events are not connected');
const filesToCheck=required.filter(file=>file.endsWith('.js')||file.endsWith('.mjs'));
for (const file of filesToCheck) { const result=spawnSync(process.execPath,['--check',file],{encoding:'utf8'}); if(result.status!==0) throw new Error(`Syntax check failed for ${file}: ${result.stderr||result.stdout}`); }
const test=spawnSync(process.execPath,['--test','tests/core-contract.test.mjs'],{encoding:'utf8'}); if(test.status!==0) throw new Error(`Core tests failed: ${test.stderr||test.stdout}`);
const version=data.match(/VERSION\s*=\s*['\"]([^'\"]+)/)?.[1]; if(!version) throw new Error('Could not resolve VERSION from data.js');
for(const [file,content] of [['index.html',html],['CORE-CONTRACT.md',read('CORE-CONTRACT.md')],['ARCHITECTURE.md',read('ARCHITECTURE.md')],['CHANGE-PROTOCOL.md',read('CHANGE-PROTOCOL.md')]]) if(!content.includes(version)) throw new Error(`${file} version mismatch: expected ${version}`);
console.log(`LUNA PELÓN validation OK — ${version} — syntax + contracts + tests`);

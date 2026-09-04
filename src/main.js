import { WORLD, NPCS, DISCOVERY, MISSION, LOCATIONS, DOORS, VERSION } from './data.js';
import { createGameEngine } from './core/engine.js';
import { createWorldRenderer } from './presentation/world-renderer.js';

const canvas = document.querySelector('#game');
const ctx = canvas.getContext('2d');
const dialogue = document.querySelector('#dialogue');
const objective = document.querySelector('#objective');
const version = document.querySelector('#version');
let last = performance.now();
let frameId = 0;
let saveTimer;
let stopped = false;

function show(text) {
  dialogue.textContent = text;
  dialogue.classList.remove('hidden');
  clearTimeout(show.timer);
  show.timer = setTimeout(() => dialogue.classList.add('hidden'), 5200);
}

const engine = createGameEngine({ world: WORLD, npcs: NPCS, discovery: DISCOVERY, mission: MISSION, locations: LOCATIONS, doors: DOORS, onMessage: show });
const renderWorld = createWorldRenderer(ctx, WORLD, engine.entities, () => engine.state, LOCATIONS);

function resize() {
  const dpr = Math.min(devicePixelRatio || 1, 2);
  canvas.width = innerWidth * dpr;
  canvas.height = innerHeight * dpr;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}
addEventListener('resize', resize);
resize();

function loop(now) {
  if (stopped) return;
  const dt = Math.min((now - last) / 1000, 0.05);
  last = now;
  engine.update(dt);
  const activeLocation = engine.locations.current();
  const viewWidth = activeLocation.width;
  const viewHeight = activeLocation.height;
  const camX = activeLocation.id === 'outside' ? Math.max(0, Math.min(viewWidth - innerWidth, engine.state.x - innerWidth / 2)) : Math.max(0, Math.min(viewWidth - innerWidth, engine.state.x - innerWidth / 2));
  const camY = activeLocation.id === 'outside' ? Math.max(58, Math.min(viewHeight - innerHeight, engine.state.y - innerHeight / 2)) : Math.max(0, Math.min(viewHeight - innerHeight, engine.state.y - innerHeight / 2));
  ctx.clearRect(0, 0, innerWidth, innerHeight);
  renderWorld(camX, camY, innerWidth, innerHeight);
  const step = engine.missions.current();
  objective.textContent = engine.state.done ? '✓ Misión completada · explorá libremente' : `Misión: ${step?.label ?? MISSION.objective}`;
  version.textContent = `${VERSION} · ${activeLocation.name}`;
  frameId = requestAnimationFrame(loop);
}

function shutdown() {
  if (stopped) return;
  stopped = true;
  clearInterval(saveTimer);
  cancelAnimationFrame(frameId);
  engine.destroy();
}

addEventListener('pagehide', shutdown);
addEventListener('beforeunload', () => engine.save());
requestAnimationFrame(loop);
saveTimer = setInterval(engine.save, 3000);

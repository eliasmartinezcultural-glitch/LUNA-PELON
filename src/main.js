import { WORLD, NPCS, DISCOVERY, MISSION, VERSION } from './data.js';
import { createGameEngine } from './core/engine.js';
import { createWorldRenderer } from './presentation/world-renderer.js';

const canvas = document.querySelector('#game');
const ctx = canvas.getContext('2d');
const dialogue = document.querySelector('#dialogue');
const objective = document.querySelector('#objective');
const version = document.querySelector('#version');
let last = performance.now();

function show(text) {
  dialogue.textContent = text;
  dialogue.classList.remove('hidden');
  clearTimeout(show.timer);
  show.timer = setTimeout(() => dialogue.classList.add('hidden'), 5200);
}

const engine = createGameEngine({ world: WORLD, npcs: NPCS, discovery: DISCOVERY, mission: MISSION, onMessage: show });
const renderWorld = createWorldRenderer(ctx, WORLD, NPCS, DISCOVERY, () => engine.state);

addEventListener('keydown', (event) => {
  if (event.key === ' ') {
    event.preventDefault();
    engine.interact();
  }
});

function resize() {
  const dpr = Math.min(devicePixelRatio || 1, 2);
  canvas.width = innerWidth * dpr;
  canvas.height = innerHeight * dpr;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}
addEventListener('resize', resize);
resize();

function loop(now) {
  const dt = Math.min((now - last) / 1000, 0.05);
  last = now;
  engine.update(dt);
  const camX = Math.max(0, Math.min(WORLD.width - innerWidth, engine.state.x - innerWidth / 2));
  const camY = Math.max(58, Math.min(WORLD.height - innerHeight, engine.state.y - innerHeight / 2));
  ctx.clearRect(0, 0, innerWidth, innerHeight);
  renderWorld(camX, camY, innerWidth, innerHeight);
  objective.textContent = engine.state.done ? 'Misión completada · explorá' : `Misión: ${MISSION.objective}`;
  version.textContent = VERSION;
  requestAnimationFrame(loop);
}
requestAnimationFrame(loop);
setInterval(engine.save, 3000);

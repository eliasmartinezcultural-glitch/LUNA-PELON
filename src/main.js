import { WORLD, NPCS, DISCOVERY, MISSION, VERSION } from './data.js';
import { createGameEngine } from './core/engine.js';

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

function drawWorld(camX, camY) {
  ctx.fillStyle = '#8fb36f';
  ctx.fillRect(0, 0, innerWidth, innerHeight);
  const size = 48;
  for (let y = 0; y < WORLD.height; y += size) for (let x = 0; x < WORLD.width; x += size) {
    const variation = ((x / size * 17 + y / size * 31) % 7);
    ctx.fillStyle = variation < 1 ? '#86aa68' : '#91b873';
    ctx.fillRect(x - camX, y - camY, size + 1, size + 1);
  }
  ctx.fillStyle = '#5f9fb2';
  ctx.fillRect(WORLD.river.x - camX, -100 - camY, WORLD.river.width, WORLD.height + 300);
  ctx.fillStyle = '#b99a6d';
  ctx.fillRect(-100 - camX, 650 - camY, 1800, 105);
  ctx.fillStyle = '#d0ae79';
  ctx.fillRect(1590 - camX, 650 - camY, 520, 100);
  ctx.fillStyle = '#6f8c52';
  ctx.fillRect(190 - camX, 230 - camY, 420, 250);
  ctx.fillStyle = '#6b4a32';
  ctx.fillRect(270 - camX, 420 - camY, 190, 150);
  ctx.fillStyle = '#9c5b42';
  ctx.beginPath();
  ctx.moveTo(245 - camX, 420 - camY);
  ctx.lineTo(365 - camX, 335 - camY);
  ctx.lineTo(485 - camX, 420 - camY);
  ctx.fill();
  ctx.fillStyle = '#553a2a';
  ctx.fillRect(342 - camX, 485 - camY, 45, 85);

  for (const npc of NPCS) {
    ctx.fillStyle = npc.color;
    ctx.fillRect(npc.x - camX - 13, npc.y - camY - 20, 26, 34);
    ctx.fillStyle = '#d6a074';
    ctx.fillRect(npc.x - camX - 10, npc.y - camY - 35, 20, 18);
    ctx.fillStyle = '#111';
    ctx.font = '12px system-ui';
    ctx.textAlign = 'center';
    ctx.fillText(npc.name, npc.x - camX, npc.y - camY - 44);
  }

  ctx.fillStyle = engine.state.seen ? '#777' : '#e7d39c';
  ctx.fillRect(DISCOVERY.x - camX - 12, DISCOVERY.y - camY - 10, 24, 20);
  ctx.fillStyle = '#111';
  ctx.font = '10px system-ui';
  ctx.fillText('MEMORIA', DISCOVERY.x - camX, DISCOVERY.y - camY + 4);

  ctx.fillStyle = '#28486b';
  ctx.fillRect(engine.state.x - camX - 14, engine.state.y - camY - 22, 28, 38);
  ctx.fillStyle = '#d6a074';
  ctx.fillRect(engine.state.x - camX - 10, engine.state.y - camY - 38, 20, 18);
  ctx.fillStyle = '#fff';
  ctx.font = 'bold 11px system-ui';
  ctx.fillText('LUNA', engine.state.x - camX, engine.state.y - camY - 47);
}

function loop(now) {
  const dt = Math.min((now - last) / 1000, 0.05);
  last = now;
  engine.update(dt);
  const camX = Math.max(0, Math.min(WORLD.width - innerWidth, engine.state.x - innerWidth / 2));
  const camY = Math.max(58, Math.min(WORLD.height - innerHeight, engine.state.y - innerHeight / 2));
  ctx.clearRect(0, 0, innerWidth, innerHeight);
  drawWorld(camX, camY);
  objective.textContent = engine.state.done ? 'Misión completada · explorá' : `Misión: ${MISSION.objective}`;
  version.textContent = VERSION;
  requestAnimationFrame(loop);
}
requestAnimationFrame(loop);
setInterval(engine.save, 3000);

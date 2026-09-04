import { createGameState, sanitizeGameState } from './state.js';
import { createEventBus } from './event-bus.js';
import { createWorldModel } from './world.js';
import { createEntityRegistry } from './entity.js';
import { createInputSystem } from '../systems/input.js';
import { canOccupy, moveWithCollision } from '../systems/collision.js';
import { getSurfaceAt, getMovementModifier } from '../systems/transitability.js';
import { createInteractionSystem } from '../systems/interaction.js';
import { createNavigationSystem } from '../systems/navigation.js';
import { createNpcSystem } from '../systems/npc.js';
import { createWorldClock } from '../systems/time.js';
import { createDialogueSystem } from '../systems/dialogue.js';
import { loadState, saveState } from '../systems/persistence.js';

export function createGameEngine({ world, npcs, discovery, mission, storage = localStorage, onMessage }) {
  const worldModel = createWorldModel(world);
  const events = createEventBus();
  const input = createInputSystem();
  const clock = createWorldClock({ startMinutes: 8 * 60, timeScale: 1 });
  const initial = createGameState(world, mission);
  const state = sanitizeGameState({ ...initial, ...(loadState(storage, world, mission, sanitizeGameState) ?? {}) }, world, mission);
  const points = Object.entries(world.points ?? {}).map(([id, point]) => ({ id: `point:${id}`, type: 'landmark', x: point.x, y: point.y, collidable: false, interactable: false }));
  const registry = createEntityRegistry([
    { id: state.playerId, type: 'player', x: state.x, y: state.y, interactable: false, collidable: false, radius: 14 },
    ...points,
    ...npcs.map((npc) => ({ collidable: true, radius: 14, interactable: true, ...npc })),
    { collidable: false, interactable: true, ...discovery },
  ]);
  const show = (text) => onMessage?.(text);
  const save = () => saveState(storage, state, world, mission, sanitizeGameState);
  const near = (a, b, radius = 75) => Math.hypot(a.x - b.x, a.y - b.y) < radius;
  const dialogue = createDialogueSystem({ state, events, save, show });
  const interaction = createInteractionSystem({ state, registry, near, show, save, events, dialogue });
  const navigation = createNavigationSystem({ worldModel, isBlocked: (x, y, radius) => !canOccupy(worldModel, x, y, radius, registry.all().filter((entity) => entity.type === 'npc')) });
  const npcSystem = createNpcSystem({
    registry, navigation, getTimeMinutes: clock.getMinutes,
    moveEntity: (entity, direction, dt, speed) => moveWithCollision(entity, direction, worldModel, dt, speed * getMovementModifier(getSurfaceAt(worldModel, entity.x, entity.y)), entity.radius ?? 14, registry.all().filter((other) => other.id !== entity.id && other.collidable !== false)),
  });

  function update(dt) {
    clock.update(dt);
    const direction = input.getVector();
    const surface = getSurfaceAt(worldModel, state.x, state.y);
    const speed = 230 * getMovementModifier(surface);
    const dynamicEntities = registry.all().filter((entity) => entity.id !== state.playerId && entity.collidable !== false);
    const moved = moveWithCollision(state, direction, worldModel, dt, speed, 14, dynamicEntities);
    registry.setPosition(state.playerId, state.x, state.y);
    npcSystem.update(dt);
    if (moved) {
      events.emit('player:moved', { x: state.x, y: state.y, surface });
      for (const npc of registry.all().filter((entity) => entity.type === 'npc')) if (near(state, npc, 52)) show(`Presioná ESPACIO para hablar con ${npc.name}.`);
      const discoveryEntity = registry.get(discovery.id);
      if (discoveryEntity && near(state, discoveryEntity, 65)) show('Presioná ESPACIO para observar la memoria.');
    }
  }

  function destroy() { save(); dialogue.resetAll(); input.destroy(); events.clear(); }
  return { state, world: worldModel, entities: registry, input, events, clock, npcSystem, dialogue, interact: interaction.interact, update, save, destroy };
}

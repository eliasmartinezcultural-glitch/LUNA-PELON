import { createGameState, sanitizeGameState } from './state.js';
import { createEventBus } from './event-bus.js';
import { createWorldModel } from './world.js';
import { createEntityRegistry } from './entity.js';
import { createInputSystem } from '../systems/input.js';
import { moveWithCollision } from '../systems/collision.js';
import { getSurfaceAt, getMovementModifier } from '../systems/transitability.js';
import { createInteractionSystem } from '../systems/interaction.js';
import { loadState, saveState } from '../systems/persistence.js';

export function createGameEngine({ world, npcs, discovery, mission, storage = localStorage, onMessage }) {
  const worldModel = createWorldModel(world);
  const events = createEventBus();
  const input = createInputSystem();
  const initial = createGameState(world, mission);
  const state = { ...initial, ...(loadState(storage, world, mission, sanitizeGameState) ?? {}) };
  const registry = createEntityRegistry([
    { id: state.playerId, type: 'player', x: state.x, y: state.y, interactable: false, collidable: false, radius: 14 },
    ...npcs.map((npc) => ({ collidable: true, radius: 14, interactable: true, ...npc })),
    { collidable: false, interactable: true, ...discovery },
  ]);
  const show = (text) => onMessage?.(text);
  const save = () => saveState(storage, state, world, mission, sanitizeGameState);
  const near = (a, b, radius = 75) => Math.hypot(a.x - b.x, a.y - b.y) < radius;
  const interaction = createInteractionSystem({ state, registry, near, show, save, events });

  function update(dt) {
    const direction = input.getVector();
    const surface = getSurfaceAt(worldModel, state.x, state.y);
    const speed = 230 * getMovementModifier(surface);
    const dynamicEntities = registry.all().filter((entity) => entity.id !== state.playerId);
    const moved = moveWithCollision(state, direction, worldModel, dt, speed, 14, dynamicEntities);
    registry.setPosition(state.playerId, state.x, state.y);

    if (moved) {
      events.emit('player:moved', { x: state.x, y: state.y, surface });
      for (const npc of npcs) if (near(state, npc, 52)) show(`Presioná ESPACIO para hablar con ${npc.name}.`);
      if (near(state, discovery, 65)) show('Presioná ESPACIO para observar la memoria.');
    }
  }

  function destroy() {
    save();
    input.destroy();
    events.clear();
  }

  return {
    state,
    world: worldModel,
    entities: registry,
    input,
    events,
    interact: interaction.interact,
    update,
    save,
    destroy,
  };
}

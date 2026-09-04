import { createGameState, sanitizeGameState } from './state.js';
import { createEventBus } from './event-bus.js';
import { createInputSystem } from '../systems/input.js';
import { updateMovement } from '../systems/movement.js';
import { createInteractionSystem } from '../systems/interaction.js';
import { loadState, saveState } from '../systems/persistence.js';

export function createGameEngine({ world, npcs, discovery, mission, storage = localStorage, onMessage }) {
  const events = createEventBus();
  const input = createInputSystem();
  const initial = createGameState(world, mission);
  const state = { ...initial, ...(loadState(storage, world, mission, sanitizeGameState) ?? {}) };
  const show = (text) => onMessage?.(text);
  const save = () => saveState(storage, state, world, mission, sanitizeGameState);
  const near = (a, b, radius = 75) => Math.hypot(a.x - b.x, a.y - b.y) < radius;
  const interaction = createInteractionSystem({ state, npcs, discovery, near, show, save, events });

  function update(dt) {
    const moved = updateMovement(state, input, world, dt);
    if (moved) {
      for (const npc of npcs) if (near(state, npc, 52)) show(`Presioná ESPACIO para hablar con ${npc.name}.`);
      if (near(state, discovery, 65)) show('Presioná ESPACIO para observar la memoria.');
    }
  }

  return {
    state,
    input,
    events,
    interact: interaction.interact,
    update,
    save,
    destroy: () => input.destroy(),
  };
}

import { createGameState, sanitizeGameState } from './state.js';
import { createEventBus } from './event-bus.js';
import { createWorldModel } from './world.js';
import { createEntityRegistry } from './entity.js';
import { createInputSystem } from '../systems/input.js';
import { canOccupy, moveWithCollision } from '../systems/collision.js';
import { getSurfaceAt, getMovementModifier } from '../systems/transitability.js';
import { createInteractionSystem } from '../systems/interaction.js';
import { createLocationSystem } from '../systems/location.js';
import { createNavigationSystem } from '../systems/navigation.js';
import { createNpcSystem } from '../systems/npc.js';
import { createWorldClock } from '../systems/time.js';
import { createDialogueSystem } from '../systems/dialogue.js';
import { createMissionSystem } from '../systems/mission.js';
import { loadState, saveState } from '../systems/persistence.js';

export function createGameEngine({ world, npcs, discovery, mission, locations, doors, storage = localStorage, onMessage }) {
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
  const getLocationModel = () => {
    const location = locations.find((candidate) => candidate.id === state.currentLocationId);
    if (!location || location.id === 'outside') return worldModel;
    return createWorldModel({ ...location, spawn: location.spawn, zones: [], roads: [], farms: [], river: { x: location.width + 1, width: 0 }, bridge: { x: 0, y: 0, width: 0, height: 0 }, obstacles: location.obstacles ?? [] });
  };
  const locationSystem = createLocationSystem({ state, locations, doors, events, save, show });
  const near = (a, b, radius = 75) => Math.hypot(a.x - b.x, a.y - b.y) < radius;
  const dialogue = createDialogueSystem({ state, events, save, show });
  const missions = createMissionSystem({ state, mission, events, save, show });
  const interaction = createInteractionSystem({ state, registry, near, show, save, events, dialogue, locationSystem });
  input.setInteractionHandler(interaction.interact);
  const navigation = createNavigationSystem({ worldModel, isBlocked: (x, y, radius) => !canOccupy(worldModel, x, y, radius, registry.all().filter((entity) => entity.type === 'npc')) });
  const npcSystem = createNpcSystem({
    registry, navigation, getTimeMinutes: clock.getMinutes,
    moveEntity: (entity, direction, dt, speed) => moveWithCollision(entity, direction, worldModel, dt, speed * getMovementModifier(getSurfaceAt(worldModel, entity.x, entity.y)), entity.radius ?? 14, registry.all().filter((other) => other.id !== entity.id && other.collidable !== false)),
  });

  function update(dt) {
    clock.update(dt);
    const activeModel = getLocationModel();
    const direction = input.getVector();
    const surface = state.currentLocationId === 'outside' ? getSurfaceAt(activeModel, state.x, state.y) : 'interior';
    const speed = state.currentLocationId === 'outside' ? 230 * getMovementModifier(surface) : 190;
    const dynamicEntities = state.currentLocationId === 'outside' ? registry.all().filter((entity) => entity.id !== state.playerId && entity.collidable !== false) : [];
    const moved = moveWithCollision(state, direction, activeModel, dt, speed, 14, dynamicEntities);
    registry.setPosition(state.playerId, state.x, state.y);
    if (state.currentLocationId === 'outside') npcSystem.update(dt);
    if (moved) {
      events.emit('player:moved', { x: state.x, y: state.y, locationId: state.currentLocationId, surface });
      if (state.currentLocationId === 'outside') {
        for (const npc of registry.all().filter((entity) => entity.type === 'npc')) if (near(state, npc, 52)) show(`Presioná ESPACIO para hablar con ${npc.name}.`);
        const discoveryEntity = registry.get(discovery.id);
        if (discoveryEntity && near(state, discoveryEntity, 65)) show('Presioná ESPACIO para observar la memoria.');
      }
      const door = locationSystem.doors().find((candidate) => near(state, candidate.position, candidate.interactionRadius));
      if (door) show(`Presioná ESPACIO para ${door.label.toLowerCase()}.`);
    }
  }

  function destroy() { save(); missions.destroy(); dialogue.resetAll(); input.destroy(); events.clear(); }
  return { state, world: worldModel, entities: registry, input, events, clock, npcSystem, dialogue, missions, locations: locationSystem, interact: interaction.interact, update, save, destroy };
}

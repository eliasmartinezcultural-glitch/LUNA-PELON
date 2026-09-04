import assert from 'node:assert/strict';
import test from 'node:test';

import { VERSION, WORLD, NPCS, DISCOVERY } from '../src/data.js';
import { createGameState, sanitizeGameState, GAME_SCHEMA_VERSION, PLAYER_ENTITY_ID } from '../src/core/state.js';
import { createWorldModel, getZoneAt } from '../src/core/world.js';
import { createEntityRegistry } from '../src/core/entity.js';
import { canOccupy, moveWithCollision } from '../src/systems/collision.js';
import { getSurfaceAt, getMovementModifier, isTraversable } from '../src/systems/transitability.js';
import { findNearby, findById } from '../src/systems/spatial.js';
import { createNavigationSystem } from '../src/systems/navigation.js';
import { createNpcSystem } from '../src/systems/npc.js';
import { createWorldClock } from '../src/systems/time.js';
import { createDialogueSystem } from '../src/systems/dialogue.js';

const world = { width: 1000, height: 800, spawn: { x: 100, y: 100 }, zones: [{ id: 'town', name: 'Villa Pelón', x: 50, y: 50, width: 400, height: 300 }], roads: [{ id: 'road', x: 50, y: 180, width: 400, height: 40, kind: 'road' }], farms: [{ id: 'farm', x: 50, y: 300, width: 200, height: 200 }], buildings: [{ id: 'house', x: 300, y: 250, width: 100, height: 100 }], river: { x: 600, width: 100 }, bridge: { x: 550, y: 360, w: 200, h: 40 }, obstacles: [{ id: 'wall', x: 200, y: 100, width: 100, height: 100 }] };

test('release data exposes the living-world and dialogue foundation', () => {
  assert.equal(VERSION, 'v0.7.0');
  assert.ok(WORLD.zones.length >= 4 && WORLD.roads.length >= 3 && WORLD.farms.length >= 3 && WORLD.buildings.length >= 3);
  assert.ok(NPCS.every((npc) => Array.isArray(npc.schedule) && npc.schedule.length > 0 && Array.isArray(npc.dialogue)));
  assert.equal(DISCOVERY.type, 'discovery');
});

test('state has stable identity and bounded dialogue memory', () => {
  const state = createGameState(world, { id: 'm1' });
  assert.equal(state.schema, GAME_SCHEMA_VERSION);
  assert.equal(state.playerId, PLAYER_ENTITY_ID);
  assert.deepEqual(state.dialogue, { encounters: {}, history: [] });
  const clean = sanitizeGameState({ x: -999, y: 9999, done: 'yes', seen: 'no', dialogue: { encounters: { marta: 2, bad: -1 }, history: [{ entityId: 'marta', nodeId: 'welcome', encounter: 2 }, { nope: true }] } }, world, { id: 'm1' });
  assert.equal(clean.x, 30); assert.equal(clean.y, 770); assert.equal(clean.done, false); assert.equal(clean.seen, false);
  assert.deepEqual(clean.dialogue.encounters, { marta: 2 });
  assert.equal(clean.dialogue.history.length, 1);
});

test('world model resolves zones and semantic surfaces', () => {
  const model = createWorldModel(world);
  assert.equal(getZoneAt(model, 100, 100)?.id, 'town'); assert.equal(getZoneAt(model, 900, 700), null); assert.equal(model.obstacles.length, 1); assert.equal(model.bridge.width, 200);
  assert.equal(getSurfaceAt(model, 100, 190), 'road'); assert.equal(getSurfaceAt(model, 100, 350), 'farm'); assert.equal(getSurfaceAt(model, 650, 200), 'river'); assert.equal(getSurfaceAt(model, 650, 380), 'bridge');
  assert.equal(isTraversable(model, 650, 200), false); assert.ok(getMovementModifier('road') > getMovementModifier('farm'));
});

test('entity registry rejects duplicate identities and updates positions', () => {
  assert.throws(() => createEntityRegistry([{ id: 'a', x: 1, y: 1 }, { id: 'a', x: 2, y: 2 }]), /Duplicate entity id/);
  const registry = createEntityRegistry([{ id: 'a', x: 1, y: 1 }, { id: 'b', x: 2, y: 2 }]); assert.equal(registry.size(), 2); assert.equal(registry.setPosition('b', 30, 40), true); assert.deepEqual({ x: registry.get('b').x, y: registry.get('b').y }, { x: 30, y: 40 });
});

test('collision blocks static and dynamic occupation', () => { const model = createWorldModel(world); assert.equal(canOccupy(model, 150, 150, 14), true); assert.equal(canOccupy(model, 250, 150, 14), false); assert.equal(canOccupy(model, 150, 150, 14, [{ id: 'npc', x: 150, y: 150, collidable: true, radius: 14 }]), false); });
test('movement cannot tunnel through an obstacle', () => { const model = createWorldModel(world); const state = createGameState(world, { id: 'm1' }); state.x = 170; state.y = 150; moveWithCollision(state, { x: 1, y: 0 }, model, 0.5, 200, 14); assert.equal(state.x < 200 - 14, true); });
test('navigation finds a route around blocked cells', () => { const model = createWorldModel(world); const navigation = createNavigationSystem({ worldModel: model, cellSize: 20, isBlocked: (x, y, radius) => !canOccupy(model, x, y, radius) }); const path = navigation.findPath({ x: 100, y: 100 }, { x: 380, y: 100 }, 10); assert.ok(path.length > 0); assert.deepEqual(path.at(-1), { x: 380, y: 100 }); });
test('NPC system follows a scheduled landmark', () => { const registry = createEntityRegistry([{ id: 'npc-1', type: 'npc', x: 100, y: 100, radius: 10, speed: 50, schedule: [{ start: 0, target: 'point:work', state: 'working' }] }, { id: 'point:work', type: 'landmark', x: 200, y: 100 }]); const npcSystem = createNpcSystem({ registry, navigation: { findPath: () => [{ x: 200, y: 100 }] }, getTimeMinutes: () => 60, moveEntity: (entity, direction, dt, speed) => { entity.x += direction.x * speed * dt; entity.y += direction.y * speed * dt; return true; } }); npcSystem.update(1); assert.equal(npcSystem.getRuntime('npc-1').state, 'working'); assert.ok(registry.get('npc-1').x > 100); });
test('world clock wraps cleanly', () => { const clock = createWorldClock({ startMinutes: 1439, timeScale: 1 }); clock.update(2); assert.equal(clock.getMinutes(), 1); assert.equal(clock.getLabel(), '00:01'); });
test('spatial queries return nearest relevant entities', () => { const entities = [{ id: 'near', x: 110, y: 100 }, { id: 'far', x: 500, y: 500 }]; assert.equal(findNearby({ x: 100, y: 100 }, entities, 50)[0].id, 'near'); assert.equal(findById(entities, 'far').id, 'far'); });

test('dialogue advances, remembers encounters and emits gameplay events', () => {
  const state = createGameState(world, { id: 'm1' }); const registry = createEntityRegistry([{ id: 'marta', type: 'npc', name: 'Marta', dialogue: [{ id: 'a', text: 'Uno', missionComplete: false }, { id: 'b', text: 'Dos', missionComplete: true }] }]);
  const events = []; const dialogue = createDialogueSystem({ state, events: { emit: (name, payload) => events.push({ name, payload }) }, save: () => {}, show: (text) => events.push({ name: 'show', text }) });
  dialogue.start(registry.get('marta')); dialogue.start(registry.get('marta'));
  assert.equal(state.dialogue.encounters.marta, 2); assert.equal(state.dialogue.history.length, 2); assert.equal(state.done, true); assert.equal(events.filter((event) => event.name === 'dialogue:line').length, 2); assert.equal(events.some((event) => event.name === 'mission:completed'), true);
});

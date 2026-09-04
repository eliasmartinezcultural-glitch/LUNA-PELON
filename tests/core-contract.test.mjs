import assert from 'node:assert/strict';
import test from 'node:test';

import { createGameState, sanitizeGameState, GAME_SCHEMA_VERSION } from '../src/core/state.js';
import { createWorldModel, getZoneAt } from '../src/core/world.js';
import { createEntityRegistry } from '../src/core/entity.js';
import { canOccupy, moveWithCollision } from '../src/systems/collision.js';
import { findNearby, findById } from '../src/systems/spatial.js';

const world = {
  width: 1000,
  height: 800,
  spawn: { x: 100, y: 100 },
  zones: [
    { id: 'town', name: 'Villa Pelón', x: 50, y: 50, width: 400, height: 300 }
  ],
  obstacles: [
    { id: 'wall', x: 200, y: 100, width: 100, height: 100 }
  ]
};

test('state has a stable schema and sanitizes invalid coordinates', () => {
  const state = createGameState(world, { id: 'm1' });
  assert.equal(state.schema, GAME_SCHEMA_VERSION);
  assert.equal(state.missionId, 'm1');

  const clean = sanitizeGameState({ x: -999, y: 9999, done: 'yes', seen: 'no' }, world, { id: 'm1' });
  assert.equal(clean.x, 30);
  assert.equal(clean.y, 770);
  assert.equal(clean.done, false);
  assert.equal(clean.seen, false);
});

test('world model resolves zones and preserves obstacles', () => {
  const model = createWorldModel(world);
  assert.equal(getZoneAt(model, 100, 100)?.id, 'town');
  assert.equal(getZoneAt(model, 900, 700), null);
  assert.equal(model.obstacles.length, 1);
});

test('entity registry rejects duplicate identities', () => {
  assert.throws(() => createEntityRegistry([{ id: 'a', x: 1, y: 1 }, { id: 'a', x: 2, y: 2 }]), /Duplicate entity id/);
  const registry = createEntityRegistry([{ id: 'a', x: 1, y: 1 }, { id: 'b', x: 2, y: 2 }]);
  assert.equal(registry.size(), 2);
  assert.equal(registry.get('b').x, 2);
});

test('collision blocks occupation inside obstacles', () => {
  const model = createWorldModel(world);
  assert.equal(canOccupy(model, 150, 150, 14), true);
  assert.equal(canOccupy(model, 250, 150, 14), false);
});

test('movement cannot tunnel through an obstacle', () => {
  const model = createWorldModel(world);
  const state = createGameState(world, { id: 'm1' });
  state.x = 170;
  state.y = 150;
  moveWithCollision(state, { x: 1, y: 0 }, model, 0.5, 200, 14);
  assert.equal(state.x < 200 - 14, true);
});

test('spatial queries return the nearest relevant entities', () => {
  const entities = [
    { id: 'near', x: 110, y: 100 },
    { id: 'far', x: 500, y: 500 }
  ];
  assert.equal(findNearby({ x: 100, y: 100 }, entities, 50)[0].id, 'near');
  assert.equal(findById(entities, 'far').id, 'far');
});

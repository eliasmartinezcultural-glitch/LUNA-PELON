import assert from 'node:assert/strict';
import test from 'node:test';

import { createGameState, sanitizeGameState } from '../src/core/state.js';
import { createEventBus } from '../src/core/event-bus.js';
import { LOCATIONS, DOORS } from '../src/content/locations.js';
import { createLocationSystem } from '../src/systems/location.js';
import { MISSION } from '../src/data.js';

const WORLD = { width: 2400, height: 1500, spawn: { x: 360, y: 760 } };

test('location content has a valid bidirectional community-center door pair', () => {
  const enter = DOORS.find((door) => door.id === 'community-center-door');
  const exit = DOORS.find((door) => door.id === 'community-center-exit');
  assert.equal(LOCATIONS.find((location) => location.id === enter.fromLocation)?.type, 'exterior');
  assert.equal(LOCATIONS.find((location) => location.id === enter.toLocation)?.type, 'interior');
  assert.equal(enter.toLocation, exit.fromLocation);
  assert.equal(exit.toLocation, enter.fromLocation);
});

test('location transition changes context, spawn and emits a stable event', () => {
  const state = createGameState(WORLD, MISSION);
  const events = createEventBus();
  const received = [];
  events.on('location:changed', (payload) => received.push(payload));
  const system = createLocationSystem({ state, locations: LOCATIONS, doors: DOORS, events, save: () => {}, show: () => {} });
  const enter = DOORS.find((door) => door.id === 'community-center-door');

  assert.equal(system.transition(enter), true);
  assert.equal(state.currentLocationId, 'community-center-interior');
  assert.deepEqual({ x: state.x, y: state.y }, enter.spawn);
  assert.deepEqual(received[0], { doorId: enter.id, fromLocationId: 'outside', toLocationId: 'community-center-interior', x: enter.spawn.x, y: enter.spawn.y });
});

test('location transition rejects doors from another context', () => {
  const state = createGameState(WORLD, MISSION);
  const system = createLocationSystem({ state, locations: LOCATIONS, doors: DOORS, events: createEventBus(), save: () => {}, show: () => {} });
  const exit = DOORS.find((door) => door.id === 'community-center-exit');
  assert.equal(system.transition(exit), false);
  assert.equal(state.currentLocationId, 'outside');
});

test('location state survives sanitization after entering an interior', () => {
  const state = sanitizeGameState({ currentLocationId: 'community-center-interior', x: 360, y: 390 }, WORLD, MISSION);
  assert.equal(state.currentLocationId, 'community-center-interior');
  assert.deepEqual({ x: state.x, y: state.y }, { x: 360, y: 390 });
});

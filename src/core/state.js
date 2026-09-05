import { getLocationById } from '../content/locations.js';

export const GAME_SCHEMA_VERSION = 4;
export const PLAYER_ENTITY_ID = 'player';

export function createGameState(world, mission) {
  return {
    schema: GAME_SCHEMA_VERSION,
    playerId: PLAYER_ENTITY_ID,
    currentLocationId: 'outside',
    x: world.spawn.x,
    y: world.spawn.y,
    done: false,
    seen: false,
    missionId: mission.id,
    mission: { id: mission.id, status: 'active', currentStep: 0, completed: [] },
    dialogue: { encounters: {}, history: [] },
    knowledge: { memories: [] },
  };
}

export function sanitizeGameState(raw, world, mission) {
  const fallback = createGameState(world, mission);
  if (!raw || typeof raw !== 'object') return fallback;
  const currentLocation = getLocationById(raw.currentLocationId) ?? getLocationById('outside');
  const currentLocationId = currentLocation?.id ?? 'outside';
  const x = Number(raw.x);
  const y = Number(raw.y);
  const rawDialogue = raw.dialogue && typeof raw.dialogue === 'object' ? raw.dialogue : {};
  const rawEncounters = rawDialogue.encounters && typeof rawDialogue.encounters === 'object' ? rawDialogue.encounters : {};
  const rawHistory = Array.isArray(rawDialogue.history) ? rawDialogue.history : [];
  const encounters = Object.fromEntries(Object.entries(rawEncounters).filter(([id, count]) => typeof id === 'string' && Number.isInteger(count) && count >= 0).slice(0, 100));
  const history = rawHistory.filter((entry) => entry && typeof entry === 'object' && typeof entry.entityId === 'string' && typeof entry.nodeId === 'string' && Number.isInteger(entry.encounter)).slice(-50);
  const rawKnowledge = raw.knowledge && typeof raw.knowledge === 'object' ? raw.knowledge : {};
  const memories = Array.isArray(rawKnowledge.memories) ? [...new Set(rawKnowledge.memories.filter((id) => typeof id === 'string'))].slice(0, 200) : [];
  const rawMission = raw.mission && typeof raw.mission === 'object' ? raw.mission : {};
  const completed = Array.isArray(rawMission.completed) ? rawMission.completed.filter((id) => typeof id === 'string').slice(0, 100) : [];
  const maxStep = Array.isArray(mission?.steps) ? mission.steps.length : 0;
  const currentStep = Number.isInteger(rawMission.currentStep) ? Math.max(0, Math.min(maxStep, rawMission.currentStep)) : 0;
  const completedMission = rawMission.status === 'completed' || raw.done === true || (maxStep > 0 && currentStep >= maxStep);
  const maxX = currentLocationId === 'outside' ? world.width - 30 : currentLocation.width - 30;
  const minY = currentLocationId === 'outside' ? 90 : 30;
  const maxY = currentLocationId === 'outside' ? world.height - 30 : currentLocation.height - 30;
  return {
    schema: GAME_SCHEMA_VERSION,
    playerId: PLAYER_ENTITY_ID,
    currentLocationId,
    x: Number.isFinite(x) ? Math.max(30, Math.min(maxX, x)) : (currentLocation.spawn?.x ?? fallback.x),
    y: Number.isFinite(y) ? Math.max(minY, Math.min(maxY, y)) : (currentLocation.spawn?.y ?? fallback.y),
    done: completedMission,
    seen: raw.seen === true,
    missionId: mission.id,
    mission: { id: mission.id, status: completedMission ? 'completed' : 'active', currentStep, completed },
    dialogue: { encounters, history },
    knowledge: { memories },
  };
}

export const GAME_SCHEMA_VERSION = 3;
export const PLAYER_ENTITY_ID = 'player';

export function createGameState(world, mission) {
  return {
    schema: GAME_SCHEMA_VERSION,
    playerId: PLAYER_ENTITY_ID,
    x: world.spawn.x,
    y: world.spawn.y,
    done: false,
    seen: false,
    missionId: mission.id,
    mission: { id: mission.id, status: 'active', currentStep: 0, completed: [] },
    dialogue: { encounters: {}, history: [] },
  };
}

export function sanitizeGameState(raw, world, mission) {
  const fallback = createGameState(world, mission);
  if (!raw || typeof raw !== 'object') return fallback;
  const x = Number(raw.x);
  const y = Number(raw.y);
  const rawDialogue = raw.dialogue && typeof raw.dialogue === 'object' ? raw.dialogue : {};
  const rawEncounters = rawDialogue.encounters && typeof rawDialogue.encounters === 'object' ? rawDialogue.encounters : {};
  const rawHistory = Array.isArray(rawDialogue.history) ? rawDialogue.history : [];
  const encounters = Object.fromEntries(Object.entries(rawEncounters).filter(([id, count]) => typeof id === 'string' && Number.isInteger(count) && count >= 0).slice(0, 100));
  const history = rawHistory.filter((entry) => entry && typeof entry === 'object' && typeof entry.entityId === 'string' && typeof entry.nodeId === 'string' && Number.isInteger(entry.encounter)).slice(-50);
  const rawMission = raw.mission && typeof raw.mission === 'object' ? raw.mission : {};
  const completed = Array.isArray(rawMission.completed) ? rawMission.completed.filter((id) => typeof id === 'string').slice(0, 100) : [];
  const currentStep = Number.isInteger(rawMission.currentStep) ? Math.max(0, rawMission.currentStep) : 0;
  return {
    schema: GAME_SCHEMA_VERSION,
    playerId: PLAYER_ENTITY_ID,
    x: Number.isFinite(x) ? Math.max(30, Math.min(world.width - 30, x)) : fallback.x,
    y: Number.isFinite(y) ? Math.max(90, Math.min(world.height - 30, y)) : fallback.y,
    done: raw.done === true,
    seen: raw.seen === true,
    missionId: mission.id,
    mission: { id: mission.id, status: rawMission.status === 'completed' || raw.done === true ? 'completed' : 'active', currentStep, completed },
    dialogue: { encounters, history },
  };
}

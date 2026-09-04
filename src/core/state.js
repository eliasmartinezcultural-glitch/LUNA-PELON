export const GAME_SCHEMA_VERSION = 1;
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
  };
}

export function sanitizeGameState(raw, world, mission) {
  const fallback = createGameState(world, mission);
  if (!raw || typeof raw !== 'object') return fallback;
  const x = Number(raw.x);
  const y = Number(raw.y);
  return {
    schema: GAME_SCHEMA_VERSION,
    playerId: PLAYER_ENTITY_ID,
    x: Number.isFinite(x) ? Math.max(30, Math.min(world.width - 30, x)) : fallback.x,
    y: Number.isFinite(y) ? Math.max(90, Math.min(world.height - 30, y)) : fallback.y,
    done: raw.done === true,
    seen: raw.seen === true,
    missionId: mission.id,
  };
}

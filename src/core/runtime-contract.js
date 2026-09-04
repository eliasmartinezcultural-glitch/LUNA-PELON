export const RUNTIME_CONTRACT_VERSION = 'v0.1.2';

export function createInitialState(world, mission) {
  return Object.freeze({
    schema: 1,
    x: world.spawn.x,
    y: world.spawn.y,
    done: false,
    seen: false,
    missionId: mission.id,
  });
}

export function sanitizeState(raw, world, mission) {
  const fallback = createInitialState(world, mission);
  if (!raw || typeof raw !== 'object') return fallback;

  const x = Number(raw.x);
  const y = Number(raw.y);
  return {
    schema: 1,
    x: Number.isFinite(x) ? Math.max(0, Math.min(world.width, x)) : fallback.x,
    y: Number.isFinite(y) ? Math.max(0, Math.min(world.height, y)) : fallback.y,
    done: raw.done === true,
    seen: raw.seen === true,
    missionId: mission.id,
  };
}

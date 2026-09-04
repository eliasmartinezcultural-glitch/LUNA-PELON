export const SAVE_KEY = 'luna-pelon-state-v1';

export function loadState(storage, world, mission, sanitize) {
  try {
    const raw = storage.getItem(SAVE_KEY);
    return raw ? sanitize(JSON.parse(raw), world, mission) : null;
  } catch {
    return null;
  }
}

export function saveState(storage, state, world, mission, sanitize) {
  const safe = sanitize(state, world, mission);
  storage.setItem(SAVE_KEY, JSON.stringify(safe));
  return safe;
}

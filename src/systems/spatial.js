export function distanceSquared(a, b) {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return dx * dx + dy * dy;
}

export function findNearby(origin, entities, radius) {
  const limit = radius * radius;
  return entities.filter((entity) => distanceSquared(origin, entity) <= limit);
}

export function findById(entities, id) {
  return entities.find((entity) => entity.id === id) ?? null;
}

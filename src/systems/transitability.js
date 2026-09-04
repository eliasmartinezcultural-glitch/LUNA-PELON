function contains(rect, x, y) {
  return x >= rect.x && x <= rect.x + rect.width && y >= rect.y && y <= rect.y + rect.height;
}

export function getSurfaceAt(worldModel, x, y) {
  if (contains(worldModel.bridge, x, y)) return 'bridge';
  if (contains(worldModel.river, x, y)) return 'river';
  const road = worldModel.roads.find((item) => contains(item, x, y));
  if (road) return road.kind ?? 'road';
  const farm = worldModel.farms.find((item) => contains(item, x, y));
  if (farm) return 'farm';
  return 'ground';
}

export function getMovementModifier(surface) {
  if (surface === 'road' || surface === 'bridge') return 1.08;
  if (surface === 'farm') return 0.92;
  if (surface === 'river') return 0;
  return 1;
}

export function isTraversable(worldModel, x, y) {
  return getSurfaceAt(worldModel, x, y) !== 'river';
}

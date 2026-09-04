export function createWorldModel(world) {
  const bounds = { x: 0, y: 0, width: world.width, height: world.height };
  const zones = Array.isArray(world.zones) ? world.zones : [];
  const obstacles = Array.isArray(world.obstacles) ? world.obstacles : [];
  const points = world.points && typeof world.points === 'object' ? world.points : {};

  return Object.freeze({
    bounds,
    zones: Object.freeze([...zones]),
    obstacles: Object.freeze([...obstacles]),
    points: Object.freeze({ ...points }),
  });
}

export function getZoneAt(worldModel, x, y) {
  return worldModel.zones.find((zone) =>
    x >= zone.x && x <= zone.x + zone.width &&
    y >= zone.y && y <= zone.y + zone.height
  ) ?? null;
}

function freezeList(items) {
  return Object.freeze(items.map((item) => Object.freeze({ ...item })));
}

export function createWorldModel(world) {
  const bounds = { x: 0, y: 0, width: world.width, height: world.height };
  const zones = Array.isArray(world.zones) ? world.zones : [];
  const roads = Array.isArray(world.roads) ? world.roads : [];
  const farms = Array.isArray(world.farms) ? world.farms : [];
  const buildings = Array.isArray(world.buildings) ? world.buildings : [];
  const obstacles = Array.isArray(world.obstacles) ? world.obstacles : [];
  const points = world.points && typeof world.points === 'object' ? world.points : {};
  const river = world.river && Number.isFinite(world.river.x) ? {
    x: world.river.x,
    y: 0,
    width: world.river.width,
    height: world.height,
  } : null;
  const bridge = world.bridge && Number.isFinite(world.bridge.x) ? {
    x: world.bridge.x,
    y: world.bridge.y,
    width: world.bridge.width ?? world.bridge.w ?? 0,
    height: world.bridge.height ?? world.bridge.h ?? 0,
  } : null;

  return Object.freeze({
    bounds: Object.freeze(bounds),
    zones: freezeList(zones),
    roads: freezeList(roads),
    farms: freezeList(farms),
    buildings: freezeList(buildings),
    obstacles: freezeList(obstacles),
    points: Object.freeze({ ...points }),
    river: river ? Object.freeze(river) : null,
    bridge: bridge ? Object.freeze(bridge) : null,
  });
}

export function getZoneAt(worldModel, x, y) {
  return worldModel.zones.find((zone) =>
    x >= zone.x && x <= zone.x + zone.width &&
    y >= zone.y && y <= zone.y + zone.height
  ) ?? null;
}

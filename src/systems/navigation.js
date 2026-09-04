const DIRECTIONS = [
  { x: 1, y: 0 },
  { x: -1, y: 0 },
  { x: 0, y: 1 },
  { x: 0, y: -1 },
];

const key = (x, y) => `${x}:${y}`;

export function createNavigationSystem({ worldModel, isBlocked, cellSize = 48, maxIterations = 4000 }) {
  const canEnter = (x, y, radius = 14) => {
    if (x < radius || y < radius || x > worldModel.bounds.width - radius || y > worldModel.bounds.height - radius) return false;
    return !isBlocked(x, y, radius);
  };

  function findPath(start, target, radius = 14) {
    if (!start || !target) return [];
    const sx = Math.round(start.x / cellSize);
    const sy = Math.round(start.y / cellSize);
    const tx = Math.round(target.x / cellSize);
    const ty = Math.round(target.y / cellSize);
    const startKey = key(sx, sy);
    const targetKey = key(tx, ty);
    if (startKey === targetKey) return [];

    const queue = [{ x: sx, y: sy }];
    const previous = new Map([[startKey, null]]);
    let iterations = 0;

    while (queue.length && iterations < maxIterations) {
      iterations += 1;
      const current = queue.shift();
      if (key(current.x, current.y) === targetKey) break;
      for (const direction of DIRECTIONS) {
        const nx = current.x + direction.x;
        const ny = current.y + direction.y;
        const nextKey = key(nx, ny);
        if (previous.has(nextKey)) continue;
        const worldX = nx * cellSize;
        const worldY = ny * cellSize;
        if (!canEnter(worldX, worldY, radius)) continue;
        previous.set(nextKey, key(current.x, current.y));
        queue.push({ x: nx, y: ny });
      }
    }

    if (!previous.has(targetKey)) return [];
    const path = [];
    let cursor = targetKey;
    while (cursor && cursor !== startKey) {
      const [x, y] = cursor.split(':').map(Number);
      path.push({ x: x * cellSize, y: y * cellSize });
      cursor = previous.get(cursor);
    }
    return path.reverse();
  }

  return { findPath, cellSize };
}

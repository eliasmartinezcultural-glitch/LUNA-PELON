function overlapsCircleRect(x, y, radius, rect) {
  const nearestX = Math.max(rect.x, Math.min(x, rect.x + rect.width));
  const nearestY = Math.max(rect.y, Math.min(y, rect.y + rect.height));
  const dx = x - nearestX;
  const dy = y - nearestY;
  return dx * dx + dy * dy < radius * radius;
}

function overlapsCircleEntity(x, y, radius, entity) {
  if (entity.collidable === false) return false;
  const entityRadius = Number.isFinite(entity.radius) ? entity.radius : 14;
  const dx = x - entity.x;
  const dy = y - entity.y;
  const distance = radius + entityRadius;
  return dx * dx + dy * dy < distance * distance;
}

export function canOccupy(worldModel, x, y, radius = 14, dynamicEntities = []) {
  const { bounds, obstacles } = worldModel;
  if (x - radius < bounds.x || x + radius > bounds.x + bounds.width) return false;
  if (y - radius < bounds.y || y + radius > bounds.y + bounds.height) return false;
  if (obstacles.some((rect) => overlapsCircleRect(x, y, radius, rect))) return false;
  return !dynamicEntities.some((entity) => overlapsCircleEntity(x, y, radius, entity));
}

export function moveWithCollision(state, input, worldModel, dt, speed = 230, radius = 14, dynamicEntities = []) {
  const dx = input.x * speed * dt;
  const dy = input.y * speed * dt;
  if (dx === 0 && dy === 0) return false;

  let moved = false;
  if (canOccupy(worldModel, state.x + dx, state.y, radius, dynamicEntities)) {
    state.x += dx;
    moved = true;
  }
  if (canOccupy(worldModel, state.x, state.y + dy, radius, dynamicEntities)) {
    state.y += dy;
    moved = true;
  }
  return moved;
}

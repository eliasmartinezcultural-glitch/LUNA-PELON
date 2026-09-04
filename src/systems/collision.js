function overlapsCircleRect(x, y, radius, rect) {
  const nearestX = Math.max(rect.x, Math.min(x, rect.x + rect.width));
  const nearestY = Math.max(rect.y, Math.min(y, rect.y + rect.height));
  const dx = x - nearestX;
  const dy = y - nearestY;
  return dx * dx + dy * dy < radius * radius;
}

export function canOccupy(worldModel, x, y, radius = 14) {
  const { bounds, obstacles } = worldModel;
  if (x - radius < bounds.x || x + radius > bounds.x + bounds.width) return false;
  if (y - radius < bounds.y || y + radius > bounds.y + bounds.height) return false;
  return !obstacles.some((rect) => overlapsCircleRect(x, y, radius, rect));
}

export function moveWithCollision(state, input, worldModel, dt, speed = 230, radius = 14) {
  const dx = input.x * speed * dt;
  const dy = input.y * speed * dt;
  if (dx === 0 && dy === 0) return false;

  let moved = false;
  if (canOccupy(worldModel, state.x + dx, state.y, radius)) {
    state.x += dx;
    moved = true;
  }
  if (canOccupy(worldModel, state.x, state.y + dy, radius)) {
    state.y += dy;
    moved = true;
  }
  return moved;
}

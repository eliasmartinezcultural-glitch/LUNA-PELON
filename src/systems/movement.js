export function updateMovement(state, input, world, dt, speed = 230) {
  const direction = input.getVector();
  if (!direction.x && !direction.y) return false;
  state.x = Math.max(30, Math.min(world.width - 30, state.x + direction.x * speed * dt));
  state.y = Math.max(90, Math.min(world.height - 30, state.y + direction.y * speed * dt));
  return true;
}

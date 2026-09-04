export function createLocationSystem({ state, locations, doors, events, save, show }) {
  const getLocation = (id) => locations.find((location) => location.id === id) ?? null;
  const getDoors = () => doors.filter((door) => door.fromLocation === state.currentLocationId);

  function transition(door) {
    if (!door || door.fromLocation !== state.currentLocationId) return false;
    const destination = getLocation(door.toLocation);
    if (!destination) return false;
    if (!door.spawn || !Number.isFinite(door.spawn.x) || !Number.isFinite(door.spawn.y)) return false;

    const fromLocationId = state.currentLocationId;
    state.currentLocationId = destination.id;
    state.x = door.spawn.x;
    state.y = door.spawn.y;
    events.emit('location:changed', {
      doorId: door.id,
      fromLocationId,
      toLocationId: destination.id,
      x: state.x,
      y: state.y,
    });
    show?.(destination.type === 'interior' ? `Entraste a ${destination.name}.` : `Saliste a ${destination.name}.`);
    save?.();
    return true;
  }

  function interactAt(x, y) {
    const door = getDoors().find((candidate) => Math.hypot(candidate.position.x - x, candidate.position.y - y) <= candidate.interactionRadius);
    return transition(door);
  }

  return {
    current: () => getLocation(state.currentLocationId),
    doors: getDoors,
    transition,
    interactAt,
  };
}

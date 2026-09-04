const STATES = new Set(['idle', 'walking', 'working', 'resting', 'talking']);

export function createNpcSystem({ registry, navigation, moveEntity, getTimeMinutes = () => 12 * 60 }) {
  const runtime = new Map();

  function ensure(npc) {
    if (!runtime.has(npc.id)) {
      runtime.set(npc.id, { state: 'idle', path: [], pathIndex: 0, targetId: null, nextDecisionAt: 0 });
    }
    return runtime.get(npc.id);
  }

  function activeSchedule(npc, minutes) {
    const schedule = Array.isArray(npc.schedule) ? npc.schedule : [];
    if (!schedule.length) return null;
    const ordered = [...schedule].sort((a, b) => a.start - b.start);
    let selected = ordered[0];
    for (const entry of ordered) if (entry.start <= minutes) selected = entry;
    return selected;
  }

  function chooseTarget(npc, runtimeState, minutes) {
    const routine = activeSchedule(npc, minutes);
    if (!routine?.target) {
      runtimeState.state = 'idle';
      runtimeState.path = [];
      runtimeState.targetId = null;
      return;
    }
    const target = registry.get(routine.target);
    if (!target) return;
    runtimeState.state = STATES.has(routine.state) ? routine.state : 'walking';
    runtimeState.path = navigation.findPath(npc, target, npc.radius ?? 14);
    runtimeState.pathIndex = 0;
    runtimeState.targetId = target.id;
    runtimeState.nextDecisionAt = minutes + 5;
  }

  function update(dt) {
    const minutes = getTimeMinutes();
    for (const npc of registry.all().filter((entity) => entity.type === 'npc')) {
      const npcState = ensure(npc);
      if (minutes >= npcState.nextDecisionAt || !npcState.path.length) chooseTarget(npc, npcState, minutes);
      const waypoint = npcState.path[npcState.pathIndex];
      if (!waypoint) continue;
      const dx = waypoint.x - npc.x;
      const dy = waypoint.y - npc.y;
      const distance = Math.hypot(dx, dy);
      if (distance < 8) {
        npcState.pathIndex += 1;
        continue;
      }
      const speed = npc.speed ?? 70;
      moveEntity(npc, { x: dx / distance, y: dy / distance }, dt, speed);
    }
  }

  function getRuntime(id) {
    return runtime.get(id) ?? null;
  }

  return { update, getRuntime };
}

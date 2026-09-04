export function createInteractionSystem({ state, npcs, discovery, near, show, save, events }) {
  function interact() {
    for (const npc of npcs) {
      if (!near(state, npc)) continue;
      state.done = true;
      show(`${npc.name}: ${npc.text}`);
      events.emit('mission:completed', { missionId: state.missionId, actorId: npc.id });
      save();
      return true;
    }
    if (near(state, discovery, 90)) {
      state.seen = true;
      show(`${discovery.title}\n${discovery.text}`);
      events.emit('history:discovered', { id: discovery.id ?? 'first-memory' });
      save();
      return true;
    }
    return false;
  }
  return { interact };
}

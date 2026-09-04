export function createInteractionSystem({ state, registry, near, show, save, events }) {
  function interact() {
    const player = { x: state.x, y: state.y };
    const targets = registry.all()
      .filter((entity) => entity.id !== state.playerId && entity.interactable !== false)
      .filter((entity) => near(player, entity));

    const npc = targets.find((entity) => entity.type === 'npc');
    if (npc) {
      state.done = true;
      show(`${npc.name}: ${npc.text}`);
      events.emit('entity:interacted', { entityId: npc.id, type: npc.type });
      events.emit('mission:completed', { missionId: state.missionId, actorId: npc.id });
      save();
      return true;
    }

    const discovery = targets.find((entity) => entity.type === 'discovery');
    if (discovery) {
      state.seen = true;
      show(`${discovery.title}\n${discovery.text}`);
      events.emit('entity:interacted', { entityId: discovery.id, type: discovery.type });
      events.emit('history:discovered', { id: discovery.id });
      save();
      return true;
    }

    return false;
  }

  return { interact };
}

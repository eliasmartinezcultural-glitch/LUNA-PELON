export function createInteractionSystem({ state, registry, near, show, save, events, dialogue, locationSystem }) {
  function interact() {
    if (locationSystem?.interactAt(state.x, state.y)) return true;

    const player = { x: state.x, y: state.y };
    const targets = registry.all()
      .filter((entity) => entity.id !== state.playerId && entity.interactable !== false)
      .filter((entity) => near(player, entity));

    const npc = targets.find((entity) => entity.type === 'npc');
    if (npc) {
      events.emit('entity:interacted', { entityId: npc.id, type: npc.type });
      dialogue.start(npc);
      return true;
    }

    const discovery = targets.find((entity) => entity.type === 'discovery');
    if (discovery) {
      state.seen = true;
      state.knowledge = state.knowledge ?? { memories: [] };
      state.knowledge.memories = Array.isArray(state.knowledge.memories) ? state.knowledge.memories : [];
      if (!state.knowledge.memories.includes(discovery.id)) state.knowledge.memories.push(discovery.id);
      show(`${discovery.title}\n${discovery.text}`);
      events.emit('entity:interacted', { entityId: discovery.id, type: discovery.type });
      events.emit('history:discovered', { entityId: discovery.id });
      save();
      return true;
    }

    return false;
  }

  return { interact };
}

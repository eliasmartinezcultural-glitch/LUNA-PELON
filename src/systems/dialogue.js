export function createDialogueSystem({ state, events, save, show }) {
  const active = new Map();

  function start(entity) {
    const nodes = Array.isArray(entity.dialogue) ? entity.dialogue : [];
    if (!nodes.length) {
      show(`${entity.name}: ${entity.text ?? 'Hola, Luna.'}`);
      return true;
    }

    const current = active.get(entity.id) ?? 0;
    const node = nodes[current];
    if (!node) {
      active.delete(entity.id);
      show(`${entity.name}: Eso era todo por ahora.`);
      return true;
    }

    active.set(entity.id, current + 1);
    state.dialogue = state.dialogue ?? { encounters: {}, history: [] };
    const encounters = state.dialogue.encounters ?? (state.dialogue.encounters = {});
    const previous = encounters[entity.id] ?? 0;
    encounters[entity.id] = previous + 1;
    state.dialogue.history ??= [];
    state.dialogue.history.push({ entityId: entity.id, nodeId: node.id, encounter: previous + 1 });
    if (state.dialogue.history.length > 50) state.dialogue.history.splice(0, state.dialogue.history.length - 50);

    show(`${entity.name}: ${node.text}`);
    events.emit('dialogue:line', { entityId: entity.id, nodeId: node.id, encounter: previous + 1 });
    save();
    return true;
  }

  function reset(entityId) {
    active.delete(entityId);
  }

  function resetAll() {
    active.clear();
  }

  return { start, reset, resetAll };
}

export function createMissionSystem({ state, mission, events, save, show }) {
  const steps = Array.isArray(mission?.steps) ? mission.steps : [];
  const ensure = () => {
    state.mission = state.mission ?? { id: mission.id, status: 'active', currentStep: 0, completed: [] };
    state.mission.id = mission.id;
    state.mission.status = state.mission.status === 'completed' ? 'completed' : 'active';
    state.mission.currentStep = Math.max(0, Math.min(steps.length, Number.isInteger(state.mission.currentStep) ? state.mission.currentStep : 0));
    state.mission.completed = Array.isArray(state.mission.completed) ? state.mission.completed.filter((id) => typeof id === 'string') : [];
    return state.mission;
  };

  function current() {
    const progress = ensure();
    return steps[progress.currentStep] ?? null;
  }

  function completeStep(stepId, payload = {}) {
    const progress = ensure();
    const step = steps[progress.currentStep];
    if (!step || step.id !== stepId || progress.status === 'completed') return false;
    progress.completed.push(step.id);
    progress.currentStep += 1;
    events.emit('mission:step-completed', { missionId: mission.id, stepId, ...payload });
    if (progress.currentStep >= steps.length) {
      progress.status = 'completed';
      state.done = true;
      events.emit('mission:completed', { missionId: mission.id, ...payload });
      show?.(`Misión completada: ${mission.title}`);
    }
    save();
    return true;
  }

  function handle(eventName, payload) {
    const step = current();
    if (!step || step.event !== eventName) return false;
    const matches = !step.entityId || step.entityId === payload?.entityId;
    const nodeMatches = !step.nodeId || step.nodeId === payload?.nodeId;
    return matches && nodeMatches ? completeStep(step.id, payload) : false;
  }

  const subscriptions = [
    ['dialogue:line', (payload) => handle('dialogue:line', payload)],
    ['history:discovered', (payload) => handle('history:discovered', payload)],
    ['entity:interacted', (payload) => handle('entity:interacted', payload)],
  ].map(([name, listener]) => events.on(name, listener));

  ensure();
  return {
    current,
    getProgress: () => ({ ...ensure(), completed: [...ensure().completed] }),
    destroy: () => subscriptions.forEach((unsubscribe) => unsubscribe?.()),
  };
}

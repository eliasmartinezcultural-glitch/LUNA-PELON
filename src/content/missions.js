export const MISSIONS = [
  {
    id: 'territory-01',
    title: 'Escuchar el territorio',
    objective: 'Encontrá a Marta, conversá con ella y explorá la primera memoria.',
    steps: [
      { id: 'meet-marta', event: 'dialogue:line', entityId: 'marta', nodeId: 'welcome', label: 'Hablar con Marta' },
      { id: 'learn-territory', event: 'dialogue:line', entityId: 'marta', nodeId: 'territory', label: 'Escuchar la historia del territorio' },
      { id: 'discover-memory', event: 'history:discovered', entityId: 'first-memory', label: 'Encontrar la primera memoria' },
      { id: 'return-marta', event: 'entity:interacted', entityId: 'marta', label: 'Volver con Marta' },
    ],
  },
];

export function getMissionById(id) {
  return MISSIONS.find((mission) => mission.id === id) ?? null;
}

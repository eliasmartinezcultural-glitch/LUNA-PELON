export const MEMORIES = [
  {
    id: 'first-memory',
    title: 'Primera huella',
    category: 'territorio',
    status: 'interpretive',
    text: 'El primer aprendizaje de Luna: una historia local no vive solamente en fechas. También vive en el territorio, sus caminos, el agua, el trabajo y las personas.',
    sources: [],
    verification: 'Pendiente de investigación histórica y archivo primario.',
  },
];

export function getMemoryById(id) {
  return MEMORIES.find((memory) => memory.id === id) ?? null;
}

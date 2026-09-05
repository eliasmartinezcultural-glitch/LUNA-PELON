export const CAMPAIGN = {
  id: 'villa-pelon-history',
  title: 'Los caminos de Villa Pelón',
  premise: 'Luna recorre el territorio y completa misiones para reconstruir, paso a paso, la historia local desde las primeras huellas hasta la Villa Pelón del presente.',
  playerGoal: 'Completar misiones para aprender la historia de San Patricio del Chañar y su evolución hacia Villa Pelón.',
  historicalPolicy: 'Los hechos históricos definitivos deben incorporarse únicamente después de investigación y revisión de fuentes.',
  chapters: [
    { id: 'territory', title: 'I · El territorio', status: 'active', focus: 'Paisaje, agua, caminos y memoria del lugar.' },
    { id: 'voices', title: 'II · Las voces', status: 'planned', focus: 'Personas, testimonios y memorias que ayudan a interpretar el territorio.' },
    { id: 'transformation', title: 'III · La transformación', status: 'planned', focus: 'Cambios territoriales, sociales y productivos documentados.' },
    { id: 'villa-pelon', title: 'IV · Villa Pelón', status: 'planned', focus: 'La construcción del pueblo y su vida cotidiana.' },
    { id: 'living-memory', title: 'V · Memoria viva', status: 'planned', focus: 'Conectar pasado y presente mediante exploración, misiones y fuentes.' },
  ],
};

export function getCampaignChapter(id) {
  return CAMPAIGN.chapters.find((chapter) => chapter.id === id) ?? null;
}

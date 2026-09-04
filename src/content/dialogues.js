export const DIALOGUES = {
  'marta-welcome': { id: 'welcome', text: 'Hola, Luna. Si querés conocer Villa Pelón, empecemos por algo simple: mirar y escuchar.' },
  'marta-territory': { id: 'territory', text: 'El territorio cuenta historias. El agua, las chacras y los caminos hablan tanto como los documentos.' },
  'marta-task': { id: 'task', text: 'Tu primera tarea es recorrer con atención. Cuando encuentres una memoria, volvé a hablar conmigo.' },
  'tomas-intro': { id: 'intro', text: 'Buenas, Luna. Por acá se aprende caminando.' },
  'tomas-landscape': { id: 'landscape', text: 'El paisaje también guarda memoria: río, chacras y caminos ayudan a entender cómo se construyó una comunidad.' },
  'tomas-question': { id: 'question', text: 'Prestá atención a los lugares y a las personas. Después vas a poder unir las historias.' },
};

export function getDialogueLines(ids = []) {
  return ids.map((id) => DIALOGUES[id]).filter(Boolean);
}

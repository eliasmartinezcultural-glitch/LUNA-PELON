export const CHARACTERS = [
  {
    id: 'marta',
    type: 'npc',
    name: 'Marta',
    x: 760,
    y: 690,
    color: '#9b5b43',
    radius: 14,
    collidable: true,
    interactable: true,
    speed: 62,
    dialogueIds: ['marta-welcome', 'marta-territory', 'marta-task'],
    schedule: [
      { start: 0, target: 'point:martaHome', state: 'resting' },
      { start: 8 * 60, target: 'point:communityCenter', state: 'working' },
      { start: 13 * 60, target: 'point:martaHome', state: 'resting' },
      { start: 17 * 60, target: 'point:communityCenter', state: 'talking' },
      { start: 21 * 60, target: 'point:martaHome', state: 'resting' },
    ],
  },
  {
    id: 'tomas',
    type: 'npc',
    name: 'Tomás',
    x: 1320,
    y: 930,
    color: '#536d4b',
    radius: 14,
    collidable: true,
    interactable: true,
    speed: 68,
    dialogueIds: ['tomas-intro', 'tomas-landscape', 'tomas-question'],
    schedule: [
      { start: 0, target: 'point:martaHome', state: 'resting' },
      { start: 7 * 60, target: 'point:orchardWest', state: 'working' },
      { start: 14 * 60, target: 'point:bridgeWest', state: 'walking' },
      { start: 18 * 60, target: 'point:communityCenter', state: 'talking' },
      { start: 22 * 60, target: 'point:martaHome', state: 'resting' },
    ],
  },
];

export function getCharacterById(id) {
  return CHARACTERS.find((character) => character.id === id) ?? null;
}

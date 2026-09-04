export const LOCATIONS = [
  {
    id: 'outside',
    type: 'exterior',
    name: 'Villa Pelón',
    width: 2400,
    height: 1500,
  },
  {
    id: 'community-center-interior',
    type: 'interior',
    name: 'Centro Comunitario',
    width: 720,
    height: 480,
    background: '#cdbb94',
    spawn: { x: 360, y: 390 },
    exitSpawn: { x: 925, y: 540 },
    obstacles: [
      { id: 'interior-north-wall', x: 0, y: 0, width: 720, height: 24 },
      { id: 'interior-south-wall', x: 0, y: 456, width: 720, height: 24 },
      { id: 'interior-west-wall', x: 0, y: 0, width: 24, height: 480 },
      { id: 'interior-east-wall', x: 696, y: 0, width: 24, height: 480 },
      { id: 'counter', x: 120, y: 120, width: 220, height: 44 },
    ],
  },
];

export const DOORS = [
  {
    id: 'community-center-door',
    label: 'Entrar al Centro Comunitario',
    fromLocation: 'outside',
    toLocation: 'community-center-interior',
    position: { x: 925, y: 540 },
    spawn: { x: 360, y: 390 },
    interactionRadius: 62,
  },
  {
    id: 'community-center-exit',
    label: 'Salir del Centro Comunitario',
    fromLocation: 'community-center-interior',
    toLocation: 'outside',
    position: { x: 360, y: 390 },
    spawn: { x: 925, y: 540 },
    interactionRadius: 62,
  },
];

export function getLocationById(id) {
  return LOCATIONS.find((location) => location.id === id) ?? null;
}

export function getDoorsFromLocation(locationId) {
  return DOORS.filter((door) => door.fromLocation === locationId);
}

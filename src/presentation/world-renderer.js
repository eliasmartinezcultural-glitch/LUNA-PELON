export function createWorldRenderer(ctx, world, entityRegistry, getPlayerState, locations = []) {
  const drawRect = (rect, camX, camY, fill) => {
    ctx.fillStyle = fill;
    ctx.fillRect(rect.x - camX, rect.y - camY, rect.width, rect.height);
  };

  function renderInterior(location, camX, camY, viewportWidth, viewportHeight) {
    ctx.fillStyle = location.background ?? '#cdbb94';
    ctx.fillRect(0, 0, viewportWidth, viewportHeight);
    drawRect({ x: 24, y: 24, width: location.width - 48, height: location.height - 48 }, camX, camY, '#e6d8b8');
    for (const obstacle of location.obstacles ?? []) drawRect(obstacle, camX, camY, '#7a6348');
    drawRect({ x: 270, y: 330, width: 180, height: 80 }, camX, camY, '#9a7650');
    ctx.fillStyle = '#3f3428';
    ctx.font = 'bold 18px system-ui';
    ctx.textAlign = 'center';
    ctx.fillText(location.name, location.width / 2 - camX, 70 - camY);
    ctx.font = '12px system-ui';
    ctx.fillText('Salida', 360 - camX, 430 - camY);
  }

  function renderExterior(camX, camY, viewportWidth, viewportHeight) {
    ctx.fillStyle = '#8fb36f';
    ctx.fillRect(0, 0, viewportWidth, viewportHeight);
    const tile = 48;
    for (let y = 0; y < world.height; y += tile) {
      for (let x = 0; x < world.width; x += tile) {
        const variation = ((x / tile * 17 + y / tile * 31) % 7);
        ctx.fillStyle = variation < 1 ? '#86aa68' : '#91b873';
        ctx.fillRect(x - camX, y - camY, tile + 1, tile + 1);
      }
    }

    drawRect({ x: world.river.x, y: -100, width: world.river.width, height: world.height + 300 }, camX, camY, '#5f9fb2');
    for (let y = 0; y < world.height; y += 32) drawRect({ x: world.river.x + 12, y, width: world.river.width - 24, height: 2 }, camX, camY, '#75b3c1');
    for (const road of world.roads ?? []) drawRect(road, camX, camY, road.kind === 'bridge' ? '#d0ae79' : '#b99a6d');
    for (const farm of world.farms ?? []) {
      drawRect(farm, camX, camY, '#6f8c52');
      for (let x = farm.x + 20; x < farm.x + farm.width; x += 42) drawRect({ x, y: farm.y + 16, width: 3, height: farm.height - 32 }, camX, camY, '#829d60');
    }

    for (const building of world.buildings ?? []) {
      drawRect(building, camX, camY, '#6b4a32');
      ctx.fillStyle = building.roof ?? '#9c5b42';
      ctx.beginPath();
      ctx.moveTo(building.x - camX - 8, building.y - camY);
      ctx.lineTo(building.x - camX + building.width / 2, building.y - camY - 38);
      ctx.lineTo(building.x - camX + building.width + 8, building.y - camY);
      ctx.fill();
      ctx.fillStyle = '#f5eed9';
      ctx.font = '11px system-ui';
      ctx.textAlign = 'center';
      ctx.fillText(building.name ?? building.id, building.x - camX + building.width / 2, building.y - camY + building.height + 18);
    }

    for (const npc of entityRegistry.all().filter((entity) => entity.type === 'npc')) {
      ctx.fillStyle = npc.color ?? '#536d4b';
      ctx.fillRect(npc.x - camX - 13, npc.y - camY - 20, 26, 34);
      ctx.fillStyle = '#d6a074';
      ctx.fillRect(npc.x - camX - 10, npc.y - camY - 35, 20, 18);
      ctx.fillStyle = '#111';
      ctx.font = '12px system-ui';
      ctx.textAlign = 'center';
      ctx.fillText(npc.name, npc.x - camX, npc.y - camY - 44);
    }

    const discovery = entityRegistry.all().find((entity) => entity.type === 'discovery');
    if (discovery) {
      const player = getPlayerState();
      ctx.fillStyle = player.seen ? '#777' : '#e7d39c';
      ctx.fillRect(discovery.x - camX - 12, discovery.y - camY - 10, 24, 20);
      ctx.fillStyle = '#111';
      ctx.font = '10px system-ui';
      ctx.fillText('MEMORIA', discovery.x - camX, discovery.y - camY + 4);
    }
  }

  return function render(camX, camY, viewportWidth, viewportHeight) {
    const player = getPlayerState();
    const location = locations.find((candidate) => candidate.id === player.currentLocationId) ?? locations[0];
    if (location?.type === 'interior') renderInterior(location, camX, camY, viewportWidth, viewportHeight);
    else renderExterior(camX, camY, viewportWidth, viewportHeight);

    ctx.fillStyle = '#28486b';
    ctx.fillRect(player.x - camX - 14, player.y - camY - 22, 28, 38);
    ctx.fillStyle = '#d6a074';
    ctx.fillRect(player.x - camX - 10, player.y - camY - 38, 20, 18);
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 11px system-ui';
    ctx.textAlign = 'center';
    ctx.fillText('LUNA', player.x - camX, player.y - camY - 47);
  };
}

export function createWorldRenderer(ctx, world, entities, discovery, getPlayerState) {
  const drawRect = (rect, camX, camY, fill) => {
    ctx.fillStyle = fill;
    ctx.fillRect(rect.x - camX, rect.y - camY, rect.width, rect.height);
  };

  return function render(camX, camY, viewportWidth, viewportHeight) {
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

    for (const road of world.roads ?? []) drawRect(road, camX, camY, road.kind === 'bridge' ? '#d0ae79' : '#b99a6d');
    for (const farm of world.farms ?? []) drawRect(farm, camX, camY, '#6f8c52');
    for (const building of world.buildings ?? []) {
      drawRect(building, camX, camY, '#6b4a32');
      ctx.fillStyle = building.roof ?? '#9c5b42';
      ctx.beginPath();
      ctx.moveTo(building.x - camX - 8, building.y - camY);
      ctx.lineTo(building.x - camX + building.width / 2, building.y - camY - 38);
      ctx.lineTo(building.x - camX + building.width + 8, building.y - camY);
      ctx.fill();
    }

    for (const npc of entities) {
      ctx.fillStyle = npc.color ?? '#536d4b';
      ctx.fillRect(npc.x - camX - 13, npc.y - camY - 20, 26, 34);
      ctx.fillStyle = '#d6a074';
      ctx.fillRect(npc.x - camX - 10, npc.y - camY - 35, 20, 18);
      ctx.fillStyle = '#111';
      ctx.font = '12px system-ui';
      ctx.textAlign = 'center';
      ctx.fillText(npc.name, npc.x - camX, npc.y - camY - 44);
    }

    const player = getPlayerState();
    ctx.fillStyle = '#28486b';
    ctx.fillRect(player.x - camX - 14, player.y - camY - 22, 28, 38);
    ctx.fillStyle = '#d6a074';
    ctx.fillRect(player.x - camX - 10, player.y - camY - 38, 20, 18);
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 11px system-ui';
    ctx.fillText('LUNA', player.x - camX, player.y - camY - 47);

    ctx.fillStyle = player.seen ? '#777' : '#e7d39c';
    ctx.fillRect(discovery.x - camX - 12, discovery.y - camY - 10, 24, 20);
    ctx.fillStyle = '#111';
    ctx.font = '10px system-ui';
    ctx.fillText('MEMORIA', discovery.x - camX, discovery.y - camY + 4);
  };
}

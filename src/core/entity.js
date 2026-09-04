export function createEntity(definition) {
  if (!definition?.id) throw new Error('Entity requires an id');
  if (!Number.isFinite(definition.x) || !Number.isFinite(definition.y)) {
    throw new Error(`Entity ${definition.id} requires numeric x/y`);
  }
  return {
    id: String(definition.id),
    type: definition.type ?? 'object',
    x: definition.x,
    y: definition.y,
    ...definition,
  };
}

export function createEntityRegistry(definitions = []) {
  const entities = new Map();
  for (const definition of definitions) {
    const entity = createEntity(definition);
    if (entities.has(entity.id)) throw new Error(`Duplicate entity id: ${entity.id}`);
    entities.set(entity.id, entity);
  }
  return {
    get: (id) => entities.get(id) ?? null,
    all: () => [...entities.values()],
    size: () => entities.size,
  };
}

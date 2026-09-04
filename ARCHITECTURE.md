# LUNA PELÓN — ARQUITECTURA OPERATIVA

**Versión:** v0.8.0

La arquitectura soporta un RPG territorial creciente sin reescribir el motor para cada personaje, lugar, misión u objeto.

```text
src/
├── core/       # estado, eventos, mundo, entidades, engine
├── systems/    # input, colisión, tránsito, interacción, navegación, NPC, tiempo, diálogo, misiones, persistencia
├── presentation/ # renderer
├── data.js     # contenido declarativo
└── main.js     # composición y ciclo

tests/          # contratos ejecutables
```

## v0.8.0 — Misiones + progresión por eventos
Las misiones pasan a ser un sistema independiente. Una misión declara pasos, eventos que los completan y filtros opcionales por entidad o nodo narrativo.

El flujo queda desacoplado:

`contenido → evento → misión → progreso persistente → HUD`

El diálogo ya no decide si una misión termina. Emite hechos narrativos; el sistema de misiones determina si ese hecho corresponde al paso activo. Esto evita que personajes concretos queden codificados dentro del engine.

El progreso persistente conserva estado activo/completado, índice del paso y lista acotada de pasos realizados. Los guardados antiguos se aceptan mediante saneamiento y reciben la estructura nueva sin depender de código narrativo específico.

## Regla de expansión
Para agregar personajes, conversaciones, misiones o futuras actividades se priorizan datos y contratos. El engine no debe necesitar un `if` nuevo por cada contenido.

## Capas previstas
1. Platform: navegador, pantalla, teclado/táctil, audio.
2. Presentation: renderer, cámara, HUD, menús, animaciones y feedback.
3. Gameplay: movimiento, colisión, tránsito, interacción, navegación, NPC, tiempo, diálogo, misiones, inventario, economía y progresión.
4. Core: estado, entidades, eventos, reglas y ciclo de vida.
5. Content/data: mundo, personajes, objetos, misiones, diálogos e historia verificable.
6. Persistence: guardados, migraciones y recuperación.
7. Validation/tooling: pruebas, CI y controles de regresión.

## Regla de dependencia
`platform/presentation → systems → core → data contracts`

El renderer no gobierna el estado. La narrativa no queda incrustada en movimiento. Las misiones reaccionan a eventos y no conocen detalles de presentación.

## Refactor
Conectar → validar → probar → documentar → retirar duplicado.

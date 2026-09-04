# LUNA PELÓN — ARQUITECTURA OPERATIVA

**Versión:** v0.7.0

La arquitectura soporta un RPG territorial creciente sin reescribir el motor para cada personaje, lugar o misión.

```text
src/
├── core/       # estado, eventos, mundo, entidades, engine
├── systems/    # input, colisión, tránsito, interacción, navegación, NPC, tiempo, diálogo, persistencia
├── presentation/ # renderer
├── data.js     # contenido declarativo
└── main.js     # composición y ciclo

tests/          # contratos ejecutables
```

## v0.7.0 — Diálogo + memoria narrativa
El diálogo pasa a ser un sistema independiente. Cada NPC puede declarar una secuencia de líneas mediante datos, mientras el sistema controla el avance de la conversación y emite eventos de gameplay.

La partida conserva una memoria narrativa acotada: cantidad de encuentros por entidad e historial reciente de líneas vistas. El estado persistido se sanea antes de entrar al runtime y queda limitado para evitar crecimiento indefinido.

La conversación puede producir consecuencias de gameplay sin que el renderer, la navegación o el NPC tengan que conocer reglas narrativas específicas.

## Regla de expansión
Para agregar personajes, conversaciones o misiones se priorizan datos y contratos. El engine no debe necesitar un `if` nuevo por cada personaje.

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

El renderer no gobierna el estado. La narrativa no queda incrustada en movimiento. Los sistemas ejecutan reglas y los datos describen contenido.

## Refactor
Conectar → validar → probar → documentar → retirar duplicado.

# LUNA PELÓN

RPG pixel-art educativo, construido desde cero para navegador y preparado para crecer por capas.

## Versión actual
**v0.5.0 — Living Entities + Transitability**

## Qué está construido
La estructura inicial concentraba demasiada responsabilidad en `main.js`. Se separaron estado, eventos, motor, entrada, colisión, transitabilidad, consultas espaciales, interacción, persistencia, mundo, entidades y presentación.

### Estructura activa
- `src/core/state.js` — estado, saneamiento e identidad estable de Luna.
- `src/core/event-bus.js` — comunicación desacoplada por eventos.
- `src/core/engine.js` — orquestación del runtime.
- `src/core/world.js` — modelo lógico del territorio y sus superficies.
- `src/core/entity.js` — registro, identidad y posición de entidades.
- `src/systems/input.js` — teclado y controles táctiles como acciones comunes.
- `src/systems/collision.js` — ocupación estática y dinámica.
- `src/systems/transitability.js` — terreno, caminos, chacras, río, puente y modificadores de movimiento.
- `src/systems/spatial.js` — consultas por proximidad e identidad.
- `src/systems/interaction.js` — interacción basada en entidades y eventos.
- `src/systems/persistence.js` — carga y guardado seguro.
- `src/presentation/world-renderer.js` — presentación del mundo a partir de datos.
- `src/main.js` — composición y ciclo principal.
- `tests/core-contract.test.mjs` — pruebas ejecutables de contratos críticos.

## v0.5.0
Luna, los NPCs y los puntos interactivos comparten ahora un registro de entidades. Esto prepara el juego para incorporar objetos, puertas, comerciantes, animales y otros actores sin crear una arquitectura distinta para cada categoría.

El mundo también tiene una capa semántica de transitabilidad. Una superficie puede ser camino, puente, chacra, terreno o río, y esa clasificación puede influir en las reglas de movimiento independientemente de cómo se dibuje.

## Próxima etapa
La siguiente capa será navegación y comportamiento básico de NPCs: destinos, rutinas, estados de actividad y movimiento autónomo, manteniendo el mismo registro de entidades y el mismo sistema de eventos.

## Comprobación local
- `npm test` — ejecuta las pruebas del núcleo.
- `npm run check` — valida estructura, sintaxis, contratos, versiones y ejecuta las pruebas.

## Regla para este proyecto
No se presupone experiencia previa. Cada nueva capa tendrá propósito, dueño, entradas/salidas, conexiones explícitas, validación y criterio de terminación.

## Desarrollo seguro
- GitHub es la fuente de verdad del código.
- `main` se integra mediante cambios aislados y revisables.
- Cada versión estable debe conservar rollback.
- No se hacen limpiezas destructivas del repositorio.
- Los duplicados se retiran sólo después de conectar y validar su reemplazo.
- El contenido histórico definitivo se incorpora sólo después de investigación y revisión de fuentes.

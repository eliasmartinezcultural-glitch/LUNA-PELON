# LUNA PELÓN

RPG pixel-art educativo, construido desde cero para navegador y preparado para crecer por capas.

## Versión actual
**v0.8.0 — Misiones + progresión por eventos**

## Qué está construido
La estructura separa estado, eventos, motor, entrada, colisión, transitabilidad, navegación, comportamiento de NPCs, reloj, diálogo, misiones, consultas espaciales, interacción, persistencia, mundo, entidades y presentación.

### Estructura activa
- `src/core/state.js` — estado, saneamiento, identidad estable, memoria narrativa y progreso.
- `src/core/event-bus.js` — comunicación desacoplada por eventos.
- `src/core/engine.js` — orquestación del runtime.
- `src/core/world.js` — modelo lógico del territorio y superficies.
- `src/core/entity.js` — registro, identidad y posición.
- `src/systems/input.js` — teclado y controles táctiles.
- `src/systems/collision.js` — ocupación estática y dinámica.
- `src/systems/transitability.js` — reglas de terreno y velocidad.
- `src/systems/navigation.js` — rutas deterministas.
- `src/systems/npc.js` — rutinas y movimiento autónomo.
- `src/systems/time.js` — reloj independiente del renderizado.
- `src/systems/dialogue.js` — conversaciones declarativas y eventos narrativos.
- `src/systems/mission.js` — objetivos, pasos, filtros, progreso y finalización.
- `src/systems/interaction.js` — interacción basada en entidades.
- `src/systems/persistence.js` — guardado seguro y saneado.
- `src/presentation/world-renderer.js` — presentación desde datos.
- `src/main.js` — composición, ciclo y HUD de objetivo.
- `tests/core-contract.test.mjs` — contratos ejecutables.

## v0.8.0
Las misiones son declarativas: cada una define pasos y eventos capaces de completarlos. El diálogo emite hechos; la misión decide si ese hecho corresponde al objetivo activo. El progreso queda guardado y el HUD muestra dinámicamente el siguiente objetivo.

La misión inicial de Luna recorre cuatro estados: conocer a Marta → escuchar su explicación → encontrar la primera memoria → regresar con Marta.

## Comprobación local
- `npm test` — ejecuta las pruebas del núcleo.
- `npm run check` — valida estructura, sintaxis, contratos, versiones y pruebas.

## Regla para este proyecto
No se presupone experiencia previa. Cada capa tiene propósito, dueño, entradas/salidas, conexiones explícitas, validación y criterio de terminación.

## Desarrollo seguro
GitHub es la fuente de verdad; `main` se integra mediante cambios aislados y revisables; cada versión estable conserva rollback; no se hacen limpiezas destructivas; los duplicados se retiran después de conectar y validar su reemplazo.

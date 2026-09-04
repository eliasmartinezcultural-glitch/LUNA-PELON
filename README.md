# LUNA PELÓN

RPG pixel-art educativo, construido desde cero para navegador y preparado para crecer por capas.

## Versión actual
**v0.7.0 — Diálogo + memoria narrativa**

## Qué está construido
La estructura separa estado, eventos, motor, entrada, colisión, transitabilidad, navegación, comportamiento de NPCs, reloj, diálogo, consultas espaciales, interacción, persistencia, mundo, entidades y presentación.

### Estructura activa
- `src/core/state.js` — estado, saneamiento, identidad estable y memoria narrativa.
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
- `src/systems/dialogue.js` — conversaciones declarativas y consecuencias.
- `src/systems/interaction.js` — interacción basada en entidades.
- `src/systems/persistence.js` — guardado seguro y saneado.
- `src/presentation/world-renderer.js` — presentación desde datos.
- `src/main.js` — composición y ciclo principal.
- `tests/core-contract.test.mjs` — contratos ejecutables.

## v0.7.0
Luna puede iniciar conversaciones con NPCs que tienen líneas declaradas en datos. Las conversaciones avanzan por interacción, registran encuentros e historial reciente y pueden emitir consecuencias de misión sin acoplar narrativa al motor de movimiento.

## Próxima etapa
v0.8: misiones como sistema independiente, objetivos, estados y consecuencias persistentes, reutilizando eventos, diálogo, entidades y memoria.

## Comprobación local
- `npm test` — ejecuta las pruebas del núcleo.
- `npm run check` — valida estructura, sintaxis, contratos, versiones y pruebas.

## Regla para este proyecto
No se presupone experiencia previa. Cada capa tiene propósito, dueño, entradas/salidas, conexiones explícitas, validación y criterio de terminación.

## Desarrollo seguro
GitHub es la fuente de verdad; `main` se integra mediante cambios aislados y revisables; cada versión estable conserva rollback; no se hacen limpiezas destructivas; los duplicados se retiran después de conectar y validar su reemplazo.

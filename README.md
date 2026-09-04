# LUNA PELÓN

RPG pixel-art educativo, construido desde cero para navegador y preparado para crecer por capas.

## Versión actual
**v0.4.0 — World Foundation 2: mundo data-driven**

## Qué está construido
La estructura inicial concentraba demasiada responsabilidad en `main.js`. Se separaron estado, eventos, motor, entrada, colisión, consultas espaciales, interacción, persistencia, mundo, entidades y presentación.

### Estructura activa
- `src/core/state.js` — estado y saneamiento.
- `src/core/event-bus.js` — comunicación desacoplada por eventos.
- `src/core/engine.js` — orquestación del runtime.
- `src/core/world.js` — modelo lógico del territorio.
- `src/core/entity.js` — contrato e identidad de entidades.
- `src/systems/input.js` — teclado y controles táctiles como acciones comunes.
- `src/systems/collision.js` — ocupación y movimiento seguro.
- `src/systems/spatial.js` — consultas por proximidad e identidad.
- `src/systems/interaction.js` — interacción y eventos de gameplay.
- `src/systems/persistence.js` — carga y guardado seguro.
- `src/presentation/world-renderer.js` — presentación del mundo a partir de datos.
- `src/main.js` — composición y ciclo principal.
- `tests/core-contract.test.mjs` — pruebas ejecutables de contratos críticos.

## World Foundation 2
El territorio ya puede describirse desde `src/data.js` mediante zonas, caminos, puente, chacras, edificios, obstáculos y puntos de referencia. El renderer consume esos datos en lugar de contener la geometría específica del mapa.

Esto establece una regla clave: **para ampliar el mundo, primero intentamos agregar/modificar datos; no reescribir el motor.**

## Próxima etapa
La siguiente capa será el framework de entidades vivas y transitabilidad: jugador, NPCs, objetos y puntos interactivos deberán tener identidad, posición, reglas de ocupación y comportamiento independiente. Después construiremos navegación y rutinas de NPC.

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

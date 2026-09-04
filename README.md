# LUNA PELÓN

RPG pixel-art educativo, construido desde cero para navegador y preparado para crecer por capas.

## Versión actual
**v0.3.1 — Hardening del núcleo + preparación del mundo**

## Qué está construido
La estructura inicial concentraba demasiada responsabilidad en `main.js`. Se separaron estado, eventos, motor, entrada, colisión, consultas espaciales, interacción, persistencia, mundo y entidades.

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
- `src/main.js` — arranque y presentación temporal.
- `tests/core-contract.test.mjs` — pruebas ejecutables de contratos críticos.

## Estado de la arquitectura
El núcleo ya está preparado para crecer hacia un RPG completo sin convertir el juego en un único archivo gigante. La siguiente gran etapa es construir el mundo como datos: territorio, caminos, río, puente, zonas, edificios, interiores y puntos de interés, manteniendo la presentación separada de las reglas.

## Dirección del proyecto
La arquitectura queda preparada para incorporar progresivamente NPCs y rutinas, diálogo, misiones, inventario, objetos, economía, actividades, progresión, tiempo, clima, audio, animaciones, historia y accesibilidad.

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

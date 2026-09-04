# LUNA PELÓN

RPG pixel-art educativo, construido desde cero para navegador y preparado para crecer por capas.

## Versión actual
**v0.2.0 — Fundación Modular RPG**

## Qué se construyó
La primera versión tenía demasiada responsabilidad concentrada en `main.js`. En esta etapa se separaron el estado, el motor, la entrada, el movimiento, la interacción y la persistencia.

### Estructura activa
- `src/core/state.js` — estado y saneamiento del estado.
- `src/core/event-bus.js` — comunicación desacoplada por eventos.
- `src/core/engine.js` — orquestación del runtime.
- `src/systems/input.js` — teclado y controles táctiles como acciones comunes.
- `src/systems/movement.js` — regla de movimiento.
- `src/systems/interaction.js` — interacción y eventos de gameplay.
- `src/systems/persistence.js` — carga y guardado seguro.
- `src/main.js` — arranque y presentación temporal.

## Dirección del proyecto
La arquitectura queda preparada para incorporar progresivamente un RPG completo: mundo explorable, interiores, colisiones, NPCs y rutinas, diálogo, misiones, inventario, objetos, economía, actividades, progresión, tiempo, clima, audio, animaciones, historia y accesibilidad.

## Regla para este proyecto
No se presupone experiencia previa. Cada nueva capa tendrá un propósito claro, un dueño, conexiones explícitas, validación y una forma de comprobar que funciona.

## Desarrollo seguro
- GitHub es la fuente de verdad del código.
- `main` se integra mediante cambios aislados y revisables.
- Cada versión estable tiene rollback.
- No se hacen limpiezas destructivas del repositorio.
- El contenido histórico definitivo se incorpora sólo después de investigación y revisión de fuentes.

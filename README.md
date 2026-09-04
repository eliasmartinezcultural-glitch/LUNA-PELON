# LUNA PELÓN

RPG pixel-art educativo, construido desde cero para navegador y preparado para crecer por capas.

## Versión actual
**v0.6.0 — Living World + NPC Navigation**

## Qué está construido
La estructura separa estado, eventos, motor, entrada, colisión, transitabilidad, navegación, comportamiento de NPCs, reloj, consultas espaciales, interacción, persistencia, mundo, entidades y presentación.

### Estructura activa
- `src/core/state.js` — estado, saneamiento e identidad estable de Luna.
- `src/core/event-bus.js` — comunicación desacoplada por eventos.
- `src/core/engine.js` — orquestación del runtime.
- `src/core/world.js` — modelo lógico del territorio y sus superficies.
- `src/core/entity.js` — registro, identidad y posición de entidades.
- `src/systems/input.js` — teclado y controles táctiles como acciones comunes.
- `src/systems/collision.js` — ocupación estática y dinámica.
- `src/systems/transitability.js` — terreno, caminos, chacras, río, puente y modificadores de movimiento.
- `src/systems/navigation.js` — búsqueda de rutas determinista sobre una cuadrícula.
- `src/systems/npc.js` — rutinas, estados y movimiento autónomo de NPCs.
- `src/systems/time.js` — reloj del mundo independiente del renderizado.
- `src/systems/spatial.js` — consultas por proximidad e identidad.
- `src/systems/interaction.js` — interacción basada en entidades y eventos.
- `src/systems/persistence.js` — carga y guardado seguro.
- `src/presentation/world-renderer.js` — presentación del mundo a partir de datos.
- `src/main.js` — composición y ciclo principal.
- `tests/core-contract.test.mjs` — pruebas ejecutables de contratos críticos.

## v0.6.0
Los NPCs dejan de ser únicamente elementos estáticos: tienen destinos definidos por datos, estados de actividad, velocidad y rutinas horarias. La navegación está aislada del comportamiento y utiliza el mismo modelo de colisión del jugador.

El reloj del mundo permite que el territorio evolucione sin atar la lógica de simulación al renderizado. Los destinos de rutina se representan como entidades de tipo `landmark`, por lo que la arquitectura puede crecer hacia trabajos, viviendas, comercios, puertas, animales y actividades.

## Próxima etapa
v0.7: diálogo como sistema de contenido, memoria/historial de encuentros y primeras consecuencias de misión, sin mezclar narrativa con renderizado ni movimiento.

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

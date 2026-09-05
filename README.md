# LUNA PELÓN

RPG pixel-art educativo, construido desde cero para navegador y preparado para crecer por capas.

## Propósito del juego
Luna no juega para “ganar puntos” sin contexto: **explora, habla, observa, completa misiones y reúne memorias para aprender la historia de San Patricio del Chañar y su evolución narrativa hacia Villa Pelón**. La historia definitiva se incorporará con investigación y fuentes revisadas; el juego no inventará hechos históricos para rellenar contenido.

## Versión actual
**v0.9.0 — Location slice + campaña educativa + misiones + progresión por eventos**

## Qué está construido
La estructura separa estado, eventos, motor, entrada, colisión, transitabilidad, navegación, comportamiento de NPCs, reloj, diálogo, misiones, consultas espaciales, interacción, persistencia, locations, mundo, entidades, campaña y presentación.

### Estructura activa
- `src/core/state.js` — estado, saneamiento, identidad estable, memoria narrativa, conocimiento descubierto y progreso.
- `src/core/event-bus.js` — comunicación desacoplada por eventos.
- `src/core/engine.js` — orquestación del runtime.
- `src/core/world.js` — modelo lógico del territorio y superficies.
- `src/core/entity.js` — registro, identidad y posición.
- `src/content/campaign.js` — objetivo educativo, capítulos y política de incorporación histórica.
- `src/content/memories.js` — unidades de conocimiento históricas/narrativas.
- `src/content/dialogues.js` — contenido conversacional declarativo.
- `src/content/missions.js` — misiones y pasos declarativos.
- `src/systems/input.js` — teclado y controles táctiles.
- `src/systems/collision.js` — ocupación estática y dinámica.
- `src/systems/transitability.js` — reglas de terreno y velocidad.
- `src/systems/navigation.js` — rutas deterministas.
- `src/systems/npc.js` — rutinas y movimiento autónomo.
- `src/systems/time.js` — reloj independiente del renderizado.
- `src/systems/dialogue.js` — conversaciones declarativas y eventos narrativos.
- `src/systems/mission.js` — objetivos, pasos, filtros, progreso y finalización.
- `src/systems/interaction.js` — interacción basada en entidades y registro de conocimiento.
- `src/systems/location.js` — transiciones declarativas entre locations.
- `src/systems/persistence.js` — guardado seguro y saneado.
- `src/presentation/world-renderer.js` — presentación desde datos.
- `src/main.js` — composición, ciclo, HUD de capítulo/objetivo/memorias y soporte pixel-art.
- `tests/` — contratos ejecutables.

## Campaña
La campaña queda preparada como una progresión de cinco capítulos, sin afirmar hechos históricos todavía:
1. **El territorio** — paisaje, agua, caminos y memoria del lugar.
2. **Las voces** — personas, testimonios y memorias.
3. **La transformación** — cambios documentados.
4. **Villa Pelón** — construcción del pueblo y vida cotidiana.
5. **Memoria viva** — conexión entre pasado y presente.

Cada capítulo podrá contener múltiples misiones. La arquitectura no obliga al motor a conocer nombres ni contenidos específicos: los datos narrativos declaran qué ocurre y los sistemas genéricos ejecutan la regla.

## v0.9.0
Las misiones son declarativas: cada una define pasos y eventos capaces de completarlos. El diálogo emite hechos; la misión decide si ese hecho corresponde al objetivo activo. El progreso queda guardado y el HUD muestra dinámicamente el siguiente objetivo.

Las memorias descubiertas se registran como conocimiento persistente, de modo que explorar el territorio tiene una consecuencia educativa acumulativa y no sólo una pantalla de texto.

El primer vertical slice de locations permite exterior → Centro Comunitario → interior → salida → exterior, conservando `currentLocationId` en el estado persistente y reutilizando el mismo contrato para futuras locations.

La misión inicial de Luna recorre cuatro estados: conocer a Marta → escuchar su explicación → encontrar la primera memoria → regresar con Marta.

## Comprobación local
- `npm test` — ejecuta las pruebas del núcleo.
- `npm run check` — valida estructura, sintaxis, contratos, versiones y pruebas.

## Regla para este proyecto
No se presupone experiencia previa. Cada capa tiene propósito, dueño, entradas/salidas, conexiones explícitas, validación y criterio de terminación.

## Desarrollo seguro
GitHub es la fuente de verdad; `main` se integra mediante cambios aislados y revisables; `core/v0.9.0-sync` es la línea canónica de desarrollo de esta versión; cada versión estable conserva rollback; no se hacen limpiezas destructivas; los duplicados se retiran después de conectar y validar su reemplazo.

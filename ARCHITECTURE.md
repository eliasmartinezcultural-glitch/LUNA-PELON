# LUNA PELÓN — ARQUITECTURA OPERATIVA

**Versión:** v0.4.0

La arquitectura se diseña para soportar un RPG completo sin obligarnos a reescribir el juego cuando aparezcan interiores, NPCs, diálogos, misiones, inventario, economía, actividades, tiempo, clima, historia, audio, accesibilidad y contenido educativo.

```text
src/
├── core/
│   ├── engine.js             # Orquestación del runtime
│   ├── state.js              # Estado del jugador/juego
│   ├── event-bus.js          # Eventos desacoplados
│   ├── world.js              # Modelo lógico del mundo
│   ├── entity.js             # Contrato de entidades
│   └── runtime-contract.js   # Compatibilidad/migración
├── systems/
│   ├── input.js              # Acciones PC/móvil
│   ├── collision.js          # Ocupación y movimiento seguro
│   ├── spatial.js            # Consultas espaciales
│   ├── interaction.js        # Interacciones actuales
│   └── persistence.js        # Carga y guardado
├── presentation/
│   └── world-renderer.js     # Presentación del mundo desde datos
├── data.js                   # Fuente de verdad del contenido
└── main.js                   # Arranque y composición

tests/
└── core-contract.test.mjs    # Pruebas ejecutables del núcleo
```

## v0.4.0 — World Foundation 2
El mundo deja de depender de geometría dibujada directamente en `main.js`. El renderer recibe el modelo de datos y representa sus caminos, puente, chacras y edificios.

El contenido territorial ahora puede crecer declarativamente mediante:
- `zones` — regiones funcionales;
- `roads` — caminos y cruces;
- `farms` — espacios productivos/rurales;
- `buildings` — estructuras del territorio;
- `obstacles` — geometría que gobierna la colisión;
- `points` — puntos de referencia para sistemas futuros.

La regla importante es que **la representación no se convierte en la autoridad del mundo**. La autoridad continúa en los datos y el modelo lógico.

## Próxima evolución
El siguiente salto será separar mejor el concepto de terreno/transitabilidad del dibujo visual y comenzar el framework de entidades vivas: jugador, NPCs, objetos y puntos interactivos con identidad, posición y comportamiento independiente.

## Capas previstas del RPG
1. **Platform:** navegador, pantalla, teclado/táctil, audio y capacidades del dispositivo.
2. **Presentation:** renderer, cámara, HUD, menús, animaciones y feedback.
3. **Gameplay systems:** movimiento, colisión, interacción, navegación, diálogo, misiones, inventario, economía, actividades, NPCs, tiempo/clima y progresión.
4. **Game core:** estado, eventos, reglas de transición, ciclo de vida y contratos.
5. **Content/data:** mundo, personajes, objetos, misiones, diálogos y contenido histórico verificable.
6. **Persistence:** guardados, migraciones, versionado de esquema y recuperación segura.
7. **Validation/tooling:** validadores, CI, pruebas y controles de regresión.

## Regla de dependencia
`platform/presentation → systems → core → data contracts`

El renderer no gobierna el estado. El core no importa presentación. La narrativa no queda incrustada en reglas de movimiento. Los datos describen el contenido y los sistemas ejecutan las reglas.

## Principios profesionales aplicados
- Separación de datos y lógica.
- Responsabilidad única por módulo.
- Composición antes que una clase/archivo gigante.
- Comunicación por eventos para reducir acoplamiento.
- Sistemas independientes de la presentación.
- Datos declarativos para que el contenido pueda crecer sin reescribir el motor.
- Guardados saneados y migrables.
- Compatibilidad móvil desde el diseño.
- Validación automática antes de integrar.
- Pruebas ejecutables para proteger contratos críticos.

## Regla de refactor
Conectar → validar → probar → documentar → retirar duplicado. Nunca retirar primero.

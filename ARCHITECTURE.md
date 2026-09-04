# LUNA PELÓN — ARQUITECTURA OPERATIVA

**Versión:** v0.3.1

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
│   └── persistence.js        # Guardado/carga
├── data.js                   # Fuente de verdad del contenido
└── main.js                   # Arranque + renderer temporal

tests/
└── core-contract.test.mjs    # Pruebas ejecutables del núcleo
```

## Qué significa esta etapa
Todavía no estamos construyendo "el mapa bonito". Estamos cerrando el cinturón de seguridad técnico que permitirá que el mapa sea grande sin convertirse en un archivo inmanejable.

El mundo ya tiene contratos para:
- límites físicos;
- zonas identificables;
- obstáculos de colisión;
- puntos de interés;
- entidades con IDs estables;
- consultas de proximidad;
- movimiento bloqueado por obstáculos;
- eventos de movimiento.

Además, el núcleo tiene pruebas ejecutables para estado, mundo, entidades, colisiones y consultas espaciales. El validador las ejecuta antes de declarar la estructura válida.

## Capas previstas del RPG
1. **Platform:** navegador, pantalla, teclado/táctil, audio y capacidades del dispositivo.
2. **Presentation:** renderer, cámara, HUD, menús, animaciones y feedback.
3. **Gameplay systems:** movimiento, colisión, interacción, diálogo, misiones, inventario, economía, actividades, NPCs, tiempo/clima y progresión.
4. **Game core:** estado, eventos, reglas de transición, ciclo de vida y contratos.
5. **Content/data:** mundo, personajes, objetos, misiones, diálogos y contenido histórico verificable.
6. **Persistence:** guardados, migraciones, versionado de esquema y recuperación segura.
7. **Validation/tooling:** validadores, CI, pruebas y controles de regresión.

## Regla de dependencia
`platform/presentation → systems → core → data contracts`

El renderer no gobierna el estado. Los sistemas no deben depender entre sí mediante referencias rígidas cuando un evento o contrato pueda desacoplarlos. El core no importa presentación. La narrativa no queda incrustada en reglas de movimiento.

## Fuente única de verdad
- Versión del producto: `src/data.js` por ahora.
- Estado runtime: `src/core/state.js`.
- Mundo lógico: `src/core/world.js`.
- Entidades: `src/core/entity.js`.
- Persistencia: `src/systems/persistence.js`.
- Coordinación: `src/core/engine.js`.

Cuando el proyecto crezca, la versión del producto migrará a un manifiesto central sin duplicaciones.

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

## Importante para un primer videojuego
No se presupone conocimiento previo. Cada sistema nuevo debe tener: propósito, entrada, salida, dueño del estado, conexión con el motor, forma de probarlo y criterio para considerarlo terminado.

## Regla de refactor
Conectar → validar → probar → documentar → retirar duplicado. Nunca retirar primero.

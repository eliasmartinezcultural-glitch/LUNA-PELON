# LUNA PELÓN — ARQUITECTURA OPERATIVA

**Versión:** v0.5.0

La arquitectura se diseña para soportar un RPG completo sin obligarnos a reescribir el juego cuando aparezcan interiores, NPCs, diálogos, misiones, inventario, economía, actividades, tiempo, clima, historia, audio, accesibilidad y contenido educativo.

```text
src/
├── core/
│   ├── engine.js             # Orquestación del runtime
│   ├── state.js              # Estado del jugador/juego + identidad
│   ├── event-bus.js          # Eventos desacoplados
│   ├── world.js              # Modelo lógico del mundo
│   ├── entity.js             # Registro e identidad de entidades
│   └── runtime-contract.js   # Compatibilidad/migración
├── systems/
│   ├── input.js              # Acciones PC/móvil
│   ├── collision.js          # Ocupación estática + dinámica
│   ├── transitability.js     # Superficie y reglas de tránsito
│   ├── spatial.js            # Consultas espaciales
│   ├── interaction.js        # Interacciones por entidades
│   └── persistence.js        # Carga y guardado
├── presentation/
│   └── world-renderer.js     # Presentación del mundo desde datos
├── data.js                   # Fuente de verdad del contenido
└── main.js                   # Arranque y composición

tests/
└── core-contract.test.mjs    # Pruebas ejecutables del núcleo
```

## v0.5.0 — Living Entities + Transitability
El runtime deja de tratar NPCs y puntos interactivos como listas especiales. Existe un registro común de entidades con IDs estables. Luna tiene una identidad persistente (`player`) y su posición se sincroniza con el registro durante el juego.

Las interacciones consultan el registro, por lo que futuras conversaciones, objetos, puertas, personajes y lugares pueden incorporarse sin crear un sistema paralelo por tipo.

La colisión ahora distingue entre geometría estática y entidades dinámicas. Los NPCs pueden ser obstáculos físicos sin convertirse en parte de la lógica del renderer.

La transitabilidad introduce una capa semántica: terreno, camino, chacra, río y puente son superficies del mundo. La velocidad puede depender de la superficie y el motor recibe esa información como regla, no como efecto visual.

## Regla de expansión
Para agregar una nueva entidad, primero se intenta definir sus datos y contrato. El engine no debe necesitar un `if` nuevo por cada NPC, objeto o lugar.

Para agregar una nueva superficie, se modifica el modelo de mundo y sus reglas de tránsito; el renderer no se convierte en autoridad física.

## Capas previstas del RPG
1. **Platform:** navegador, pantalla, teclado/táctil, audio y capacidades del dispositivo.
2. **Presentation:** renderer, cámara, HUD, menús, animaciones y feedback.
3. **Gameplay systems:** movimiento, colisión, tránsito, interacción, navegación, diálogo, misiones, inventario, economía, actividades, NPCs, tiempo/clima y progresión.
4. **Game core:** estado, entidades, eventos, reglas de transición, ciclo de vida y contratos.
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
- Identidad estable para entidades y estado persistente.
- Guardados saneados y migrables.
- Compatibilidad móvil desde el diseño.
- Validación automática antes de integrar.
- Pruebas ejecutables para proteger contratos críticos.

## Regla de refactor
Conectar → validar → probar → documentar → retirar duplicado. Nunca retirar primero.

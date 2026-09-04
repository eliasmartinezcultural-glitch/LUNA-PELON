# LUNA PELÓN — ARQUITECTURA OPERATIVA

**Versión:** v0.2.0

La arquitectura se diseña desde ahora para soportar un RPG completo sin obligarnos a reescribir el juego cuando aparezcan inventario, NPCs, diálogos, misiones, economía, combate opcional, interiores, mapa, tiempo, clima, historia, audio, guardado, accesibilidad y contenido educativo.

```text
src/
├── core/                 # Estado, eventos y orquestación del motor
│   ├── engine.js
│   ├── state.js
│   ├── event-bus.js
│   └── runtime-contract.js
├── systems/              # Reglas independientes del juego
│   ├── input.js
│   ├── movement.js
│   ├── interaction.js
│   └── persistence.js
├── data.js               # Fuente de verdad del contenido inicial
└── main.js               # Adaptador de arranque + renderer temporal
```

## Capas previstas del RPG
1. **Platform:** navegador, pantalla, teclado/táctil, audio y capacidades del dispositivo.
2. **Presentation:** renderer, cámara, HUD, menús, animaciones y feedback.
3. **Gameplay systems:** movimiento, interacción, diálogo, misiones, inventario, economía, actividades, NPCs, tiempo/clima y progresión.
4. **Game core:** estado, eventos, reglas de transición, ciclo de vida y contratos.
5. **Content/data:** mundo, personajes, objetos, misiones, diálogos y contenido histórico verificable.
6. **Persistence:** guardados, migraciones, versionado de esquema y recuperación segura.
7. **Validation/tooling:** validadores, CI, pruebas y controles de regresión.

## Regla de dependencia
`platform/presentation → systems → core → data contracts`

El renderer no gobierna el estado. Los sistemas no deben depender entre sí mediante referencias rígidas cuando un evento o contrato pueda desacoplarlos. El core no importa presentación. La narrativa no debe quedar incrustada en reglas de movimiento.

## Fuente única de verdad
- Versión del producto: `src/data.js` por ahora.
- Estado runtime: `src/core/state.js`.
- Persistencia: `src/systems/persistence.js`.
- Contrato/migración del estado: `src/core/runtime-contract.js`.
- Coordinación: `src/core/engine.js`.

Cuando el proyecto crezca, la versión del producto deberá migrar a un manifiesto central sin duplicaciones.

## Principios profesionales aplicados
- Separación de datos y lógica.
- Responsabilidad única por módulo.
- Composición antes que una clase/archivo gigante.
- Comunicación por eventos para reducir acoplamiento.
- Sistemas independientes de la presentación.
- Datos declarativos para que el contenido pueda crecer sin reescribir el motor.
- Guardados saneados y migrables.
- Compatibilidad móvil desde el diseño, no como parche final.
- Validación automática antes de integrar.

## Importante para un primer videojuego
No se presupone conocimiento previo. Cada sistema nuevo debe tener: propósito, entrada, salida, dueño del estado, conexión con el motor, forma de probarlo y criterio para considerarlo terminado.

## Regla de refactor
Conectar → validar → probar → documentar → retirar duplicado. Nunca retirar primero.

# LUNA PELÓN — ARQUITECTURA OPERATIVA

**Versión:** v0.1.1

```text
src/
├── core/       Motor, ciclo de vida, estado y contratos
├── systems/    Movimiento, interacción, misiones, persistencia
├── data/       Datos declarativos del mundo y contenido
└── main.js     Adaptador de arranque/presentación
```

La migración será gradual. En v0.1.1 no se mueve código funcional innecesariamente: primero se fija el contrato para poder refactorizar sin perder conexiones.

## Flujo obligatorio
`entrada → sistema → core/estado → persistencia → presentación`

La presentación nunca debe convertirse en dueña del estado del juego.

## Motor adaptable
El motor debe permitir reemplazar presentación, controles y contenido sin reescribir el estado central. PC y móvil son adaptadores de entrada diferentes sobre las mismas acciones lógicas.

## Contratos mínimos
- **GameState:** posición, progreso y datos persistentes.
- **Input:** acciones abstractas, no reglas de juego.
- **World:** geometría y entidades declarativas.
- **Systems:** transforman estado mediante reglas explícitas.
- **Persistence:** guarda/carga y migra versiones.
- **Renderer:** lee estado y dibuja; no decide progreso.

## Dirección de dependencias
`main → core/systems/data`

Evitar dependencias circulares. Los datos no importan el renderer. El renderer no escribe directamente la misión. La persistencia no contiene lógica narrativa.

## Refactor seguro
Toda extracción de una capa debe mantener primero un adaptador compatible. El código viejo se elimina únicamente después de que el reemplazo pase las comprobaciones de arranque y referencias.
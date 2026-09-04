# LUNA PELÓN — ARQUITECTURA OPERATIVA

**Versión:** v0.1.2

```text
src/
├── core/       Motor, estado, contratos y ciclo de vida
├── systems/    Movimiento, interacción, misiones, persistencia
├── data.js     Datos declarativos del mundo y contenido
└── main.js     Adaptador de arranque/presentación
```

La migración es gradual: cada extracción debe conservar compatibilidad antes de retirar la implementación anterior.

## Flujo obligatorio
`entrada → sistema → core/estado → persistencia → presentación`

La presentación lee el estado; no es dueña del progreso.

## Estado protegido
`src/core/runtime-contract.js` es el propietario del esquema mínimo de runtime. Carga, sanea y limita el estado antes de que sea usado por el juego. Las futuras migraciones de guardado deben incorporarse aquí, no dispersarse en `main.js`.

## Motor adaptable
PC y móvil son adaptadores de entrada sobre las mismas acciones lógicas. Cambiar controles, renderer o contenido no debe exigir duplicar el estado central.

## Contratos mínimos
- **GameState:** posición, progreso y datos persistentes.
- **Input:** acciones abstractas.
- **World:** geometría y entidades declarativas.
- **Systems:** reglas que transforman estado.
- **Persistence:** serialización, carga y migración.
- **Renderer:** lectura del estado y presentación.

## Dirección de dependencias
`main → core + data`

El core no importa el renderer. Los datos no importan el renderer. La persistencia no contiene narrativa. Evitar ciclos.

## Regla de refactor
Primero se conecta el reemplazo. Después se verifica. Solo entonces se retira código duplicado. Nunca al revés.
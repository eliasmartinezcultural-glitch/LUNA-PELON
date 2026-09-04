# LUNA PELÓN — CONTRATO DEL NÚCLEO

**Versión:** v0.2.0
**Estado:** FUNDACIÓN MODULAR RPG

## Reglas de mando
1. `main` es estable. Toda funcionalidad experimental nace en una rama aislada.
2. Cada versión estable conserva un punto de rollback.
3. Una fuente de verdad para cada dato.
4. Un módulo debe tener una responsabilidad clara.
5. El renderer presenta; no decide el estado del juego.
6. Los sistemas modifican el estado mediante reglas explícitas.
7. Los eventos desacoplan sistemas cuando corresponda.
8. No se elimina un sistema fundamental sin reemplazo conectado y validado.
9. El estado persistido pasa por saneamiento/migración antes de entrar al juego.
10. PC y móvil utilizan las mismas acciones lógicas.
11. El contenido histórico definitivo requiere fuentes revisadas.
12. Una versión no se considera terminada sólo porque compile: debe arrancar y conservar sus conexiones.

## Puerta de entrada
- estructura íntegra;
- imports y rutas válidos;
- sintaxis válida;
- entrypoint correcto;
- estado persistente seguro;
- controles PC/móvil;
- conexiones entre core y sistemas;
- ausencia de referencias muertas;
- versión coherente;
- documentación actualizada;
- validación automática;
- ejecución real cuando el entorno lo permita;
- rollback disponible.

## Capas futuras obligatorias
El RPG podrá incorporar progresivamente mundo, escenas/interiores, navegación, colisiones, NPCs con rutinas, diálogo, misiones, inventario, objetos, economía, actividades, reputación, tiempo, clima, audio, animaciones, historia, accesibilidad, localización, telemetría técnica y guardados migrables sin romper las capas anteriores.

## Prohibición
No hacer limpiezas destructivas para "empezar de nuevo". Se reconstruye por capas y con respaldo.

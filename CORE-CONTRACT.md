# LUNA PELÓN — CONTRATO DEL NÚCLEO

**Versión:** v0.6.0
**Estado:** LIVING WORLD + NPC NAVIGATION

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
13. Los contratos críticos deben tener pruebas ejecutables, no sólo comprobaciones de texto.
14. Un sistema retirado debe desaparecer de imports, referencias y documentación antes de considerar cerrada la refactorización.
15. El mundo debe poder ampliarse agregando datos sin obligar a modificar el motor para cada edificio, camino, chacra o punto de interés.
16. Toda entidad persistente o interactiva debe tener un identificador estable.
17. La ocupación dinámica y la transitabilidad son reglas del gameplay, nunca responsabilidad del renderer.
18. Las nuevas categorías de entidades deben reutilizar el registro y los contratos existentes antes de crear sistemas paralelos.
19. La navegación no decide la conducta: entrega rutas; el sistema de NPC decide cuándo, dónde y por qué moverse.
20. El reloj del mundo es independiente del renderizado y debe poder probarse de forma determinista.

## Puerta de entrada
- estructura íntegra;
- imports y rutas válidos;
- sintaxis válida;
- entrypoint correcto;
- estado persistente seguro;
- controles PC/móvil;
- conexiones entre core y sistemas;
- mundo definido por datos;
- presentación separada de reglas;
- colisiones estáticas y dinámicas gobernadas por sistema;
- entidades con identificadores estables;
- superficies con reglas de tránsito;
- navegación determinista;
- rutinas de NPC basadas en datos;
- reloj del mundo aislado;
- ausencia de referencias muertas;
- versión coherente;
- documentación actualizada;
- validación automática;
- pruebas de contratos ejecutadas;
- ejecución real cuando el entorno lo permita;
- rollback disponible.

## Capas futuras obligatorias
El RPG podrá incorporar progresivamente escenas/interiores, diálogo, misiones, inventario, objetos, economía, actividades, reputación, clima, audio, animaciones, historia, accesibilidad, localización, telemetría técnica y guardados migrables sin romper las capas anteriores.

## Prohibición
No hacer limpiezas destructivas para "empezar de nuevo". Se construye por capas y con respaldo.

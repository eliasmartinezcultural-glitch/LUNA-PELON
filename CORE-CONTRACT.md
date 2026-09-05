# LUNA PELÓN — CONTRATO DEL NÚCLEO

**Versión:** v0.9.0  
**Estado:** LOCATION SLICE + MISIONES + PROGRESIÓN POR EVENTOS

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
13. Los contratos críticos deben tener pruebas ejecutables.
14. Un sistema retirado debe desaparecer de imports, referencias y documentación antes de cerrar la refactorización.
15. El mundo debe poder ampliarse agregando datos sin modificar el motor para cada contenido.
16. Toda entidad persistente o interactiva tiene identificador estable.
17. Ocupación y transitabilidad son reglas del gameplay, nunca del renderer.
18. Las categorías nuevas reutilizan el registro y contratos existentes.
19. Navegación entrega rutas; NPC decide conducta.
20. El reloj es independiente del renderizado y determinista.
21. El diálogo es contenido declarativo: no se incrusta narrativa específica en el engine.
22. La memoria narrativa persistida se sanea y tiene límites de tamaño.
23. Una misión declara sus pasos en datos; no se codifica una misión concreta dentro del engine.
24. El diálogo emite hechos narrativos; el sistema de misiones decide el progreso.
25. El progreso de misión es persistente, saneado y acotado.

## Puerta de entrada
Estructura íntegra, imports válidos, sintaxis válida, entrypoint correcto, persistencia segura, controles PC/móvil, conexiones core/sistemas, mundo data-driven, presentación separada, colisión estática/dinámica, transitabilidad, navegación, rutinas NPC, reloj, diálogo, memoria narrativa, misiones por eventos, locations y transiciones, progreso persistente, ausencia de referencias muertas, versión coherente, documentación, validación, pruebas y rollback.

## Prohibición
No hacer limpiezas destructivas para "empezar de nuevo". Se construye por capas y con respaldo.

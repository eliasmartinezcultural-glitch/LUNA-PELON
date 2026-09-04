# LUNA PELÓN — CONTRATO DEL NÚCLEO

**Versión:** v0.1.2
**Estado:** RUNTIME SAFETY / PROTECCIÓN ESTRUCTURAL

## Reglas de mando
1. `main` es estable. Toda funcionalidad experimental nace en `core/*` u otra rama aislada.
2. Antes de modificar una versión estable se conserva un punto de rollback.
3. Una fuente de verdad: el estado y la versión no se duplican entre capas.
4. Cambios atómicos: una versión debe dejar el proyecto arrancable.
5. GitHub es la fuente del código versionado; Vercel es despliegue/validación.
6. Si una versión rompe una conexión crítica, se revierte; no se tapa el fallo con parches.
7. No se elimina un sistema fundamental sin reemplazo conectado y validado.
8. Cada sistema tiene un propietario claro del estado y de su comportamiento.
9. El estado persistido debe pasar por el contrato de runtime antes de entrar al juego.
10. PC y móvil son adaptadores de entrada del mismo estado lógico; no deben crear estados paralelos.

## Puerta de entrada de cada versión
1. estructura íntegra;
2. archivos importados existentes;
3. sintaxis JavaScript válida;
4. `index.html` apunta al entrypoint correcto;
5. rutas relativas válidas;
6. estado persistente saneado/compatible;
7. controles PC/móvil conservados;
8. sin referencias a archivos eliminados;
9. versión coherente;
10. rollback disponible;
11. PR revisable antes de integrar;
12. ejecución real verificada cuando el entorno lo permita.

## Prohibición explícita
No volver a realizar una limpieza destructiva del repositorio para "empezar de nuevo". Toda reconstrucción se hace por capas, en rama aislada y conservando el último estado estable.
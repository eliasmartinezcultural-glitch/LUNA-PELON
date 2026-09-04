# LUNA PELÓN — CONTRATO DEL NÚCLEO

**Versión:** v0.1.1
**Estado:** HARDENING / PROTECCIÓN ESTRUCTURAL

## Regla 1 — `main` es estable
Nunca se modifica `main` directamente para una funcionalidad experimental. Todo cambio pasa por una rama de trabajo y una revisión/validación antes de integrarse.

## Regla 2 — respaldo antes de tocar
Cada versión estable debe quedar apuntada por una rama `backup/vX.Y.Z-stable` o equivalente. Un respaldo nunca se reutiliza como rama de trabajo.

## Regla 3 — una fuente de verdad
El estado del juego, configuración, versión y contratos de sistemas no se duplican entre archivos. Las capas deben consumir el núcleo, no mantener copias paralelas.

## Regla 4 — cambios atómicos
Una versión debe representar un conjunto coherente de cambios. Si una modificación rompe la inicialización, el arranque o una conexión esencial, no se considera terminada.

## Regla 5 — compatibilidad Vercel/GitHub
GitHub es la fuente de código versionado. Vercel es una superficie de despliegue/validación. Ninguna configuración de despliegue puede convertirse en una fuente alternativa de lógica del juego.

## Regla 6 — rollback inmediato
Si una versión falla, se revierte al último commit estable conocido. No se parchea encima de una base rota para ocultar el fallo.

## Regla 7 — no borrar sin reemplazo validado
No se eliminan archivos o sistemas fundamentales durante una refactorización hasta comprobar que el reemplazo existe y está conectado.

## Regla 8 — todo sistema nuevo debe tener dueño
Cada sistema debe declarar dónde vive su estado y qué módulo lo gobierna. Evitar funciones globales duplicadas y lógica dispersa.

## Puerta de entrada de cada versión
Antes de integrar:
1. estructura íntegra;
2. archivos importados existentes;
3. sintaxis JavaScript válida;
4. `index.html` apunta al entrypoint correcto;
5. rutas relativas válidas;
6. estado persistente compatible;
7. controles PC/móvil conservados;
8. no existen referencias a archivos eliminados;
9. versión actualizada en una única fuente;
10. rollback disponible.

## Prohibición explícita
No volver a realizar una limpieza destructiva del repositorio para "empezar de nuevo". Si hay que reconstruir una capa, se hace en una rama aislada y se conserva el último estado estable.
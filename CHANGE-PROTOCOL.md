# LUNA PELÓN — PROTOCOLO DE CAMBIOS

**Versión operativa:** v0.7.0  
**Última versión de producto registrada:** v0.7.0

## Identificación
Cada avance usa `vMAJOR.MINOR.PATCH`.

- MAJOR: cambio incompatible.
- MINOR: nueva capacidad compatible.
- PATCH: reparación compatible o sincronización.

## Flujo obligatorio
1. Leer el estado actual.
2. Crear respaldo.
3. Crear rama aislada.
4. Modificar por conjunto coherente.
5. Validar estructura y sintaxis.
6. Ejecutar pruebas de contratos.
7. Revisar conexiones y referencias.
8. Abrir PR hacia `main`.
9. Integrar sólo una versión validada.
10. Conservar commit estable para rollback.

## GitHub ↔ Vercel
GitHub es la fuente de verdad del código. Vercel es despliegue/preview. Una publicación no reemplaza la validación del repositorio ni una prueba de ejecución cuando esté disponible.

## v0.7.0
La capa narrativa incorpora diálogo declarativo, memoria de encuentros e historial acotado. Las consecuencias de conversación se comunican mediante eventos, manteniendo desacoplados contenido, engine y presentación.

## Rollback
Ante una regresión crítica, volver al último commit estable. Nunca forzar integración sólo para conservar trabajo reciente.

## Conservación histórica
El contenido histórico definitivo sólo se incorpora con fuentes revisadas. La infraestructura puede avanzar independientemente de esa investigación.

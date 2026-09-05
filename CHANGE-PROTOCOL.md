# LUNA PELÓN — PROTOCOLO DE CAMBIOS

**Versión operativa:** v0.9.0  
**Última versión de producto registrada:** v0.9.0

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

## v0.9.0
El núcleo incorpora el vertical slice de locations: transición declarativa exterior → interior → exterior, persistencia de `currentLocationId` y cambio coordinado del modelo de colisión y la presentación. El sistema de misiones convierte hechos de gameplay en progreso persistente; los pasos son declarativos y pueden reaccionar a diálogo, descubrimientos e interacciones sin incrustar contenido específico en el engine.

## Rollback
Ante una regresión crítica, volver al último commit estable. Nunca forzar integración sólo para conservar trabajo reciente.

## Conservación histórica
El contenido histórico definitivo sólo se incorpora con fuentes revisadas. La infraestructura puede avanzar independientemente de esa investigación.

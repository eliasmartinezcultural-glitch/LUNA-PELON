# LUNA PELÓN — PROTOCOLO DE CAMBIOS

**Versión operativa:** v0.5.0
**Última versión de producto registrada:** v0.5.0

## Identificación
Cada avance usa una versión semántica `vMAJOR.MINOR.PATCH`.

- **MAJOR:** cambio de arquitectura incompatible.
- **MINOR:** nueva capacidad compatible.
- **PATCH:** reparación compatible o sincronización documental/estructural.

## Flujo obligatorio
1. Leer el estado actual de `main`.
2. Crear respaldo del último estado estable.
3. Crear rama aislada para el cambio.
4. Modificar por conjunto coherente.
5. Ejecutar validación estructural/sintáctica.
6. Ejecutar pruebas de contratos.
7. Revisar conexiones y referencias.
8. Abrir PR hacia `main`.
9. Integrar únicamente una versión validada.
10. Mantener el commit de la versión como punto de rollback.

## Regla Vercel ↔ GitHub
- **GitHub:** fuente de verdad del código.
- **Vercel:** entorno de despliegue/preview.
- Un preview sirve para verificar una versión; no reemplaza el commit.
- No se considera una versión "funcionando" sólo porque haya sido publicada: debe pasar las comprobaciones del repositorio y, cuando sea posible, una comprobación de ejecución.

## Criterio de rollback
Si el cambio introduce una regresión crítica, se vuelve al último commit estable. Nunca se fuerza una integración sólo para conservar trabajo reciente.

## Registro de versión
Cada release estable debe dejar commit identificable, versión declarada, respaldo anterior, cambios documentados, validación ejecutada y ruta de prueba/deploy conocida.

## Regla de conservación
El contenido histórico y narrativo definitivo deberá agregarse sólo con una fuente revisada. La infraestructura no debe bloquear el juego por depender de datos históricos todavía no verificados.

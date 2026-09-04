# LUNA PELÓN

RPG pixel-art educativo, construido desde cero para navegador.

## Versión actual
**v0.1.1 — Hardening del núcleo**

## Objetivo de esta versión
Antes de agregar contenido o estética, se establece una infraestructura para que cada cambio sea aislado, validable, reversible y trazable.

### Protección
- respaldo estable de `v0.1.0`;
- contrato del núcleo;
- arquitectura por capas;
- protocolo de cambios;
- validación automática mediante GitHub Actions;
- control de versión coherente.

### Núcleo existente conservado
- estado y persistencia local;
- mundo, NPC, misión y descubrimiento como datos;
- teclado y controles táctiles;
- cámara;
- interacción y diálogo;
- primera misión.

### Regla de evolución
No se vuelve a borrar el proyecto para corregir arquitectura. Las reconstrucciones se hacen por capas, en ramas aisladas, con respaldo y rollback.
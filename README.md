# LUNA PELÓN

RPG pixel-art educativo, construido desde cero para navegador.

## Versión actual
**v0.1.0 — Fundación**

### Núcleo
- Estado único de Luna y persistencia local.
- Mundo, NPC, misión y descubrimiento definidos como datos separados.
- Movimiento por teclado y controles táctiles.
- Cámara siguiendo a la protagonista.
- Interacción y diálogo.
- Primera misión funcional.

### Arquitectura
`src/data.js` contiene datos del mundo y contenido. `src/main.js` contiene el bucle, entrada, estado y render. La presentación vive en `styles.css` e `index.html`.

### Regla de evolución
Cada versión debe ampliar el juego sin duplicar sistemas ni romper el núcleo. Los contenidos históricos deberán revisarse con fuentes antes de convertirse en hechos definitivos del juego.

# LUNA PELÓN — ARQUITECTURA OPERATIVA

**Versión:** v0.9.0

La arquitectura soporta un RPG territorial creciente sin reescribir el motor para cada personaje, lugar, misión u objeto.

```text
src/
├── core/       # estado, eventos, mundo, entidades, engine
├── systems/    # input, colisión, tránsito, interacción, location, navegación, NPC, tiempo, diálogo, misiones, persistencia
├── presentation/ # renderer
├── data.js     # composición declarativa del runtime
├── content/   # memorias, personajes, diálogos, misiones y locations
└── main.js     # composición y ciclo

tests/          # contratos ejecutables
```

## v0.9.0 — Location slice + base de progresión
Las misiones pasan a ser un sistema independiente y el mundo incorpora un contrato de locations para transiciones entre exterior e interior. El flujo narrativo queda desacoplado y los lugares se declaran como contenido.

`contenido → evento → misión → progreso persistente → HUD`

El diálogo no decide si una misión termina. Emite hechos narrativos; el sistema de misiones determina si ese hecho corresponde al paso activo. Esto evita que personajes concretos queden codificados dentro del engine.

El progreso persistente conserva estado activo/completado, índice del paso y lista acotada de pasos realizados. Los guardados antiguos se aceptan mediante saneamiento y reciben la estructura nueva sin depender de código narrativo específico.

## Location slice — puertas e interiores
Los lugares se declaran como contenido. Una puerta define origen, destino, posición, punto de aparición y radio de interacción. `systems/location.js` valida la transición y emite `location:changed`; el engine cambia el modelo de colisión y el renderer cambia la escena.

El primer vertical slice implementado es el Centro Comunitario: exterior → puerta → interior → salida → exterior. El estado persistente conserva `currentLocationId` y las coordenadas se sanean según el lugar activo.

La regla es no generalizar más hasta comprobar este circuito con tests y ejecución real. Después se podrán agregar más edificios reutilizando el mismo contrato.

## Regla de expansión
Para agregar personajes, conversaciones, misiones, lugares o futuras actividades se priorizan datos y contratos. El engine no debe necesitar un `if` nuevo por cada contenido.

## Capas previstas
1. Platform: navegador, pantalla, teclado/táctil, audio.
2. Presentation: renderer, cámara, HUD, menús, animaciones y feedback.
3. Gameplay: movimiento, colisión, tránsito, interacción, navegación, NPC, tiempo, diálogo, misiones, inventario, economía, locations y progresión.
4. Core: estado, entidades, eventos, reglas y ciclo de vida.
5. Content/data: mundo, personajes, objetos, locations, misiones, diálogos e historia verificable.
6. Persistence: guardados, migraciones y recuperación.
7. Validation/tooling: pruebas, CI y controles de regresión.

## Regla de dependencia
`platform/presentation → systems → core → data contracts`

El renderer no gobierna el estado. La narrativa no queda incrustada en movimiento. Las misiones reaccionan a eventos y no conocen detalles de presentación. Las puertas no contienen lógica de movimiento: sólo declaran transición y puntos de aparición.

## Refactor
Conectar → validar → probar → documentar → retirar duplicado.

# CHANGELOG — LUNA PELÓN

## v0.2.1 — Governance Sync
- Synchronized the change protocol after the v0.2.0 modular foundation.
- Recorded the current operating version explicitly.

## v0.2.0 — Modular RPG Foundation
- Extracted runtime state into `src/core/state.js`.
- Added an event bus for decoupled gameplay communication.
- Added `src/core/engine.js` as the runtime orchestrator.
- Separated input, movement, interaction and persistence systems.
- Kept `main.js` as a thin startup/presentation adapter.
- Strengthened automated checks for real module connections.

## v0.1.2 — Runtime Safety
- Added a protected runtime state contract.
- Added safe loading and sanitization of local persistence.
- Strengthened automated structural validation.

## v0.1.1 — Core Hardening
- Established stable/backup/working-branch workflow.
- Added architecture and change protocol.
- Added initial GitHub Actions validation.
- Preserved v0.1.0 as a stable rollback point.

## v0.1.0 — Foundation
- Fresh Luna Pelón RPG foundation.
- Browser-first PC/mobile controls.
- Basic world, NPC interaction, discovery and mission loop.

# ValueLens

**Investment alignment for engineering leaders** — a board-pack you can interact with.

ValueLens helps Engineering Directors and non-technical executives keep **strategy, team shape, and evidence** aligned — and decide what to start, stop, or continue. It is intentionally **not** Jira, not an org directory, and not a service catalog.

| Related | Role |
|---------|------|
| **ValueLens** | Bets, outcomes, topology *intent*, decision notes |
| **[ArchLens](https://archlens.dev)** | Systems architecture risk (separate product & visual language) |
| **Jira / Backstage / Entra / GitHub** | Systems of record ValueLens *references* (never replaces) |

This folder is the **product home** while the code lives here under the personal site repo. It will move to a dedicated repository when Slice 1 is ready to implement in earnest.

## Contents

| Path | Purpose |
|------|---------|
| [docs/PRESS_RELEASE.md](./docs/PRESS_RELEASE.md) | Positioning / launch narrative |
| [docs/PRODUCT_SPEC.md](./docs/PRODUCT_SPEC.md) | Domain glossary, acceptance scenarios, XFN |
| [docs/TECH_STACK.md](./docs/TECH_STACK.md) | Stack decision (Slice 1 → connected) |
| [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md) | Hexagonal architecture & adapters |
| [docs/VALUE_SPEC.md](./docs/VALUE_SPEC.md) | Canonical ValueSpec contract |
| [docs/ROADMAP.md](./docs/ROADMAP.md) | Slices and non-goals |
| [docs/MOCKUPS.md](./docs/MOCKUPS.md) | Screen index |
| [docs/prds/](./docs/prds/) | Per-feature PRDs |
| [docs/adrs/](./docs/adrs/) | Architecture decision records |
| [schemas/](./schemas/) | JSON Schema for ValueSpec |
| [samples/](./samples/) | Example `valuetree.yaml` |
| [mockups/](./mockups/) | Executive UI mockups (+ `technical/` for builder mode) |

## Slice 1 (committed direction)

- **Local only** — open a folder, edit ValueSpec, export a board pack
- **No authentication**
- **Executive visual language** (light, editorial) — technical import/merge comes later behind a secondary surface
- Auth and live connectors (Backstage / GitHub / Entra) land in **Slice 2+**

## One-liner

> Jira plans work. Backstage catalogs systems. Entra catalogs people. ValueLens contracts how strategy, team shape, and evidence stay aligned — and when to stop.

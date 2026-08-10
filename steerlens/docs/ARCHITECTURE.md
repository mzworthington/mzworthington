# Technical architecture

## 1. Goals

- Hexagonal / ports-and-adapters so connectors plug in without polluting domain
- Canonical **SteerSpec** as the only workspace source of truth
- Executive UI and technical UI as separate adapters over the same core
- Slice 1 runnable with zero cloud dependency

## 2. Context diagram

```text
┌─────────────────────────────────────────────────────────────┐
│                     SteerLens App (SPA)                      │
│  Executive UI          Technical UI (secondary, later)       │
│  steering · org ·      import merge · refs · write-back      │
│  decision · export                                           │
└───────────────┬───────────────────────────┬─────────────────┘
                │                           │
                ▼                           ▼
        ┌───────────────┐           ┌───────────────┐
        │ valuels/core  │◄──────────│   Adapters    │
        │ SteerSpec     │           │ fs · pdf      │
        │ mismatches    │           │ backstage*    │
        │ decisions     │           │ github* entra*│
        └───────────────┘           └───────┬───────┘
                                            │
                    ┌───────────────────────┼──────────────────┐
                    ▼                       ▼                  ▼
             local folder              Backstage API*    GitHub / Entra*
             steertree.yaml            (read Groups)     (read teams)
                                        overlay write*
* Slice 2+
```

## 3. Core domain (`@steerlens/core`)

Pure TypeScript + Zod. No React, no `fetch`, no filesystem.

| Module | Responsibility |
|--------|----------------|
| `steerSpec` | Schema, parse, serialize, migrate |
| `mismatches` | Rules: unfunded topology, overloaded platform, bet without kill criteria, etc. |
| `decisions` | Decision note model + invariants |
| `topology` | Team nodes, interaction modes, display labels |
| `evidence` | Metric attachments (opaque values in Slice 1) |

**Invariants (examples):**

- Every bet belongs to exactly one outcome
- Every bet has non-empty kill criteria before status can be `stop-ready`
- External refs are optional; displayName is required
- Provider-sourced teams cannot be marked `fileOwned: true`

## 4. Application services

Orchestrate use cases; still framework-agnostic:

- `OpenWorkspace`
- `SaveWorkspace`
- `UpsertBet` / `UpsertOutcome` / `UpsertTeam`
- `CreateDecisionNote`
- `ExportBoardPack` (returns DTO for PDF adapter)
- `DetectMismatches`
- `ImportTeamDirectory` (Slice 2+) — merges refs into SteerSpec only
- `ProposeWriteBack` (Slice 2+) — never silent IdP mutation

## 5. Adapters

### Slice 1

| Adapter | Port |
|---------|------|
| `FileSystemWorkspaceRepo` | Load/save `steertree.yaml` via File System Access API |
| `LegacyDownloadUploadRepo` | Fallback for browsers without FS Access |
| `PrintBoardPackExporter` | `window.print` / print CSS |
| `SampleWorkspaceLoader` | Bundled sample YAML |

### Slice 2+

| Adapter | Policy |
|---------|--------|
| `BackstageCatalogClient` | Read Groups/Users; detect provider annotations |
| `BackstageOverlayWriter` | Emit `SteerBet` / overlay YAML only — **no Group YAML** if provider-backed |
| `GitHubTeamsClient` | Resolve team refs; optional delivery metrics |
| `EntraGraphClient` | Resolve group refs — propose-only changes |
| `ArchLensLink` | Optional system entityRef on bets |

## 6. Write-back policy engine

Central policy object evaluated before any export:

```text
IF team.provenance == provider THEN
  allow: SteerSpec, overlay entities, proposal report
  deny:  Group catalog YAML, Entra mutate, silent GitHub membership edits
ELSE IF team.provenance == catalog_file THEN
  allow: round-trip Group YAML (opt-in)
ELSE
  allow: SteerSpec only
```

## 7. UI architecture

- Route-level split: `/` executive shell vs `/technical/*` (feature-flagged until Slice 2)
- State: React local state + core documents; avoid leaking Zod types into every component — view models for executive copy
- Theming: CSS variables (`--vl-ink`, `--vl-paper`, `--vl-accent`); no shared ArchLens tokens

## 8. Security architecture (evolution)

| Slice | Posture |
|-------|---------|
| 1 | Air-gapped capable; user-controlled files only |
| 2 | Tokens in browser memory / OS keychain patterns; never commit secrets to SteerSpec |
| 3 | Optional Worker proxy for secret-bearing Graph calls if browser-only proves insufficient |

## 9. Integration with ArchLens (data only)

```text
Bet.systems[] → archlens entityRef (optional)
```

SteerLens never embeds ArchLens canvas. Deep link out is sufficient.

## 10. Quality gates

- `core` fully unit-tested (SteerSpec + mismatches)
- App: Playwright critical path + axe on executive routes
- Schema published: Zod → JSON Schema in `schemas/`
- Agent Lifecycle Kit handshake when app code exists

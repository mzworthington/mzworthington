# Roadmap

## Slice 0 — Spec (this folder)

- [x] Press release, product spec, architecture, tech stack
- [x] SteerSpec schema + sample
- [x] Executive mockups
- [x] Feature PRDs
- [x] ADRs for stack, local-first, suite relationship

## Slice 1 — Local executive workspace (no auth)

**Goal:** A leader can open a sample or folder, edit outcomes/bets/teams, see mismatches, write a decision note, and export a board pack — fully offline.

| Capability | PRD |
|------------|-----|
| Workspace home | [F01](./prds/F01-workspace-home.md) |
| Steering overview | [F02](./prds/F02-steering-overview.md) |
| How work is organised | [F03](./prds/F03-how-work-is-organised.md) |
| Bet detail | [F04](./prds/F04-bet-detail.md) |
| Outcomes | [F05](./prds/F05-outcomes.md) |
| Evidence (sample/manual) | [F06](./prds/F06-evidence.md) |
| Decision note | [F07](./prds/F07-decision-note.md) |
| Export board pack | [F08](./prds/F08-export-board-pack.md) |
| SteerSpec persistence | [F09](./prds/F09-steerspec-persistence.md) |

**Exit criteria:** Playwright critical journey green; axe clean on executive routes; schema validates sample.

## Slice 2 — Connectors & auth

- Connections settings UI ([F10](./prds/F10-connections.md))
- OAuth for GitHub / Microsoft Entra; Backstage token or session
- Import & merge teams ([F11](./prds/F11-import-merge.md))
- Write-back policy enforced (no provider Group YAML)
- Technical mode surfaces ([F12](./prds/F12-technical-mode.md))

## Slice 3 — Portfolio suite links

- Optional ArchLens `systemRefs` on bets
- CI check action for SteerSpec mismatches
- Optional Backstage overlay `SteerBet` kind docs

## Explicit non-goals (all near-term slices)

- Replacing Jira planning
- Mutating Entra membership automatically
- Dark-cyber UI as default
- Multiplayer CRDT editing

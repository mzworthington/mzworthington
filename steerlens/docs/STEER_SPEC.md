# SteerSpec

Canonical contract for a SteerLens workspace. Stored as `steertree.yaml` at the workspace root.

Executive UI never shows this document by default; Technical mode and git reviews do.

## Design rules

1. **Display names are enough for Slice 1** - external refs optional.
2. **Stable ids** (`out_…`, `bet_…`, `team_…`, `mem_…`) for diff-friendly edits.
3. **Provenance** on teams drives write-back policy later.
4. **No secrets** in SteerSpec.
5. Versioned with `apiVersion` + `kind` for migrations.
6. **Team Topologies is canonical** for team types and interaction modes ([key concepts](https://teamtopologies.com/key-concepts)).

Operating-model evolution (EDGE LVT fields, platform groupings, new mismatch codes): [OPERATING_MODEL_ALIGNMENT.md](./OPERATING_MODEL_ALIGNMENT.md).

## Team Topologies in SteerSpec

| SteerSpec | Team Topologies |
| --- | --- |
| `team.role: stream_aligned` | Stream-aligned team |
| `team.role: platform` | Platform team (may later be a *grouping*) |
| `team.role: enabling` | Enabling team |
| `team.role: complicated_subsystem` | Complicated-subsystem team |
| `relationship.mode: x_as_a_service` | X-as-a-Service |
| `relationship.mode: collaboration` | Collaboration (time-box later via `expectedUntil`) |
| `relationship.mode: facilitation` | Facilitation |

Legacy aliases (`customer_facing`, `shared_platform`, `coaching_support`, `uses_as_service`, `works_together`, `coaching`) are accepted on parse and normalized to the canonical ids above.

Optional `teams[].members[]` records display name, `discipline` (engineering | design | product | quality | leadership | other), free-text job `title`, and `ftePercent` (0–100) as a **capacity / mix signal** — not an HR directory.

## Document shape (v1alpha1)

```yaml
apiVersion: steerlens.dev/v1alpha1
kind: SteerTree
metadata:
  name: northwind-q3-alignment
  title: Northwind Q3 alignment
  description: Synthetic demo workspace — fictional retailer
spec:
  vision: Ship customer promises in days, not weeks, without burning out store and digital teams
  outcomes:
    - id: out_promise
      title: Reliable customer promises
      summary: Customers receive accurate delivery and pickup estimates they can trust
      status: on_track # on_track | at_risk | achieved | abandoned
      metrics:
        - id: met_promise_hit
          title: Promise hit rate
          unit: percent
          current: 91
          baseline: 74
          target: 95
          interpretation: Climbing, still short of the target band
  bets:
    - id: bet_fulfilil
      outcomeId: out_promise
      title: Shared fulfilment spine
      successSignal: New channels reuse one fulfilment path within two weeks of launch
      killCriteria: Fewer than two channels adopt the spine after two quarters
      status: on_track # proposed | on_track | at_risk | stop_ready | stopped | done
      fundedTeamIds: [team_fulfilil, team_storefront]
  teams:
    - id: team_storefront
      displayName: Storefront experience
      role: stream_aligned # stream_aligned | platform | enabling | complicated_subsystem
      provenance: local # local | backstage | github | entra | catalog_file
      externalRefs: []
      members:
        - id: mem_storefront_em
          displayName: Priya Nair
          discipline: leadership # engineering | design | product | quality | leadership | other
          title: Engineering Manager
          ftePercent: 100
    - id: team_fulfilil
      displayName: Fulfilment platform
      role: platform
      provenance: local
      externalRefs: []
      members: []
  relationships:
    - fromTeamId: team_storefront
      toTeamId: team_fulfilil
      mode: x_as_a_service # x_as_a_service | collaboration | facilitation
  decisionNotes:
    - id: dec_loyalty_stop
      betId: bet_loyalty
      recommendation: stop # start | continue | stop | rescope
      title: Stop Loyalty ledger unification?
      why: Coordination cost rose without improving promise hit rate
      measured: []
      affectedTeamIds: [team_fulfilil]
      nextStep: Pause rollout; keep the existing ledger for two quarters
  evidence:
    - id: ev_1
      metricId: met_promise_hit
      source: sample # sample | manual | github | other
      note: Synthetic sample data for Slice 1 demos
```

## JSON Schema

Machine-readable schema: [`../schemas/steertree.schema.json`](../schemas/steertree.schema.json)

Sample: [`../samples/steertree.sample.yaml`](../samples/steertree.sample.yaml)

## Mismatch rules (core)

| Code                        | When                                                       | Slice |
| --------------------------- | ---------------------------------------------------------- | ----- |
| `bet_without_team`          | Bet has empty `fundedTeamIds`                              | 1     |
| `bet_without_kill_criteria` | Missing kill criteria                                      | 1     |
| `platform_overload`         | Platform has X-as-a-Service dependents above threshold (default 8); surface as cognitive-load / flow risk | 1 |
| `team_without_bet`          | Stream-aligned team funds zero bets (warning)              | 1     |
| `orphan_outcome`            | Outcome with zero bets                                     | 1     |
| `bet_without_mos_link`      | Bet has no linked MoS / metric (when link field exists)    | 1.5   |
| `collab_without_end`        | `collaboration` (or facilitation) without `expectedUntil`  | 1.5 |
| `stream_bet_wip`            | Stream-aligned team funded on too many active bets         | 1.5   |
| `enabling_owns_delivery`    | Enabling team listed as sole long-term delivery owner      | 1.5 |

Planned additive fields (Slice 1.5 / 3): bet MoS links, review horizon, funding stance, relationship `expectedUntil`, `groupings[]`, optional `initiatives[]`. Details: [OPERATING_MODEL_ALIGNMENT.md](./OPERATING_MODEL_ALIGNMENT.md) · [ROADMAP.md](./ROADMAP.md).

## Mapping to foreign shapes (later)

| Foreign              | Direction | Notes                                                           |
| -------------------- | --------- | --------------------------------------------------------------- |
| Backstage `Group`    | In        | Map to `teams[]` + `externalRefs`; set `provenance`             |
| Backstage Group YAML | Out       | **Only** if `provenance: catalog_file` and user opts in         |
| SteerBet overlay     | Out       | Always OK - SteerLens-owned kind                                |
| GitHub team          | In        | `externalRefs: [{ system: github, id: org/team }]`              |
| Entra group          | In        | `externalRefs: [{ system: entra, id: objectId }]`               |
| ArchLens entityRef   | Out/In    | Optional `bets[].systemRefs[]` (field reserved, unused Slice 1) |

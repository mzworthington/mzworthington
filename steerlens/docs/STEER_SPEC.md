# SteerSpec

Canonical contract for a SteerLens workspace. Stored as `steertree.yaml` at the workspace root.

Executive UI never shows this document by default; Technical mode and git reviews do.

## Design rules

1. **Display names are enough for Slice 1** — external refs optional.
2. **Stable ids** (`out_…`, `bet_…`, `team_…`) for diff-friendly edits.
3. **Provenance** on teams drives write-back policy later.
4. **No secrets** in SteerSpec.
5. Versioned with `apiVersion` + `kind` for migrations.

## Document shape (v1alpha1)

```yaml
apiVersion: steerlens.dev/v1alpha1
kind: SteerTree
metadata:
  name: platform-transformation
  title: Platform transformation
  description: Company-wide engineering investment alignment
spec:
  vision: Deliver product value three times faster without burning out teams
  outcomes:
    - id: out_delivery
      title: 3× feature delivery
      summary: Year-on-year increase in features reaching customers
      status: on_track   # on_track | at_risk | achieved | abandoned
      metrics:
        - id: met_delivery_rate
          title: Delivery rate
          unit: features/quarter
          current: 42
          baseline: 14
          target: 42
          interpretation: On the target run-rate
  bets:
    - id: bet_idp
      outcomeId: out_delivery
      title: Shared platform golden paths
      successSignal: New services reach production via the golden path within one week
      killCriteria: Fewer than two product teams adopt the path after two quarters
      status: on_track   # proposed | on_track | at_risk | stop_ready | stopped | done
      fundedTeamIds: [team_platform, team_checkout]
  teams:
    - id: team_checkout
      displayName: Customer checkout teams
      role: customer_facing   # customer_facing | shared_platform | coaching_support
      provenance: local       # local | backstage | github | entra | catalog_file
      externalRefs: []
    - id: team_platform
      displayName: Shared platform
      role: shared_platform
      provenance: local
      externalRefs: []
  relationships:
    - fromTeamId: team_checkout
      toTeamId: team_platform
      mode: uses_as_service   # uses_as_service | works_together | coaching
  decisionNotes:
    - id: dec_obs_stop
      betId: bet_obs
      recommendation: stop    # start | continue | stop | rescope
      title: Stop Observability unification?
      why: Spend and coordination cost rose without improving delivery rate
      measured: []
      affectedTeamIds: [team_platform]
      nextStep: Pause rollout; keep existing tooling for two quarters
  evidence:
    - id: ev_1
      metricId: met_delivery_rate
      source: sample          # sample | manual | github | other
      note: Sample data for Slice 1 demos
```

## JSON Schema

Machine-readable schema: [`../schemas/steertree.schema.json`](../schemas/steertree.schema.json)

Sample: [`../samples/steertree.sample.yaml`](../samples/steertree.sample.yaml)

## Mismatch rules (core)

| Code | When |
|------|------|
| `bet_without_team` | Bet has empty `fundedTeamIds` |
| `bet_without_kill_criteria` | Missing kill criteria |
| `platform_overload` | Shared platform has dependents above threshold (default 8) |
| `team_without_bet` | Customer-facing team funds zero bets (warning) |
| `orphan_outcome` | Outcome with zero bets |

## Mapping to foreign shapes (later)

| Foreign | Direction | Notes |
|---------|-----------|-------|
| Backstage `Group` | In | Map to `teams[]` + `externalRefs`; set `provenance` |
| Backstage Group YAML | Out | **Only** if `provenance: catalog_file` and user opts in |
| SteerBet overlay | Out | Always OK — SteerLens-owned kind |
| GitHub team | In | `externalRefs: [{ system: github, id: org/team }]` |
| Entra group | In | `externalRefs: [{ system: entra, id: objectId }]` |
| ArchLens entityRef | Out/In | Optional `bets[].systemRefs[]` (field reserved, unused Slice 1) |

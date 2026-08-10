# ADR 0003 — Suite relationship with ArchLens

## Status

Accepted

## Context

SteerLens and ArchLens both serve engineering leadership concerns but different jobs: investment alignment vs architecture risk. Combining UIs would expose executives to C4/YAML and dilute ArchLens focus.

## Decision

- **Same portfolio**, separate products and visual languages
- Optional data link later: `bets[].systemRefs` → ArchLens entityRefs
- No shared UI component library requirement
- Marketing may say “Lens family”; apps do not share chrome

## Consequences

- Duplicate some infra patterns (Vite, Zod, Cloudflare) acceptably
- Deep links out of SteerLens for architecture detail
- Prevents “one more tab” that dumps sponsors into ChaosLens

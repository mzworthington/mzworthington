# ADR 0004 — Provider-synced teams are reference-only

## Status

Accepted

## Context

Many Backstage installs sync Groups from GitHub or Entra and never commit Group catalog files. Emitting Group YAML would duplicate entities and fight providers.

## Decision

- Ingest teams via Catalog API / GitHub / Entra as **references**
- Persist intent in ValueSpec (+ optional ValueLens-owned overlay kinds)
- **Deny** Group catalog write-back when `provenance` is `backstage` (provider), `github`, or `entra`
- Allow Group YAML round-trip only for `provenance: catalog_file` with explicit opt-in

## Consequences

- Import UX must show provenance
- Connections PRD must educate “we never create directory groups”
- Technical merge mock is Slice 2+, not Slice 1

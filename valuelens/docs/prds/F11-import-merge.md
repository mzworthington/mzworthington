# PRD F11 — Import & merge

**Slice:** 2+ · **Mockup:** `technical/valuelens-03-import-merge.png`

## Problem

Teams already live in Backstage/GitHub/Entra. Leaders should map them into ValueSpec without dual entry or competing Group files.

## Goal

Import directory shapes, preview merge, apply refs into ValueSpec; block forbidden write-backs.

## User stories

- As a Platform engineer, I import Groups from Backstage Catalog API.
- As a Platform engineer, I see provider-synced Groups marked reference-only.
- As a Director, I only see friendly names after import (executive views unchanged).

## Requirements

1. Source tabs: Backstage / GitHub / Entra
2. Diff preview: incoming → ValueSpec team links
3. Banner when Groups are provider-backed: no Group YAML emission
4. Apply updates `teams[]` + `externalRefs` + `provenance`
5. Optional emit ValueBet overlay (opt-in)

## Acceptance

- Provider-backed import never proposes Group catalog file creation
- Catalog-file provenance can opt into YAML round-trip

## XFN

Security: read-only scopes default · Audit log of applied merges (local)

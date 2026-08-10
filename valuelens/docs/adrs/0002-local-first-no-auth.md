# ADR 0002 — Local-first, no auth in Slice 1

## Status

Accepted

## Context

Connectors (Backstage, GitHub, Entra) require identity. Shipping auth before the executive workflow is proven risks building login for an unused product. Leaders also need an air-gappable demo for diligence and steering narratives.

## Decision

Slice 1 is **local only**:

- Open folder / sample workspace
- Persist `valuetree.yaml` on disk
- No accounts, no cloud sync, no mandatory network

Auth arrives in Slice 2 **with** the first live connector — not before.

## Consequences

- Faster feedback on UX and ValueSpec
- PDF/export and mismatch rules must work on sample/manual data
- FS Access API fallback (download/upload) required for Safari gaps
- Security review of OAuth deferred but must be scheduled before Slice 2 release

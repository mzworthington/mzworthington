# PRD F10 — Connections

**Slice:** 2+ · **Mockup:** `steerlens-exec-09-connections.png`

## Problem

Live team directories and evidence require identity. Auth should appear only when connecting systems.

## Goal

Optional connections to Backstage, GitHub, and Entra with clear non-mutation promises.

## User stories

- As a Director, I see that Slice 1 works offline and connections are optional.
- As a Platform engineer, I connect Backstage Catalog API to resolve teams.
- As a security reviewer, I see we never create directory groups.

## Requirements

1. Three connectors with Not connected / Connected state
2. OAuth or token flows per system (detail in Slice 2 security design)
3. Footnote: “We never create directory groups. We only reference teams that already exist.”
4. Disconnect removes tokens; does not delete SteerSpec refs without confirm

## Acceptance

- Cannot enable GitHub import without successful auth
- Copy matches mockup intent

## XFN

Security: token storage design ADR before build · Privacy: least-scope OAuth

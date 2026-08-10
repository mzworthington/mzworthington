# PRD F03 — How work is organised

**Slice:** 1 · **Mockups:** `valuelens-exec-02-org-shape.png`, `valuelens-exec-10-org-empty.png`

## Problem

Executives confuse HR org charts with delivery topology. They need a plain-language view of how teams interact to deliver bets.

## Goal

Edit and present customer-facing teams, shared platform, and coaching support — with relationship labels in English.

## User stories

- As a Director, I can add a team by display name only.
- As a Director, I can say a team “uses [platform] as a service”.
- As a sponsor, I see overload called out calmly when too many teams depend on the platform.
- As a new user, I see an empty state that teaches the three zones.

## Requirements

1. Three zones matching `team.role`
2. Relationships as labelled edges (`uses as a service`, `works together`, `coaching`)
3. Empty state CTA: Add a team
4. Mismatch banner for `platform_overload` (threshold configurable in core, default 8)
5. No Backstage/GitHub/Entra labels in default UI
6. Button: Prepare decision note (deep link to F07)

## Acceptance

- Creating teams + relationship updates ValueSpec
- Empty state matches mockup intent
- Overload appears when dependents ≥ threshold

## XFN

A11y: relationships available as list alternative to canvas · Keyboard add-team flow

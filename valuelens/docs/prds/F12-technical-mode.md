# PRD F12 — Technical mode

**Slice:** 2+ · **Mockups:** `technical/valuelens-01-value-tree.png`, `technical/valuelens-02-topology-fitness.png`

## Problem

Staff+ engineers need refs, provenance, and write-back policy without forcing executives through that density.

## Goal

Secondary surface for ValueSpec detail, topology fitness with policy panel, and advanced exports.

## User stories

- As a principal engineer, I inspect external refs and provenance.
- As a platform engineer, I confirm Group YAML write-back is blocked for Entra-backed teams.

## Requirements

1. Feature flag / nav entry “Technical” not shown in Slice 1 (or clearly disabled)
2. Value tree with ids/refs
3. Write-back policy panel (readouts)
4. Does not replace executive screens; deep-link back

## Acceptance

- Policy panel matches ADR 0004 rules
- Visual density may increase but must not become default theme

## XFN

A11y still required · Do not share ArchLens component theme tokens

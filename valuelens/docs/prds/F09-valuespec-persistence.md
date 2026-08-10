# PRD F09 — ValueSpec persistence

**Slice:** 1 · **Schema:** `schemas/valuetree.schema.json`

## Problem

Without a durable contract, the UI is a toy. With a bad file format, git and future CI cannot help.

## Goal

Load/validate/save `valuetree.yaml` as the workspace source of truth.

## User stories

- As a Director, my edits survive refresh when using a folder workspace.
- As an engineer (future), I can diff ValueSpec in git.

## Requirements

1. Parse YAML → validate with Zod/JSON Schema
2. Serialize stable key order where practical
3. Dirty state + Save (and optional autosave to FS when permission granted)
4. Migration hook for `apiVersion` (passthrough v1alpha1 only in Slice 1)
5. Never write invalid docs over valid ones

## Acceptance

- Round-trip sample YAML preserves ids and semantics
- Invalid file blocks save; shows errors

## XFN

Security: no secret fields · Resilience: atomic write where FS allows

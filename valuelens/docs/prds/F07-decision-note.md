# PRD F07 — Decision note

**Slice:** 1 · **Mockup:** `valuelens-exec-03-decision-note.png`

## Problem

Steering committees need a one-page recommendation, not a slide archaeology dig.

## Goal

Author start / continue / stop / re-scope notes with why, measured, who is affected, next step.

## User stories

- As a Director, I recommend stopping a bet with evidence attached.
- As a sponsor, I can export or navigate to board pack including this note.

## Requirements

1. Recommendation enum in plain labels
2. Sections: Why, What we measured, Who is affected, Next step
3. Link optional bet
4. Persist under `spec.decisionNotes`
5. Actions: Save, Export PDF (F08), Share with board (same as export Slice 1)

## Acceptance

- Creating a stop note for Observability sample persists and lists on steering summary
- Measured lines accept free text bullets

## XFN

A11y: heading structure for memo · Print-friendly CSS

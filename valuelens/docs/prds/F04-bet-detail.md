# PRD F04 — Bet detail

**Slice:** 1 · **Mockup:** `valuelens-exec-06-bet-detail.png`

## Problem

Bets need enough structure for decisions without becoming project plans.

## Goal

Edit one bet as a briefing: success signal, kill criteria, funded teams, status.

## User stories

- As a Director, I update kill criteria so stop decisions are pre-agreed.
- As a Director, I assign funded teams by picking display names from the workspace.

## Requirements

1. Fields: title, success signal, kill criteria, funded teams, status
2. Outcome shown read-only (change outcome = advanced/technical later)
3. Save + Back to steering
4. Validation: kill criteria required; warn if no funded teams

## Acceptance

- Save persists to `valuetree.yaml`
- Invalid empty title blocks save with plain language

## XFN

A11y: labelled inputs · Dirty-state warning on navigate away

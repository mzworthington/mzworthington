# PRD F02 — Steering overview

**Slice:** 1 · **Mockup:** `steerlens-exec-01-steering.png`

## Problem

Sponsors need one screen that answers “what are we funding and how is it going?”

## Goal

Show vision, outcomes, bets, and statuses as an interactive board pack — not a backlog.

## User stories

- As a CPO, I see a short alignment summary (e.g. three bets funded, one recommended to stop).
- As a Director, I can open a bet from this view.
- As a Director, I never see YAML or entity refs here.

## Requirements

1. Header with workspace title + period label (editable later; static OK Slice 1)
2. Vision line
3. Outcome grouping with bets listed beneath (title, one metric cue, status word)
4. Status vocabulary: On track / At risk / Stop (map from SteerSpec enums)
5. Nav to Outcomes, How work is organised, Decision notes, Export

## Acceptance

- Sample workspace renders three bets with distinct statuses
- Clicking a bet opens F04
- Mismatch count may appear as calm summary text (not alarmist toast spam)

## XFN

A11y: status not colour-only · Performance: render &lt; 100ms after load

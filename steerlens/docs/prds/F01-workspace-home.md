# PRD F01 — Workspace home

**Slice:** 1 · **Mockup:** `steerlens-exec-05-workspace-home.png`

## Problem

Leaders need a zero-friction way to begin without accounts or cloud setup.

## Goal

Open or create a local workspace in under one minute.

## User stories

- As an Engineering Director, I can start from a sample so I can explore the product immediately.
- As a Director, I can open a folder with `steertree.yaml` so my real narrative persists on disk.
- As a Director, I understand that no account is required.

## Requirements

1. Primary CTA: **Open folder** (FS Access when available)
2. Secondary: **Start from sample** (loads `samples/steertree.sample.yaml`)
3. List recent workspaces (localStorage of folder names / handles where permitted)
4. Copy: “Everything stays on this device until you choose to connect systems.”
5. No auth chrome

## Acceptance

- Given no prior state, Starting from sample lands on Steering with sample data
- Given a valid folder, Open folder loads SteerSpec
- Given invalid YAML, show plain-language errors; do not write

## XFN

A11y: CTAs keyboard accessible · Privacy: no network

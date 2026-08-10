# PRD F08 — Export board pack

**Slice:** 1 · **Mockup:** `steerlens-exec-08-export.png`

## Problem

Distribution to leadership must not require giving everyone SteerLens access (especially pre-auth).

## Goal

Download a PDF (or print-to-PDF) board pack with selected sections.

## User stories

- As a Director, I choose sections (Steering, Org shape, Outcomes, Decision notes).
- As a Director, I download a pack that looks like the mockup’s calm memo style.
- As a technical user, I can find advanced exports later without cluttering the default.

## Requirements

1. Section checklist
2. Preview thumbnail/panel
3. Download PDF via print CSS (Slice 1) 
4. Small link: Technical exports… (disabled or hidden until Slice 2)
5. Filenames: `steerlens-board-pack-<workspace>-<date>.pdf`

## Acceptance

- With all sections checked, print preview includes sample decision note
- Unchecking Org shape omits that section

## XFN

Performance: generate preview &lt; 2s for sample · A11y: checklist labels

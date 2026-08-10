# SteerLens — product specification

**Status:** Draft (pre-implementation)  
**Audience:** Product, design, engineering  
**Slice 1:** Local-only, no authentication

## 1. Problem

Engineering Directors and executive sponsors must align **outcomes**, **funded bets**, and **team shape**, then act on evidence. Today that alignment lives in slide decks. Jira holds work; Backstage holds services; Entra/GitHub hold people. Nothing holds the investment contract — so steering meetings re-litigate priorities without a shared, versionable source of truth.

## 2. Product thesis

SteerLens is an **interactive board pack**: edit strategy and topology intent in plain language, persist a canonical **SteerSpec**, export decision notes. It reads and later writes *around* existing systems of record; it does not become one.

## 3. Target users

| Persona | Need |
|---------|------|
| Engineering Director / Head of Platform | Align bets to topology; decide start/stop/continue with evidence |
| CPO / CTO / transformation sponsor | Readable steering view; decision notes without tooling jargon |
| Staff+/principal (secondary) | Technical mode: refs, imports, overlays, CI validation |
| Platform engineer (later) | Connect Catalog API; enforce write-back policy |

**Non-users (default):** squad members planning sprints — they stay in Jira.

## 4. Bounded contexts

| Context | Responsibility |
|---------|----------------|
| **Investment alignment** | Outcomes, bets, kill criteria, decision notes |
| **Topology intent** | How teams relate for delivery (not HR reporting lines) |
| **Evidence** | Leading indicators attached to outcomes/bets (sample in Slice 1; live later) |
| **Identity & directories** (later) | External team refs only — owned by Entra/GitHub/Backstage |
| **Work execution** (external) | Jira — link/annotate later, never dual backlog |
| **System architecture** (external) | ArchLens — optional bet → system refs later |

## 5. Domain glossary

| Term | Definition |
|------|------------|
| **Outcome** | Measurable change the organisation wants (e.g. “3× feature delivery”) |
| **Bet** | Time-boxed investment intended to move an outcome; has success signal and stop rule |
| **Kill criteria** | Pre-agreed condition that triggers stop or re-scope |
| **Team** | Delivery group referenced by display name (Slice 1) and optional external ref (later) |
| **Topology intent** | Desired interaction shape: customer-facing, shared platform, coaching/support; modes such as “uses as a service” / “works together” |
| **Mismatch** | Detectable conflict (e.g. bet funded with no delivering team; platform overloaded) |
| **Decision note** | One-page start/stop/continue recommendation with rationale and evidence |
| **SteerSpec** | Canonical YAML/JSON document for a workspace (`steertree.yaml`) |
| **Workspace** | Local folder containing SteerSpec (+ optional exports) |
| **Overlay** (later) | Git-managed Backstage entities SteerLens owns — never replacement Groups for provider sync |
| **Board pack** | PDF/export for leadership distribution |

**Aggregate roots:** `Workspace` (contains SteerSpec document), `DecisionNote`.

## 6. Principles

1. **Executive surface first** — no YAML, entity refs, or provider names in default UI.
2. **Reference, don’t replace** — never emit competing Group catalog files for provider-synced teams.
3. **Local-first Slice 1** — full value offline; auth only when connectors need it.
4. **Vastly different from ArchLens** — suite link in data, not in chrome.
5. **Git-friendly contract** — SteerSpec is diffable and reviewable even before CI exists.

## 7. Acceptance scenarios (Gherkin)

### Feature: Local workspace

```gherkin
Feature: Open a local workspace
  Scenario: Start from sample
    Given the leader has no prior workspace
    When they choose "Start from sample"
    Then they see a steering overview with example outcomes and bets
    And no account or sign-in is required

  Scenario: Open existing folder
    Given a folder containing a valid steertree.yaml
    When the leader opens that folder
    Then SteerLens loads the SteerSpec into steering and org views

  Scenario: Invalid SteerSpec
    Given a folder with an invalid steertree.yaml
    When the leader opens that folder
    Then they see a plain-language explanation of what is wrong
    And they can cancel without corrupting the file
```

### Feature: Steering and bets

```gherkin
Feature: Steering overview
  Scenario: View alignment
    Given a workspace with three bets
    When the leader opens Steering
    Then they see outcomes, bets, status, and a short alignment summary

  Scenario: Edit a bet
    Given a bet on the steering view
    When the leader opens the bet and changes kill criteria
    Then the workspace SteerSpec is updated
    And the steering view reflects the change
```

### Feature: How work is organised

```gherkin
Feature: Topology intent
  Scenario: Shape teams in plain language
    Given a workspace
    When the leader adds customer-facing and shared platform teams
    And sets a "uses as a service" relationship
    Then the org-shape view shows the relationship without technical identifiers

  Scenario: Surface overload mismatch
    Given a shared platform team with many dependents
    When the leader opens How work is organised
    Then they see a calm mismatch message about platform overload
```

### Feature: Decision and export

```gherkin
Feature: Decision note and board pack
  Scenario: Recommend stop
    Given evidence that a bet is not moving its outcome
    When the leader creates a decision note recommending Stop
    Then the note includes why, what was measured, who is affected, and next step

  Scenario: Export board pack
    Given decision notes and an org shape
    When the leader exports a board pack
    Then they receive a PDF suitable for steering distribution
    And technical exports remain behind an advanced action
```

## 8. Cross-functional acceptance (Slice 1)

| Concern | Criteria |
|---------|----------|
| Accessibility | WCAG 2.2 AA for executive flows; keyboard reachable primary actions; sufficient contrast on light editorial theme |
| Privacy | No network calls required for core flows; no PII beyond team display names the user types |
| Performance | Open sample workspace &lt; 2s on mid-tier laptop; steering interaction feels instant (&lt; 100ms for local state updates) |
| Resilience | Autosave or explicit save with clear dirty state; never silently overwrite invalid files |
| Security | No auth Slice 1; no secrets storage; later connectors use OS/browser OAuth — out of scope here |
| Critical journeys | Open sample → edit bet → view org shape → create decision note → export PDF |

## 9. Behaviour catalog notes (pre-code)

Greenfield — no existing tests. Design phase should add:

- Unit: SteerSpec parse/validate/migrate; mismatch rules; merge of team display names
- Component: steering, org-shape, decision note forms
- Browser E2E: critical journey above with sample fixture
- A11y: axe on executive routes
- Visual: optional Playwright screenshots vs mockups (non-blocking Slice 1)

## 10. Out of scope (product)

- Sprint boards, OKR social check-ins, employee directory
- Auto-mutating Entra or GitHub team membership
- Replacing ArchLens canvas or ChaosLens
- Multi-user realtime collaboration (revisit after auth)

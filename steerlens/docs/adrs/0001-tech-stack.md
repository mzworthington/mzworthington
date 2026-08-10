# ADR 0001 — Tech stack for SteerLens

## Status

Accepted

## Context

SteerLens needs a stack that supports a local-first SPA, a strict SteerSpec domain model, and later OAuth connectors — while staying familiar to the ArchLens / Cloudflare portfolio without sharing UI chrome.

## Decision

- TypeScript monorepo with `pnpm` + `mise`
- React 19 + Vite + Tailwind for `@steerlens/app`
- Zod-based `@steerlens/core` for SteerSpec
- Vitest + Playwright
- Cloudflare Pages for later hosting
- No Next.js for Slice 1

## Consequences

- Fast path to reuse Cloudflare/Pulumi patterns from existing repos
- Clear split between pure domain and UI
- Dedicated visual theme required (cannot default to ArchLens tokens)

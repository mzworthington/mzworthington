# Agent Handshake

Standards and lifecycle agents live in `~/.agents` ([Waykit](https://github.com/mzworthington/waykit)).

Start from `~/.agents/AGENTS.md` (thin index). **Do not** bulk-read philosophy, SOPs, or skills up front.

| Situation | Load |
|-----------|------|
| Any task | `~/.agents/AGENTS.md` invariants + phase table |
| Architecture / new structure | `CODING_PHILOSOPHY.md` (or kit-knowledge `get_philosophy_section`) |
| Feature lifecycle | `skills/agent-orchestrator` |
| Bug / CI / live symptom | `skills/agent-debug` |
| Cloudflare Pages / RUM / Pulumi | `skills/agent-cloudflare-ops` (`wk mcp cloudflare-ops --project`) |
| PostHog product analytics | `skills/agent-posthog` (`wk mcp posthog --project`) |
| Infra under `infra/` | `skills/profile-iac` then `skills/framework-pulumi` |
| Handshake / kit bootstrap | `wk align .`. Community files: `wk doctor .` |
| SOP / handover lookup | kit-knowledge MCP |
| Durable project facts | memory MCP (glossary, SLOs, prefs — never secrets) |

Phase handovers: `~/.agents/handover/mzworthington/`.

For bugs and failed jobs, use `agent-debug`. Do not open the full feature lifecycle unless RCA needs a new capability.

## Project notes

- Public site is Jekyll (GitHub Pages) at the repo root (`mise.toml`: Ruby + Node).
- Cloudflare Pages/Pulumi lives under `infra/cloudflare`.
- Conventional commit-msg: `.githooks/commit-msg` (`git config core.hooksPath .githooks` once per clone).

## Toolchain

Declared in `mise.toml`. Serve locally with `bin/serve.sh` after `bin/bootstrap.sh`.

MCP: kit `default` in `.cursor/mcp.json`. Do not stack Cloudflare or PostHog onto that file. For live CF work, `wk mcp cloudflare-ops --project`. For PostHog, `wk mcp posthog --project`. Then restore `wk mcp default --project`.

Before handover of infra changes: `cd infra/cloudflare && pnpm install && pnpm typecheck` (and `pulumi preview` with stack selected when credentials are available).

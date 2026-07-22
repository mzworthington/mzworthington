#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

if ! command -v mise >/dev/null 2>&1; then
  echo "error: mise is required (https://mise.jdx.dev)" >&2
  exit 1
fi

echo "==> Trusting mise config"
mise trust -q 2>/dev/null || true

echo "==> Installing Ruby $(grep '^ruby' mise.toml | cut -d'"' -f2)"
mise install

echo "==> Installing gems"
mise exec -- bundle install

echo "==> Done. Run ./bin/serve to start the dev server."

#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

if ! command -v mise >/dev/null 2>&1; then
  echo "error: mise is required (https://mise.jdx.dev)" >&2
  exit 1
fi

if [[ ! -f Gemfile.lock ]]; then
  echo "error: Gemfile.lock not found — run ./bin/bootstrap first" >&2
  exit 1
fi

exec mise exec -- bundle exec jekyll serve --livereload "$@"

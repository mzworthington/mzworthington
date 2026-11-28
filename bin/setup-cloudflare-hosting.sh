#!/usr/bin/env bash
# Domain defaults, then the edge-dns command on PATH.
set -euo pipefail

cd "$(dirname "${BASH_SOURCE[0]}")/.."

: "${PULUMI_STACK:=prod}"
: "${DOMAIN:=mzworthington.co.uk}"
export PULUMI_STACK DOMAIN

command -v setup-cloudflare-hosting >/dev/null || {
  echo "Add edge-dns/cmd to PATH" >&2
  exit 1
}

exec setup-cloudflare-hosting "$@"

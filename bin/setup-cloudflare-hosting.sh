#!/usr/bin/env bash

set -euo pipefail

EDGE_DNS_REF="${EDGE_DNS_REF:-main}"
SCRIPT_URL="https://raw.githubusercontent.com/mzworthington/edge-dns/${EDGE_DNS_REF}/scripts/setup-cloudflare-hosting.sh"

export PRODUCT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$PRODUCT_ROOT"

# Repo defaults (non-secret). Env / bws / .env can override.
: "${PULUMI_STACK:=prod}"
: "${DOMAIN:=mzworthington.co.uk}"
: "${WWW_DOMAIN:=www.mzworthington.co.uk}"
: "${PAGES_PROJECT_NAME:=mzworthington}"
export PULUMI_STACK DOMAIN WWW_DOMAIN PAGES_PROJECT_NAME

tmpdir="$(mktemp -d)"
trap 'rm -rf "$tmpdir"' EXIT
curl -fsSL "$SCRIPT_URL" -o "${tmpdir}/setup-cloudflare-hosting.sh"
bash "${tmpdir}/setup-cloudflare-hosting.sh" "$@"

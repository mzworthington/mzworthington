#!/usr/bin/env bash
# Bootstrap Cloudflare Pages secrets + Pulumi stack config for apex + www.
# Validates bws secrets (optional), syncs to GitHub Actions, configures Pulumi.
# Does not run pulumi preview/up.
#
# Assumes an existing, active Cloudflare zone (edge-dns). Attaches apex + www
# CNAMEs in that zone; does not create zones or configure nameservers.
#
# Prefers values from repo-root `.env` (gitignored; see `.env.example`).
# Shell-exported vars override `.env`. CI uses GitHub secrets/vars instead.
#
# Requires (env or .env):
#   PULUMI_STACK, DOMAIN, WWW_DOMAIN, PAGES_PROJECT_NAME
# Optional bws:
#   BWS_ACCESS_TOKEN, BWS_PROJECT_ID
#   (if unset, reads CLOUDFLARE_* / PULUMI_ACCESS_TOKEN from the environment)
#
# Usage:
#   cp .env.example .env   # edit tokens
#   bin/setup-cloudflare-hosting.sh
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

if [[ -f "${ROOT}/.env" ]]; then
  set -a
  # shellcheck disable=SC1091
  source "${ROOT}/.env"
  set +a
fi

: "${PULUMI_STACK:?Set PULUMI_STACK (Pulumi stack name); see .env.example}"
: "${DOMAIN:?Set DOMAIN (apex / existing Cloudflare zone name)}"
: "${WWW_DOMAIN:?Set WWW_DOMAIN (e.g. www.mzworthington.co.uk)}"
: "${PAGES_PROJECT_NAME:?Set PAGES_PROJECT_NAME}"

STACK="${PULUMI_STACK}"

for c in gh pulumi jq curl pnpm; do
  command -v "$c" >/dev/null || { echo "Missing: $c"; exit 1; }
done
gh auth status >/dev/null 2>&1 || { echo "Run: gh auth login"; exit 1; }

USE_BWS=0
if [[ -n "${BWS_ACCESS_TOKEN:-}" && -n "${BWS_PROJECT_ID:-}" ]]; then
  command -v bws >/dev/null || { echo "Missing: bws (or unset BWS_* to use env secrets)"; exit 1; }
  USE_BWS=1
fi

export ROOT DOMAIN WWW_DOMAIN STACK PAGES_PROJECT_NAME USE_BWS
export BWS_PROJECT_ID="${BWS_PROJECT_ID:-}"

if [[ "$USE_BWS" == "1" ]]; then
  bws run --project-id "$BWS_PROJECT_ID" -- \
    env BWS_ACCESS_TOKEN="${BWS_ACCESS_TOKEN}" USE_BWS=1 \
    bash
else
  env USE_BWS=0 bash
fi <<'EOF'
set -euo pipefail

die() { echo "✗ $*" >&2; exit 1; }

require_secret() {
  local name=$1
  if [[ "${USE_BWS:-0}" == "1" ]]; then
    [[ -n "${!name:-}" ]] || die "${name} not set; add it to bws project ${BWS_PROJECT_ID}"
  else
    [[ -n "${!name:-}" ]] || die "${name} not set"
  fi
}

bws_put() {
  local key=$1 val=$2 id
  [[ "${USE_BWS:-0}" == "1" ]] || return 0
  : "${BWS_ACCESS_TOKEN:?Missing BWS_ACCESS_TOKEN}"
  id=$(bws -t "$BWS_ACCESS_TOKEN" secret list "$BWS_PROJECT_ID" -o json \
    | jq -r --arg k "$key" '.[]?|select(.key==$k)|.id' | head -1)
  if [[ -n "$id" && "$id" != "null" ]]; then
    bws -t "$BWS_ACCESS_TOKEN" secret edit --key "$key" --value "$val" "$id" >/dev/null
  else
    bws -t "$BWS_ACCESS_TOKEN" secret create "$key" "$val" "$BWS_PROJECT_ID" >/dev/null
  fi
}

cf_api() {
  curl -sS -H "Authorization: Bearer ${CLOUDFLARE_API_TOKEN}" \
    -H "Content-Type: application/json" "$@"
}

pulumi_token_valid() {
  [[ -n "${PULUMI_ACCESS_TOKEN:-}" ]] \
    && PULUMI_ACCESS_TOKEN="$PULUMI_ACCESS_TOKEN" pulumi whoami >/dev/null 2>&1
}

mint_pulumi_token() {
  echo "→ Creating Pulumi access token (pulumi login required)"
  local token
  token=$( ( unset PULUMI_ACCESS_TOKEN
    pulumi whoami >/dev/null 2>&1 || pulumi login
    pulumi api CreatePersonalToken -F description="cloudflare-hosting-ci-${DOMAIN}" -F expires=0 --output json
  ) | jq -r '.tokenValue // empty')
  [[ -n "$token" ]] || die "pulumi api CreatePersonalToken failed; run: pulumi login"
  PULUMI_ACCESS_TOKEN="$token"
  export PULUMI_ACCESS_TOKEN
  bws_put PULUMI_ACCESS_TOKEN "$PULUMI_ACCESS_TOKEN"
}

require_secret CLOUDFLARE_API_TOKEN

echo "→ Cloudflare account"
if [[ -z "${CLOUDFLARE_ACCOUNT_ID:-}" ]]; then
  mapfile -t ACCOUNTS < <(cf_api "https://api.cloudflare.com/client/v4/accounts" \
    | jq -r '.result[]? | "\(.id)\t\(.name)"')
  if [[ ${#ACCOUNTS[@]} -eq 1 ]]; then
    CLOUDFLARE_ACCOUNT_ID="${ACCOUNTS[0]%%$'\t'*}"
    bws_put CLOUDFLARE_ACCOUNT_ID "$CLOUDFLARE_ACCOUNT_ID"
  elif [[ ${#ACCOUNTS[@]} -eq 0 ]]; then
    die "No Cloudflare accounts visible for this API token"
  else
    printf '%s\n' "${ACCOUNTS[@]}" | sed 's/^/  /'
    die "CLOUDFLARE_ACCOUNT_ID required when more than one account is visible"
  fi
fi
require_secret CLOUDFLARE_ACCOUNT_ID

echo "→ Zone ${DOMAIN}"
# Always resolve by DOMAIN name. A shared BWS project may already have
# CLOUDFLARE_ZONE_ID for a different product; do not trust it blindly.
RESOLVED_ZONE_ID=$(cf_api "https://api.cloudflare.com/client/v4/zones?name=${DOMAIN}" \
  | jq -r '.result[0].id // empty')
[[ -n "$RESOLVED_ZONE_ID" ]] || die "No Cloudflare zone named ${DOMAIN} visible to this API token"

if [[ -n "${CLOUDFLARE_ZONE_ID:-}" && "$CLOUDFLARE_ZONE_ID" != "$RESOLVED_ZONE_ID" ]]; then
  echo "  ⚠ CLOUDFLARE_ZONE_ID from env/bws does not match zone ${DOMAIN}"
  echo "    using zone id for ${DOMAIN} instead (not overwriting shared bws secret)"
fi
CLOUDFLARE_ZONE_ID="$RESOLVED_ZONE_ID"

ZONE_NAME=$(cf_api "https://api.cloudflare.com/client/v4/zones/${CLOUDFLARE_ZONE_ID}" \
  | jq -r '.result.name // empty')
ZONE_STATUS=$(cf_api "https://api.cloudflare.com/client/v4/zones/${CLOUDFLARE_ZONE_ID}" \
  | jq -r '.result.status // empty')
echo "  ${ZONE_NAME} (${ZONE_STATUS})"
if [[ "$ZONE_STATUS" != "active" ]]; then
  die "Zone ${DOMAIN} must already be active on Cloudflare (edge-dns); this script does not configure zones"
fi

if [[ -z "${PULUMI_ACCESS_TOKEN:-}" ]]; then
  mint_pulumi_token
elif pulumi_token_valid; then
  echo "→ Pulumi access token ok"
else
  echo "→ Pulumi access token invalid; minting a new one"
  mint_pulumi_token
fi

echo "→ GitHub Actions secrets + vars"
printf '%s' "$CLOUDFLARE_API_TOKEN" | gh secret set CLOUDFLARE_API_TOKEN
printf '%s' "$CLOUDFLARE_ACCOUNT_ID" | gh secret set CLOUDFLARE_ACCOUNT_ID
printf '%s' "$CLOUDFLARE_ZONE_ID" | gh secret set CLOUDFLARE_ZONE_ID
printf '%s' "$PULUMI_ACCESS_TOKEN" | gh secret set PULUMI_ACCESS_TOKEN
gh variable set PULUMI_PAGES_PROJECT_NAME --body "$PAGES_PROJECT_NAME"
gh variable set PULUMI_APEX_DOMAIN --body "$DOMAIN"
gh variable set PULUMI_WWW_DOMAIN --body "$WWW_DOMAIN"

echo "→ Pulumi stack ${STACK}"
cd "${ROOT}/infra/cloudflare"
pnpm install --frozen-lockfile
pulumi stack select "${STACK}" 2>/dev/null || pulumi stack init "${STACK}"
pulumi config set accountId "$CLOUDFLARE_ACCOUNT_ID"
pulumi config set zoneId "$CLOUDFLARE_ZONE_ID"
pulumi config set pagesProjectName "$PAGES_PROJECT_NAME"
pulumi config set apexDomain "$DOMAIN"
pulumi config set wwwDomain "$WWW_DOMAIN"
pulumi config set --secret cloudflare:apiToken "$CLOUDFLARE_API_TOKEN"

echo "Done. Run 'cd infra/cloudflare && pulumi up' or merge to main (CI runs pulumi + deploy)."
echo "Pages project: ${PAGES_PROJECT_NAME}"
echo "Apex:          https://${DOMAIN}"
echo "www:           https://${WWW_DOMAIN}"
echo "Also:          https://${PAGES_PROJECT_NAME}.pages.dev after first Pages deploy."
echo "After cutover: disable GitHub Pages in repo settings."
EOF

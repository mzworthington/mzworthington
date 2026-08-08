# Cloudflare hosting: secrets checklist

Companion to [infra/cloudflare/README.md](../infra/cloudflare/README.md). Real account IDs, zone IDs, and API tokens belong in **Bitwarden**, or **GitHub Actions secrets/vars** — never in committed sources.

Shared CI/bootstrap tooling lives in [edge-dns](https://github.com/mzworthington/edge-dns) ([reusable Cloudflare CI](https://github.com/mzworthington/edge-dns/blob/main/docs/reusable-cloudflare-ci.md)). This repo keeps thin shims only.

## Architecture

| Layer | Role |
|-------|------|
| **edge-dns** | Zone ownership, nameservers, DNSSEC baselines; shared Actions + bootstrap script |
| **Pulumi** (`infra/cloudflare`) | Pages project, apex + www DNS CNAMEs, `PagesDomain` SSL bindings, Web Analytics, Observatory |
| **CI + Wrangler** | `jekyll build` → `wrangler pages deploy _site` |
| **`_redirects`** | www → apex 301 |

## Bootstrap

Preferred path: secrets in **Bitwarden Secrets Manager** (no `.env`). Site identity is defaulted in `bin/setup-cloudflare-hosting.sh`.

```bash
export BWS_ACCESS_TOKEN="..."
export BWS_PROJECT_ID="..."

gh auth login
pulumi login
bin/setup-cloudflare-hosting.sh
```

The shim downloads [`scripts/setup-cloudflare-hosting.sh`](https://github.com/mzworthington/edge-dns/blob/main/scripts/setup-cloudflare-hosting.sh) from edge-dns (`EDGE_DNS_REF`, default `main`).

### BWS project keys

| Key | Required | Notes |
|-----|----------|-------|
| `CLOUDFLARE_API_TOKEN` | yes | See scopes below |
| `CLOUDFLARE_ACCOUNT_ID` | no | Resolved from the API token if omitted |
| `PULUMI_ACCESS_TOKEN` | no | Minted after `pulumi login` if omitted / invalid |

`BWS_ACCESS_TOKEN` and `BWS_PROJECT_ID` stay in your shell — they cannot bootstrap themselves.

Then `cd infra/cloudflare && pulumi up`, or merge to `main` for CI.

### Existing zone required

The zone (`DOMAIN=mzworthington.co.uk`) must already be **active** on Cloudflare via [edge-dns](https://github.com/mzworthington/edge-dns). This repo does not create zones or change registrar nameservers.

## Secrets / vars

| Key | Kind | Used by |
|-----|------|---------|
| `CLOUDFLARE_API_TOKEN` | secret | Wrangler + Pulumi |
| `CLOUDFLARE_ACCOUNT_ID` | secret | Wrangler + Pulumi |
| `CLOUDFLARE_ZONE_ID` | secret | Pulumi DNS / domains |
| `PULUMI_ACCESS_TOKEN` | secret | Pulumi workflow |
| `PULUMI_PAGES_PROJECT_NAME` | variable | Deploy + Pulumi |
| `PULUMI_PAGES_HOSTNAMES` | variable | Pulumi (`["mzworthington.co.uk","www.mzworthington.co.uk"]`) |
| `PULUMI_APEX_DOMAIN` | variable | Legacy stack keys (`apexDomain`) |
| `PULUMI_WWW_DOMAIN` | variable | Legacy stack keys (`wwwDomain`) |

Prefer a **dedicated BWS project** per site so zone ids are not shared. Bootstrap always resolves the zone from `DOMAIN`.

## API token scopes

- Account → **Cloudflare Pages: Edit**
- Account → **Account Settings: Edit** (Web Analytics)
- Zone → **Zone: Read**
- Zone → **DNS: Edit** (custom domains)
- Zone → **Zone Settings: Edit** (Observatory scheduled tests)

## Cutover from GitHub Pages

1. Bootstrap secrets + `pulumi up` (creates Pages project + apex/www records).
2. Merge CI so Wrangler deploys `_site` on `main`.
3. Verify `https://mzworthington.pages.dev`, then apex and www after DNS/SSL.
4. Disable **GitHub Pages** in repo settings (Settings → Pages → None).

## Health checks

```bash
curl -sI https://mzworthington.pages.dev | head -5
curl -sI https://mzworthington.co.uk | head -5
curl -sI https://www.mzworthington.co.uk | head -5   # expect 301 → apex
curl -sI https://mzworthington.co.uk | grep -i x-github || echo "not GitHub Pages"
```

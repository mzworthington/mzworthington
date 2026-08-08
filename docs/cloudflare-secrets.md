# Cloudflare hosting: secrets checklist

Companion to [infra/cloudflare/README.md](../infra/cloudflare/README.md). Real account IDs, zone IDs, and API tokens belong in **local `.env`** (gitignored), **Bitwarden**, or **GitHub Actions secrets/vars** — never in committed sources.

## Architecture

Same pattern as [ArchLens](https://github.com/mzworthington/archlens) and the [React Cloudflare Template](https://github.com/mzworthington/react-cloudflare-template):

| Layer | Role |
|-------|------|
| **edge-dns** | Zone ownership, nameservers, DNSSEC baselines |
| **Pulumi** (`infra/cloudflare`) | Pages project, apex + www DNS CNAMEs, `PagesDomain` SSL bindings, Web Analytics, Observatory |
| **CI + Wrangler** | `jekyll build` → `wrangler pages deploy _site` |
| **`_redirects`** | www → apex 301 |

## Bootstrap

```bash
cp .env.example .env   # edit tokens (DOMAIN / WWW_DOMAIN already set)

# Optional: Bitwarden Secrets Manager
export BWS_ACCESS_TOKEN="..."
export BWS_PROJECT_ID="..."

gh auth login
pulumi login
bin/setup-cloudflare-hosting.sh
```

Then `cd infra/cloudflare && pulumi up`, or merge to `main` for CI.

### Existing zone required

The zone (`DOMAIN=mzworthington.co.uk`) must already be **active** on Cloudflare via [edge-dns](https://github.com/mzworthington/edge-dns). This repo does not create zones or change registrar nameservers. `*.pages.dev` works without custom domains attached.

## Secrets / vars

| Key | Kind | Used by |
|-----|------|---------|
| `CLOUDFLARE_API_TOKEN` | secret | Wrangler + Pulumi |
| `CLOUDFLARE_ACCOUNT_ID` | secret | Wrangler + Pulumi |
| `CLOUDFLARE_ZONE_ID` | secret | Pulumi DNS / domains |
| `PULUMI_ACCESS_TOKEN` | secret | Pulumi workflow |
| `PULUMI_PAGES_PROJECT_NAME` | variable | Deploy + Pulumi |
| `PULUMI_APEX_DOMAIN` | variable | Pulumi |
| `PULUMI_WWW_DOMAIN` | variable | Pulumi |

Prefer a **dedicated BWS project** (or local `.env`) per site so `CLOUDFLARE_ZONE_ID` is not shared across zones. Bootstrap always resolves the zone from `DOMAIN` and warns if an injected zone id does not match.

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
4. Disable **GitHub Pages** in repo settings (Settings → Pages → None) so the old host stops serving.

## Health checks

```bash
curl -sI https://mzworthington.pages.dev | head -5
curl -sI https://mzworthington.co.uk | head -5
curl -sI https://www.mzworthington.co.uk | head -5   # expect 301 → apex
# Leftover GitHub Pages often includes x-github-request-id:
curl -sI https://mzworthington.co.uk | grep -i x-github || echo "not GitHub Pages"
```

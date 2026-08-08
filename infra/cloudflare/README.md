# Cloudflare infrastructure (Pulumi)

Pages project, custom domains, and DNS for [mzworthington.co.uk](https://mzworthington.co.uk). The Jekyll site is built in CI and deployed with `wrangler pages deploy`.

The zone itself lives in [edge-dns](https://github.com/mzworthington/edge-dns); this stack only manages product DNS records + Pages.

## Resources

| Resource | Purpose |
|----------|---------|
| `PagesProject` | Direct-upload project (`mzworthington`) |
| `DnsRecord` (`apex-pages`, `www-pages`) | Proxied CNAMEs → `pagesProject.subdomain` |
| `PagesDomain` | Attaches apex + `www` to the Pages project (SSL / hostname binding) |
| `WebAnalyticsSite` | Zone RUM / Web Analytics (`autoInstall`) |
| `ObservatoryScheduledTest` | Synthetic Speed test for the apex hostname |

If Web Analytics or Observatory was enabled in the dashboard first, import before `pulumi up`:

```bash
pulumi import 'cloudflare:index/webAnalyticsSite:WebAnalyticsSite' web-analytics '<account_id>/<site_id>'
pulumi import 'cloudflare:index/observatoryScheduledTest:ObservatoryScheduledTest' observatory-apex '<zone_id>/<url>'
```

## Quick setup

See [docs/cloudflare-secrets.md](../../docs/cloudflare-secrets.md), then from the repo root:

```bash
cp .env.example .env   # edit DOMAIN / WWW_DOMAIN / tokens
bin/setup-cloudflare-hosting.sh
```

Then apply infrastructure:

```bash
cd infra/cloudflare
pulumi up
```

Or merge to `main` — `.github/workflows/pulumi-cloudflare.yml` runs **preview**, then waits for a **pulumi-prod** environment approval before `pulumi up`.

**Manual gate:** GitHub → Settings → Environments → create **`pulumi-prod`** with **Required reviewers**.

## Local Pulumi commands

```bash
cd infra/cloudflare
pnpm install
pulumi stack select prod
pulumi preview
pulumi up
```

## Stack config

`Pulumi.prod.yaml` is **gitignored** — it may contain account IDs and an encrypted Cloudflare API token after bootstrap. Committed template: `Pulumi.prod.yaml.example`. CI configures the stack from **GitHub Actions secrets** on each run.

## Related files

| Path | Purpose |
|------|---------|
| `wrangler.toml` | Pages project name + `_site` output |
| `_redirects` | www → apex 301 |
| `.github/workflows/pulumi-cloudflare.yml` | Preview on PR/main; gated `up` via `pulumi-prod` |
| `.github/actions/setup-pulumi-cloudflare` | Shared Node/pnpm + stack config |
| `.github/workflows/ci.yml` | Jekyll build + wrangler deploy |
| `bin/setup-cloudflare-hosting.sh` | Bootstrap: secrets → gh + pulumi config |

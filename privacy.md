---
layout: page
title: Privacy policy
permalink: /privacy/
---

Last updated 3 September 2026.

This page says what this site does with information when you use [mzworthington.co.uk](https://mzworthington.co.uk). It is a plain-language notice, not legal advice.

The site is the personal site of [Matthew Z Worthington]({{ site.author.url }}).

## Product analytics (PostHog)

The public site uses [PostHog](https://posthog.com) Cloud EU (via a first-party ingest host) so I can see which pages people open. PostHog is configured with **cookieless tracking**: it does not write PostHog cookies or use local/session storage for identity, and this site does not call `identify()`. Counts use a privacy-preserving hash on PostHog’s servers. Session replay is off here.

That is why this site does not show a cookie banner for PostHog. Cloudflare or the browser may still use their own cookies for hosting or security.

PostHog’s own terms and privacy policy apply to data they process for this site.

## Hosting and Cloudflare analytics

The website is static files on **Cloudflare Pages**. A separate Cloudflare Web Analytics beacon may run for visit counts. Those systems receive normal web-request metadata (for example IP address at the edge) as part of serving the site.

## What this site does not do

I do not sell your data. I do not run ads. You do not need an account to read these pages.

## Asking to delete something

If you think I hold personal data about you in PostHog or elsewhere, open an issue on [github.com/mzworthington/mzworthington](https://github.com/mzworthington/mzworthington/issues) and say what you want removed. I will use PostHog’s deletion tools where they apply.

## Changes

If this notice changes in a material way, I will update the date at the top.

import * as cloudflare from '@pulumi/cloudflare';
import * as pulumi from '@pulumi/pulumi';

const config = new pulumi.Config();
const accountId = config.require('accountId');
const zoneId = config.require('zoneId');
const pagesProjectName = config.require('pagesProjectName');
const apexDomain = config.require('apexDomain');
const wwwDomain = config.require('wwwDomain');

const pagesProject = new cloudflare.PagesProject('mzworthington', {
  accountId,
  name: pagesProjectName,
  productionBranch: 'main',
});

const apexDns = new cloudflare.DnsRecord(
  'apex-pages',
  {
    zoneId,
    name: apexDomain,
    type: 'CNAME',
    content: pagesProject.subdomain,
    proxied: true,
    ttl: 1,
    comment: 'mzworthington.co.uk Cloudflare Pages',
  },
  { deleteBeforeReplace: true },
);

const wwwDns = new cloudflare.DnsRecord(
  'www-pages',
  {
    zoneId,
    name: wwwDomain,
    type: 'CNAME',
    content: pagesProject.subdomain,
    proxied: true,
    ttl: 1,
    comment: 'mzworthington.co.uk Cloudflare Pages',
  },
  { deleteBeforeReplace: true },
);

new cloudflare.PagesDomain(
  'apex',
  {
    accountId,
    projectName: pagesProject.name,
    name: apexDomain,
  },
  { dependsOn: [apexDns] },
);

new cloudflare.PagesDomain(
  'www',
  {
    accountId,
    projectName: pagesProject.name,
    name: wwwDomain,
  },
  { dependsOn: [wwwDns] },
);

const zone = cloudflare.getZoneOutput({ zoneId });

/** Zone RUM site. Pages HTML is not rewritten by auto-install; CI injects the beacon. */
const webAnalytics = new cloudflare.WebAnalyticsSite('web-analytics', {
  accountId,
  zoneTag: zoneId,
  autoInstall: false,
});

new cloudflare.ObservatoryScheduledTest('observatory-apex', {
  zoneId,
  url: apexDomain,
});

export const pagesProjectNameOut = pagesProject.name;
export const pagesSubdomain = pagesProject.subdomain;
export const apexDomainOut = apexDomain;
export const wwwDomainOut = wwwDomain;
export const zoneName = zone.name;
export const webAnalyticsSiteTag = webAnalytics.siteTag;
export const webAnalyticsSiteToken = webAnalytics.siteToken;

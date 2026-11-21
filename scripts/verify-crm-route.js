'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const {rewriteCrmLanding,rewriteCrmLandingScript}=require('../crm-public-proxy');
const server=fs.readFileSync('server.js','utf8');
const proxy=fs.readFileSync('crm-public-proxy.js','utf8');
new vm.Script(server,{filename:'server.js'});
new vm.Script(proxy,{filename:'crm-public-proxy.js'});
assert.match(server,/registerCrmPublicSite\(app,SITE_URL\)/);
assert.match(server,/SITE_URL\+'\/crm<\/loc>/);
assert.match(proxy,/app\.get\(\['\/crm','\/crm\/'\]/);
assert.match(proxy,/if\(req\.path\.endsWith\('\/'\)\)return res\.redirect\(308,'\/crm'\)/);
assert.match(proxy,/app\.get\('\/crm\/login'/);
assert.match(proxy,/app\.get\('\/crm\/owner'/);
assert.match(proxy,/app\.post\('\/crm\/api\/public\/trial-requests'/);
assert.match(proxy,/CRM_ASSETS\.has\(name\)/);
assert.match(proxy,/CRM_MAX_ASSET_BYTES/);
assert.match(proxy,/CRM_PUBLIC_ORIGIN\+'\/api\/public\/trial-requests'/);
assert.match(proxy,/X-Robots-Tag/);

const sample='<html><head><link rel="icon" href="/assets/egp-mark.svg"><link rel="stylesheet" href="/landing.css"><script src="/landing.js"></script><script src="/pricing-billing.js"></script></head><body><img src="/assets/egp-mark-site-dark.svg"><a href="/">Home</a><a href="/crm">Log in</a><a href="/owner.html">Owner</a></body></html>';
const page=rewriteCrmLanding(sample,'https://www.expertsgp.com/crm');
for(const expected of [
 'href="/crm/assets/egp-mark.svg"','src="/crm/assets/egp-mark-site-dark.svg"',
 'href="/crm/landing.css"','src="/crm/landing.js"','src="/crm/pricing-billing.js"',
 'href="/crm"','href="/crm/login"','href="/crm/owner"',
 '<link rel="canonical" href="https://www.expertsgp.com/crm">',
 '<meta property="og:url" content="https://www.expertsgp.com/crm">'
]) assert(page.includes(expected),'Missing: '+expected);
assert(!page.includes('href="/owner.html"'));
assert(!page.includes('href="/landing.css"'));
const rewritten=rewriteCrmLandingScript("fetch('/api/public/trial-requests',{method:'POST'})");
assert(rewritten.includes("fetch('/crm/api/public/trial-requests'"));
assert(!rewritten.includes("fetch('/api/public/trial-requests'"));
console.log('Public /crm path, canonical, sitemap and safe upstream route checks passed');

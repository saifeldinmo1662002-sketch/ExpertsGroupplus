'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const base=path.join(__dirname,'..');
const { _test:{rewriteOfficeBrowserUrls,rewriteOfficeLocation,scopeOfficeCookie,stripHopHeaders,normalizeOriginForOffice} }=require('../office-proxy');

for(const [before,after] of [
  ['<script src="/app.js"></script>','<script src="/office/app.js"></script>'],
  ['<link href="/styles.css">','<link href="/office/styles.css">'],
  ['<script type="importmap">{"imports":{"three":"/vendor/three/build/three.module.js","three/addons/":"/vendor/three/examples/jsm/"}}</script>',
   '<script type="importmap">{"imports":{"three":"/office/vendor/three/build/three.module.js","three/addons/":"/office/vendor/three/examples/jsm/"}}</script>'],
  ['fetch("/api/office")','fetch("/office/api/office")'],
  ['api("/api/login","POST")','api("/office/api/login","POST")'],
  ["api('/api/hr/pay/')","api('/office/api/hr/pay/')"],
  ['import("/cctv.js")','import("/office/cctv.js")'],
  ['import("/workspace-ui.js")','import("/office/workspace-ui.js")'],
  ['import("/hr-ui.js")','import("/office/hr-ui.js")'],
  ['import("/agent-ui.js")','import("/office/agent-ui.js")'],
  ['import("/employee-record.js")','import("/office/employee-record.js")'],
  ['<link href="/personnel.css">','<link href="/office/personnel.css">'],
  ['<link href="/payroll.css">','<link href="/office/payroll.css">'],
  ['import("/payroll-ui.js")','import("/office/payroll-ui.js")'],
  ['import("/hr-command.js")','import("/office/hr-command.js")'],
  ['<link href="/hr-command.css">','<link href="/office/hr-command.css">'],
  ['import("/issues-ui.js")','import("/office/issues-ui.js")'],
  ['import("/employee-hub.js")','import("/office/employee-hub.js")'],
  ['import("/sender-ui.js")','import("/office/sender-ui.js")'],
  ['import("/expense-review.js")','import("/office/expense-review.js")'],
  ['<link href="/issues.css">','<link href="/office/issues.css">'],
  ['fetch("/api/agents/agent-1/export.pdf")','fetch("/office/api/agents/agent-1/export.pdf")'],
  ['<a href="/employee.html">Clock in</a>','<a href="/office/employee.html">Clock in</a>'],
  ['<img src="/brand-logo-dark.svg">','<img src="/office/brand-logo-dark.svg">'],
  ["url('/brand-mark.svg')","url('/office/brand-mark.svg')"],
  ['url(/brand-mark.svg)','url(/office/brand-mark.svg)']
])assert.equal(rewriteOfficeBrowserUrls(before),after,'Rewrite failed: '+before);
for(const value of [
  'fetch("/office/api/office")','<link href="/office/styles.css">',
  'href="/"','href="https://calendar.app.google/test"'
])assert.equal(rewriteOfficeBrowserUrls(value),value,'Must not double prefix or change external links: '+value);

assert.equal(rewriteOfficeLocation('/login'),'/office/login');
assert.equal(rewriteOfficeLocation('/'),'/office/');
assert.equal(rewriteOfficeLocation('https://ai-office-web-production-10a6e521.up.railway.app/employee.html?next=1'),'/office/employee.html?next=1');
assert.equal(rewriteOfficeLocation('https://www.expertsgp.com/contact'),'https://www.expertsgp.com/contact');

// The public website's browser Origin differs from the Railway upstream Host.
// Verify that the proxy accepts only requests from its own origin before
// translating the approved Origin for the upstream CSRF middleware.
assert.deepEqual(normalizeOriginForOffice('https://www.expertsgp.com','www.expertsgp.com','POST'),
 {allowed:true,upstreamOrigin:'https://ai-office-web-production-10a6e521.up.railway.app'});
assert.deepEqual(normalizeOriginForOffice('https://evil.example','www.expertsgp.com','POST'),
 {allowed:false,upstreamOrigin:null});
assert.deepEqual(normalizeOriginForOffice('http://www.expertsgp.com','www.expertsgp.com','POST'),
 {allowed:false,upstreamOrigin:null});
assert.deepEqual(normalizeOriginForOffice('null','www.expertsgp.com','POST'),
 {allowed:false,upstreamOrigin:null});
assert.deepEqual(normalizeOriginForOffice('https://www.expertsgp.com.attacker.com','www.expertsgp.com','POST'),
 {allowed:false,upstreamOrigin:null});
assert.deepEqual(normalizeOriginForOffice(undefined,'www.expertsgp.com','POST'),
 {allowed:true,upstreamOrigin:null});
assert.deepEqual(normalizeOriginForOffice('https://www.expertsgp.com/extra','www.expertsgp.com','POST'),
 {allowed:false,upstreamOrigin:null});

assert.equal(scopeOfficeCookie('egp_office=abcd; Path=/; HttpOnly; Secure; SameSite=Strict'),'egp_office=abcd; Path=/office; HttpOnly; Secure; SameSite=Strict');
assert.equal(scopeOfficeCookie('egp_employee=abcd; HttpOnly; Secure'),'egp_employee=abcd; HttpOnly; Secure; Path=/office');
assert.equal(stripHopHeaders({host:'example.test',connection:'keep-alive','content-type':'application/octet-stream'})['content-type'],'application/octet-stream');

const server=fs.readFileSync(path.join(base,'server.js'),'utf8');
const footer=fs.readFileSync(path.join(base,'public-site.html'),'utf8');
const a=server.indexOf("app.all(/^\\/office(?:\\/|$)/,require('./office-proxy'));");
const b=server.indexOf("app.use(express.json({limit:'1mb'}));");
assert.ok(a>=0&&a<b,'Office proxy must run before JSON parser to preserve employee files and API request bodies');
assert.ok(server.includes("Disallow: /office"),'Do not index private AI office URLs');
const bottom=footer.slice(footer.indexOf('<footer'),footer.indexOf('</footer>')+9);
assert.equal((bottom.match(/href="\/admin"/g)||[]).length,1);
assert.equal((bottom.match(/href="\/office"/g)||[]).length,1);
assert.equal((bottom.match(/href="\/office\/employee\.html"/g)||[]).length,1,'Exactly one employee login link expected');
const compact=bottom.match(/<div class="[^"]*\bflex-wrap\b[^"]*">([^<]*<a\b[\s\S]*?)<\/div>/);
assert.ok(compact&&compact[1].includes('href="/admin"')&&compact[1].includes('href="/office"')&&compact[1].includes('href="/office/employee.html"'),
 'Admin, AI Office and Employee Login must share the same responsive footer row');
console.log('AI Office same-domain routing and login Origin security checks passed.');

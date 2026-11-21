'use strict';

/**
 * Mount the *public* CRM product page at expertsgp.com/crm.
 * Protected CRM traffic is deliberately not proxied; login and owner console
 * redirect to the separately hosted CRM, which keeps its original auth flow.
 */
const CRM_PUBLIC_ORIGIN = 'https://crm-web-production-943c6485.up.railway.app';
const CRM_ASSETS = new Set([
  'egp-logo-accurate.svg', 'egp-logo-dark.svg', 'egp-logo-site-dark.svg',
  'egp-mark.svg', 'egp-mark-site-dark.svg'
]);
const CRM_SCRIPT_TYPES = {
  'landing.css':'text/css; charset=utf-8',
  'landing.js':'application/javascript; charset=utf-8',
  'pricing-billing.js':'application/javascript; charset=utf-8'
};
const CRM_MAX_ASSET_BYTES = 2 * 1024 * 1024;
const CRM_TIMEOUT_MS = 10000;

function rewriteCrmLanding(html, canonicalUrl) {
  let page = String(html || '');
  // Rewrite absolute URLs so the browser stays on the company domain.
  page = page.replaceAll('src="/assets/', 'src="/crm/assets/')
    .replaceAll('href="/assets/', 'href="/crm/assets/')
    .replaceAll('href="/landing.css"', 'href="/crm/landing.css"')
    .replaceAll('src="/landing.js"', 'src="/crm/landing.js"')
    .replaceAll('src="/pricing-billing.js"', 'src="/crm/pricing-billing.js"')
    .replaceAll('href="/crm"', 'href="/crm/login"')
    .replaceAll('href="/owner.html"', 'href="/crm/owner"')
    .replaceAll('href="/"', 'href="/crm"');
  const canonical = '<link rel="canonical" href="' + canonicalUrl + '">' +
    '<meta property="og:url" content="' + canonicalUrl + '">';
  return page.replace('</head>', canonical + '</head>');
}
function rewriteCrmLandingScript(js) {
  return String(js || '').replaceAll("fetch('/api/public/trial-requests'", "fetch('/crm/api/public/trial-requests'");
}
async function readCrmUpstream(resource) {
  // Resource is a hardcoded or whitelisted path only, never a URL from a visitor.
  const response = await fetch(CRM_PUBLIC_ORIGIN + resource, {
    headers:{'Accept':'*/*'},
    signal:AbortSignal.timeout(CRM_TIMEOUT_MS)
  });
  if(!response.ok) throw Error('CRM upstream unavailable (' + response.status + ')');
  const bytes=Buffer.from(await response.arrayBuffer());
  if(bytes.byteLength>CRM_MAX_ASSET_BYTES) throw Error('CRM upstream response too large');
  return bytes;
}
function registerCrmPublicSite(app, siteUrl) {
  const {rateLimit} = require('express-rate-limit');
  const limiter = rateLimit({windowMs:15*60*1000,limit:8,standardHeaders:true,legacyHeaders:false});
  app.get(['/crm','/crm/'], async(req,res)=>{
    if(req.path.endsWith('/'))return res.redirect(308,'/crm');
    try {
      const html=(await readCrmUpstream('/')).toString('utf8');
      if(!html.includes('id="trialForm"')||!html.includes('<html'))throw Error('Unexpected CRM landing response');
      res.type('html').set('Cache-Control','public, max-age=60').send(rewriteCrmLanding(html,siteUrl+'/crm'));
    }catch(error){console.error('CRM public page unavailable:',error.message);res.status(502).type('text/plain').send('The CRM product page is temporarily unavailable. Please try again later.')}
  });
  app.get('/crm/login',(req,res)=>{res.set('X-Robots-Tag','noindex').redirect(302,CRM_PUBLIC_ORIGIN+'/crm')});
  app.get('/crm/owner',(req,res)=>{res.set('X-Robots-Tag','noindex').redirect(302,CRM_PUBLIC_ORIGIN+'/owner.html')});
  app.get('/crm/:filename',async(req,res,next)=>{
    const name=req.params.filename;
    if(!(name in CRM_SCRIPT_TYPES))return next();
    try {
      let content=(await readCrmUpstream('/'+name)).toString('utf8');
      if(name==='landing.js')content=rewriteCrmLandingScript(content);
      res.set('Cache-Control','public, max-age=60').type(CRM_SCRIPT_TYPES[name]).send(content);
    }catch(error){console.error('CRM resource unavailable:',name,error.message);res.status(502).send('Resource unavailable')}
  });
  app.get('/crm/assets/:filename',async(req,res,next)=>{
    const name=req.params.filename;
    if(!CRM_ASSETS.has(name))return next();
    try {
      const bytes=await readCrmUpstream('/assets/'+name);
      res.set('Cache-Control','public, max-age=300').type('image/svg+xml').send(bytes);
    }catch(error){console.error('CRM asset unavailable:',name,error.message);res.status(502).send('Resource unavailable')}
  });
  app.post('/crm/api/public/trial-requests',limiter,async(req,res)=>{
    try {
      const response=await fetch(CRM_PUBLIC_ORIGIN+'/api/public/trial-requests',{
        method:'POST',headers:{'Content-Type':'application/json'},
        body:JSON.stringify(req.body||{}),signal:AbortSignal.timeout(CRM_TIMEOUT_MS)
      });
      const payload=await response.json();
      res.set('Cache-Control','no-store').status(response.status).json(payload);
    }catch(error){console.error('CRM trial request unavailable:',error.message);res.status(502).json({error:'Could not submit trial request right now. Please try again.'})}
  });
}
module.exports={registerCrmPublicSite,rewriteCrmLanding,rewriteCrmLandingScript};

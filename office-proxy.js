'use strict';

// Same-origin reverse proxy: https://www.expertsgp.com/office -> the existing
// standalone AI Office Railway service. This is a URL-path route, not a DNS record.
// It preserves the Office database and does not merge Office admin auth with site auth.
const https = require('node:https');
const zlib = require('node:zlib');

const UPSTREAM = new URL('https://ai-office-web-production-10a6e521.up.railway.app');
const PREFIX = '/office';
const TEXT_LIMIT = 8 * 1024 * 1024;
const TIMEOUT_MS = 90000;
const HOP_HEADERS = new Set([
  'connection','host','keep-alive','proxy-authorization','proxy-authenticate',
  'te','trailer','transfer-encoding','upgrade'
]);
const CLIENT_ASSET = '(?:api(?:\\/|[\\x22\\x27\\x60])|vendor\\/three\\/|brand-(?:mark|logo(?:-dark)?)\\.svg|favicon(?:\\.ico|\\.png)|(?:app|cctv|workspace-ui|hr-ui|employee|agent-ui|employee-record|payroll-ui|hr-command|issues-ui|employee-hub|expense-review|sender-ui)\\.js|(?:styles|cctv|workspace|employee|personnel|payroll|hr-command|issues|agent-profile)\\.css|employee(?:\\.html|\\/)|rose\\.html)';
const URL_RE = new RegExp('([\\x22\\x27\\x60])\\/(?='+CLIENT_ASSET+')','gi');
const CSS_URL_RE = /url\(\s*(["']?)\/(?=(?:brand-|vendor\/three\/|(?:styles|cctv|workspace|employee|personnel|payroll|hr-command|issues|agent-profile)\.css))/gi;

function rewriteOfficeBrowserUrls(text){
  // Only routes belonging to AI Office are prefixed. A bare / (company website)
  // and unrelated public links stay unchanged. API JSON is not rewritten.
  return text
    .replace(URL_RE, '$1'+PREFIX+'/')
    .replace(/(\b(?:src|href)\s*=\s*["'])\/(?!office\/|\/)((?:api\/|vendor\/three\/|brand-[^"']+|(?:app|cctv|workspace-ui|hr-ui|employee|agent-ui|employee-record|payroll-ui|hr-command|issues-ui|employee-hub|expense-review|sender-ui)\.js|(?:styles|cctv|workspace|employee|personnel|payroll|hr-command|issues|agent-profile)\.css|employee\.html|rose\.html)[^"']*)/gi,
      '$1'+PREFIX+'/$2')
    .replace(CSS_URL_RE,'url($1'+PREFIX+'/');
}
function rewriteOfficeLocation(value){
  if(typeof value!=='string'||!value)return value;
  if(value.startsWith('/')&&!value.startsWith('//')){
    if(value===PREFIX||value.startsWith(PREFIX+'/'))return value;
    return PREFIX+value;
  }
  try{
    const url=new URL(value,UPSTREAM);
    if(url.protocol===UPSTREAM.protocol&&url.host===UPSTREAM.host){
      return PREFIX+(url.pathname==='/'?'/':url.pathname)+url.search+url.hash;
    }
  }catch{}
  return value;
}
function scopeOfficeCookie(cookie){
  // On www.expertsgp.com, Office sessions MUST not leak into public site routes.
  if(typeof cookie!=='string')return cookie;
  if(/;\s*Path=/i.test(cookie))return cookie.replace(/;\s*Path=[^;]*/i,'; Path='+PREFIX);
  return cookie+'; Path='+PREFIX;
}
function inflate(bytes,encoding){
  switch(String(encoding||'').toLowerCase()){
    case '':case 'identity':return bytes;
    case 'gzip':return zlib.gunzipSync(bytes);
    case 'br':return zlib.brotliDecompressSync(bytes);
    case 'deflate':return zlib.inflateSync(bytes);
    default:throw new Error('Unexpected AI Office content encoding');
  }
}
function normalizeOriginForOffice(origin,publicHost,method='GET'){
  // Browser requests originate at www.expertsgp.com while Railway routes the
  // upstream HTTP Host to its own service domain. The upstream's strict CSRF
  // guard must see an Origin matching that upstream Host, but only after we
  // verify the browser really made a same-origin request to this public site.
  if(!origin)return {allowed:true,upstreamOrigin:null};
  let supplied;
  try{supplied=new URL(origin);}catch{return {allowed:false,upstreamOrigin:null};}
  const siteHost=String(publicHost||'').toLowerCase();
  const sameOrigin=supplied.protocol==='https:'&&
    supplied.host.toLowerCase()===siteHost&&
    supplied.pathname==='/'&&supplied.search===''&&supplied.hash==='';
  if(!sameOrigin)return {allowed:false,upstreamOrigin:null};
  return {allowed:true,upstreamOrigin:UPSTREAM.origin};
}
function stripHopHeaders(source){
  const result={};
  for(const [name,value] of Object.entries(source||{})){
    if(value!==undefined&&!HOP_HEADERS.has(name.toLowerCase()))result[name]=value;
  }
  return result;
}

function serveOfficeUnderCompanyDomain(req,res){
  const original=req.originalUrl||req.url||PREFIX;
  const rest=original.slice(PREFIX.length);
  const path=rest.startsWith('/')?rest:'/'+(rest||'');
  const clientHeaders=req.headers||{};
  const isMutation=['POST','PUT','PATCH','DELETE'].includes(req.method);
  // Prevent cross-site POSTs before rewriting the verified browser Origin.
  const originCheck=normalizeOriginForOffice(clientHeaders.origin,clientHeaders.host,req.method);
  if(isMutation&&!originCheck.allowed){
    return res.status(403).json({error:'Cross-origin request blocked.'});
  }
  const headers=stripHopHeaders(clientHeaders);
  if(isMutation&&originCheck.upstreamOrigin)headers.origin=originCheck.upstreamOrigin;
  headers.host=UPSTREAM.host;
  headers['accept-encoding']='identity';
  headers['x-forwarded-host']=clientHeaders.host||'www.expertsgp.com';
  headers['x-forwarded-proto']='https';
  headers['x-forwarded-prefix']=PREFIX;
  const upstreamReq=https.request({
    protocol:'https:',hostname:UPSTREAM.hostname,port:443,
    method:req.method,path,headers,timeout:TIMEOUT_MS
  },upstreamRes=>{
    const mime=String(upstreamRes.headers['content-type']||'').toLowerCase();
    const isText=/text\/html|text\/css|javascript/.test(mime);
    const responseHeaders=stripHopHeaders(upstreamRes.headers);
    if(responseHeaders.location)responseHeaders.location=rewriteOfficeLocation(responseHeaders.location);
    if(responseHeaders['set-cookie']){
      const value=responseHeaders['set-cookie'];
      responseHeaders['set-cookie']=Array.isArray(value)?value.map(scopeOfficeCookie):scopeOfficeCookie(value);
    }
    // Private employee and administrative tools must never be indexed or cached.
    responseHeaders['x-robots-tag']='noindex, nofollow, noarchive';
    responseHeaders['cache-control']='no-store, max-age=0';
    res.statusCode=upstreamRes.statusCode||502;
    if(!isText||req.method==='HEAD'){
      res.set(responseHeaders);
      upstreamRes.pipe(res);
      return;
    }
    delete responseHeaders['content-length'];
    delete responseHeaders['content-encoding'];
    delete responseHeaders.etag;
    const parts=[];let total=0;let oversized=false;
    upstreamRes.on('data',chunk=>{
      if(oversized)return;
      total+=chunk.length;
      if(total>TEXT_LIMIT){
        oversized=true;upstreamRes.destroy();
        if(!res.headersSent)res.status(502).send('AI Office response exceeded proxy limit.');
        return;
      }
      parts.push(chunk);
    });
    upstreamRes.on('end',()=>{
      if(oversized||res.writableEnded)return;
      try{
        const decoded=inflate(Buffer.concat(parts),upstreamRes.headers['content-encoding']);
        res.set(responseHeaders).send(rewriteOfficeBrowserUrls(decoded.toString('utf8')));
      }catch(error){
        console.error('Office proxy rewrite failed:',error.message);
        if(!res.headersSent)res.status(502).send('AI Office content could not be displayed.');
      }
    });
  });
  upstreamReq.on('timeout',()=>upstreamReq.destroy(new Error('AI Office upstream timed out')));
  upstreamReq.on('error',error=>{
    console.error('AI Office upstream connection failed:',error.message);
    if(!res.headersSent)res.status(502).send('AI Office is temporarily unavailable.');
    else res.end();
  });
  req.on('aborted',()=>upstreamReq.destroy());
  req.pipe(upstreamReq);
}

module.exports=serveOfficeUnderCompanyDomain;
module.exports._test={rewriteOfficeBrowserUrls,rewriteOfficeLocation,scopeOfficeCookie,stripHopHeaders,normalizeOriginForOffice};

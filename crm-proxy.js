'use strict';

// Serve the separate Experts Group Plus CRM Railway app under /CRM on the
// public company domain without duplicating its database or authentication.
const https = require('node:https');
const zlib = require('node:zlib');

const CRM_UPSTREAM = new URL('https://crm-web-production-943c6485.up.railway.app');
const PREFIX = '/CRM';
const TEXT_LIMIT = 8 * 1024 * 1024;
const REQUEST_TIMEOUT_MS = 90000;
const DISALLOWED_HEADERS = new Set([
  'host', 'connection', 'keep-alive', 'proxy-authenticate',
  'proxy-authorization', 'te', 'trailer', 'transfer-encoding', 'upgrade'
]);

function rewriteRelativeUrls(text) {
  // Only browser-facing URLs need a /CRM prefix. Endpoint fragments such as
  // '/deals', '/login' or '/preferences' are passed to CRM's api() helper and
  // must stay unchanged.
  return text
    .replace(/([\x22\x27\x60])\/(?=(?:api(?=[\/\x22\x27\x60])|assets\/|crm(?=[\/\x22\x27\x60])|owner\.html|owner\.css|owner\.js|landing\.css|landing\.js|pricing-billing\.js|styles\.css|app\.js))/gi, '$1/CRM/')
    .replace(/(href\s*=\s*[\x22\x27])\/(?=[\x22\x27])/gi, '$1/CRM/')
    .replace(/url\(\s*\/(?!\/)/gi, 'url(/CRM/');
}

function changeLocation(location) {
  if (!location) return location;
  if (location.startsWith('/') && !location.startsWith('//')) {
    return PREFIX + location;
  }
  try {
    const value = new URL(location, CRM_UPSTREAM);
    if (value.host === CRM_UPSTREAM.host && value.protocol === CRM_UPSTREAM.protocol) {
      return PREFIX + value.pathname + value.search + value.hash;
    }
  } catch (_) {}
  return location;
}

function decodedBody(buffer, encoding) {
  const type = String(encoding || '').toLowerCase();
  if (!type || type === 'identity') return buffer;
  if (type === 'gzip') return zlib.gunzipSync(buffer);
  if (type === 'br') return zlib.brotliDecompressSync(buffer);
  if (type === 'deflate') return zlib.inflateSync(buffer);
  throw new Error('Unexpected CRM content encoding: ' + type);
}

module.exports = function serveCrmUnderCompanyDomain(req, res) {
  const rawPath = req.originalUrl || req.url || '/CRM';
  const remainder = rawPath.slice(PREFIX.length);
  const proxyPath = remainder && remainder[0] === '/'
    ? remainder
    : '/' + (remainder || '');
  const originalHeaders = req.headers || {};
  const forwardedHeaders = {};
  for (const [name, value] of Object.entries(originalHeaders)) {
    if (!DISALLOWED_HEADERS.has(name.toLowerCase()) && value !== undefined) forwardedHeaders[name] = value;
  }
  forwardedHeaders.host = CRM_UPSTREAM.host;
  forwardedHeaders['accept-encoding'] = 'identity';
  forwardedHeaders['x-forwarded-host'] = originalHeaders.host || 'www.expertsgp.com';
  forwardedHeaders['x-forwarded-proto'] = 'https';

  const upstreamReq = https.request({
    protocol: 'https:',
    hostname: CRM_UPSTREAM.hostname,
    port: 443,
    method: req.method,
    path: proxyPath,
    headers: forwardedHeaders,
    timeout: REQUEST_TIMEOUT_MS
  }, upstreamRes => {
    const mime = String(upstreamRes.headers['content-type'] || '').toLowerCase();
    const isText = /(?:text\/html|text\/css|javascript)/.test(mime);
    const responseHeaders = {};
    for (const [name, value] of Object.entries(upstreamRes.headers)) {
      if (!DISALLOWED_HEADERS.has(name.toLowerCase()) && value !== undefined) responseHeaders[name] = value;
    }
    if (responseHeaders.location) responseHeaders.location = changeLocation(responseHeaders.location);
    if (proxyPath === '/crm' || proxyPath.startsWith('/crm?')) responseHeaders['x-robots-tag'] = 'noindex, nofollow';

    res.statusCode = upstreamRes.statusCode || 502;
    if (!isText || req.method === 'HEAD') {
      res.set(responseHeaders);
      upstreamRes.pipe(res);
      return;
    }

    // Rewritten responses must not retain the upstream length, compression
    // metadata or ETag. API JSON is never rewritten.
    delete responseHeaders['content-length'];
    delete responseHeaders['content-encoding'];
    delete responseHeaders.etag;
    responseHeaders['cache-control'] = 'no-store, must-revalidate';

    const chunks = [];
    let total = 0;
    upstreamRes.on('data', chunk => {
      total += chunk.length;
      if (total > TEXT_LIMIT) {
        upstreamRes.destroy();
        if (!res.headersSent) res.status(502).send('CRM response exceeded text proxy limit.');
        return;
      }
      chunks.push(chunk);
    });
    upstreamRes.on('end', () => {
      if (res.writableEnded) return;
      try {
        let htmlOrScript = decodedBody(Buffer.concat(chunks), upstreamRes.headers['content-encoding']).toString('utf8');
        htmlOrScript = rewriteRelativeUrls(htmlOrScript);
        if (mime.includes('text/html') && (proxyPath === '/' || proxyPath.startsWith('/?'))) {
          htmlOrScript = htmlOrScript.replace('</head>', '<link rel="canonical" href="https://www.expertsgp.com/CRM">\n</head>');
        }
        res.set(responseHeaders);
        res.send(htmlOrScript);
      } catch (error) {
        console.error('CRM proxy response rewrite failed:', error.message);
        if (!res.headersSent) res.status(502).send('CRM content could not be displayed.');
      }
    });
  });

  upstreamReq.on('timeout', () => upstreamReq.destroy(new Error('CRM upstream request timed out.')));
  upstreamReq.on('error', error => {
    console.error('CRM upstream request failed:', error.message);
    if (!res.headersSent) res.status(502).send('CRM is temporarily unavailable.');
    else res.end();
  });
  req.on('aborted', () => upstreamReq.destroy());
  req.pipe(upstreamReq);
};

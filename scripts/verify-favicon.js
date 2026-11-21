'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs'),vm=require('node:vm');
const icon=fs.readFileSync('public/egp-favicon.png');
assert.equal(icon.subarray(0,8).toString('hex'),'89504e470d0a1a0a','PNG signature');
assert.equal(icon.readUInt32BE(16),192,'PNG width');
assert.equal(icon.readUInt32BE(20),192,'PNG height');
assert(icon.includes(Buffer.from('tRNS')),'Indexed PNG must preserve a transparent background');
const site=fs.readFileSync('public-site.html','utf8');
const rootAdmin=fs.readFileSync('admin.html','utf8');
const liveAdmin=fs.readFileSync('public/admin.html','utf8');
const server=fs.readFileSync('server.js','utf8');
const init=fs.readFileSync('init-db.js','utf8');
new vm.Script(server,{filename:'server.js'});
new vm.Script(init,{filename:'init-db.js'});
for(const [name,html] of [['English/Arabic site',site],['Root admin',rootAdmin],['Served admin',liveAdmin]]){
 assert.match(html,/rel="icon" type="image\/png" sizes="192x192" href="\/assets\/egp-favicon\.png"/,name+' favicon');
 assert.match(html,/rel="apple-touch-icon" sizes="192x192" href="\/assets\/egp-favicon\.png"/,name+' touch icon');
 assert.doesNotMatch(html,/rel="icon"[^>]+data:image/,name+' stale embedded favicon');
}
assert.match(server,/let faviconUrl='https:\/\/www\.expertsgp\.com\/assets\/egp-favicon\.png'/);
assert.match(server,/app\.get\('\/favicon\.ico'/);
assert.match(server,/app\.get\('\/favicon\.png'/);
assert.match(server,/faviconUrl=f\.rows\[0\]\?\.value\|\|faviconUrl/);
assert.match(server,/sizes="192x192"/);
assert.match(init,/egp_favicon_diamonds_2026_applied/);
assert.match(init,/ON CONFLICT\(key\) DO NOTHING RETURNING key/);
assert.match(init,/SELECT 'search_favicon_url','https:\/\/www\.expertsgp\.com\/assets\/egp-favicon\.png' FROM applied/);
console.log('Website favicon is transparent and linked from public and admin pages. SEO migration is one-time.');

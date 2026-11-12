require('dotenv').config();
const express = require('express');
const path = require('path');
const fs = require('fs');
const helmet = require('helmet');
const session = require('express-session');
const PgSession = require('connect-pg-simple')(session);
const bcrypt = require('bcryptjs');
const rateLimit = require('express-rate-limit');
const pool = require('./db');
const app = express();
const PORT = process.env.PORT || 3000;
const ROOT = __dirname;
const PUBLIC = path.join(ROOT, 'public');
const SITE_URL = (process.env.SITE_URL || 'https://www.expertsgp.com').replace(/\/$/, '');
if (process.env.NODE_ENV === 'production' && (!process.env.SESSION_SECRET || process.env.SESSION_SECRET.length < 32)) throw new Error('Set SESSION_SECRET to a random value of at least 32 characters in Railway.');

app.set('trust proxy', 1);
app.use(helmet({contentSecurityPolicy:false, crossOriginEmbedderPolicy:false}));
app.use(express.json({limit:'1mb'}));
app.use(express.urlencoded({extended:false,limit:'20kb'}));
app.use(session({
  store:new PgSession({pool,tableName:'user_sessions',createTableIfMissing:true}),
  secret:process.env.SESSION_SECRET || 'development-only-change-this-secret-before-deploy',
  resave:false,saveUninitialized:false,
  cookie:{httpOnly:true,secure:process.env.NODE_ENV==='production',sameSite:'lax',maxAge:8*60*60*1000}
}));
app.use((req,res,next)=>{if(['POST','PUT','PATCH','DELETE'].includes(req.method)&&req.get('origin')){try{const origin=new URL(req.get('origin'));if(origin.host!==req.get('host'))return res.status(403).json({error:'Cross-origin request blocked.'})}catch{return res.status(403).json({error:'Invalid request origin.'})}}if(req.path.startsWith('/api/admin'))res.set('Cache-Control','no-store');next()});
const authLimiter=rateLimit({windowMs:15*60*1000,limit:10,standardHeaders:true,legacyHeaders:false,message:{error:'Too many attempts. Try again later.'}});
const contactLimiter=rateLimit({windowMs:60*60*1000,limit:8,standardHeaders:true,legacyHeaders:false});
const allowedPages=new Set(['home','about','training','consultation','operations','bpo','contact']);
const slugToPage=p=>allowedPages.has(p)?p:'home';
const pageMeta={
 home:['Experts Group Plus | Managed Business Services','Integrated training, consulting, operations and BPO services for growing businesses.'],
 about:['About Experts Group Plus | Our Company','Learn about Experts Group Plus, our approach, service model and business capabilities.'],
 training:['Corporate Training Services | Experts Group Plus','Practical employee, department and management training programs for business performance.'],
 consultation:['Business Consultation & Strategy | Experts Group Plus','Business diagnostics, operational strategy and advisory services for sustainable growth.'],
 operations:['Business Operations Services | Experts Group Plus','Specialist operational services across marketing, creative, technology and corporate functions.'],
 bpo:['Business Process Outsourcing | Experts Group Plus','Scalable customer support, sales support and back-office outsourcing solutions.'],
 contact:['Contact Experts Group Plus | Start a Conversation','Contact Experts Group Plus to discuss training, consulting, operations and outsourcing.']
};
function canonicalPath(lang,page){return `/${lang}/${page==='home'?'':page}`.replace(/\/$/,'/')}
function pageFromPath(url){const m=url.match(/^\/(en|ar)(?:\/([^/?#]+))?\/?$/);return m?{lang:m[1],page:slugToPage(m[2]||'home')}:null}
function addHead(html,lang,page){
 const pageMetaAr={home:['خبراء جروب بلس | حلول متكاملة للأعمال','حلول متكاملة في التدريب والاستشارات والعمليات وخدمات التعهيد لدعم نمو الشركات.'],about:['من نحن | خبراء جروب بلس','تعرّف على خبراء جروب بلس ومنهجية العمل والخدمات التي نقدمها للشركات.'],training:['التدريب المؤسسي | خبراء جروب بلس','برامج تدريب عملية للموظفين والإدارات والقيادات لتحسين أداء الأعمال.'],consultation:['الاستشارات الإدارية والاستراتيجية | خبراء جروب بلس','تشخيص الأعمال وتطوير الاستراتيجيات وتحسين العمليات لتحقيق نمو مستدام.'],operations:['خدمات العمليات | خبراء جروب بلس','خدمات تشغيل متخصصة في التسويق والإبداع والتقنية والوظائف المؤسسية.'],bpo:['خدمات تعهيد العمليات التجارية | خبراء جروب بلس','حلول مرنة لدعم العملاء والمبيعات والعمليات الإدارية والمساندة.'],contact:['تواصل مع خبراء جروب بلس','تواصل مع فريق خبراء جروب بلس لمناقشة التدريب والاستشارات والعمليات وخدمات التعهيد.']};
 const [title,desc]=(lang==='ar'?pageMetaAr:pageMeta)[page]; const url=SITE_URL+canonicalPath(lang,page);
 const head=`\n<meta name="description" content="${desc.replace(/"/g,'&quot;')}">\n<meta name="robots" content="index,follow,max-image-preview:large">\n<link rel="canonical" href="${url}">\n<link rel="alternate" hreflang="en" href="${SITE_URL+canonicalPath('en',page)}">\n<link rel="alternate" hreflang="ar" href="${SITE_URL+canonicalPath('ar',page)}">\n<link rel="alternate" hreflang="x-default" href="${SITE_URL+canonicalPath('en',page)}">\n<meta property="og:type" content="website"><meta property="og:site_name" content="Experts Group Plus"><meta property="og:title" content="${title}"><meta property="og:description" content="${desc}"><meta property="og:url" content="${url}">\n<meta name="twitter:card" content="summary_large_image">\n<script type="application/ld+json">${JSON.stringify({'@context':'https://schema.org','@type':'Organization','name':'Experts Group Plus','url':SITE_URL,'email':'info@expertsgp.com','telephone':'+201044111646','address':{'@type':'PostalAddress','addressLocality':'Cairo','addressCountry':'EG'},'sameAs':['https://www.linkedin.com/company/112247034','https://www.instagram.com/experts.group.plus?exln=OHVrOGIxY2xhMnBo','https://www.tiktok.com/@experts_group_plus?_r=1']})}</script>`;
 return html.replace(/<title>[^<]*<\/title>/i,`<title>${title}</title>`).replace(/<html lang="[^"]*"/i,`<html lang="${lang}" dir="${lang==='ar'?'rtl':'ltr'}"`).replace('</head>',head+'\n</head>');
}
function requireAdmin(req,res,next){if(!req.session.admin)return res.status(401).json({error:'Authentication required.'});next()}
function requireOwner(req,res,next){if(!req.session.admin||req.session.admin.role!=='owner')return res.status(403).json({error:'Owner approval required.'});next()}
function safeUrl(raw){try{const u=new URL(raw);return ['https:','http:','mailto:','tel:'].includes(u.protocol)?u.href:null}catch{return null}}

app.post('/api/auth/password',requireAdmin,async(req,res)=>{try{const current=String(req.body.currentPassword||''),next=String(req.body.newPassword||'');if(next.length<14||next.length>128)return res.status(400).json({error:'New password must be at least 14 characters.'});const q=await pool.query('SELECT password_hash FROM admins WHERE id=$1',[req.session.admin.id]);if(!q.rows[0]||!(await bcrypt.compare(current,q.rows[0].password_hash)))return res.status(400).json({error:'Current password is incorrect.'});const hash=await bcrypt.hash(next,12);await pool.query('UPDATE admins SET password_hash=$1 WHERE id=$2',[hash,req.session.admin.id]);res.json({ok:true})}catch(e){console.error(e);res.status(500).json({error:'Could not update password.'})}});
app.post('/api/admin/links/bulk',requireAdmin,async(req,res)=>{try{const items=Array.isArray(req.body.items)?req.body.items.slice(0,250):[];let count=0;for(const item of items){const key=String(item.key||'').slice(0,120),label=String(item.label||key).slice(0,160),url=safeUrl(String(item.url||''));if(!/^[a-zA-Z0-9_.:-]+$/.test(key)||!url)continue;await pool.query(`INSERT INTO site_links(link_key,label,url) VALUES($1,$2,$3) ON CONFLICT(link_key) DO NOTHING`,[key,label,url]);count++}res.json({ok:true,count})}catch(e){console.error(e);res.status(500).json({error:'Could not import links.'})}});
app.get('/health',(req,res)=>res.json({ok:true}));
app.get('/robots.txt',(req,res)=>res.type('text/plain').send(`User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /api/\nSitemap: ${SITE_URL}/sitemap.xml\n`));
app.get('/sitemap.xml',(req,res)=>{const pages=['home','about','training','consultation','operations','bpo','contact'];const urls=pages.flatMap(p=>['en','ar'].map(l=>`<url><loc>${SITE_URL+canonicalPath(l,p)}</loc><changefreq>monthly</changefreq><priority>${p==='home'?'1.0':'0.8'}</priority></url>`)).join('');res.type('application/xml').send(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`)});

// Public content consumed by the bilingual website.
app.get('/api/public/content',async(req,res)=>{try{
 const [items,links]=await Promise.all([pool.query('SELECT content_type,data FROM content_items ORDER BY sort_order,id'),pool.query('SELECT link_key,url FROM site_links')]);
 const out={reviews:[],operations:[],consultation:[],links:{}};
 for(const r of items.rows){const k=r.content_type==='review'?'reviews':r.content_type==='operation'?'operations':'consultation';out[k].push(r.data)}
 for(const r of links.rows)out.links[r.link_key]=r.url;
 res.set('Cache-Control','public, max-age=60');res.json(out);
 }catch(e){console.error(e);res.status(500).json({error:'Unable to load site content.'})}});

app.post('/api/contact',contactLimiter,async(req,res)=>{try{
 const {name,email,company='',scope='',message='',preferredContact='',language='en',website=''}=req.body||{};
 if(website) return res.status(200).json({ok:true}); // honeypot
 if(typeof name!=='string'||name.trim().length<2||name.length>160||typeof email!=='string'||email.length>254||!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))return res.status(400).json({error:'Please provide a valid name and email.'});
 const clean=v=>typeof v==='string'?v.trim().slice(0,5000):'';
 const result=await pool.query(`INSERT INTO contact_submissions(name,email,company,scope,message,preferred_contact,language) VALUES($1,$2,$3,$4,$5,$6,$7) RETURNING id`,[clean(name),clean(email),clean(company),clean(scope),clean(message),clean(preferredContact),language==='ar'?'ar':'en']);
 res.status(201).json({ok:true,id:result.rows[0].id,message:'Your inquiry has been received.'});
 }catch(e){console.error(e);res.status(500).json({error:'We could not save your inquiry. Please try again.'})}});

app.post('/api/auth/request-access',authLimiter,async(req,res)=>{try{
 const {email,password,name}=req.body||{};const em=String(email||'').trim().toLowerCase();
 if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em)||typeof password!=='string'||password.length<14||password.length>128||String(name||'').trim().length<2)return res.status(400).json({error:'Enter a valid name, email and password (at least 14 characters).'});
 const hash=await bcrypt.hash(password,12);
 await pool.query(`INSERT INTO admins(email,password_hash,display_name,role,status) VALUES($1,$2,$3,'admin','pending')`,[em,hash,String(name).trim().slice(0,120)]);
 res.status(201).json({ok:true,message:'Access request submitted. An owner must approve your account before you can sign in.'});
 }catch(e){if(e.code==='23505')return res.status(409).json({error:'An account with this email already exists.'});console.error(e);res.status(500).json({error:'Could not submit access request.'})}});
app.post('/api/auth/login',authLimiter,async(req,res)=>{try{
 const email=String(req.body.email||'').trim().toLowerCase(),password=String(req.body.password||'');
 const q=await pool.query('SELECT * FROM admins WHERE email=$1',[email]);const user=q.rows[0];
 if(!user||!(await bcrypt.compare(password,user.password_hash)))return res.status(401).json({error:'Invalid email or password.'});
 if(user.status!=='approved')return res.status(403).json({error:user.status==='pending'?'Your account is awaiting owner approval.':'This account is not approved.'});
 await new Promise((resolve,reject)=>req.session.regenerate(err=>err?reject(err):resolve()));
 req.session.admin={id:user.id,email:user.email,name:user.display_name,role:user.role};
 await pool.query('UPDATE admins SET last_login=NOW() WHERE id=$1',[user.id]);
 res.json({ok:true,user:req.session.admin});
 }catch(e){console.error(e);res.status(500).json({error:'Login failed.'})}});
app.get('/api/auth/me',(req,res)=>res.json({user:req.session.admin||null}));
app.post('/api/auth/logout',(req,res)=>req.session.destroy(()=>{res.clearCookie('connect.sid');res.json({ok:true})}));

app.get('/api/admin/dashboard',requireAdmin,async(req,res)=>{try{
 const [leads,admins,counts]=await Promise.all([
 pool.query('SELECT id,name,email,company,scope,message,preferred_contact,language,status,created_at FROM contact_submissions ORDER BY created_at DESC LIMIT 500'),
 req.session.admin.role==='owner'?pool.query('SELECT id,email,display_name,role,status,created_at,last_login FROM admins ORDER BY created_at DESC'):Promise.resolve({rows:[]}),
 pool.query('SELECT content_type,COUNT(*)::int AS count FROM content_items GROUP BY content_type')]);
 res.json({leads:leads.rows,admins:admins.rows,counts:counts.rows});
 }catch(e){console.error(e);res.status(500).json({error:'Could not load dashboard.'})}});
app.get('/api/admin/content/:type',requireAdmin,async(req,res)=>{const types={reviews:'review',operations:'operation',consultation:'consultation'};const type=types[req.params.type];if(!type)return res.status(404).json({error:'Unknown content type.'});const q=await pool.query('SELECT item_key,data,sort_order FROM content_items WHERE content_type=$1 ORDER BY sort_order,id',[type]);res.json(q.rows.map(r=>({...r.data,_key:r.item_key,_sort:r.sort_order}))) });
app.post('/api/admin/content/:type',requireAdmin,async(req,res)=>{const types={reviews:'review',operations:'operation',consultation:'consultation'};const type=types[req.params.type];if(!type)return res.status(404).json({error:'Unknown content type.'});try{const data=req.body||{};const key=String(data.id||`${type}-${Date.now()}`).slice(0,100);delete data._key;delete data._sort;data.id=key;const q=await pool.query('INSERT INTO content_items(content_type,item_key,data,sort_order) VALUES($1,$2,$3,COALESCE((SELECT MAX(sort_order)+1 FROM content_items WHERE content_type=$1),0)) RETURNING item_key',[type,key,data]);res.status(201).json({ok:true,id:q.rows[0].item_key})}catch(e){if(e.code==='23505')return res.status(409).json({error:'That item ID already exists.'});console.error(e);res.status(500).json({error:'Could not save content.'})}});
app.put('/api/admin/content/:type/:key',requireAdmin,async(req,res)=>{const types={reviews:'review',operations:'operation',consultation:'consultation'};const type=types[req.params.type];if(!type)return res.status(404).json({error:'Unknown content type.'});const data=req.body||{};delete data._key;delete data._sort;data.id=req.params.key;const q=await pool.query('UPDATE content_items SET data=$1,updated_at=NOW() WHERE content_type=$2 AND item_key=$3',[data,type,req.params.key]);res.json({ok:q.rowCount===1})});
app.delete('/api/admin/content/:type/:key',requireAdmin,async(req,res)=>{const types={reviews:'review',operations:'operation',consultation:'consultation'};const type=types[req.params.type];if(!type)return res.status(404).json({error:'Unknown content type.'});await pool.query('DELETE FROM content_items WHERE content_type=$1 AND item_key=$2',[type,req.params.key]);res.json({ok:true})});
app.get('/api/admin/links',requireAdmin,async(req,res)=>{const q=await pool.query('SELECT link_key,label,url,updated_at FROM site_links ORDER BY label');res.json(q.rows)});
app.put('/api/admin/links/:key',requireAdmin,async(req,res)=>{const key=String(req.params.key).trim().slice(0,120),label=String(req.body.label||key).slice(0,160),url=safeUrl(String(req.body.url||''));if(!/^[a-zA-Z0-9_.:-]+$/.test(key)||!url)return res.status(400).json({error:'Use a valid key and absolute http(s), mailto or tel URL.'});await pool.query(`INSERT INTO site_links(link_key,label,url) VALUES($1,$2,$3) ON CONFLICT(link_key) DO UPDATE SET label=EXCLUDED.label,url=EXCLUDED.url,updated_at=NOW()`,[key,label,url]);res.json({ok:true})});
app.delete('/api/admin/links/:key',requireAdmin,async(req,res)=>{await pool.query('DELETE FROM site_links WHERE link_key=$1',[req.params.key]);res.json({ok:true})});
app.patch('/api/admin/leads/:id',requireAdmin,async(req,res)=>{const status=['new','contacted','qualified','closed','spam'].includes(req.body.status)?req.body.status:null;if(!status)return res.status(400).json({error:'Invalid status.'});await pool.query('UPDATE contact_submissions SET status=$1 WHERE id=$2',[status,req.params.id]);res.json({ok:true})});
app.patch('/api/admin/admins/:id/approval',requireOwner,async(req,res)=>{const status=['approved','rejected'].includes(req.body.status)?req.body.status:null;if(!status)return res.status(400).json({error:'Invalid approval status.'});if(String(req.session.admin.id)===String(req.params.id))return res.status(400).json({error:'You cannot change your own approval.'});await pool.query('UPDATE admins SET status=$1,approved_by=$2,approved_at=CASE WHEN $1=\'approved\' THEN NOW() ELSE NULL END WHERE id=$3 AND role<>\'owner\'',[status,req.session.admin.id,req.params.id]);res.json({ok:true})});

app.use('/assets',express.static(PUBLIC,{maxAge:'1d'}));
app.get('/admin*',(req,res)=>res.sendFile(path.join(PUBLIC,'admin.html')));
app.get(['/','/en','/en/','/ar','/ar/','/en/:page','/ar/:page'],(req,res,next)=>{const route=pageFromPath(req.path);if(!route)return next();const html=fs.readFileSync(path.join(ROOT,'public-site.html'),'utf8');res.type('html').send(addHead(html,route.lang,route.page))});
app.get('*',(req,res)=>{if(req.path.includes('.'))return res.status(404).send('Not found');res.redirect(302,'/en/')});

app.listen(PORT,()=>console.log(`Experts Group Plus platform listening on ${PORT}`));

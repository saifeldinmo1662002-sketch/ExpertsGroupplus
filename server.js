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

const AR_TRANSLATIONS = JSON.parse(fs.readFileSync(path.join(PUBLIC,'ar-translations.json'),'utf8'));
function decodeHtmlEntities(value){
 return value.replace(/&(#x[0-9a-f]+|#\d+|amp|lt|gt|quot|apos|nbsp|bull|copy|mdash|ndash|rsquo|lsquo);/gi,(match,entity)=>{
  const named={amp:'&',lt:'<',gt:'>',quot:'"',apos:"'",nbsp:'\u00a0',bull:'•',copy:'©',mdash:'—',ndash:'–',rsquo:'’',lsquo:'‘'};
  if(entity[0]==='#'){const n=entity[1].toLowerCase()==='x'?parseInt(entity.slice(2),16):parseInt(entity.slice(1),10);try{return Number.isFinite(n)?String.fromCodePoint(n):match}catch{return match}}
  return named[entity.toLowerCase()]??match;
 });
}
function encodeHtmlText(value){return String(value).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')}
function translateArabicHtml(html){
 const protectedBlocks=[];
 let output=html.replace(/<(script|style|noscript|code|pre)\b[\s\S]*?<\/\1\s*>/gi,block=>{
  const token='__EGP_AR_PROTECTED_'+protectedBlocks.length+'__';protectedBlocks.push(block);return token;
 });
 output=output.replace(/>([^<>]+)</g,(whole,raw)=>{
  const decoded=decodeHtmlEntities(raw);
  const parts=decoded.match(/^(\s*)([\s\S]*?)(\s*)$/);
  if(!parts)return whole;
  const key=parts[2].replace(/\s+/g,' ').trim();
  const translated=AR_TRANSLATIONS[key];
  if(!translated)return whole;
  return '>'+parts[1]+encodeHtmlText(translated)+parts[3]+'<';
 });
 output=output.replace(/\b(placeholder|title|aria-label|alt)\s*=\s*(["'])(.*?)\2/gi,(whole,name,quote,raw)=>{
  const key=decodeHtmlEntities(raw).replace(/\s+/g,' ').trim();
  const translated=AR_TRANSLATIONS[key];
  if(!translated)return whole;
  let safe=String(translated).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  safe=quote==='"'?safe.replace(/"/g,'&quot;'):safe.replace(/'/g,'&#39;');
  return name+'='+quote+safe+quote;
 });
 output=output.replace(/__EGP_AR_PROTECTED_(\d+)__/g,(_,i)=>protectedBlocks[Number(i)]||'');
 return output;
}

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
 let output=html.replace(/<title>[^<]*<\/title>/i,`<title>${title}</title>`).replace(/<html lang="[^"]*"/i,`<html lang="${lang}" dir="${lang==='ar'?'rtl':'ltr'}"`).replace('</head>',head+'\n</head>');
 if(lang==='ar')output=translateArabicHtml(output);
 return output;
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

function escapeEmailHtml(value=''){return String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
async function sendContactNotification(id, lead){
 const fail=async(message)=>{
  const safe=String(message||'Email delivery failed.').slice(0,500);
  try{await pool.query('UPDATE contact_submissions SET notification_status=$1,notification_error=$2 WHERE id=$3',['failed',safe,id])}catch(dbErr){console.error('Could not record contact email failure:',dbErr.message)}
  console.error('Contact notification failed for lead',id,':',safe);
  return {ok:false,error:safe};
 };
 if(!process.env.RESEND_API_KEY||!process.env.RESEND_FROM||!process.env.CONTACT_NOTIFICATION_TO){
  return fail('Email notification is not configured. Check RESEND_API_KEY, RESEND_FROM and CONTACT_NOTIFICATION_TO in Railway.');
 }
 const field=(label,value)=>`<tr><td style="padding:10px 12px;color:#64748b;font-size:12px;border-bottom:1px solid #e2e8f0;width:150px">${escapeEmailHtml(label)}</td><td style="padding:10px 12px;color:#0f172a;font-size:14px;border-bottom:1px solid #e2e8f0">${escapeEmailHtml(value||'—')}</td></tr>`;
 const plain=[
  'New website inquiry — Experts Group Plus','',
  `Name: ${lead.name}`,`Email: ${lead.email}`,`Company: ${lead.company||'—'}`,
  `Service interest: ${lead.scope||'—'}`,`Preferred contact: ${lead.preferred_contact||'—'}`,
  `Language: ${lead.language||'en'}`,'','Message:',lead.message||'—','',
  `Submission ID: ${id}`
 ].join('\n');
 const html=`<!doctype html><html><body style="margin:0;background:#f8fafc;padding:28px 12px;font-family:Arial,Helvetica,sans-serif;color:#0f172a">
 <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:640px;margin:0 auto;background:#fff;border:1px solid #e2e8f0;border-radius:18px;overflow:hidden">
 <tr><td style="background:#154695;padding:22px 26px;color:#fff"><div style="font-size:11px;letter-spacing:2px;font-weight:bold;color:#dfc87b">EXPERTS GROUP PLUS</div><h1 style="font-size:22px;line-height:1.3;margin:10px 0 0">New website inquiry</h1></td></tr>
 <tr><td style="padding:22px 26px"><p style="font-size:14px;line-height:1.6;color:#475569;margin:0 0 18px">A visitor has submitted the contact form. Their details are below.</p>
 <table role="presentation" width="100%" cellspacing="0" cellpadding="0">${field('Name',lead.name)}${field('Email',lead.email)}${field('Company',lead.company)}${field('Service interest',lead.scope)}${field('Preferred contact',lead.preferred_contact)}${field('Language',lead.language)}${field('Submission ID',id)}</table>
 <h2 style="font-size:14px;margin:22px 0 9px;color:#154695">Message</h2><div style="white-space:pre-wrap;overflow-wrap:anywhere;background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:15px;font-size:14px;line-height:1.65">${escapeEmailHtml(lead.message||'—')}</div>
 <p style="font-size:11px;color:#64748b;margin:22px 0 0">Reply directly to this email to respond to the visitor. This inquiry is also stored in the Experts Group Plus admin portal.</p>
 </td></tr></table></body></html>`;
 try{
  const response=await fetch('https://api.resend.com/emails',{
   method:'POST',
   headers:{'Authorization':`Bearer ${process.env.RESEND_API_KEY}`,'Content-Type':'application/json','Idempotency-Key':`egp-contact-${id}`},
   body:JSON.stringify({
    from:process.env.RESEND_FROM,
    to:[process.env.CONTACT_NOTIFICATION_TO],
    reply_to:[lead.email],
    subject:`New website inquiry from ${String(lead.name).replace(/[\r\n]+/g,' ').slice(0,100)}`,
    text:plain,html,
    tags:[{name:'source',value:'website-contact-form'}]
   }),
   signal:AbortSignal.timeout(12000)
  });
  const payload=await response.json().catch(()=>({}));
  if(!response.ok)return fail(payload.message||payload.name||`Resend returned HTTP ${response.status}.`);
  await pool.query('UPDATE contact_submissions SET notification_status=$1,notification_id=$2,notification_error=NULL,notification_sent_at=NOW() WHERE id=$3',['sent',payload.id||null,id]);
  return {ok:true,id:payload.id||null};
 }catch(error){return fail(error.name==='TimeoutError'?'Resend request timed out.':error.message||'Email delivery failed.')}
}


async function notifySavedLead(id){
 const q=await pool.query('SELECT id,name,email,company,scope,message,preferred_contact,language,notification_status FROM contact_submissions WHERE id=$1',[id]);
 const lead=q.rows[0];if(!lead)return {ok:false,error:'Contact submission not found.'};
 if(lead.notification_status==='sent')return {ok:true,alreadySent:true};
 return sendContactNotification(id,lead);
}

app.post('/api/contact',contactLimiter,async(req,res)=>{try{
 const {name,email,company='',scope='',message='',preferredContact='',language='en',website=''}=req.body||{};
 if(website) return res.status(200).json({ok:true});
 if(typeof name!=='string'||name.trim().length<2||name.length>160||typeof email!=='string'||email.length>254||!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))return res.status(400).json({error:'Please provide a valid name and email.'});
 const clean=v=>typeof v==='string'?v.trim().slice(0,5000):'';
 const result=await pool.query(`INSERT INTO contact_submissions(name,email,company,scope,message,preferred_contact,language) VALUES($1,$2,$3,$4,$5,$6,$7) RETURNING id`,[clean(name),clean(email),clean(company),clean(scope),clean(message),clean(preferredContact),language==='ar'?'ar':'en']);
 const id=result.rows[0].id;
 const lead={id,name:clean(name),email:clean(email),company:clean(company),scope:clean(scope),message:clean(message),preferred_contact:clean(preferredContact),language:language==='ar'?'ar':'en'};
 await sendContactNotification(id,lead); // Failure is tracked; it never removes or rejects the saved lead.
 res.status(201).json({ok:true,id,message:'Your inquiry has been received.'});
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
 pool.query('SELECT id,name,email,company,scope,message,preferred_contact,language,status,created_at,archived_at,notification_status,notification_error,notification_sent_at FROM contact_submissions ORDER BY created_at DESC LIMIT 500'),
 req.session.admin.role==='owner'?pool.query('SELECT id,email,display_name,role,status,created_at,last_login FROM admins ORDER BY created_at DESC'):Promise.resolve({rows:[]}),
 pool.query('SELECT content_type,COUNT(*)::int AS count FROM content_items GROUP BY content_type')]);
 res.json({leads:leads.rows,admins:admins.rows,counts:counts.rows});
 }catch(e){console.error(e);res.status(500).json({error:'Could not load dashboard.'})}});
// First-party, privacy-conscious analytics. Never store visitor IP addresses.
const analyticsLimiter=rateLimit({windowMs:60000,limit:90,standardHeaders:true,legacyHeaders:false});
const analyticsText=(value,max=120)=>typeof value==='string'?value.trim().slice(0,max):'';
const analyticsChoice=(value,choices,fallback='unknown')=>choices.includes(value)?value:fallback;
app.post('/api/analytics/event',analyticsLimiter,async(req,res)=>{
 try{
  const b=req.body||{},visitor=String(b.visitorId||''),sessionId=String(b.sessionId||''),event=String(b.eventName||'page_view');
  const eventTypes=['page_view','button_press','engaged_time','contact_submit'];
  if(!/^[a-f0-9-]{36}$/i.test(visitor)||!/^[a-f0-9-]{36}$/i.test(sessionId)||!eventTypes.includes(event))return res.status(400).json({error:'Invalid analytics event.'});
  const page=analyticsText(b.pagePath,300)||'/',label=analyticsText(b.eventLabel,160)||null;
  const durationMs=event==='engaged_time'?Math.round(Number(b.durationMs)):null;
  if(event==='engaged_time'&&(!Number.isFinite(durationMs)||durationMs<250||durationMs>30000))return res.status(400).json({error:'Invalid engagement duration.'});
  let referrer=null;
  try{const parsed=new URL(analyticsText(b.referrer,1000));if(['https:','http:'].includes(parsed.protocol)&&parsed.host!==req.get('host'))referrer=(parsed.origin+parsed.pathname).slice(0,300)}catch{}
  const suppliedSource=analyticsText(b.source,100),suppliedMedium=analyticsText(b.medium,100);
  let inferredHost='';try{inferredHost=new URL(referrer).hostname.replace(/^www\./,'')}catch{}
  const isSearch=/google|bing|yahoo|duckduckgo|baidu/i.test(inferredHost);
  const source=suppliedSource||(!referrer?'Direct':isSearch?inferredHost:'Referral');
  const medium=suppliedMedium||(!referrer?'direct':isSearch?'organic':'referral');
  const campaign=analyticsText(b.campaign,160)||null;
  const device=analyticsChoice(analyticsText(b.deviceCategory,20),['desktop','mobile','tablet'],'unknown');
  const browser=analyticsText(b.browser,50)||'Unknown',operatingSystem=analyticsText(b.operatingSystem,50)||'Unknown';
  const browserLanguage=analyticsText(b.language,24)||null,timezoneName=analyticsText(b.timezone,80)||null;
  await pool.query("INSERT INTO analytics_visitors(visitor_id,first_seen,last_seen,first_path,first_referrer,device_category,browser,operating_system,browser_language,timezone_name) VALUES($1,NOW(),NOW(),$2,$3,$4,$5,$6,$7,$8) ON CONFLICT(visitor_id) DO UPDATE SET last_seen=NOW()",
   [visitor,page,referrer,device,browser,operatingSystem,browserLanguage,timezoneName]);
  await pool.query("INSERT INTO analytics_sessions(session_id,visitor_id,started_at,last_seen,landing_page,referrer,source,medium,campaign,device_category,browser,operating_system,browser_language,timezone_name) VALUES($1,$2,NOW(),NOW(),$3,$4,$5,$6,$7,$8,$9,$10,$11,$12) ON CONFLICT(session_id) DO UPDATE SET last_seen=NOW()",
   [sessionId,visitor,page,referrer,source,medium,campaign,device,browser,operatingSystem,browserLanguage,timezoneName]);
  await pool.query("INSERT INTO analytics_events(session_id,visitor_id,event_name,event_label,page_path,referrer,duration_ms,created_at) VALUES($1,$2,$3,$4,$5,$6,$7,NOW())",
   [sessionId,visitor,event,label,page,referrer,durationMs]);
  res.status(202).json({ok:true});
 }catch(error){console.error('First-party analytics event failed:',error.message);res.status(500).json({error:'Could not record analytics event.'})}
});
app.get('/api/admin/analytics',requireAdmin,async(req,res)=>{
 const days=[7,28,90].includes(Number(req.query.days))?Number(req.query.days):28;
 const type=['all','page_view','button_press','contact_submit','engaged_time'].includes(String(req.query.type))?String(req.query.type):'all';
 const search=analyticsText(String(req.query.q||''),100);
 const pageNumber=Math.max(0,Math.min(10000,Math.floor(Number(req.query.page)||0))),pageSize=30,offset=pageNumber*pageSize;
 try{
  const summarySql="SELECT COUNT(DISTINCT visitor_id)::int AS visitors, COUNT(DISTINCT session_id) FILTER(WHERE event_name='page_view')::int AS visits, COUNT(*) FILTER(WHERE event_name='page_view')::int AS page_views, COUNT(*) FILTER(WHERE event_name='button_press')::int AS button_presses, COUNT(DISTINCT session_id) FILTER(WHERE event_name='contact_submit')::int AS conversions, COALESCE(ROUND(100.0*COUNT(DISTINCT session_id) FILTER(WHERE event_name='contact_submit')/NULLIF(COUNT(DISTINCT session_id) FILTER(WHERE event_name='page_view'),0),1),0)::numeric AS conversion_rate, COALESCE(SUM(duration_ms) FILTER(WHERE event_name='engaged_time'),0)::bigint AS engaged_ms, COALESCE(ROUND(COALESCE(SUM(duration_ms) FILTER(WHERE event_name='engaged_time'),0)::numeric/NULLIF(COUNT(DISTINCT session_id) FILTER(WHERE event_name='page_view'),0)),0)::bigint AS average_visit_ms FROM analytics_events WHERE created_at>=NOW()-($1::int*INTERVAL '1 day')";
  const pagesSql="WITH page_views AS(SELECT page_path,COUNT(*)::int AS views FROM analytics_events WHERE event_name='page_view' AND created_at>=NOW()-($1::int*INTERVAL '1 day') GROUP BY page_path), page_times AS(SELECT page_path,SUM(duration_ms)::bigint AS engaged_ms FROM analytics_events WHERE event_name='engaged_time' AND created_at>=NOW()-($1::int*INTERVAL '1 day') GROUP BY page_path) SELECT v.page_path,v.views,COALESCE(t.engaged_ms,0)::bigint AS engaged_ms,COALESCE(ROUND(COALESCE(t.engaged_ms,0)::numeric/NULLIF(v.views,0)),0)::bigint AS average_page_ms FROM page_views v LEFT JOIN page_times t ON t.page_path=v.page_path ORDER BY v.views DESC LIMIT 20";
  const buttonsSql="SELECT COALESCE(event_label,'Unlabelled button') AS button,page_path,COUNT(*)::int AS presses FROM analytics_events WHERE event_name='button_press' AND created_at>=NOW()-($1::int*INTERVAL '1 day') GROUP BY event_label,page_path ORDER BY presses DESC LIMIT 30";
  const dailySql="SELECT TO_CHAR(DATE_TRUNC('day',created_at),'YYYY-MM-DD') AS day,COUNT(DISTINCT visitor_id) FILTER(WHERE event_name='page_view')::int AS visitors,COUNT(*) FILTER(WHERE event_name='page_view')::int AS page_views,COUNT(DISTINCT session_id) FILTER(WHERE event_name='contact_submit')::int AS conversions,COALESCE(SUM(duration_ms) FILTER(WHERE event_name='engaged_time'),0)::bigint AS engaged_ms FROM analytics_events WHERE created_at>=NOW()-($1::int*INTERVAL '1 day') GROUP BY DATE_TRUNC('day',created_at) ORDER BY DATE_TRUNC('day',created_at)";
  const sourcesSql="SELECT COALESCE(NULLIF(source,''),'Unknown') AS source,COALESCE(NULLIF(medium,''),'—') AS medium,COALESCE(NULLIF(campaign,''),'—') AS campaign,COUNT(*)::int AS sessions,COUNT(DISTINCT visitor_id)::int AS visitors FROM analytics_sessions WHERE started_at>=NOW()-($1::int*INTERVAL '1 day') GROUP BY source,medium,campaign ORDER BY sessions DESC LIMIT 20";
  const devicesSql="SELECT COALESCE(NULLIF(device_category,''),'unknown') AS device,COALESCE(NULLIF(browser,''),'Unknown') AS browser,COALESCE(NULLIF(operating_system,''),'Unknown') AS operating_system,COALESCE(NULLIF(browser_language,''),'Unknown') AS language,COALESCE(NULLIF(timezone_name,''),'Unknown') AS timezone,COUNT(*)::int AS sessions FROM analytics_sessions WHERE started_at>=NOW()-($1::int*INTERVAL '1 day') GROUP BY device_category,browser,operating_system,browser_language,timezone_name ORDER BY sessions DESC LIMIT 20";
  const audienceSql="SELECT CASE WHEN v.first_seen>=NOW()-($1::int*INTERVAL '1 day') THEN 'New visitors' ELSE 'Returning visitors' END AS audience,COUNT(DISTINCT s.visitor_id)::int AS visitors FROM analytics_sessions s JOIN analytics_visitors v ON v.visitor_id=s.visitor_id WHERE s.started_at>=NOW()-($1::int*INTERVAL '1 day') GROUP BY audience ORDER BY audience";
  const activityWhere=" FROM analytics_events e WHERE e.created_at>=NOW()-($1::int*INTERVAL '1 day') AND ($2::text='all' OR e.event_name=$2) AND ($3::text='' OR COALESCE(e.event_label,'') ILIKE '%'||$3||'%' OR COALESCE(e.page_path,'') ILIKE '%'||$3||'%')";
  const activityCountSql='SELECT COUNT(*)::int AS total '+activityWhere;
  const activitySql="SELECT e.id,e.event_name,e.event_label,e.page_path,e.duration_ms,e.created_at,COALESCE(s.device_category,'unknown') AS device FROM analytics_events e LEFT JOIN analytics_sessions s ON s.session_id=e.session_id WHERE e.created_at>=NOW()-($1::int*INTERVAL '1 day') AND ($2::text='all' OR e.event_name=$2) AND ($3::text='' OR COALESCE(e.event_label,'') ILIKE '%'||$3||'%' OR COALESCE(e.page_path,'') ILIKE '%'||$3||'%') ORDER BY e.created_at DESC,e.id DESC LIMIT $4 OFFSET $5";
  const [summary,pages,buttons,daily,sources,devices,audience,activityCount,activity]=await Promise.all([
   pool.query(summarySql,[days]),pool.query(pagesSql,[days]),pool.query(buttonsSql,[days]),pool.query(dailySql,[days]),
   pool.query(sourcesSql,[days]),pool.query(devicesSql,[days]),pool.query(audienceSql,[days]),pool.query(activityCountSql,[days,type,search]),pool.query(activitySql,[days,type,search,pageSize,offset])
  ]);
  res.json({ok:true,days,summary:summary.rows[0]||{},pages:pages.rows,buttons:buttons.rows,daily:daily.rows,sources:sources.rows,devices:devices.rows,audience:audience.rows,activity:activity.rows,totalActivity:activityCount.rows[0]?.total||0,activityPage:pageNumber,activityPageSize:pageSize,activityType:type,activityQuery:search});
 }catch(error){console.error('Analytics dashboard query failed:',error);res.status(500).json({error:'Could not load website analytics.'})}
});app.post('/api/admin/leads/:id/notify',requireAdmin,async(req,res)=>{try{const result=await notifySavedLead(req.params.id);res.status(result.ok?200:502).json(result)}catch(e){console.error(e);res.status(500).json({error:'Could not retry the email notification.'})}});
app.get('/api/admin/content/:type',requireAdmin,async(req,res)=>{const types={reviews:'review',operations:'operation',consultation:'consultation'};const type=types[req.params.type];if(!type)return res.status(404).json({error:'Unknown content type.'});const q=await pool.query('SELECT item_key,data,sort_order FROM content_items WHERE content_type=$1 ORDER BY sort_order,id',[type]);res.json(q.rows.map(r=>({...r.data,_key:r.item_key,_sort:r.sort_order}))) });
app.post('/api/admin/content/:type',requireAdmin,async(req,res)=>{const types={reviews:'review',operations:'operation',consultation:'consultation'};const type=types[req.params.type];if(!type)return res.status(404).json({error:'Unknown content type.'});try{const data=req.body||{};const key=String(data.id||`${type}-${Date.now()}`).slice(0,100);delete data._key;delete data._sort;data.id=key;const q=await pool.query('INSERT INTO content_items(content_type,item_key,data,sort_order) VALUES($1,$2,$3,COALESCE((SELECT MAX(sort_order)+1 FROM content_items WHERE content_type=$1),0)) RETURNING item_key',[type,key,data]);res.status(201).json({ok:true,id:q.rows[0].item_key})}catch(e){if(e.code==='23505')return res.status(409).json({error:'That item ID already exists.'});console.error(e);res.status(500).json({error:'Could not save content.'})}});
app.put('/api/admin/content/:type/:key',requireAdmin,async(req,res)=>{const types={reviews:'review',operations:'operation',consultation:'consultation'};const type=types[req.params.type];if(!type)return res.status(404).json({error:'Unknown content type.'});const data=req.body||{};delete data._key;delete data._sort;data.id=req.params.key;const q=await pool.query('UPDATE content_items SET data=$1,updated_at=NOW() WHERE content_type=$2 AND item_key=$3',[data,type,req.params.key]);res.json({ok:q.rowCount===1})});
app.delete('/api/admin/content/:type/:key',requireAdmin,async(req,res)=>{const types={reviews:'review',operations:'operation',consultation:'consultation'};const type=types[req.params.type];if(!type)return res.status(404).json({error:'Unknown content type.'});await pool.query('DELETE FROM content_items WHERE content_type=$1 AND item_key=$2',[type,req.params.key]);res.json({ok:true})});
app.get('/api/admin/links',requireAdmin,async(req,res)=>{const q=await pool.query('SELECT link_key,label,url,updated_at FROM site_links ORDER BY label');res.json(q.rows)});
app.put('/api/admin/links/:key',requireAdmin,async(req,res)=>{const key=String(req.params.key).trim().slice(0,120),label=String(req.body.label||key).slice(0,160),url=safeUrl(String(req.body.url||''));if(!/^[a-zA-Z0-9_.:-]+$/.test(key)||!url)return res.status(400).json({error:'Use a valid key and absolute http(s), mailto or tel URL.'});await pool.query(`INSERT INTO site_links(link_key,label,url) VALUES($1,$2,$3) ON CONFLICT(link_key) DO UPDATE SET label=EXCLUDED.label,url=EXCLUDED.url,updated_at=NOW()`,[key,label,url]);res.json({ok:true})});
app.delete('/api/admin/links/:key',requireAdmin,async(req,res)=>{await pool.query('DELETE FROM site_links WHERE link_key=$1',[req.params.key]);res.json({ok:true})});
app.patch('/api/admin/leads/:id',requireAdmin,async(req,res)=>{const status=['new','contacted','qualified','closed','spam'].includes(req.body.status)?req.body.status:null;if(!status)return res.status(400).json({error:'Invalid status.'});await pool.query('UPDATE contact_submissions SET status=$1 WHERE id=$2',[status,req.params.id]);res.json({ok:true})});
app.patch('/api/admin/leads/:id/archive',requireAdmin,async(req,res)=>{const archived=req.body.archived===true;if(typeof req.body.archived!=='boolean')return res.status(400).json({error:'Archived must be true or false.'});const q=await pool.query('UPDATE contact_submissions SET archived_at=CASE WHEN $1 THEN COALESCE(archived_at,NOW()) ELSE NULL END WHERE id=$2',[archived,req.params.id]);if(!q.rowCount)return res.status(404).json({error:'Contact submission not found.'});res.json({ok:true,archived})});
app.delete('/api/admin/leads/:id',requireAdmin,async(req,res)=>{const q=await pool.query('DELETE FROM contact_submissions WHERE id=$1',[req.params.id]);if(!q.rowCount)return res.status(404).json({error:'Contact submission not found.'});res.json({ok:true})});
app.patch('/api/admin/admins/:id/approval',requireOwner,async(req,res)=>{const status=['approved','rejected'].includes(req.body.status)?req.body.status:null;if(!status)return res.status(400).json({error:'Invalid approval status.'});if(String(req.session.admin.id)===String(req.params.id))return res.status(400).json({error:'You cannot change your own approval.'});await pool.query('UPDATE admins SET status=$1,approved_by=$2,approved_at=CASE WHEN $1=\'approved\' THEN NOW() ELSE NULL END WHERE id=$3 AND role<>\'owner\'',[status,req.session.admin.id,req.params.id]);res.json({ok:true})});

app.use('/assets',express.static(PUBLIC,{maxAge:'1d'}));
app.get(['/admin','/admin/'],(req,res)=>{res.set('Cache-Control','no-store, max-age=0, must-revalidate');res.sendFile(path.join(PUBLIC,'admin.html'))});
app.get(['/','/en','/en/','/ar','/ar/','/en/:page','/ar/:page'],(req,res,next)=>{const route=pageFromPath(req.path);if(!route)return next();const html=fs.readFileSync(path.join(ROOT,'public-site.html'),'utf8');res.type('html').send(addHead(html,route.lang,route.page))});
app.get('*',(req,res)=>{if(req.path.includes('.'))return res.status(404).send('Not found');res.redirect(302,'/en/')});

app.listen(PORT,()=>console.log(`Experts Group Plus platform listening on ${PORT}`));

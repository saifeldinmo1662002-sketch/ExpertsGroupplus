(()=> {
const nav=document.querySelector('.admin-nav'); if(!nav)return;
const seoButton=nav.querySelector('[data-tab="seo"]');
const faviconButton=nav.querySelector('[data-tab="favicon"]');
const arrangeButton=nav.querySelector('[data-tab="arrange"]');
if(!seoButton||!faviconButton||!arrangeButton)return;
const defaultOrder=[...nav.querySelectorAll('button[data-tab]')].map(b=>b.dataset.tab);
const originalGo=window.go;
let savedOrder=null;
let orderLoaded=false;
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let state={pages:[],settings:[],google:{},page:'home',language:'en'};
async function request(url,options={}){const r=await fetch(url,{credentials:'same-origin',headers:{'Content-Type':'application/json'},...options});const j=await r.json().catch(()=>({}));if(!r.ok)throw Error(j.error||'Request failed');return j}

function markTab(tab){nav.querySelectorAll('[data-tab]').forEach(b=>b.classList.toggle('active',b.dataset.tab===tab));}
function applyOrder(order){
 const elements=new Map([...nav.querySelectorAll('[data-tab]')].map(b=>[b.dataset.tab,b]));
 for(const key of order){const el=elements.get(key);if(el)nav.appendChild(el)}
}
async function loadOrder(){
 try{
  const result=await request('/api/admin/navigation');
  if(Array.isArray(result.order)&&result.order.length===defaultOrder.length&&
     new Set(result.order).size===defaultOrder.length&&
     result.order.every(key=>defaultOrder.includes(key))){
    savedOrder=result.order.slice();
    applyOrder(savedOrder);
  }
  orderLoaded=true;
 }catch(err){/* Login may still be pending; retry after authentication. */}
}
function renderArrange(){
 const root=document.querySelector('#content');if(!root)return;
 const order=savedOrder?savedOrder.slice():defaultOrder.slice();
 const labels=new Map([...nav.querySelectorAll('[data-tab]')].map(el=>[el.dataset.tab,el.textContent.trim()]));
 function draw(){
  root.innerHTML='<div class="heading"><div><h1>Arrange admin pages</h1><p class="note">Move admin sidebar pages up or down and review the new order before saving. Public website pages are unchanged.</p></div></div>'+
  '<section class="panel"><h2>Page order</h2><div id="arrange-list"></div><div class="actions" style="margin-top:20px"><button class="btn primary" id="arrange-save" type="button">Save order</button> <button class="btn light" id="arrange-reset" type="button">Discard changes</button> <button class="btn light" id="arrange-default" type="button">Restore default</button> <span id="arrange-status" class="note"></span></div></section>';
  const list=root.querySelector('#arrange-list');
  order.forEach((key,i)=>{
   const row=document.createElement('div');
   row.style.cssText='display:flex;align-items:center;justify-content:space-between;gap:12px;padding:12px 0;border-bottom:1px solid var(--line)';
   const label=document.createElement('strong');label.textContent=labels.get(key)||key;
   const controls=document.createElement('div');controls.style.cssText='display:flex;gap:8px';
   for(const [delta,name] of [[-1,'↑ Up'],[1,'↓ Down']]){
    const b=document.createElement('button');b.type='button';b.className='btn light small';b.textContent=name;b.disabled=i+delta<0||i+delta>=order.length;
    b.onclick=()=>{[order[i],order[i+delta]]=[order[i+delta],order[i]];draw()};
    controls.appendChild(b);
   }
   row.append(label,controls);list.appendChild(row);
  });
  root.querySelector('#arrange-save').onclick=async()=>{
   const status=root.querySelector('#arrange-status');status.textContent='Saving…';
   try{await request('/api/admin/navigation',{method:'PUT',body:JSON.stringify({order})});savedOrder=order.slice();applyOrder(savedOrder);status.textContent='Saved. Your admin sidebar now uses this order.'}
   catch(err){status.textContent=err.message}
  };
  root.querySelector('#arrange-reset').onclick=()=>{order.splice(0,order.length,...(savedOrder||defaultOrder));draw()};
  root.querySelector('#arrange-default').onclick=()=>{order.splice(0,order.length,...defaultOrder);draw()};
 }
 draw();
}
function openSeo(tab){
 markTab(tab);
 if(tab==='favicon'){renderFaviconPage();return;}
 load().catch(err=>{const root=document.querySelector('#content');if(root)root.innerHTML='<section class="panel">'+esc(err.message)+'</section>'});
}

const seoRecommendations={"en":{"home":["Business Consulting, Training & BPO | Experts Group Plus","Grow your business with corporate training, strategic consulting, outsourced operations and BPO services from Experts Group Plus.","business consulting","corporate training, business consulting services, business process outsourcing, BPO services, outsourced operations"],"about":["About Experts Group Plus | Business Services Partner","Discover how Experts Group Plus supports organizations through practical training, business consulting, operations and outsourcing services.","business services","about Experts Group Plus, business consulting company, corporate services, business solutions"],"training":["Corporate Training & Employee Development | Experts Group Plus","Build employee and leadership capabilities with practical corporate training programs designed around your team's needs and business goals.","corporate training","employee development, leadership training, management training, staff training programs"],"consultation":["Business Consulting & Strategic Advisory | Experts Group Plus","Improve business performance with management consulting, strategic planning, operational reviews and practical advisory support.","business consulting","management consulting, strategic advisory, business strategy, operational improvement"],"operations":["Outsourced Business Operations | Experts Group Plus","Access flexible business operations support across marketing, creative, technology and corporate functions, tailored to your organization.","outsourced business operations","business operations support, outsourced operations, marketing operations, technology services"],"bpo":["BPO & Business Process Outsourcing | Experts Group Plus","Explore business process outsourcing for customer support, sales support and back-office operations with Experts Group Plus.","business process outsourcing","BPO services, customer support outsourcing, sales support outsourcing, back office outsourcing"],"contact":["Contact Experts Group Plus | Schedule a Consultation","Speak with Experts Group Plus about corporate training, business consulting, outsourced operations or BPO. Schedule a conversation.","contact Experts Group Plus","schedule a consultation, business services inquiry, contact business consultants"]},"ar":{"home":["خدمات الأعمال والاستشارات والتعهيد | خبراء جروب بلس","نساعد الشركات على تطوير أعمالها من خلال التدريب المؤسسي والاستشارات الإدارية وخدمات التشغيل وتعهيد العمليات، بحلول تناسب احتياجات كل شركة.","خدمات الأعمال","استشارات إدارية، تدريب الشركات، خدمات التعهيد، تشغيل الأعمال، حلول الأعمال"],"about":["من نحن | خبراء جروب بلس لخدمات الأعمال","تعرّف على خبراء جروب بلس وكيف نساعد الشركات في التدريب وتطوير الأداء والاستشارات الإدارية وتشغيل الأعمال وخدمات التعهيد.","خبراء جروب بلس","من نحن، شركة خدمات أعمال، حلول للشركات، استشارات وتدريب"],"training":["تدريب الشركات وتطوير الموظفين | خبراء جروب بلس","برامج تدريب عملي للشركات والموظفين والمديرين، مصممة لتطوير المهارات ورفع كفاءة الفرق وتحسين الأداء في بيئة العمل.","تدريب الشركات","تطوير الموظفين، تدريب المديرين، برامج تدريب مؤسسي، تطوير المهارات"],"consultation":["استشارات إدارية وتطوير الأعمال | خبراء جروب بلس","استشارات إدارية واستراتيجية لمساعدة الشركات على تقييم الأداء وتطوير خطط العمل وتحسين العمليات واتخاذ قرارات أفضل.","استشارات إدارية","استشارات للشركات، تطوير الأعمال، التخطيط الاستراتيجي، تحسين العمليات"],"operations":["خدمات تشغيل وإدارة الأعمال | خبراء جروب بلس","دعم مرن لتشغيل الأعمال في التسويق والتصميم والتقنية والوظائف الإدارية، بما يتناسب مع طبيعة شركتك واحتياجاتها.","تشغيل الأعمال","إدارة العمليات، خدمات تشغيل للشركات، دعم الأعمال، خدمات التسويق والتقنية"],"bpo":["تعهيد العمليات وخدمات BPO للشركات | خبراء جروب بلس","حلول تعهيد العمليات للشركات تشمل دعم العملاء ومساندة المبيعات والأعمال المكتبية والإدارية، مع مرونة تناسب حجم العمل.","تعهيد العمليات","خدمات BPO، تعهيد خدمة العملاء، دعم المبيعات، تعهيد الأعمال الإدارية"],"contact":["تواصل معنا واحجز استشارة | خبراء جروب بلس","تواصل مع فريق خبراء جروب بلس لمناقشة احتياجات شركتك في التدريب والاستشارات الإدارية والتشغيل وخدمات تعهيد العمليات.","تواصل معنا","احجز استشارة، التواصل مع خبراء جروب بلس، استفسارات خدمات الشركات"]}};
function recommendation(){const [title,description,keyword]=seoRecommendations[state.language][state.page];return {seo_title:title,meta_description:description,focus_keyword:keyword,additional_keywords:seoRecommendations[state.language][state.page][3],canonical_url:'',robots_directive:'index,follow,max-image-preview:large',social_title:title,social_description:description,social_image:'',seo_notes:''}}
function current(){return state.settings.find(x=>x.page_key===state.page&&x.language===state.language)||recommendation()}
async function load(){state=Object.assign(state,await request('/api/admin/seo'));render()}

function initializeFavicon(root){
const faviconInput=root.querySelector('#seo-favicon-url');const faviconStatus=root.querySelector('#seo-favicon-status');const faviconPreview=root.querySelector('#seo-favicon-preview');
function showFavicon(){faviconPreview.replaceChildren();if(faviconInput.value){const img=document.createElement('img');img.src=faviconInput.value.includes('/favicon-upload')?faviconInput.value+'?preview='+Date.now():faviconInput.value;img.alt='Favicon preview';img.width=48;img.height=48;img.style.marginTop='12px';faviconPreview.appendChild(img)}}
request('/api/admin/seo/favicon').then(d=>{faviconInput.value=d.url||'';showFavicon()}).catch(e=>{faviconStatus.textContent=e.message});
root.querySelector('#seo-favicon-save').onclick=async()=>{faviconStatus.textContent='Saving…';try{await request('/api/admin/seo/favicon',{method:'PUT',body:JSON.stringify({url:faviconInput.value})});showFavicon();faviconStatus.textContent='Saved. Search engines may take time to update the favicon.'}catch(e){faviconStatus.textContent=e.message}};
root.querySelector('#seo-favicon-upload').onclick=async()=>{const file=root.querySelector('#seo-favicon-file').files[0];if(!file){faviconStatus.textContent='Select an image first.';return}if(file.size>250000){faviconStatus.textContent='Image must be under 250 KB.';return}faviconStatus.textContent='Uploading…';try{const mimeType=file.name.toLowerCase().endsWith('.ico')?'image/x-icon':file.name.toLowerCase().endsWith('.svg')?'image/svg+xml':file.type;const data=await new Promise((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(String(reader.result).split(',')[1]);reader.onerror=()=>reject(new Error('Could not read image.'));reader.readAsDataURL(file)});const result=await request('/api/admin/seo/favicon/upload',{method:'POST',body:JSON.stringify({mimeType,data})});faviconInput.value=result.url;showFavicon();faviconStatus.textContent='Uploaded and saved. Google may take time to update search results.'}catch(e){faviconStatus.textContent=e.message}};

}
function renderFaviconPage(){
 const root=document.querySelector('#content');if(!root)return;
 root.innerHTML='<div class="heading"><div><h1>Upload website favicon</h1><p class="note">Manage the small icon used by browsers and potentially Google Search for all Experts Group Plus pages, English and Arabic.</p></div></div>'+
 '<section class="panel" style="max-width:760px"><h2>Current favicon</h2><div id="seo-favicon-preview" style="min-height:60px"></div>'+
 '<div class="field"><label>Select a favicon image from your computer</label><input id="seo-favicon-file" type="file" accept=".png,.ico,.svg,image/png,image/x-icon,image/vnd.microsoft.icon,image/svg+xml"></div>'+
 '<p class="note">Recommended: square PNG or ICO, 48 × 48 pixels or larger, up to 250 KB.</p>'+
 '<button type="button" id="seo-favicon-upload" class="btn primary">Upload favicon and save</button> <span id="seo-favicon-status" class="note"></span>'+
 '<hr style="margin:24px 0;border:0;border-top:1px solid var(--line)"><div class="field"><label>Or use a favicon image URL (HTTPS)</label>'+
 '<input id="seo-favicon-url" type="url" placeholder="https://www.expertsgp.com/favicon.ico"></div>'+
 '<button type="button" id="seo-favicon-save" class="btn light">Save image URL</button>'+
 '<p class="note" style="margin-top:18px">Once saved, the favicon is used across the public website. Google may take time to update its search results.</p></section>';
 initializeFavicon(root);
}

function render(){
const root=document.querySelector('#content'); if(!root)return; const x=current();
root.innerHTML='<div class="heading"><div><h1>SEO Manager</h1><p class="note">Edit search metadata for every live page in English and Arabic. URL paths remain protected to prevent broken indexed links.</p></div></div>'+
'<section class="panel" id="seo-google"><h2>Google Search Console</h2><p class="note">'+esc(state.google.reason||'Google API connection status unavailable.')+'</p><span class="pill pending">Website API: Not configured</span><p class="note">Search Console data connected inside ChatGPT is not automatically available to the Railway website. A Google OAuth client ID, client secret and refresh token (or an authorized service account) must be configured on Railway for live metrics here.</p></section>'+
'<section class="panel"><h2>Search result favicon</h2><p class="note">One favicon for the whole website, including English and Arabic. Use a square PNG, ICO or SVG image, preferably at least 48 × 48 pixels. Google chooses when to refresh search result icons.</p><div class="field"><label>Upload favicon from your computer</label><input id="seo-favicon-file" type="file" accept=".png,.ico,.svg,image/png,image/x-icon,image/vnd.microsoft.icon,image/svg+xml"><button class="btn primary" type="button" id="seo-favicon-upload">Upload favicon</button></div><p class="note">Maximum 250 KB. PNG or ICO recommended for Google Search.</p><div class="field"><label>Or enter a favicon image URL (HTTPS)</label><input id="seo-favicon-url" type="url" placeholder="https://www.expertsgp.com/favicon.ico"></div><button class="btn primary" type="button" id="seo-favicon-save">Save favicon</button> <span class="note" id="seo-favicon-status"></span><div id="seo-favicon-preview"></div></section>'+'<section class="panel"><div class="field"><label>Page</label><select id="seo-page">'+state.pages.map(p=>'<option value="'+esc(p.key)+'" '+(p.key===state.page?'selected':'')+'>'+esc(p.label)+'</option>').join('')+'</select></div><div class="field"><label>Language</label><select id="seo-language"><option value="en" '+(state.language==='en'?'selected':'')+'>English</option><option value="ar" '+(state.language==='ar'?'selected':'')+'>العربية</option></select></div><p class="note">Live route: <code>/'+state.language+'/'+(state.page==='home'?'':state.page)+'</code></p></section>'+
'<section class="panel"><h2>Recommended SEO</h2><p class="note">Optimized suggestions for this page and language. Existing saved settings are preserved until you choose to replace them.</p><button type="button" class="btn" id="seo-use-recommendation">Use recommended SEO fields</button></section>'+
'<form id="seo-form"><section class="panel"><h2>Search appearance</h2><div class="field"><label>SEO title</label><input name="seo_title" maxlength="180" required value="'+esc(x.seo_title)+'"><p class="note">Recommended: 50–60 characters. <span id="seo-tc"></span></p></div><div class="field"><label>Meta description</label><textarea name="meta_description" rows="3" maxlength="500" required>'+esc(x.meta_description)+'</textarea><p class="note">Recommended: 140–160 characters. <span id="seo-dc"></span></p></div><div class="field"><label>Focus keyword</label><input name="focus_keyword" maxlength="160" value="'+esc(x.focus_keyword)+'"></div><div class="field"><label>Additional keywords (comma-separated)</label><textarea name="additional_keywords" rows="2" maxlength="1000">'+esc(x.additional_keywords)+'</textarea><p class="note">Planning aid only: Google does not use the meta-keywords tag as a ranking signal.</p></div><div class="field"><label>Canonical URL (optional)</label><input name="canonical_url" type="url" value="'+esc(x.canonical_url)+'" placeholder="https://www.expertsgp.com/en/"></div><div class="field"><label>Indexing</label><select name="robots_directive"><option value="index,follow,max-image-preview:large">Index, follow</option><option value="noindex,follow">No index, follow</option><option value="index,nofollow">Index, no follow</option><option value="noindex,nofollow">No index, no follow</option></select></div></section>'+
'<section class="panel"><h2>Social sharing</h2><div class="field"><label>Social title</label><input name="social_title" maxlength="180" value="'+esc(x.social_title)+'"></div><div class="field"><label>Social description</label><textarea name="social_description" rows="2" maxlength="500">'+esc(x.social_description)+'</textarea></div><div class="field"><label>Social image URL (HTTPS)</label><input name="social_image" type="url" value="'+esc(x.social_image)+'"></div><div class="field"><label>Internal SEO notes</label><textarea name="seo_notes" rows="3" maxlength="4000">'+esc(x.seo_notes)+'</textarea></div></section>'+
'<section class="panel"><h2>Google search preview</h2><div style="max-width:620px;padding:16px;border:1px solid var(--border,#ddd);border-radius:10px"><div style="color:#188038;font-size:13px">expertsgp.com › '+state.language+' › '+esc(state.page)+'</div><div id="seo-preview-title" style="font-size:20px;color:#1a0dab;margin:6px 0"></div><div id="seo-preview-desc" style="font-size:14px"></div></div><p class="note" id="seo-checks"></p></section><button class="btn primary" type="submit">Save SEO settings</button> <span id="seo-status" class="note"></span></form>';
initializeFavicon(root);
const googlePanel=root.querySelector('#seo-google');
if(state.google.configured){
 googlePanel.innerHTML='<h2>Google Search Console</h2><span class="pill pending">Checking connection…</span><p class="note">Testing the live Apps Script bridge for '+esc(state.google.site||'sc-domain:expertsgp.com')+'.</p><div id="seo-gsc-results" class="note">Requesting real Search Console data…</div>';
 request('/api/admin/seo/search-console').then(g=>{
  const rows=g.rows||[],clicks=rows.reduce((a,x)=>a+Number(x.clicks||0),0),impressions=rows.reduce((a,x)=>a+Number(x.impressions||0),0),ctr=impressions?100*clicks/impressions:0,avg=impressions?rows.reduce((a,x)=>a+Number(x.position||0)*Number(x.impressions||0),0)/impressions:0;
  googlePanel.innerHTML='<h2>Google Search Console</h2><span class="pill approved">Connected · Data received</span><p class="note">Property: '+esc(g.site)+' · Reporting window: '+esc(g.startDate)+' to '+esc(g.endDate)+'</p>'+
  '<div class="stats-grid"><div class="stat"><span>Clicks in returned rows</span><b>'+clicks+'</b></div><div class="stat"><span>Impressions in returned rows</span><b>'+impressions+'</b></div><div class="stat"><span>CTR (weighted)</span><b>'+ctr.toFixed(1)+'%</b></div><div class="stat"><span>Avg. position (weighted)</span><b>'+avg.toFixed(1)+'</b></div></div>'+
  '<div class="table-wrap"><table><thead><tr><th>Page / search query</th><th>Clicks</th><th>Impressions</th><th>CTR</th><th>Position</th></tr></thead><tbody>'+rows.slice(0,30).map(x=>'<tr><td>'+esc(x.keys?.join(' · ')||'—')+'</td><td>'+Number(x.clicks||0)+'</td><td>'+Number(x.impressions||0)+'</td><td>'+(Number(x.ctr||0)*100).toFixed(1)+'%</td><td>'+Number(x.position||0).toFixed(1)+'</td></tr>').join('')+'</tbody></table></div>'+
  '<p class="note">Received '+rows.length+' rows at '+esc(g.retrievedAt||'')+'. Metrics are sums/weighted averages of the returned page-and-query rows, not necessarily the full property totals because Google may omit anonymized queries and limit returned rows. An empty result is not proof of zero traffic.</p>';
 }).catch(e=>{
  googlePanel.innerHTML='<h2>Google Search Console</h2><span class="pill pending">Connection not verified</span><p class="note">'+esc(e.message)+'</p><p class="note">Check that the Apps Script deployment is the latest version, its shared secret exactly matches the Railway variable, and the Search Console API service is enabled in Apps Script.</p>';
 })
}else{
 googlePanel.innerHTML='<h2>Google Search Console</h2><span class="pill pending">Bridge not configured</span><p class="note">The website backend needs GSC_BRIDGE_URL and GSC_BRIDGE_SECRET in the Railway production service. Keep the shared secret private. The script also needs Search Console API enabled and access to the sc-domain:expertsgp.com property.</p>'
}
const form=root.querySelector('#seo-form'); form.elements.robots_directive.value=x.robots_directive||'index,follow,max-image-preview:large';
function preview(){const t=form.elements.seo_title.value,d=form.elements.meta_description.value,k=form.elements.focus_keyword.value.toLowerCase();root.querySelector('#seo-tc').textContent=t.length+' characters';root.querySelector('#seo-dc').textContent=d.length+' characters';root.querySelector('#seo-preview-title').textContent=t||'Page title preview';root.querySelector('#seo-preview-desc').textContent=d||'Meta description preview';const checks=[['Title length',t.length>=30&&t.length<=60],['Description length',d.length>=120&&d.length<=160],['Keyword in title',!k||t.toLowerCase().includes(k)],['Keyword in description',!k||d.toLowerCase().includes(k)]];root.querySelector('#seo-checks').textContent=checks.map(c=>(c[1]?'✓ ':'○ ')+c[0]).join(' · ')}
root.querySelector('#seo-use-recommendation').onclick=()=>{const r=recommendation();form.elements.seo_title.value=r.seo_title;form.elements.meta_description.value=r.meta_description;form.elements.focus_keyword.value=r.focus_keyword;form.elements.additional_keywords.value=r.additional_keywords;form.elements.social_title.value=r.social_title;form.elements.social_description.value=r.social_description;preview();root.querySelector('#seo-status').textContent='Recommendation loaded. Click Save SEO settings to publish.'};
form.addEventListener('input',preview);preview();form.onsubmit=async e=>{e.preventDefault();const payload=Object.fromEntries(new FormData(form));const status=root.querySelector('#seo-status');status.textContent='Saving…';try{await request('/api/admin/seo/'+state.page+'/'+state.language,{method:'PUT',body:JSON.stringify(payload)});const refreshed=await request('/api/admin/seo');state.settings=refreshed.settings;status.textContent='Saved successfully.'}catch(err){status.textContent=err.message}};
root.querySelector('#seo-page').onchange=e=>{state.page=e.target.value;render()};root.querySelector('#seo-language').onchange=e=>{state.language=e.target.value;render()};
}
if(typeof originalGo==='function'){
 window.go=function(tab){
  if(tab==='seo'||tab==='favicon'){if(!orderLoaded)loadOrder();openSeo(tab);return}
  if(tab==='arrange'){markTab('arrange');if(orderLoaded)renderArrange();else loadOrder().then(renderArrange);return}
  if(!orderLoaded)loadOrder();
  return originalGo(tab);
 };
}
loadOrder();
})();
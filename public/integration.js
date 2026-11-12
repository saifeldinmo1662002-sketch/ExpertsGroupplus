(() => {
  const pageNames = ['home','about','training','consultation','operations','bpo','contact'];
  const originalNavigate = window.navigateTo;
  const originalApplyLanguage = window.applySiteLanguage;
  const routeInfo = () => {
    const m = location.pathname.match(/^\/(en|ar)(?:\/([^/]+))?\/?$/);
    const hash=location.hash.replace(/^#/, '');return {lang:m?m[1]:(document.documentElement.lang==='ar'?'ar':'en'),page:m&&m[2]?m[2]:(pageNames.includes(hash)?hash:'home')};
  };
  const pathFor = (lang,page) => `/${lang}/${page==='home'?'':page}`.replace(/\/$/,'/') ;
  function updateSeo(lang,page){
    const meta={
      home:['Experts Group Plus | Managed Business Services','Integrated training, consulting, operations and BPO services for growing businesses.'],
      about:['About Experts Group Plus | Our Company','Learn about Experts Group Plus, our approach, service model and business capabilities.'],
      training:['Corporate Training Services | Experts Group Plus','Practical employee, department and management training programs for business performance.'],
      consultation:['Business Consultation & Strategy | Experts Group Plus','Business diagnostics, operational strategy and advisory services for sustainable growth.'],
      operations:['Business Operations Services | Experts Group Plus','Specialist operational services across marketing, creative, technology and corporate functions.'],
      bpo:['Business Process Outsourcing | Experts Group Plus','Scalable customer support, sales support and back-office outsourcing solutions.'],
      contact:['Contact Experts Group Plus | Start a Conversation','Contact Experts Group Plus to discuss training, consulting, operations and outsourcing.']
    };
    const arMeta={home:['خبراء جروب بلس | حلول متكاملة للأعمال','حلول متكاملة في التدريب والاستشارات والعمليات وخدمات التعهيد لدعم نمو الشركات.'],about:['من نحن | خبراء جروب بلس','تعرّف على خبراء جروب بلس ومنهجية العمل والخدمات التي نقدمها للشركات.'],training:['التدريب المؤسسي | خبراء جروب بلس','برامج تدريب عملية للموظفين والإدارات والقيادات لتحسين أداء الأعمال.'],consultation:['الاستشارات الإدارية والاستراتيجية | خبراء جروب بلس','تشخيص الأعمال وتطوير الاستراتيجيات وتحسين العمليات لتحقيق نمو مستدام.'],operations:['خدمات العمليات | خبراء جروب بلس','خدمات تشغيل متخصصة في التسويق والإبداع والتقنية والوظائف المؤسسية.'],bpo:['خدمات تعهيد العمليات التجارية | خبراء جروب بلس','حلول مرنة لدعم العملاء والمبيعات والعمليات الإدارية والمساندة.'],contact:['تواصل مع خبراء جروب بلس','تواصل مع فريق خبراء جروب بلس لمناقشة خدماتنا.']};const p=(lang==='ar'?arMeta:meta)[page]||meta.home;document.title=p[0];
    let d=document.querySelector('meta[name="description"]');if(!d){d=document.createElement('meta');d.name='description';document.head.appendChild(d)}d.content=p[1];
    let c=document.querySelector('link[rel="canonical"]');if(!c){c=document.createElement('link');c.rel='canonical';document.head.appendChild(c)}c.href=location.origin+pathFor(lang,page);
    [['en','en'],['ar','ar'],['x-default','en']].forEach(([hreflang,l])=>{let el=document.querySelector(`link[rel="alternate"][hreflang="${hreflang}"]`);if(!el){el=document.createElement('link');el.rel='alternate';el.hreflang=hreflang;document.head.appendChild(el)}el.href=location.origin+pathFor(l,page)});
    document.documentElement.lang=lang;document.documentElement.dir=lang==='ar'?'rtl':'ltr';[['og:title',p[0]],['og:description',p[1]],['og:url',location.origin+pathFor(lang,page)]].forEach(([prop,value])=>{let el=document.querySelector(`meta[property="${prop}"]`);if(!el){el=document.createElement('meta');el.setAttribute('property',prop);document.head.appendChild(el)}el.content=value});
  }
  function showPage(page){if(!pageNames.includes(page))page='home';document.querySelectorAll('.page-view').forEach(view=>view.classList.add('hidden'));const target=document.getElementById('view-'+page);if(target)target.classList.remove('hidden');document.querySelectorAll('.nav-link').forEach(btn=>btn.classList.remove('text-brand-blue','dark:text-brand-gold'));const active=document.getElementById('nav-btn-'+page);if(active)active.classList.add('text-brand-blue','dark:text-brand-gold');window.scrollTo({top:0,behavior:'auto'});return page;}
  function route(lang,page,replace=false){if(!pageNames.includes(page))page='home';const url=pathFor(lang,page);history[replace?'replaceState':'pushState']({page,lang},'',url);showPage(page);document.documentElement.lang=lang;document.documentElement.dir=lang==='ar'?'rtl':'ltr';try{localStorage.setItem('eg_language',lang)}catch(e){}updateSeo(lang,page);if(typeof window.egApplyTranslations==='function')window.egApplyTranslations(lang,false);}
  window.navigateTo=function(page,updateHistory=true){const r=routeInfo();route(r.lang,page,!updateHistory);};
  window.applySiteLanguage=function(lang,announce=false){const r=routeInfo(),next=lang==='ar'?'ar':'en';if(next!==r.lang){location.assign(pathFor(next,r.page));return;}route(next,r.page,false);if(announce&&typeof showGlobalToast==='function')showGlobalToast(next==='ar'?'تم تفعيل اللغة العربية':'English language enabled');};
  window.toggleLanguage=function(){const r=routeInfo();const next=r.lang==='en'?'ar':'en';window.location.href=pathFor(next,r.page);};
  window.addEventListener('popstate',()=>{const r=routeInfo();showPage(r.page);document.documentElement.lang=r.lang;document.documentElement.dir=r.lang==='ar'?'rtl':'ltr';try{localStorage.setItem('eg_language',r.lang)}catch(e){}updateSeo(r.lang,r.page);if(typeof window.egApplyTranslations==='function')window.egApplyTranslations(r.lang,false)});

  // Replace the browser-only lead capture with a server-persisted submission.
  window.handleContactSubmit=async function(e){
    e.preventDefault();const form=e.currentTarget;const get=id=>form.querySelector('#'+id)?.value||'';
    const submit=form.querySelector('[type="submit"]');if(submit){submit.disabled=true;submit.dataset.oldText=submit.textContent;submit.textContent=routeInfo().lang==='ar'?'جارٍ الإرسال...':'Sending...'}
    try{
      const body={name:get('contact-name'),email:get('contact-email'),company:get('contact-company'),scope:get('contact-scope'),message:form.querySelector('textarea')?.value||'',language:routeInfo().lang,website:form.querySelector('[name="website"]')?.value||''};
      const res=await fetch('/api/contact',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});const data=await res.json();if(!res.ok)throw new Error(data.error||'Submission failed');form.reset();if(window.EGPAnalytics)window.EGPAnalytics.track('contact_submit','Contact form submitted');if(typeof showGlobalToast==='function')showGlobalToast(routeInfo().lang==='ar'?'تم استلام طلبك بنجاح. سنتواصل معك قريبًا.':'Thank you. Your inquiry has been received.');
    }catch(err){if(typeof showGlobalToast==='function')showGlobalToast(err.message||'Could not submit your inquiry.');else alert(err.message)}finally{if(submit){submit.disabled=false;submit.textContent=submit.dataset.oldText||'Submit'}}
  };

  const keyFor=(el,i)=>{if(el.dataset.egLink)return el.dataset.egLink;let key=el.id||el.getAttribute('aria-label')||el.textContent.trim().replace(/\s+/g,' ').slice(0,48).toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')||`control-${i}`;key=key.toLowerCase().replace(/[^a-z0-9_.:-]+/g,'-').replace(/^-|-$/g,'').slice(0,70)||`control-${i}`;el.dataset.egLink=key;return key};
  let linkMap={};
  function applyLinks(){let els=[...document.querySelectorAll('a[href],button[onclick],button[data-eg-link]')];els.forEach((el,i)=>{if(el.matches('[onclick*="navigateTo"], [id^="nav-btn-"]'))return;const key=keyFor(el,i);let url=linkMap[key];if(!url)return;const currentLang=routeInfo().lang;if(url.startsWith(location.origin+'/en/'))url=url.replace(location.origin+'/en/',location.origin+`/${currentLang}/`);if(el.tagName==='A'){el.href=url;if(!url.startsWith(location.origin+'/')){el.target='_blank';el.rel='noopener noreferrer'}}else{el.addEventListener('click',ev=>{ev.preventDefault();ev.stopImmediatePropagation();if(url.startsWith('mailto:')||url.startsWith('tel:')||url.startsWith(location.origin+'/'))location.href=url;else window.open(url,'_blank','noopener,noreferrer')},{capture:true,once:true})}})}

  const arabicRefinements={
    'بنؤمن إن كل شركة':'نؤمن بأن كل شركة',
    'عايز تحسّن':'ترغب في تحسين',
    'احكيلنا عن حجم فريقك':'أخبرنا عن حجم فريقك',
    'بنختار المتخصصين':'نختار المتخصصين',
    'تواصل معانا':'تواصل معنا'
  };
  function refineArabic(root=document.body){if(document.documentElement.lang!=='ar')return;const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);let n;while(n=walker.nextNode()){let v=n.nodeValue;for(const [a,b] of Object.entries(arabicRefinements))v=v.replaceAll(a,b);if(v!==n.nodeValue)n.nodeValue=v}}

  function decodeCmsEntities(value) {
    let decoded = String(value);
    const pattern = /&(#x[0-9a-f]+|#\d+|amp|lt|gt|quot|apos|nbsp|copy|mdash|ndash|rsquo|lsquo);/gi;
    for (let pass = 0; pass < 3; pass++) {
      const next = decoded.replace(pattern, (match, entity) => {
        if (entity[0] === '#') {
          const number = entity[1].toLowerCase() === 'x' ? parseInt(entity.slice(2), 16) : parseInt(entity.slice(1), 10);
          try { return Number.isFinite(number) ? String.fromCodePoint(number) : match; } catch (_) { return match; }
        }
        const named = { amp:'&', lt:'<', gt:'>', quot:'"', apos:"'", nbsp:'\u00a0', copy:'©', mdash:'—', ndash:'–', rsquo:'’', lsquo:'‘' };
        return named[entity.toLowerCase()] ?? match;
      });
      if (next === decoded) break;
      decoded = next;
    }
    return decoded;
  }
  const escapeContent = value => typeof value === 'string'
    ? decodeCmsEntities(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))
    : value;
  const safeItems = rows => rows.map(item => Object.fromEntries(Object.entries(item).map(([k,v]) => [k,Array.isArray(v)?v.map(escapeContent):escapeContent(v)])));

  async function loadPublicContent(){try{const r=await fetch('/api/public/content');if(!r.ok)return;const data=await r.json();
    if(Array.isArray(data.operations)&&data.operations.length){operationsData=safeItems(data.operations);buildOperationsGrid()}
    if(Array.isArray(data.reviews)){reviewsData=safeItems(data.reviews);currentReviewStartIdx=0;renderTestimonials()}
    if(Array.isArray(data.consultation)&&data.consultation.length){
      // Consultation slides render through textContent, so keep decoded plain text here.
      // Escaping ampersands for an HTML template would visibly print "&amp;" in textContent.
      consultationOptions=data.consultation.map(item=>Object.fromEntries(
        Object.entries(item).map(([key,value])=>[key,typeof value==='string'?decodeCmsEntities(value):value])
      ));
      currentConsultationIdx=0;
      renderConsultationSlide();
    }
    linkMap=data.links||{};applyLinks();
    if(typeof window.egApplyTranslations==='function')window.egApplyTranslations(routeInfo().lang,false);
    refineArabic();
  }catch(e){console.warn('CMS content unavailable; displaying built-in website content.',e)}}
  let activeProfileKey = null;
  function profileLanguage(){return document.documentElement.lang==='ar'?'ar':'en'}
  function setProfileAvailability(available,message){
    const form=document.getElementById('profile-download-form'),status=document.getElementById('profile-download-status'),submit=document.getElementById('profile-download-submit');
    if(!form||!status||!submit)return;
    form.dataset.available=available?'true':'false';
    form.querySelectorAll('input').forEach(input=>{input.disabled=!available});
    submit.disabled=!available;
    if(message){status.textContent=message;status.className='mb-4 rounded-xl border p-3 text-sm '+(available?'border-blue-200 bg-blue-50 text-blue-800 dark:border-blue-900 dark:bg-blue-950/40 dark:text-blue-200':'border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-200')}
    else status.className='hidden';
  }
  window.openProfileDownload=async function(pageKey){
    const modal=document.getElementById('profile-download-modal'),form=document.getElementById('profile-download-form');
    if(!modal||!form)return;
    const page=['home','training','consultation','operations','bpo'].includes(pageKey)?pageKey:'home',lang=profileLanguage();
    activeProfileKey=page+'_'+lang;form.reset();form.dataset.available='false';
    const requestedKey=activeProfileKey;
    setProfileAvailability(false,lang==='ar'?'جارٍ التحقق من توفر الملف التعريفي...':'Checking profile availability...');
    modal.classList.remove('hidden');modal.classList.add('flex');document.body.style.overflow='hidden';
    document.getElementById('profile-download-name')?.focus();
    try{
      const response=await fetch('/api/public/profile-downloads',{cache:'no-store'}),data=await response.json();
      if(activeProfileKey!==requestedKey)return;
      if(!response.ok)throw new Error(data.error||'Could not check profile availability.');
      const asset=(data.assets||[]).find(item=>item.profile_key===requestedKey);
      if(asset?.available)setProfileAvailability(true,'');
      else setProfileAvailability(false,lang==='ar'?'هذا الملف التعريفي غير متاح حاليًا. يرجى التواصل مع فريقنا أو المحاولة لاحقًا.':'This profile is not available yet. Please contact our team or check back soon.');
    }catch(error){if(activeProfileKey===requestedKey)setProfileAvailability(false,lang==='ar'?'تعذّر التحقق من توفر الملف. يرجى المحاولة مرة أخرى لاحقًا.':'We could not check profile availability. Please try again later.')}
  };
  window.closeProfileDownload=function(){
    const modal=document.getElementById('profile-download-modal');if(modal){modal.classList.add('hidden');modal.classList.remove('flex')}
    document.body.style.overflow='';activeProfileKey=null;
  };
  document.addEventListener('click',event=>{
    const trigger=event.target.closest('[data-profile-download]');
    if(trigger){event.preventDefault();window.openProfileDownload(trigger.getAttribute('data-profile-download'))}
    if(event.target.closest('#profile-download-close,#profile-download-cancel'))window.closeProfileDownload();
    if(event.target.id==='profile-download-modal')window.closeProfileDownload();
  });
  document.addEventListener('keydown',event=>{if(event.key==='Escape'&&!document.getElementById('profile-download-modal')?.classList.contains('hidden'))window.closeProfileDownload()});
  document.addEventListener('DOMContentLoaded',()=>{
    const form=document.getElementById('profile-download-form');if(!form)return;
    form.addEventListener('submit',async event=>{
      event.preventDefault();
      const submit=document.getElementById('profile-download-submit'),lang=profileLanguage();
      if(!activeProfileKey||form.dataset.available!=='true'||!form.reportValidity())return;
      const payload=Object.fromEntries(new FormData(form).entries());
      submit.disabled=true;submit.textContent=lang==='ar'?'جارٍ تجهيز ملف PDF...':'Preparing your PDF...';
      try{
        const response=await fetch('/api/profile-downloads/'+encodeURIComponent(activeProfileKey)+'/request',{method:'POST',credentials:'same-origin',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});
        if(!response.ok){const err=await response.json().catch(()=>({}));throw new Error(err.error||'We could not prepare the PDF. Please try again.')}
        const blob=await response.blob();
        if(blob.type!=='application/pdf'||blob.size<5)throw new Error('The downloaded file is not a valid PDF.');
        const url=URL.createObjectURL(blob),link=document.createElement('a');
        link.href=url;link.download='Experts-Group-Plus-'+activeProfileKey.replace('_','-')+'.pdf';
        document.body.appendChild(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),30000);
        setProfileAvailability(true,lang==='ar'?'أصبح الملف التعريفي جاهزًا للتنزيل.':'Your profile download is ready.');
        form.reset();setTimeout(()=>window.closeProfileDownload(),900);
      }catch(error){
        const status=document.getElementById('profile-download-status');
        status.textContent=error.message;status.className='mb-4 rounded-xl border border-red-200 bg-red-50 text-red-800 p-3 text-sm dark:border-red-900 dark:bg-red-950/30 dark:text-red-200';
      }finally{
        if(form.isConnected&&form.dataset.available==='true'){submit.disabled=false;submit.textContent=lang==='ar'?'تنزيل ملف PDF':'Download PDF'}
      }
    });
  });
  document.addEventListener('DOMContentLoaded',()=>{
    const r=routeInfo();route(r.lang,r.page,true);updateSeo(r.lang,r.page);
    loadPublicContent();refineArabic();
    const observer=new MutationObserver(records=>{if(document.documentElement.lang==='ar')records.forEach(rec=>rec.addedNodes.forEach(node=>{if(node.nodeType===1)refineArabic(node)}));});observer.observe(document.body,{childList:true,subtree:true});
  });
})();

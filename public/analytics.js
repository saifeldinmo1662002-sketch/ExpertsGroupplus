(() => {
  'use strict';
  if (location.pathname.startsWith('/admin')) return;
  const makeId = () => {
    if (window.crypto && typeof crypto.randomUUID === 'function') return crypto.randomUUID();
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => { const r = Math.random() * 16 | 0; return (c === 'x' ? r : (r & 3 | 8)).toString(16); });
  };
  const readId = (store,key) => { try { let value=store.getItem(key); if(!value){value=makeId();store.setItem(key,value)} return value } catch { return makeId() } };
  const visitorId=readId(localStorage,'egp_visitor_id'),sessionId=readId(sessionStorage,'egp_session_id');
  const getPagePath=()=> (location.pathname+location.hash).slice(0,300);
  const classifyBrowser=()=>{const ua=navigator.userAgent||'';if(/Edg\//.test(ua))return 'Edge';if(/OPR\//.test(ua))return 'Opera';if(/Firefox\//.test(ua))return 'Firefox';if(/SamsungBrowser\//.test(ua))return 'Samsung Internet';if(/Chrome\//.test(ua))return 'Chrome';if(/Safari\//.test(ua))return 'Safari';return 'Other'};
  const classifyOS=()=>{const ua=navigator.userAgent||'';if(/Android/.test(ua))return 'Android';if(/iPhone|iPad|iPod/.test(ua))return 'iOS';if(/Windows/.test(ua))return 'Windows';if(/Mac OS X|Macintosh/.test(ua))return 'macOS';if(/Linux/.test(ua))return 'Linux';return 'Other'};
  const classifyDevice=()=>{const ua=navigator.userAgent||'';if(/iPad|Tablet/.test(ua)||(/Android/.test(ua)&&!/Mobile/.test(ua)))return 'tablet';if(/Mobi|iPhone|iPod|Android/.test(ua))return 'mobile';return 'desktop'};
  const params=new URLSearchParams(location.search);
  const metadata={
    referrer:document.referrer||'',
    source:(params.get('utm_source')||'').slice(0,100),
    medium:(params.get('utm_medium')||'').slice(0,100),
    campaign:(params.get('utm_campaign')||'').slice(0,160),
    deviceCategory:classifyDevice(),browser:classifyBrowser(),operatingSystem:classifyOS(),
    language:(navigator.language||'').slice(0,24),
    timezone:(()=>{try{return Intl.DateTimeFormat().resolvedOptions().timeZone||''}catch{return ''}})()
  };
  let currentPage=getPagePath(),lastPageView='',activeSince=document.visibilityState==='visible'?performance.now():null,accumulatedMs=0;
  function send(eventName,eventLabel='',durationMs=null,pagePath=getPagePath()){
    const payload={visitorId,sessionId,eventName,pagePath,eventLabel:eventLabel||'',...metadata};
    if(eventName==='engaged_time')payload.durationMs=durationMs;
    const body=JSON.stringify(payload);let queued=false;
    try{if(navigator.sendBeacon)queued=navigator.sendBeacon('/api/analytics/event',new Blob([body],{type:'application/json'}))}catch{}
    if(!queued)fetch('/api/analytics/event',{method:'POST',headers:{'Content-Type':'application/json'},body,keepalive:true}).catch(()=>{});
  }
  function accumulateActiveTime(){if(activeSince===null)return;const now=performance.now();accumulatedMs+=Math.max(0,now-activeSince);activeSince=document.visibilityState==='visible'?now:null}
  function flushEngagement(force=false){accumulateActiveTime();const duration=Math.min(30000,Math.round(accumulatedMs));if(duration>=(force?250:1000)){accumulatedMs=Math.max(0,accumulatedMs-duration);send('engaged_time','',duration,currentPage)}else if(force)accumulatedMs=0}
  function recordPageView(nextPage=getPagePath()){if(nextPage===currentPage&&lastPageView===nextPage)return;flushEngagement(true);currentPage=nextPage;lastPageView=nextPage;send('page_view','',null,currentPage);accumulatedMs=0;activeSince=document.visibilityState==='visible'?performance.now():null}
  window.EGPAnalytics={track:(name,label)=>{if(['button_press','contact_submit'].includes(name))send(name,label)}};
  setInterval(()=>flushEngagement(false),15000);
  document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='hidden'){flushEngagement(true);activeSince=null}else activeSince=performance.now()});
  addEventListener('pagehide',()=>flushEngagement(true));
  const pushState=history.pushState.bind(history),replaceState=history.replaceState.bind(history);
  history.pushState=(...args)=>{const result=pushState(...args);setTimeout(()=>recordPageView(),0);return result};
  history.replaceState=(...args)=>{const result=replaceState(...args);setTimeout(()=>recordPageView(),0);return result};
  addEventListener('popstate',()=>recordPageView());addEventListener('hashchange',()=>recordPageView());
  document.addEventListener('click',event=>{
    const target=event.target&&event.target.closest?event.target.closest('button,a[href],input[type="button"],input[type="submit"]'):null;
    if(!target)return;
    const text=(target.getAttribute('aria-label')||target.getAttribute('data-analytics-name')||target.innerText||target.value||target.textContent||target.id||'').trim();
    send('button_press',((target.tagName==='A'?'Link':'Button')+' · '+(text||'Unnamed control')).slice(0,160));
  },true);
  if(document.readyState==='loading')addEventListener('DOMContentLoaded',()=>recordPageView(),{once:true});else recordPageView();
})();
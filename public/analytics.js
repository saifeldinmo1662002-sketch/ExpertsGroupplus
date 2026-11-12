(() => {
'use strict';
const uid=()=>crypto.randomUUID();
const id=(store,key)=>{try{let v=store.getItem(key);if(!v){v=uid();store.setItem(key,v)}return v}catch{return uid()}};
const visitorId=id(localStorage,'egp_visitor_id'),sessionId=id(sessionStorage,'egp_session_id');
let last='';
function send(eventName){
 const page=location.pathname+location.hash;
 if(eventName==='page_view'&&page===last)return;
 if(eventName==='page_view')last=page;
 const q=new URLSearchParams(location.search);
 const payload={visitorId,sessionId,eventName,pagePath:location.pathname,referrer:document.referrer||'',utm:{utm_source:q.get('utm_source')||'',utm_medium:q.get('utm_medium')||'',utm_campaign:q.get('utm_campaign')||''}};
 const body=JSON.stringify(payload);
 if(navigator.sendBeacon)navigator.sendBeacon('/api/analytics/event',new Blob([body],{type:'application/json'}));
 else fetch('/api/analytics/event',{method:'POST',headers:{'Content-Type':'application/json'},body,keepalive:true}).catch(()=>{});
}
window.EGPAnalytics={track:(event)=>send(event||'page_view')};
const push=history.pushState.bind(history),replace=history.replaceState.bind(history);
history.pushState=(...args)=>{const r=push(...args);setTimeout(()=>send('page_view'),0);return r};
history.replaceState=(...args)=>{const r=replace(...args);setTimeout(()=>send('page_view'),0);return r};
addEventListener('popstate',()=>send('page_view'));addEventListener('hashchange',()=>send('page_view'));
if(document.readyState==='loading')addEventListener('DOMContentLoaded',()=>send('page_view'),{once:true});else send('page_view');
})();

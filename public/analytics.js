(() => {
  'use strict';
  if (location.pathname.startsWith('/admin')) return;

  const makeId = () => {
    if (window.crypto && typeof crypto.randomUUID === 'function') return crypto.randomUUID();
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
      const r = Math.random() * 16 | 0;
      return (c === 'x' ? r : (r & 3 | 8)).toString(16);
    });
  };
  const readId = (store, key) => {
    try {
      let value = store.getItem(key);
      if (!value) { value = makeId(); store.setItem(key, value); }
      return value;
    } catch { return makeId(); }
  };

  const visitorId = readId(localStorage, 'egp_visitor_id');
  const sessionId = readId(sessionStorage, 'egp_session_id');
  let lastPage = '';

  function send(eventName, eventLabel) {
    const page = location.pathname;
    if (eventName === 'page_view' && page === lastPage) return;
    if (eventName === 'page_view') lastPage = page;

    const payload = {
      visitorId,
      sessionId,
      eventName,
      pagePath: page,
      eventLabel: eventLabel || ''
    };
    const body = JSON.stringify(payload);

    if (navigator.sendBeacon) {
      navigator.sendBeacon('/api/analytics/event', new Blob([body], { type: 'application/json' }));
    } else {
      fetch('/api/analytics/event', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body,
        keepalive: true
      }).catch(() => {});
    }
  }

  window.EGPAnalytics = { track: (name, label) => send(name, label) };

  // Track visits across normal page loads and the site's in-page navigation.
  const pushState = history.pushState.bind(history);
  const replaceState = history.replaceState.bind(history);
  history.pushState = (...args) => {
    const result = pushState(...args);
    setTimeout(() => send('page_view'), 0);
    return result;
  };
  history.replaceState = (...args) => {
    const result = replaceState(...args);
    setTimeout(() => send('page_view'), 0);
    return result;
  };
  addEventListener('popstate', () => send('page_view'));
  addEventListener('hashchange', () => send('page_view'));

  // Track clicks on buttons and clickable links, including dynamically rendered controls.
  document.addEventListener('click', event => {
    const target = event.target && event.target.closest
      ? event.target.closest('button, a[href], input[type="button"], input[type="submit"]')
      : null;
    if (!target) return;

    const visibleText = (target.getAttribute('aria-label') || target.getAttribute('data-analytics-name') ||
      target.innerText || target.value || target.textContent || target.id || '').replace(/\\s+/g, ' ').trim();
    const kind = target.tagName === 'A' ? 'Link' : 'Button';
    const label = (kind + ' · ' + (visibleText || 'Unnamed control')).slice(0, 160);
    send('button_press', label);
  }, true);

  if (document.readyState === 'loading') {
    addEventListener('DOMContentLoaded', () => send('page_view'), { once: true });
  } else {
    send('page_view');
  }
})();

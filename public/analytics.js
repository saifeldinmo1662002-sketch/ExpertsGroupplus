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
  const getPagePath = () => (location.pathname + location.hash).slice(0, 300);
  let currentPage = getPagePath();
  let lastPageView = '';
  let activeSince = document.visibilityState === 'visible' ? performance.now() : null;
  let accumulatedMs = 0;

  function send(eventName, eventLabel = '', durationMs = null, pagePath = getPagePath()) {
    const payload = { visitorId, sessionId, eventName, pagePath, eventLabel: eventLabel || '' };
    if (eventName === 'engaged_time') payload.durationMs = durationMs;
    const body = JSON.stringify(payload);
    let queued = false;
    try {
      if (navigator.sendBeacon) queued = navigator.sendBeacon('/api/analytics/event', new Blob([body], { type: 'application/json' }));
    } catch {}
    if (!queued) {
      fetch('/api/analytics/event', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body,
        keepalive: true
      }).catch(() => {});
    }
  }

  function accumulateActiveTime() {
    if (activeSince === null) return;
    const now = performance.now();
    accumulatedMs += Math.max(0, now - activeSince);
    activeSince = document.visibilityState === 'visible' ? now : null;
  }

  function flushEngagement(force = false) {
    accumulateActiveTime();
    const duration = Math.min(30000, Math.round(accumulatedMs));
    if (duration >= (force ? 250 : 1000)) {
      accumulatedMs = Math.max(0, accumulatedMs - duration);
      send('engaged_time', '', duration, currentPage);
    } else if (force) {
      accumulatedMs = 0;
    }
  }

  function recordPageView(nextPage = getPagePath()) {
    if (nextPage === currentPage && lastPageView === nextPage) return;
    flushEngagement(true);
    currentPage = nextPage;
    lastPageView = nextPage;
    send('page_view', '', null, currentPage);
    accumulatedMs = 0;
    activeSince = document.visibilityState === 'visible' ? performance.now() : null;
  }

  window.EGPAnalytics = { track: (name, label) => send(name, label) };

  // Count only time while this tab is visible; flush on page changes and when leaving.
  setInterval(() => flushEngagement(false), 15000);
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
      flushEngagement(true);
      activeSince = null;
    } else {
      activeSince = performance.now();
    }
  });
  addEventListener('pagehide', () => flushEngagement(true));

  // The public site is a single-page app: record its real route, not only the root path.
  const pushState = history.pushState.bind(history);
  const replaceState = history.replaceState.bind(history);
  history.pushState = (...args) => {
    const result = pushState(...args);
    setTimeout(() => recordPageView(), 0);
    return result;
  };
  history.replaceState = (...args) => {
    const result = replaceState(...args);
    setTimeout(() => recordPageView(), 0);
    return result;
  };
  addEventListener('popstate', () => recordPageView());
  addEventListener('hashchange', () => recordPageView());

  document.addEventListener('click', event => {
    const target = event.target && event.target.closest
      ? event.target.closest('button, a[href], input[type="button"], input[type="submit"]')
      : null;
    if (!target) return;
    const visibleText = (target.getAttribute('aria-label') || target.getAttribute('data-analytics-name') ||
      target.innerText || target.value || target.textContent || target.id || '').trim();
    const kind = target.tagName === 'A' ? 'Link' : 'Button';
    const label = (kind + ' · ' + (visibleText || 'Unnamed control')).slice(0, 160);
    send('button_press', label);
  }, true);

  if (document.readyState === 'loading') {
    addEventListener('DOMContentLoaded', () => recordPageView(), { once: true });
  } else {
    recordPageView();
  }
})();

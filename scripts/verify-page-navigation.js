'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const html = fs.readFileSync(path.join(__dirname, '..', 'public-site.html'), 'utf8');

function section(start, end) {
  const a = html.indexOf(start);
  const b = html.indexOf(end, a + start.length);
  assert(a >= 0 && b > a, 'Missing website navigation source: ' + start);
  return html.slice(a, b);
}

const navigation = section("    const SITE_PAGES = ", "    // Services Dropdown Toggle");
const startup = section("      const initialPage = getSitePageFromLocation();", "      if (window.lucide) lucide.createIcons();");
const languageToggle = section("    function toggleLanguage() {", "    // Newly rendered cards, FAQs, modals");
const routes = ['home', 'about', 'training', 'consultation', 'operations', 'bpo', 'contact'];

function createBrowser(startPath, startHash = '', language = 'en', search = '') {
  const calls = [];
  const handlers = {};
  const elements = Object.fromEntries(routes.map(page => [page, {
    hidden: true,
    classList: {
      add(name) { if (name === 'hidden') elements[page].hidden = true; },
      remove(name) { if (name === 'hidden') elements[page].hidden = false; }
    }
  }]));
  const location = { pathname: startPath, hash: startHash, search };
  function updateLocation(relativeUrl) {
    const parsed = new URL(relativeUrl, 'https://www.expertsgp.com');
    location.pathname = parsed.pathname;
    location.hash = parsed.hash;
    location.search = parsed.search;
  }
  const window = {
    location,
    history: {
      pushState(state, _title, url) {
        calls.push({ type: 'push', state, url });
        updateLocation(url);
      },
      replaceState(state, _title, url) {
        calls.push({ type: 'replace', state, url });
        updateLocation(url);
      }
    },
    scrollTo() { calls.push({ type: 'scroll' }); },
    addEventListener(type, callback) { handlers[type] = callback; }
  };
  const document = {
    querySelectorAll(selector) {
      if (selector === '.page-view') return Object.values(elements);
      if (selector === '.nav-link') return [];
      throw Error('Unexpected CSS selector: ' + selector);
    },
    getElementById(id) {
      if (id.startsWith('view-')) return elements[id.slice(5)] || null;
      return null;
    }
  };
  const context = vm.createContext({ window, document, URL });
  vm.runInContext('let egCurrentLanguage = ' + JSON.stringify(language) + ';\n' +
    'function applySiteLanguage(language) { egCurrentLanguage = language; }\n' +
    navigation + '\n' + languageToggle, context);
  function run(source) { return vm.runInContext(source, context); }
  function initialLoad() { run(startup); }
  function activePage() { return routes.find(page => !elements[page].hidden); }
  return { window, location, elements, calls, handlers, run, initialLoad, activePage };
}

for (const language of ['en', 'ar']) {
  for (const page of routes) {
    const path = '/' + language + '/' + (page === 'home' ? '' : page);
    const browser = createBrowser(path, '', language);
    browser.initialLoad();
    assert.equal(browser.activePage(), page, 'Refresh should restore ' + path);
    assert.equal(browser.calls.filter(x => x.type === 'scroll').length, 0, 'Refresh must not forcibly scroll on ' + path);
    assert.equal(browser.location.pathname, path, 'Direct URL must remain stable: ' + path);
  }
}

// Browser navigation must create a refreshable and shareable service URL.
{
  const browser = createBrowser('/en/', '', 'en', '?utm_source=campaign');
  browser.initialLoad();
  browser.run("navigateTo('bpo')");
  assert.equal(browser.location.pathname, '/en/bpo');
  assert.equal(browser.location.search, '?utm_source=campaign');
  assert.equal(browser.activePage(), 'bpo');
  assert.equal(browser.calls.filter(x => x.type === 'scroll').length, 1);
  const refreshed = createBrowser(browser.location.pathname, '', 'en', browser.location.search);
  refreshed.initialLoad();
  assert.equal(refreshed.activePage(), 'bpo');
}

// Old #page links still work, and are normalized without adding history entries.
{
  const oldLink = createBrowser('/en/', '#operations', 'en');
  oldLink.initialLoad();
  assert.equal(oldLink.activePage(), 'operations');
  assert.equal(oldLink.location.pathname, '/en/operations');
  assert.equal(oldLink.location.hash, '');
  assert.equal(oldLink.calls.filter(x => x.type === 'replace').length, 1);
  const pathWins = createBrowser('/ar/consultation', '#home', 'ar');
  pathWins.initialLoad();
  assert.equal(pathWins.activePage(), 'consultation');
}

// Switching languages must not lose the current service; Back restores both.
{
  const browser = createBrowser('/en/training', '', 'en');
  browser.initialLoad();
  browser.run('toggleLanguage()');
  assert.equal(browser.location.pathname, '/ar/training');
  assert.equal(browser.activePage(), 'training');
  const afterRefresh = createBrowser('/ar/training', '', 'ar');
  afterRefresh.initialLoad();
  assert.equal(afterRefresh.activePage(), 'training');
  browser.location.pathname = '/en/training';
  browser.handlers.popstate();
  assert.equal(browser.run('egCurrentLanguage'), 'en');
  assert.equal(browser.activePage(), 'training');
  assert.equal(browser.calls.filter(x => x.type === 'scroll').length, 0);
}

// Browser Back / Forward changes the active service without creating new entries.
{
  const browser = createBrowser('/ar/operations', '', 'ar');
  browser.initialLoad();
  browser.run("navigateTo('contact')");
  assert.equal(browser.location.pathname, '/ar/contact');
  browser.location.pathname = '/ar/operations';
  browser.handlers.popstate();
  assert.equal(browser.activePage(), 'operations');
  assert.equal(browser.calls.filter(x => x.type === 'push').length, 1);
}

console.log('WEBSITE_PAGE_REFRESH_AND_HISTORY_PASSED');

/*
 * gas-shim.js — lets the pages hosted on GitHub Pages talk to the masjid's Google Apps Script project.
 * It provides the same "google.script.run" the pages use inside Google, but over HTTPS (fetch),
 * so the Google Apps Script banner never appears. All checks still happen on the Google side.
 */
(function () {
  'use strict';
  var C = window.MASJID_CONFIG || {};
  var LINK = C.api || C.appApi || C.siteApi; // one Apps Script project serves everything
  var GAS_URL = /^https:\/\/script\.google\.com\/(a\/[^\/\s]+\/)?macros\/s\/[\w-]+\/exec$/;
  function need(url) {
    if (!GAS_URL.test(String(url || ''))) throw new Error('Setup needed: paste the web-app link (…/exec) into config.js on GitHub.');
    return url;
  }
  function friendly(e) {
    var m = String((e && e.message) || e || '');
    if (/Failed to fetch|NetworkError|Load failed|network/i.test(m)) return new Error('Cannot reach the server. Check your internet connection and try again.');
    return e instanceof Error ? e : new Error(m || 'Something went wrong.');
  }
  function read(r) {
    if (!r.ok) throw new Error('The server is busy (' + r.status + '). Please try again in a minute.');
    return r.text().then(function (t) {
      var j; try { j = JSON.parse(t); } catch (x) { throw new Error('The server sent an unexpected reply. Please try again in a minute.'); }
      if (!j || j.ok !== true) throw new Error((j && j.error) || 'Something went wrong.');
      return j.r;
    });
  }
  // Never wait forever: Google normally answers in 1-3 s (up to ~10 s after a quiet period).
  function timed(url, opt, ms) {
    var ctl = typeof AbortController === 'function' ? new AbortController() : null, timer;
    if (ctl) opt.signal = ctl.signal;
    return Promise.race([
      fetch(url, opt),
      new Promise(function (_, rej) { timer = setTimeout(function () { if (ctl) ctl.abort(); rej(new Error('The server is taking too long to answer. Please try again.')); }, ms); })
    ]).then(function (r) { clearTimeout(timer); return r; }, function (e) { clearTimeout(timer); throw e; });
  }
  function post(url, body) {
    return Promise.resolve().then(function () {
      return timed(url, { method: 'POST', redirect: 'follow', credentials: 'omit', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify(body) }, 60000);
    }).then(read).catch(function (e) { throw friendly(e); });
  }
  function get(url) {
    return Promise.resolve().then(function () { return timed(url, { redirect: 'follow', credentials: 'omit' }, 25000); })
      .then(read).catch(function (e) { throw friendly(e); });
  }
  var API = {
    api: function (token, action, payload) { return post(need(LINK), { fn: 'api', token: token, action: action, payload: payload }); },
    apiLogin: function (email, password, boot) { return post(need(LINK), { fn: 'apiLogin', email: email, password: password, boot: boot === true }); },
    getSnapshot: function () { return get(need(LINK) + '?api=snapshot'); },
    submitRequest: function (form) { return post(need(LINK), { fn: 'submitRequest', form: form }); },
    appInfo: function () { return get(need(LINK) + '?api=info'); }
  };
  window.MASJID_API = API;
  function runner(ok, bad) {
    var o = {
      withSuccessHandler: function (h) { return runner(h, bad); },
      withFailureHandler: function (h) { return runner(ok, h); }
    };
    Object.keys(API).forEach(function (k) {
      o[k] = function () {
        var args = arguments;
        Promise.resolve().then(function () { return API[k].apply(null, args); })
          .then(function (r) { if (ok) ok(r); }, function (e) { if (bad) bad(friendly(e)); else console.warn(e); });
      };
    });
    return o;
  }
  if (!(window.google && window.google.script && window.google.script.run)) {
    window.google = window.google || {};
    window.google.script = { run: runner(null, null) };
  }
})();

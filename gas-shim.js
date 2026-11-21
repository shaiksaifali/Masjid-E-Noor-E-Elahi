/*
 * gas-shim.js — lets the pages hosted on GitHub Pages talk to the two Google Apps Script projects.
 * It provides the same "google.script.run" the pages use inside Google, but over HTTPS (fetch),
 * so the Google Apps Script banner never appears. All checks still happen on the Google side.
 */
(function () {
  'use strict';
  var C = window.MASJID_CONFIG || {};
  var GAS_URL = /^https:\/\/script\.google\.com\/(a\/[^\/\s]+\/)?macros\/s\/[\w-]+\/exec$/;
  function need(url, what) {
    if (!GAS_URL.test(String(url || ''))) throw new Error('Setup needed: paste the ' + what + ' web-app link (…/exec) into config.js on GitHub.');
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
  function post(url, body) {
    return Promise.resolve().then(function () {
      return fetch(url, { method: 'POST', redirect: 'follow', credentials: 'omit', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify(body) });
    }).then(read).catch(function (e) { throw friendly(e); });
  }
  function get(url) {
    return Promise.resolve().then(function () { return fetch(url, { redirect: 'follow', credentials: 'omit' }); })
      .then(read).catch(function (e) { throw friendly(e); });
  }
  var API = {
    api: function (token, action, payload) { return post(need(C.appApi, 'committee app'), { fn: 'api', token: token, action: action, payload: payload }); },
    apiLogin: function (email, password) { return post(need(C.appApi, 'committee app'), { fn: 'apiLogin', email: email, password: password }); },
    getSnapshot: function () { return get(need(C.siteApi, 'website') + '?api=snapshot'); },
    submitRequest: function (form) { return post(need(C.siteApi, 'website'), { fn: 'submitRequest', form: form }); },
    appInfo: function () { return get(need(C.appApi, 'committee app') + '?api=info'); }
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

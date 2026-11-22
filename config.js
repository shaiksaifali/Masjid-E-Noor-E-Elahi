/*
 * config.js — the ONLY file you need to edit on GitHub.
 * Paste your web-app link (it ends with /exec) from Apps Script › Deploy › Manage deployments.
 */
window.MASJID_CONFIG = {
  name: 'Masjid-E-Noor-Elahi',

  api: 'https://script.google.com/macros/s/AKfycbzI78FaCTbOZGol-nfaUQLhnw6_Yseq4DPQUfbPkUZ56KT_zNtsFkQtx1wNOWL2hp51Lw/exec',

  // Leave these as they are
  loginUrl: 'admin/',
  siteUrl: ''
};
if (!window.MASJID_CONFIG.siteUrl) {
  window.MASJID_CONFIG.siteUrl = location.origin + location.pathname.replace(/admin\/?(index\.html)?$/, '').replace(/index\.html$/, '');
}

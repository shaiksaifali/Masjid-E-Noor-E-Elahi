/*
 * config.js — the ONLY file you need to edit on GitHub.
 * Paste the two web-app links (they end with /exec) from Apps Script › Deploy › Manage deployments.
 */
window.MASJID_CONFIG = {
  name: 'Masjid-E-Noor-Elahi',

  // Community website project (bound to the "Public Website Data" sheet)
  siteApi: 'PASTE-WEBSITE-WEB-APP-LINK-HERE',

  // Committee app (management system / ERP) project
  appApi: 'PASTE-COMMITTEE-APP-WEB-APP-LINK-HERE',

  // Leave these as they are
  loginUrl: 'admin/',
  siteUrl: ''
};
if (!window.MASJID_CONFIG.siteUrl) {
  window.MASJID_CONFIG.siteUrl = location.origin + location.pathname.replace(/admin\/?(index\.html)?$/, '').replace(/index\.html$/, '');
}

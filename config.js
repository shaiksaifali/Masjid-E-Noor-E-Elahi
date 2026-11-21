/*
 * config.js — the ONLY file you need to edit on GitHub.
 * Paste the two web-app links (they end with /exec) from Apps Script › Deploy › Manage deployments.
 */
window.MASJID_CONFIG = {
  name: 'Masjid-E-Noor-Elahi',

  // Community website project (bound to the "Public Website Data" sheet)
  siteApi: 'https://script.google.com/macros/s/AKfycbyL1bjp9J_8_-kV6_uqQQ3jMWZ7w0e8XKchkmGuPpHM6uVVKp5E6FAjD0m3jgZ4fBuC/exec',

  // Committee app (management system / ERP) project
  appApi: 'https://script.google.com/macros/s/AKfycbziwfsHsmsvaaIAGPw0yBZuPzBAlrOqruU5d2-jGUVg4u-_1lUik-Z62rjXYEYn7aQM9g/exec',

  // Leave these as they are
  loginUrl: 'admin/',
  siteUrl: ''
};
if (!window.MASJID_CONFIG.siteUrl) {
  window.MASJID_CONFIG.siteUrl = location.origin + location.pathname.replace(/admin\/?(index\.html)?$/, '').replace(/index\.html$/, '');
}

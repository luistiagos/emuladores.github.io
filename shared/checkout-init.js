// checkout-init.js — must be loaded synchronously (no defer) before bundle.js
// Reads storeid from URL query string or window.STOREID_OVERRIDE,
// then exposes window.__CHECKOUT__ for bundle.js to consume.
(function () {
  var urlParams = new URLSearchParams(window.location.search);
  var qsStoreId = urlParams.get('storeid');
  
  var storeId = qsStoreId ? Number(qsStoreId) : (window.STOREID_OVERRIDE ? Number(window.STOREID_OVERRIDE) : 0);
  
  if (!storeId || !Number.isFinite(storeId) || storeId <= 0) {
    throw new Error('[checkout-init.js] storeid ausente ou inválido na URL e sem window.STOREID_OVERRIDE.');
  }

  // mainPackageId is optional — some bundles resolve it dynamically via API
  var qsPackageId = urlParams.get('mainPackageId');
  var mainPackageId = qsPackageId ? Number(qsPackageId) : (window.MAIN_PACKAGE_ID_OVERRIDE ? Number(window.MAIN_PACKAGE_ID_OVERRIDE) : 0);

  window.__CHECKOUT__ = {
    storeId: storeId,
    mainPackageId: mainPackageId,
  };
}());


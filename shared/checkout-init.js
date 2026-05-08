// checkout-init.js — must be loaded synchronously (no defer) before bundle.js
// Validates window.STOREID_OVERRIDE and window.MAIN_PACKAGE_ID_OVERRIDE injected by index.html,
// then exposes window.__CHECKOUT__ for bundle.js to consume.
//
// index.html pattern:
//   <script>
//     window.STOREID_OVERRIDE = 600006;
//     window.MAIN_PACKAGE_ID_OVERRIDE = 9021115; // optional if bundle resolves via API
//   </script>
//   <script src="../../shared/checkout-init.js"></script>
//   <script src="js/bundle.js?v=N" defer></script>
(function () {
  var storeId = window.STOREID_OVERRIDE ? Number(window.STOREID_OVERRIDE) : 0;
  if (!storeId || !Number.isFinite(storeId) || storeId <= 0) {
    throw new Error('[checkout-init.js] window.STOREID_OVERRIDE ausente ou inválido. Defina no index.html antes deste script.');
  }

  // mainPackageId is optional — some bundles resolve it dynamically via API
  var mainPackageId = window.MAIN_PACKAGE_ID_OVERRIDE ? Number(window.MAIN_PACKAGE_ID_OVERRIDE) : 0;

  window.__CHECKOUT__ = {
    storeId: storeId,
    mainPackageId: mainPackageId,
  };
}());

// Harness node+vm dos checkouts por produto (52emul, ps2, xbox360 /checkout2): roda
// js/bundle.js e shared/payment.js no MESMO contexto, na ordem do index.html, com DOM
// e fetch dublados, e imprime em JSON o que a tela mostra depois que as promessas assentam.
//
// Uso: node checkout_principal_price_harness.js <produto> '<cenario JSON>'
//   cenario.mainPackageId  -> o que o index.html poria em MAIN_PACKAGE_ID_OVERRIDE (0 = nao poe)
//   cenario.principal      -> corpo de /packages/principal; null = resposta 500
// Chamado por tests/test_checkout_principal_price.py.
// Doc: docs/modules/lojas-produtos/bugs/2026-11-02-precos-hardcoded-descentralizados-em-prompts-e-paginas.md
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.resolve(__dirname, '..');
const product = process.argv[2];
const scenario = JSON.parse(process.argv[3] || '{}');

function fakeElement(initialText) {
  const el = {
    textContent: initialText || '',
    innerHTML: '',
    value: '',
    checked: false,
    style: {},
    dataset: {},
    children: [],
    classList: { add() {}, remove() {}, toggle() {}, contains() { return false; } },
    setAttribute() {}, getAttribute() { return null; }, removeAttribute() {},
    addEventListener() {}, removeEventListener() {},
    appendChild(c) { el.children.push(c); return c; },
    removeChild() {}, remove() {}, focus() {}, blur() {}, click() {}, submit() {},
    insertAdjacentHTML() {},
    querySelector() { return fakeElement(); },
    querySelectorAll() { return []; },
  };
  return el;
}

const byId = {};
const bySelector = {};
const document = {
  cookie: '',
  body: fakeElement(),
  getElementById(id) { return byId[id] || (byId[id] = fakeElement()); },
  querySelector(sel) { return bySelector[sel] || (bySelector[sel] = fakeElement()); },
  querySelectorAll() { return []; },
  createElement() { return fakeElement(); },
  addEventListener() {},
};
document.body.dataset.dynamicBumps = 'true';
// Primeira pintura do HTML, para provar que ela e substituida (ou mantida).
byId.avistaVlr = fakeElement('HTML-avista');
bySelector['.strike'] = fakeElement('HTML-strike');

const calls = [];
function fetchStub(url) {
  calls.push(String(url));
  const ok = (body) => Promise.resolve({ ok: true, status: 200, json: () => Promise.resolve(body) });
  if (String(url).includes('/packages/principal')) {
    if (scenario.principal === null) return Promise.resolve({ ok: false, status: 500, json: () => Promise.resolve({}) });
    return ok(scenario.principal);
  }
  if (String(url).includes('/packages/extra')) return ok([]);
  return ok({});
}

const storage = { getItem() { return null; }, setItem() {}, removeItem() {} };
const ctx = {
  console: { log() {}, warn() {}, error() {}, info() {} },
  document,
  navigator: { userAgent: 'node', platform: 'node' },
  location: { search: '', href: 'https://example.test/', hostname: 'example.test', assign() {}, replace() {} },
  localStorage: storage,
  sessionStorage: storage,
  fetch: fetchStub,
  setTimeout, clearTimeout,
  setInterval() { return 0; }, clearInterval() {},
  URLSearchParams,
  Promise,
};
ctx.window = ctx;
ctx.__CHECKOUT__ = { storeId: 600004, mainPackageId: scenario.mainPackageId || 0 };
vm.createContext(ctx);

function run(rel) {
  vm.runInContext(fs.readFileSync(path.join(ROOT, rel), 'utf8'), ctx, { filename: rel });
}

(async () => {
  run(`${product}/checkout2/js/bundle.js`);
  run('shared/payment.js');
  if (scenario.callEnsure) await vm.runInContext('ensureMainPackageIdFromStore()', ctx);
  for (let i = 0; i < 20; i++) await new Promise((r) => setImmediate(r));

  const out = {
    avista: byId.avistaVlr.textContent,
    strike: bySelector['.strike'].textContent,
    total: byId.totalVlr ? byId.totalVlr.textContent : null,
    basePrice: vm.runInContext('BASE.price', ctx),
    baseOriginal: vm.runInContext('BASE.original_price', ctx),
    cartTotal: vm.runInContext('getCartTotal()', ctx),
    mainPackageId: vm.runInContext('MAIN_PACKAGE_ID', ctx),
    principalFetches: calls.filter((u) => u.includes('/packages/principal')).length,
  };
  process.stdout.write(JSON.stringify(out));
  process.exit(0); // startRotation e afins deixariam o node pendurado
})().catch((err) => {
  process.stderr.write(String(err && err.stack || err));
  process.exit(1);
});

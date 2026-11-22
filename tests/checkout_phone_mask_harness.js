// Harness node+vm da mascara de telefone (#cel) dos 4 checkouts: roda o bundle servido com
// DOM dublado, captura os listeners reais de 'focus'/'input' do #cel e simula o navegador
// (digitar insere no cursor; backspace apaga o caractere antes do cursor), imprimindo em
// JSON o valor e o cursor depois de cada passo.
//
// Uso: node checkout_phone_mask_harness.js <bundle relativo> '<cenario JSON>'
//   cenario.value  -> valor inicial do campo (ja mascarado)
//   cenario.caret  -> cursor inicial (default: fim)
//   cenario.steps  -> lista de "type:<texto>" | "back:<n>"
//   cenario.calls  -> lista de [nomeDaFuncao, arg] chamadas no bundle carregado
//                     (maskPhone/isValidPhone); com calls, imprime a lista de retornos
// Chamado por tests/test_checkout_phone_mask.py.
// Doc: docs/modules/pagamentos/bugs/2026-11-21-mascara-de-telefone-do-checkout-impede-apagar-o-ddd.md
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.resolve(__dirname, '..');
const bundle = process.argv[2];
const scenario = JSON.parse(process.argv[3] || '{}');

function fakeElement() {
  const el = {
    textContent: '', innerHTML: '', value: '', checked: false,
    style: {}, dataset: {}, children: [], listeners: {},
    selectionStart: 0, selectionEnd: 0,
    classList: { add() {}, remove() {}, toggle() {}, contains() { return false; } },
    setAttribute() {}, getAttribute() { return null; }, removeAttribute() {},
    addEventListener(type, fn) { (el.listeners[type] = el.listeners[type] || []).push(fn); },
    removeEventListener() {},
    setSelectionRange(a, b) { el.selectionStart = a; el.selectionEnd = b; },
    appendChild(c) { el.children.push(c); return c; },
    removeChild() {}, remove() {}, focus() {}, blur() {}, click() {}, submit() {},
    insertAdjacentHTML() {},
    querySelector() { return fakeElement(); },
    querySelectorAll() { return []; },
  };
  return el;
}

const byId = {};
const document = {
  cookie: '',
  body: fakeElement(),
  getElementById(id) { return byId[id] || (byId[id] = fakeElement()); },
  querySelector() { return fakeElement(); },
  querySelectorAll() { return []; },
  createElement() { return fakeElement(); },
  addEventListener() {},
};
const storage = { getItem() { return null; }, setItem() {}, removeItem() {} };
const ctx = {
  console: { log() {}, warn() {}, error() {}, info() {} },
  document,
  navigator: { userAgent: 'node', platform: 'node' },
  location: { search: '', href: 'https://example.test/', hostname: 'example.test', assign() {}, replace() {} },
  localStorage: storage, sessionStorage: storage,
  fetch: () => Promise.resolve({ ok: true, status: 200, json: () => Promise.resolve({}) }),
  setTimeout() { return 0; }, clearTimeout() {},
  setInterval() { return 0; }, clearInterval() {},
  URLSearchParams, Promise,
};
ctx.window = ctx;
ctx.__CHECKOUT__ = { storeId: 600004, mainPackageId: 0 };
vm.createContext(ctx);
vm.runInContext(fs.readFileSync(path.join(ROOT, bundle), 'utf8'), ctx, { filename: bundle });

const cel = byId.cel;
const fire = (type, ev) => (cel.listeners[type] || []).forEach((fn) => fn(ev || {}));
if (!(cel.listeners.input || []).length) {
  process.stderr.write('bundle nao registrou listener de input no #cel');
  process.exit(1);
}

if (scenario.calls) {
  const out = scenario.calls.map(([fn, arg]) => vm.runInContext(fn, ctx)(arg));
  process.stdout.write(JSON.stringify(out));
  process.exit(0);
}

cel.value = scenario.value || '';
const start = scenario.caret == null ? cel.value.length : scenario.caret;
cel.selectionStart = cel.selectionEnd = start;
fire('focus');

const trace = [];
for (const step of scenario.steps || []) {
  const [kind, arg] = step.split(/:(.*)/s);
  if (kind === 'type') {
    for (const ch of arg) {
      const p = cel.selectionStart;
      cel.value = cel.value.slice(0, p) + ch + cel.value.slice(p);
      cel.selectionStart = cel.selectionEnd = p + 1;
      fire('input', { inputType: 'insertText', data: ch });
    }
  } else if (kind === 'back') {
    for (let i = 0; i < Number(arg); i++) {
      const p = cel.selectionStart;
      if (p === 0) continue; // navegador nao dispara input sem nada a apagar
      cel.value = cel.value.slice(0, p - 1) + cel.value.slice(p);
      cel.selectionStart = cel.selectionEnd = p - 1;
      fire('input', { inputType: 'deleteContentBackward' });
    }
  }
  trace.push({ value: cel.value, caret: cel.selectionStart });
}
process.stdout.write(JSON.stringify(trace));
process.exit(0);

// ---------------------------------------------------------------------------
// Shared Payment Module — PIX + MP CardPayment Brick
// Used by: 52emul/checkout2, ps2/checkout2, and future products
//
// Requires the following globals from each product's bundle.js:
//   STOREID, BASE, currentCouponDiscount
//   getSelected(), validarEmail(), showSpinnerLoader(), hideSpinnerLoader(), getCookie()
//   getCurrentSids()                  — defined per product in bundle.js
//   ensureMainPackageIdFromStore()    — optional, only 52emul defines it
// ---------------------------------------------------------------------------

const MP_PUBLIC_KEY = 'APP_USR-747cf787-a851-4ed5-971c-62041281ed91';
const BACKEND_URL = 'https://digitalstoregames.pythonanywhere.com';

// PIX / Card modal state
let _pixPollingInterval = null;
let _currentPixCode = null;
let _mpBricksController = null;

/** Returns current cart total applying active coupon discount. */
function getCartTotal() {
  const selected = getSelected();
  let total = BASE.price;
  if (currentCouponDiscount > 0) total = total * (1 - currentCouponDiscount / 100);
  selected.forEach(a => {
    let p = a.price;
    if (currentCouponDiscount > 0) p = p * (1 - currentCouponDiscount / 100);
    total += p;
  });
  return Math.round(total * 100) / 100;
}

// ---------------------------------------------------------------------------
// E-mail: saneamento, validacao estrita e sugestao de dominio.
// Dono unico do checkout -- as duas formas de pagamento (PIX e cartao) liam o
// campo e chamavam validarEmail() em blocos identicos e separados.
// Espelha mysite/utilshelper.py (normalize_email / EMAIL_REGEX /
// sugerir_dominio_email); os dois lados PRECISAM concordar.
// Ver docs/modules/area-membros/bugs/
// 2026-09-08-recuperar-acesso-email-nao-encontrado.md
// ---------------------------------------------------------------------------

// Recusa ponto final, ponto duplo e rotulo vazio. A regex antiga dos bundles
// (/^[^\s@]+@[^\s@]+\.[^\s@]+$/) aceitava os tres: em 'gmail.com.' o ultimo
// grupo casava 'com.', e o e-mail era gravado com o ponto -- o cliente nunca
// mais achava a propria compra em "Recuperar acesso".
var EMAIL_REGEX_ESTRITA =
  /^[a-zA-Z0-9_%+-]+(?:\.[a-zA-Z0-9_%+-]+)*@(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/;

// Os 19 dominios que respondem por 36.886 das 37.067 compras aprovadas medidas
// em producao. Curta de proposito: lista maior faz dominio corporativo legitimo
// cair perto de um popular e virar sugestao errada.
var EMAIL_DOMINIOS_CANONICOS = [
  'gmail.com', 'hotmail.com', 'outlook.com', 'yahoo.com.br', 'yahoo.com',
  'live.com', 'icloud.com', 'outlook.com.br', 'hotmail.com.br', 'bol.com.br',
  'msn.com', 'uol.com.br', 'ymail.com', 'terra.com.br', 'globo.com',
  'ig.com.br', 'me.com', 'protonmail.com', 'gmail.com.br'
];

// Saneia SEM adivinhar: so remove lixo que nao muda a identidade.
// 'gmail.con' continua 'gmail.con'.
function normalizeEmail(valor) {
  if (!valor) { return ''; }
  var e = String(valor)
    .replace(/[\u200B-\u200F\uFEFF]/g, '')
    .replace(/\u00A0/g, ' ')
    .trim()
    .toLowerCase();
  if (e.indexOf('mailto:') === 0) { e = e.slice(7); }
  e = e.replace(/\s+/g, '');
  e = e.replace(/^[.,;:!?'"<>()\[\]{}]+/, '').replace(/[.,;:!?'"<>()\[\]{}]+$/, '');
  var at = e.lastIndexOf('@');
  if (at < 0) { return e; }
  var local = e.slice(0, at).replace(/^\.+/, '').replace(/\.+$/, '');
  var dominio = e.slice(at + 1).replace(/\.{2,}/g, '.')
    .replace(/^[.-]+/, '').replace(/[.-]+$/, '');
  return local + '@' + dominio;
}

// Levenshtein com corte.
function _distanciaEdicaoEmail(a, b, teto) {
  if (Math.abs(a.length - b.length) > teto) { return teto + 1; }
  var anterior = [], i, j;
  for (j = 0; j <= b.length; j++) { anterior[j] = j; }
  for (i = 1; i <= a.length; i++) {
    var atual = [i], menor = i;
    for (j = 1; j <= b.length; j++) {
      var custo = a.charAt(i - 1) === b.charAt(j - 1) ? 0 : 1;
      atual[j] = Math.min(anterior[j] + 1, atual[j - 1] + 1, anterior[j - 1] + custo);
      if (atual[j] < menor) { menor = atual[j]; }
    }
    if (menor > teto) { return teto + 1; }
    anterior = atual;
  }
  return anterior[b.length];
}

// Dominio canonico que o cliente PROVAVELMENTE quis digitar, ou null.
// Cobre os 128 quase-acertos medidos em producao. NAO cobre erro no local part
// ('jaoo@gmail.com'), indistinguivel de um endereco legitimo.
function sugerirDominioEmail(valor) {
  var e = normalizeEmail(valor);
  var at = e.lastIndexOf('@');
  if (at < 0) { return null; }
  var dominio = e.slice(at + 1);
  if (!dominio) { return null; }
  for (var k = 0; k < EMAIL_DOMINIOS_CANONICOS.length; k++) {
    if (EMAIL_DOMINIOS_CANONICOS[k] === dominio) { return null; }
  }
  var melhor = null, melhorDist = null;
  for (var i = 0; i < EMAIL_DOMINIOS_CANONICOS.length; i++) {
    var canonico = EMAIL_DOMINIOS_CANONICOS[i];
    // Teto 1 para dominio curto: em 'me.com' duas edicoes ja viram chute.
    var teto = canonico.length <= 8 ? 1 : 2;
    var dist = _distanciaEdicaoEmail(dominio, canonico, teto);
    if (dist <= teto && (melhorDist === null || dist < melhorDist)) {
      melhor = canonico; melhorDist = dist;
    }
  }
  return melhor === null ? null : e.slice(0, at) + '@' + melhor;
}

// Le o campo, saneia, valida e (se for o caso) oferece a correcao de dominio.
// Devolve o e-mail final, ou null se invalido -- e o chamador ja abortou a UI.
// Sugere, NUNCA corrige sozinho: um falso positivo corrigido em silencio manda
// o acesso pago para a caixa de outra pessoa, e ninguem fica sabendo.
function lerEmailValidado() {
  var emailEl = document.getElementById('email');
  var emailErr = document.getElementById('emailErr');
  var email = normalizeEmail(emailEl ? emailEl.value : '');
  if (emailEl) { emailEl.value = email; }

  if (!EMAIL_REGEX_ESTRITA.test(email)) {
    if (emailErr) { emailErr.style.display = 'block'; emailErr.setAttribute('aria-hidden', 'false'); }
    if (emailEl) { emailEl.classList.add('is-invalid'); emailEl.focus(); }
    return null;
  }

  var sugestao = sugerirDominioEmail(email);
  if (sugestao) {
    var msg = 'Confirme seu e-mail\n\n'
      + 'Voce digitou:      ' + email + '\n'
      + 'Voce quis dizer:   ' + sugestao + '\n\n'
      + 'OK usa ' + sugestao + '. Cancelar mantem o que voce digitou.';
    if (confirm(msg)) {
      email = sugestao;
      if (emailEl) { emailEl.value = sugestao; }
    }
  }

  if (emailErr) emailErr.style.display = 'none';
  if (emailEl) emailEl.classList.remove('is-invalid');
  return email;
}

// ---------------------------------------------------------------------------
// PIX payment
// ---------------------------------------------------------------------------

async function abrirPix() {
  const email = lerEmailValidado();
  if (email === null) return;

  const btn = document.getElementById('altPixBtn');
  if (btn) btn.disabled = true;
  showSpinnerLoader();

  // 52emul resolves MAIN_PACKAGE_ID dynamically; PS2 doesn't need this
  if (typeof ensureMainPackageIdFromStore === 'function') await ensureMainPackageIdFromStore();

  const cel = document.getElementById('cel')?.value?.trim() || '';
  const cupom = document.getElementById('cupom')?.value?.trim() || '';
  const sids = getCurrentSids();
  const fbp = getCookie('_fbp') || '';
  const fbc = getCookie('_fbc') || '';

  try {
    const body = { sids, email, storeid: STOREID };
    if (cel) body.telefone = cel;
    if (cupom) body.cupom = cupom;
    if (fbp) body.fbp = fbp;
    if (fbc) body.fbc = fbc;

    const resp = await fetch(`${BACKEND_URL}/create_pix_payment`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    const data = await resp.json();

    if (data.error) {
      if (data.error_field === 'email') {
        const emailErr = document.getElementById('emailErr');
        const emailEl = document.getElementById('email');
        if (emailErr) { emailErr.style.display = 'block'; emailErr.setAttribute('aria-hidden', 'false'); }
        if (emailEl) { emailEl.classList.add('is-invalid'); emailEl.focus(); }
      } else {
        alert('Erro ao gerar PIX: ' + data.error);
      }
      return;
    }

    _currentPixCode = data.qr_code;
    _mostrarPixModal(data.qr_code, data.qr_code_base64, data.amount);
    _iniciarPollingPix(data.payment_id);

  } catch (e) {
    console.error('abrirPix error:', e);
    alert('Erro ao gerar QR Code PIX. Verifique sua conexão e tente novamente.');
  } finally {
    if (btn) btn.disabled = false;
    hideSpinnerLoader();
  }
}

function _mostrarPixModal(qr_code, qr_code_base64, amount) {
  const modal = document.getElementById('pixModal');
  if (!modal) return;
  const amtFmt = (amount || 0).toFixed(2).replace('.', ',');
  const img = modal.querySelector('#pixQrImg');
  if (img) {
    img.src = qr_code_base64 ? `data:image/png;base64,${qr_code_base64}` : '';
    img.style.display = qr_code_base64 ? 'block' : 'none';
  }
  modal.querySelector('#pixAmount').textContent = `R$ ${amtFmt}`;
  const codeEl = modal.querySelector('#pixCodePreview');
  if (codeEl) codeEl.textContent = qr_code.substring(0, 50) + '…';
  modal.querySelector('#pixStatusMsg').innerHTML = 'Aguardando pagamento… <span class="pix-spinner"></span>';
  modal.style.display = 'flex';
  document.body.style.overflow = 'hidden';
}

function fecharPixModal() {
  const modal = document.getElementById('pixModal');
  if (modal) { modal.style.display = 'none'; document.body.style.overflow = ''; }
  if (_pixPollingInterval) { clearInterval(_pixPollingInterval); _pixPollingInterval = null; }
  _currentPixCode = null;
}

function copiarCodigoPix() {
  if (!_currentPixCode) return;
  navigator.clipboard.writeText(_currentPixCode).then(() => {
    const btn = document.getElementById('btnCopiarPix');
    if (btn) { const o = btn.textContent; btn.textContent = '✓ Copiado!'; setTimeout(() => { btn.textContent = o; }, 2500); }
  }).catch(() => {
    const ta = document.createElement('textarea');
    ta.value = _currentPixCode; ta.style.position = 'fixed'; ta.style.opacity = '0';
    document.body.appendChild(ta); ta.select(); document.execCommand('copy'); document.body.removeChild(ta);
    const btn = document.getElementById('btnCopiarPix');
    if (btn) { const o = btn.textContent; btn.textContent = '✓ Copiado!'; setTimeout(() => { btn.textContent = o; }, 2500); }
  });
}

function _iniciarPollingPix(paymentId) {
  if (_pixPollingInterval) clearInterval(_pixPollingInterval);
  _pixPollingInterval = setInterval(async () => {
    try {
      const r = await fetch(`${BACKEND_URL}/payment_status?payment_id=${encodeURIComponent(paymentId)}`);
      const d = await r.json();
      if (d.status === 'approved') {
        clearInterval(_pixPollingInterval); _pixPollingInterval = null;
        const el = document.getElementById('pixStatusMsg');
        if (el) el.innerHTML = '<span style="color:#00b04a;font-weight:700">✅ Pagamento confirmado! Verifique seu e-mail.</span>';
        setTimeout(() => { window.location.href = d.redirect_url || 'https://digitalmemberarea.digitalstoregames.com/recuperaracesso/'; }, 3500);
      } else if (['rejected', 'cancelled', 'expired'].includes(d.status)) {
        clearInterval(_pixPollingInterval); _pixPollingInterval = null;
        const el = document.getElementById('pixStatusMsg');
        if (el) el.innerHTML = '<span style="color:#cc0000;font-weight:700">⚠️ PIX cancelado ou expirado. Feche e tente novamente.</span>';
      }
    } catch (_e) { /* silent */ }
  }, 5000);
}

// ---------------------------------------------------------------------------
// Card payment via MP CardPayment Brick
// ---------------------------------------------------------------------------

function abrirCartao() {
  const email = lerEmailValidado();
  if (email === null) return;

  const modal = document.getElementById('cardModal');
  if (!modal) return;
  modal.style.display = 'flex';
  document.body.style.overflow = 'hidden';
  _loadCardBrick(email);
}

function fecharCartaoModal() {
  const modal = document.getElementById('cardModal');
  if (modal) { modal.style.display = 'none'; document.body.style.overflow = ''; }
  if (_mpBricksController) {
    try { _mpBricksController.unmount(); } catch (_e) {}
    _mpBricksController = null;
  }
}

function _loadCardBrick(email) {
  const container = document.getElementById('cardBrickInner');
  if (!container) return;

  if (!MP_PUBLIC_KEY) {
    container.innerHTML = '<p style="color:#c00;text-align:center;padding:20px">Pagamento via cartão não configurado.<br>Use PIX ou Mercado Pago.</p>';
    return;
  }

  container.innerHTML = '';
  const amount = getCartTotal();

  function _initBrick() {
    try {
      const mp = new MercadoPago(MP_PUBLIC_KEY, { locale: 'pt-BR' });
      mp.bricks().create('cardPayment', 'cardBrickInner', {
        initialization: { amount, payer: { email } },
        callbacks: {
          onReady: () => {},
          onSubmit: (cardData) => _processarCartao(cardData),
          onError: (err) => {
            console.error('CardBrick error:', err);
            const el = document.getElementById('cardBrickInner');
            if (el) el.innerHTML = '<p style="color:#c00;text-align:center;padding:10px">Erro no formulário. Tente novamente.</p>';
          }
        }
      }).then(ctrl => { _mpBricksController = ctrl; });
    } catch (e) {
      console.error('_loadCardBrick init error:', e);
      if (container) container.innerHTML = '<p style="color:#c00;text-align:center;padding:20px">Erro ao carregar formulário. Tente Mercado Pago ou PIX.</p>';
    }
  }

  if (window.MercadoPago) {
    _initBrick();
  } else {
    const script = document.createElement('script');
    script.src = 'https://sdk.mercadopago.com/js/v2';
    script.onload = _initBrick;
    script.onerror = () => {
      if (container) container.innerHTML = '<p style="color:#c00;text-align:center;padding:20px">Não foi possível carregar o formulário. Verifique sua conexão.</p>';
    };
    document.head.appendChild(script);
  }
}

async function _processarCartao(cardData) {
  showSpinnerLoader();
  if (typeof ensureMainPackageIdFromStore === 'function') await ensureMainPackageIdFromStore();
  const cel = document.getElementById('cel')?.value?.trim() || '';
  const cupom = document.getElementById('cupom')?.value?.trim() || '';
  const sids = getCurrentSids();
  const fbp = getCookie('_fbp') || '';
  const fbc = getCookie('_fbc') || '';
  const email = cardData.payer?.email || document.getElementById('email')?.value?.trim();
  let paymentDone = false;

  try {
    const body = {
      sids, token: cardData.token, installments: cardData.installments,
      payment_method_id: cardData.payment_method_id, email, storeid: STOREID
    };
    if (cardData.payer?.identification?.number) {
      body.identification_type = cardData.payer.identification.type || 'CPF';
      body.identification_number = cardData.payer.identification.number;
    }
    if (cel) body.telefone = cel;
    if (cupom) body.cupom = cupom;
    if (fbp) body.fbp = fbp;
    if (fbc) body.fbc = fbc;

    const resp = await fetch(`${BACKEND_URL}/create_card_payment`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body)
    });
    const data = await resp.json();
    if (data.error) {
      if (data.error_field === 'email') {
        fecharCartaoModal();
        const emailErr = document.getElementById('emailErr');
        const emailEl = document.getElementById('email');
        if (emailErr) { emailErr.style.display = 'block'; emailErr.setAttribute('aria-hidden', 'false'); }
        if (emailEl) { emailEl.classList.add('is-invalid'); emailEl.focus(); }
      } else {
        alert('Erro no pagamento: ' + data.error);
      }
      return;
    }

    if (data.status === 'approved') {
      paymentDone = true;
      fecharCartaoModal();
      const el = document.getElementById('cardModalStatus');
      if (el) el.innerHTML = '<p style="color:#00b04a;font-weight:700;text-align:center">✅ Pagamento aprovado! Verifique seu e-mail.</p>';
      setTimeout(() => { window.location.href = data.redirect_url || 'https://digitalmemberarea.digitalstoregames.com/recuperaracesso/'; }, 3000);
    } else if (['in_process', 'pending'].includes(data.status)) {
      paymentDone = true;
      alert('Pagamento em análise. Você receberá um e-mail de confirmação em breve.');
      fecharCartaoModal();
    } else {
      alert('Pagamento não aprovado (' + (data.status_detail || data.status) + '). Verifique os dados do cartão e tente novamente.');
    }
  } catch (e) {
    console.error('_processarCartao error:', e);
    alert('Erro ao processar o pagamento. Tente novamente ou use outra forma de pagamento.');
  } finally {
    hideSpinnerLoader();
    if (!paymentDone) {
      if (_mpBricksController) { try { _mpBricksController.unmount(); } catch (_e) {} _mpBricksController = null; }
      _loadCardBrick(email);
    }
  }
}

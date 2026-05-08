// checkout_legado.js — fluxo de pagamento direto (sem área de membros)
// Endpoint: /createMLlink (com storeid + sid) → webhook /notification3 → make_deliver → e-mail direto
// NÃO usa /createMLlink2 (que dispara /notification → área de membros)

var STOREID_LEGADO = 20000;

async function _criarLinkLegado(sid, email, telefone, cupom) {
  var urlServico = 'https://digitalstoregames.pythonanywhere.com/createMLlink'
    + '?storeid=' + STOREID_LEGADO
    + '&sid='     + encodeURIComponent(sid)
    + '&email='   + encodeURIComponent(email);

  var fbp, fbc;
  try {
    var v = '; ' + document.cookie;
    var p = v.split('; _fbp='); if (p.length === 2) fbp = p.pop().split(';').shift();
    p = v.split('; _fbc=');     if (p.length === 2) fbc = p.pop().split(';').shift();
  } catch (_) {}

  if (telefone) urlServico += '&telefone=' + encodeURIComponent(telefone);
  if (fbp)      urlServico += '&fbp='      + encodeURIComponent(fbp);
  if (fbc)      urlServico += '&fbc='      + fbc;
  if (cupom)    urlServico += '&cupom='    + encodeURIComponent(cupom);

  var response = await fetch(urlServico);
  var returnedUrl = await response.text();
  returnedUrl = returnedUrl.trim();

  if (!returnedUrl || returnedUrl.length < 10) {
    throw new Error('Resposta inválida do servidor: ' + returnedUrl);
  }

  // Redireciona para o link de pagamento do Mercado Pago
  try { window.location.href = returnedUrl; return; } catch (_) {}
  try { window.location.assign(returnedUrl); return; } catch (_) {}
  try { window.location.replace(returnedUrl); return; } catch (_) {}
  window.open(returnedUrl, '_blank');
}

async function pagar() {
  var btn         = document.getElementById('payBtn');
  var emailInput  = document.getElementById('email');
  var emailErrEl  = document.getElementById('emailErr');
  var email       = emailInput ? emailInput.value.trim() : '';

  // Validação de e-mail
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    if (emailErrEl) { emailErrEl.style.display = 'block'; emailErrEl.setAttribute('aria-hidden', 'false'); }
    if (emailInput) { emailInput.classList.add('is-invalid'); emailInput.focus(); }
    return;
  }
  if (emailErrEl) emailErrEl.style.display = 'none';
  if (emailInput) emailInput.classList.remove('is-invalid');

  var celEl    = document.getElementById('cel');
  var celErrEl = document.getElementById('celErr');
  var cel      = (celEl && celEl.value || '').trim();

  if (celErrEl) celErrEl.style.display = 'none';
  if (celEl)    celEl.classList.remove('is-invalid');

  // Validação opcional de celular
  if (cel) {
    var digits = cel.replace(/\D/g, '');
    if (digits.length < 10 || digits.length > 12) {
      if (celErrEl) { celErrEl.style.display = 'block'; celErrEl.setAttribute('aria-hidden', 'false'); }
      if (celEl)    { celEl.classList.add('is-invalid'); celEl.focus(); }
      return;
    }
  }

  // Monta o SID no formato legado: '2' + switch + xbox + saturn + xbox360
  // O SID corresponde ao product ID no banco (ex: 20000 = base, 20100 = +Switch, etc.)
  var checkXbox    = document.getElementById('bumpXboxClassico_check') ? document.getElementById('bumpXboxClassico_check').checked : false;
  var checkSaturn  = document.getElementById('bumpSaturn_check')       ? document.getElementById('bumpSaturn_check').checked       : false;
  var checkSwitch  = document.getElementById('bumpSwitch_check')       ? document.getElementById('bumpSwitch_check').checked       : false;
  var checkXbox360 = document.getElementById('bumpXbox360_check')      ? document.getElementById('bumpXbox360_check').checked      : false;

  var sid = '2'
    + (checkSwitch  ? '1' : '0')
    + (checkXbox    ? '1' : '0')
    + (checkSaturn  ? '1' : '0')
    + (checkXbox360 ? '1' : '0');

  var cupom = document.getElementById('cupom') ? document.getElementById('cupom').value.trim() : '';

  if (btn) btn.disabled = true;

  var spinnerEl = document.getElementById('spinner-loader');
  if (spinnerEl) spinnerEl.style.display = 'flex';

  try {
    await _criarLinkLegado(sid, email, cel, cupom);
  } catch (e) {
    console.error('Erro ao iniciar pagamento legado:', e);
    alert('Erro ao iniciar pagamento. Tente novamente.');
    if (btn) btn.disabled = false;
    if (spinnerEl) spinnerEl.style.display = 'none';
  }
}

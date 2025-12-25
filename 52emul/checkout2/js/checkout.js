// Checkout and payment handling
const emailEl = document.getElementById('email');
const emailErr = document.getElementById('emailErr');

async function pagar() {
  const btn = document.getElementById('payBtn');
  const email = emailEl.value.trim();

  if (!validarEmail(email)) {
    if (emailErr) {
      emailErr.style.display = 'block';
      emailErr.setAttribute('aria-hidden', 'false');
    }
    emailEl.classList.add('is-invalid');
    emailEl.focus();
    return;
  }

  const celEl = document.getElementById('cel');
  const celErr = document.getElementById('celErr');
  const cel = (celEl && celEl.value || '').trim();

  // Reset phone error state
  if (celErr) celErr.style.display = 'none';
  if (celEl) celEl.classList.remove('is-invalid');

  if (cel && typeof isValidPhone === 'function' && !isValidPhone(cel)) {
    if (celErr) {
      celErr.style.display = 'block';
      celErr.setAttribute('aria-hidden', 'false');
    }
    if (celEl) {
      celEl.classList.add('is-invalid');
      celEl.focus();
    }
    return;
  }

  const checkXbox = document.getElementById('bumpXboxClassico_check')?.checked;
  const checkSaturn = document.getElementById('bumpSaturn_check')?.checked;
  const checkSwitch = document.getElementById('bumpSwitch_check')?.checked;
  const checkXbox360 = document.getElementById('bumpXbox360_check')?.checked;

  // Logic: '2' + switch + xbox_classic + saturn + xbox360
  // Note: The logic requested was: '2' + checkSwitch + checkXbox + checkSaturn + checkXbox360
  // Converting boolean to '1' or '0'
  const sid = '2' +
    ((checkSwitch) ? '1' : '0') +
    ((checkXbox) ? '1' : '0') +
    ((checkSaturn) ? '1' : '0') +
    ((checkXbox360) ? '1' : '0');

  const cupom = document.getElementById('cupom')?.value || '';

  if (btn) btn.disabled = true;
  showSpinnerLoader();

  try {
    await createMLlink(STOREID, email, cel, sid, cupom);
  } catch (e) {
    console.error('Erro ao iniciar pagamento:', e);
    alert('Erro ao iniciar pagamento: ' + e.message);
  } finally {
    if (btn) btn.disabled = false;
    hideSpinnerLoader();
  }
}

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

  const checkSony = document.getElementById('bumpSony_check')?.checked;
  const checkNintendo = document.getElementById('bumpNintendo_check')?.checked;
  const checkOutros = document.getElementById('bumpOutros_check')?.checked;
  const checkXbox = document.getElementById('bumpXbox_check')?.checked;
  const checkSwitch = document.getElementById('bumpSwitch_check')?.checked;

  // Logic: '3' + Sony + Nintendo + Outros + Xbox + Switch
  const sid = '3' +
    ((checkSony) ? '1' : '0') +
    ((checkNintendo) ? '1' : '0') +
    ((checkOutros) ? '1' : '0') +
    ((checkXbox) ? '1' : '0') +
    ((checkSwitch) ? '1' : '0');

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

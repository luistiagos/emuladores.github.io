// Form validation and input handling
(function () {
  const form = document.getElementById('checkoutForm');
  const email = document.getElementById('email');
  const emailErr = document.getElementById('emailErr');
  const cel = document.getElementById('cel');

  // Load cached form data
  try {
    const cache = JSON.parse(localStorage.getItem('checkout_cache') || '{}');
    if (cache.email) email.value = cache.email;
    if (cache.cel) cel.value = cache.cel;
  } catch (_) { }

  const setErr = (el, errEl, isBad, msg) => {
    if (!errEl) return;
    el.classList.toggle('is-invalid', !!isBad);
    errEl.textContent = msg || errEl.textContent;
    errEl.setAttribute('aria-hidden', isBad ? 'false' : 'true');
  };

  const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

  // Email validation on blur
  email.addEventListener('blur', () => {
    const ok = isEmail(email.value.trim());
    setErr(email, emailErr, !ok, 'E-mail inválido. Ex.: nome@site.com');
    if (ok) {
      savelead(STOREID, 'Lead', email.value.trim(), cel.value.trim());
    }
  });

  // Cache form data on input
  [email, cel].forEach(el => el.addEventListener('input', () => {
    try {
      localStorage.setItem('checkout_cache', JSON.stringify({
        email: email.value.trim(),
        cel: cel.value.trim()
      }));
    } catch (_) { }
  }));

  // Phone mask
  cel.addEventListener('input', () => {
    const pos = cel.selectionStart;
    const before = cel.value;
    cel.value = maskPhone(cel.value);
    const diff = cel.value.length - before.length;
    try {
      cel.selectionEnd = Math.max(0, (pos || cel.value.length) + diff);
    } catch (_) { }
  });

  // Phone validation on blur
  cel.addEventListener('blur', () => {
    const val = cel.value.trim();
    if (val && isValidPhone(val)) {
      savelead(STOREID, 'Lead', email.value.trim(), val);
    }
  });

  // Keyboard navigation
  email.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      cel.focus();
    }
  });

  cel.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const btn = document.getElementById('payBtn');
      btn && btn.click();
    }
  });

  if (emailErr) emailErr.setAttribute('aria-hidden', 'true');

  // Override pagar function to add validation
  const _pagar = window.pagar || function () { };
  window.pagar = function () {
    const ok = isEmail(email.value.trim());
    setErr(email, emailErr, !ok, 'E-mail inválido. Ex.: nome@site.com');
    if (!ok) {
      email.focus();
      return;
    }
    return _pagar.apply(this, arguments);
  };
})();

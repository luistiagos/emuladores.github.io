// FAQ accordion functionality
(function() {
  const faq = document.getElementById('checkoutFAQ');
  
  if (faq) {
    faq.querySelectorAll('.faq-q').forEach(btn => {
      btn.addEventListener('click', () => {
        const item = btn.closest('.faq-item');
        const open = item.classList.toggle('open');
        btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      });
    });
  }
})();

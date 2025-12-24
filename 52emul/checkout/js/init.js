// Initialize discount badges and run startup functions
(function () {
  const bx = document.getElementById('bxBadge');
  if (bx) bx.textContent = `-${formatPct(48, 30)}%`;

  const cl = document.getElementById('clBadge');
  if (cl) cl.textContent = `-${formatPct(67, 20)}%`;

  const sw = document.getElementById('swBadge');
  if (sw) sw.textContent = `-${formatPct(75, 30)}%`;

  const sat = document.getElementById('satBadge');
  if (sat) sat.textContent = `-${formatPct(20, 10)}%`;
})();

// Initialize the page
renderSummary();
startRotation();
savelead(STOREID, 'AddToCart');

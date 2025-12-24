// Order summary and cart management
function renderSummary() {
  const body = document.getElementById('summaryBody');
  const summary = document.getElementById('summary');
  const banner = document.getElementById('savingsBanner');
  const selected = getSelected();

  show(summary, true);
  show(banner, true);

  body.innerHTML = '';
  const tr0 = document.createElement('tr');
  tr0.innerHTML = `<td>
      ${BASE.name}
      <div class="summary-small">
        <span class="summary-strike">de ${fmt(BASE.original_price)}</span>
        → por <span class="summary-price">${fmt(BASE.price)}</span>
        <span class="economy">• Economia ${fmt(BASE.economy)}</span>
      </div>
    </td>
    <td style="text-align:right">${fmt(BASE.price)}</td>`;
  body.appendChild(tr0);

  let total = BASE.price;
  let totalEconomy = BASE.economy;

  getSelected().forEach(a => {
    total += a.price;
    totalEconomy += a.economy || 0;
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>
        ${a.name}
        <div class="summary-small">
          <span class="summary-strike">de ${fmt(a.original_price)}</span>
          → por <span class="summary-price">${fmt(a.price)}</span>
          <span class="economy">• Economia ${fmt(a.economy || 0)}</span>
        </div>
      </td>
      <td style="text-align:right">${fmt(a.price)}</td>`;
    body.appendChild(tr);
  });

  document.getElementById('totalVlr').textContent = fmt(total);
  document.getElementById('totalEconomy').textContent = `(Economia ${fmt(totalEconomy)})`;
  show(banner, true);
  document.getElementById('savingsValue') && (document.getElementById('savingsValue').textContent = fmt(totalEconomy));

  updateBumpVisuals();
}

function updateBumpVisuals() {
  Object.keys(ADDONS).forEach(key => {
    const cb = document.getElementById(key);
    // Assumes box ID is the checkbox ID without '_check' suffix
    const boxId = key.replace('_check', '');
    const box = document.getElementById(boxId);
    if (cb && box) {
      if (cb.checked) {
        box.classList.add('selected');
      } else {
        box.classList.remove('selected');
      }
    }
  });
}

function updateAll() {
  renderSummary();
}

// Click handler for clickable elements
document.addEventListener('click', (e) => {
  const el = e.target;
  if (el.classList.contains('clickable') && el.dataset.target) {
    const cb = document.getElementById(el.dataset.target);
    if (cb) {
      cb.checked = !cb.checked;
      renderSummary();
    }
  }
});

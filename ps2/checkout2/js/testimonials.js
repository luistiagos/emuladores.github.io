// Testimonials display and rotation
function renderTestimonials(list) {
  const el = document.getElementById('tlist');
  if (!el) return;
  el.innerHTML = '';

  const colors = ['#eab308', '#22c55e', '#3b82f6', '#f97316', '#a855f7', '#ec4899'];

  list.forEach(t => {
    const item = document.createElement('div');
    item.className = 't-item';

    const initial = t.name.charAt(0).toUpperCase();
    const colorIndex = t.name.charCodeAt(0) % colors.length;
    const bgColor = colors[colorIndex];

    // Random time ago for realism
    const times = ['há 2 dias', 'há 1 semana', 'há 3 semanas', 'há 1 mês', 'há 2 meses'];
    const timeAgo = times[Math.floor(Math.random() * times.length)];

    item.innerHTML = `
      <div class="t-head-row">
        <div class="t-initial" style="background-color: ${bgColor}">${initial}</div>
        <div class="t-meta">
          <div class="t-name">${t.name}</div>
          <div class="t-time">${timeAgo}</div>
        </div>
      </div>
      <div class="t-rating-block">
        <div class="t-stars" aria-label="${t.stars} de 5 estrelas">
          ${Array.from({ length: t.stars }).map(() => starSVG()).join('')}
        </div>
        <svg class="t-verified" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" /></svg>
      </div>
      <div class="t-comment">${t.text}</div>
    `;
    el.appendChild(item);
  });
}

function startRotation() {
  const chunk = 3;
  let idx = 0;
  const show = () => {
    let slice = TESTIMONIALS.slice(idx, idx + chunk);
    if (slice.length < chunk) {
      slice = slice.concat(TESTIMONIALS.slice(0, chunk - slice.length));
    }
    renderTestimonials(slice);
    idx = (idx + chunk) % TESTIMONIALS.length;
  };
  show();
  setInterval(show, 8000);
}

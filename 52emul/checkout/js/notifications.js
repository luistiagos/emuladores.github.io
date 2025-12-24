const recentPurchases = [
  { name: 'João S.' },
  { name: 'Maria O.' },
  { name: 'Pedro A.' },
  { name: 'Ana C.' },
  { name: 'Lucas M.' },
  { name: 'Juliana R.' },
  { name: 'Bruno F.' },
  { name: 'Carla T.' },
  { name: 'Marcos P.' },
  { name: 'Fernanda L.' },
  { name: 'Rafael G.' },
  { name: 'Beatriz S.' },
  { name: 'Felipe D.' },
  { name: 'Amanda P.' }
];

const products = [
  'Plataforma Multijogos'
];

function createNotification() {
  const container = document.createElement('div');
  container.className = 'notification-toast';
  container.id = 'socialProofToast';

  container.innerHTML = `
    <div class="notification-icon">
      <svg class="notification-check" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
      </svg>
    </div>
    <div class="notification-content">
      <div class="notification-title">Nova compra realizada!</div>
      <div class="notification-message"><strong id="notif-name"></strong> acabou de comprar <strong id="notif-prod"></strong></div>
      <div class="notification-time">Há alguns instantes</div>
    </div>
  `;

  document.body.appendChild(container);
}

function showNotification() {
  const toast = document.getElementById('socialProofToast');
  if (!toast) return;

  const person = recentPurchases[Math.floor(Math.random() * recentPurchases.length)];
  const product = products[Math.floor(Math.random() * products.length)];

  document.getElementById('notif-name').textContent = person.name;
  document.getElementById('notif-prod').textContent = product;

  toast.classList.add('show');

  // Hide after 5 seconds
  setTimeout(() => {
    toast.classList.remove('show');
  }, 5000);
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  createNotification();

  // Initial delay
  setTimeout(() => {
    showNotification();

    // Loop
    // Random interval between 15 and 45 seconds
    setInterval(() => {
      const randomDelay = Math.random() * (45000 - 15000) + 15000;
      setTimeout(showNotification, randomDelay);
    }, 20000);
  }, 10000); // Start 10 seconds after load
});

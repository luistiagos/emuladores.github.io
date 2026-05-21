// Product configuration and pricing
const STOREID = window.__CHECKOUT__.storeId;
const MAIN_PACKAGE_ID = window.__CHECKOUT__.mainPackageId;
let BASE = {
  id: 'principal-ps2',
  name: 'Plataforma Playstation 2 com todos os jogos',
  original_price: 199.00,
  price: 25.00
};
BASE.economy = BASE.original_price - BASE.price;

const STATIC_ADDONS = {
  bumpSony_check: {
    id: 'sony',
    name: 'Plataforma da Sony com todos os jogos (PS1, PSP, PS3)',
    original_price: 49.90,
    price: 10.00
  },
  bumpNintendo_check: {
    id: 'nintendo',
    name: '11 Plataformas Nintendo com todos os jogos',
    original_price: 59.90,
    price: 15.00
  },
  bumpSwitch_check: {
    id: 'switch',
    name: 'Plataforma Nintendo Switch (+2655 jogos)',
    original_price: 75.00,
    price: 30.00
  },
  bumpXbox_check: {
    id: 'xbox_classic',
    name: 'Plataforma Xbox Clássico (+878 jogos)',
    original_price: 67.00,
    price: 20.00
  },
  bumpOutros_check: {
    id: 'others',
    name: '14 Plataformas Diversas (Sega, Atari, etc.)',
    original_price: 39.90,
    price: 10.00
  }
};
Object.values(STATIC_ADDONS).forEach(a => a.economy = a.original_price - a.price);
let ADDONS = {};

// Testimonials data
const TESTIMONIALS = [
  { name: 'Gabriel S.', stars: 5, text: 'Recebi tudo certinho e o tutorial ajudou muito. Valeu cada centavo!', avatar: 'https://i.pravatar.cc/80?img=12' },
  { name: 'Marina A.', stars: 5, text: 'Instalação rápida no notebook, catálogo enorme!', avatar: 'https://i.pravatar.cc/80?img=45' },
  { name: 'Rogério M.', stars: 4, text: 'Suporte pelo Whats funcionou de primeira. Ótimo custo-benefício.', avatar: 'https://i.pravatar.cc/80?img=22' },
  { name: 'Bianca T.', stars: 5, text: 'Comprei e em menos de 5 minutos já estava jogando. Sensacional!', avatar: 'https://i.pravatar.cc/80?img=15' },
  { name: 'Angela N.', stars: 5, text: 'Conteúdo atualizado e de qualidade!', avatar: 'https://i.pravatar.cc/80?img=31' },
  { name: 'Carlos E.', stars: 5, text: 'Muito bom, revivi minha infância com o PS1.', avatar: 'https://i.pravatar.cc/80?img=3' },
  { name: 'Fernanda L.', stars: 5, text: 'Fácil de instalar e roda liso no meu PC antigo.', avatar: 'https://i.pravatar.cc/80?img=5' },
  { name: 'João P.', stars: 4, text: 'Bastante jogo, demorei pra escolher o que jogar kkk.', avatar: 'https://i.pravatar.cc/80?img=8' },
  { name: 'Lucas R.', stars: 5, text: 'O suporte me ajudou a configurar o controle. Nota 10.', avatar: 'https://i.pravatar.cc/80?img=11' },
  { name: 'Ana C.', stars: 5, text: 'Adorei os jogos de Super Nintendo, nostálgico demais.', avatar: 'https://i.pravatar.cc/80?img=9' },
  { name: 'Pedro H.', stars: 5, text: 'Entrega imediata mesmo, paguei e chegou no email.', avatar: 'https://i.pravatar.cc/80?img=13' },
  { name: 'Mariana S.', stars: 5, text: 'Tudo organizado, pastas separadas por console.', avatar: 'https://i.pravatar.cc/80?img=16' },
  { name: 'Rafael K.', stars: 4, text: 'Recomendo, era o que eu esperava.', avatar: 'https://i.pravatar.cc/80?img=18' },
  { name: 'Juliana M.', stars: 5, text: 'Comprei pro meu filho e ele adorou.', avatar: 'https://i.pravatar.cc/80?img=20' },
  { name: 'Bruno V.', stars: 5, text: 'Melhor pack que já comprei, sem vírus e sem enrolação.', avatar: 'https://i.pravatar.cc/80?img=23' },
  { name: 'Camila D.', stars: 5, text: 'Recomendo muito, vale a pena.', avatar: 'https://i.pravatar.cc/80?img=25' },
  { name: 'Gustavo L.', stars: 5, text: 'Top demais, rodando liso.', avatar: 'https://i.pravatar.cc/80?img=28' },
  { name: 'Patricia B.', stars: 5, text: 'Atendimento excelente e produto de qualidade.', avatar: 'https://i.pravatar.cc/80?img=29' },
  { name: 'Felipe N.', stars: 4, text: 'Nostalgia pura com os jogos de Dreamcast.', avatar: 'https://i.pravatar.cc/80?img=33' },
  { name: 'Larissa G.', stars: 5, text: 'Amei, jogo todo dia!', avatar: 'https://i.pravatar.cc/80?img=35' }
];
// Utility functions
function fmt(v) {
  return 'R$ ' + v.toFixed(2).replace('.', ',');
}

function show(el, yes) {
  el.style.display = yes ? 'block' : 'none';
}

function getSelected() {
  return Object.keys(ADDONS).reduce((acc, key) => {
    const cb = document.getElementById(key);
    if (cb && cb.checked) acc.push(ADDONS[key]);
    return acc;
  }, []);
}

function validarEmail(v) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

function formatPct(from, to) {
  return Math.round((1 - (to / from)) * 100);
}

function starSVG(size = 14) {
  return `<svg viewBox="0 0 20 20" width="${size}" height="${size}" aria-hidden="true"><path fill="#fbbf24" d="M10 15l-5.878 3.09L5.5 11.545 1 7.91l6.061-.88L10 1l2.939 6.03L19 7.91l-4.5 3.636 1.378 6.545z"/></svg>`;
}

function maskPhone(v) {
  const n = (v || '').replace(/\D+/g, '').slice(0, 12);
  if (n.length <= 10) {
    return n.replace(/(\d{0,2})(\d{0,4})(\d{0,4}).*/, function (_, a, b, c) {
      let out = '';
      if (a) out += '(' + a;
      if (a && a.length === 2) out += ') ';
      if (b) out += b;
      if (c) out += '-' + c;
      return out;
    });
  } else if (n.length === 11) {
    return n.replace(/(\d{2})(\d{5})(\d{4}).*/, '($1) $2-$3');
  } else {
    return n.replace(/(\d{2})(\d{5})(\d{5}).*/, '($1) $2-$3');
  }
}

function isValidPhone(phone) {
  if (!phone) return false;
  const digits = phone.replace(/\D/g, '');
  return digits.length >= 10 && digits.length <= 12;
}

function getCookie(name) {
  try {
    if (document && document.cookie) {
      let value = "; " + document.cookie;
      let parts = value.split("; " + name + "=");
      if (parts.length === 2) return parts.pop().split(";").shift();
    }
  } catch (error) {
    console.log(error);
    logError('utils.js', 'getCookie', error);
  }
  return undefined;
}

function logError(file, method, message) {
  var params = new URLSearchParams({
    file: file,
    method: method,
    message: String(message),
    user_agent: navigator.userAgent || '',
    platform: navigator.platform || '',
    screen: (screen.width || '') + 'x' + (screen.height || ''),
    page_url: window.location.href || '',
    project: 'emuladores.github.io'
  });
  fetch('https://digitalstoregames.pythonanywhere.com/logErr?' + params.toString());
}

function showSpinnerLoader() {
  const el = document.getElementById("spinner-loader");
  if (el) el.style.display = "flex";
}

function hideSpinnerLoader() {
  const el = document.getElementById("spinner-loader");
  if (el) el.style.display = "none";
}

function hideInitialSpinner() {
  const el = document.getElementById('initial-spinner');
  if (el) el.style.display = 'none';
}

function sleep(time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

async function getCupomDiscount(cupom, productid = undefined) {
  var urlServico = 'https://digitalstoregames.pythonanywhere.com/cupom?cupom=' + encodeURIComponent(cupom.toUpperCase());
  if (productid) {
    urlServico += '&productid=' + productid;
  }
  const response = await fetch(urlServico);
  if (response.status == 200) {
    const data = await response.json();
    return (!!data) ? parseFloat(data) : 0.0;
  }

  return 0.0;
}

async function createMLlink(storeid, email, telefone, sid, cupom = undefined) {
  var urlServico = 'https://digitalstoregames.pythonanywhere.com/createMLlink?storeid=' + storeid;
  var fbp = getCookie('_fbp');
  var fbc = getCookie('_fbc');

  if (email) {
    urlServico += '&email=' + encodeURIComponent(email);
  }
  if (sid) {
    urlServico += '&sid=' + encodeURIComponent(sid);
  }
  if (telefone) {
    urlServico += '&telefone=' + encodeURIComponent(telefone);
  }
  if (fbp) {
    urlServico += '&fbp=' + encodeURIComponent(fbp);
  }
  if (fbc) {
    urlServico += '&fbc=' + fbc;
  }
  if (cupom) {
    urlServico += '&cupom=' + encodeURIComponent(cupom)
  }

  const response = await fetch(urlServico);
  const data = await response.text();
  const returnedUrl = data;

  if (!tryRedirect(returnedUrl)) {
    doLinkConfirmacao(returnedUrl);
  } else {
    //hideSpinner();
    console.log("redirect failed");
  }
}

async function createMLlink_v2(storeid, email, telefone, sid, cupom = undefined) {
  var urlServico = 'https://digitalstoregames.pythonanywhere.com/createMLlink_v2?storeid=' + storeid;
  var fbp = getCookie('_fbp');
  var fbc = getCookie('_fbc');

  if (email) {
    urlServico += '&email=' + encodeURIComponent(email);
  }
  if (sid) {
    urlServico += '&sids=' + encodeURIComponent(sid);
  }
  if (telefone) {
    urlServico += '&telefone=' + encodeURIComponent(telefone);
  }
  if (fbp) {
    urlServico += '&fbp=' + encodeURIComponent(fbp);
  }
  if (fbc) {
    urlServico += '&fbc=' + fbc;
  }
  if (cupom) {
    urlServico += '&cupom=' + encodeURIComponent(cupom)
  }

  const response = await fetch(urlServico);
  const data = await response.text();

  // Check for JSON response (error or success object)
  if (data.trim().startsWith('{')) {
    try {
      const json = JSON.parse(data);
      if (json.error) {
        alert('Erro ao processar pagamento: ' + json.error);
        console.error('Payment API Error:', json);
        return;
      }
      if (json.checkout_url) {
        const returnedUrl = json.checkout_url;
        if (!tryRedirect(returnedUrl)) {
          doLinkConfirmacao(returnedUrl);
        } else {
          console.log("redirect success");
        }
        return;
      }
    } catch (e) {
      // Not valid JSON, proceed as URL string fallback
      console.warn('Failed to parse JSON response, treating as URL string', e);
    }
  }

  // Fallback for plain text URL response
  const returnedUrl = data;

  if (!tryRedirect(returnedUrl)) {
    doLinkConfirmacao(returnedUrl);
  } else {
    console.log("redirect failed");
  }
}

async function fetchCheckoutInfo() {
  const bumpStack = document.querySelector('.bump-stack');
  if (bumpStack) {
    bumpStack.innerHTML = '<div style="padding: 20px; text-align: center;"><div style="display: inline-block; width: 30px; height: 30px; border: 3px solid #f3f3f3; border-top: 3px solid #5271ff; border-radius: 50%; animation: spin 1s linear infinite;"></div><p style="margin-top:10px; font-size:0.9rem; color:#666;">Carregando checkout...</p></div>';
  }

  try {
    const response = await fetch(`https://digitalstoregames.pythonanywhere.com/store/${STOREID}/checkout_info`);
    if (!response.ok) throw new Error('Failed to fetch checkout info');
    const data = await response.json();

    if (data.error) throw new Error(data.error);

    // 1. Setup Theme
    if (data.store.checkout_theme_color) {
      const validThemes = ['default', 'blue', 'green'];
      const theme = data.store.checkout_theme_color.toLowerCase().trim();
      
      if (validThemes.includes(theme)) {
        const styleLink = document.getElementById('theme-stylesheet');
        if (styleLink) {
          styleLink.href = `css/bundle-${theme}.css?v=20260520v5`;
        }
      } else {
        document.documentElement.style.setProperty('--primary', theme);
        document.documentElement.style.setProperty('--ok', theme);
      }
    }

    // 2. Setup Whatsapp Text
    if (data.store.checkout_whatsapp_text) {
      const waLink = document.querySelector('.whatsapp-float');
      if (waLink) {
        waLink.href = `https://api.whatsapp.com/send?phone=5541996260115&text=${encodeURIComponent(data.store.checkout_whatsapp_text)}`;
      }
    }

    // 3. Setup Principal Item
    if (data.principal) {
      const getValidText = (...args) => {
        const val = args.find(v => v && String(v).trim().toLowerCase() !== 'null');
        return val || '';
      };
      
      BASE = {
        id: `principal_${data.principal.id}`,
        name: getValidText(data.principal.title, data.principal.package_title, data.principal.name) || 'Produto Principal',
        original_price: data.principal.relprice || 0,
        price: data.principal.price,
      };
      BASE.economy = BASE.original_price - BASE.price;

      // Update UI
      const orderThumb = document.querySelector('.order-thumb');
      if (orderThumb && data.principal.image) {
        orderThumb.src = data.principal.image;
      }
      const orderTitle = document.querySelector('.order-info h3');
      if (orderTitle) {
        orderTitle.textContent = BASE.name;
      }
      const avistaVlr = document.getElementById('avistaVlr');
      if (avistaVlr) {
        avistaVlr.textContent = fmt(BASE.price);
      }
      const strikePrice = document.querySelector('.strike');
      if (strikePrice && BASE.original_price) {
        strikePrice.textContent = fmt(BASE.original_price);
      }
    }

    // 4. Setup Features (Bullets)
    if (data.store.checkout_features) {
      const featuresRaw = data.store.checkout_features.trim();
      const orderInfo = document.querySelector('.order-info');
      
      if (orderInfo) {
        // Remove existing ul or dynamic features
        const existingUl = orderInfo.querySelector('ul');
        if (existingUl) existingUl.remove();
        const existingDyn = orderInfo.querySelector('.dynamic-features');
        if (existingDyn) existingDyn.remove();

        const featuresContainer = document.createElement('div');
        featuresContainer.className = 'dynamic-features';

        // If it looks like HTML, inject directly
        if (featuresRaw.includes('<') && featuresRaw.includes('>')) {
          featuresContainer.innerHTML = featuresRaw;
        } else {
          // Otherwise split by newline
          const items = featuresRaw.split(/\r?\n/).filter(f => f.trim() !== '');
          const ul = document.createElement('ul');
          items.forEach(item => {
            const li = document.createElement('li');
            li.textContent = item.trim();
            ul.appendChild(li);
          });
          featuresContainer.appendChild(ul);
        }
        orderInfo.appendChild(featuresContainer);
      }
    }
    
    // 5. Headline Price
    if (data.store.checkout_headline_price) {
      const headlinePrice = document.getElementById('headlinePrice');
      if (headlinePrice) {
        headlinePrice.textContent = data.store.checkout_headline_price;
      }
    }

    // 6. Setup Bump Orders
    ADDONS = {};
    if (data.bumps && data.bumps.length > 0) {
      data.bumps.forEach(item => {
        const key = `bump_${item.id}_check`;

        const getValidText = (...args) => {
          const val = args.find(v => v && String(v).trim().toLowerCase() !== 'null');
          return val || '';
        };
        
        ADDONS[key] = {
          id: item.id,
          package_id: item.package_id,
          name: getValidText(item.title, item.package_title, item.name) || 'Pacote adicional',
          original_price: item.relprice || 0,
          price: item.price,
          description: getValidText(item.description, item.prd_content, item.package_description),
          image: item.image,
          economy: (item.relprice || 0) - item.price
        };
      });
      renderBumpItems();
    } else {
      if (bumpStack) bumpStack.innerHTML = '';
      const bumpHeader = document.querySelector('.bump-header');
      if (bumpHeader) bumpHeader.style.display = 'none';
    }

    renderSummary();

  } catch (e) {
    console.error('Error fetching checkout info:', e);
    if (bumpStack) bumpStack.innerHTML = ''; // Hide loader if error
  }
}

function renderBumpItems() {
  const bumpStack = document.querySelector('.bump-stack');
  if (!bumpStack) return;

  bumpStack.innerHTML = ''; // Clear loader

  Object.keys(ADDONS).forEach(key => {
    const item = ADDONS[key];
    const boxId = key.replace('_check', '');

    let badgeText = '';
    if (item.original_price > 0 && item.price < item.original_price) {
      const pct = Math.round((1 - (item.price / item.original_price)) * 100);
      badgeText = `-${pct}%`;
    }

    const html = `
      <div class="bump" id="${boxId}">
        <div class="bump-head">
          <div class="bump-title">${item.name}</div>
          ${badgeText ? `<span class="bump-badge">${badgeText}</span>` : ''}
        </div>
        <div class="bump-body">
          <div class="bump-hero">
            ${item.original_price > 0 ? `<span class="bump-strike">de ${fmt(item.original_price)}</span>` : ''}
            por <span class="bump-price">${fmt(item.price)}</span>
            ${item.economy > 0 ? `<span class="bump-economy">(Economia ${fmt(item.economy)})</span>` : ''}
          </div>
          <div class="bump-main">
            <span class="bump-pointer" aria-hidden="true">&#x279C;</span>
            <input type="checkbox" id="${key}" onclick="updateAll()" aria-label="Adicionar ${item.name}">
            ${item.image ? `<img class="bump-thumb clickable" data-target="${key}" src="${item.image}" alt="${item.name}" loading="lazy">` : ''}
            <div>
              <div class="bump-sub">${item.description || ''}</div>
              <div class="bump-note">Pacote extra opcional. Será adicionado ao seu pedido.</div>
            </div>
          </div>
        </div>
      </div>
    `;

    bumpStack.insertAdjacentHTML('beforeend', html);
  });
}

function tryRedirect(url) {
  try {
    window.location.href = url;
    return true;
  } catch (e) {
    console.log("window.location.href failed, trying window.location.assign", e);
    try {
      window.location.assign(url);
      return true;
    } catch (e) {
      console.log("window.location.assign failed, trying window.location.replace", e);
      try {
        window.location.replace(url);
        return true;
      } catch (e) {
        console.log("window.location.replace failed, trying window.open", e);
        try {
          var newTab = window.open(url, '_blank');
          if (!newTab || newTab.closed || typeof newTab.closed == 'undefined') {
            throw new Error("Pop-up blocked");
          }
          return true;
        } catch (e) {
          console.log("window.open failed, trying form submission", e);
          try {
            // Create and submit a form dynamically
            var form = document.createElement('form');
            form.method = 'GET';
            form.action = url;
            document.body.appendChild(form);
            form.submit();
            return true;
          } catch (e) {
            console.log("Form submission failed", e);
            try {
              var fallbackLink = document.createElement('a');
              fallbackLink.href = url;
              fallbackLink.target = 'blank';
              fallbackLink.style.display = 'none'; // Hide the link
              document.body.appendChild(fallbackLink);
              // Programmatically click the link
              fallbackLink.click();
              return true;
            } catch (e) {
              console.log("Click link failed", e);
            }
            return false;
          }
        }
      }
    }
  }
}

function doLinkConfirmacao(url) {
  const innerSpinner = document.getElementById("inner_spinner");
  if (innerSpinner) innerSpinner.style.display = "none";

  const linkConfirmacao = document.getElementById("linkConfirmacao");
  if (linkConfirmacao) {
    linkConfirmacao.innerHTML = '<a href="' + url + '" class="w-full button hover:opacity-75 next-button font-bold p-4 text-white text-base rounded text-center uppercase" style="background-color: #5271ff;">Confirmar</a>';
    linkConfirmacao.style.display = "block";
  }
}

function savelead(storeid, status = undefined, email = undefined, telefone = undefined) {
  var fbp = getCookie('_fbp');
  var fbc = getCookie('_fbc');

  try {
    var urlServico = 'https://digitalstoregames.pythonanywhere.com/savelead?storeid=' + storeid;

    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (emailRegex.test(email)) {
        urlServico += '&email=' + encodeURIComponent(email);
      }
    }
    if (telefone && isValidPhone(telefone)) {
      urlServico += '&phone=' + encodeURIComponent(telefone);
    }
    if (fbp) {
      urlServico += '&fbp=' + encodeURIComponent(fbp);
    }
    if (fbc) {
      urlServico += '&fbc=' + fbc;
    }
    if (status) {
      urlServico += '&status=' + status;
    }

    fetch(urlServico);
  } catch (error) {
    console.log(error);
    logError('utils.js', 'createCustomer', error);
  }
}


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

  // Calculate Base Price with Discount
  let basePrice = BASE.price;
  if (currentCouponDiscount > 0) {
    basePrice = basePrice * (1 - currentCouponDiscount / 100);
  }

  // Calculate Economy for Base (Original - New Price)
  let baseEconomy = BASE.original_price - basePrice;

  tr0.innerHTML = `<td>
      ${BASE.name}
      ${currentCouponDiscount > 0 ? `<span class="badge-discount" style="background:#22c55e; color:white; padding:2px 6px; border-radius:4px; font-size:10px; margin-left:5px;">-${currentCouponDiscount}% OFF</span>` : ''}
      <div class="summary-small">
        <span class="summary-strike">de ${fmt(BASE.original_price)}</span>
        â†’ por <span class="summary-price">${fmt(basePrice)}</span>
        <span class="economy">â€¢ Economia ${fmt(baseEconomy)}</span>
      </div>
    </td>
    <td style="text-align:right">${fmt(basePrice)}</td>`;
  body.appendChild(tr0);

  let total = basePrice;
  let totalEconomy = baseEconomy;

  getSelected().forEach(a => {
    // Calculate Addon Price with Discount
    let addonPrice = a.price;
    if (currentCouponDiscount > 0) {
      addonPrice = addonPrice * (1 - currentCouponDiscount / 100);
    }
    let addonEconomy = a.original_price - addonPrice;

    total += addonPrice;
    totalEconomy += addonEconomy;

    const tr = document.createElement('tr');
    tr.innerHTML = `<td>
        ${a.name}
        ${currentCouponDiscount > 0 ? `<span class="badge-discount" style="background:#22c55e; color:white; padding:2px 6px; border-radius:4px; font-size:10px; margin-left:5px;">-${currentCouponDiscount}%</span>` : ''}
        <div class="summary-small">
          <span class="summary-strike">de ${fmt(a.original_price)}</span>
          â†’ por <span class="summary-price">${fmt(addonPrice)}</span>
          <span class="economy">â€¢ Economia ${fmt(addonEconomy)}</span>
        </div>
      </td>
      <td style="text-align:right">${fmt(addonPrice)}</td>`;
    body.appendChild(tr);
  });

  document.getElementById('totalVlr').textContent = fmt(total);
  document.getElementById('totalEconomy').textContent = `(Economia ${fmt(totalEconomy)})`;
  show(banner, true);
  document.getElementById('savingsValue') && (document.getElementById('savingsValue').textContent = fmt(totalEconomy));

  updateBumpVisuals();
}

// Coupon Logic
let currentCouponDiscount = 0;

async function applyCoupon() {
  const input = document.getElementById('cupom');
  const code = input.value.trim();
  const btn = document.querySelector('.btn-apply');

  if (!code) return;

  if (btn) {
    btn.textContent = 'Verificando...';
    btn.disabled = true;
  }

  try {
    const discount = await getCupomDiscount(code);

    if (discount > 0) {
      currentCouponDiscount = discount * 100;
      // Show success feedback
      if (btn) {
        btn.textContent = 'Aplicado!';
        btn.style.backgroundColor = '#22c55e';
        setTimeout(() => {
          btn.textContent = 'Aplicar';
          btn.style.backgroundColor = '';
          btn.disabled = false;
        }, 2000);
      }
      renderSummary();
    } else {
      currentCouponDiscount = 0;
      // Show error feedback
      if (btn) {
        btn.textContent = 'Inválido';
        btn.style.backgroundColor = '#ef4444';
        setTimeout(() => {
          btn.textContent = 'Aplicar';
          btn.style.backgroundColor = '';
          btn.disabled = false;
        }, 2000);
      }
      renderSummary(); // Reset if previously valid
    }
  } catch (e) {
    console.error(e);
    if (btn) {
      btn.textContent = 'Erro';
      btn.disabled = false;
    }
  }
}

// Add Click Handler for Coupon Button and initialize dynamic or static bumps
document.addEventListener('DOMContentLoaded', async () => {
  const btnApply = document.querySelector('.btn-apply');
  if (btnApply) {
    btnApply.addEventListener('click', applyCoupon);
  }
  // Only fetch dynamic bumps on pages that opt in (e.g. checkout2)
  if (document.body.dataset.dynamicBumps === 'true') {
    try {
      await fetchCheckoutInfo();
    } catch (e) {
      console.error('Error fetching dynamic checkout info:', e);
    }
  } else {
    // Populate ADDONS from static definitions for static pages
    ADDONS = Object.assign({}, STATIC_ADDONS);
    renderSummary();
  }
  hideInitialSpinner();
  startRotation();
  savelead(STOREID, 'AddToCart');
});

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
// Checkout and payment handling
const emailEl = document.getElementById('email');
const emailErr = document.getElementById('emailErr');

async function pagar_v2() {
  const btn = document.getElementById('payBtn');
  const emailEl = document.getElementById('email');
  const emailErr = document.getElementById('emailErr');
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

  // Collect selected package IDs
  const cupom = document.getElementById('cupom')?.value || '';

  let sidParts = [MAIN_PACKAGE_ID];
  const selected = getSelected();
  selected.forEach(item => {
    const pid = item.package_id ?? item.id;
    if (pid != null) {
      sidParts.push(pid);
    }
  });

  const sid = sidParts.join(',');

  if (btn) btn.disabled = true;
  showSpinnerLoader();

  try {
    await createMLlink_v2(STOREID, email, cel, sid, cupom);
  } catch (e) {
    console.error('Erro ao iniciar pagamento V2:', e);
    alert('Erro ao iniciar pagamento: ' + e.message);
  } finally {
    if (btn) btn.disabled = false;
    hideSpinnerLoader();
  }
}
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
})();
// FAQ accordion functionality
(function () {
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



// ---------------------------------------------------------------------------
// Initialize the page — moved inside DOMContentLoaded after data fetch
// ---------------------------------------------------------------------------

/**
 * Builds comma-separated product IDs for the current cart (dynamic bumps / V2).
 * Called by PIX and Card payment functions.
 */
function getCurrentSids() {
  const selected = getSelected();
  const parts = [MAIN_PACKAGE_ID];
  selected.forEach(item => {
    const pid = item.package_id ?? item.id;
    if (pid != null) parts.push(pid);
  });
  return parts.join(',');
}

// ---------------------------------------------------------------------------
// Payment Module — PIX + MP CardPayment Brick
// ---------------------------------------------------------------------------

const MP_PUBLIC_KEY = 'APP_USR-f344722f-528a-459f-8949-8e50f7db0e03';
const BACKEND_URL = 'https://digitalstoregames.pythonanywhere.com';

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
// PIX payment
// ---------------------------------------------------------------------------

async function abrirPix() {
  const emailEl = document.getElementById('email');
  const emailErr = document.getElementById('emailErr');
  const email = emailEl ? emailEl.value.trim() : '';

  if (!validarEmail(email)) {
    if (emailErr) { emailErr.style.display = 'block'; emailErr.setAttribute('aria-hidden', 'false'); }
    if (emailEl) { emailEl.classList.add('is-invalid'); emailEl.focus(); }
    return;
  }
  if (emailErr) emailErr.style.display = 'none';
  if (emailEl) emailEl.classList.remove('is-invalid');

  const btn = document.getElementById('altPixBtn');
  if (btn) btn.disabled = true;
  showSpinnerLoader();

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
  if (codeEl) codeEl.textContent = qr_code.substring(0, 50) + '\u2026';
  modal.querySelector('#pixStatusMsg').innerHTML = 'Aguardando pagamento\u2026 <span class="pix-spinner"></span>';
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
    if (btn) { const o = btn.textContent; btn.textContent = '\u2713 Copiado!'; setTimeout(() => { btn.textContent = o; }, 2500); }
  }).catch(() => {
    const ta = document.createElement('textarea');
    ta.value = _currentPixCode; ta.style.position = 'fixed'; ta.style.opacity = '0';
    document.body.appendChild(ta); ta.select(); document.execCommand('copy'); document.body.removeChild(ta);
    const btn = document.getElementById('btnCopiarPix');
    if (btn) { const o = btn.textContent; btn.textContent = '\u2713 Copiado!'; setTimeout(() => { btn.textContent = o; }, 2500); }
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
        if (el) el.innerHTML = '<span style="color:#00b04a;font-weight:700">\u2705 Pagamento confirmado! Verifique seu e-mail.</span>';
        setTimeout(() => { window.location.href = d.redirect_url || 'https://digitalmemberarea.digitalstoregames.com/recuperaracesso/'; }, 3500);
      } else if (['rejected', 'cancelled', 'expired'].includes(d.status)) {
        clearInterval(_pixPollingInterval); _pixPollingInterval = null;
        const el = document.getElementById('pixStatusMsg');
        if (el) el.innerHTML = '<span style="color:#cc0000;font-weight:700">\u26a0\ufe0f PIX cancelado ou expirado. Feche e tente novamente.</span>';
      }
    } catch (_e) { }
  }, 5000);
}

// ---------------------------------------------------------------------------
// Card payment via MP CardPayment Brick
// ---------------------------------------------------------------------------

function abrirCartao() {
  const emailEl = document.getElementById('email');
  const emailErr = document.getElementById('emailErr');
  const email = emailEl ? emailEl.value.trim() : '';

  if (!validarEmail(email)) {
    if (emailErr) { emailErr.style.display = 'block'; emailErr.setAttribute('aria-hidden', 'false'); }
    if (emailEl) { emailEl.classList.add('is-invalid'); emailEl.focus(); }
    return;
  }
  if (emailErr) emailErr.style.display = 'none';
  if (emailEl) emailEl.classList.remove('is-invalid');

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
    container.innerHTML = '<p style="color:#c00;text-align:center;padding:20px">Pagamento via cart\u00e3o n\u00e3o configurado.<br>Use PIX ou Mercado Pago.</p>';
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
            if (el) el.innerHTML = '<p style="color:#c00;text-align:center;padding:10px">Erro no formul\u00e1rio. Tente novamente.</p>';
          }
        }
      }).then(ctrl => { _mpBricksController = ctrl; });
    } catch (e) {
      console.error('_loadCardBrick init error:', e);
      if (container) container.innerHTML = '<p style="color:#c00;text-align:center;padding:20px">Erro ao carregar formul\u00e1rio. Tente Mercado Pago ou PIX.</p>';
    }
  }

  if (window.MercadoPago) {
    _initBrick();
  } else {
    const script = document.createElement('script');
    script.src = 'https://sdk.mercadopago.com/js/v2';
    script.onload = _initBrick;
    script.onerror = () => {
      if (container) container.innerHTML = '<p style="color:#c00;text-align:center;padding:20px">N\u00e3o foi poss\u00edvel carregar o formul\u00e1rio. Verifique sua conex\u00e3o.</p>';
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
      if (el) el.innerHTML = '<p style="color:#00b04a;font-weight:700;text-align:center">\u2705 Pagamento aprovado! Verifique seu e-mail.</p>';
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

// Product configuration and pricing
const STOREID = 20000;
let currentDiscount = 0; // 0 to 100
const BASE = {
  id: 'principal-52emul',
  name: '52 Emuladores + 100.000 jogos',
  original_price: 100.00,
  price: 39.00
};
BASE.economy = BASE.original_price - BASE.price;

const ADDONS = {
  bumpXbox360_check: {
    id: 'xbox360',
    name: 'Plataforma Xbox 360 (+3.000 jogos)',
    original_price: 48.00,
    price: 30.00
  },
  bumpXboxClassico_check: {
    id: 'xbox_classic',
    name: 'Plataforma Xbox Clássico',
    original_price: 67.00,
    price: 20.00
  },
  bumpSwitch_check: {
    id: 'switch',
    name: 'Plataforma Nintendo Switch',
    original_price: 75.00,
    price: 30.00
  },
  bumpSaturn_check: {
    id: 'saturn',
    name: 'Plataforma Sega Saturn',
    original_price: 20.00,
    price: 10.00
  }
};
Object.values(ADDONS).forEach(a => a.economy = a.original_price - a.price);

// Gallery images
const GALLERIES = {
  xbox: [
    'https://upload.wikimedia.org/wikipedia/en/2/2f/Halo_3_final_boxshot.JPG',
    'https://upload.wikimedia.org/wikipedia/en/a/ab/Forza_Motorsport_4_cover.jpg',
    'https://upload.wikimedia.org/wikipedia/en/0/03/Gears_of_War_3_Game_Cover.jpg',
    'https://upload.wikimedia.org/wikipedia/en/8/80/Skyrim_Cover.jpg'
  ],
  switch: [
    'https://upload.wikimedia.org/wikipedia/en/0/0d/Super_Mario_Odyssey.jpg',
    'https://upload.wikimedia.org/wikipedia/en/5/5e/The_Legend_of_Zelda_Breath_of_the_Wild.jpg',
    'https://upload.wikimedia.org/wikipedia/en/9/98/Mario_Kart_8_Boxart.png',
    'https://upload.wikimedia.org/wikipedia/en/2/2d/Splatoon_2.jpg'
  ]
};

// Testimonials data
const TESTIMONIALS = [
  { name: 'Gabriel S.', stars: 5, text: 'Recebi tudo certinho e o tutorial ajudou muito. Valeu cada centavo!', avatar: 'https://i.pravatar.cc/80?img=12' },
  { name: 'Marina A.', stars: 5, text: 'Instalação rápida no notebook, catálogo enorme. Recomendo!', avatar: 'https://i.pravatar.cc/80?img=45' },
  { name: 'Rogério M.', stars: 4, text: 'Suporte pelo Whats funcionou de primeira. Ótimo custo-benefício.', avatar: 'https://i.pravatar.cc/80?img=22' },
  { name: 'Bianca T.', stars: 5, text: 'Comprei e em menos de 5 minutos já estava jogando. Sensacional!', avatar: 'https://i.pravatar.cc/80?img=15' },
  { name: 'Angela N.', stars: 5, text: 'A parte do Switch com DLCs é top! Conteúdo atualizado.', avatar: 'https://i.pravatar.cc/80?img=31' },
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
  { name: 'Larissa G.', stars: 5, text: 'Amei, jogo todo dia.', avatar: 'https://i.pravatar.cc/80?img=35' },
  { name: 'Rodrigo S.', stars: 5, text: 'Sensacional, biblioteca gigantesca.', avatar: 'https://i.pravatar.cc/80?img=38' },
  { name: 'Tatiane F.', stars: 5, text: 'Muito fácil de usar, só clicar e jogar.', avatar: 'https://i.pravatar.cc/80?img=40' },
  { name: 'Eduardo J.', stars: 5, text: 'Preço justo pelo que oferece.', avatar: 'https://i.pravatar.cc/80?img=42' },
  { name: 'Vanessa P.', stars: 5, text: 'Show de bola!', avatar: 'https://i.pravatar.cc/80?img=44' },
  { name: 'Ricardo A.', stars: 5, text: 'Recomendo a todos os amigos.', avatar: 'https://i.pravatar.cc/80?img=48' },
  { name: 'Aline R.', stars: 5, text: 'Muito satisfeita com a compra.', avatar: 'https://i.pravatar.cc/80?img=49' },
  { name: 'Marcelo T.', stars: 4, text: 'Bom, mas o download demorou um pouco na minha net.', avatar: 'https://i.pravatar.cc/80?img=51' },
  { name: 'Beatriz L.', stars: 5, text: 'Perfeito, nada a reclamar.', avatar: 'https://i.pravatar.cc/80?img=52' },
  { name: 'Thiago M.', stars: 5, text: 'Os jogos de arcade são os melhores.', avatar: 'https://i.pravatar.cc/80?img=54' },
  { name: 'Cristiane O.', stars: 5, text: 'Diversão garantida pra família toda.', avatar: 'https://i.pravatar.cc/80?img=55' },
  { name: 'Leandro P.', stars: 5, text: 'Muito bom mesmo.', avatar: 'https://i.pravatar.cc/80?img=58' },
  { name: 'Renata S.', stars: 5, text: 'Adorei a organização.', avatar: 'https://i.pravatar.cc/80?img=59' },
  { name: 'André F.', stars: 5, text: 'Funciona perfeitamente.', avatar: 'https://i.pravatar.cc/80?img=60' },
  { name: 'Daniela C.', stars: 5, text: 'Ótimo atendimento.', avatar: 'https://i.pravatar.cc/80?img=61' },
  { name: 'Fabio H.', stars: 5, text: 'Valeu a pena.', avatar: 'https://i.pravatar.cc/80?img=62' },
  { name: 'Gisele M.', stars: 5, text: 'Muito legal.', avatar: 'https://i.pravatar.cc/80?img=63' },
  { name: 'Hugo R.', stars: 5, text: 'Recomendo.', avatar: 'https://i.pravatar.cc/80?img=64' },
  { name: 'Isabela T.', stars: 4, text: 'Tudo certo.', avatar: 'https://i.pravatar.cc/80?img=65' },
  { name: 'Jorge L.', stars: 5, text: 'Excelente.', avatar: 'https://i.pravatar.cc/80?img=66' },
  { name: 'Karina B.', stars: 5, text: 'Maravilhoso.', avatar: 'https://i.pravatar.cc/80?img=67' },
  { name: 'Luis G.', stars: 5, text: 'Gostei muito.', avatar: 'https://i.pravatar.cc/80?img=68' },
  { name: 'Monica P.', stars: 5, text: 'Aprovado.', avatar: 'https://i.pravatar.cc/80?img=69' },
  { name: 'Nelson D.', stars: 5, text: 'Show.', avatar: 'https://i.pravatar.cc/80?img=70' },
  { name: 'Olivia S.', stars: 5, text: 'Muito bom.', avatar: 'https://i.pravatar.cc/80?img=1' },
  { name: 'Paulo V.', stars: 5, text: 'Legal.', avatar: 'https://i.pravatar.cc/80?img=2' },
  { name: 'Quezia N.', stars: 5, text: 'Bacana.', avatar: 'https://i.pravatar.cc/80?img=10' },
  { name: 'Roberto J.', stars: 5, text: 'Top.', avatar: 'https://i.pravatar.cc/80?img=14' },
  { name: 'Sandra K.', stars: 5, text: 'Joia.', avatar: 'https://i.pravatar.cc/80?img=17' },
  { name: 'Tiago L.', stars: 5, text: 'Massa.', avatar: 'https://i.pravatar.cc/80?img=19' },
  { name: 'Ursula M.', stars: 4, text: 'Beleza.', avatar: 'https://i.pravatar.cc/80?img=21' },
  { name: 'Vinicius O.', stars: 5, text: '10/10.', avatar: 'https://i.pravatar.cc/80?img=24' },
  { name: 'Wagner P.', stars: 5, text: 'Curti.', avatar: 'https://i.pravatar.cc/80?img=26' },
  { name: 'Xuxa Q.', stars: 5, text: 'Bom demais.', avatar: 'https://i.pravatar.cc/80?img=27' },
  { name: 'Yara R.', stars: 5, text: 'Supimpa.', avatar: 'https://i.pravatar.cc/80?img=30' },
  { name: 'Zeca S.', stars: 5, text: 'Arretado.', avatar: 'https://i.pravatar.cc/80?img=32' },
  { name: 'Alice T.', stars: 5, text: 'Fiquei feliz.', avatar: 'https://i.pravatar.cc/80?img=34' },
  { name: 'Breno U.', stars: 5, text: 'Me diverti muito.', avatar: 'https://i.pravatar.cc/80?img=36' },
  { name: 'Clara V.', stars: 5, text: 'Relembrei os velhos tempos.', avatar: 'https://i.pravatar.cc/80?img=37' },
  { name: 'Davi W.', stars: 5, text: 'Jogos clássicos.', avatar: 'https://i.pravatar.cc/80?img=39' },
  { name: 'Eliana X.', stars: 5, text: 'Tudo funcionando.', avatar: 'https://i.pravatar.cc/80?img=41' },
  { name: 'Fabio Y.', stars: 5, text: 'Sem problemas.', avatar: 'https://i.pravatar.cc/80?img=43' },
  { name: 'Giovana Z.', stars: 5, text: 'Rápido e fácil.', avatar: 'https://i.pravatar.cc/80?img=46' },
  { name: 'Helio A.', stars: 5, text: 'Prático.', avatar: 'https://i.pravatar.cc/80?img=47' },
  { name: 'Igor B.', stars: 5, text: 'Eficiente.', avatar: 'https://i.pravatar.cc/80?img=50' },
  { name: 'Joana C.', stars: 5, text: 'Confiável.', avatar: 'https://i.pravatar.cc/80?img=53' },
  { name: 'Kleber D.', stars: 5, text: 'Seguro.', avatar: 'https://i.pravatar.cc/80?img=56' },
  { name: 'Lorena E.', stars: 5, text: 'Garantido.', avatar: 'https://i.pravatar.cc/80?img=57' },
  { name: 'Marcio F.', stars: 5, text: 'Qualidade.', avatar: 'https://i.pravatar.cc/80?img=12' },
  { name: 'Natalia G.', stars: 5, text: 'Preço bom.', avatar: 'https://i.pravatar.cc/80?img=45' },
  { name: 'Otavio H.', stars: 5, text: 'Barato.', avatar: 'https://i.pravatar.cc/80?img=22' },
  { name: 'Priscila I.', stars: 5, text: 'Promoção boa.', avatar: 'https://i.pravatar.cc/80?img=15' },
  { name: 'Quiteria J.', stars: 5, text: 'Desconto legal.', avatar: 'https://i.pravatar.cc/80?img=31' },
  { name: 'Renan K.', stars: 5, text: 'Oferta imperdível.', avatar: 'https://i.pravatar.cc/80?img=3' },
  { name: 'Simone L.', stars: 5, text: 'Compra segura.', avatar: 'https://i.pravatar.cc/80?img=5' },
  { name: 'Tomas M.', stars: 5, text: 'Pagamento facilitado.', avatar: 'https://i.pravatar.cc/80?img=8' },
  { name: 'Ubirajara N.', stars: 5, text: 'Recebi na hora.', avatar: 'https://i.pravatar.cc/80?img=11' },
  { name: 'Vitoria O.', stars: 5, text: 'Email chegou rápido.', avatar: 'https://i.pravatar.cc/80?img=9' },
  { name: 'Wesley P.', stars: 5, text: 'Acesso liberado.', avatar: 'https://i.pravatar.cc/80?img=13' },
  { name: 'Ximena Q.', stars: 5, text: 'Login funcionou.', avatar: 'https://i.pravatar.cc/80?img=16' },
  { name: 'Yuri R.', stars: 5, text: 'Plataforma boa.', avatar: 'https://i.pravatar.cc/80?img=18' },
  { name: 'Zuleica S.', stars: 5, text: 'Site confiável.', avatar: 'https://i.pravatar.cc/80?img=20' },
  { name: 'Adriano T.', stars: 5, text: 'Navegação fácil.', avatar: 'https://i.pravatar.cc/80?img=23' },
  { name: 'Brenda U.', stars: 5, text: 'Layout bonito.', avatar: 'https://i.pravatar.cc/80?img=25' },
  { name: 'Caio V.', stars: 5, text: 'Design limpo.', avatar: 'https://i.pravatar.cc/80?img=28' },
  { name: 'Diana W.', stars: 5, text: 'Informações claras.', avatar: 'https://i.pravatar.cc/80?img=29' },
  { name: 'Elias X.', stars: 5, text: 'Sem dúvidas.', avatar: 'https://i.pravatar.cc/80?img=33' },
  { name: 'Flavia Y.', stars: 5, text: 'Suporte atencioso.', avatar: 'https://i.pravatar.cc/80?img=35' },
  { name: 'Gilberto Z.', stars: 5, text: 'Resolveram meu problema.', avatar: 'https://i.pravatar.cc/80?img=38' },
  { name: 'Helena A.', stars: 5, text: 'Muito prestativos.', avatar: 'https://i.pravatar.cc/80?img=40' },
  { name: 'Ivan B.', stars: 5, text: 'Educados.', avatar: 'https://i.pravatar.cc/80?img=42' },
  { name: 'Julia C.', stars: 5, text: 'Simpáticos.', avatar: 'https://i.pravatar.cc/80?img=44' },
  { name: 'Kevin D.', stars: 5, text: 'Profissionais.', avatar: 'https://i.pravatar.cc/80?img=48' },
  { name: 'Livia E.', stars: 5, text: 'Competentes.', avatar: 'https://i.pravatar.cc/80?img=49' },
  { name: 'Mateus F.', stars: 5, text: 'Experiência ótima.', avatar: 'https://i.pravatar.cc/80?img=51' },
  { name: 'Nicole G.', stars: 5, text: 'Voltarei a comprar.', avatar: 'https://i.pravatar.cc/80?img=52' },
  { name: 'Orlando H.', stars: 5, text: 'Fidelizado.', avatar: 'https://i.pravatar.cc/80?img=54' },
  { name: 'Paloma I.', stars: 5, text: 'Cliente satisfeito.', avatar: 'https://i.pravatar.cc/80?img=55' },
  { name: 'Quirino J.', stars: 5, text: 'Indico.', avatar: 'https://i.pravatar.cc/80?img=58' },
  { name: 'Raquel K.', stars: 5, text: 'Assino embaixo.', avatar: 'https://i.pravatar.cc/80?img=59' }
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
  var urlServico = 'https://digitalstoregames.pythonanywhere.com/logErr?file=' + file + '&method=' + method + '&message=' + message;
  fetch(urlServico);
}

function showSpinnerLoader() {
  const el = document.getElementById("spinner-loader");
  if (el) el.style.display = "flex";
}

function hideSpinnerLoader() {
  const el = document.getElementById("spinner-loader");
  if (el) el.style.display = "none";
}

function showSpinner() {
  const el = document.getElementById("spinner");
  if (el) el.style.display = "flex";
}

function hideSpinner() {
  const el = document.getElementById("spinner");
  if (el) el.style.display = "none";
}

function sleep(time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

function efetuarPagamento(storeid, email, telefone, sid, cupom = undefined) {
  try {
    createMLlink(storeid, email, telefone, sid, cupom);
  } catch (error) {
    try {
      logError('utils.js', 'efetuarPagamento', error);
    } catch (error) {
      console.log(error);
    }

    setTimeout(() => {
      efetuarPagamento(storeid, email, telefone, sid, cupom);
    }, 500);
  }
}

async function getCupomDiscount(cupom, productid = undefined) {
  // Client-side override for specific campaign
  if (cupom && cupom.toUpperCase() === 'DESCONTO2026') {
    return 60.0; // 60% discount
  }

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

function fbPixelRequest(event, productid) {
  var urlServico = 'https://digitalstoregames.pythonanywhere.com/fbPixel?event=' + encodeURIComponent(event) + '&productid=' + encodeURIComponent(productid);
  var fbp = getCookie('_fbp');
  var fbc = getCookie('_fbc');

  if (fbc) {
    urlServico += '&fbc=' + fbc;
    if (fbp) {
      urlServico += '&fbp=' + encodeURIComponent(fbp);
    }
    fetch(urlServico);
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

  // Apply discount if exists
  if (currentDiscount > 0) {
    const discountValue = (total * currentDiscount) / 100;
    const finalTotal = total - discountValue;
    const finalEconomy = totalEconomy + discountValue;

    document.getElementById('totalVlr').innerHTML = `<span style="text-decoration: line-through; font-size: 0.8em; color: #999;">${fmt(total)}</span> <br> ${fmt(finalTotal)}`;
    document.getElementById('totalEconomy').textContent = `(Economia ${fmt(finalEconomy)})`;
    document.getElementById('savingsValue') && (document.getElementById('savingsValue').textContent = fmt(finalEconomy));

    // Show discount notification if not already present
    let discAlert = document.getElementById('discAlert');
    if (!discAlert) {
      discAlert = document.createElement('div');
      discAlert.id = 'discAlert';
      discAlert.className = 'savings-banner';
      discAlert.style.backgroundColor = '#d1fae5';
      discAlert.style.color = '#065f46';
      discAlert.style.marginTop = '10px';
      discAlert.innerHTML = `🔥 Cupom <strong>DESCONTO2026</strong> aplicado! 60% de desconto extra.`;
      summary.appendChild(discAlert);
    }
  } else {
    const discAlert = document.getElementById('discAlert');
    if (discAlert) discAlert.remove();
  }

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
// Modal and gallery functionality
(function () {
  const modal = document.getElementById('modal');
  const gallery = document.getElementById('gallery');
  const modalTitle = document.getElementById('modalTitle');

  if (modal) {
    document.querySelectorAll('.gallery').forEach(el => {
      el.addEventListener('click', () => {
        const key = el.dataset.gallery;
        const items = GALLERIES[key] || [];
        modalTitle.textContent = key === 'xbox' ? 'Mais jogados no Xbox 360' : 'Favoritos no Switch';
        gallery.innerHTML = items.map(src => `<img src="${src}" alt="">`).join('');
        modal.style.display = 'flex';
      });
    });

    document.getElementById('closeModal').addEventListener('click', () => modal.style.display = 'none');
    modal.addEventListener('click', e => {
      if (e.target === modal) modal.style.display = 'none';
    });
  }
})();
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

  // Cupom listener
  const btnApply = document.querySelector('.btn-apply');
  if (btnApply) {
    btnApply.addEventListener('click', async () => {
      const input = document.getElementById('cupom');
      const code = input.value.trim();
      if (!code) return;

      btnApply.textContent = '...';
      btnApply.disabled = true;

      try {
        const disc = await getCupomDiscount(code);
        if (disc > 0) {
          currentDiscount = disc;
          alert(`Cupom ${code.toUpperCase()} aplicado com sucesso! ${disc}% de desconto.`);
        } else {
          currentDiscount = 0;
          alert('Cupom inválido ou expirado.');
        }
        renderSummary();
      } catch (e) {
        console.error(e);
        alert('Erro ao validar cupom.');
      } finally {
        btnApply.textContent = 'Aplicar';
        btnApply.disabled = false;
      }
    });
  }
})();

// Initialize the page
renderSummary();
startRotation();
savelead(STOREID, 'AddToCart');

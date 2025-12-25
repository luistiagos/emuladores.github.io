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

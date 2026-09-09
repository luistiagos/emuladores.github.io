function isValidPhone(phone) {
  if (!phone) return false;

  const trimmed = phone.trim();

  // Mesmo padrão que usamos no MySQL:
  // (DD) 9XXXX-XXXX
  const regex = /^\([0-9]{2}\) [0-9]{5}-[0-9]{4}$/;

  return regex.test(trimmed);
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
    // `message` pode ser uma string OU um objeto Error (vários callers passam o erro).
    var err = message;
    var msgText = (err && err.message) ? err.message : String(message);
    var stack = (err && err.stack) ? String(err.stack) : null;

    var fields = {
        file: file,
        method: method,
        message: msgText,
        user_agent: navigator.userAgent || '',
        platform: navigator.platform || '',
        screen: (screen.width || '') + 'x' + (screen.height || ''),
        page_url: window.location.href || '',
        project: 'emuladores.github.io'
    };

    var ENDPOINT = 'https://digitalstoregames.pythonanywhere.com/logErr';

    // Fallback histórico: GET por querystring (comportamento de sempre, sem logs).
    function sendGet() {
        try {
            var params = new URLSearchParams(fields);
            fetch(ENDPOINT + '?' + params.toString());
        } catch (e) { /* noop */ }
    }

    // Novo: POST com o stacktrace inteiro em `logs`. Em QUALQUER falha (rede,
    // 405 antes do deploy do backend, etc.) cai pro GET — nada deixa de logar.
    try {
        var payload = Object.assign({}, fields);
        if (stack) { payload.logs = [stack]; }
        fetch(ENDPOINT, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
            keepalive: true
        }).then(function (res) {
            if (!res || !res.ok) sendGet();
        }).catch(sendGet);
    } catch (e) {
        sendGet();
    }
}

function showSpinnerLoader() {
    document.getElementById("spinner-loader").style.display = "flex";
}

function hideSpinnerLoader() {
    document.getElementById("spinner-loader").style.display = "none";
}

function showSpinner() {
    document.getElementById("spinner").style.display = "flex";
}

function hideSpinner() {
    document.getElementById("spinner").style.display = "none";
}

// ---------------------------------------------------------------------------
// E-mail: saneamento e sugestão de domínio.
// Espelha mysite/utilshelper.py (normalize_email / EMAIL_REGEX /
// sugerir_dominio_email). Os dois lados PRECISAM concordar: o backend normaliza
// o que grava, e aqui é onde o cliente ainda consegue corrigir.
// Ver docs/modules/area-membros/bugs/
// 2026-09-08-recuperar-acesso-email-nao-encontrado.md
// ---------------------------------------------------------------------------

// Recusa ponto final, ponto duplo e rótulo vazio -- a regex antiga
// (/^[^\s@]+@[^\s@]+\.[^\s@]+$/) aceitava os três: em 'gmail.com.' o último
// grupo casava 'com.', e o e-mail ia gravado com o ponto.
var EMAIL_REGEX_ESTRITA =
    /^[a-zA-Z0-9_%+-]+(?:\.[a-zA-Z0-9_%+-]+)*@(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/;

// Os 19 domínios que respondem por 36.886 das 37.067 compras aprovadas medidas
// em produção. Lista curta de propósito: quanto maior, maior a chance de um
// domínio corporativo legítimo cair perto de um popular e virar sugestão errada.
var EMAIL_DOMINIOS_CANONICOS = [
    'gmail.com', 'hotmail.com', 'outlook.com', 'yahoo.com.br', 'yahoo.com',
    'live.com', 'icloud.com', 'outlook.com.br', 'hotmail.com.br', 'bol.com.br',
    'msn.com', 'uol.com.br', 'ymail.com', 'terra.com.br', 'globo.com',
    'ig.com.br', 'me.com', 'protonmail.com', 'gmail.com.br',
    // Provedores REAIS que o sugeridor confundia com os populares: sem eles
    // aqui, 'aroncesar.ac@email.com' (endereco legitimo) virava sugestao de
    // gmail.com, e 'g4lyrmtmp@mozmail.com' (mascara do Firefox Relay) virava
  // sugestao de hotmail.com.
    'mail.com', 'email.com', 'mozmail.com'
];

// Saneia SEM adivinhar: só remove lixo que não muda a identidade.
// 'gmail.con' continua 'gmail.con' -- trocar domínio é palpite, e palpite errado
// manda acesso pago para a caixa de outra pessoa. A sugestão é separada, e o
// cliente confirma.
function normalizeEmail(valor) {
    if (!valor) { return ''; }
    var e = String(valor)
        .replace(/[\u200B-\u200F\uFEFF]/g, '')
        .replace(/\u00A0/g, ' ')
        .trim()
        .toLowerCase();
    if (e.indexOf('mailto:') === 0) { e = e.slice(7); }
    e = e.replace(/\s+/g, '');
    e = e.replace(/^[.,;:!?'"<>()\[\]{}]+/, '').replace(/[.,;:!?'"<>()\[\]{}]+$/, '');
    var at = e.lastIndexOf('@');
    if (at < 0) { return e; }
    var local = e.slice(0, at).replace(/^\.+/, '').replace(/\.+$/, '');
    var dominio = e.slice(at + 1).replace(/\.{2,}/g, '.')
        .replace(/^[.-]+/, '').replace(/[.-]+$/, '');
    return local + '@' + dominio;
}

// Levenshtein com corte: devolve teto+1 assim que passa do teto.
function _distanciaEdicao(a, b, teto) {
    if (Math.abs(a.length - b.length) > teto) { return teto + 1; }
    var anterior = [], i, j;
    for (j = 0; j <= b.length; j++) { anterior[j] = j; }
    for (i = 1; i <= a.length; i++) {
        var atual = [i], menor = i;
        for (j = 1; j <= b.length; j++) {
            var custo = a.charAt(i - 1) === b.charAt(j - 1) ? 0 : 1;
            atual[j] = Math.min(anterior[j] + 1, atual[j - 1] + 1, anterior[j - 1] + custo);
            if (atual[j] < menor) { menor = atual[j]; }
        }
        if (menor > teto) { return teto + 1; }
        anterior = atual;
    }
    return anterior[b.length];
}

// Domínio canônico que o cliente PROVAVELMENTE quis digitar, ou null.
// Cobre os 128 quase-acertos medidos em produção (gmai.com, gmail.con,
// hotmail.con, gmail.com+letra solta). NÃO cobre erro no local part
// ('jaoo@gmail.com'), que é indistinguível de um endereço legítimo.
function sugerirDominioEmail(valor) {
    var e = normalizeEmail(valor);
    var at = e.lastIndexOf('@');
    if (at < 0) { return null; }
    var dominio = e.slice(at + 1);
    if (!dominio) { return null; }
    for (var k = 0; k < EMAIL_DOMINIOS_CANONICOS.length; k++) {
        if (EMAIL_DOMINIOS_CANONICOS[k] === dominio) { return null; }
    }
    var melhor = null, melhorDist = null, empatado = false;
    for (var i = 0; i < EMAIL_DOMINIOS_CANONICOS.length; i++) {
        var canonico = EMAIL_DOMINIOS_CANONICOS[i];
        // Teto 1 para domínio curto: em 'me.com' duas edições chegam em
        // qualquer coisa e a sugestão vira chute.
        var teto = canonico.length <= 8 ? 1 : 2;
        var dist = _distanciaEdicao(dominio, canonico, teto);
        if (dist > teto) { continue; }
        if (melhorDist === null || dist < melhorDist) {
            melhor = canonico; melhorDist = dist; empatado = false;
        } else if (dist === melhorDist) {
            empatado = true;
        }
    }
    // EMPATE NAO SUGERE. 'hamail.com' fica a 2 edicoes de gmail.com E de
    // hotmail.com; quem decidia era a ordem da lista, e ela escolhia gmail --
    // provavelmente errado. Sem desempate honesto, o certo e calar.
    if (melhor === null || empatado) { return null; }
    return e.slice(0, at) + '@' + melhor;
}

function validaEmail(inputEmail) {
    // Grava de volta o valor saneado: é ele que segue para o backend.
    var email = normalizeEmail(inputEmail.value);
    inputEmail.value = email;

    if (email.length == 0) {
        inputEmail.classList.add('invalid');
        inputEmail.nextElementSibling.textContent = 'Email obrigatório';
        alert('Email obrigatório');
        return false;
    }

    if (!EMAIL_REGEX_ESTRITA.test(email)) {
        inputEmail.classList.add('invalid');
        inputEmail.nextElementSibling.textContent = 'Email inválido';
        alert('Email inválido');
        return false;
    }

    // Sugere, nunca corrige sozinho: quem decide é o cliente.
    var sugestao = sugerirDominioEmail(email);
    if (sugestao) {
        var msg = 'Confirme seu e-mail' + '\n\n'
                + 'Voce digitou:      ' + email + '\n'
                + 'Voce quis dizer:   ' + sugestao + '\n\n'
                + 'OK usa ' + sugestao + '. Cancelar mantem o que voce digitou.';
        if (confirm(msg)) {
            email = sugestao;
            inputEmail.value = sugestao;
        }
    }

    inputEmail.classList.remove('invalid');
    inputEmail.nextElementSibling.textContent = 'Email';
    return true;
}

function formataTelefone(inputTelefone) {
    var telefone = inputTelefone.value;
    telefone = telefone.replace(/\D/g, '');
    telefone = telefone.replace(/^(?:55)?(\d{2})(\d{4,5})(\d{4})$/,'($1) $2-$3');
    inputTelefone.value = telefone;
}

function sleep(time) {
    return new Promise((resolve)=>setTimeout(resolve, time));
}

function efetuarPagamento(email, telefone, sid, cupom=undefined) {
    try {
        efetuarPagamento1(email, telefone, sid, cupom);
    } catch (error) {
        try {
            logError('utils.js', 'efetuarPagamento', error);
        } catch(error) {
            console.log(error);
        }
    
        setTimeout(() => {
            efetuarPagamento(email, telefone, sid, cupom);
        }, 500);
    }
}

function efetuarPagamentoTest(storeid, email, telefone, sid, cupom=undefined) {
    try {
        createMLlink_test(storeid, email, telefone, sid, cupom);
    } catch (error) {
        try {
            logError('utils.js', 'efetuarPagamento', error);
        } catch(error) {
            console.log(error);
        }
    
        setTimeout(() => {
            efetuarPagamentoTest(storeid, email, telefone, sid, cupom);
        }, 500);
    }
}

async function getCupomDiscount(cupom, productid=undefined) {
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

async function createMLlink_test(storeid, email, telefone, sid, cupom=undefined) {
    var urlServico = 'https://digitalstoregames.pythonanywhere.com/createMLlink_test?storeid=' + storeid;
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
        hideSpinner();
    }
}

async function efetuarPagamento1(email, telefone, sid, cupom=undefined) {
    var urlServico = 'https://digitalstoregames.pythonanywhere.com/createMLlink2?email=' + encodeURIComponent(email) + '&sid=' + encodeURIComponent(sid);
    var fbp = getCookie('_fbp');
    var fbc = getCookie('_fbc');
    
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
        hideSpinner();
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
    document.getElementById("inner_spinner").style.display = "none";
    document.getElementById("linkConfirmacao").innerHTML = 
    '<a href="' + url + '" class="w-full button hover:opacity-75 next-button font-bold p-4 text-white text-base rounded text-center uppercase" style="background-color: #5271ff;">Confirmar</a>';
    document.getElementById("linkConfirmacao").style.display = "block";
}

function savelead(storeid, status=undefined, email=undefined, telefone=undefined) {
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
    var storeid = (typeof STOREID !== 'undefined') ? STOREID : '';
    var urlServico = 'https://digitalstoregames.pythonanywhere.com/fbPixel?event=' + encodeURIComponent(event) + '&productid=' + encodeURIComponent(productid) + '&storeid=' + storeid;
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


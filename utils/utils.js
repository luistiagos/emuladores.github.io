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

function validaEmail(inputEmail) {
    var email = inputEmail.value.trim();
    if (email.length == 0) {
        inputEmail.classList.add('invalid');
        inputEmail.nextElementSibling.textContent = 'Email obrigatório';
        alert('Email obrigatório');
        return false;
    }

     // Regular expression for a valid email address
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        inputEmail.classList.add('invalid');
        inputEmail.nextElementSibling.textContent = 'Email inválido';
        alert('Email inválido');
        return false;
    }

    inputEmail.classList.remove('invalid');
    inputEmail.nextElementSibling.textContent = 'Email';
    return true;
}

function formataTelefone(inputTelefone) {
    var telefone = inputTelefone.value;
    telefone = telefone.replace(/\D/g, '');
    telefone = telefone.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3');
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

async function fbPixelRequest(event, productid) {
    var urlServico = 'https://digitalstoregames.pythonanywhere.com/fbPixel?event=' + encodeURIComponent(event) + '&productid=' + encodeURIComponent(productid);
    var fbp = getCookie('_fbp');
    var fbc = getCookie('_fbc');

    if (fbp) {
        urlServico += '&fbp=' + encodeURIComponent(fbp);
    }
    if (fbc) {
        urlServico += '&fbc=' + fbc;
    }

    const response = await fetch(urlServico);
    const data = await response.text();
    return data;
}


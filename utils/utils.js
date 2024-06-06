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

function efetuarPagamento(email, telefone, sid) {
    try {
        efetuarPagamento1(email, telefone, sid);
    } catch (error) {
        try {
            logError('utils.js', 'efetuarPagamento', error);
        } catch(error) {
            console.log(error);
        }

        setTimeout(() => {
            efetuarPagamento2(email, sid)
        }, 500);
    }
}

function efetuarPagamento1(email, telefone, sid) {
    var urlServico = 'https://digitalstoregames.pythonanywhere.com/createMLlink?email=' + encodeURIComponent(email) + '&sid=' + encodeURIComponent(sid);
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
    
    fetch(urlServico).then(function(response) {
        return response.text();
    }).then(function(data) {
        var urlRetornada = data;
        console.log(urlRetornada);
        window.location.href = urlRetornada;
    }).catch(function(error) {
        logError('utils.js', 'efetuarPagamento', error);
        hideSpinner();
        console.log(error);
        sleep(500).then(()=>{
            efetuarPagamento(email, telefone, sid);
        });
    });
}

function efetuarPagamento2(email, sid) {
    var urlServico = 'https://digitalstoregames.pythonanywhere.com/createMLlink?email=' + encodeURIComponent(email) + '&sid=' + encodeURIComponent(sid);
    
    fetch(urlServico).then(function(response) {
        return response.text();
    }).then(function(data) {
        var urlRetornada = data;
        console.log(urlRetornada);
        window.location.href = urlRetornada;
    }).catch(function(error) {
        logError('utils.js', 'efetuarPagamento', error);
        hideSpinner();
        console.log(error);
        sleep(500).then(()=>{
            efetuarPagamento2(email, telefone, sid);
        });
    });
}



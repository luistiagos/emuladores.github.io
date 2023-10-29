function logError(file, method, message) {
    // Montar a URL do serviço REST com os parâmetros do formulário
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
    var email = inputEmail.value;
    //var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (email.length == 0) {
      inputEmail.classList.add('invalid');
      inputEmail.nextElementSibling.textContent = 'Email obrigatório';
      alert('Email obrigatório');
      return false;
    }
    /*
    if (!emailRegex.test(email)) {
      inputEmail.classList.add('invalid');
      inputEmail.nextElementSibling.textContent = 'Email inválido';
      return false;
    }
    */
    inputEmail.classList.remove('invalid');
    inputEmail.nextElementSibling.textContent = 'Email';
    return true;
}

function formataTelefone(inputTelefone) {
    var telefone = inputTelefone.value;
    // Remove tudo que não é número
    telefone = telefone.replace(/\D/g, '');
    // Aplica a máscara (##) #####-####
    telefone = telefone.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3');
    inputTelefone.value = telefone;
}

function sleep(time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

function efetuarPagamento(email, telefone, sid) {
  // Montar a URL do serviço REST com os parâmetros do formulário
    var urlServico = 'https://digitalstoregames.pythonanywhere.com/createMLlink?email=' + encodeURIComponent(email) + '&telefone=' + encodeURIComponent(telefone) + '&sid=' + encodeURIComponent(sid);

    fetch(urlServico)
      .then(function(response) {
        return response.text();
      })
      .then(function(data) {
        // Obter a URL retornada pelo serviço
        //hideSpinner();
        var urlRetornada = data;        
        console.log(urlRetornada);
        window.location.href = urlRetornada;
      })
      .catch(function(error) {
        logError('utils.js', 'efetuarPagamento', error);
        hideSpinner();
        console.log(error);
        sleep(2000).then(()=>{
          efetuarPagamento(email, telefone, sid);
        });
      }); 
}

function efetuarPagamento2(email, telefone, sid) {
  // Montar a URL do serviço REST com os parâmetros do formulário
    var urlServico = 'https://digitalstoregames.pythonanywhere.com/createMPLink2?ids=' + encodeURIComponent(sid) + '&email=' + encodeURIComponent(email) + '&telefone=' + encodeURIComponent(telefone);

    fetch(urlServico)
      .then(function(response) {
        return response.text();
      })
      .then(function(data) {
        // Obter a URL retornada pelo serviço
        //hideSpinner();
        var urlRetornada = data;        
        console.log(urlRetornada);
        window.location.href = urlRetornada;
      })
      .catch(function(error) {
        logError('utils.js', 'efetuarPagamento', error);
        hideSpinner();
        console.log(error);
        sleep(2000).then(()=>{
          efetuarPagamento(email, telefone, sid);
        });
      }); 
}

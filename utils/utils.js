function showSpinner() {
    document.getElementById("spinner").style.display = "flex";
  }

  function hideSpinner() {
    document.getElementById("spinner").style.display = "none"; 
  }

function validaEmail(inputEmail) {
    var email = inputEmail.value;
    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (email.length == 0) {
      inputEmail.classList.add('invalid');
      inputEmail.nextElementSibling.textContent = 'Email obrigatório';
      return false;
    }
    if (!emailRegex.test(email)) {
      inputEmail.classList.add('invalid');
      inputEmail.nextElementSibling.textContent = 'Email inválido';
      return false;
    }
    
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

function efetuarPagamento(email, telefone, sid) {
  // Montar a URL do serviço REST com os parâmetros do formulário
    var urlServico = 'https://digitalstoregames.pythonanywhere.com/createMLlink?email=' + encodeURIComponent(email) + '&telefone=' + encodeURIComponent(telefone) + '&sid=' + encodeURIComponent(sid);

    fetch(urlServico)
      .then(function(response) {
        return response.text();
      })
      .then(function(data) {
        // Obter a URL retornada pelo serviço
        hideSpinner();
        var urlRetornada = data;        
        console.log(urlRetornada);
        window.location.href = urlRetornada;
      })
      .catch(function(error) {
        hideSpinner();
        console.log(error);
        window.location = links[sid];
      }); 
}
const container = document.getElementById('produtos-container');
const loading = document.getElementById('loading');

function abrirModalProduto(prod) {
    // Imagem (ou carrossel)
    document.getElementById('modalImagem').innerHTML = `
      <img src="${prod.imagem || 'https://via.placeholder.com/800x300'}" alt="${prod.nome}" class="img-fluid w-100">
    `;
  
    // Título e subtítulo
    document.getElementById('modalTitulo').innerText = prod.nome;
    document.getElementById('modalSubtitulo').innerText = prod.subtitulo || 'O melhor conteúdo para você aproveitar!';
  
    // Benefícios
    const beneficiosEl = document.getElementById('modalBeneficios');
    beneficiosEl.innerHTML = '';
    (prod.beneficios || []).forEach(beneficio => {
      const li = document.createElement('li');
      li.innerHTML = `✅ ${beneficio}`;
      beneficiosEl.appendChild(li);
    });
  
    // Avaliação geral (ex: 4.5 estrelas)
    const avaliacaoEl = document.getElementById('modalAvaliacao');
    avaliacaoEl.innerHTML = '';

    if (typeof prod.avaliacaoGeral === 'number') {
        const estrelasInteiras = Math.floor(prod.avaliacaoGeral);
        const meiaEstrela = prod.avaliacaoGeral % 1 >= 0.5;
        const estrelas = '⭐'.repeat(estrelasInteiras) + (meiaEstrela ? '✬' : '');

        avaliacaoEl.innerHTML = `<strong>${estrelas}</strong> <span class="text-muted ms-2">(${prod.avaliacaoGeral.toFixed(1)} de 5)</span>`;
    }
  
    // Bônus/urgência
    const bonusEl = document.getElementById('modalBonus');
    if (prod.bonus) {
      bonusEl.textContent = prod.bonus;
      bonusEl.classList.remove('d-none');
    } else {
      bonusEl.classList.add('d-none');
    }
  
    // Botão Adquirir Agora
    const btn = document.getElementById('btnAdquirirAgora');
    btn.onclick = () => {
      alert(`Produto "${prod.nome}" adquirido!`);
      const modal = bootstrap.Modal.getInstance(document.getElementById('modalProduto'));
      modal.hide();
    };
  
    // Exibir modal
    const modal = new bootstrap.Modal(document.getElementById('modalProduto'));
    modal.show();
  }  


// URL do serviço Flask
fetch('https://digitalstoregames.pythonanywhere.com/products/member')
  .then(response => response.json())
  .then(produtos => {
    loading.classList.add('d-none');
    container.classList.remove('d-none');

    produtos.forEach(prod => {
        const col = document.createElement('div');
        col.className = 'col-md-6 col-lg-4';
      
        const card = document.createElement('div');
        card.className = 'product-card p-3 position-relative';
        if (!prod.adquirido) card.classList.add('locked');
      
        // Rótulo visual
        if (!prod.adquirido && prod.rotulo) {
          const badge = document.createElement('div');
          badge.className = 'badge-custom';
          badge.innerText = prod.rotulo;
          card.appendChild(badge);
        }
      
        const imagem = document.createElement('img');
        imagem.src = prod.imagem;
        imagem.alt = prod.nome;
        imagem.className = 'product-image mb-3';
      
        const titulo = document.createElement('div');
        titulo.className = 'product-title mb-1';
        titulo.innerText = prod.nome;
      
        const preco = document.createElement('div');
        preco.className = 'text-muted mb-2';
        preco.style.minHeight = '24px';

        if (!prod.adquirido) {
            if (prod.precoPromocional) {
              preco.innerHTML = `
                <span class="text-muted text-decoration-line-through me-2">R$ ${prod.preco}</span>
                <span class="text-danger fw-bold">R$ ${prod.precoPromocional}</span>
              `;
            } else {
              preco.innerText = `R$ ${prod.preco}`;
            }
        }
      
        const botao = document.createElement('button');
        botao.className = `btn w-100 ${prod.adquirido ? 'btn-access' : 'btn-purchase'}`;
        botao.innerText = prod.adquirido ? 'Acessar' : 'Quero Este';
        
        if (!prod.adquirido) {
            botao.addEventListener('click', () => abrirModalProduto(prod));
        }
          

        card.appendChild(imagem);
        card.appendChild(titulo);
        card.appendChild(preco);
        card.appendChild(botao);
      
        col.appendChild(card);
        container.appendChild(col);
      });
  })
  .catch(err => {
    loading.innerHTML = '<p class="text-danger">Erro ao carregar produtos.</p>';
    console.error(err);
  });

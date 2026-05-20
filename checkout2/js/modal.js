// Modal and gallery functionality
(function() {
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

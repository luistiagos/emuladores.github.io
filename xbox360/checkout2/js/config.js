const STOREID = 600000;
const BASE = {
  id: 'xbox360-retro',
  name: 'Plataforma Xbox 360',
  original_price: 299.00,
  price: 30.00
};
BASE.economy = BASE.original_price - BASE.price;

const ADDONS = {
  bumpSony_check: {
    id: 'sony',
    name: '4 Plataformas da Sony (PS1, PS2, PS3, PSP)',
    original_price: 49.90,
    price: 20.00
  },
  bumpNintendo_check: {
    id: 'nintendo',
    name: '11 Plataformas Nintendo',
    original_price: 39.90,
    price: 15.00
  },
  bumpSwitch_check: {
    id: 'switch',
    name: 'Plataforma Nintendo Switch',
    original_price: 69.90,
    price: 30.00
  },
  bumpOutros_check: {
    id: 'others',
    name: '14 Plataformas Diversas',
    original_price: 29.90,
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

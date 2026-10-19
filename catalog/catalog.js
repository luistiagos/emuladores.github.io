/**
 * XBOX & PS2 COMPANION INSPIRED GAME CATALOG
 * Digital Store Games - Catálogo de Jogos Premium
 * Architecture: Dedicated Platform SPA with Deduplication, Popularity Ranking, and 3D Game Boxes
 */

(function () {
  'use strict';

  // --------------------------------------------------------------------------
  // Configuration: Platforms & Metadata
  // --------------------------------------------------------------------------
  const API_ENDPOINT = 'https://emuladores.pythonanywhere.com/api/catalog/manifest';
  const WHATSAPP_NUMBER = '5541996260115';
  const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours
  const BATCH_SIZE = 48; // Infinite scroll chunk size

  const PLATFORMS = [
    {
      id: 'ps2',
      name: 'PlayStation 2',
      shortName: 'PS2',
      mnemonic: 'ps2',
      company: 'Sony',
      color: '#003791',
      accent: '#0072ce',
      headerBg: '#002666',
      caseClass: 'case-ps2',
      libretro: 'Sony_-_PlayStation_2',
      tagline: 'A maior e mais lendária biblioteca de jogos de todos os tempos',
      approxCount: '8.500+ Jogos Únicos',
    },
    {
      id: 'wii',
      name: 'Nintendo Wii',
      shortName: 'Wii',
      mnemonic: 'wii',
      company: 'Nintendo',
      color: '#00b2e3',
      accent: '#00e5ff',
      headerBg: '#f8fafc',
      caseClass: 'case-wii',
      libretro: 'Nintendo_-_Wii',
      tagline: 'Clássicos memoráveis e diversão com controle por movimento',
      approxCount: '1.200+ Jogos Únicos',
    },
    {
      id: 'ps3',
      name: 'PlayStation 3',
      shortName: 'PS3',
      mnemonic: 'ps3',
      company: 'Sony',
      color: '#1e1e24',
      accent: '#ff0033',
      headerBg: '#2b2b2b',
      caseClass: 'case-ps3',
      libretro: 'Sony_-_PlayStation_3',
      tagline: 'A era de ouro em alta definição e grandes narrativas cinematográficas',
      approxCount: '3.100+ Jogos Únicos',
    },
    {
      id: 'xbox360',
      name: 'Xbox 360',
      shortName: 'Xbox 360',
      mnemonic: 'xbox360',
      company: 'Microsoft',
      color: '#107c10',
      accent: '#52b043',
      headerBg: '#107c10',
      caseClass: 'case-xbox360',
      libretro: 'Microsoft_-_Xbox_360',
      tagline: 'Coleção completa dos maiores sucessos da geração Xbox 360',
      approxCount: '4.800+ Jogos Únicos',
    },
    {
      id: 'ps1',
      name: 'PlayStation 1',
      shortName: 'PS1',
      mnemonic: 'psx',
      company: 'Sony',
      color: '#3f4652',
      accent: '#00f0ff',
      headerBg: '#3f4652',
      caseClass: 'case-ps1',
      libretro: 'Sony_-_PlayStation',
      tagline: 'Os clássicos pioneiros em 32-bits que revolucionaram o mundo dos games',
      approxCount: '2.100+ Jogos Únicos',
    },
    {
      id: 'psp',
      name: 'PlayStation Portable',
      shortName: 'PSP',
      mnemonic: 'psp',
      company: 'Sony',
      color: '#1a1e28',
      accent: '#f5a623',
      headerBg: '#1a1e28',
      caseClass: 'case-psp',
      libretro: 'Sony_-_PlayStation_Portable',
      tagline: 'O melhor videogame portátil da Sony com gráficos surpreendentes',
      approxCount: '1.500+ Jogos Únicos',
    },
    {
      id: 'dreamcast',
      name: 'Sega Dreamcast',
      shortName: 'Dreamcast',
      mnemonic: 'dreamcast',
      company: 'Sega',
      color: '#e85d04',
      accent: '#ff9100',
      headerBg: '#f8fafc',
      caseClass: 'case-dreamcast',
      libretro: 'Sega_-_Dreamcast',
      tagline: 'O console inovador da Sega com arcades rápidos e inesquecíveis',
      approxCount: '1.900+ Jogos Únicos',
    },
    {
      id: 'switch',
      name: 'Nintendo Switch',
      shortName: 'Switch',
      mnemonic: 'switch',
      company: 'Nintendo',
      color: '#e60012',
      accent: '#ff334b',
      headerBg: '#e60012',
      caseClass: 'case-switch',
      libretro: 'Nintendo_-_Nintendo_Switch',
      tagline: 'Grandes sucessos modernos para jogar na TV ou em qualquer lugar',
      approxCount: '2.100+ Jogos Únicos',
    },
    {
      id: 'gamecube',
      name: 'Nintendo GameCube',
      shortName: 'GameCube',
      mnemonic: 'gamecube',
      company: 'Nintendo',
      color: '#6b5ce7',
      accent: '#a29bfe',
      headerBg: '#6b5ce7',
      caseClass: 'case-gamecube',
      libretro: 'Nintendo_-_GameCube',
      tagline: 'O cubo mágico da Nintendo com clássicos cultuados mundialmente',
      approxCount: '950+ Jogos Únicos',
    },
    {
      id: 'nds',
      name: 'Nintendo DS',
      shortName: 'NDS',
      mnemonic: 'nds',
      company: 'Nintendo',
      color: '#4a4e69',
      accent: '#00d2d3',
      headerBg: '#4a4e69',
      caseClass: 'case-nds',
      libretro: 'Nintendo_-_Nintendo_DS',
      tagline: 'A revolução das duas telas com milhares de opções criativas',
      approxCount: '2.400+ Jogos Únicos',
    },
    {
      id: '3ds',
      name: 'Nintendo 3DS',
      shortName: '3DS',
      mnemonic: '3ds',
      company: 'Nintendo',
      color: '#d63031',
      accent: '#ff7675',
      headerBg: '#d63031',
      caseClass: 'case-3ds',
      libretro: 'Nintendo_-_Nintendo_3DS',
      tagline: 'A evolução tridimensional portátil da Nintendo com gráficos ricos',
      approxCount: '900+ Jogos Únicos',
    },
    {
      id: 'snes',
      name: 'Super Nintendo',
      shortName: 'SNES',
      mnemonic: 'snes',
      company: 'Nintendo',
      color: '#833471',
      accent: '#b53471',
      headerBg: '#833471',
      caseClass: 'case-snes',
      libretro: 'Nintendo_-_Super_Nintendo_Entertainment_System',
      tagline: 'A obra-prima dos 16-bits com a época de ouro das aventuras 2D',
      approxCount: '2.600+ Jogos Únicos',
    },
    {
      id: 'n64',
      name: 'Nintendo 64',
      shortName: 'N64',
      mnemonic: 'n64',
      company: 'Nintendo',
      color: '#009432',
      accent: '#2ed573',
      headerBg: '#009432',
      caseClass: 'case-n64',
      libretro: 'Nintendo_-_Nintendo_64',
      tagline: 'A transição pioneira para mundos 3D com clássicos épicos',
      approxCount: '780+ Jogos Únicos',
    },
    {
      id: 'megadrive',
      name: 'Mega Drive / Genesis',
      shortName: 'Mega Drive',
      mnemonic: 'megadrive',
      company: 'Sega',
      color: '#2c3e50',
      accent: '#3498db',
      headerBg: '#2c3e50',
      caseClass: 'case-megadrive',
      libretro: 'Sega_-_Mega_Drive_-_Genesis',
      tagline: 'A velocidade de Sonic e a atitude marcante dos 16-bits da Sega',
      approxCount: '1.200+ Jogos Únicos',
    },
    {
      id: 'saturn',
      name: 'Sega Saturn',
      shortName: 'Saturn',
      mnemonic: 'saturn',
      company: 'Sega',
      color: '#2f3542',
      accent: '#ffa502',
      headerBg: '#2f3542',
      caseClass: 'case-saturn',
      libretro: 'Sega_-_Saturn',
      tagline: 'O poder incomparável dos jogos de luta 2D e clássicos 3D da Sega',
      approxCount: '280+ Jogos Únicos',
    },
    {
      id: 'xbox',
      name: 'Original Xbox',
      shortName: 'Xbox Clássico',
      mnemonic: 'xbox',
      company: 'Microsoft',
      color: '#0e5a0e',
      accent: '#2ecc71',
      headerBg: '#0e5a0e',
      caseClass: 'case-xbox',
      libretro: 'Microsoft_-_Xbox',
      tagline: 'O primeiro console da Microsoft que inaugurou o legado Xbox',
      approxCount: '1.200+ Jogos Únicos',
    },
    {
      id: 'ps2_futebol',
      name: 'PS2 Patchs Futebol',
      shortName: 'Futebol & Bomba Patch',
      mnemonic: 'ps2',
      filterCustom: 'futebol',
      company: 'Mods & Patchs',
      color: '#1e3799',
      accent: '#4a69bd',
      headerBg: '#1e3799',
      caseClass: 'case-ps2',
      libretro: 'Sony_-_PlayStation_2',
      tagline: 'Bomba Patch, PES atualizados, Brasileirão, Clubes Mundiais e edições raras',
      approxCount: '450+ Jogos Únicos',
    },
    {
      id: 'ps2patchs_gta_games',
      name: 'PS2 Patchs GTA',
      shortName: 'GTA Mods & Patchs',
      mnemonic: 'ps2',
      filterCustom: 'gta',
      company: 'Mods & Patchs',
      color: '#e55039',
      accent: '#eb2f06',
      headerBg: '#e55039',
      caseClass: 'case-ps2',
      libretro: 'Sony_-_PlayStation_2',
      tagline: 'Modificações lendárias de GTA: Rio de Janeiro, Tropa de Elite, Dragon Ball e mais',
      approxCount: '140+ Jogos Únicos',
    },
  ];

  // --------------------------------------------------------------------------
  // Major Hit Franchises for Popularity Scoring
  // --------------------------------------------------------------------------
  const MASTER_HITS = [
    // GTA Franchise
    'san andreas', 'grand theft auto', 'vice city', 'gta',
    // Sony Flagship
    'god of war', 'shadow of the colossus', 'gran turismo', 'the last of us', 'uncharted',
    // Survival Horror
    'resident evil 4', 'resident evil', 'silent hill 2', 'silent hill',
    // Racing Legends
    'need for speed', 'most wanted', 'underground 2', 'underground', 'carbon', 'midnight club', 'burnout',
    // Anime & Fighting Hits
    'budokai tenkaichi 3', 'dragon ball', 'shippuden', 'naruto', 'shaolin monks', 'mortal kombat', 'tekken', 'def jam', 'street fighter',
    // Football & Brazilian Favorites
    'bomba patch', 'pes 20', 'winning eleven', 'fifa', 'downhill domination',
    // Action / Cult Hits
    'bully', 'black', 'devil may cry 3', 'devil may cry', 'metal gear', 'kingdom hearts', 'final fantasy x', 'hit & run', 'simpsons',
    // Nintendo Hits
    'mario kart', 'super mario galaxy', 'super mario', 'twilight princess', 'zelda', 'smash bros', 'pokemon', 'donkey kong',
    // Microsoft Hits
    'halo 3', 'halo', 'gears of war', 'forza', 'red dead redemption'
  ];

  const POPULAR_KEYWORDS = [
    'grand theft auto', 'gta', 'san andreas', 'vice city', 'liberty city',
    'god of war', 'resident evil', 'biohazard', 'silent hill',
    'need for speed', 'underground', 'most wanted', 'carbon', 'prostreet',
    'dragon ball', 'budokai', 'tenkaichi', 'naruto', 'shippuden',
    'mortal kombat', 'street fighter', 'tekken', 'king of fighters', 'kof',
    'bomba patch', 'pes 20', 'pro evolution soccer', 'winning eleven', 'fifa',
    'crash bandicoot', 'crash', 'spyro', 'tony hawk',
    'metal gear', 'mgs', 'snake eater', 'devil may cry', 'dmc',
    'shadow of the colossus', 'kingdom hearts', 'final fantasy',
    'black', 'bully', 'def jam', 'burnout', 'midnight club',
    'call of duty', 'medal of honor', 'battlefield',
    'super mario', 'mario kart', 'mario galaxy', 'zelda', 'the legend of zelda',
    'donkey kong', 'pokemon', 'pokémon', 'metroid', 'kirby', 'smash bros',
    'halo', 'gears of war', 'forza', 'fable', 'left 4 dead',
    'red dead', 'red dead redemption', 'the last of us', 'uncharted',
    'spider-man', 'spiderman', 'batman', 'arkham', 'castlevania',
    'gran turismo', 'guitar hero', 'rock band', 'sonic the hedgehog',
    'sonic', 'tomb raider', 'lara croft', 'assassin', 'monster hunter',
    'persona', 'yakuza', 'dark souls', 'demon souls', 'max payne',
    'god hand', 'downhill domination', 'mx vs atv', 'def jam fight for ny',
    'ben 10', 'simpsons', 'hit & run', 'yu-gi-oh', 'lego'
  ];

  // --------------------------------------------------------------------------
  // Application State
  // --------------------------------------------------------------------------
  const state = {
    isHubMode: false,
    currentPlatform: null,
    groupedGames: [],     // Unique games (deduplicated)
    filteredGames: [],
    renderedCount: 0,
    searchQuery: '',
    selectedRegion: 'all', // all | br | usa | eur | jp
    sortBy: 'popular',     // 'popular' (default) | 'az'
    viewMode: 'grid',      // grid | list
    isLoading: false,
    selectedGame: null,
  };

  // --------------------------------------------------------------------------
  // IndexedDB Cache Layer
  // --------------------------------------------------------------------------
  const DB_NAME = 'DSG_Catalog_DB_v2';
  const DB_STORE = 'platforms';

  function openDatabase() {
    return new Promise((resolve) => {
      if (!window.indexedDB) return resolve(null);
      const req = indexedDB.open(DB_NAME, 1);
      req.onupgradeneeded = (e) => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains(DB_STORE)) {
          db.createObjectStore(DB_STORE, { keyPath: 'id' });
        }
      };
      req.onsuccess = (e) => resolve(e.target.result);
      req.onerror = () => resolve(null);
    });
  }

  async function getCachedPlatform(platformId) {
    try {
      const db = await openDatabase();
      if (!db) return null;
      return new Promise((resolve) => {
        const tx = db.transaction(DB_STORE, 'readonly');
        const store = tx.objectStore(DB_STORE);
        const req = store.get(platformId);
        req.onsuccess = () => {
          const res = req.result;
          if (res && (Date.now() - res.timestamp < CACHE_TTL_MS)) {
            resolve(res.data);
          } else {
            resolve(null);
          }
        };
        req.onerror = () => resolve(null);
      });
    } catch {
      return null;
    }
  }

  async function setCachedPlatform(platformId, data) {
    try {
      const db = await openDatabase();
      if (!db) return;
      const tx = db.transaction(DB_STORE, 'readwrite');
      const store = tx.objectStore(DB_STORE);
      store.put({ id: platformId, timestamp: Date.now(), data });
    } catch (e) {
      console.warn('Failed to cache in IndexedDB:', e);
    }
  }

  // --------------------------------------------------------------------------
  // Title Parsing & Deduplication Comparison Key
  // --------------------------------------------------------------------------
  function getBaseTitle(raw) {
    if (!raw) return 'Jogo sem título';
    let title = raw.includes('/') || raw.includes('\\')
      ? raw.substring(Math.max(raw.lastIndexOf('/'), raw.lastIndexOf('\\')) + 1)
      : raw;
    return title
      .replace(/\.(iso|rvz|chd|cso|wbfs|nsp|xci|nsz|rar|7z|zip|bin|cue|gdi|cdi|sfc|smc|z64|n64|md|gen|pkg)$/i, '')
      .replace(/^[A-Z]{3,4}[-_][0-9]{3,5}\.[0-9]{2}\./i, '')
      .replace(/\[[0-9A-Fa-f]{16}\]/g, '')
      .replace(/\s*\(.*?\)/g, '')
      .replace(/\s*\[.*?\]/g, '')
      .replace(/^[-\s_]+|[-\s_]+$/g, '')
      .replace(/\s{2,}/g, ' ')
      .trim();
  }

  function getComparisonKey(baseTitle) {
    let key = (baseTitle || '').toLowerCase();

    // Standardize common localizations
    key = key.replace(/\bbrasil\b/g, 'brazil');
    key = key.replace(/\ba era do gelo\b/g, 'ice age');
    key = key.replace(/\bac\b/g, "assassin's creed");

    // Convert Roman numerals
    key = key.replace(/\bxv\b/g, '15')
      .replace(/\bxiv\b/g, '14')
      .replace(/\bxiii\b/g, '13')
      .replace(/\bxii\b/g, '12')
      .replace(/\bxi\b/g, '11')
      .replace(/\bx\b/g, '10')
      .replace(/\bix\b/g, '9')
      .replace(/\bviii\b/g, '8')
      .replace(/\bvii\b/g, '7')
      .replace(/\bvi\b/g, '6')
      .replace(/\biv\b/g, '4')
      .replace(/\biii\b/g, '3')
      .replace(/\bii\b/g, '2')
      .replace(/\bv\b/g, '5');

    // Remove region suffixes
    key = key.replace(/\b(aus|usa|eur|pal|uk|jp|jpn|rf|regionfree|region\s+free|asia|ntsc|kor|chn|eng|spa|ger|fra|ita|rus|por|free)$/g, '').trim();

    // Alphanumeric only
    return key.replace(/[^a-z0-9]/g, '');
  }

  function extractRegion(str) {
    if (!str) return '';
    if (/\b(Brazil|Brasil|PT-BR|Dublado|Legendado|Traduzido|Bomba Patch)\b/i.test(str)) return 'Brasil';
    if (/\b(USA|US)\b/i.test(str)) return 'USA';
    if (/\b(Europe|En,Fr,De|En,Es,It|PAL)\b/i.test(str)) return 'Europa';
    if (/\b(Japan|JP|NTSC-J)\b/i.test(str)) return 'Japão';
    return '';
  }

  function extractDisc(str) {
    const discMatch = str.match(/\((Disc|Disk|DVD|CD)\s*([0-9]+)[^)]*\)/i) || str.match(/\[(Disc|Disk|DVD|CD)\s*([0-9]+)[^\]]*\]/i);
    return discMatch ? `Disco ${discMatch[2]}` : '';
  }

  function formatBytes(bytes) {
    if (!bytes) return '';
    if (typeof bytes === 'string' && isNaN(Number(bytes))) {
      return bytes;
    }
    const n = Number(bytes);
    if (isNaN(n) || n <= 0) return '';
    const gb = n / (1024 * 1024 * 1024);
    if (gb >= 1) return `${gb.toFixed(2)} GB`;
    const mb = n / (1024 * 1024);
    if (mb >= 1) return `${mb.toFixed(0)} MB`;
    return `${Math.round(n / 1024)} KB`;
  }

  function resolveCoverUrl(entry, platform) {
    let url = entry.cover2d_url || entry.image_url;
    if (url && typeof url === 'string') {
      url = url.trim();
      if (url.startsWith('http://')) {
        url = url.replace(/^http:\/\//i, 'https://');
      }
      return url;
    }

    if (platform && platform.libretro) {
      const baseName = (entry.path || '').replace(/\.[a-zA-Z0-9]+$/, '').trim();
      if (baseName) {
        return `https://raw.githubusercontent.com/libretro-thumbnails/${platform.libretro}/master/Named_Boxarts/${encodeURIComponent(baseName)}.png`;
      }
    }

    return null;
  }

  function getCoverKey(url) {
    if (!url || typeof url !== 'string') return null;
    try {
      const clean = url.split('#')[0].split('?')[0];
      const fileName = decodeURIComponent(clean.substring(clean.lastIndexOf('/') + 1));
      if (!fileName) return null;
      const base = getBaseTitle(fileName);
      const comp = getComparisonKey(base);
      return comp || fileName.toLowerCase().replace(/[^a-z0-9]/g, '');
    } catch {
      return url.toLowerCase().replace(/[^a-z0-9]/g, '');
    }
  }

  // --------------------------------------------------------------------------
  // Popularity Calculation Engine
  // --------------------------------------------------------------------------
  function computePopularityScore(displayTitle, rawPath, versionsCount, hasCover, isPTBR) {
    let score = 0;
    const lower = `${displayTitle} ${rawPath}`.toLowerCase();

    // 1. Master Hit matching (Top-tier boost)
    for (let i = 0; i < MASTER_HITS.length; i++) {
      const hit = MASTER_HITS[i];
      if (lower.includes(hit)) {
        score += Math.max(500 - i * 6, 250);
        break;
      }
    }

    // 2. Franchise matching
    for (let i = 0; i < POPULAR_KEYWORDS.length; i++) {
      const kw = POPULAR_KEYWORDS[i];
      if (lower.includes(kw)) {
        score += Math.max(250 - i * 3, 80);
        break;
      }
    }

    // 3. Bonus for multiple versions / multi-disc (indicates high demand/major retail release)
    score += Math.min(versionsCount * 12, 60);

    // 4. Bonus for verified official cover art
    if (hasCover) score += 50;

    // 5. Bonus for PT-BR localized edition
    if (isPTBR) score += 40;

    // 6. Heavy penalties for non-commercial or test versions
    if (/\b(demo|taikenban|trial|sample)\b/i.test(lower)) score -= 500;
    if (/\b(beta|proto|prototype)\b/i.test(lower)) score -= 400;
    if (/\b(promo|kiosk|preview|bonus disc|not for sale)\b/i.test(lower)) score -= 300;

    return score;
  }

  // --------------------------------------------------------------------------
  // DOM Elements References
  // --------------------------------------------------------------------------
  let dom = {};

  function cacheDom() {
    dom = {
      header: document.querySelector('.catalog-header'),
      headerTop: document.querySelector('.header-top'),
      brandSection: document.querySelector('.brand-section'),
      brandTitle: document.querySelector('.brand-title'),
      brandBadge: document.querySelector('.brand-badge'),
      brandSubtitle: document.querySelector('.brand-subtitle'),
      headerActions: document.querySelector('.header-actions'),
      bannerCard: document.getElementById('bannerCard'),
      bannerTitle: document.getElementById('bannerTitle'),
      bannerTagline: document.getElementById('bannerTagline'),
      bannerTotalGames: document.getElementById('bannerTotalGames'),
      bannerWithCovers: document.getElementById('bannerWithCovers'),
      toolbar: document.querySelector('.catalog-toolbar'),
      searchInput: document.getElementById('searchInput'),
      searchClearBtn: document.getElementById('searchClearBtn'),
      regionChips: document.getElementById('regionChips'),
      sortSelect: document.getElementById('sortSelect'),
      viewGridBtn: document.getElementById('viewGridBtn'),
      viewListBtn: document.getElementById('viewListBtn'),
      resultsCountText: document.getElementById('resultsCountText'),
      gamesContainer: document.getElementById('gamesContainer'),
      scrollSentinel: document.getElementById('scrollSentinel'),
      refreshBtn: document.getElementById('refreshBtn'),
      modalBackdrop: document.getElementById('gameModal'),
      modalCloseBtn: document.getElementById('modalCloseBtn'),
      modalBoxArt: document.getElementById('modalBoxArt'),
      modalTitle: document.getElementById('modalTitle'),
      modalConsoleBadge: document.getElementById('modalConsoleBadge'),
      modalTags: document.getElementById('modalTags'),
      modalFormat: document.getElementById('modalFormat'),
      modalSize: document.getElementById('modalSize'),
      modalRegion: document.getElementById('modalRegion'),
      modalGenre: document.getElementById('modalGenre'),
      modalFilename: document.getElementById('modalFilename'),
      modalVersionsSection: document.getElementById('modalVersionsSection'),
      modalVersionsList: document.getElementById('modalVersionsList'),
      modalWhatsAppBtn: document.getElementById('modalWhatsAppBtn'),
      modalCopyBtn: document.getElementById('modalCopyBtn'),
      toast: document.getElementById('toast'),
    };
  }

  // --------------------------------------------------------------------------
  // Navigation & URL Routing
  // --------------------------------------------------------------------------
  function detectPlatformContext() {
    // 1. Meta tag in HTML (e.g. in /catalog/ps2/index.html)
    const metaTag = document.querySelector('meta[name="default-platform"]');
    if (metaTag && metaTag.content) {
      const p = PLATFORMS.find((x) => x.id === metaTag.content.trim().toLowerCase());
      if (p) return { platform: p, isDedicated: true };
    }

    // 2. Pathname segment: e.g. /catalog/ps2 or /catalog/ps2/
    const path = window.location.pathname.toLowerCase();
    for (const p of PLATFORMS) {
      if (path.includes(`/catalog/${p.id}/`) || path.endsWith(`/catalog/${p.id}`) || path.endsWith(`/${p.id}/`) || path.endsWith(`/${p.id}`)) {
        return { platform: p, isDedicated: true };
      }
    }

    // 3. Search query: ?platform=ps2
    const params = new URLSearchParams(window.location.search);
    const queryPlat = params.get('platform') || params.get('console');
    if (queryPlat) {
      const p = PLATFORMS.find((x) => x.id === queryPlat.toLowerCase());
      if (p) return { platform: p, isDedicated: true };
    }

    // 4. Hash: #ps2
    const hash = window.location.hash.replace(/^[#/]+/, '').toLowerCase();
    if (hash) {
      const p = PLATFORMS.find((x) => x.id === hash);
      if (p) return { platform: p, isDedicated: true };
    }

    // If at root /catalog/ without specific platform, it is the Hub Mode
    return { platform: null, isDedicated: false };
  }

  // --------------------------------------------------------------------------
  // Hub Mode (Central Console Picker)
  // --------------------------------------------------------------------------
  function renderHubMode() {
    state.isHubMode = true;
    document.title = 'Catálogo Oficial de Jogos - Selecione uma Plataforma';

    // Hide toolbar and banner
    if (dom.bannerCard) dom.bannerCard.parentElement.style.display = 'none';
    if (dom.toolbar) dom.toolbar.style.display = 'none';

    // Update Header
    if (dom.brandTitle) {
      dom.brandTitle.innerHTML = 'Catálogo de Jogos <span class="brand-badge">Hub</span>';
    }
    if (dom.brandSubtitle) {
      dom.brandSubtitle.textContent = 'Selecione uma plataforma para explorar o catálogo completo';
    }

    // Render Platform Cards Grid
    dom.gamesContainer.className = 'hub-grid';
    dom.gamesContainer.innerHTML = PLATFORMS.map((p) => `
      <a href="./${p.id}/" class="hub-card" style="--card-accent: ${p.accent}; --card-glow: ${p.accent}33; --card-border: ${p.accent}55;">
        <div class="hub-card-header">
          <div class="hub-card-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="2" y="6" width="20" height="12" rx="3"></rect>
              <path d="M6 12h4m-2-2v4m7-2h.01m3 0h.01"></path>
            </svg>
          </div>
          <span class="hub-card-badge">${escapeHtml(p.approxCount)}</span>
        </div>
        <div class="hub-card-title">${escapeHtml(p.name)}</div>
        <div class="hub-card-desc">${escapeHtml(p.tagline)}</div>
        <div class="hub-card-footer">
          <span>Abrir Catálogo Oficial</span>
          <span>→</span>
        </div>
      </a>
    `).join('');

    if (dom.scrollSentinel) dom.scrollSentinel.style.display = 'none';
  }

  // --------------------------------------------------------------------------
  // Dedicated Platform Setup
  // --------------------------------------------------------------------------
  function applyPlatformTheme(platform) {
    document.documentElement.style.setProperty('--console-primary', platform.accent);
    document.documentElement.style.setProperty('--console-glow', `${platform.accent}44`);
    document.documentElement.style.setProperty('--console-border', `${platform.accent}66`);
    document.documentElement.style.setProperty('--console-header-bg', platform.headerBg);

    // Update Header for Dedicated Mode
    if (dom.brandTitle) {
      dom.brandTitle.innerHTML = `Catálogo ${escapeHtml(platform.name)} <span class="brand-badge">${escapeHtml(platform.shortName)}</span>`;
    }
    if (dom.brandSubtitle) {
      dom.brandSubtitle.textContent = 'Acervo oficial com capas em alta definição';
    }

    // Add "Back to Hub" link in header actions if not already present
    let backBtn = document.getElementById('backHubBtn');
    if (!backBtn && dom.headerActions) {
      backBtn = document.createElement('a');
      backBtn.id = 'backHubBtn';
      const isSubFolder = /\/catalog\/[^\/]+\/?$/i.test(window.location.pathname) && !/\/catalog\/(index\.html)?$/i.test(window.location.pathname);
      backBtn.href = isSubFolder ? '../' : './';
      backBtn.innerHTML = `
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <line x1="19" y1="12" x2="5" y2="12"></line>
          <polyline points="12 19 5 12 12 5"></polyline>
        </svg>
        <span>Outros Catálogos</span>
      `;
      dom.headerActions.insertBefore(backBtn, dom.headerActions.firstChild);
    }

    // Update Banner Info
    if (dom.bannerTitle) dom.bannerTitle.textContent = platform.name;
    if (dom.bannerTagline) dom.bannerTagline.textContent = platform.tagline;
    if (dom.searchInput) dom.searchInput.placeholder = `Buscar entre ${platform.approxCount} em ${platform.shortName}...`;

    document.title = `Catálogo Oficial ${platform.name} - Digital Store Games`;
  }

  // --------------------------------------------------------------------------
  // Fetch Games Data & Deduplication Grouping
  // --------------------------------------------------------------------------
  async function loadPlatformData(platform, forceRefresh = false) {
    state.isLoading = true;
    renderLoadingState();

    try {
      let rawEntries = null;

      // Check cache unless force refresh
      if (!forceRefresh) {
        rawEntries = await getCachedPlatform(platform.id);
      }

      if (!rawEntries) {
        const payload = {
          mnemonicos: [
            {
              name: platform.mnemonic,
              infos: ['image_url', 'cover2d_url', 'genre', 'players'],
            },
          ],
        };

        const resp = await fetch(API_ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        if (!resp.ok) {
          throw new Error(`Servidor retornou erro ${resp.status}`);
        }

        const data = await resp.json();
        rawEntries = data.entries || [];

        if (rawEntries.length > 0) {
          setCachedPlatform(platform.id, rawEntries);
        }
      }

      // Handle custom filters (e.g. ps2_futebol or ps2patchs_gta_games)
      let processed = rawEntries;
      if (platform.filterCustom === 'futebol') {
        processed = rawEntries.filter((e) => {
          const path = (e.path || '').toLowerCase();
          return (
            path.includes('bomba') ||
            path.includes('pes 20') ||
            path.includes('futebol') ||
            path.includes('fifa') ||
            path.includes('we10') ||
            path.includes('brasileir')
          );
        });
      } else if (platform.filterCustom === 'gta') {
        processed = rawEntries.filter((e) => {
          const path = (e.path || '').toLowerCase();
          return path.includes('gta') || path.includes('grand theft auto');
        });
      }

      // ======================================================================
      // DEDUPLICATION & GROUPING LOGIC (NO REPEATED ITEMS)
      // Group by cover and then by title
      // ======================================================================
      const groups = [];
      const coverMap = new Map(); // normalizedCoverKey -> group
      const titleMap = new Map(); // compKey -> group

      for (let i = 0; i < processed.length; i++) {
        const entry = processed[i];
        const rawPath = entry.path || '';
        const baseTitle = getBaseTitle(rawPath);
        const compKey = getComparisonKey(baseTitle) || rawPath.toLowerCase();
        const coverUrl = resolveCoverUrl(entry, platform);
        const coverKey = getCoverKey(coverUrl);
        const region = extractRegion(rawPath);
        const disc = extractDisc(rawPath);
        const isPTBR = region === 'Brasil' || /\b(Brasil|PT-BR|Dublado|Legendado|Traduzido|Bomba Patch)\b/i.test(rawPath);

        const versionData = {
          rawPath,
          sizeFormatted: formatBytes(entry.size),
          sizeBytes: parseFloat(entry.size) || 0,
          region: region || 'Global',
          disc,
          isPTBR,
          format: (rawPath.split('.').pop() || 'ISO').toUpperCase(),
          coverUrl,
          link: entry.link,
          genre: entry.genre || '',
        };

        // 1. Group by cover key first (same cover image = exact same game)
        let group = null;
        if (coverKey && coverMap.has(coverKey)) {
          group = coverMap.get(coverKey);
        }

        // 2. Then group by title key
        if (!group && compKey && titleMap.has(compKey)) {
          group = titleMap.get(compKey);
        }

        // 3. If matched by cover, but title exists in a different group, merge them
        if (group && compKey && titleMap.has(compKey) && titleMap.get(compKey) !== group) {
          const otherGroup = titleMap.get(compKey);
          for (let v = 0; v < otherGroup.versions.length; v++) {
            const ver = otherGroup.versions[v];
            group.versions.push(ver);
            if (ver.disc) group.discs.add(ver.disc);
            if (ver.region) group.regions.add(ver.region);
            if (ver.isPTBR) group.isPTBR = true;
          }
          if (!group.coverUrl && otherGroup.coverUrl) {
            group.coverUrl = otherGroup.coverUrl;
            group.hasCover = true;
          }
          // Re-map references
          for (const [k, g] of titleMap.entries()) {
            if (g === otherGroup) titleMap.set(k, group);
          }
          for (const [k, g] of coverMap.entries()) {
            if (g === otherGroup) coverMap.set(k, group);
          }
          const oIdx = groups.indexOf(otherGroup);
          if (oIdx !== -1) groups.splice(oIdx, 1);
        }

        if (!group) {
          group = {
            id: `${platform.id}_${compKey}`,
            displayTitle: baseTitle,
            compKey: compKey,
            coverUrl: coverUrl,
            hasCover: Boolean(coverUrl),
            isPTBR: isPTBR,
            discs: new Set(),
            regions: new Set(),
            genre: entry.genre || '',
            versions: [versionData],
            bestSizeFormatted: versionData.sizeFormatted,
            rawPrimaryPath: rawPath,
          };
          if (disc) group.discs.add(disc);
          if (region) group.regions.add(region);
          groups.push(group);
        } else {
          group.versions.push(versionData);
          if (disc) group.discs.add(disc);
          if (region) group.regions.add(region);
          if (isPTBR) group.isPTBR = true;

          // If this version has a verified cover and group doesn't, adopt it
          if (!group.coverUrl && coverUrl) {
            group.coverUrl = coverUrl;
            group.hasCover = true;
          }

          // Prioritize PT-BR or USA title for cleaner representation
          if (isPTBR || region === 'USA') {
            group.displayTitle = baseTitle;
            group.rawPrimaryPath = rawPath;
          }
        }

        if (coverKey) coverMap.set(coverKey, group);
        if (compKey) titleMap.set(compKey, group);
      }

      // Convert grouped list and compute popularity scores
      const groupedList = groups.map((g) => {
        const discsArr = Array.from(g.discs);
        const regionsArr = Array.from(g.regions);

        // Calculate popularity score for sorting
        const score = computePopularityScore(
          g.displayTitle,
          g.rawPrimaryPath,
          g.versions.length,
          g.hasCover,
          g.isPTBR
        );

        return {
          ...g,
          discsCount: discsArr.length,
          discsLabel: discsArr.length > 1 ? `${discsArr.length} Discos` : '',
          versionsCount: g.versions.length,
          versionsLabel: g.versions.length > 1 ? `${g.versions.length} Versões` : '',
          regionsLabel: regionsArr.join(', '),
          popularityScore: score,
        };
      });

      // ALWAYS PRE-SORT BY POPULARITY DESCENDING
      groupedList.sort((a, b) => {
        if (b.popularityScore !== a.popularityScore) {
          return b.popularityScore - a.popularityScore;
        }
        return a.displayTitle.localeCompare(b.displayTitle, 'pt-BR');
      });

      state.groupedGames = groupedList;

      // Update Banner Stats (Total Unique Games only - cover % hidden per user request)
      const totalUnique = state.groupedGames.length;

      if (dom.bannerTotalGames) dom.bannerTotalGames.textContent = `${totalUnique.toLocaleString('pt-BR')} Títulos`;
      if (dom.bannerWithCovers && dom.bannerWithCovers.parentElement) {
        dom.bannerWithCovers.parentElement.style.display = 'none';
      }

      // Apply initial filters and popularity sorting
      applyFilterAndSort();
    } catch (err) {
      console.error('Error loading catalog:', err);
      renderErrorState(err.message || 'Falha de conexão com a base de jogos.');
    } finally {
      state.isLoading = false;
    }
  }

  // --------------------------------------------------------------------------
  // Filtering & Sorting (2 Options: Mais Populares [default] & Ordem Alfabética)
  // --------------------------------------------------------------------------
  function applyFilterAndSort() {
    let result = state.groupedGames;

    // Search query filter
    const query = state.searchQuery.trim().toLowerCase();
    if (query) {
      result = result.filter((g) => {
        return (
          g.displayTitle.toLowerCase().includes(query) ||
          g.compKey.includes(query) ||
          (g.genre && g.genre.toLowerCase().includes(query)) ||
          g.versions.some((v) => v.rawPath.toLowerCase().includes(query))
        );
      });
    }

    // Region / Category Chip filter
    if (state.selectedRegion === 'br') {
      result = result.filter((g) => g.isPTBR);
    } else if (state.selectedRegion === 'usa') {
      result = result.filter((g) => g.regions.has('USA'));
    } else if (state.selectedRegion === 'eur') {
      result = result.filter((g) => g.regions.has('Europa'));
    } else if (state.selectedRegion === 'jp') {
      result = result.filter((g) => g.regions.has('Japão'));
    }

    // Sorting (Exactly 2 options: 'popular' by default, or 'az')
    result.sort((a, b) => {
      if (state.sortBy === 'popular') {
        if (b.popularityScore !== a.popularityScore) {
          return b.popularityScore - a.popularityScore;
        }
        return a.displayTitle.localeCompare(b.displayTitle, 'pt-BR');
      }
      // 'az'
      return a.displayTitle.localeCompare(b.displayTitle, 'pt-BR');
    });

    state.filteredGames = result;
    state.renderedCount = 0;

    // Update Counter text
    if (dom.resultsCountText) {
      dom.resultsCountText.innerHTML = `Exibindo <strong>${result.length.toLocaleString('pt-BR')}</strong> títulos de <strong>${state.groupedGames.length.toLocaleString('pt-BR')}</strong>`;
    }

    dom.gamesContainer.innerHTML = '';
    renderNextBatch();
  }

  // --------------------------------------------------------------------------
  // Rendering: 3D Cards & List View with Virtualized Scrolling
  // --------------------------------------------------------------------------
  function renderNextBatch() {
    if (state.filteredGames.length === 0) {
      renderEmptyState();
      return;
    }

    const start = state.renderedCount;
    const end = Math.min(start + BATCH_SIZE, state.filteredGames.length);
    if (start >= end) return;

    const fragment = document.createDocumentFragment();

    for (let i = start; i < end; i++) {
      const game = state.filteredGames[i];
      const el = state.viewMode === 'grid' ? createGridCard(game) : createListRow(game);
      fragment.appendChild(el);
    }

    dom.gamesContainer.appendChild(fragment);
    state.renderedCount = end;

    if (dom.scrollSentinel) {
      dom.scrollSentinel.style.display = state.renderedCount < state.filteredGames.length ? 'flex' : 'none';
    }
  }

  function createGridCard(game) {
    const card = document.createElement('div');
    card.className = 'game-card';
    card.setAttribute('tabindex', '0');
    card.setAttribute('role', 'button');
    card.setAttribute('aria-label', game.displayTitle);

    // Badges inside the 3D case
    let badgesHtml = '';
    if (game.isPTBR) {
      badgesHtml += `<span class="case-badge badge-br">🇧🇷 PT-BR</span>`;
    }
    if (game.discsLabel) {
      badgesHtml += `<span class="case-badge badge-multidisc">${escapeHtml(game.discsLabel)}</span>`;
    } else if (game.versionsCount > 1) {
      badgesHtml += `<span class="case-badge badge-versions">${game.versionsCount} Versões</span>`;
    }

    // Cover Image with Fallback
    const coverHtml = game.coverUrl
      ? `<img class="box-art-img" src="${escapeHtml(game.coverUrl)}" alt="${escapeHtml(game.displayTitle)}" loading="lazy" onerror="this.onerror=null; this.parentElement.innerHTML='${getFallbackInnerHtml(game)}';" />`
      : getFallbackInnerHtml(game);

    card.innerHTML = `
      <div class="game-box-3d">
        <div class="game-box-inner">
          <div class="case-header-band ${state.currentPlatform.caseClass}">
            <span>${state.currentPlatform.shortName}</span>
            <span>DVD-ROM</span>
          </div>
          <div class="box-badges">
            ${badgesHtml}
          </div>
          <div class="box-art-img-wrap">
            ${coverHtml}
            <div class="card-hover-overlay">
              <span class="overlay-btn">Ver Opções & Detalhes</span>
            </div>
          </div>
        </div>
      </div>
      <div class="game-card-meta">
        <div class="game-card-title" title="${escapeHtml(game.displayTitle)}">${escapeHtml(game.displayTitle)}</div>
        <div class="game-card-tags">
          ${game.bestSizeFormatted ? `<span class="game-tag-pill">💾 ${escapeHtml(game.bestSizeFormatted)}</span>` : ''}
          ${game.genre ? `<span class="game-tag-pill">• ${escapeHtml(game.genre)}</span>` : ''}
        </div>
      </div>
    `;

    card.addEventListener('click', () => openGameModal(game));
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openGameModal(game);
      }
    });

    return card;
  }

  function getFallbackInnerHtml(game) {
    return `
      <div class="box-art-fallback">
        <svg class="fallback-console-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="2" y="6" width="20" height="12" rx="2"></rect>
          <path d="M6 12h4m-2-2v4m7-2h.01m2.99 0h.01"></path>
        </svg>
        <span class="fallback-title">${escapeHtml(game.displayTitle)}</span>
      </div>
    `;
  }

  function createListRow(game) {
    const row = document.createElement('div');
    row.className = 'list-row';
    row.setAttribute('tabindex', '0');
    row.setAttribute('role', 'button');

    const thumbSrc = game.coverUrl || '';

    row.innerHTML = `
      <div class="list-row-left">
        ${
          thumbSrc
            ? `<img class="list-row-thumb" src="${escapeHtml(thumbSrc)}" alt="" loading="lazy" onerror="this.style.display='none'" />`
            : `<div class="list-row-thumb" style="display:flex;align-items:center;justify-content:center;color:#666;font-size:10px;">BOX</div>`
        }
        <div class="list-row-info">
          <div class="list-row-title">${escapeHtml(game.displayTitle)}</div>
          <div class="list-row-tags">
            ${game.isPTBR ? `<span class="case-badge badge-br">PT-BR</span>` : ''}
            ${game.discsLabel ? `<span class="case-badge badge-multidisc">${escapeHtml(game.discsLabel)}</span>` : ''}
            ${game.versionsCount > 1 ? `<span class="case-badge badge-versions">${game.versionsCount} Versões</span>` : ''}
            ${game.genre ? `<span class="game-tag-pill">${escapeHtml(game.genre)}</span>` : ''}
          </div>
        </div>
      </div>
      <div class="list-row-right">
        <span class="list-row-size">${escapeHtml(game.bestSizeFormatted || 'Digital')}</span>
      </div>
    `;

    row.addEventListener('click', () => openGameModal(game));
    row.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openGameModal(game);
      }
    });

    return row;
  }

  // --------------------------------------------------------------------------
  // States: Loading, Empty, Error
  // --------------------------------------------------------------------------
  function renderLoadingState() {
    dom.gamesContainer.innerHTML = `
      <div class="loading-container" style="grid-column: 1 / -1;">
        <div class="spinner"></div>
        <p style="font-size: 1.1rem; font-weight: 700; color: #fff;">Carregando catálogo de ${state.currentPlatform.name}...</p>
        <p style="font-size: 0.85rem; color: var(--text-muted);">Agrupando edições e ordenando pelos mais populares...</p>
      </div>
    `;
    if (dom.scrollSentinel) dom.scrollSentinel.style.display = 'none';
  }

  function renderEmptyState() {
    dom.gamesContainer.innerHTML = `
      <div class="loading-container" style="grid-column: 1 / -1; padding: 5rem 1rem;">
        <svg style="width: 48px; height: 48px; color: var(--text-muted); opacity: 0.6;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
        <p style="font-size: 1.1rem; font-weight: 700; color: #fff;">Nenhum jogo encontrado</p>
        <p style="font-size: 0.85rem; color: var(--text-secondary); max-width: 320px;">
          Não encontramos jogos correspondentes ao termo "<strong>${escapeHtml(state.searchQuery)}</strong>" com os filtros aplicados.
        </p>
        <button class="action-btn" onclick="document.getElementById('searchInput').value=''; document.getElementById('searchInput').dispatchEvent(new Event('input'));" style="margin-top: 0.5rem;">
          Limpar Busca
        </button>
      </div>
    `;
    if (dom.scrollSentinel) dom.scrollSentinel.style.display = 'none';
  }

  function renderErrorState(message) {
    dom.gamesContainer.innerHTML = `
      <div class="loading-container" style="grid-column: 1 / -1; padding: 4rem 1rem;">
        <svg style="width: 48px; height: 48px; color: #f43f5e;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
        <p style="font-size: 1.1rem; font-weight: 700; color: #fff;">Erro ao carregar catálogo</p>
        <p style="font-size: 0.85rem; color: var(--text-secondary); max-width: 400px;">
          ${escapeHtml(message)}
        </p>
        <button class="action-btn" id="retryLoadBtn" style="margin-top: 0.5rem; background: var(--console-primary); color: #fff;">
          Tentar Novamente
        </button>
      </div>
    `;
    const retryBtn = document.getElementById('retryLoadBtn');
    if (retryBtn) {
      retryBtn.addEventListener('click', () => loadPlatformData(state.currentPlatform, true));
    }
  }

  // --------------------------------------------------------------------------
  // Game Details Modal with Grouped Versions
  // --------------------------------------------------------------------------
  function openGameModal(game) {
    state.selectedGame = game;

    if (dom.modalTitle) dom.modalTitle.textContent = game.displayTitle;
    if (dom.modalConsoleBadge) dom.modalConsoleBadge.textContent = state.currentPlatform.name;

    // Cover image in modal
    if (dom.modalBoxArt) {
      dom.modalBoxArt.innerHTML = game.coverUrl
        ? `<img src="${escapeHtml(game.coverUrl)}" alt="${escapeHtml(game.displayTitle)}" onerror="this.parentElement.innerHTML='${getFallbackInnerHtml(game)}';" />`
        : getFallbackInnerHtml(game);
    }

    // Modal tags
    if (dom.modalTags) {
      let tagsHtml = '';
      if (game.isPTBR) tagsHtml += `<span class="modal-tag" style="background:#009c3b; color:#ffdf00; border-color:#ffdf00;">🇧🇷 PT-BR</span>`;
      if (game.discsLabel) tagsHtml += `<span class="modal-tag">${escapeHtml(game.discsLabel)}</span>`;
      if (game.versionsCount > 1) tagsHtml += `<span class="modal-tag" style="color:#fbbf24;">${game.versionsCount} Versões Disponíveis</span>`;
      if (game.regionsLabel) tagsHtml += `<span class="modal-tag">${escapeHtml(game.regionsLabel)}</span>`;
      dom.modalTags.innerHTML = tagsHtml;
    }

    // Metadata table
    const primaryVersion = game.versions[0] || {};
    if (dom.modalFormat) dom.modalFormat.textContent = primaryVersion.format || 'ISO';
    if (dom.modalSize) dom.modalSize.textContent = game.bestSizeFormatted || 'Tamanho padrão';
    if (dom.modalRegion) dom.modalRegion.textContent = game.regionsLabel || 'Global';
    if (dom.modalGenre) dom.modalGenre.textContent = game.genre || 'Geral / Clássico';
    if (dom.modalFilename) dom.modalFilename.textContent = game.rawPrimaryPath;

    // Render grouped versions list
    if (dom.modalVersionsSection && dom.modalVersionsList) {
      if (game.versions.length > 1) {
        dom.modalVersionsSection.style.display = 'flex';
        dom.modalVersionsList.innerHTML = game.versions.map((v, idx) => `
          <div class="modal-version-item">
            <span class="modal-version-name" title="${escapeHtml(v.rawPath)}">${escapeHtml(v.rawPath)}</span>
            <div class="modal-version-meta">
              <span>${v.disc ? escapeHtml(v.disc) : escapeHtml(v.region)}</span>
              <span>•</span>
              <span>${escapeHtml(v.sizeFormatted || v.format)}</span>
            </div>
          </div>
        `).join('');
      } else {
        dom.modalVersionsSection.style.display = 'none';
      }
    }

    // WhatsApp Order Button
    if (dom.modalWhatsAppBtn) {
      const msg = `Olá! Vi o jogo *${game.displayTitle}* no catálogo oficial do *${state.currentPlatform.name}* e gostaria de saber como ter acesso!`;
      dom.modalWhatsAppBtn.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
    }

    dom.modalBackdrop.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeGameModal() {
    state.selectedGame = null;
    dom.modalBackdrop.classList.remove('open');
    document.body.style.overflow = '';
  }

  function showToast(msg) {
    if (!dom.toast) return;
    dom.toast.textContent = msg;
    dom.toast.classList.add('show');
    setTimeout(() => dom.toast.classList.remove('show'), 2500);
  }

  // --------------------------------------------------------------------------
  // Utility: HTML Escaping
  // --------------------------------------------------------------------------
  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  // --------------------------------------------------------------------------
  // Initialize Application
  // --------------------------------------------------------------------------
  function init() {
    cacheDom();

    // Check if we are on a dedicated platform page or central hub
    const context = detectPlatformContext();

    if (context.isDedicated && context.platform) {
      state.currentPlatform = context.platform;
      state.sortBy = 'popular';
      if (dom.sortSelect) dom.sortSelect.value = 'popular';
      applyPlatformTheme(state.currentPlatform);
      setupEventListeners();
      setupScrollObserver();
      loadPlatformData(state.currentPlatform);
    } else {
      renderHubMode();
    }
  }

  function setupEventListeners() {
    // Search input
    let searchDebounceTimer = null;
    if (dom.searchInput) {
      dom.searchInput.addEventListener('input', (e) => {
        clearTimeout(searchDebounceTimer);
        state.searchQuery = e.target.value;
        if (dom.searchClearBtn) {
          dom.searchClearBtn.style.display = state.searchQuery ? 'block' : 'none';
        }

        searchDebounceTimer = setTimeout(() => {
          applyFilterAndSort();
        }, 100);
      });
    }

    if (dom.searchClearBtn) {
      dom.searchClearBtn.addEventListener('click', () => {
        dom.searchInput.value = '';
        state.searchQuery = '';
        dom.searchClearBtn.style.display = 'none';
        dom.searchInput.focus();
        applyFilterAndSort();
      });
    }

    // Keyboard shortcut '/'
    window.addEventListener('keydown', (e) => {
      if (e.key === '/' && document.activeElement !== dom.searchInput) {
        e.preventDefault();
        if (dom.searchInput) {
          dom.searchInput.focus();
          dom.searchInput.select();
        }
      }
      if (e.key === 'Escape' && dom.modalBackdrop.classList.contains('open')) {
        closeGameModal();
      }
    });

    // Region chips
    if (dom.regionChips) {
      dom.regionChips.addEventListener('click', (e) => {
        const chip = e.target.closest('.filter-chip');
        if (!chip) return;
        dom.regionChips.querySelectorAll('.filter-chip').forEach((c) => c.classList.remove('active'));
        chip.classList.add('active');
        state.selectedRegion = chip.getAttribute('data-region') || 'all';
        applyFilterAndSort();
      });
    }

    // Sort select (Exactly 2 options: popular [default] and az)
    if (dom.sortSelect) {
      dom.sortSelect.value = state.sortBy || 'popular';
      dom.sortSelect.addEventListener('change', (e) => {
        state.sortBy = e.target.value === 'az' ? 'az' : 'popular';
        applyFilterAndSort();
      });
    }

    // View toggle
    if (dom.viewGridBtn && dom.viewListBtn) {
      dom.viewGridBtn.addEventListener('click', () => {
        state.viewMode = 'grid';
        dom.viewGridBtn.classList.add('active');
        dom.viewListBtn.classList.remove('active');
        dom.gamesContainer.className = 'games-grid';
        applyFilterAndSort();
      });
      dom.viewListBtn.addEventListener('click', () => {
        state.viewMode = 'list';
        dom.viewListBtn.classList.add('active');
        dom.viewGridBtn.classList.remove('active');
        dom.gamesContainer.className = 'games-list-view';
        applyFilterAndSort();
      });
    }

    // Refresh button
    if (dom.refreshBtn) {
      dom.refreshBtn.addEventListener('click', () => {
        showToast('Atualizando dados da base central...');
        loadPlatformData(state.currentPlatform, true);
      });
    }

    // Modal close
    if (dom.modalCloseBtn) {
      dom.modalCloseBtn.addEventListener('click', closeGameModal);
    }
    if (dom.modalBackdrop) {
      dom.modalBackdrop.addEventListener('click', (e) => {
        if (e.target === dom.modalBackdrop) closeGameModal();
      });
    }

    // Copy title
    if (dom.modalCopyBtn) {
      dom.modalCopyBtn.addEventListener('click', () => {
        if (!state.selectedGame) return;
        navigator.clipboard.writeText(state.selectedGame.displayTitle).then(() => {
          showToast('Título copiado para a área de transferência!');
        });
      });
    }
  }

  function setupScrollObserver() {
    if (!dom.scrollSentinel || !window.IntersectionObserver) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !state.isLoading && state.renderedCount < state.filteredGames.length) {
          renderNextBatch();
        }
      },
      { rootMargin: '300px' }
    );

    observer.observe(dom.scrollSentinel);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

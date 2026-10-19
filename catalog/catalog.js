/**
 * XBOX & PS2 COMPANION INSPIRED GAME CATALOG
 * Digital Store Games - Catálogo de Jogos Premium
 * Architecture: SPA with IndexedDB Cache, Fast Filter, 3D Game Boxes & Dynamic Routing
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
      tagline: 'A maior biblioteca de jogos do lendário PS2',
      approxCount: '19.000+',
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
      tagline: 'Clássicos memoráveis com controle por movimento',
      approxCount: '1.460+',
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
      tagline: 'A era de ouro em alta definição e grandes narrativas',
      approxCount: '4.260+',
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
      tagline: 'Coleção completa dos sucessos inesquecíveis da geração 360',
      approxCount: '6.400+',
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
      tagline: 'Os clássicos 32-bits que revolucionaram os games',
      approxCount: '2.550+',
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
      tagline: 'O melhor videogame portátil da Sony onde você estiver',
      approxCount: '1.800+',
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
      tagline: 'O console à frente de seu tempo com arcades incríveis',
      approxCount: '3.070+',
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
      tagline: 'Grandes sucessos híbridos para jogar em qualquer lugar',
      approxCount: '2.300+',
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
      tagline: 'O clássico cubo roxo com títulos inesquecíveis da Nintendo',
      approxCount: '1.060+',
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
      tagline: 'A revolução das duas telas com milhares de opções',
      approxCount: '2.690+',
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
      tagline: 'A evolução tridimensional portátil da Nintendo',
      approxCount: '1.020+',
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
      tagline: 'A obra-prima dos 16-bits com clássicos eternos',
      approxCount: '3.480+',
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
      tagline: 'A transição pioneira para os mundos totalmente em 3D',
      approxCount: '1.080+',
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
      tagline: 'A velocidade e atitude do console 16-bits da Sega',
      approxCount: '1.490+',
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
      tagline: 'O poder dos arcades em 2D e 3D em sua casa',
      approxCount: '290+',
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
      tagline: 'O console que iniciou o legado da marca Xbox',
      approxCount: '1.540+',
    },
    {
      id: 'ps2_futebol',
      name: 'PS2 Patchs Futebol',
      shortName: 'Bomba Patch & PES',
      mnemonic: 'ps2',
      filterCustom: 'futebol',
      company: 'Mods & Patchs',
      color: '#1e3799',
      accent: '#4a69bd',
      headerBg: '#1e3799',
      caseClass: 'case-ps2',
      libretro: 'Sony_-_PlayStation_2',
      tagline: 'Bomba Patch, PES atualizados, Brasileirão e edições especiais',
      approxCount: '630+',
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
      approxCount: '200+',
    },
  ];

  // --------------------------------------------------------------------------
  // Application State
  // --------------------------------------------------------------------------
  const state = {
    currentPlatform: null,
    allGames: [],
    filteredGames: [],
    renderedCount: 0,
    searchQuery: '',
    selectedRegion: 'all', // all | br | usa | eur | jp | with_cover
    sortBy: 'title_asc',   // title_asc | title_desc | size_desc | size_asc
    viewMode: 'grid',      // grid | list
    isLoading: false,
    selectedGame: null,
  };

  // --------------------------------------------------------------------------
  // IndexedDB Cache Layer
  // --------------------------------------------------------------------------
  const DB_NAME = 'DSG_Catalog_DB';
  const DB_STORE = 'platforms';

  function openDatabase() {
    return new Promise((resolve, reject) => {
      if (!window.indexedDB) {
        return resolve(null);
      }
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
  // Title & Filename Cleaning Helpers
  // --------------------------------------------------------------------------
  function cleanGameTitle(rawFilename) {
    if (!rawFilename) return { cleanTitle: 'Jogo sem título', tags: [] };

    let str = rawFilename.trim();

    // Remove file extensions
    str = str.replace(/\.(iso|rvz|chd|cso|wbfs|nsp|xci|nsz|rar|7z|zip|bin|cue|gdi|cdi|sfc|smc|z64|n64|md|gen|pkg)$/i, '');

    // Extract disc information
    let disc = '';
    const discMatch = str.match(/\((Disc|Disk|DVD|CD)\s*([0-9]+)[^)]*\)/i) || str.match(/\[(Disc|Disk|DVD|CD)\s*([0-9]+)[^\]]*\]/i);
    if (discMatch) {
      disc = `Disco ${discMatch[2]}`;
    }

    // Extract region
    let region = '';
    if (/\b(USA|US)\b/i.test(str)) region = 'USA';
    else if (/\b(Europe|En,Fr,De|En,Es,It|PAL)\b/i.test(str)) region = 'Europa';
    else if (/\b(Japan|JP|NTSC-J)\b/i.test(str)) region = 'Japão';
    else if (/\b(Brazil|Brasil|PT-BR|Dublado|Legendado)\b/i.test(str)) region = 'Brasil';

    // Remove game serial prefixes (e.g. SLUS_209.46. or [01008F50155A6000])
    str = str.replace(/^[A-Z]{3,4}[-_][0-9]{3,5}\.[0-9]{2}\./i, '');
    str = str.replace(/\[[0-9A-Fa-f]{16}\]/g, '');

    // Extract tags inside parenthesis and brackets for pill display
    const tagMatches = str.match(/\(([^)]+)\)|\[([^\]]+)\]/g) || [];
    const tags = [];
    tagMatches.forEach((t) => {
      const cleanedTag = t.replace(/[()[\]]/g, '').trim();
      // Keep only meaningful tags, not entire huge language lists
      if (cleanedTag.length > 0 && cleanedTag.length <= 18) {
        tags.push(cleanedTag);
      }
    });

    // Clean primary title by stripping all (...) and [...]
    let clean = str.replace(/\([^)]*\)/g, '').replace(/\[[^\]]*\]/g, '');
    // Clean trailing/leading hyphens and extra spaces
    clean = clean.replace(/^[-\s_]+|[-\s_]+$/g, '').replace(/\s{2,}/g, ' ');

    if (!clean.trim()) {
      clean = str;
    }

    return {
      cleanTitle: clean.trim(),
      region,
      disc,
      tags: tags.slice(0, 3),
      isPTBR: /\b(Brasil|PT-BR|Dublado|Legendado|Traduzido|Bomba Patch)\b/i.test(rawFilename),
    };
  }

  function formatBytes(bytes) {
    if (!bytes) return '';
    if (typeof bytes === 'string' && isNaN(Number(bytes))) {
      return bytes; // e.g. "3.4 GB" already formatted
    }
    const n = Number(bytes);
    if (isNaN(n) || n <= 0) return '';
    const gb = n / (1024 * 1024 * 1024);
    if (gb >= 1) return `${gb.toFixed(2)} GB`;
    const mb = n / (1024 * 1024);
    if (mb >= 1) return `${mb.toFixed(0)} MB`;
    return `${Math.round(n / 1024)} KB`;
  }

  // --------------------------------------------------------------------------
  // Image Cover Resolution
  // --------------------------------------------------------------------------
  function resolveCoverUrl(entry, platform) {
    // 1. Direct DB covers (cover2d_url or image_url)
    let url = entry.cover2d_url || entry.image_url;
    if (url && typeof url === 'string') {
      url = url.trim();
      // Enforce HTTPS
      if (url.startsWith('http://')) {
        url = url.replace(/^http:\/\//i, 'https://');
      }
      return url;
    }

    // 2. Libretro fallback derived from filename
    if (platform && platform.libretro) {
      const baseName = (entry.path || '').replace(/\.[a-zA-Z0-9]+$/, '').trim();
      if (baseName) {
        return `https://raw.githubusercontent.com/libretro-thumbnails/${platform.libretro}/master/Named_Boxarts/${encodeURIComponent(baseName)}.png`;
      }
    }

    return null;
  }

  // --------------------------------------------------------------------------
  // DOM Elements References
  // --------------------------------------------------------------------------
  let dom = {};

  function cacheDom() {
    dom = {
      header: document.querySelector('.catalog-header'),
      platformTabs: document.getElementById('platformTabs'),
      bannerCard: document.getElementById('bannerCard'),
      bannerTitle: document.getElementById('bannerTitle'),
      bannerTagline: document.getElementById('bannerTagline'),
      bannerTotalGames: document.getElementById('bannerTotalGames'),
      bannerWithCovers: document.getElementById('bannerWithCovers'),
      searchInput: document.getElementById('searchInput'),
      searchClearBtn: document.getElementById('searchClearBtn'),
      regionChips: document.getElementById('regionChips'),
      sortSelect: document.getElementById('sortSelect'),
      viewGridBtn: document.getElementById('viewGridBtn'),
      viewListBtn: document.getElementById('viewListBtn'),
      resultsCountText: document.getElementById('resultsCountText'),
      activeFilterHint: document.getElementById('activeFilterHint'),
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
      modalWhatsAppBtn: document.getElementById('modalWhatsAppBtn'),
      modalCopyBtn: document.getElementById('modalCopyBtn'),
      toast: document.getElementById('toast'),
    };
  }

  // --------------------------------------------------------------------------
  // Navigation & URL Routing
  // --------------------------------------------------------------------------
  function detectInitialPlatform() {
    // 1. Meta tag in HTML shell (used by subfolders like /catalog/ps2/index.html)
    const metaTag = document.querySelector('meta[name="default-platform"]');
    if (metaTag && metaTag.content) {
      const p = PLATFORMS.find((x) => x.id === metaTag.content.trim().toLowerCase());
      if (p) return p;
    }

    // 2. Pathname segment: e.g. /catalog/ps2 or /catalog/ps2/
    const path = window.location.pathname.toLowerCase();
    for (const p of PLATFORMS) {
      if (path.includes(`/catalog/${p.id}`) || path.endsWith(`/${p.id}`) || path.endsWith(`/${p.id}/`)) {
        return p;
      }
    }

    // 3. Search query: ?platform=ps2 or ?console=ps2
    const params = new URLSearchParams(window.location.search);
    const queryPlat = params.get('platform') || params.get('console');
    if (queryPlat) {
      const p = PLATFORMS.find((x) => x.id === queryPlat.toLowerCase());
      if (p) return p;
    }

    // 4. Hash: #ps2 or #/ps2
    const hash = window.location.hash.replace(/^[#/]+/, '').toLowerCase();
    if (hash) {
      const p = PLATFORMS.find((x) => x.id === hash);
      if (p) return p;
    }

    // Default to PS2 (most popular catalog)
    return PLATFORMS[0];
  }

  function updateBrowserUrl(platformId) {
    try {
      const currentPath = window.location.pathname;
      let newPath = currentPath;

      // If we are at /catalog/ or /catalog/index.html
      if (currentPath.endsWith('/catalog/') || currentPath.endsWith('/catalog') || currentPath.endsWith('index.html')) {
        // Use clean query or clean path
        const base = currentPath.replace(/\/index\.html$/, '').replace(/\/$/, '');
        newPath = `${base}/${platformId}/`;
      } else {
        // Replace existing platform segment if any
        newPath = currentPath.replace(/\/catalog\/[a-z0-9_-]+\/?$/i, `/catalog/${platformId}/`);
        if (!newPath.includes(platformId)) {
          newPath = `/catalog/${platformId}/`;
        }
      }

      window.history.pushState({ platformId }, '', newPath);
    } catch (e) {
      // Fallback to search query if path push is restricted
      const url = new URL(window.location);
      url.searchParams.set('platform', platformId);
      window.history.pushState({ platformId }, '', url.toString());
    }
  }

  // --------------------------------------------------------------------------
  // Apply Platform Theme & Styles
  // --------------------------------------------------------------------------
  function applyPlatformTheme(platform) {
    document.documentElement.style.setProperty('--console-primary', platform.accent);
    document.documentElement.style.setProperty('--console-glow', `${platform.accent}44`);
    document.documentElement.style.setProperty('--console-border', `${platform.accent}66`);
    document.documentElement.style.setProperty('--console-header-bg', platform.headerBg);

    // Update active tab in pills
    document.querySelectorAll('.platform-pill').forEach((pill) => {
      const isTarget = pill.getAttribute('data-platform') === platform.id;
      pill.classList.toggle('active', isTarget);
      if (isTarget) {
        pill.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    });

    // Update Banner Info
    if (dom.bannerTitle) dom.bannerTitle.textContent = platform.name;
    if (dom.bannerTagline) dom.bannerTagline.textContent = platform.tagline;
    if (dom.searchInput) dom.searchInput.placeholder = `Buscar entre ${platform.approxCount} jogos de ${platform.shortName}...`;
    document.title = `Catálogo ${platform.name} - Digital Store Games`;
  }

  // --------------------------------------------------------------------------
  // Fetch Games Data
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
        // Fetch from API
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

        // Save to IndexedDB cache
        if (rawEntries.length > 0) {
          setCachedPlatform(platform.id, rawEntries);
        }
      }

      // Handle custom platform filters (e.g. ps2_futebol, ps2patchs_gta_games)
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

      // Parse and enrich entries
      state.allGames = processed.map((entry, index) => {
        const meta = cleanGameTitle(entry.path);
        const cover = resolveCoverUrl(entry, platform);
        return {
          id: `${platform.id}_${index}`,
          raw: entry,
          path: entry.path || '',
          cleanTitle: meta.cleanTitle,
          region: meta.region,
          disc: meta.disc,
          tags: meta.tags,
          isPTBR: meta.isPTBR,
          sizeFormatted: formatBytes(entry.size),
          genre: entry.genre || '',
          coverUrl: cover,
          hasCover: Boolean(entry.cover2d_url || entry.image_url),
        };
      });

      // Update Banner Stats
      const totalCount = state.allGames.length;
      const coversCount = state.allGames.filter((g) => g.hasCover).length;
      const coverPercent = totalCount > 0 ? Math.round((coversCount / totalCount) * 100) : 0;

      if (dom.bannerTotalGames) dom.bannerTotalGames.textContent = totalCount.toLocaleString('pt-BR');
      if (dom.bannerWithCovers) dom.bannerWithCovers.textContent = `${coversCount.toLocaleString('pt-BR')} (${coverPercent}%)`;

      // Reset filters and render
      applyFilterAndSort();
    } catch (err) {
      console.error('Error loading catalog:', err);
      renderErrorState(err.message || 'Falha de conexão com a base de jogos.');
    } finally {
      state.isLoading = false;
    }
  }

  // --------------------------------------------------------------------------
  // Filtering & Sorting
  // --------------------------------------------------------------------------
  function applyFilterAndSort() {
    let result = state.allGames;

    // Search query filter
    const query = state.searchQuery.trim().toLowerCase();
    if (query) {
      result = result.filter((g) => {
        return (
          g.cleanTitle.toLowerCase().includes(query) ||
          g.path.toLowerCase().includes(query) ||
          (g.genre && g.genre.toLowerCase().includes(query)) ||
          g.tags.some((t) => t.toLowerCase().includes(query))
        );
      });
    }

    // Region / Category Chip filter
    if (state.selectedRegion === 'br') {
      result = result.filter((g) => g.isPTBR || g.region === 'Brasil');
    } else if (state.selectedRegion === 'usa') {
      result = result.filter((g) => g.region === 'USA');
    } else if (state.selectedRegion === 'eur') {
      result = result.filter((g) => g.region === 'Europa');
    } else if (state.selectedRegion === 'jp') {
      result = result.filter((g) => g.region === 'Japão');
    } else if (state.selectedRegion === 'with_cover') {
      result = result.filter((g) => g.hasCover);
    }

    // Sorting
    result.sort((a, b) => {
      if (state.sortBy === 'title_desc') {
        return b.cleanTitle.localeCompare(a.cleanTitle, 'pt-BR');
      }
      if (state.sortBy === 'size_desc') {
        return (parseFloat(b.raw.size) || 0) - (parseFloat(a.raw.size) || 0);
      }
      if (state.sortBy === 'size_asc') {
        return (parseFloat(a.raw.size) || 0) - (parseFloat(b.raw.size) || 0);
      }
      // default: title_asc
      return a.cleanTitle.localeCompare(b.cleanTitle, 'pt-BR');
    });

    state.filteredGames = result;
    state.renderedCount = 0;

    // Update Counter text
    if (dom.resultsCountText) {
      dom.resultsCountText.innerHTML = `Exibindo <strong>${result.length.toLocaleString('pt-BR')}</strong> de <strong>${state.allGames.length.toLocaleString('pt-BR')}</strong> jogos`;
    }

    // Clear and render first chunk
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

    // Show/hide scroll sentinel
    if (dom.scrollSentinel) {
      dom.scrollSentinel.style.display = state.renderedCount < state.filteredGames.length ? 'flex' : 'none';
    }
  }

  function createGridCard(game) {
    const card = document.createElement('div');
    card.className = 'game-card';
    card.setAttribute('tabindex', '0');
    card.setAttribute('role', 'button');
    card.setAttribute('aria-label', game.cleanTitle);

    // Badges inside the case
    let badgesHtml = '';
    if (game.isPTBR) {
      badgesHtml += `<span class="case-badge badge-br">🇧🇷 PT-BR</span>`;
    } else if (game.region) {
      badgesHtml += `<span class="case-badge">${escapeHtml(game.region)}</span>`;
    }
    if (game.disc) {
      badgesHtml += `<span class="case-badge badge-multidisc">${escapeHtml(game.disc)}</span>`;
    }

    // Fallback UI or Cover Image
    const coverHtml = game.coverUrl
      ? `<img class="box-art-img" src="${escapeHtml(game.coverUrl)}" alt="${escapeHtml(game.cleanTitle)}" loading="lazy" onerror="this.onerror=null; this.parentElement.innerHTML='${getFallbackInnerHtml(game)}';" />`
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
              <span class="overlay-btn">Ver Detalhes</span>
            </div>
          </div>
        </div>
      </div>
      <div class="game-card-meta">
        <div class="game-card-title" title="${escapeHtml(game.cleanTitle)}">${escapeHtml(game.cleanTitle)}</div>
        <div class="game-card-tags">
          ${game.sizeFormatted ? `<span class="game-tag-pill">💾 ${escapeHtml(game.sizeFormatted)}</span>` : ''}
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
        <span class="fallback-title">${escapeHtml(game.cleanTitle)}</span>
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
          <div class="list-row-title">${escapeHtml(game.cleanTitle)}</div>
          <div class="list-row-tags">
            ${game.isPTBR ? `<span class="case-badge badge-br">PT-BR</span>` : ''}
            ${game.region ? `<span class="case-badge">${escapeHtml(game.region)}</span>` : ''}
            ${game.disc ? `<span class="case-badge badge-multidisc">${escapeHtml(game.disc)}</span>` : ''}
            ${game.genre ? `<span class="game-tag-pill">${escapeHtml(game.genre)}</span>` : ''}
          </div>
        </div>
      </div>
      <div class="list-row-right">
        <span class="list-row-size">${escapeHtml(game.sizeFormatted || 'Digital')}</span>
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
        <p style="font-size: 1rem; font-weight: 700; color: #fff;">Carregando catálogo de ${state.currentPlatform.name}...</p>
        <p style="font-size: 0.8rem; color: var(--text-muted);">Consultando a base central de jogos e capas...</p>
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
  // Game Details Modal
  // --------------------------------------------------------------------------
  function openGameModal(game) {
    state.selectedGame = game;

    if (dom.modalTitle) dom.modalTitle.textContent = game.cleanTitle;
    if (dom.modalConsoleBadge) dom.modalConsoleBadge.textContent = state.currentPlatform.name;

    // Cover in modal
    if (dom.modalBoxArt) {
      dom.modalBoxArt.innerHTML = game.coverUrl
        ? `<img src="${escapeHtml(game.coverUrl)}" alt="${escapeHtml(game.cleanTitle)}" onerror="this.parentElement.innerHTML='${getFallbackInnerHtml(game)}';" />`
        : getFallbackInnerHtml(game);
    }

    // Modal tags
    if (dom.modalTags) {
      let tagsHtml = '';
      if (game.isPTBR) tagsHtml += `<span class="modal-tag" style="background:#009c3b; color:#ffdf00; border-color:#ffdf00;">🇧🇷 PT-BR</span>`;
      if (game.region) tagsHtml += `<span class="modal-tag">${escapeHtml(game.region)}</span>`;
      if (game.disc) tagsHtml += `<span class="modal-tag">${escapeHtml(game.disc)}</span>`;
      game.tags.forEach((t) => {
        tagsHtml += `<span class="modal-tag">${escapeHtml(t)}</span>`;
      });
      dom.modalTags.innerHTML = tagsHtml;
    }

    // Metadata table
    if (dom.modalFormat) dom.modalFormat.textContent = (game.path.split('.').pop() || 'ISO').toUpperCase();
    if (dom.modalSize) dom.modalSize.textContent = game.sizeFormatted || 'Tamanho padrão';
    if (dom.modalRegion) dom.modalRegion.textContent = game.region || 'Região Global';
    if (dom.modalGenre) dom.modalGenre.textContent = game.genre || 'Geral / Aventura';
    if (dom.modalFilename) dom.modalFilename.textContent = game.path;

    // WhatsApp Order Button
    if (dom.modalWhatsAppBtn) {
      const msg = `Olá! Vi o jogo *${game.cleanTitle}* no catálogo oficial do *${state.currentPlatform.name}* e gostaria de saber como ter acesso!`;
      dom.modalWhatsAppBtn.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
    }

    // Open Modal
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

    // Render platform tabs in header
    renderPlatformTabs();

    // Detect initial platform from URL or meta
    state.currentPlatform = detectInitialPlatform();
    applyPlatformTheme(state.currentPlatform);

    // Setup Event Listeners
    setupEventListeners();

    // Setup Infinite Scroll Observer
    setupScrollObserver();

    // Load initial platform data
    loadPlatformData(state.currentPlatform);
  }

  function renderPlatformTabs() {
    if (!dom.platformTabs) return;

    dom.platformTabs.innerHTML = PLATFORMS.map((p) => `
      <button class="platform-pill" data-platform="${p.id}" role="tab" aria-selected="false">
        <span>${escapeHtml(p.shortName)}</span>
        <span class="pill-count">${p.approxCount}</span>
      </button>
    `).join('');

    dom.platformTabs.addEventListener('click', (e) => {
      const pill = e.target.closest('.platform-pill');
      if (!pill) return;
      const targetId = pill.getAttribute('data-platform');
      const targetPlatform = PLATFORMS.find((x) => x.id === targetId);
      if (targetPlatform && targetPlatform.id !== state.currentPlatform.id) {
        switchPlatform(targetPlatform);
      }
    });
  }

  function switchPlatform(platform) {
    state.currentPlatform = platform;
    applyPlatformTheme(platform);
    updateBrowserUrl(platform.id);
    loadPlatformData(platform);
  }

  function setupEventListeners() {
    // Search Input with Debounce
    let searchDebounceTimer = null;
    dom.searchInput.addEventListener('input', (e) => {
      clearTimeout(searchDebounceTimer);
      state.searchQuery = e.target.value;
      dom.searchClearBtn.style.display = state.searchQuery ? 'block' : 'none';

      searchDebounceTimer = setTimeout(() => {
        applyFilterAndSort();
      }, 100);
    });

    dom.searchClearBtn.addEventListener('click', () => {
      dom.searchInput.value = '';
      state.searchQuery = '';
      dom.searchClearBtn.style.display = 'none';
      dom.searchInput.focus();
      applyFilterAndSort();
    });

    // Keyboard shortcut '/' to search
    window.addEventListener('keydown', (e) => {
      if (e.key === '/' && document.activeElement !== dom.searchInput) {
        e.preventDefault();
        dom.searchInput.focus();
        dom.searchInput.select();
      }
      if (e.key === 'Escape' && dom.modalBackdrop.classList.contains('open')) {
        closeGameModal();
      }
    });

    // Region Filter Chips
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

    // Sort Select
    if (dom.sortSelect) {
      dom.sortSelect.addEventListener('change', (e) => {
        state.sortBy = e.target.value;
        applyFilterAndSort();
      });
    }

    // View Mode Toggle (Grid vs List)
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

    // Refresh Button (Force API Refresh)
    if (dom.refreshBtn) {
      dom.refreshBtn.addEventListener('click', () => {
        showToast('Atualizando dados da base central...');
        loadPlatformData(state.currentPlatform, true);
      });
    }

    // Modal Close
    if (dom.modalCloseBtn) {
      dom.modalCloseBtn.addEventListener('click', closeGameModal);
    }
    if (dom.modalBackdrop) {
      dom.modalBackdrop.addEventListener('click', (e) => {
        if (e.target === dom.modalBackdrop) closeGameModal();
      });
    }

    // Copy Title Button in Modal
    if (dom.modalCopyBtn) {
      dom.modalCopyBtn.addEventListener('click', () => {
        if (!state.selectedGame) return;
        navigator.clipboard.writeText(state.selectedGame.cleanTitle).then(() => {
          showToast('Título copiado para a área de transferência!');
        });
      });
    }

    // Browser History PopState (Back/Forward)
    window.addEventListener('popstate', (e) => {
      const plat = detectInitialPlatform();
      if (plat && plat.id !== state.currentPlatform.id) {
        state.currentPlatform = plat;
        applyPlatformTheme(plat);
        loadPlatformData(plat);
      }
    });
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

  // --------------------------------------------------------------------------
  // Document Ready Bootstrap
  // --------------------------------------------------------------------------
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

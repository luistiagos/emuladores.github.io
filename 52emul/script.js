function initSwipers() {
    // Init Video Swiper
    new Swiper(".mySwiper", {
        spaceBetween: 30,
        navigation: {
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
        },
        pagination: {
            el: ".swiper-pagination",
            clickable: true,
        },
    });

    // Init Reviews Swiper
    new Swiper(".reviewsSwiper", {
        slidesPerView: 1,
        spaceBetween: 20,
        breakpoints: {
            640: { slidesPerView: 2 },
            768: { slidesPerView: 3 },
        },
        pagination: {
            el: ".swiper-pagination",
            clickable: true,
            dynamicBullets: true,
        },
        navigation: {
            nextEl: ".swiper-button-next-review",
            prevEl: ".swiper-button-prev-review",
        },
        autoplay: {
            delay: 3000,
            disableOnInteraction: false,
        },
    });

    // Init Games Carousel Swiper 1 (Forward)
    new Swiper(".gamesSwiper", {
        slidesPerView: "auto",
        spaceBetween: 20,
        centeredSlides: true,
        loop: true,
        navigation: {
            nextEl: ".swiper-button-next-games",
            prevEl: ".swiper-button-prev-games",
        },
        autoplay: {
            delay: 2000,
            disableOnInteraction: false,
        },
        breakpoints: {
            640: {
                spaceBetween: 20,
            },
            768: {
                spaceBetween: 30,
            },
            1024: {
                spaceBetween: 40,
            },
        },
    });

    // Init Games Carousel Swiper 2 (Reverse)
    new Swiper(".gamesSwiper2", {
        slidesPerView: "auto",
        spaceBetween: 20,
        centeredSlides: true,
        loop: true,
        navigation: {
            nextEl: ".swiper-button-next-games2",
            prevEl: ".swiper-button-prev-games2",
        },
        autoplay: {
            delay: 2000,
            disableOnInteraction: false,
            reverseDirection: true,
        },
        breakpoints: {
            640: {
                spaceBetween: 20,
            },
            768: {
                spaceBetween: 30,
            },
            1024: {
                spaceBetween: 40,
            },
        },
    });

    // Init Games Carousel Swiper 3 (Forward)
    new Swiper(".gamesSwiper3", {
        slidesPerView: "auto",
        spaceBetween: 20,
        centeredSlides: true,
        loop: true,
        navigation: {
            nextEl: ".swiper-button-next-games3",
            prevEl: ".swiper-button-prev-games3",
        },
        autoplay: {
            delay: 2500, // Slight offset
            disableOnInteraction: false,
        },
        breakpoints: {
            640: {
                spaceBetween: 20,
            },
            768: {
                spaceBetween: 30,
            },
            1024: {
                spaceBetween: 40,
            },
        },
    });
}

// Defer Swiper Init to avoid blocking main thread on load
if (document.readyState === 'complete') {
    requestIdleCallback(() => initSwipers());
} else {
    window.addEventListener('load', () => {
        requestIdleCallback(() => initSwipers());
    });
}

// FAQ Toggle
document.querySelectorAll('.faq-question').forEach(item => {
    item.addEventListener('click', event => {
        const parent = item.parentNode;
        parent.classList.toggle('active');
    });
});

// Smart Hide Floating Elements (WhatsApp & Notifications)
// Optimized to reduce DOM queries
const ctaObserver = new IntersectionObserver((entries) => {
    let shouldCheck = false;
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
        } else {
            entry.target.classList.remove('is-visible');
        }
        shouldCheck = true;
    });

    if (shouldCheck) {
        // Optimized: Check only class presence on observed elements if needed, 
        // but here we just check if any of the observed elements has the class.
        // We can do this by keeping track of the set of visible elements, but querySelectorAll is acceptable if throttled by IntersectionObserver nature.
        const anyVisible = document.querySelectorAll('.btn-pulse.is-visible').length > 0;
        if (anyVisible) {
            document.body.classList.add('hide-floating-elements');
        } else {
            document.body.classList.remove('hide-floating-elements');
        }
    }
}, { threshold: 0 });

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.btn-pulse').forEach(btn => {
        ctaObserver.observe(btn);
    });
});

// --- Compatibility Modal Logic ---

// Data from the Excel conversion (Ported)
const compatData = [
    { "PLATAFORMA": "Super Nintendo", "PC / NOTEBOOK": "X", "CELULAR / TABLET": "X", "TVBOX": "X", "SMARTV ANDROID": "X", "STEAM DECK": "X", "GAMESTICKS": "X", "XBOX ONE / SERIES (Modo Desenvolvedor)": "X", "XBOX 360 (rgh/jtag)": "X", "PS2": "X", "PS3 (Desbloqueado)": "X", "Raspberry Pi": "X", "PSP (Desbloqueado)": "X" },
    { "PLATAFORMA": "Nintendo 64", "PC / NOTEBOOK": "X", "CELULAR / TABLET": "X", "TVBOX": "X", "SMARTV ANDROID": "X", "STEAM DECK": "X", "GAMESTICKS": "X", "XBOX ONE / SERIES (Modo Desenvolvedor)": "X", "XBOX 360 (rgh/jtag)": "X", "PS2": "X", "PS3 (Desbloqueado)": "X", "Raspberry Pi": "X", "PSP (Desbloqueado)": "X" },
    { "PLATAFORMA": "Nintendo", "PC / NOTEBOOK": "X", "CELULAR / TABLET": "X", "TVBOX": "X", "SMARTV ANDROID": "X", "STEAM DECK": "X", "GAMESTICKS": "X", "XBOX ONE / SERIES (Modo Desenvolvedor)": "X", "XBOX 360 (rgh/jtag)": "X", "PS2": "X", "PS3 (Desbloqueado)": "X", "Raspberry Pi": "X", "PSP (Desbloqueado)": "X" },
    { "PLATAFORMA": "Nintendo WII", "PC / NOTEBOOK": "X", "CELULAR / TABLET": null, "TVBOX": null, "SMARTV ANDROID": null, "STEAM DECK": "X", "GAMESTICKS": null, "XBOX ONE / SERIES (Modo Desenvolvedor)": null, "XBOX 360 (rgh/jtag)": null, "PS2": null, "PS3 (Desbloqueado)": null, "Raspberry Pi": null, "PSP (Desbloqueado)": null },
    { "PLATAFORMA": "Nintendo 3DS", "PC / NOTEBOOK": "X", "CELULAR / TABLET": "X", "TVBOX": null, "SMARTV ANDROID": null, "STEAM DECK": "X", "GAMESTICKS": null, "XBOX ONE / SERIES (Modo Desenvolvedor)": "X", "XBOX 360 (rgh/jtag)": null, "PS2": null, "PS3 (Desbloqueado)": null, "Raspberry Pi": null, "PSP (Desbloqueado)": null },
    { "PLATAFORMA": "Game Boy ", "PC / NOTEBOOK": "X", "CELULAR / TABLET": "X", "TVBOX": "X", "SMARTV ANDROID": "X", "STEAM DECK": "X", "GAMESTICKS": "X", "XBOX ONE / SERIES (Modo Desenvolvedor)": "X", "XBOX 360 (rgh/jtag)": "X", "PS2": "X", "PS3 (Desbloqueado)": "X", "Raspberry Pi": "X", "PSP (Desbloqueado)": "X" },
    { "PLATAFORMA": "Game Boy Color", "PC / NOTEBOOK": "X", "CELULAR / TABLET": "X", "TVBOX": "X", "SMARTV ANDROID": "X", "STEAM DECK": "X", "GAMESTICKS": "X", "XBOX ONE / SERIES (Modo Desenvolvedor)": "X", "XBOX 360 (rgh/jtag)": "X", "PS2": "X", "PS3 (Desbloqueado)": "X", "Raspberry Pi": "X", "PSP (Desbloqueado)": "X" },
    { "PLATAFORMA": "Game Boy Advance", "PC / NOTEBOOK": "X", "CELULAR / TABLET": "X", "TVBOX": "X", "SMARTV ANDROID": "X", "STEAM DECK": "X", "GAMESTICKS": "X", "XBOX ONE / SERIES (Modo Desenvolvedor)": "X", "XBOX 360 (rgh/jtag)": "X", "PS2": "X", "PS3 (Desbloqueado)": "X", "Raspberry Pi": null, "PSP (Desbloqueado)": "X" },
    { "PLATAFORMA": "Nintendo DS", "PC / NOTEBOOK": "X", "CELULAR / TABLET": "X", "TVBOX": "X", "SMARTV ANDROID": "X", "STEAM DECK": "X", "GAMESTICKS": "X", "XBOX ONE / SERIES (Modo Desenvolvedor)": "X", "XBOX 360 (rgh/jtag)": "X", "PS2": "X", "PS3 (Desbloqueado)": "X", "Raspberry Pi": "X", "PSP (Desbloqueado)": "X" },
    { "PLATAFORMA": "Gamecube", "PC / NOTEBOOK": "X", "CELULAR / TABLET": "X", "TVBOX": "X", "SMARTV ANDROID": "X", "STEAM DECK": "X", "GAMESTICKS": "X", "XBOX ONE / SERIES (Modo Desenvolvedor)": "X", "XBOX 360 (rgh/jtag)": "X", "PS2": "X", "PS3 (Desbloqueado)": "X", "Raspberry Pi": "X", "PSP (Desbloqueado)": "X" },
    { "PLATAFORMA": "Mega Drive", "PC / NOTEBOOK": "X", "CELULAR / TABLET": "X", "TVBOX": "X", "SMARTV ANDROID": "X", "STEAM DECK": "X", "GAMESTICKS": "X", "XBOX ONE / SERIES (Modo Desenvolvedor)": "X", "XBOX 360 (rgh/jtag)": "X", "PS2": "X", "PS3 (Desbloqueado)": "X", "Raspberry Pi": "X", "PSP (Desbloqueado)": "X" },
    { "PLATAFORMA": "Dreamcast", "PC / NOTEBOOK": "X", "CELULAR / TABLET": "X", "TVBOX": "X", "SMARTV ANDROID": "X", "STEAM DECK": "X", "GAMESTICKS": "X", "XBOX ONE / SERIES (Modo Desenvolvedor)": "X", "XBOX 360 (rgh/jtag)": "X", "PS2": "X", "PS3 (Desbloqueado)": "X", "Raspberry Pi": null, "PSP (Desbloqueado)": "X" },
    { "PLATAFORMA": "Sega Master System", "PC / NOTEBOOK": "X", "CELULAR / TABLET": "X", "TVBOX": "X", "SMARTV ANDROID": "X", "STEAM DECK": "X", "GAMESTICKS": "X", "XBOX ONE / SERIES (Modo Desenvolvedor)": "X", "XBOX 360 (rgh/jtag)": "X", "PS2": "X", "PS3 (Desbloqueado)": "X", "Raspberry Pi": "X", "PSP (Desbloqueado)": "X" },
    { "PLATAFORMA": "Sega 32X", "PC / NOTEBOOK": "X", "CELULAR / TABLET": "X", "TVBOX": "X", "SMARTV ANDROID": "X", "STEAM DECK": "X", "GAMESTICKS": "X", "XBOX ONE / SERIES (Modo Desenvolvedor)": "X", "XBOX 360 (rgh/jtag)": "X", "PS2": "X", "PS3 (Desbloqueado)": "X", "Raspberry Pi": "X", "PSP (Desbloqueado)": "X" },
    { "PLATAFORMA": "Mame", "PC / NOTEBOOK": "X", "CELULAR / TABLET": "X", "TVBOX": "X", "SMARTV ANDROID": "X", "STEAM DECK": "X", "GAMESTICKS": "X", "XBOX ONE / SERIES (Modo Desenvolvedor)": "X", "XBOX 360 (rgh/jtag)": "X", "PS2": "X", "PS3 (Desbloqueado)": "X", "Raspberry Pi": "X", "PSP (Desbloqueado)": "X" },
    { "PLATAFORMA": "Neogeopocket color", "PC / NOTEBOOK": "X", "CELULAR / TABLET": "X", "TVBOX": "X", "SMARTV ANDROID": "X", "STEAM DECK": "X", "GAMESTICKS": "X", "XBOX ONE / SERIES (Modo Desenvolvedor)": "X", "XBOX 360 (rgh/jtag)": "X", "PS2": "X", "PS3 (Desbloqueado)": "X", "Raspberry Pi": "X", "PSP (Desbloqueado)": "X" },
    { "PLATAFORMA": "Atari 2600", "PC / NOTEBOOK": "X", "CELULAR / TABLET": "X", "TVBOX": "X", "SMARTV ANDROID": "X", "STEAM DECK": "X", "GAMESTICKS": "X", "XBOX ONE / SERIES (Modo Desenvolvedor)": "X", "XBOX 360 (rgh/jtag)": "X", "PS2": "X", "PS3 (Desbloqueado)": "X", "Raspberry Pi": "X", "PSP (Desbloqueado)": "X" },
    { "PLATAFORMA": "Atari 5200", "PC / NOTEBOOK": "X", "CELULAR / TABLET": "X", "TVBOX": "X", "SMARTV ANDROID": "X", "STEAM DECK": "X", "GAMESTICKS": "X", "XBOX ONE / SERIES (Modo Desenvolvedor)": "X", "XBOX 360 (rgh/jtag)": "X", "PS2": "X", "PS3 (Desbloqueado)": "X", "Raspberry Pi": "X", "PSP (Desbloqueado)": "X" },
    { "PLATAFORMA": "Atari 7800", "PC / NOTEBOOK": "X", "CELULAR / TABLET": "X", "TVBOX": "X", "SMARTV ANDROID": "X", "STEAM DECK": "X", "GAMESTICKS": "X", "XBOX ONE / SERIES (Modo Desenvolvedor)": "X", "XBOX 360 (rgh/jtag)": "X", "PS2": "X", "PS3 (Desbloqueado)": "X", "Raspberry Pi": "X", "PSP (Desbloqueado)": "X" },
    { "PLATAFORMA": "TurboGrafx", "PC / NOTEBOOK": "X", "CELULAR / TABLET": "X", "TVBOX": "X", "SMARTV ANDROID": null, "STEAM DECK": "X", "GAMESTICKS": "X", "XBOX ONE / SERIES (Modo Desenvolvedor)": "X", "XBOX 360 (rgh/jtag)": null, "PS2": null, "PS3 (Desbloqueado)": "X", "Raspberry Pi": null, "PSP (Desbloqueado)": null },
    { "PLATAFORMA": "ZX Spectrum", "PC / NOTEBOOK": "X", "CELULAR / TABLET": "X", "TVBOX": "X", "SMARTV ANDROID": null, "STEAM DECK": "X", "GAMESTICKS": "X", "XBOX ONE / SERIES (Modo Desenvolvedor)": "X", "XBOX 360 (rgh/jtag)": null, "PS2": null, "PS3 (Desbloqueado)": "X", "Raspberry Pi": null, "PSP (Desbloqueado)": null },
    { "PLATAFORMA": "Panasonic 3DO Interactive Multiplayer", "PC / NOTEBOOK": "X", "CELULAR / TABLET": "X", "TVBOX": null, "SMARTV ANDROID": null, "STEAM DECK": "X", "GAMESTICKS": null, "XBOX ONE / SERIES (Modo Desenvolvedor)": "X", "XBOX 360 (rgh/jtag)": null, "PS2": null, "PS3 (Desbloqueado)": null, "Raspberry Pi": null, "PSP (Desbloqueado)": null },
    { "PLATAFORMA": "WIIU", "PC / NOTEBOOK": "X", "CELULAR / TABLET": null, "TVBOX": null, "SMARTV ANDROID": null, "STEAM DECK": "X", "GAMESTICKS": null, "XBOX ONE / SERIES (Modo Desenvolvedor)": null, "XBOX 360 (rgh/jtag)": null, "PS2": null, "PS3 (Desbloqueado)": null, "Raspberry Pi": null, "PSP (Desbloqueado)": null },
    { "PLATAFORMA": "Playstation 1", "PC / NOTEBOOK": "X", "CELULAR / TABLET": "X", "TVBOX": "X", "SMARTV ANDROID": "X", "STEAM DECK": "X", "GAMESTICKS": "X", "XBOX ONE / SERIES (Modo Desenvolvedor)": "X", "XBOX 360 (rgh/jtag)": "X", "PS2": "X", "PS3 (Desbloqueado)": "X", "Raspberry Pi": "X", "PSP (Desbloqueado)": "X" },
    { "PLATAFORMA": "Playstation 2", "PC / NOTEBOOK": "X", "CELULAR / TABLET": "X", "TVBOX": null, "SMARTV ANDROID": null, "STEAM DECK": "X", "GAMESTICKS": null, "XBOX ONE / SERIES (Modo Desenvolvedor)": "X", "XBOX 360 (rgh/jtag)": null, "PS2": "X", "PS3 (Desbloqueado)": "X", "Raspberry Pi": null, "PSP (Desbloqueado)": null },
    { "PLATAFORMA": "Playstation 3", "PC / NOTEBOOK": "X", "CELULAR / TABLET": null, "TVBOX": null, "SMARTV ANDROID": null, "STEAM DECK": "X", "GAMESTICKS": null, "XBOX ONE / SERIES (Modo Desenvolvedor)": null, "XBOX 360 (rgh/jtag)": null, "PS2": null, "PS3 (Desbloqueado)": "X", "Raspberry Pi": null, "PSP (Desbloqueado)": null },
    { "PLATAFORMA": "Xbox Classico", "PC / NOTEBOOK": "X", "CELULAR / TABLET": null, "TVBOX": null, "SMARTV ANDROID": null, "STEAM DECK": "X", "GAMESTICKS": null, "XBOX ONE / SERIES (Modo Desenvolvedor)": "X", "XBOX 360 (rgh/jtag)": null, "PS2": null, "PS3 (Desbloqueado)": null, "Raspberry Pi": null, "PSP (Desbloqueado)": null },
    { "PLATAFORMA": "Xbox 360", "PC / NOTEBOOK": "X", "CELULAR / TABLET": null, "TVBOX": null, "SMARTV ANDROID": null, "STEAM DECK": "X", "GAMESTICKS": null, "XBOX ONE / SERIES (Modo Desenvolvedor)": "X", "XBOX 360 (rgh/jtag)": "X", "PS2": null, "PS3 (Desbloqueado)": null, "Raspberry Pi": null, "PSP (Desbloqueado)": null },
    { "PLATAFORMA": "Switch", "PC / NOTEBOOK": "X", "CELULAR / TABLET": null, "TVBOX": null, "SMARTV ANDROID": null, "STEAM DECK": null, "GAMESTICKS": null, "XBOX ONE / SERIES (Modo Desenvolvedor)": null, "XBOX 360 (rgh/jtag)": null, "PS2": null, "PS3 (Desbloqueado)": null, "Raspberry Pi": null, "PSP (Desbloqueado)": null },
    { "PLATAFORMA": "PSP", "PC / NOTEBOOK": "X", "CELULAR / TABLET": "X", "TVBOX": "X", "SMARTV ANDROID": "X", "STEAM DECK": "X", "GAMESTICKS": "X", "XBOX ONE / SERIES (Modo Desenvolvedor)": "X", "XBOX 360 (rgh/jtag)": "X", "PS2": "X", "PS3 (Desbloqueado)": "X", "Raspberry Pi": null, "PSP (Desbloqueado)": "X" },
    { "PLATAFORMA": "PC Engine", "PC / NOTEBOOK": "X", "CELULAR / TABLET": "X", "TVBOX": "X", "SMARTV ANDROID": "X", "STEAM DECK": "X", "GAMESTICKS": "X", "XBOX ONE / SERIES (Modo Desenvolvedor)": "X", "XBOX 360 (rgh/jtag)": "X", "PS2": "X", "PS3 (Desbloqueado)": "X", "Raspberry Pi": "X", "PSP (Desbloqueado)": "X" },
    { "PLATAFORMA": "Neo Geo", "PC / NOTEBOOK": "X", "CELULAR / TABLET": "X", "TVBOX": "X", "SMARTV ANDROID": "X", "STEAM DECK": "X", "GAMESTICKS": "X", "XBOX ONE / SERIES (Modo Desenvolvedor)": "X", "XBOX 360 (rgh/jtag)": "X", "PS2": "X", "PS3 (Desbloqueado)": "X", "Raspberry Pi": "X", "PSP (Desbloqueado)": "X" },
    { "PLATAFORMA": "Capcom", "PC / NOTEBOOK": "X", "CELULAR / TABLET": "X", "TVBOX": "X", "SMARTV ANDROID": "X", "STEAM DECK": "X", "GAMESTICKS": "X", "XBOX ONE / SERIES (Modo Desenvolvedor)": "X", "XBOX 360 (rgh/jtag)": "X", "PS2": "X", "PS3 (Desbloqueado)": "X", "Raspberry Pi": "X", "PSP (Desbloqueado)": "X" },
    { "PLATAFORMA": "Taito", "PC / NOTEBOOK": "X", "CELULAR / TABLET": "X", "TVBOX": "X", "SMARTV ANDROID": "X", "STEAM DECK": "X", "GAMESTICKS": "X", "XBOX ONE / SERIES (Modo Desenvolvedor)": "X", "XBOX 360 (rgh/jtag)": "X", "PS2": "X", "PS3 (Desbloqueado)": "X", "Raspberry Pi": "X", "PSP (Desbloqueado)": "X" },
    { "PLATAFORMA": "Sega", "PC / NOTEBOOK": "X", "CELULAR / TABLET": "X", "TVBOX": "X", "SMARTV ANDROID": "X", "STEAM DECK": "X", "GAMESTICKS": "X", "XBOX ONE / SERIES (Modo Desenvolvedor)": "X", "XBOX 360 (rgh/jtag)": "X", "PS2": "X", "PS3 (Desbloqueado)": "X", "Raspberry Pi": "X", "PSP (Desbloqueado)": "X" },
    { "PLATAFORMA": "Sega SG-1000", "PC / NOTEBOOK": "X", "CELULAR / TABLET": "X", "TVBOX": "X", "SMARTV ANDROID": "X", "STEAM DECK": "X", "GAMESTICKS": "X", "XBOX ONE / SERIES (Modo Desenvolvedor)": "X", "XBOX 360 (rgh/jtag)": "X", "PS2": "X", "PS3 (Desbloqueado)": "X", "Raspberry Pi": "X", "PSP (Desbloqueado)": "X" },
    { "PLATAFORMA": "Game Gear", "PC / NOTEBOOK": "X", "CELULAR / TABLET": "X", "TVBOX": "X", "SMARTV ANDROID": "X", "STEAM DECK": "X", "GAMESTICKS": "X", "XBOX ONE / SERIES (Modo Desenvolvedor)": "X", "XBOX 360 (rgh/jtag)": "X", "PS2": "X", "PS3 (Desbloqueado)": "X", "Raspberry Pi": "X", "PSP (Desbloqueado)": "X" },
    { "PLATAFORMA": "Cave", "PC / NOTEBOOK": "X", "CELULAR / TABLET": "X", "TVBOX": "X", "SMARTV ANDROID": "X", "STEAM DECK": "X", "GAMESTICKS": "X", "XBOX ONE / SERIES (Modo Desenvolvedor)": "X", "XBOX 360 (rgh/jtag)": "X", "PS2": "X", "PS3 (Desbloqueado)": "X", "Raspberry Pi": "X", "PSP (Desbloqueado)": "X" },
    { "PLATAFORMA": "CPS1", "PC / NOTEBOOK": "X", "CELULAR / TABLET": "X", "TVBOX": "X", "SMARTV ANDROID": "X", "STEAM DECK": "X", "GAMESTICKS": "X", "XBOX ONE / SERIES (Modo Desenvolvedor)": "X", "XBOX 360 (rgh/jtag)": "X", "PS2": "X", "PS3 (Desbloqueado)": "X", "Raspberry Pi": "X", "PSP (Desbloqueado)": "X" },
    { "PLATAFORMA": "CPS2", "PC / NOTEBOOK": "X", "CELULAR / TABLET": "X", "TVBOX": "X", "SMARTV ANDROID": "X", "STEAM DECK": "X", "GAMESTICKS": "X", "XBOX ONE / SERIES (Modo Desenvolvedor)": "X", "XBOX 360 (rgh/jtag)": "X", "PS2": "X", "PS3 (Desbloqueado)": "X", "Raspberry Pi": "X", "PSP (Desbloqueado)": "X" },
    { "PLATAFORMA": "CPS3", "PC / NOTEBOOK": "X", "CELULAR / TABLET": "X", "TVBOX": "X", "SMARTV ANDROID": "X", "STEAM DECK": "X", "GAMESTICKS": "X", "XBOX ONE / SERIES (Modo Desenvolvedor)": "X", "XBOX 360 (rgh/jtag)": "X", "PS2": "X", "PS3 (Desbloqueado)": "X", "Raspberry Pi": "X", "PSP (Desbloqueado)": "X" },
    { "PLATAFORMA": "Coleco Vision", "PC / NOTEBOOK": "X", "CELULAR / TABLET": "X", "TVBOX": "X", "SMARTV ANDROID": "X", "STEAM DECK": "X", "GAMESTICKS": "X", "XBOX ONE / SERIES (Modo Desenvolvedor)": "X", "XBOX 360 (rgh/jtag)": "X", "PS2": "X", "PS3 (Desbloqueado)": "X", "Raspberry Pi": "X", "PSP (Desbloqueado)": "X" },
    { "PLATAFORMA": "Data East", "PC / NOTEBOOK": "X", "CELULAR / TABLET": "X", "TVBOX": "X", "SMARTV ANDROID": "X", "STEAM DECK": "X", "GAMESTICKS": "X", "XBOX ONE / SERIES (Modo Desenvolvedor)": "X", "XBOX 360 (rgh/jtag)": "X", "PS2": "X", "PS3 (Desbloqueado)": "X", "Raspberry Pi": "X", "PSP (Desbloqueado)": "X" },
    { "PLATAFORMA": "Galaxian", "PC / NOTEBOOK": "X", "CELULAR / TABLET": "X", "TVBOX": "X", "SMARTV ANDROID": "X", "STEAM DECK": "X", "GAMESTICKS": "X", "XBOX ONE / SERIES (Modo Desenvolvedor)": "X", "XBOX 360 (rgh/jtag)": "X", "PS2": "X", "PS3 (Desbloqueado)": "X", "Raspberry Pi": "X", "PSP (Desbloqueado)": "X" },
    { "PLATAFORMA": "MSX", "PC / NOTEBOOK": "X", "CELULAR / TABLET": "X", "TVBOX": "X", "SMARTV ANDROID": "X", "STEAM DECK": "X", "GAMESTICKS": "X", "XBOX ONE / SERIES (Modo Desenvolvedor)": "X", "XBOX 360 (rgh/jtag)": "X", "PS2": "X", "PS3 (Desbloqueado)": "X", "Raspberry Pi": "X", "PSP (Desbloqueado)": "X" },
    { "PLATAFORMA": "Irem Arcade Classics", "PC / NOTEBOOK": "X", "CELULAR / TABLET": "X", "TVBOX": "X", "SMARTV ANDROID": "X", "STEAM DECK": "X", "GAMESTICKS": "X", "XBOX ONE / SERIES (Modo Desenvolvedor)": "X", "XBOX 360 (rgh/jtag)": "X", "PS2": "X", "PS3 (Desbloqueado)": "X", "Raspberry Pi": "X", "PSP (Desbloqueado)": "X" },
    { "PLATAFORMA": "Kaneko", "PC / NOTEBOOK": "X", "CELULAR / TABLET": "X", "TVBOX": "X", "SMARTV ANDROID": "X", "STEAM DECK": "X", "GAMESTICKS": "X", "XBOX ONE / SERIES (Modo Desenvolvedor)": "X", "XBOX 360 (rgh/jtag)": "X", "PS2": "X", "PS3 (Desbloqueado)": "X", "Raspberry Pi": "X", "PSP (Desbloqueado)": "X" },
    { "PLATAFORMA": "Konami", "PC / NOTEBOOK": "X", "CELULAR / TABLET": "X", "TVBOX": "X", "SMARTV ANDROID": "X", "STEAM DECK": "X", "GAMESTICKS": "X", "XBOX ONE / SERIES (Modo Desenvolvedor)": "X", "XBOX 360 (rgh/jtag)": "X", "PS2": "X", "PS3 (Desbloqueado)": "X", "Raspberry Pi": "X", "PSP (Desbloqueado)": "X" },
    { "PLATAFORMA": "Pac Man", "PC / NOTEBOOK": "X", "CELULAR / TABLET": "X", "TVBOX": "X", "SMARTV ANDROID": "X", "STEAM DECK": "X", "GAMESTICKS": "X", "XBOX ONE / SERIES (Modo Desenvolvedor)": "X", "XBOX 360 (rgh/jtag)": "X", "PS2": "X", "PS3 (Desbloqueado)": "X", "Raspberry Pi": "X", "PSP (Desbloqueado)": "X" },
    { "PLATAFORMA": "PGM", "PC / NOTEBOOK": "X", "CELULAR / TABLET": "X", "TVBOX": "X", "SMARTV ANDROID": "X", "STEAM DECK": "X", "GAMESTICKS": "X", "XBOX ONE / SERIES (Modo Desenvolvedor)": "X", "XBOX 360 (rgh/jtag)": "X", "PS2": "X", "PS3 (Desbloqueado)": "X", "Raspberry Pi": "X", "PSP (Desbloqueado)": "X" },
    { "PLATAFORMA": "Psikyo", "PC / NOTEBOOK": "X", "CELULAR / TABLET": "X", "TVBOX": "X", "SMARTV ANDROID": "X", "STEAM DECK": "X", "GAMESTICKS": "X", "XBOX ONE / SERIES (Modo Desenvolvedor)": "X", "XBOX 360 (rgh/jtag)": "X", "PS2": "X", "PS3 (Desbloqueado)": "X", "Raspberry Pi": "X", "PSP (Desbloqueado)": "X" },
    { "PLATAFORMA": "Seta", "PC / NOTEBOOK": "X", "CELULAR / TABLET": "X", "TVBOX": "X", "SMARTV ANDROID": "X", "STEAM DECK": "X", "GAMESTICKS": "X", "XBOX ONE / SERIES (Modo Desenvolvedor)": "X", "XBOX 360 (rgh/jtag)": "X", "PS2": "X", "PS3 (Desbloqueado)": "X", "Raspberry Pi": "X", "PSP (Desbloqueado)": "X" },
    { "PLATAFORMA": "Technos", "PC / NOTEBOOK": "X", "CELULAR / TABLET": "X", "TVBOX": "X", "SMARTV ANDROID": "X", "STEAM DECK": "X", "GAMESTICKS": "X", "XBOX ONE / SERIES (Modo Desenvolvedor)": "X", "XBOX 360 (rgh/jtag)": "X", "PS2": "X", "PS3 (Desbloqueado)": "X", "Raspberry Pi": "X", "PSP (Desbloqueado)": "X" },
    { "PLATAFORMA": "Toaplan", "PC / NOTEBOOK": "X", "CELULAR / TABLET": "X", "TVBOX": "X", "SMARTV ANDROID": "X", "STEAM DECK": "X", "GAMESTICKS": "X", "XBOX ONE / SERIES (Modo Desenvolvedor)": "X", "XBOX 360 (rgh/jtag)": "X", "PS2": "X", "PS3 (Desbloqueado)": "X", "Raspberry Pi": "X", "PSP (Desbloqueado)": "X" },
    { "PLATAFORMA": "Misc. pre 90", "PC / NOTEBOOK": "X", "CELULAR / TABLET": "X", "TVBOX": "X", "SMARTV ANDROID": "X", "STEAM DECK": "X", "GAMESTICKS": "X", "XBOX ONE / SERIES (Modo Desenvolvedor)": "X", "XBOX 360 (rgh/jtag)": "X", "PS2": "X", "PS3 (Desbloqueado)": "X", "Raspberry Pi": "X", "PSP (Desbloqueado)": "X" },
    { "PLATAFORMA": "Misc. pos 90", "PC / NOTEBOOK": "X", "CELULAR / TABLET": "X", "TVBOX": "X", "SMARTV ANDROID": "X", "STEAM DECK": "X", "GAMESTICKS": "X", "XBOX ONE / SERIES (Modo Desenvolvedor)": "X", "XBOX 360 (rgh/jtag)": "X", "PS2": "X", "PS3 (Desbloqueado)": "X", "Raspberry Pi": "X", "PSP (Desbloqueado)": "X" }
];

function renderCompatTable() {
    const table = document.getElementById('modalCompatTable');
    if (!table) return; // Guard for pages without the modal (although logic is in script.js which is global)

    const thead = table.querySelector('thead tr');
    const tbody = table.querySelector('tbody');

    // Optimization: Check if table is already populated to avoid re-render
    if (tbody.children.length > 0) return;

    // Filter data
    const tableRows = compatData.filter(row =>
        row.PLATAFORMA && !row.PLATAFORMA.includes("Configurações")
    );
    if (tableRows.length === 0) return;

    // Get headers (Devices)
    const devices = Object.keys(tableRows[0]).filter(key => key !== 'PLATAFORMA');

    // Render Headers (Clearing first to be safe)
    thead.innerHTML = '<th>Plataforma (Console)</th>';
    devices.forEach(device => {
        const th = document.createElement('th');
        th.textContent = device;
        thead.appendChild(th);
    });

    // Render Body
    const fragment = document.createDocumentFragment();
    tableRows.forEach(row => {
        const tr = document.createElement('tr');

        // Platform Name
        const tdName = document.createElement('td');
        tdName.textContent = row.PLATAFORMA;
        tr.appendChild(tdName);

        // Cells
        devices.forEach(device => {
            const td = document.createElement('td');
            const isCompatible = row[device] === 'X';
            if (isCompatible) {
                td.innerHTML = '<i class="fas fa-check-circle status-icon status-yes"></i>';
            } else {
                td.innerHTML = '<i class="fas fa-times status-icon status-no"></i>';
            }
            tr.appendChild(td);
        });
        fragment.appendChild(tr);
    });
    tbody.appendChild(fragment);
}

function openCompatModal() {
    const modal = document.getElementById('compatModal');
    if (modal) {
        // Render the table if not already done
        renderCompatTable();

        modal.style.display = 'flex';
        // Force reflow
        void modal.offsetWidth;
        modal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }
}

function closeCompatModal() {
    const modal = document.getElementById('compatModal');
    if (modal) {
        modal.classList.remove('active');
        setTimeout(() => {
            modal.style.display = 'none';
        }, 300); // Match transition duration
        document.body.style.overflow = '';
    }
}

// Close on click outside
document.addEventListener('click', (e) => {
    const modal = document.getElementById('compatModal');
    if (e.target === modal) {
        closeCompatModal();
    }
});

// Close on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeCompatModal();
    }
});

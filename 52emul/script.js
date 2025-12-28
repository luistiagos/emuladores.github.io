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

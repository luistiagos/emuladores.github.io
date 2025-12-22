// Init Video Swiper
var swiper = new Swiper(".mySwiper", {
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
var reviewsSwiper = new Swiper(".reviewsSwiper", {
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

// FAQ Toggle
document.querySelectorAll('.faq-question').forEach(item => {
    item.addEventListener('click', event => {
        const parent = item.parentNode;
        parent.classList.toggle('active');
    });
});
// Init Games Carousel Swiper 1 (Forward)
var gamesSwiper = new Swiper(".gamesSwiper", {
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
var gamesSwiper2 = new Swiper(".gamesSwiper2", {
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

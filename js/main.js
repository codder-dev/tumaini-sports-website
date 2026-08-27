// ===== CAROUSEL WITH KEN BURNS EFFECT (Text Fixed - Auto-detects slides) =====
document.addEventListener('DOMContentLoaded', function() {
    const slides = document.querySelectorAll('.carousel-slide');
    const dotsContainer = document.querySelector('.carousel-dots');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    let currentSlide = 0;
    let slideInterval;
    let isTransitioning = false;

    // ===== CREATE DOTS (Auto-detects number of slides) =====
    slides.forEach((_, index) => {
        const dot = document.createElement('span');
        dot.classList.add('dot');
        if (index === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(index));
        dotsContainer.appendChild(dot);
    });

    const dots = document.querySelectorAll('.dot');

    // ===== RESET SLIDE BACKGROUND (prepare for zoom) =====
    function resetSlideBg(slide) {
        const bg = slide.querySelector('.slide-bg');
        if (!bg) return;
        bg.style.transition = 'none';
        bg.style.transform = 'scale(1.15)';
        void bg.offsetHeight; // Force reflow
    }

    // ===== START ZOOM OUT ON SLIDE =====
    function startZoomOut(slide) {
        const bg = slide.querySelector('.slide-bg');
        if (!bg) return;
        bg.style.transition = 'transform 8s ease-out';
        bg.style.transform = 'scale(1)';
    }

    // ===== INITIALIZE ALL SLIDES =====
    function initializeSlides() {
        slides.forEach((slide) => {
            resetSlideBg(slide);
            if (slide.classList.contains('active')) {
                setTimeout(() => startZoomOut(slide), 100);
            }
        });
    }

    // ===== GO TO SLIDE =====
    function goToSlide(index) {
        if (isTransitioning) return;
        if (index === currentSlide) return;
        
        isTransitioning = true;
        
        const current = slides[currentSlide];
        const next = slides[index];
        
        // Exit current slide
        current.classList.add('exiting');
        
        // Prepare next slide
        resetSlideBg(next);
        next.classList.add('active');
        next.classList.add('next');
        
        void next.querySelector('.slide-bg').offsetHeight;
        startZoomOut(next);
        
        // Update dots
        dots.forEach(d => d.classList.remove('active'));
        dots[index].classList.add('active');
        
        // After transition completes
        setTimeout(() => {
            current.classList.remove('active');
            current.classList.remove('exiting');
            resetSlideBg(current);
            next.classList.remove('next');
            currentSlide = index;
            isTransitioning = false;
        }, 1200);
    }

    // ===== NEXT/PREV =====
    function nextSlide() {
        goToSlide((currentSlide + 1) % slides.length);
    }

    function prevSlide() {
        goToSlide((currentSlide - 1 + slides.length) % slides.length);
    }

    // ===== AUTO-SLIDE =====
    function startAutoSlide() {
        clearInterval(slideInterval);
        slideInterval = setInterval(nextSlide, 7000);
    }

    function resetAutoSlide() {
        clearInterval(slideInterval);
        startAutoSlide();
    }

    // ===== EVENT LISTENERS =====
    if (nextBtn) {
        nextBtn.addEventListener('click', () => { nextSlide(); resetAutoSlide(); });
    }
    if (prevBtn) {
        prevBtn.addEventListener('click', () => { prevSlide(); resetAutoSlide(); });
    }

    const carousel = document.querySelector('.carousel-container');
    if (carousel) {
        carousel.addEventListener('mouseenter', () => clearInterval(slideInterval));
        carousel.addEventListener('mouseleave', startAutoSlide);
    }

    // ===== INITIALIZE =====
    initializeSlides();
    startAutoSlide();


    // ===== HAMBURGER MENU =====
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    hamburger.addEventListener('click', function() {
        this.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close menu on link click (mobile)
    navMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // ===== STATS COUNTER ANIMATION =====
    const statNumbers = document.querySelectorAll('.stat-number');
    
    function animateStats() {
        statNumbers.forEach(stat => {
            const target = parseInt(stat.getAttribute('data-count'));
            const duration = 2000;
            const stepTime = 20;
            const steps = duration / stepTime;
            const increment = target / steps;
            let current = 0;

            const counter = setInterval(() => {
                current += increment;
                if (current >= target) {
                    stat.textContent = target + '+';
                    clearInterval(counter);
                } else {
                    stat.textContent = Math.floor(current);
                }
            }, stepTime);
        });
    }

    // Trigger stats on scroll
    const statsSection = document.querySelector('.quick-stats');
    let statsAnimated = false;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !statsAnimated) {
                statsAnimated = true;
                animateStats();
            }
        });
    }, { threshold: 0.3 });

    if (statsSection) {
        observer.observe(statsSection);
    }

    // ===== NAVBAR SCROLL EFFECT =====
    const navbar = document.getElementById('navbar');
    let lastScroll = 0;

    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
        
        if (currentScroll > 100) {
            navbar.style.boxShadow = '0 4px 30px rgba(0, 0, 0, 0.12)';
        } else {
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.06)';
        }
        
        lastScroll = currentScroll;
    });
});

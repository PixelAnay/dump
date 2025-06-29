document.addEventListener('DOMContentLoaded', function() {

    // --- CUSTOM CURSOR ---
    const cursor = document.querySelector('.cursor');
    const interactiveElements = document.querySelectorAll('a, button, .project-card');
    const formInputs = document.querySelectorAll('input[type="text"], input[type="email"], textarea');

    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;
    const smoothing = 0.2;

    window.addEventListener('mousemove', e => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function animateCursor() {
        cursorX += (mouseX - cursorX) * smoothing;
        cursorY += (mouseY - cursorY) * smoothing;
        cursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0)`;
        requestAnimationFrame(animateCursor);
    }
    animateCursor();

    interactiveElements.forEach(el => {
        el.addEventListener('mouseover', () => {
            if (el.classList.contains('interactive') || el.classList.contains('btn') || el.classList.contains('project-card')) {
                cursor.classList.add('grow');
            } else {
                cursor.classList.add('link-hover');
            }
            if (el.classList.contains('btn')) {
                el.classList.add('is-hovered');
            }
        });
        el.addEventListener('mouseleave', () => {
            cursor.classList.remove('grow');
            cursor.classList.remove('link-hover');
            if (el.classList.contains('btn')) {
                el.classList.remove('is-hovered');
            }
        });
    });
    
    formInputs.forEach(input => {
        input.addEventListener('focus', () => cursor.classList.add('typing'));
        input.addEventListener('blur', () => cursor.classList.remove('typing'));
    });

    // --- LIGHTBOX GALLERY LOGIC (NEW) ---
    const projectCards = document.querySelectorAll('.project-card');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = lightbox.querySelector('.lightbox-image');
    const lightboxCounter = document.getElementById('lightbox-counter');
    const lightboxClose = document.getElementById('lightbox-close');
    const lightboxPrev = document.getElementById('lightbox-prev');
    const lightboxNext = document.getElementById('lightbox-next');

    let currentGalleryImages = [];
    let currentIndex = 0;

    const showImage = (index) => {
        const image = currentGalleryImages[index];
        lightboxImg.src = image.src;
        lightboxImg.alt = image.alt;
        lightboxCounter.textContent = `${index + 1} / ${currentGalleryImages.length}`;
        currentIndex = index;
    };
    
    const openLightbox = (e) => {
        const card = e.currentTarget;
        const galleryId = card.dataset.galleryId;
        const gallery = document.getElementById(galleryId);
        currentGalleryImages = Array.from(gallery.querySelectorAll('img'));
        
        document.body.classList.add('lightbox-open');
        lightbox.classList.add('is-visible');
        showImage(0); // Show the first image
    };

    const closeLightbox = () => {
        document.body.classList.remove('lightbox-open');
        lightbox.classList.remove('is-visible');
    };

    const showNextImage = () => {
        const nextIndex = (currentIndex + 1) % currentGalleryImages.length;
        showImage(nextIndex);
    };

    const showPrevImage = () => {
        const prevIndex = (currentIndex - 1 + currentGalleryImages.length) % currentGalleryImages.length;
        showImage(prevIndex);
    };

    projectCards.forEach(card => card.addEventListener('click', openLightbox));
    lightboxClose.addEventListener('click', closeLightbox);
    lightboxNext.addEventListener('click', showNextImage);
    lightboxPrev.addEventListener('click', showPrevImage);

    // Close lightbox with Escape key
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox.classList.contains('is-visible')) {
            closeLightbox();
        }
    });
    // Close lightbox on background click
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });

    // --- HERO TEXT SPLIT & ANIMATE ---
    const textToSplit = document.querySelector('[data-text-split]');
    if (textToSplit) {
        const text = textToSplit.innerText;
        textToSplit.innerHTML = '';
        text.split('').forEach((char, index) => {
            const span = document.createElement('span');
            span.innerHTML = char === ' ' ? ' ' : char; // Use non-breaking space
            span.style.animationDelay = `${index * 0.04}s`;
            textToSplit.appendChild(span);
        });
    }


    // --- HIDE/SHOW HEADER ON SCROLL ---
    let lastScrollY = window.scrollY;
    const header = document.querySelector('.header');

    window.addEventListener('scroll', () => {
        if (lastScrollY < window.scrollY && window.scrollY > 100) {
            header.classList.add('hidden');
        } else {
            header.classList.remove('hidden');
        }
        lastScrollY = window.scrollY;
    });


    // --- MOBILE NAVIGATION ---
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.navbar');
    const navLinks = document.querySelectorAll('.nav-link');

    hamburger.addEventListener('click', () => {
        document.body.classList.toggle('nav-open');
        hamburger.classList.toggle('is-active');
        navMenu.classList.toggle('is-active');
    });
    
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            document.body.classList.remove('nav-open');
            hamburger.classList.remove('is-active');
            navMenu.classList.remove('is-active');
        });
    });


    // --- FADE-IN SECTION ON SCROLL (Intersection Observer) ---
    const sections = document.querySelectorAll('.content-section');

    const revealSection = (entries, observer) => {
        const [entry] = entries;
        if (!entry.isIntersecting) return;

        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
    };

    const sectionObserver = new IntersectionObserver(revealSection, {
        root: null,
        threshold: 0.1,
    });

    sections.forEach(section => {
        sectionObserver.observe(section);
    });

});
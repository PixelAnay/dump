document.addEventListener('DOMContentLoaded', function() {

    // --- CUSTOM CURSOR ---
    const cursor = document.querySelector('.cursor');
    const interactiveElements = document.querySelectorAll('a, button, .interactive, .enlarge-icon, .lightbox-nav, .lightbox-close');
    const formInputs = document.querySelectorAll('input[type="text"], input[type="email"], textarea');

    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;
    const smoothing = 0.2;

    window.addEventListener('mousemove', e => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function animateCursor() {
        if (document.body.classList.contains('lightbox-open')) return;
        cursorX += (mouseX - cursorX) * smoothing;
        cursorY += (mouseY - cursorY) * smoothing;
        cursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0)`;
        requestAnimationFrame(animateCursor);
    }
    animateCursor();

    interactiveElements.forEach(el => {
        el.addEventListener('mouseover', () => {
            if (el.classList.contains('interactive') || el.classList.contains('btn')) {
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


    // --- DESKTOP WORK SECTION INTERACTIVITY ---
    const workItemsDesktop = document.querySelectorAll('.work-item');
    const workPreviewContainer = document.querySelector('.work-image-preview');
    if (workPreviewContainer) {
        const workPreviewImg = workPreviewContainer.querySelector('img');
        const workTitlesContainer = document.querySelector('.work-titles');
        let currentActiveWorkItem = null;

        workItemsDesktop.forEach(item => {
            item.addEventListener('mouseover', function() {
                const imageUrl = this.dataset.image;
                workPreviewImg.src = imageUrl;
                workPreviewContainer.classList.add('is-visible');
                currentActiveWorkItem = this;
            });
        });

        workTitlesContainer.addEventListener('mouseleave', function() {
            workPreviewContainer.classList.remove('is-visible');
            currentActiveWorkItem = null;
        });

        workPreviewContainer.addEventListener('click', () => {
            if (currentActiveWorkItem) {
                const galleryImages = currentActiveWorkItem.dataset.galleryImages.split(',');
                openLightbox(galleryImages, 0);
            }
        });
    }


    // --- MOBILE WORK ACCORDION ---
    const workItemsMobile = document.querySelectorAll('.work-item-mobile');
    workItemsMobile.forEach(item => {
        const title = item.querySelector('.work-item-mobile__title');
        title.addEventListener('click', () => {
            // Close other items
            if (!item.classList.contains('is-active')) {
                workItemsMobile.forEach(otherItem => {
                    if (otherItem.classList.contains('is-active')) {
                        otherItem.classList.remove('is-active');
                        otherItem.querySelector('.work-item-mobile__title').setAttribute('aria-expanded', 'false');
                    }
                });
            }
            // Toggle current item
            item.classList.toggle('is-active');
            const isExpanded = item.classList.contains('is-active');
            title.setAttribute('aria-expanded', isExpanded);
        });
    });
    

    // --- IMAGE LIGHTBOX GALLERY ---
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = lightbox.querySelector('.lightbox-image');
    const lightboxClose = lightbox.querySelector('.lightbox-close');
    const lightboxPrev = lightbox.querySelector('.lightbox-prev');
    const lightboxNext = lightbox.querySelector('.lightbox-next');
    const mobileGalleries = document.querySelector('.work-list-mobile');

    let currentImageIndex;
    let currentGallery = [];

    function openLightbox(gallery, index) {
        document.body.classList.add('lightbox-open');
        currentGallery = gallery;
        currentImageIndex = index;
        updateLightboxImage();
        lightbox.classList.add('is-visible');
    }

    function closeLightbox() {
        document.body.classList.remove('lightbox-open');
        lightbox.classList.remove('is-visible');
    }

    function updateLightboxImage() {
        lightboxImg.src = currentGallery[currentImageIndex];
        lightboxPrev.style.display = currentImageIndex === 0 ? 'none' : 'block';
        lightboxNext.style.display = currentImageIndex === currentGallery.length - 1 ? 'none' : 'block';
    }

    function showNextImage() {
        if (currentImageIndex < currentGallery.length - 1) {
            currentImageIndex++;
            updateLightboxImage();
        }
    }

    function showPrevImage() {
        if (currentImageIndex > 0) {
            currentImageIndex--;
            updateLightboxImage();
        }
    }

    if (mobileGalleries) {
        mobileGalleries.addEventListener('click', function(e) {
            const enlargeIcon = e.target.closest('.enlarge-icon');
            if (enlargeIcon) {
                const wrapper = enlargeIcon.closest('.gallery-image-wrapper');
                const galleryContainer = wrapper.closest('.work-item-mobile__gallery');
                const images = Array.from(galleryContainer.querySelectorAll('img'));
                const gallerySrcs = images.map(img => img.src);
                const clickedIndex = images.findIndex(img => img === wrapper.querySelector('img'));
                
                openLightbox(gallerySrcs, clickedIndex);
            }
        });
    }

    lightboxClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => e.target === lightbox && closeLightbox());
    lightboxNext.addEventListener('click', showNextImage);
    lightboxPrev.addEventListener('click', showPrevImage);
    document.addEventListener('keydown', (e) => {
        if (lightbox.classList.contains('is-visible')) {
            if (e.key === 'ArrowRight') showNextImage();
            if (e.key === 'ArrowLeft') showPrevImage();
            if (e.key === 'Escape') closeLightbox();
        }
    });

    // --- HERO TEXT SPLIT & ANIMATE ---
    const textToSplit = document.querySelector('[data-text-split]');
    if (textToSplit) {
        const text = textToSplit.innerText;
        textToSplit.innerHTML = '';
        text.split('').forEach((char, index) => {
            const span = document.createElement('span');
            span.innerHTML = char === ' ' ? ' ' : char; // Use   for spaces
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
    });
    
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            document.body.classList.remove('nav-open');
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
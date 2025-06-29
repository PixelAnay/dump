document.addEventListener('DOMContentLoaded', function() {
    const body = document.body;

    // --- CUSTOM CURSOR ---
    const cursor = document.querySelector('.cursor');
    // Simplified selector for all interactive elements
    const interactiveElements = document.querySelectorAll('a, button, .interactive, .accordion-item__title, .gallery-image-wrapper, .lightbox__nav');
    const formInputs = document.querySelectorAll('input[type="text"], input[type="email"], textarea');

    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;
    const smoothing = 0.2;

    if (window.matchMedia("(pointer: fine)").matches) { // Only run cursor logic on devices with fine pointers (mice)
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
                if (el.classList.contains('interactive') || el.classList.contains('btn') || el.classList.contains('enlarge-btn') || el.classList.contains('lightbox__nav')) {
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
    }

    // --- WORK SECTION ACCORDION (UNIFIED FOR ALL DEVICES) ---
    const accordionItems = document.querySelectorAll('.accordion-item');
    accordionItems.forEach(item => {
        const title = item.querySelector('.accordion-item__title');
        title.addEventListener('click', () => {
            const wasActive = item.classList.contains('is-active');
            // Close all items
            accordionItems.forEach(otherItem => {
                otherItem.classList.remove('is-active');
                otherItem.querySelector('.accordion-item__title').setAttribute('aria-expanded', 'false');
            });
            // If the clicked item wasn't already active, open it
            if (!wasActive) {
                item.classList.add('is-active');
                title.setAttribute('aria-expanded', 'true');
            }
        });
    });

    // --- HERO TEXT SPLIT & ANIMATE ---
    const textToSplit = document.querySelector('[data-text-split]');
    if (textToSplit) {
        const text = textToSplit.innerText;
        textToSplit.innerHTML = '';
        text.split('').forEach((char, index) => {
            const span = document.createElement('span');
            span.innerHTML = char === ' ' ? ' ' : char;
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
        body.classList.toggle('nav-open');
        body.classList.toggle('body-no-scroll'); // Prevent scroll when nav is open
    });
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            body.classList.remove('nav-open');
            body.classList.remove('body-no-scroll');
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
    sections.forEach(section => sectionObserver.observe(section));


    // --- LIGHTBOX GALLERY (UNIFIED FOR ALL DEVICES) ---
    const lightbox = document.getElementById('lightbox');
    if (lightbox) {
        const lightboxImg = lightbox.querySelector('.lightbox__image');
        const lightboxCounter = lightbox.querySelector('.lightbox__counter');
        const closeBtn = lightbox.querySelector('.lightbox__close');
        const prevBtn = lightbox.querySelector('.lightbox__prev');
        const nextBtn = lightbox.querySelector('.lightbox__next');
        
        let currentGalleryImages = [];
        let currentImageIndex = 0;

        const openLightbox = (images, index) => {
            currentGalleryImages = images.filter(img => img.trim() !== '');
            if (currentGalleryImages.length === 0) return;
            currentImageIndex = index;
            body.classList.add('body-no-scroll');
            lightbox.classList.add('is-open');
            showImage();
        };

        const closeLightbox = () => {
            body.classList.remove('body-no-scroll');
            lightbox.classList.remove('is-open');
        };

        const showImage = () => {
            if (currentImageIndex < 0 || currentImageIndex >= currentGalleryImages.length) return;
            lightboxImg.src = currentGalleryImages[currentImageIndex];
            
            // Re-trigger fade-in animation for image change
            lightboxImg.style.animation = 'none';
            void lightboxImg.offsetWidth; // This is a trick to force a reflow
            lightboxImg.style.animation = '';

            lightboxCounter.textContent = `${currentImageIndex + 1} / ${currentGalleryImages.length}`;
            prevBtn.style.display = currentGalleryImages.length > 1 && currentImageIndex > 0 ? 'flex' : 'none';
            nextBtn.style.display = currentGalleryImages.length > 1 && currentImageIndex < currentGalleryImages.length - 1 ? 'flex' : 'none';
        };

        const showNextImage = () => {
            if (currentImageIndex < currentGalleryImages.length - 1) {
                currentImageIndex++;
                showImage();
            }
        };
        
        const showPrevImage = () => {
            if (currentImageIndex > 0) {
                currentImageIndex--;
                showImage();
            }
        };

        // Event Listeners for Lightbox controls
        closeBtn.addEventListener('click', closeLightbox);
        nextBtn.addEventListener('click', showNextImage);
        prevBtn.addEventListener('click', showPrevImage);
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });
        document.addEventListener('keydown', (e) => {
            if (!lightbox.classList.contains('is-open')) return;
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowRight') showNextImage();
            if (e.key === 'ArrowLeft') showPrevImage();
        });

        // Event Delegation for all "enlarge" buttons
        const workAccordion = document.querySelector('.work-accordion');
        if (workAccordion) {
            workAccordion.addEventListener('click', (e) => {
                const enlargeBtn = e.target.closest('.enlarge-btn');
                if (!enlargeBtn) return;
                
                e.preventDefault();
                const wrapper = enlargeBtn.closest('.gallery-image-wrapper');
                const gallery = enlargeBtn.closest('.accordion-item__gallery');
                const allWrappers = Array.from(gallery.querySelectorAll('.gallery-image-wrapper'));
                const allImageSrcs = allWrappers.map(w => w.querySelector('img').src);
                const clickedIndex = allWrappers.indexOf(wrapper);

                openLightbox(allImageSrcs, clickedIndex);
            });
        }
    }
});
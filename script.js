document.addEventListener('DOMContentLoaded', function() {

    // --- CUSTOM CURSOR ---
    const cursor = document.querySelector('.cursor');
    const linkElements = document.querySelectorAll('a, button');
    const formInputs = document.querySelectorAll('input, textarea');

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

    linkElements.forEach(el => {
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


    // --- WORK SECTION INTERACTIVITY ---
    const workItems = document.querySelectorAll('.work-item');
    const workPreview = document.querySelector('.work-image-preview');
    const workPreviewImg = workPreview ? workPreview.querySelector('img') : null;

    workItems.forEach(item => {
        // Desktop Hover Logic
        item.addEventListener('mouseover', function() {
            if (window.innerWidth > 900) {
                const imageUrl = this.dataset.image;
                if (workPreviewImg) {
                    workPreviewImg.src = imageUrl;
                    workPreview.classList.add('is-visible');
                }
            }
        });

        // Mobile Accordion Click Logic
        item.addEventListener('click', function(e) {
            if (window.innerWidth <= 900) {
                e.preventDefault();
                // If this item is already active, close it. Otherwise, open it.
                if (this.classList.contains('is-active')) {
                    this.classList.remove('is-active');
                } else {
                    // Close any other open items first
                    workItems.forEach(i => i.classList.remove('is-active'));
                    this.classList.add('is-active');
                }
            }
        });
    });

    // Hide preview when mouse leaves the entire list area on desktop
    const workListContainer = document.querySelector('.work-list-container');
    if(workListContainer) {
        workListContainer.addEventListener('mouseleave', function() {
            if (window.innerWidth > 900) {
                workPreview.classList.remove('is-visible');
            }
        });
    }


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
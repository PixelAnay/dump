document.addEventListener('DOMContentLoaded', function() {

    // --- CUSTOM CURSOR ---
    const cursor = document.querySelector('.cursor');
    const linkElements = document.querySelectorAll('a, button');
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
    const workPreviewImg = workPreview.querySelector('img');
    const workSection = document.querySelector('#work');

    // Desktop hover logic
    if (window.innerWidth > 900) {
        workItems.forEach(item => {
            item.addEventListener('mouseover', function() {
                const imageUrl = this.dataset.image;
                workPreviewImg.src = imageUrl;
                workPreview.classList.add('is-visible');
            });
            item.addEventListener('mouseleave', function() {
                workPreview.classList.remove('is-visible');
            });
        });
    }

    // FIX: Mobile scroll-based logic
    if (window.innerWidth <= 900) {
        let workObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        // When an item is in view, update the image and make preview visible
                        workItems.forEach(item => item.classList.remove('is-active'));
                        entry.target.classList.add('is-active');
                        workPreviewImg.src = entry.target.dataset.image;
                        workPreview.classList.add('is-visible');
                    }
                });
            },
            { 
              // Trigger when item is in the middle 20% of the screen
              rootMargin: '-40% 0px -40% 0px',
              threshold: 0
            }
        );

        workItems.forEach(item => workObserver.observe(item));

        // Hide the preview when the entire work section is out of view
        let sectionObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (!entry.isIntersecting) {
                        workPreview.classList.remove('is-visible');
                    }
                });
            }, { threshold: 0 }
        );
        sectionObserver.observe(workSection);
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
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    };

    const sectionObserver = new IntersectionObserver(revealSection, {
        root: null,
        threshold: 0.1,
    });

    sections.forEach(section => {
        sectionObserver.observe(section);
    });

});
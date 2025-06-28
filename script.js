document.addEventListener('DOMContentLoaded', function() {

    // --- CUSTOM CURSOR ---
    const cursor = document.querySelector('.cursor');
    const interactiveElements = document.querySelectorAll('.interactive');
    const linkElements = document.querySelectorAll('a:not(.interactive), .nav-link, .footer-socials a');

    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;
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

    // Handle hover states for all interactive elements
    interactiveElements.forEach(el => {
        el.addEventListener('mouseover', () => {
            cursor.classList.add('grow');
            if (el.classList.contains('btn')) {
                el.classList.add('is-hovered');
            }
        });
        el.addEventListener('mouseleave', () => {
            cursor.classList.remove('grow');
            if (el.classList.contains('btn')) {
                el.classList.remove('is-hovered');
            }
        });
    });

    // Handle hover state for simple text links
    linkElements.forEach(el => {
        el.addEventListener('mouseover', () => cursor.classList.add('link-hover'));
        el.addEventListener('mouseleave', () => cursor.classList.remove('link-hover'));
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
        threshold: 0.15,
    });

    sections.forEach(section => {
        sectionObserver.observe(section);
    });

});
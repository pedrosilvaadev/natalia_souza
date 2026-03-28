/**
 * Main Frontend Logic
 * Incorporates scroll animations and intersection observers as requested by the motion choreography rules.
 * Never uses generic/linear easing or scroll event listeners that cause repaints.
 */

document.addEventListener("DOMContentLoaded", () => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
        document.querySelectorAll('.reveal, .block-reveal').forEach(el => {
            el.classList.add('active');
        });
    }

    // 1. Intersection Observer for Smooth Scroll Reveals (Fluid Choreography)
    const observerOptions = {
        root: null,
        rootMargin: "0px",
        threshold: 0.15
    };

    const revealObserver = prefersReducedMotion ? null : new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const revealElements = document.querySelectorAll('.reveal, .block-reveal');
    revealElements.forEach(el => {
        if (prefersReducedMotion) return;

        const rect = el.getBoundingClientRect();
        const isAboveFold = rect.top < window.innerHeight * 0.9;

        // Paint above-the-fold content immediately to avoid delaying LCP.
        if (isAboveFold) {
            el.classList.add('active');
            return;
        }

        revealObserver.observe(el);
    });

    // 2. Mobile Menu Toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
            navLinks.style.flexDirection = 'column';
            navLinks.style.position = 'absolute';
            navLinks.style.top = '100%';
            navLinks.style.left = '0';
            navLinks.style.background = 'rgba(253, 248, 245, 0.95)';
            navLinks.style.width = '100%';
            navLinks.style.padding = '2rem';
            navLinks.style.borderRadius = '1rem';
            navLinks.style.boxShadow = '0 10px 40px rgba(0,0,0,0.1)';
            navLinks.style.gap = '1.5rem';
        });
    }

    // 3. Smooth scrolling for anchors
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
});

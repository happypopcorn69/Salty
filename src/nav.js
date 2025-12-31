/**
 * Mobile navigation toggle and keyboard accessibility
 */
(function() {
    'use strict';

    function initNavigation() {
        const navToggle = document.querySelector('.nav-toggle');
        const navMenu = document.querySelector('.nav-menu');

        if (!navToggle || !navMenu) {
            return;
        }

        // Toggle menu on button click
        navToggle.addEventListener('click', function() {
            const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
            navToggle.setAttribute('aria-expanded', !isExpanded);
            navMenu.classList.toggle('nav-open');
        });

        // Close menu when a link is clicked
        navMenu.querySelectorAll('a').forEach(function(link) {
            link.addEventListener('click', function() {
                navToggle.setAttribute('aria-expanded', 'false');
                navMenu.classList.remove('nav-open');
            });
        });

        // Close menu on Escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && navMenu.classList.contains('nav-open')) {
                navToggle.setAttribute('aria-expanded', 'false');
                navMenu.classList.remove('nav-open');
                navToggle.focus(); // Return focus to toggle button
            }
        });
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initNavigation);
    } else {
        initNavigation();
    }
})();

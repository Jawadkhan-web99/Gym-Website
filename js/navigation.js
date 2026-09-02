/* ==========================================================================
   IRON DISTRICT - NAVBAR & MOBILE NAVIGATION
   ========================================================================== */

export function initNavigation() {
  const navbar = document.querySelector('.site-navbar');
  const toggleBtn = document.querySelector('.nav-toggle');
  const mobileOverlay = document.querySelector('.mobile-nav-overlay');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');
  const desktopLinks = document.querySelectorAll('.nav-link');

  if (!navbar) return;

  // Active page indicator
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';

  desktopLinks.forEach((link) => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });

  mobileLinks.forEach((link) => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });

  // Scroll Direction Awareness
  let lastScrollY = window.scrollY;
  let isNavHidden = false;

  window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;

    // Background glass blur toggle
    if (currentScrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Hide on scroll down, show on scroll up
    if (currentScrollY > 150 && currentScrollY > lastScrollY && !isNavHidden) {
      // Scrolling down
      navbar.classList.add('nav-hidden');
      isNavHidden = true;
    } else if (currentScrollY < lastScrollY && isNavHidden) {
      // Scrolling up
      navbar.classList.remove('nav-hidden');
      isNavHidden = false;
    }

    lastScrollY = Math.max(0, currentScrollY);
  }, { passive: true });

  // Mobile Drawer Toggle
  if (toggleBtn && mobileOverlay) {
    let isOpen = false;

    function openMobileNav() {
      isOpen = true;
      toggleBtn.classList.add('open');
      mobileOverlay.classList.add('open');
      document.body.style.overflow = 'hidden';

      if (typeof gsap !== 'undefined') {
        gsap.to(mobileLinks, {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.08,
          ease: 'power3.out',
          overwrite: true
        });
      }
    }

    function closeMobileNav() {
      isOpen = false;
      toggleBtn.classList.remove('open');
      mobileOverlay.classList.remove('open');
      document.body.style.overflow = '';

      if (typeof gsap !== 'undefined') {
        gsap.to(mobileLinks, {
          y: 40,
          opacity: 0,
          duration: 0.3,
          ease: 'power2.in',
          overwrite: true
        });
      }
    }

    toggleBtn.addEventListener('click', () => {
      if (isOpen) {
        closeMobileNav();
      } else {
        openMobileNav();
      }
    });

    // Close when clicking a link
    mobileLinks.forEach((link) => {
      link.addEventListener('click', () => {
        closeMobileNav();
      });
    });

    // Close on Escape key
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && isOpen) {
        closeMobileNav();
      }
    });
  }
}

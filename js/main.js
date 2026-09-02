/* ==========================================================================
   IRON DISTRICT - MAIN APPLICATION ENTRY POINT (ES MODULE)
   ========================================================================== */

import { initSmoothScroll } from './smooth-scroll.js';
import { initCustomCursor } from './cursor.js';
import { initNavigation } from './navigation.js';
import { initCounters } from './counters.js';
import { initThreeScene } from './three-scene.js';
import { initAnimations } from './animations.js';

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide Icons
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

  // Initialize Loading Screen & Bootstrap Application
  initLoader(() => {
    // Post-loader initialization
    initSmoothScroll();
    initCustomCursor();
    initNavigation();
    initCounters();
    initThreeScene();
    initAnimations();
    initScrollProgressBar();
    initGlobalModals();
    initForms();
    initMembershipToggle();
    initProgramFilters();
    initTrainerFilters();

    // Re-trigger icon generation for dynamically inserted icons
    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }
  });
});

/* ==========================================================================
   CINEMATIC LOADING SCREEN
   ========================================================================== */
function initLoader(onComplete) {
  const loader = document.querySelector('.loader-screen');
  const fill = document.querySelector('.loader-progress-fill');
  const countEl = document.querySelector('.loader-percentage');
  const brandTitleSpans = document.querySelectorAll('.loader-brand-title span');
  const tagline = document.querySelector('.loader-tagline');

  if (!loader) {
    if (onComplete) onComplete();
    return;
  }

  // Animate brand title in loader
  if (typeof gsap !== 'undefined') {
    gsap.to(brandTitleSpans, {
      y: 0,
      duration: 0.8,
      stagger: 0.1,
      ease: 'power3.out'
    });

    gsap.to(tagline, {
      opacity: 1,
      duration: 0.6,
      delay: 0.4,
      ease: 'power2.out'
    });
  }

  // Counter 0% to 100%
  let count = 0;
  const duration = 1200; // 1.2s
  const intervalTime = 15;
  const step = 100 / (duration / intervalTime);

  const timer = setInterval(() => {
    count += step;
    if (count >= 100) {
      count = 100;
      clearInterval(timer);

      if (fill) fill.style.width = '100%';
      if (countEl) countEl.textContent = '100%';

      setTimeout(() => {
        // Exit animation
        if (typeof gsap !== 'undefined') {
          gsap.to(loader, {
            yPercent: -100,
            duration: 0.85,
            ease: 'power4.inOut',
            onComplete: () => {
              loader.style.display = 'none';
              if (onComplete) onComplete();
            }
          });
        } else {
          loader.style.opacity = '0';
          setTimeout(() => {
            loader.style.display = 'none';
            if (onComplete) onComplete();
          }, 400);
        }
      }, 200);
    } else {
      const displayVal = Math.floor(count);
      if (fill) fill.style.width = `${displayVal}%`;
      if (countEl) countEl.textContent = `${displayVal < 10 ? '0' : ''}${displayVal}%`;
    }
  }, intervalTime);
}

/* ==========================================================================
   TOP SCROLL PROGRESS BAR
   ========================================================================== */
function initScrollProgressBar() {
  const progressBar = document.querySelector('.scroll-progress-fill');
  if (!progressBar) return;

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
    progressBar.style.width = `${Math.min(100, Math.max(0, progress))}%`;
  }, { passive: true });
}

/* ==========================================================================
   GLOBAL MODALS (BOOK TRIAL / CONSULTATION / JOIN)
   ========================================================================== */
function initGlobalModals() {
  const triggers = document.querySelectorAll('[data-modal-target]');
  const closeButtons = document.querySelectorAll('.modal-close-btn, [data-modal-close]');

  triggers.forEach((trigger) => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = trigger.getAttribute('data-modal-target');
      const modal = document.getElementById(targetId);
      if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  closeButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const modal = btn.closest('.modal-backdrop');
      if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  });

  // Backdrop click close
  document.querySelectorAll('.modal-backdrop').forEach((backdrop) => {
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) {
        backdrop.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  });
}

/* ==========================================================================
   MEMBERSHIP PRICING FREQUENCY TOGGLE
   ========================================================================== */
function initMembershipToggle() {
  const switchEl = document.querySelector('.billing-switch');
  const monthlyLabel = document.querySelector('.billing-label.monthly');
  const annualLabel = document.querySelector('.billing-label.annual');
  const priceAmounts = document.querySelectorAll('[data-monthly-price]');

  if (!switchEl || !priceAmounts.length) return;

  let isAnnual = false;

  function updatePrices(annual) {
    isAnnual = annual;
    if (isAnnual) {
      switchEl.classList.add('annual');
      monthlyLabel?.classList.remove('active');
      annualLabel?.classList.add('active');

      priceAmounts.forEach((el) => {
        const annualPrice = el.getAttribute('data-annual-price');
        if (annualPrice) el.textContent = annualPrice;
      });
    } else {
      switchEl.classList.remove('annual');
      monthlyLabel?.classList.add('active');
      annualLabel?.classList.remove('active');

      priceAmounts.forEach((el) => {
        const monthlyPrice = el.getAttribute('data-monthly-price');
        if (monthlyPrice) el.textContent = monthlyPrice;
      });
    }
  }

  switchEl.addEventListener('click', () => updatePrices(!isAnnual));
  monthlyLabel?.addEventListener('click', () => updatePrices(false));
  annualLabel?.addEventListener('click', () => updatePrices(true));
}

/* ==========================================================================
   PROGRAMS FILTER TABS
   ========================================================================== */
function initProgramFilters() {
  const filterBtns = document.querySelectorAll('.program-filter-btn');
  const cards = document.querySelectorAll('.program-grid-item');

  if (!filterBtns.length || !cards.length) return;

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      cards.forEach((card) => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.style.display = 'block';
          if (typeof gsap !== 'undefined') {
            gsap.fromTo(card, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' });
          }
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* ==========================================================================
   TRAINERS FILTER TABS
   ========================================================================== */
function initTrainerFilters() {
  const filterBtns = document.querySelectorAll('.trainer-filter-btn');
  const cards = document.querySelectorAll('.trainer-grid-item');

  if (!filterBtns.length || !cards.length) return;

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      cards.forEach((card) => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.style.display = 'block';
          if (typeof gsap !== 'undefined') {
            gsap.fromTo(card, { opacity: 0, scale: 0.96 }, { opacity: 1, scale: 1, duration: 0.4, ease: 'power2.out' });
          }
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* ==========================================================================
   FORMS VALIDATION & FEEDBACK
   ========================================================================== */
function initForms() {
  const forms = document.querySelectorAll('form.js-validate-form');

  forms.forEach((form) => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let isValid = true;

      const requiredInputs = form.querySelectorAll('[required]');
      requiredInputs.forEach((input) => {
        const group = input.closest('.form-group');
        if (!input.value.trim()) {
          isValid = false;
          if (group) group.classList.add('has-error');
        } else {
          if (group) group.classList.remove('has-error');
        }
      });

      if (isValid) {
        const successBanner = form.querySelector('.form-success-banner');
        if (successBanner) {
          successBanner.classList.add('visible');
          form.reset();
          setTimeout(() => {
            successBanner.classList.remove('visible');
          }, 6000);
        } else {
          alert('Thank you! Your request has been submitted to IRON DISTRICT.');
          form.reset();
        }
      }
    });
  });
}

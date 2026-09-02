/* ==========================================================================
   IRON DISTRICT - LENIS SMOOTH SCROLL & SCROLLTRIGGER SYNC
   ========================================================================== */

let lenisInstance = null;

export function initSmoothScroll() {
  // Check if Lenis is loaded via CDN or window
  if (typeof Lenis === 'undefined') {
    console.warn('Lenis library not detected. Running standard scroll.');
    return null;
  }

  // Check prefers-reduced-motion
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return null;
  }

  lenisInstance = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    direction: 'vertical',
    gestureDirection: 'vertical',
    smooth: true,
    mouseMultiplier: 1,
    smoothTouch: false,
    touchMultiplier: 2,
    infinite: false,
  });

  // Connect Lenis to ScrollTrigger if GSAP is available
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    lenisInstance.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenisInstance.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);
  } else {
    function raf(time) {
      lenisInstance.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
  }

  // Smooth scroll to internal anchors
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId && targetId !== '#' && document.querySelector(targetId)) {
        e.preventDefault();
        lenisInstance.scrollTo(targetId, { offset: -60, duration: 1.5 });
      }
    });
  });

  return lenisInstance;
}

export function getLenis() {
  return lenisInstance;
}

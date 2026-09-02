/* ==========================================================================
   IRON DISTRICT - GSAP SCROLLTRIGGER & INTERACTION ANIMATIONS
   ========================================================================== */

export function initAnimations() {
  if (typeof gsap === 'undefined') return;

  // Register ScrollTrigger plugin if present
  if (typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
  }

  initMagneticButtons();
  initHeroAnimations();
  initIntroScrubReveal();
  initHorizontalScroll();
  initPhilosophyParallax();
  initTransformationPin();
  initImageExpansion();
  initTextMaskReveal();
  initAccordion();
  initTestimonialSlider();
}

/* ==========================================================================
   MAGNETIC BUTTONS
   ========================================================================== */
function initMagneticButtons() {
  // Only on non-touch devices
  if (window.matchMedia('(pointer: coarse)').matches) return;

  const magneticElements = document.querySelectorAll('.magnetic-btn');

  magneticElements.forEach((el) => {
    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      gsap.to(el, {
        x: x * 0.35,
        y: y * 0.35,
        duration: 0.3,
        ease: 'power2.out'
      });
    });

    el.addEventListener('mouseleave', () => {
      gsap.to(el, {
        x: 0,
        y: 0,
        duration: 0.7,
        ease: 'elastic.out(1, 0.3)'
      });
    });
  });
}

/* ==========================================================================
   HERO ENTRANCE ANIMATION
   ========================================================================== */
function initHeroAnimations() {
  const hero = document.querySelector('.section-hero');
  if (!hero) return;

  const titleLines = hero.querySelectorAll('.hero-title-line');
  const heroSub = hero.querySelector('.hero-subtitle');
  const heroMeta = hero.querySelectorAll('.hero-meta-item');
  const heroCtas = hero.querySelectorAll('.hero-cta');
  const heroBg = hero.querySelector('.hero-bg-img');

  const tl = gsap.timeline({ delay: 0.2 });

  if (heroBg) {
    tl.fromTo(heroBg, 
      { scale: 1.15, filter: 'brightness(0.2) contrast(1.2)' },
      { scale: 1.02, filter: 'brightness(0.65) contrast(1.1)', duration: 2, ease: 'power3.out' },
      0
    );
  }

  if (titleLines.length) {
    tl.fromTo(titleLines,
      { y: 80, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.2, stagger: 0.15, ease: 'power4.out' },
      0.3
    );
  }

  if (heroSub) {
    tl.fromTo(heroSub,
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' },
      0.8
    );
  }

  if (heroCtas.length) {
    tl.fromTo(heroCtas,
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, stagger: 0.12, ease: 'power3.out' },
      1.0
    );
  }

  if (heroMeta.length) {
    tl.fromTo(heroMeta,
      { opacity: 0 },
      { opacity: 1, duration: 1, stagger: 0.1, ease: 'power2.out' },
      1.2
    );
  }

  // Subtle Mouse Parallax on Hero Image
  if (heroBg && !window.matchMedia('(pointer: coarse)').matches) {
    window.addEventListener('mousemove', (e) => {
      const moveX = (e.clientX / window.innerWidth - 0.5) * 20;
      const moveY = (e.clientY / window.innerHeight - 0.5) * 20;
      gsap.to(heroBg, {
        x: moveX,
        y: moveY,
        duration: 1.2,
        ease: 'power2.out'
      });
    });
  }
}

/* ==========================================================================
   INTRO STATEMENT WORD-BY-WORD SCRUB REVEAL
   ========================================================================== */
function initIntroScrubReveal() {
  const introTextEl = document.querySelector('.scrub-intro-text');
  if (!introTextEl || typeof ScrollTrigger === 'undefined') return;

  // Split text into words if not already wrapped
  const text = introTextEl.textContent.trim();
  const words = text.split(/\s+/);
  introTextEl.innerHTML = words.map(word => `<span class="scrub-text-word">${word}&nbsp;</span>`).join('');

  const wordSpans = introTextEl.querySelectorAll('.scrub-text-word');

  gsap.fromTo(wordSpans,
    { opacity: 0.15, filter: 'blur(8px)', y: 15 },
    {
      opacity: 1,
      filter: 'blur(0px)',
      y: 0,
      stagger: 0.08,
      ease: 'none',
      scrollTrigger: {
        trigger: introTextEl,
        start: 'top 80%',
        end: 'bottom 45%',
        scrub: 0.6
      }
    }
  );
}

/* ==========================================================================
   HORIZONTAL SCROLL (THE GYM EXPERIENCE)
   ========================================================================== */
function initHorizontalScroll() {
  const container = document.querySelector('.horizontal-scroll-container');
  const track = document.querySelector('.horizontal-track');

  if (!container || !track || typeof ScrollTrigger === 'undefined') return;

  // Only activate pin and horizontal scroll on desktop (> 1024px)
  let mm = gsap.matchMedia();

  mm.add('(min-width: 1025px)', () => {
    const totalWidth = track.scrollWidth;
    const scrollDistance = totalWidth - window.innerWidth + 80;

    gsap.to(track, {
      x: () => -scrollDistance,
      ease: 'none',
      scrollTrigger: {
        trigger: container,
        pin: true,
        scrub: 0.8,
        start: 'top top',
        end: () => `+=${scrollDistance}`,
        invalidateOnRefresh: true
      }
    });
  });
}

/* ==========================================================================
   TRAINING PHILOSOPHY PARALLAX
   ========================================================================== */
function initPhilosophyParallax() {
  const section = document.querySelector('.philosophy-section');
  if (!section || typeof ScrollTrigger === 'undefined') return;

  const bgImg = section.querySelector('.philosophy-bg-img');
  const content = section.querySelector('.philosophy-content');

  if (bgImg) {
    gsap.fromTo(bgImg,
      { y: '-10%', scale: 1.1 },
      {
        y: '10%',
        scale: 1.02,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true
        }
      }
    );
  }

  if (content) {
    gsap.fromTo(content,
      { y: 60, opacity: 0.5 },
      {
        y: -40,
        opacity: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top 85%',
          end: 'bottom 20%',
          scrub: 0.5
        }
      }
    );
  }
}

/* ==========================================================================
   PINNED TRANSFORMATION PROCESS
   ========================================================================== */
function initTransformationPin() {
  const section = document.querySelector('.transformation-section');
  if (!section || typeof ScrollTrigger === 'undefined') return;

  const cards = section.querySelectorAll('.transformation-card');
  const stageIndicator = section.querySelector('.transformation-stage-indicator');

  cards.forEach((card, index) => {
    const stageNum = card.getAttribute('data-stage') || `0${index + 1}`;

    ScrollTrigger.create({
      trigger: card,
      start: 'top 60%',
      end: 'bottom 40%',
      onEnter: () => updateStage(stageNum, card),
      onEnterBack: () => updateStage(stageNum, card),
    });
  });

  function updateStage(num, activeCard) {
    cards.forEach(c => c.classList.remove('active'));
    activeCard.classList.add('active');

    if (stageIndicator) {
      stageIndicator.textContent = num;
      gsap.fromTo(stageIndicator,
        { opacity: 0.2, scale: 0.95 },
        { opacity: 0.8, scale: 1, duration: 0.4, ease: 'power2.out' }
      );
    }
  }
}

/* ==========================================================================
   IMAGE EXPANSION (45vw -> 100vw)
   ========================================================================== */
function initImageExpansion() {
  const section = document.querySelector('.image-expansion-section');
  const wrap = document.querySelector('.image-expansion-wrap');
  const title = document.querySelector('.image-expansion-title');

  if (!section || !wrap || typeof ScrollTrigger === 'undefined') return;

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: 'top 70%',
      end: 'bottom bottom',
      scrub: 0.8
    }
  });

  tl.fromTo(wrap,
    { width: '45vw', height: '60vh', borderRadius: '28px' },
    { width: '100vw', height: '100vh', borderRadius: '0px', ease: 'power2.inOut' }
  );

  if (title) {
    tl.fromTo(title,
      { scale: 0.85, opacity: 0.3 },
      { scale: 1.1, opacity: 1, ease: 'power1.out' },
      0.2
    );
  }
}

/* ==========================================================================
   TEXT MASK CLIP REVEAL
   ========================================================================== */
function initTextMaskReveal() {
  const maskSection = document.querySelector('.text-mask-section');
  if (!maskSection || typeof ScrollTrigger === 'undefined') return;

  const titleLines = maskSection.querySelectorAll('.text-mask-line');

  gsap.fromTo(titleLines,
    { clipPath: 'polygon(0 100%, 100% 100%, 100% 100%, 0% 100%)', y: 40 },
    {
      clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0% 100%)',
      y: 0,
      duration: 1.2,
      stagger: 0.15,
      ease: 'power4.out',
      scrollTrigger: {
        trigger: maskSection,
        start: 'top 75%',
        toggleActions: 'play none none reverse'
      }
    }
  );
}

/* ==========================================================================
   FAQ ACCORDION
   ========================================================================== */
function initAccordion() {
  const items = document.querySelectorAll('.accordion-item');

  items.forEach((item) => {
    const header = item.querySelector('.accordion-header');
    const body = item.querySelector('.accordion-body');

    if (!header || !body) return;

    header.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Close all others
      items.forEach((other) => {
        if (other !== item) {
          other.classList.remove('active');
          const otherBody = other.querySelector('.accordion-body');
          if (otherBody) otherBody.style.maxHeight = null;
        }
      });

      if (isActive) {
        item.classList.remove('active');
        body.style.maxHeight = null;
      } else {
        item.classList.add('active');
        body.style.maxHeight = body.scrollHeight + 'px';
      }

      // Refresh ScrollTrigger to recalculate layout
      if (typeof ScrollTrigger !== 'undefined') {
        setTimeout(() => ScrollTrigger.refresh(), 350);
      }
    });
  });
}

/* ==========================================================================
   TESTIMONIALS SLIDER
   ========================================================================== */
function initTestimonialSlider() {
  const slider = document.querySelector('.testimonial-slider');
  if (!slider) return;

  const slides = slider.querySelectorAll('.testimonial-slide');
  const prevBtn = slider.querySelector('.testimonial-prev');
  const nextBtn = slider.querySelector('.testimonial-next');

  if (!slides.length) return;

  let currentIndex = 0;

  function showSlide(index) {
    slides.forEach((s, i) => {
      if (i === index) {
        s.style.display = 'block';
        gsap.fromTo(s, { opacity: 0, x: 20 }, { opacity: 1, x: 0, duration: 0.5, ease: 'power2.out' });
      } else {
        s.style.display = 'none';
      }
    });
  }

  showSlide(currentIndex);

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      currentIndex = (currentIndex - 1 + slides.length) % slides.length;
      showSlide(currentIndex);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      currentIndex = (currentIndex + 1) % slides.length;
      showSlide(currentIndex);
    });
  }
}

/* ==========================================================================
   IRON DISTRICT - COMPLETE BUNDLED APPLICATION SCRIPT
   High-performance, ultra-responsive, zero page-cutting bugs!
   ========================================================================== */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', () => {
    // 0. Initialize Preloader
    initPreloader();

    // 1. Initialize Lucide Icons
    if (typeof lucide !== 'undefined') {
      try {
        lucide.createIcons();
      } catch (e) {
        console.warn('Lucide init warning:', e);
      }
    }

    // 2. Initialize All Core Systems Immediately
    initSmoothScroll();
    initCustomCursor();
    initPageTransitions();
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
    initVideoPlayer();
    init3DTilt();

    // 3. Re-run icons for dynamically inserted elements
    if (typeof lucide !== 'undefined') {
      try {
        lucide.createIcons();
      } catch (e) {}
    }

    // Refresh ScrollTrigger after async elements settle
    setTimeout(() => {
      if (typeof ScrollTrigger !== 'undefined') {
        ScrollTrigger.refresh();
      }
    }, 500);
  });

  // Re-calculate layout when all images finish loading
  window.addEventListener('load', () => {
    if (typeof ScrollTrigger !== 'undefined') {
      ScrollTrigger.refresh();
    }
  });

  /* ==========================================================================
     0. INITIAL PAGE PRELOADER (Runs on Initial Site Launch & Refresh ONLY)
     ========================================================================== */
  function initPreloader() {
    const preloader = document.getElementById('page-preloader') || document.querySelector('.page-preloader');
    if (!preloader) return;

    let isReload = false;
    try {
      const perfEntries = (window.performance && performance.getEntriesByType) ? performance.getEntriesByType('navigation') : [];
      isReload = (perfEntries.length > 0 && perfEntries[0].type === 'reload') ||
                 (window.performance && window.performance.navigation && window.performance.navigation.type === 1);
    } catch (e) {}

    const hasStarted = sessionStorage.getItem('neurofit_started');

    // If user is navigating between pages (already visited & not a reload), skip immediately with 0 delay
    if (hasStarted && !isReload) {
      document.documentElement.classList.add('preloader-done');
      if (preloader.parentNode) {
        preloader.parentNode.removeChild(preloader);
      }
      return;
    }

    // Mark as started in this browser session
    try {
      sessionStorage.setItem('neurofit_started', 'true');
    } catch (e) {}

    const totalDuration = 2500; // 2.5s duration on initial visit or refresh
    let isHidden = false;

    setTimeout(() => {
      hidePreloader();
    }, totalDuration);

    function hidePreloader() {
      if (isHidden) return;
      isHidden = true;
      document.documentElement.classList.add('preloader-done');
      preloader.classList.add('preloader-hidden');
      setTimeout(() => {
        if (preloader.parentNode) {
          preloader.parentNode.removeChild(preloader);
        }
      }, 400);
    }
  }

  /* ==========================================================================
     0.1 INTERACTIVE CINEMATIC VIDEO CONTROLLER
     ========================================================================== */
  function initVideoPlayer() {
    const video = document.getElementById('main-gym-video');
    const playBtn = document.getElementById('video-toggle-play');
    const soundBtn = document.getElementById('video-toggle-sound');
    const progressFill = document.getElementById('video-progress-current');
    const progressTrack = document.getElementById('video-progress-bar');
    const container = document.querySelector('.video-showcase-container');

    if (!video) return;

    const togglePlay = () => {
      if (video.paused) {
        video.play().then(() => {
          if (playBtn) {
            const iconPlay = playBtn.querySelector('.icon-play');
            const iconPause = playBtn.querySelector('.icon-pause');
            if (iconPlay) iconPlay.style.display = 'none';
            if (iconPause) iconPause.style.display = 'block';
            playBtn.style.opacity = '0.35';
          }
        }).catch(() => {});
      } else {
        video.pause();
        if (playBtn) {
          const iconPlay = playBtn.querySelector('.icon-play');
          const iconPause = playBtn.querySelector('.icon-pause');
          if (iconPlay) iconPlay.style.display = 'block';
          if (iconPause) iconPause.style.display = 'none';
          playBtn.style.opacity = '1';
        }
      }
    };

    if (playBtn) {
      playBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        togglePlay();
      });
    }

    if (container) {
      container.addEventListener('click', (e) => {
        if (!e.target.closest('#video-toggle-sound') && !e.target.closest('#video-progress-bar')) {
          togglePlay();
        }
      });
      container.addEventListener('mouseenter', () => {
        if (playBtn) playBtn.style.opacity = '1';
      });
      container.addEventListener('mouseleave', () => {
        if (playBtn && !video.paused) playBtn.style.opacity = '0';
      });
    }

    if (soundBtn) {
      soundBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        video.muted = !video.muted;
        const iconMuted = soundBtn.querySelector('.icon-muted');
        const iconUnmuted = soundBtn.querySelector('.icon-unmuted');
        if (iconMuted && iconUnmuted) {
          iconMuted.style.display = video.muted ? 'block' : 'none';
          iconUnmuted.style.display = video.muted ? 'none' : 'block';
        }
      });
    }

    video.addEventListener('timeupdate', () => {
      if (video.duration && progressFill) {
        const percent = (video.currentTime / video.duration) * 100;
        progressFill.style.width = `${percent}%`;
      }
    });

    if (progressTrack) {
      progressTrack.addEventListener('click', (e) => {
        e.stopPropagation();
        const rect = progressTrack.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const width = rect.width;
        if (width > 0 && video.duration) {
          video.currentTime = (clickX / width) * video.duration;
        }
      });
    }
  }

  /* ==========================================================================
     1. LENIS SMOOTH SCROLL & SCROLLTRIGGER SYNC
     ========================================================================== */
  function initSmoothScroll() {
    if (typeof Lenis === 'undefined') {
      return;
    }

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    try {
      const lenis = new Lenis({
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

      if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        lenis.on('scroll', ScrollTrigger.update);
        gsap.ticker.add((time) => {
          lenis.raf(time * 1000);
        });
        gsap.ticker.lagSmoothing(0);
      } else {
        function raf(time) {
          lenis.raf(time);
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
            lenis.scrollTo(targetId, { offset: -60, duration: 1.5 });
          }
        });
      });
    } catch (err) {
      console.warn('Lenis scroll init warning:', err);
    }
  }

  /* ==========================================================================
     2. CUSTOM DUAL CURSOR (GSAP QUICKTO - Desktop only, disabled < 768px)
     ========================================================================== */
  function initCustomCursor() {
    if (window.matchMedia('(pointer: coarse)').matches || window.innerWidth < 768) {
      return;
    }

    let wrapper = document.querySelector('.cursor-wrapper');
    if (!wrapper) {
      wrapper = document.createElement('div');
      wrapper.className = 'cursor-wrapper';
      wrapper.innerHTML = `
        <div class="cursor-dot"></div>
        <div class="cursor-follower">
          <span class="cursor-text"></span>
        </div>
      `;
      document.body.appendChild(wrapper);
    }

    const dot = wrapper.querySelector('.cursor-dot');
    const follower = wrapper.querySelector('.cursor-follower');
    const cursorText = wrapper.querySelector('.cursor-text');

    if (!dot || !follower || typeof gsap === 'undefined') return;

    const setDotX = gsap.quickTo(dot, 'x', { duration: 0.08, ease: 'power3' });
    const setDotY = gsap.quickTo(dot, 'y', { duration: 0.08, ease: 'power3' });

    const setFollowerX = gsap.quickTo(follower, 'x', { duration: 0.28, ease: 'power2.out' });
    const setFollowerY = gsap.quickTo(follower, 'y', { duration: 0.28, ease: 'power2.out' });

    window.addEventListener('mousemove', (e) => {
      setDotX(e.clientX);
      setDotY(e.clientY);
      setFollowerX(e.clientX);
      setFollowerY(e.clientY);
    });

    function setupHoverListeners() {
      document.querySelectorAll('[data-cursor]').forEach((el) => {
        el.addEventListener('mouseenter', () => {
          const text = el.getAttribute('data-cursor') || '';
          if (cursorText) cursorText.textContent = text;
          const state = text.toLowerCase();
          document.body.classList.remove('cursor-hover-view', 'cursor-hover-join', 'cursor-hover-explore', 'cursor-hover-play', 'cursor-hover-link');
          document.body.classList.add(`cursor-hover-${state}`);
        });

        el.addEventListener('mouseleave', () => {
          if (cursorText) cursorText.textContent = '';
          document.body.classList.remove('cursor-hover-view', 'cursor-hover-join', 'cursor-hover-explore', 'cursor-hover-play', 'cursor-hover-link');
        });
      });

      document.querySelectorAll('a, button, .interactive, .btn').forEach((el) => {
        if (el.hasAttribute('data-cursor')) return;
        el.addEventListener('mouseenter', () => {
          document.body.classList.add('cursor-hover-link');
        });
        el.addEventListener('mouseleave', () => {
          document.body.classList.remove('cursor-hover-link');
        });
      });
    }

    setupHoverListeners();

    document.addEventListener('mouseleave', () => {
      gsap.to([dot, follower], { opacity: 0, duration: 0.25 });
    });

    document.addEventListener('mouseenter', () => {
      gsap.to([dot, follower], { opacity: 1, duration: 0.25 });
    });
  }

  /* ==========================================================================
     2.1 INSTANT FAST PAGE TRANSITIONS
     ========================================================================== */
  function initPageTransitions() {
    // Instantaneous page switching - no artificial delay or blocking overlays
    const overlay = document.querySelector('.page-transition-overlay');
    if (overlay && overlay.parentNode) {
      overlay.parentNode.removeChild(overlay);
    }
  }

  /* ==========================================================================
     3. NAVBAR & MOBILE NAVIGATION
     ========================================================================== */
  function initNavigation() {
    const navbar = document.querySelector('.site-navbar');
    const toggleBtn = document.querySelector('.nav-toggle');
    const mobileOverlay = document.querySelector('.mobile-nav-overlay');
    const mobileLinks = document.querySelectorAll('.mobile-nav-link');
    const desktopLinks = document.querySelectorAll('.nav-link');

    if (!navbar) return;

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

    let lastScrollY = window.scrollY;
    let isNavHidden = false;

    window.addEventListener('scroll', () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > 30) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }

      if (currentScrollY > 150 && currentScrollY > lastScrollY && !isNavHidden) {
        navbar.classList.add('nav-hidden');
        isNavHidden = true;
      } else if (currentScrollY < lastScrollY && isNavHidden) {
        navbar.classList.remove('nav-hidden');
        isNavHidden = false;
      }

      lastScrollY = Math.max(0, currentScrollY);
    }, { passive: true });

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
            duration: 0.4,
            stagger: 0.06,
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
            y: 30,
            opacity: 0,
            duration: 0.25,
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

      mobileLinks.forEach((link) => {
        link.addEventListener('click', () => {
          closeMobileNav();
        });
      });

      window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && isOpen) {
          closeMobileNav();
        }
      });
    }
  }

  /* ==========================================================================
     4. ANIMATED NUMERICAL STAT COUNTERS
     ========================================================================== */
  function initCounters() {
    const counterElements = document.querySelectorAll('[data-counter]');
    if (!counterElements.length) return;

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    counterElements.forEach((el) => observer.observe(el));
  }

  function animateCounter(el) {
    const target = parseFloat(el.getAttribute('data-counter') || '0');
    const prefix = el.getAttribute('data-prefix') || '';
    const suffix = el.getAttribute('data-suffix') || '';
    const duration = parseFloat(el.getAttribute('data-duration') || '1.8');

    const startTime = performance.now();

    function updateCount(currentTime) {
      const elapsed = (currentTime - startTime) / 1000;
      const progress = Math.min(elapsed / duration, 1);
      const easeOutProgress = 1 - Math.pow(1 - progress, 3);
      const currentValue = Math.floor(easeOutProgress * target);

      const formatted = currentValue >= 1000 ? currentValue.toLocaleString() : currentValue;
      el.textContent = `${prefix}${formatted}${suffix}`;

      if (progress < 1) {
        requestAnimationFrame(updateCount);
      } else {
        const finalFormatted = target >= 1000 ? target.toLocaleString() : target;
        el.textContent = `${prefix}${finalFormatted}${suffix}`;
      }
    }

    requestAnimationFrame(updateCount);
  }

  /* ==========================================================================
     5. THREE.JS 3D INTERACTIVE WORLD GLOBE SCENE — PREMIUM UPGRADE
     ========================================================================== */
  function initThreeScene() {
    const container = document.getElementById('three-canvas-container');
    if (!container || typeof THREE === 'undefined') return;

    try {
      const scene = new THREE.Scene();
      const width = container.clientWidth || 500;
      const height = container.clientHeight || 450;
      const isMobile = window.innerWidth < 768;

      const camera = new THREE.PerspectiveCamera(45, (width || 500) / (height || 480), 0.1, 1000);
      camera.position.set(0, 0, isMobile ? 21 : (window.innerWidth < 1024 ? 20 : 18));

      const renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance'
      });
      renderer.setSize(width || 500, height || 480);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2));
      renderer.domElement.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;touch-action:none;cursor:grab;z-index:2;';
      container.appendChild(renderer.domElement);

      // --- Particle Texture: Sharp glowing dot ---
      function createParticleTexture(innerColor, outerColor) {
        const canvas = document.createElement('canvas');
        canvas.width = 64; canvas.height = 64;
        const ctx = canvas.getContext('2d');
        const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
        g.addColorStop(0,    '#FFFFFF');
        g.addColorStop(0.18, innerColor  || 'rgba(0,212,255,1)');
        g.addColorStop(0.5,  outerColor  || 'rgba(0,153,255,0.5)');
        g.addColorStop(1,    'rgba(0,0,0,0)');
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, 64, 64);
        return new THREE.CanvasTexture(canvas);
      }

      const globeGroup = new THREE.Group();
      scene.add(globeGroup);

      const GLOBE_RADIUS = 5.8;

      function latLonToVector3(lat, lon, radius) {
        const phi   = (90 - lat) * (Math.PI / 180);
        const theta = (lon + 180) * (Math.PI / 180);
        return new THREE.Vector3(
          -(radius * Math.sin(phi) * Math.cos(theta)),
           radius * Math.cos(phi),
           radius * Math.sin(phi) * Math.sin(theta)
        );
      }

      // 1. Deep core sphere — very dark, slight tint
      const coreMat = new THREE.MeshBasicMaterial({ color: 0x010812, transparent: true, opacity: 0.97 });
      globeGroup.add(new THREE.Mesh(new THREE.SphereGeometry(GLOBE_RADIUS * 0.98, 48, 48), coreMat));

      // 2. Inner glow sphere — subtle cyan aura
      const innerGlowMat = new THREE.MeshBasicMaterial({
        color: 0x00D4FF, transparent: true, opacity: 0.04, side: THREE.BackSide
      });
      globeGroup.add(new THREE.Mesh(new THREE.SphereGeometry(GLOBE_RADIUS * 1.06, 32, 32), innerGlowMat));

      // 3. Wireframe lat/lon grid — electric cyan, sharp
      const gridMat = new THREE.LineBasicMaterial({ color: 0x00D4FF, transparent: true, opacity: 0.18 });
      const SEG = isMobile ? 48 : 80;

      for (let lat = -75; lat <= 75; lat += 15) {
        const rad = GLOBE_RADIUS * Math.cos(lat * (Math.PI / 180));
        const y   = GLOBE_RADIUS * Math.sin(lat * (Math.PI / 180));
        const pts = [];
        for (let i = 0; i <= SEG; i++) {
          const t = (i / SEG) * Math.PI * 2;
          pts.push(new THREE.Vector3(Math.cos(t) * rad, y, Math.sin(t) * rad));
        }
        globeGroup.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), gridMat));
      }
      for (let lon = 0; lon < 180; lon += 20) {
        const pts = [];
        for (let i = 0; i <= SEG; i++) {
          const t = (i / SEG) * Math.PI * 2;
          const x = Math.sin(t) * GLOBE_RADIUS;
          const y = Math.cos(t) * GLOBE_RADIUS;
          pts.push(new THREE.Vector3(x * Math.cos(lon * Math.PI / 180), y, x * Math.sin(lon * Math.PI / 180)));
        }
        globeGroup.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), gridMat));
      }

      // 4. Continent particle cloud — vivid cyan + white + purple accent
      const totalParticles = isMobile ? 2200 : 4200;
      const positions = new Float32Array(totalParticles * 3);
      const pColors   = new Float32Array(totalParticles * 3);

      const cCyan    = new THREE.Color(0x00D4FF);
      const cBlue    = new THREE.Color(0x0099FF);
      const cPurple  = new THREE.Color(0x7B2FFF);
      const cWhite   = new THREE.Color(0xE0F8FF);
      const cIce     = new THREE.Color(0xA0F0FF);

      const continents = [
        [10, 65, 40, 140],   // Asia
        [-35, 37, -15, 52],  // Africa
        [36, 68, -10, 45],   // Europe
        [15, 68, -130, -60], // North America
        [-55, 12, -80, -35], // South America
        [-40, -10, 115, 155] // Australia
      ];

      for (let i = 0; i < totalParticles; i++) {
        let lat, lon;
        if (Math.random() < 0.74) {
          const c = continents[Math.floor(Math.random() * continents.length)];
          lat = c[0] + Math.random() * (c[1] - c[0]);
          lon = c[2] + Math.random() * (c[3] - c[2]);
        } else {
          lat = (Math.random() - 0.5) * 160;
          lon = (Math.random() - 0.5) * 360;
        }
        const v = latLonToVector3(lat, lon, GLOBE_RADIUS + (Math.random() - 0.5) * 0.15);
        positions[i * 3]     = v.x;
        positions[i * 3 + 1] = v.y;
        positions[i * 3 + 2] = v.z;

        const r = Math.random();
        let col;
        if      (r < 0.45) col = cCyan.clone().lerp(cBlue, Math.random());
        else if (r < 0.70) col = cWhite.clone().lerp(cIce, Math.random());
        else if (r < 0.88) col = cBlue.clone().lerp(cPurple, Math.random() * 0.5);
        else               col = cPurple.clone();
        pColors[i * 3]     = col.r;
        pColors[i * 3 + 1] = col.g;
        pColors[i * 3 + 2] = col.b;
      }

      const pGeo = new THREE.BufferGeometry();
      pGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      pGeo.setAttribute('color',    new THREE.BufferAttribute(pColors, 3));

      const pMat = new THREE.PointsMaterial({
        size: isMobile ? 0.85 : 0.72,
        vertexColors: true,
        map: createParticleTexture('rgba(0,212,255,1)', 'rgba(0,100,255,0.4)'),
        transparent: true,
        opacity: 0.95,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      });
      globeGroup.add(new THREE.Points(pGeo, pMat));

      // 5. City beacons & connection arcs
      const cities = [
        { name: 'Peshawar (HQ)', lat: 34.0151, lon: 71.5249, isHQ: true },
        { name: 'Dubai',    lat: 25.2048, lon: 55.2708 },
        { name: 'London',   lat: 51.5074, lon: -0.1278 },
        { name: 'New York', lat: 40.7128, lon: -74.006 },
        { name: 'Tokyo',    lat: 35.6762, lon: 139.6503 },
        { name: 'Sydney',   lat: -33.8688, lon: 151.2093 },
        { name: 'Zurich',   lat: 47.3769, lon: 8.5417 },
        { name: 'Global',   lat: 0.0, lon: 0.0 }
      ];

      const hqPos = latLonToVector3(cities[0].lat, cities[0].lon, GLOBE_RADIUS);

      cities.forEach((c) => {
        const pos = latLonToVector3(c.lat, c.lon, GLOBE_RADIUS);
        // Beacon dot
        const bMat = new THREE.MeshBasicMaterial({
          color: c.isHQ ? 0x00D4FF : 0xA0F0FF, transparent: true, opacity: 0.98
        });
        const beacon = new THREE.Mesh(new THREE.SphereGeometry(c.isHQ ? 0.38 : 0.20, 16, 16), bMat);
        beacon.position.copy(pos);
        globeGroup.add(beacon);

        // Pulse ring around HQ
        if (c.isHQ) {
          const ringMat = new THREE.LineBasicMaterial({ color: 0x00D4FF, transparent: true, opacity: 0.6 });
          const ringPts = [];
          for (let i = 0; i <= 48; i++) {
            const a = (i / 48) * Math.PI * 2;
            ringPts.push(new THREE.Vector3(Math.cos(a) * 0.7, Math.sin(a) * 0.7, 0));
          }
          const ring = new THREE.Line(new THREE.BufferGeometry().setFromPoints(ringPts), ringMat);
          ring.position.copy(pos);
          ring.lookAt(new THREE.Vector3(0, 0, 0));
          globeGroup.add(ring);
        }
      });

      // Arcs HQ → other cities
      for (let i = 1; i < cities.length; i++) {
        const destPos = latLonToVector3(cities[i].lat, cities[i].lon, GLOBE_RADIUS);
        const mid = new THREE.Vector3().addVectors(hqPos, destPos).multiplyScalar(0.5);
        mid.normalize().multiplyScalar(GLOBE_RADIUS + hqPos.distanceTo(destPos) * 0.38);
        const curve  = new THREE.QuadraticBezierCurve3(hqPos, mid, destPos);
        const arcGeo = new THREE.BufferGeometry().setFromPoints(curve.getPoints(isMobile ? 28 : 48));
        const arcMat = new THREE.LineBasicMaterial({
          color: i % 2 === 0 ? 0x00D4FF : 0x7B2FFF, transparent: true, opacity: 0.40
        });
        globeGroup.add(new THREE.Line(arcGeo, arcMat));
      }

      // 6. Outer atmosphere halo ring 1 — cyan
      const h1Count = isMobile ? 200 : 420;
      const h1Pos = new Float32Array(h1Count * 3);
      for (let i = 0; i < h1Count; i++) {
        const t = (i / h1Count) * Math.PI * 2;
        const r = GLOBE_RADIUS * 1.28 + (Math.random() - 0.5) * 0.9;
        h1Pos[i*3]   = Math.cos(t) * r;
        h1Pos[i*3+1] = (Math.random() - 0.5) * 1.2;
        h1Pos[i*3+2] = Math.sin(t) * r;
      }
      const halo1Geo = new THREE.BufferGeometry();
      halo1Geo.setAttribute('position', new THREE.BufferAttribute(h1Pos, 3));
      const halo1 = new THREE.Points(halo1Geo, new THREE.PointsMaterial({
        size: 0.55, color: 0x00D4FF,
        map: createParticleTexture('rgba(0,212,255,1)', 'rgba(0,100,255,0.3)'),
        transparent: true, opacity: 0.55, blending: THREE.AdditiveBlending, depthWrite: false
      }));
      halo1.rotation.x = 0.35;
      globeGroup.add(halo1);

      // 7. Outer atmosphere halo ring 2 — purple accent, tilted
      const h2Count = isMobile ? 120 : 260;
      const h2Pos = new Float32Array(h2Count * 3);
      for (let i = 0; i < h2Count; i++) {
        const t = (i / h2Count) * Math.PI * 2;
        const r = GLOBE_RADIUS * 1.42 + (Math.random() - 0.5) * 0.7;
        h2Pos[i*3]   = Math.cos(t) * r;
        h2Pos[i*3+1] = (Math.random() - 0.5) * 0.8;
        h2Pos[i*3+2] = Math.sin(t) * r;
      }
      const halo2Geo = new THREE.BufferGeometry();
      halo2Geo.setAttribute('position', new THREE.BufferAttribute(h2Pos, 3));
      const halo2 = new THREE.Points(halo2Geo, new THREE.PointsMaterial({
        size: 0.50, color: 0x7B2FFF,
        map: createParticleTexture('rgba(123,47,255,1)', 'rgba(0,100,255,0.2)'),
        transparent: true, opacity: 0.40, blending: THREE.AdditiveBlending, depthWrite: false
      }));
      halo2.rotation.x = -0.6;
      halo2.rotation.z = 0.4;
      globeGroup.add(halo2);

      // 8. Sparse deep-space star field behind globe
      const starCount = isMobile ? 300 : 600;
      const starPos = new Float32Array(starCount * 3);
      for (let i = 0; i < starCount; i++) {
        const r = 16 + Math.random() * 12;
        const theta = Math.random() * Math.PI * 2;
        const phi   = Math.acos(2 * Math.random() - 1);
        starPos[i*3]   = r * Math.sin(phi) * Math.cos(theta);
        starPos[i*3+1] = r * Math.sin(phi) * Math.sin(theta);
        starPos[i*3+2] = r * Math.cos(phi);
      }
      const starGeo = new THREE.BufferGeometry();
      starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
      scene.add(new THREE.Points(starGeo, new THREE.PointsMaterial({
        size: 0.18, color: 0xA0C8FF, transparent: true, opacity: 0.55, depthWrite: false
      })));

      // --- Interaction & Animation ---
      let targetX = 0, targetY = 0, currentX = 0, currentY = 0;
      let targetRotY = -(71.5249 * (Math.PI / 180)) - Math.PI * 0.45;
      let targetRotX =  (34.0151 * (Math.PI / 180)) * 0.35;
      let currentRotY = targetRotY, currentRotX = targetRotX;
      let clock = 0;
      let isDragging = false;
      let startMouseX = 0, startMouseY = 0;
      let startRotX = 0, startRotY = 0;

      window.setGlobeTargetHub = function(lat, lon) {
        targetRotY = -(lon * (Math.PI / 180)) - Math.PI * 0.45;
        targetRotX =  (lat * (Math.PI / 180)) * 0.35;
      };

      const onPointerDown = (clientX, clientY) => {
        isDragging = true;
        startMouseX = clientX;
        startMouseY = clientY;
        startRotX = targetRotX;
        startRotY = targetRotY;
        if (renderer.domElement) renderer.domElement.style.cursor = 'grabbing';
      };

      const onPointerMove = (clientX, clientY) => {
        if (!isDragging) {
          targetX = (clientX / window.innerWidth  - 0.5) * 0.8;
          targetY = (clientY / window.innerHeight - 0.5) * 0.6;
          return;
        }
        const deltaX = (clientX - startMouseX) * 0.007;
        const deltaY = (clientY - startMouseY) * 0.007;
        targetRotY = startRotY + deltaX;
        targetRotX = Math.max(-1.3, Math.min(1.3, startRotX + deltaY));
      };

      const onPointerUp = () => {
        isDragging = false;
        if (renderer.domElement) renderer.domElement.style.cursor = 'grab';
      };

      // Mouse drag listeners
      container.addEventListener('mousedown', (e) => {
        onPointerDown(e.clientX, e.clientY);
      });
      window.addEventListener('mousemove', (e) => {
        onPointerMove(e.clientX, e.clientY);
      });
      window.addEventListener('mouseup', onPointerUp);

      // Mobile Touch Drag Listeners
      container.addEventListener('touchstart', (e) => {
        if (e.touches.length === 1) {
          onPointerDown(e.touches[0].clientX, e.touches[0].clientY);
        }
      }, { passive: true });

      window.addEventListener('touchmove', (e) => {
        if (isDragging && e.touches.length === 1) {
          onPointerMove(e.touches[0].clientX, e.touches[0].clientY);
        }
      }, { passive: true });

      window.addEventListener('touchend', onPointerUp, { passive: true });

      function animate() {
        requestAnimationFrame(animate);
        clock += 0.008;

        // Auto slow spin on idle
        if (!isDragging) {
          targetRotY += isMobile ? 0.0035 : 0.002;
        }

        currentRotY += (targetRotY - currentRotY) * 0.06;
        currentRotX += (targetRotX - currentRotX) * 0.06;
        currentX    += (targetX - currentX) * 0.05;
        currentY    += (targetY - currentY) * 0.05;

        globeGroup.rotation.y = currentRotY + currentX * 0.22;
        globeGroup.rotation.x = currentRotX + currentY * 0.16;

        // Halos rotate at different speeds for dynamic feel
        halo1.rotation.z += 0.002;
        halo2.rotation.z -= 0.0014;

        // Gentle inner glow pulse
        innerGlowMat.opacity = 0.03 + Math.sin(clock * 1.4) * 0.02;

        renderer.render(scene, camera);
      }

      animate();

      const updateGlobeSize = () => {
        const w = container.clientWidth || 500;
        const h = container.clientHeight || 450;
        if (w > 0 && h > 0) {
          const mobileNow = window.innerWidth < 768;
          camera.aspect = w / h;
          camera.position.z = mobileNow ? 21 : (window.innerWidth < 1024 ? 20 : 18);
          camera.updateProjectionMatrix();
          renderer.setSize(w, h);
          renderer.setPixelRatio(Math.min(window.devicePixelRatio, mobileNow ? 1.5 : 2));
        }
      };
      setTimeout(updateGlobeSize, 200);
      window.addEventListener('resize', updateGlobeSize);
      window.addEventListener('orientationchange', () => setTimeout(updateGlobeSize, 250));
      if (window.ResizeObserver) {
        new ResizeObserver(() => updateGlobeSize()).observe(container);
      }

    } catch (e) {
      console.warn('Three.js Globe Init:', e);
    }
  }

  /* ==========================================================================
     6. GSAP SCROLLTRIGGER & INTERACTION ANIMATIONS
     ========================================================================== */
  function initAnimations() {
    if (typeof gsap === 'undefined') return;

    if (typeof ScrollTrigger !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);
      ScrollTrigger.config({
        ignoreMobileResize: true,
        autoRefreshEvents: 'visibilitychange,DOMContentLoaded,load,resize'
      });
    }

    // Magnetic Buttons
    if (!window.matchMedia('(pointer: coarse)').matches) {
      document.querySelectorAll('.magnetic-btn').forEach((el) => {
        el.addEventListener('mousemove', (e) => {
          const rect = el.getBoundingClientRect();
          const x = e.clientX - rect.left - rect.width / 2;
          const y = e.clientY - rect.top - rect.height / 2;
          gsap.to(el, { x: x * 0.3, y: y * 0.3, duration: 0.3, ease: 'power2.out' });
        });
        el.addEventListener('mouseleave', () => {
          gsap.to(el, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.3)' });
        });
      });
    }

    // Hero Entrance
    const hero = document.querySelector('.section-hero');
    if (hero) {
      const titleLines = hero.querySelectorAll('.hero-title-line');
      const heroSub = hero.querySelector('.hero-subtitle');
      const heroCtas = hero.querySelectorAll('.hero-cta');
      const heroBg = hero.querySelector('.hero-bg-img');

      const tl = gsap.timeline();

      if (heroBg) {
        tl.fromTo(heroBg, 
          { scale: 1.1, filter: 'brightness(0.2) contrast(1.2)' },
          { scale: 1.02, filter: 'brightness(0.5) contrast(1.1)', duration: 1.4, ease: 'power3.out' },
          0
        );
      }

      if (titleLines.length) {
        tl.fromTo(titleLines,
          { y: 50, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.9, stagger: 0.1, ease: 'power4.out' },
          0.1
        );
      }

      if (heroSub) {
        tl.fromTo(heroSub,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out' },
          0.5
        );
      }

      if (heroCtas.length) {
        tl.fromTo(heroCtas,
          { y: 15, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, stagger: 0.08, ease: 'power3.out' },
          0.7
        );
      }
    }

    // Intro Statement Scrub Reveal
    const introTextEl = document.querySelector('.scrub-intro-text');
    if (introTextEl && typeof ScrollTrigger !== 'undefined') {
      const lineEls = introTextEl.querySelectorAll('.scrub-line');
      if (lineEls.length > 0) {
        lineEls.forEach(lineEl => {
          const words = lineEl.textContent.trim().split(/\s+/);
          lineEl.innerHTML = words.map(word => `<span class="scrub-text-word">${word}&nbsp;</span>`).join('');
        });
      } else {
        const text = introTextEl.textContent.trim();
        const words = text.split(/\s+/);
        introTextEl.innerHTML = words.map(word => `<span class="scrub-text-word">${word}&nbsp;</span>`).join('');
      }

      const wordSpans = introTextEl.querySelectorAll('.scrub-text-word');

      gsap.fromTo(wordSpans,
        { opacity: 0.35, y: 8 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.035,
          ease: 'none',
          scrollTrigger: {
            trigger: introTextEl,
            start: 'top 85%',
            end: 'bottom 45%',
            scrub: 0.35
          }
        }
      );
    }

    // Horizontal Scroll (Gym Experience) - Desktop only, with accurate width calculations
    const container = document.querySelector('.horizontal-scroll-container');
    const track = document.querySelector('.horizontal-track');
    if (container && track && typeof ScrollTrigger !== 'undefined') {
      let mm = gsap.matchMedia();
      mm.add('(min-width: 1025px)', () => {
        const getScrollDistance = () => track.scrollWidth - window.innerWidth + 100;
        gsap.to(track, {
          x: () => -getScrollDistance(),
          ease: 'none',
          scrollTrigger: {
            trigger: container,
            pin: true,
            scrub: 0.8,
            start: 'top top',
            end: () => `+=${getScrollDistance()}`,
            invalidateOnRefresh: true
          }
        });
      });
    }

    // 3D Pinned Globe + Vertically Scrolling Cards Synchronizer (8 Cards)
    const pinnedGlobeSection = document.getElementById('pinned-globe-experience');
    if (pinnedGlobeSection && typeof ScrollTrigger !== 'undefined') {
      const scrollCards = pinnedGlobeSection.querySelectorAll('.globe-scroll-card');
      const activeHubEl = document.getElementById('globe-active-hub');
      const latEl = document.getElementById('hud-coord-lat');
      const lonEl = document.getElementById('hud-coord-lon');

      let mm = gsap.matchMedia();

      mm.add('(min-width: 1025px)', () => {
        // Pin globe - centered in viewport while cards scroll
        ScrollTrigger.create({
          trigger: '.pinned-globe-layout',
          pin: '.pinned-globe-left',
          start: 'top top+=80',
          end: 'bottom bottom',
          pinSpacing: false,
          invalidateOnRefresh: true
        });
      });

      scrollCards.forEach((card, idx) => {
        const lat = parseFloat(card.getAttribute('data-lat') || '0');
        const lon = parseFloat(card.getAttribute('data-lon') || '0');
        const name = card.getAttribute('data-name') || '';

        // Tapping/clicking on a hub card rotates globe immediately
        card.addEventListener('click', () => {
          activateGlobeCard(card, lat, lon, name);
        });

        // Responsive card entrance and active state trigger
        ScrollTrigger.create({
          trigger: card,
          start: 'top 65%',
          end: 'bottom 35%',
          onEnter: () => activateGlobeCard(card, lat, lon, name),
          onEnterBack: () => activateGlobeCard(card, lat, lon, name),
          invalidateOnRefresh: true
        });

        // Subtle scrub entrance animation
        gsap.fromTo(card,
          { y: 25, opacity: 0.4 },
          {
            y: 0,
            opacity: 1,
            duration: 0.6,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 85%',
              end: 'top 45%',
              scrub: 0.35,
              invalidateOnRefresh: true
            }
          }
        );
      });

      function activateGlobeCard(activeCard, lat, lon, name) {
        scrollCards.forEach(c => c.classList.remove('active'));
        activeCard.classList.add('active');

        if (activeHubEl) activeHubEl.textContent = name;
        if (latEl) latEl.textContent = `${Math.abs(lat).toFixed(4)}° ${lat >= 0 ? 'N' : 'S'}`;
        if (lonEl) lonEl.textContent = `${Math.abs(lon).toFixed(4)}° ${lon >= 0 ? 'E' : 'W'}`;

        if (typeof window.setGlobeTargetHub === 'function') {
          window.setGlobeTargetHub(lat, lon, name);
        }
      }
    }

    // Transformation Process Pin
    const transSection = document.querySelector('.transformation-section');
    if (transSection && typeof ScrollTrigger !== 'undefined') {
      const cards = transSection.querySelectorAll('.transformation-card');
      const stageIndicator = transSection.querySelector('.transformation-stage-indicator');

      cards.forEach((card, index) => {
        const stageNum = card.getAttribute('data-stage') || `0${index + 1}`;
        ScrollTrigger.create({
          trigger: card,
          start: 'top 65%',
          end: 'bottom 35%',
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
            { opacity: 0.85, scale: 1, duration: 0.35, ease: 'power2.out' }
          );
        }
      }
    }

    // Image Expansion (Reliable width expansion without 100vw page-cut bug)
    const expSection = document.querySelector('.image-expansion-section');
    const expWrap = document.querySelector('.image-expansion-wrap');
    const expTitle = document.querySelector('.image-expansion-title');
    if (expSection && expWrap && typeof ScrollTrigger !== 'undefined') {
      let mm = gsap.matchMedia();
      mm.add('(min-width: 769px)', () => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: expSection,
            start: 'top 75%',
            end: 'bottom 85%',
            scrub: 0.8
          }
        });
        tl.fromTo(expWrap,
          { width: '50vw', height: '55vh', borderRadius: '24px' },
          { width: '100%', height: '80vh', borderRadius: '4px', ease: 'power2.inOut' }
        );
        if (expTitle) {
          tl.fromTo(expTitle,
            { scale: 0.85, opacity: 0.4 },
            { scale: 1.05, opacity: 1, ease: 'power1.out' },
            0.1
          );
        }
      });
    }

    // Text Mask Clip Reveal
    const maskSection = document.querySelector('.text-mask-section');
    if (maskSection && typeof ScrollTrigger !== 'undefined') {
      const titleLines = maskSection.querySelectorAll('.text-mask-line');
      gsap.fromTo(titleLines,
        { clipPath: 'polygon(0 100%, 100% 100%, 100% 100%, 0% 100%)', y: 30 },
        {
          clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0% 100%)',
          y: 0,
          duration: 1,
          stagger: 0.12,
          ease: 'power4.out',
          scrollTrigger: {
            trigger: maskSection,
            start: 'top 75%',
            toggleActions: 'play none none reverse'
          }
        }
      );
    }

    // Accordions
    document.querySelectorAll('.accordion-item').forEach((item) => {
      const header = item.querySelector('.accordion-header');
      const body = item.querySelector('.accordion-body');
      if (!header || !body) return;

      header.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        document.querySelectorAll('.accordion-item').forEach((other) => {
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

        if (typeof ScrollTrigger !== 'undefined') {
          setTimeout(() => ScrollTrigger.refresh(), 350);
        }
      });
    });

    // Testimonial Slider
    const slider = document.querySelector('.testimonial-slider');
    if (slider) {
      const slides = slider.querySelectorAll('.testimonial-slide');
      const prevBtn = document.querySelector('.testimonial-prev');
      const nextBtn = document.querySelector('.testimonial-next');
      let currentIndex = 0;

      function showSlide(index) {
        slides.forEach((s, i) => {
          if (i === index) {
            s.style.display = 'block';
            gsap.fromTo(s, { opacity: 0, x: 20 }, { opacity: 1, x: 0, duration: 0.4, ease: 'power2.out' });
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
  }

  /* ==========================================================================
     7. TOP SCROLL PROGRESS BAR
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
     8. GLOBAL MODALS (BOOK TRIAL / CONSULTATION / JOIN)
     ========================================================================== */
  function initGlobalModals() {
    document.querySelectorAll('[data-modal-target]').forEach((trigger) => {
      trigger.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = trigger.getAttribute('data-modal-target');
        const modal = document.getElementById(targetId);
        if (modal) {
          modal.classList.add('active');
          document.body.style.overflow = 'hidden';

          // If target is auth-modal and specifies a tab (e.g. data-auth-tab="signup")
          if (targetId === 'auth-modal') {
            const requestedTab = trigger.getAttribute('data-auth-tab') || 'signin';
            if (typeof window.switchAuthTab === 'function') {
              window.switchAuthTab(requestedTab);
            }
          }
        }
      });
    });

    document.querySelectorAll('.modal-close-btn, [data-modal-close]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const modal = btn.closest('.modal-backdrop');
        if (modal) {
          modal.classList.remove('active');
          document.body.style.overflow = '';
        }
      });
    });

    document.querySelectorAll('.modal-backdrop').forEach((backdrop) => {
      backdrop.addEventListener('click', (e) => {
        if (e.target === backdrop) {
          backdrop.classList.remove('active');
          document.body.style.overflow = '';
        }
      });
    });

    // Fallback delegated handler for auth modal tab switching
    document.addEventListener('click', (e) => {
      const authTab = e.target.closest('.auth-tab');
      if (authTab && authTab.dataset.tab) {
        e.preventDefault();
        if (typeof window.switchAuthTab === 'function') {
          window.switchAuthTab(authTab.dataset.tab);
        } else {
          // Instant DOM fallback switch
          document.querySelectorAll('.auth-tab').forEach(t => t.classList.toggle('active', t === authTab));
          const tab = authTab.dataset.tab;
          const forms = {
            signin: document.getElementById('auth-signin-form'),
            signup: document.getElementById('auth-signup-form'),
            forgot: document.getElementById('auth-forgot-form')
          };
          Object.keys(forms).forEach(k => {
            if (forms[k]) forms[k].style.display = k === tab ? 'block' : 'none';
          });
          const header = document.querySelector('.auth-tabs-header');
          if (header) header.style.display = tab === 'forgot' ? 'none' : 'flex';
        }
        return;
      }

      const switchLink = e.target.closest('[data-switch-tab]');
      if (switchLink && switchLink.dataset.switchTab) {
        e.preventDefault();
        const tab = switchLink.dataset.switchTab;
        if (typeof window.switchAuthTab === 'function') {
          window.switchAuthTab(tab);
        } else {
          document.querySelectorAll('.auth-tab').forEach(t => t.classList.toggle('active', t.dataset.tab === tab));
          const forms = {
            signin: document.getElementById('auth-signin-form'),
            signup: document.getElementById('auth-signup-form'),
            forgot: document.getElementById('auth-forgot-form')
          };
          Object.keys(forms).forEach(k => {
            if (forms[k]) forms[k].style.display = k === tab ? 'block' : 'none';
          });
          const header = document.querySelector('.auth-tabs-header');
          if (header) header.style.display = tab === 'forgot' ? 'none' : 'flex';
        }
        return;
      }

      // Quick Demo Sign In Fallback if Firebase not reachable
      const quickBtn = e.target.closest('.js-quick-demo-signin');
      if (quickBtn && !window.auth) {
        e.preventDefault();
        const mockUser = {
          displayName: 'Jawad Khan',
          email: 'test_gym_user_123@example.com'
        };
        try {
          localStorage.setItem('neurofit_active_user', JSON.stringify(mockUser));
        } catch(e){}
        const modal = document.getElementById('auth-modal');
        if (modal) {
          modal.classList.remove('active');
          document.body.style.overflow = '';
        }
        window.location.href = 'dashboard.html';
        return;
      }

      // Google Sign-In Fallback if Firebase not reachable
      const googleBtn = e.target.closest('.js-google-signin');
      if (googleBtn && !window.auth) {
        e.preventDefault();
        const mockGoogleUser = {
          displayName: 'Jawad Khan (Google)',
          email: 'jawad.athlete@gmail.com',
          photoURL: 'assets/images/trainers/trainer-1.jpg'
        };
        try {
          localStorage.setItem('neurofit_active_user', JSON.stringify(mockGoogleUser));
        } catch(e){}
        const modal = document.getElementById('auth-modal');
        if (modal) {
          modal.classList.remove('active');
          document.body.style.overflow = '';
        }
        window.location.href = 'dashboard.html';
        return;
      }
    });
  }

  /* ==========================================================================
     9. MEMBERSHIP PRICING TOGGLE
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
     10. PROGRAM FILTER TABS
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
     11. TRAINER FILTER TABS
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
     12. FORM VALIDATION
     ========================================================================== */
  function initForms() {
    document.querySelectorAll('form.js-validate-form').forEach((form) => {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        let isValid = true;

        form.querySelectorAll('[required]').forEach((input) => {
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
            alert('Thank you! Your request has been submitted to NEUROFIT.');
            form.reset();
          }
        }
      });
    });
  }

  /* ==========================================================================
     13. 3D INTERACTIVE TILT ENGINE (CARDS, PROTOCOLS & HUBS)
     ========================================================================== */
  function init3DTilt() {
    const tiltCards = document.querySelectorAll(
      '.program-card, .trainer-card, .coach-mockup-card, .smart-card, .pricing-card, .experience-panel, .about-space-card'
    );
    if (!tiltCards.length) return;

    tiltCards.forEach((card) => {
      let bounds;

      function mouseMove(e) {
        bounds = card.getBoundingClientRect();
        const mouseX = e.clientX;
        const mouseY = e.clientY;
        const leftX = mouseX - bounds.x;
        const topY = mouseY - bounds.y;
        const center = {
          x: leftX - bounds.width / 2,
          y: topY - bounds.height / 2
        };

        card.style.transform = `
          perspective(1000px)
          scale3d(1.02, 1.02, 1.02)
          rotateX(${-(center.y / 24)}deg)
          rotateY(${center.x / 24}deg)
          translateZ(8px)
        `;
        card.style.transition = 'transform 0.1s ease-out, box-shadow 0.2s ease-out';
      }

      function mouseLeave() {
        card.style.transform = `
          perspective(1000px)
          scale3d(1, 1, 1)
          rotateX(0deg)
          rotateY(0deg)
          translateZ(0px)
        `;
        card.style.transition = 'transform 0.4s cubic-bezier(0.25, 1, 0.5, 1), box-shadow 0.4s ease-out';
      }

      card.addEventListener('mouseenter', () => {
        bounds = card.getBoundingClientRect();
      });
      card.addEventListener('mousemove', mouseMove);
      card.addEventListener('mouseleave', mouseLeave);

      // Mobile Touch feedback
      card.addEventListener('touchstart', () => {
        card.style.transform = 'perspective(1000px) scale3d(0.98, 0.98, 0.98) translateZ(4px)';
        card.style.transition = 'transform 0.15s ease-out';
      }, { passive: true });

      card.addEventListener('touchend', () => {
        card.style.transform = 'perspective(1000px) scale3d(1, 1, 1) translateZ(0px)';
        card.style.transition = 'transform 0.3s cubic-bezier(0.25, 1, 0.5, 1)';
      }, { passive: true });
    });
  }

})();

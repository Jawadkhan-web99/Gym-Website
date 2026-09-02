/* ==========================================================================
   IRON DISTRICT - CUSTOM DUAL CURSOR (GSAP QUICKTO)
   ========================================================================== */

export function initCustomCursor() {
  // Disable on touch devices or small screens
  if (window.matchMedia('(pointer: coarse)').matches || window.innerWidth < 1024) {
    return;
  }

  // Create cursor elements dynamically if not present in DOM
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

  // Use gsap.quickTo for ultra-smooth performance
  const setDotX = gsap.quickTo(dot, 'x', { duration: 0.1, ease: 'power3' });
  const setDotY = gsap.quickTo(dot, 'y', { duration: 0.1, ease: 'power3' });

  const setFollowerX = gsap.quickTo(follower, 'x', { duration: 0.35, ease: 'power2.out' });
  const setFollowerY = gsap.quickTo(follower, 'y', { duration: 0.35, ease: 'power2.out' });

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    setDotX(mouseX);
    setDotY(mouseY);
    setFollowerX(mouseX);
    setFollowerY(mouseY);
  });

  // Attach hover listeners
  function setupHoverListeners() {
    // Data cursor elements (e.g. data-cursor="VIEW", data-cursor="JOIN", data-cursor="EXPLORE")
    document.querySelectorAll('[data-cursor]').forEach((el) => {
      el.addEventListener('mouseenter', () => {
        const text = el.getAttribute('data-cursor') || '';
        cursorText.textContent = text;
        const state = text.toLowerCase();
        document.body.classList.remove('cursor-hover-view', 'cursor-hover-join', 'cursor-hover-explore', 'cursor-hover-link');
        document.body.classList.add(`cursor-hover-${state}`);
      });

      el.addEventListener('mouseleave', () => {
        cursorText.textContent = '';
        document.body.classList.remove('cursor-hover-view', 'cursor-hover-join', 'cursor-hover-explore', 'cursor-hover-link');
      });
    });

    // Standard buttons and links
    document.querySelectorAll('a, button, .interactive').forEach((el) => {
      if (el.hasAttribute('data-cursor')) return; // handled above

      el.addEventListener('mouseenter', () => {
        document.body.classList.add('cursor-hover-link');
      });

      el.addEventListener('mouseleave', () => {
        document.body.classList.remove('cursor-hover-link');
      });
    });
  }

  setupHoverListeners();

  // Hide cursor when leaving window
  document.addEventListener('mouseleave', () => {
    gsap.to([dot, follower], { opacity: 0, duration: 0.3 });
  });

  document.addEventListener('mouseenter', () => {
    gsap.to([dot, follower], { opacity: 1, duration: 0.3 });
  });

  // Expose rebind for dynamic content
  window.refreshCursorListeners = setupHoverListeners;
}

/* ==========================================================================
   IRON DISTRICT - ANIMATED NUMERICAL STAT COUNTERS
   ========================================================================== */

export function initCounters() {
  const counterElements = document.querySelectorAll('[data-counter]');
  if (!counterElements.length) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  counterElements.forEach((el) => observer.observe(el));
}

function animateCounter(el) {
  const target = parseFloat(el.getAttribute('data-counter') || '0');
  const prefix = el.getAttribute('data-prefix') || '';
  const suffix = el.getAttribute('data-suffix') || '';
  const duration = parseFloat(el.getAttribute('data-duration') || '2'); // seconds

  const startTime = performance.now();

  function updateCount(currentTime) {
    const elapsed = (currentTime - startTime) / 1000;
    const progress = Math.min(elapsed / duration, 1);

    // Ease-out cubic calculation
    const easeOutProgress = 1 - Math.pow(1 - progress, 3);
    const currentValue = Math.floor(easeOutProgress * target);

    // Format with commas if >= 1000
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

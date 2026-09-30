/**
 * FX layer: preloader intro, hero particle canvas, mouse spotlight, marquee loop.
 * Plain JS, no dependencies.
 */
(function() {
  "use strict";

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /**
   * Preloader intro (called by main.js on window load)
   */
  window.fxIntro = function(preloader) {
    const count = preloader.querySelector('.pl-count');
    const duration = reduceMotion ? 0 : 700;
    const start = performance.now();

    function finish() {
      preloader.classList.add('is-done');
      setTimeout(() => preloader.remove(), 600);
    }

    function tick(now) {
      const p = duration ? Math.min((now - start) / duration, 1) : 1;
      if (count) count.textContent = Math.round(p * 100);
      preloader.style.setProperty('--pl-progress', p);
      if (p < 1) requestAnimationFrame(tick);
      else setTimeout(finish, 150);
    }
    requestAnimationFrame(tick);
  };

  /**
   * Marquee: duplicate each track's items so the -50% loop is seamless
   */
  document.querySelectorAll('.fx-marquee-track').forEach(track => {
    const items = Array.from(track.children);
    items.forEach(el => {
      const clone = el.cloneNode(true);
      clone.setAttribute('aria-hidden', 'true');
      track.appendChild(clone);
    });
  });

  const hero = document.querySelector('#hero');
  if (!hero) return;

  /**
   * Mouse spotlight
   */
  const spotlight = hero.querySelector('.hero-spotlight');
  if (spotlight && window.matchMedia('(pointer: fine)').matches) {
    window.addEventListener('pointermove', e => {
      spotlight.style.setProperty('--mx', e.clientX + 'px');
      spotlight.style.setProperty('--my', e.clientY + 'px');
      spotlight.classList.add('is-active');
    }, { passive: true });
    document.documentElement.addEventListener('pointerleave', () => spotlight.classList.remove('is-active'));
  }

  /**
   * Particle network on the hero canvas
   */
  const canvas = document.querySelector('#hero-canvas');
  if (!canvas || reduceMotion) return;

  const ctx = canvas.getContext('2d');
  const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
  const LINK_DIST = 130;
  let w = 0, h = 0, particles = [], running = false, rafId = 0;

  function resize() {
    w = window.innerWidth;
    h = window.innerHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // Density scales with area, capped for performance
    const n = Math.min(Math.round((w * h) / 16000), 90);
    particles = Array.from({ length: n }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3
    }));
  }

  function draw() {
    ctx.clearRect(0, 0, w, h);

    for (const p of particles) {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > w) p.vx *= -1;
      if (p.y < 0 || p.y > h) p.vy *= -1;
    }

    ctx.lineWidth = 1;
    for (let i = 0; i < particles.length; i++) {
      const a = particles[i];
      for (let j = i + 1; j < particles.length; j++) {
        const b = particles[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        const d2 = dx * dx + dy * dy;
        if (d2 < LINK_DIST * LINK_DIST) {
          ctx.strokeStyle = 'rgba(139, 92, 246,' + (0.18 * (1 - Math.sqrt(d2) / LINK_DIST)) + ')';
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }

    ctx.fillStyle = 'rgba(167, 139, 250, 0.6)';
    for (const p of particles) {
      ctx.fillRect(p.x - 1, p.y - 1, 2, 2);
    }

    rafId = requestAnimationFrame(draw);
  }

  function setRunning(on) {
    if (on === running) return;
    running = on;
    if (on) rafId = requestAnimationFrame(draw);
    else cancelAnimationFrame(rafId);
  }

  resize();
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(resize, 150);
  });

  // Only animate while the hero is on screen and the tab is visible
  let heroVisible = true;
  new IntersectionObserver(([entry]) => {
    heroVisible = entry.isIntersecting;
    hero.classList.toggle('fx-off', !heroVisible);
    setRunning(heroVisible && !document.hidden);
  }).observe(hero);
  document.addEventListener('visibilitychange', () => setRunning(heroVisible && !document.hidden));

})();

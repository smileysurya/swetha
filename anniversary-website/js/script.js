/* ==========================================================================
   Surya & Priya — Anniversary Website
   Vanilla JS + GSAP. All configuration lives in CONFIG below.
   ========================================================================== */

const CONFIG = {
  coupleNames: "Saurav ❤️ Swetha",
  anniversaryDate: "2026-08-13",
  heroTitle: "Our Forever Story",
  music: "audio/our-song.mp3",
  loveLetter: `Happy Happy love anniversary my love 🤍🥹🌏 thank you so much indha love la enakaga ivolo love, support, affection elame kuduthadhuku🤍🌏💋 Indha 5yrs avolo happy ha irundha enakaga en kuda irundhu elame enakga seinja life ha mathuna... 5yrs neriya change agi iruku but inum love neraiya kudukura ♥️🌏 enakaga epome iru nanu unakaga epome irupa 💋🥹 life la evolo prblms struggle vandhalu un kuda na irupa ♥️🧿 unakaga epome elame seiva.. love you always teddy 🤍🌏🥹 happy love anniversary ♥️`,
  quotes: [
    { text: "Being deeply loved by someone gives you strength, while loving someone deeply gives you courage.", author: "Lao Tzu" },
    { text: "I have found the one whom my soul loves.", author: "Song of Solomon" },
    { text: "Whatever our souls are made of, his and mine are the same.", author: "Emily Brontë" },
    { text: "You are my today and all of my tomorrows.", author: "Leo Christopher" },
    { text: "In all the world, there is no heart for me like yours.", author: "Maya Angelou" },
    { text: "Love does not consist of gazing at each other, but in looking outward together in the same direction.", author: "Antoine de Saint-Exupéry" }
  ]
};

/* ==========================================================================
   Utility
   ========================================================================== */
const $  = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
const clamp = (n, min, max) => Math.max(min, Math.min(max, n));
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

document.addEventListener('DOMContentLoaded', () => {
  applyConfig();
  initLoader();
  initFloatingHearts();
  initParticles();
  initCursorGlow();
  initScrollProgress();
  initSideNav();
  initHeartRipple();
  initScrollReveal();
  initTimelineReveal();
  initCarousel();
  initLightbox();
  initCountdown();
  initTypewriterLetter();
  initMusicPlayer();
  initCelebration();
  initQuoteCarousel();
  initBackToTop();
  initSmoothAnchors();
});

/* ==========================================================================
   Apply CONFIG across the DOM
   ========================================================================== */
function applyConfig(){
  // Names formatted with heart icon markup preserved in hero
  const namesParts = CONFIG.coupleNames.split('❤');
  const nameA = (namesParts[0] || '').trim();
  const nameB = (namesParts[1] || '').replace(/^\uFE0F/, '').trim();

  const heroNames = $('#coupleNamesHero');
  if (heroNames && nameA && nameB){
    heroNames.innerHTML = `${escapeHtml(nameA)} <span class="hero-heart">&#10084;</span> ${escapeHtml(nameB)}`;
  }

  const footerNames = $('#footerNames');
  if (footerNames && nameA && nameB) footerNames.textContent = `${nameA} & ${nameB}`;

  document.title = `${nameA || 'Our'} & ${nameB || 'Story'} — ${CONFIG.heroTitle}`;

  // Dates
  const annDate = new Date(CONFIG.anniversaryDate + 'T00:00:00');
  if (!isNaN(annDate)){
    const dateStr = annDate.toLocaleDateString('en-US', { year:'numeric', month:'long', day:'numeric' });
    const heroDate = $('#heroDateDisplay');
    if (heroDate) heroDate.textContent = dateStr;

    const heroYear = $('#heroYear');
    if (heroYear) heroYear.textContent = annDate.getFullYear();

    const footerDate = $('#footerDate');
    if (footerDate){
      const mm = String(annDate.getMonth()+1).padStart(2,'0');
      const dd = String(annDate.getDate()).padStart(2,'0');
      footerDate.textContent = `${mm}.${dd}.${annDate.getFullYear()}`;
    }
  }

  const heroCta = $('#heroCta span');
  if (heroCta) heroCta.textContent = CONFIG.heroTitle;

  const audioSrc = $('#bgAudio source');
  if (audioSrc) audioSrc.src = CONFIG.music;
}

function escapeHtml(str){
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

/* ==========================================================================
   Loading Screen
   ========================================================================== */
function initLoader(){
  document.body.classList.add('is-loading');
  const loader = $('#loader');
  const minDuration = 2000;
  const start = performance.now();

  const finish = () => {
    const elapsed = performance.now() - start;
    const wait = Math.max(0, minDuration - elapsed);
    setTimeout(() => {
      if (window.gsap){
        gsap.to(loader, {
          opacity: 0,
          duration: 0.8,
          ease: 'power2.out',
          onComplete: () => {
            loader.style.display = 'none';
            document.body.classList.remove('is-loading');
            playHeroIntro();
          }
        });
      } else {
        loader.style.transition = 'opacity .8s ease';
        loader.style.opacity = '0';
        setTimeout(() => {
          loader.style.display = 'none';
          document.body.classList.remove('is-loading');
          playHeroIntro();
        }, 800);
      }
    }, wait);
  };

  if (document.readyState === 'complete') finish();
  else window.addEventListener('load', finish);
}

function playHeroIntro(){
  const items = $$('#hero [data-reveal]');
  if (window.gsap){
    gsap.fromTo(items,
      { opacity: 0, y: 26 },
      { opacity: 1, y: 0, duration: 1, stagger: 0.15, ease: 'power3.out' }
    );
  } else {
    items.forEach((el, i) => {
      setTimeout(() => { el.style.opacity = '1'; }, i * 150);
    });
  }
}

/* ==========================================================================
   Floating Hearts (CSS-driven, JS-generated)
   ========================================================================== */
function initFloatingHearts(){
  const layer = $('#floating-hearts-layer');
  if (!layer) return;
  const count = window.innerWidth < 700 ? 10 : 18;

  for (let i = 0; i < count; i++){
    createFloatingHeart(layer, true);
  }

  // periodically refresh a heart to keep variety without unbounded growth
  setInterval(() => {
    const hearts = $$('.f-heart', layer);
    if (hearts.length) {
      const h = hearts[Math.floor(Math.random() * hearts.length)];
      h.remove();
      createFloatingHeart(layer, false);
    }
  }, 4000);
}

function createFloatingHeart(layer, randomDelay){
  const heart = document.createElement('span');
  heart.className = 'f-heart';
  heart.innerHTML = '&#10084;';
  const size = 10 + Math.random() * 22;
  const left = Math.random() * 100;
  const duration = 10 + Math.random() * 12;
  const delay = randomDelay ? Math.random() * duration : 0;
  const drift = (Math.random() * 140 - 70) + 'px';

  heart.style.left = left + 'vw';
  heart.style.fontSize = size + 'px';
  heart.style.setProperty('--drift', drift);
  heart.style.animationDuration = duration + 's';
  heart.style.animationDelay = delay + 's';
  heart.style.opacity = (0.35 + Math.random() * 0.45).toFixed(2);

  layer.appendChild(heart);
}

/* ==========================================================================
   Ambient floating particles
   ========================================================================== */
function initParticles(){
  const layer = $('#particles-layer');
  if (!layer || prefersReducedMotion) return;
  const count = window.innerWidth < 700 ? 14 : 26;

  for (let i = 0; i < count; i++){
    const p = document.createElement('span');
    p.className = 'particle';
    const left = Math.random() * 100;
    const duration = 14 + Math.random() * 16;
    const delay = Math.random() * duration;
    const drift = (Math.random() * 100 - 50) + 'px';
    const size = 2 + Math.random() * 3;

    p.style.left = left + 'vw';
    p.style.bottom = '-5%';
    p.style.width = size + 'px';
    p.style.height = size + 'px';
    p.style.setProperty('--px', drift);
    p.style.animationDuration = duration + 's';
    p.style.animationDelay = '-' + delay + 's';

    layer.appendChild(p);
  }
}

/* ==========================================================================
   Cursor glow (desktop only, mouse-follow)
   ========================================================================== */
function initCursorGlow(){
  const glow = $('#cursor-glow');
  if (!glow || window.matchMedia('(hover: none)').matches) return;

  let x = window.innerWidth / 2, y = window.innerHeight / 2;
  let curX = x, curY = y;

  window.addEventListener('mousemove', (e) => { x = e.clientX; y = e.clientY; });

  function loop(){
    curX += (x - curX) * 0.12;
    curY += (y - curY) * 0.12;
    glow.style.transform = `translate(${curX}px, ${curY}px) translate(-50%,-50%)`;
    requestAnimationFrame(loop);
  }
  loop();
}

/* ==========================================================================
   Scroll progress indicator
   ========================================================================== */
function initScrollProgress(){
  const bar = $('#scroll-progress-bar');
  if (!bar) return;
  const update = () => {
    const h = document.documentElement;
    const scrolled = h.scrollTop;
    const max = h.scrollHeight - h.clientHeight;
    const pct = max > 0 ? (scrolled / max) * 100 : 0;
    bar.style.width = pct + '%';
  };
  window.addEventListener('scroll', update, { passive: true });
  update();
}

/* ==========================================================================
   Side nav active state + click-to-scroll
   ========================================================================== */
function initSideNav(){
  const dots = $$('.side-dot');
  if (!dots.length) return;
  const sections = dots.map(d => document.querySelector(d.dataset.target)).filter(Boolean);

  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      const target = document.querySelector(dot.dataset.target);
      if (target) target.scrollIntoView({ behavior: 'smooth' });
    });
  });

  const setActive = () => {
    let currentIndex = 0;
    const scrollPos = window.scrollY + window.innerHeight / 2;
    sections.forEach((sec, i) => {
      if (sec.offsetTop <= scrollPos) currentIndex = i;
    });
    dots.forEach((d, i) => d.classList.toggle('active', i === currentIndex));
  };

  window.addEventListener('scroll', setActive, { passive: true });
  setActive();
}

/* ==========================================================================
   Heart ripple on click
   ========================================================================== */
function initHeartRipple(){
  document.addEventListener('click', (e) => {
    if (e.target.closest('button, a, input')) return; // avoid noisy overlap on controls
    spawnRippleHeart(e.clientX, e.clientY);
  });
}

function spawnRippleHeart(x, y){
  const el = document.createElement('div');
  el.className = 'ripple-heart';
  el.innerHTML = '&#10084;';
  el.style.left = x + 'px';
  el.style.top = y + 'px';
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 950);
}

/* ==========================================================================
   Scroll reveal (generic [data-reveal] elements outside timeline)
   ========================================================================== */
function initScrollReveal(){
  const items = $$('[data-reveal]').filter(el => !el.closest('#hero') && !el.closest('.timeline-item'));
  if (!items.length) return;

  if (window.gsap && window.ScrollTrigger){
    gsap.registerPlugin(ScrollTrigger);
    items.forEach(el => {
      gsap.fromTo(el,
        { opacity: 0, y: 34 },
        {
          opacity: 1, y: 0, duration: 0.9, ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 85%' }
        }
      );
    });
  } else {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting){
          entry.target.style.transition = 'opacity .8s ease, transform .8s ease';
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    items.forEach(el => { el.style.transform = 'translateY(34px)'; obs.observe(el); });
  }
}

/* ==========================================================================
   Timeline scroll reveal (alternating slide directions)
   ========================================================================== */
function initTimelineReveal(){
  const items = $$('.timeline-item');
  if (!items.length) return;

  if (window.gsap && window.ScrollTrigger){
    gsap.registerPlugin(ScrollTrigger);
    items.forEach(item => {
      const fromX = item.dataset.side === 'left' ? -60 : 60;
      const card = $('.timeline-card', item);
      const marker = $('.timeline-marker', item);
      gsap.fromTo(card, { opacity: 0, x: fromX }, {
        opacity: 1, x: 0, duration: 0.9, ease: 'power3.out',
        scrollTrigger: { trigger: item, start: 'top 80%' }
      });
      gsap.fromTo(marker, { opacity: 0, scale: 0.4 }, {
        opacity: 1, scale: 1, duration: 0.6, ease: 'back.out(2)',
        scrollTrigger: { trigger: item, start: 'top 80%' }
      });
    });
  } else {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting){
          entry.target.style.transition = 'opacity .8s ease, transform .8s ease';
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateX(0)';
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });
    items.forEach(item => {
      const card = $('.timeline-card', item);
      const fromX = item.dataset.side === 'left' ? -60 : 60;
      card.style.opacity = '0';
      card.style.transform = `translateX(${fromX}px)`;
      obs.observe(card);
    });
  }
}

/* ==========================================================================
   Gallery Carousel — autoplay, arrows, dots, swipe
   ========================================================================== */
function initCarousel(){
  const track = $('#carouselTrack');
  const slides = $$('.carousel-slide', track);
  const prevBtn = $('#prevBtn');
  const nextBtn = $('#nextBtn');
  const dotsWrap = $('#carouselDots');
  if (!track || !slides.length) return;

  let index = 0;
  let autoplayTimer = null;
  const AUTOPLAY_MS = 4500;

  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.setAttribute('aria-label', `Go to photo ${i + 1}`);
    if (i === 0) dot.classList.add('active');
    dot.addEventListener('click', () => goTo(i, true));
    dotsWrap.appendChild(dot);
  });
  const dots = $$('button', dotsWrap);

  function render(){
    track.style.transform = `translateX(-${index * 100}%)`;
    dots.forEach((d, i) => d.classList.toggle('active', i === index));
  }

  function goTo(i, userInitiated){
    index = (i + slides.length) % slides.length;
    render();
    if (userInitiated) restartAutoplay();
  }

  function next(userInitiated){ goTo(index + 1, userInitiated); }
  function prev(userInitiated){ goTo(index - 1, userInitiated); }

  function startAutoplay(){
    if (prefersReducedMotion) return;
    autoplayTimer = setInterval(() => next(false), AUTOPLAY_MS);
  }
  function restartAutoplay(){
    clearInterval(autoplayTimer);
    startAutoplay();
  }

  prevBtn.addEventListener('click', () => prev(true));
  nextBtn.addEventListener('click', () => next(true));

  // Touch / swipe support
  let startX = 0, deltaX = 0, dragging = false;
  const carousel = $('#carousel');

  carousel.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX; dragging = true;
    clearInterval(autoplayTimer);
  }, { passive: true });

  carousel.addEventListener('touchmove', (e) => {
    if (!dragging) return;
    deltaX = e.touches[0].clientX - startX;
  }, { passive: true });

  carousel.addEventListener('touchend', () => {
    if (!dragging) return;
    dragging = false;
    if (deltaX > 50) prev(true);
    else if (deltaX < -50) next(true);
    else restartAutoplay();
    deltaX = 0;
  });

  // Pause on hover (desktop)
  carousel.addEventListener('mouseenter', () => clearInterval(autoplayTimer));
  carousel.addEventListener('mouseleave', () => startAutoplay());

  render();
  startAutoplay();

  // expose for lightbox
  window.__carousel = { slides, goTo: (i) => goTo(i, true), get index(){ return index; } };
}

/* ==========================================================================
   Lightbox
   ========================================================================== */
function initLightbox(){
  const lightbox = $('#lightbox');
  const img = $('#lightboxImg');
  const closeBtn = $('#lightboxClose');
  const prevBtn = $('#lightboxPrev');
  const nextBtn = $('#lightboxNext');
  if (!lightbox) return;

  let current = 0;

  function open(i){
    const slides = window.__carousel ? window.__carousel.slides : $$('.carousel-slide');
    current = i;
    const slideImg = $('img', slides[current]);
    img.src = slideImg.src;
    img.alt = slideImg.alt;
    lightbox.hidden = false;
    document.body.style.overflow = 'hidden';
  }
  function close(){
    lightbox.hidden = true;
    document.body.style.overflow = '';
  }
  function show(delta){
    const slides = window.__carousel ? window.__carousel.slides : $$('.carousel-slide');
    current = (current + delta + slides.length) % slides.length;
    const slideImg = $('img', slides[current]);
    img.src = slideImg.src;
    img.alt = slideImg.alt;
    if (window.__carousel) window.__carousel.goTo(current);
  }

  $$('.carousel-slide').forEach((slide, i) => {
    slide.style.cursor = 'zoom-in';
    slide.addEventListener('click', () => open(i));
  });

  closeBtn.addEventListener('click', close);
  prevBtn.addEventListener('click', () => show(-1));
  nextBtn.addEventListener('click', () => show(1));
  lightbox.addEventListener('click', (e) => { if (e.target === lightbox) close(); });

  document.addEventListener('keydown', (e) => {
    if (lightbox.hidden) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') show(-1);
    if (e.key === 'ArrowRight') show(1);
  });
}

/* ==========================================================================
   Live Countdown to next anniversary
   ========================================================================== */
function initCountdown(){
  const dEl = $('#cdDays'), hEl = $('#cdHours'), mEl = $('#cdMinutes'), sEl = $('#cdSeconds');
  if (!dEl) return;

  const base = new Date(CONFIG.anniversaryDate + 'T00:00:00');
  if (isNaN(base)) return;

  function nextAnniversary(){
    const now = new Date();
    let target = new Date(now.getFullYear(), base.getMonth(), base.getDate(), 0, 0, 0);
    if (target <= now) target = new Date(now.getFullYear() + 1, base.getMonth(), base.getDate(), 0, 0, 0);
    return target;
  }

  let target = nextAnniversary();
  let prev = { d: null, h: null, m: null, s: null };

  function setNumber(el, value, prevValue){
    const str = String(value).padStart(2, '0');
    if (value === prevValue) return;
    if (window.gsap){
      gsap.fromTo(el, { y: -10, opacity: 0.4 }, { y: 0, opacity: 1, duration: 0.35, ease: 'power2.out' });
    }
    el.textContent = str;
  }

  function tick(){
    const now = new Date();
    let diff = target - now;
    if (diff <= 0){ target = nextAnniversary(); diff = target - now; }

    const d = Math.floor(diff / (1000 * 60 * 60 * 24));
    const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const m = Math.floor((diff / (1000 * 60)) % 60);
    const s = Math.floor((diff / 1000) % 60);

    setNumber(dEl, d, prev.d);
    setNumber(hEl, h, prev.h);
    setNumber(mEl, m, prev.m);
    setNumber(sEl, s, prev.s);

    prev = { d, h, m, s };
  }

  tick();
  setInterval(tick, 1000);
}

/* ==========================================================================
   Love Letter typing animation
   ========================================================================== */
function initTypewriterLetter(){
  const el = $('#letterBody');
  if (!el) return;
  const text = CONFIG.loveLetter;

  const cursor = document.createElement('span');
  cursor.className = 'type-cursor';

  let started = false;

  function typeIt(){
    if (started) return;
    started = true;
    let i = 0;
    el.textContent = '';
    el.appendChild(cursor);

    if (prefersReducedMotion){
      el.textContent = text;
      return;
    }

    const speed = 18; // ms per character
    function step(){
      if (i < text.length){
        cursor.insertAdjacentText('beforebegin', text[i]);
        i++;
        setTimeout(step, speed);
      } else {
        cursor.remove();
      }
    }
    step();
  }

  const target = document.getElementById('letter');
  if (!target) { typeIt(); return; }

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => { if (entry.isIntersecting) typeIt(); });
  }, { threshold: 0.35 });
  obs.observe(target);
}

/* ==========================================================================
   Music Player
   ========================================================================== */
function initMusicPlayer(){
  const player = $('#musicPlayer');
  const toggle = $('#musicToggle');
  const audio = $('#bgAudio');
  const volume = $('#volumeSlider');
  if (!player || !toggle || !audio) return;

  audio.volume = 0.6;
  let panelTimer = null;

  toggle.addEventListener('click', async () => {
    try{
      if (audio.paused){
        await audio.play();
        toggle.classList.add('playing');
        toggle.setAttribute('aria-pressed', 'true');
        toggle.setAttribute('aria-label', 'Pause our song');
      } else {
        audio.pause();
        toggle.classList.remove('playing');
        toggle.setAttribute('aria-pressed', 'false');
        toggle.setAttribute('aria-label', 'Play our song');
      }
    } catch(err){
      console.warn('Playback needs a user gesture or the audio file is missing:', err);
    }
    player.classList.add('open');
    clearTimeout(panelTimer);
    panelTimer = setTimeout(() => player.classList.remove('open'), 3500);
  });

  volume.addEventListener('input', () => {
    audio.volume = clamp(volume.value / 100, 0, 1);
    player.classList.add('open');
    clearTimeout(panelTimer);
    panelTimer = setTimeout(() => player.classList.remove('open'), 2000);
  });

  audio.addEventListener('ended', () => {
    // loop attribute already handles repeat; guard in case it's removed
    toggle.classList.remove('playing');
  });
}

/* ==========================================================================
   Celebration — confetti + fireworks + heart burst
   ========================================================================== */
function initCelebration(){
  const btn = $('#celebrateBtn');
  const canvas = $('#celebrationCanvas');
  if (!btn || !canvas) return;
  const ctx = canvas.getContext('2d');

  function resize(){
    canvas.width = window.innerWidth * devicePixelRatio;
    canvas.height = window.innerHeight * devicePixelRatio;
    canvas.style.width = window.innerWidth + 'px';
    canvas.style.height = window.innerHeight + 'px';
    ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
  }
  window.addEventListener('resize', resize);
  resize();

  const colors = ['#D4AF37', '#F6B6C9', '#F9D5E5', '#FFFFFF', '#E8CE7C'];
  let particles = [];
  let running = false;
  let rafId = null;
  let endTimer = null;

  function spawnConfetti(n){
    for (let i = 0; i < n; i++){
      particles.push({
        type: 'confetti',
        x: Math.random() * window.innerWidth,
        y: -20 - Math.random() * 200,
        vx: (Math.random() - 0.5) * 3,
        vy: 2 + Math.random() * 3.5,
        size: 6 + Math.random() * 6,
        color: colors[Math.floor(Math.random() * colors.length)],
        rot: Math.random() * 360,
        vrot: (Math.random() - 0.5) * 12,
        life: 0
      });
    }
  }

  function spawnFirework(x, y){
    const count = 44;
    const color = colors[Math.floor(Math.random() * colors.length)];
    for (let i = 0; i < count; i++){
      const angle = (Math.PI * 2 * i) / count;
      const speed = 2 + Math.random() * 3.2;
      particles.push({
        type: 'firework',
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 2.4,
        color,
        life: 0,
        maxLife: 60 + Math.random() * 20
      });
    }
  }

  function spawnHeartBurst(){
    const cx = window.innerWidth / 2, cy = window.innerHeight / 2;
    for (let i = 0; i < 18; i++){
      const angle = Math.random() * Math.PI * 2;
      const speed = 1.5 + Math.random() * 3;
      particles.push({
        type: 'heart',
        x: cx, y: cy,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 1.5,
        size: 14 + Math.random() * 16,
        color: colors[Math.floor(Math.random() * 2)],
        life: 0,
        maxLife: 90
      });
    }
  }

  function drawHeartShape(x, y, size, color, alpha){
    ctx.save();
    ctx.translate(x, y);
    ctx.globalAlpha = alpha;
    ctx.fillStyle = color;
    ctx.beginPath();
    const s = size / 16;
    for (let t = 0; t <= 6.3; t += 0.2){
      const hx = 16 * Math.pow(Math.sin(t), 3) * s;
      const hy = -(13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t)) * s;
      if (t === 0) ctx.moveTo(hx, hy); else ctx.lineTo(hx, hy);
    }
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  function loop(){
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

    particles.forEach(p => {
      p.life++;
      p.x += p.vx;
      p.y += p.vy;

      if (p.type === 'confetti'){
        p.vy += 0.02;
        p.rot += p.vrot;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rot * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = clamp(1 - p.life / 400, 0, 1);
        ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
        ctx.restore();
      } else if (p.type === 'firework'){
        p.vy += 0.03;
        const alpha = clamp(1 - p.life / p.maxLife, 0, 1);
        ctx.beginPath();
        ctx.fillStyle = p.color;
        ctx.globalAlpha = alpha;
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      } else if (p.type === 'heart'){
        p.vy += 0.025;
        const alpha = clamp(1 - p.life / p.maxLife, 0, 1);
        drawHeartShape(p.x, p.y, p.size, p.color, alpha);
      }
    });

    particles = particles.filter(p => {
      if (p.type === 'confetti') return p.y < window.innerHeight + 40 && p.life < 400;
      return p.life < (p.maxLife || 100);
    });

    if (particles.length > 0 || running){
      rafId = requestAnimationFrame(loop);
    } else {
      canvas.classList.remove('active');
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    }
  }

  btn.addEventListener('click', () => {
    canvas.classList.add('active');
    running = true;
    spawnConfetti(prefersReducedMotion ? 40 : 120);
    spawnHeartBurst();

    let fireworksLaunched = 0;
    const fireworkInterval = setInterval(() => {
      const x = window.innerWidth * (0.2 + Math.random() * 0.6);
      const y = window.innerHeight * (0.2 + Math.random() * 0.35);
      spawnFirework(x, y);
      fireworksLaunched++;
      if (fireworksLaunched >= (prefersReducedMotion ? 2 : 5)) clearInterval(fireworkInterval);
    }, 450);

    document.body.classList.add('celebrating');
    if (window.gsap){
      gsap.fromTo(btn, { scale: 1 }, { scale: 1.08, duration: 0.25, yoyo: true, repeat: 1, ease: 'power2.out' });
    }

    if (!rafId) loop();

    clearTimeout(endTimer);
    endTimer = setTimeout(() => {
      running = false;
      document.body.classList.remove('celebrating');
    }, 3200);
  });
}

/* ==========================================================================
   Romantic Quote Carousel
   ========================================================================== */
function initQuoteCarousel(){
  const textEl = $('#quoteText');
  const authorEl = $('#quoteAuthor');
  if (!textEl || !CONFIG.quotes.length) return;

  let index = 0;

  function render(){
    const q = CONFIG.quotes[index];
    textEl.classList.add('quote-fade');
    authorEl.classList.add('quote-fade');
    setTimeout(() => {
      textEl.textContent = `"${q.text}"`;
      authorEl.textContent = `— ${q.author}`;
      textEl.classList.remove('quote-fade');
      authorEl.classList.remove('quote-fade');
    }, 350);
    index = (index + 1) % CONFIG.quotes.length;
  }

  setInterval(render, 5000);
}

/* ==========================================================================
   Back to top
   ========================================================================== */
function initBackToTop(){
  const btn = $('#backToTop');
  if (!btn) return;
  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > window.innerHeight * 0.6);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ==========================================================================
   Smooth anchor scrolling (progressive enhancement over CSS scroll-behavior)
   ========================================================================== */
function initSmoothAnchors(){
  $$('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const id = link.getAttribute('href');
      if (id.length < 2) return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth' });
    });
  });
}

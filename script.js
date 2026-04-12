// ── Countdown ──
function updateCountdown() {
  const diff = new Date('2026-06-20T09:00:00') - new Date();
  if (diff <= 0) { ['days','hours','minutes','seconds'].forEach(id => document.getElementById(id).textContent = '00'); return; }
  document.getElementById('days').textContent    = String(Math.floor(diff/86400000)).padStart(2,'0');
  document.getElementById('hours').textContent   = String(Math.floor((diff%86400000)/3600000)).padStart(2,'0');
  document.getElementById('minutes').textContent = String(Math.floor((diff%3600000)/60000)).padStart(2,'0');
  document.getElementById('seconds').textContent = String(Math.floor((diff%60000)/1000)).padStart(2,'0');
}
updateCountdown(); setInterval(updateCountdown, 1000);

// ── FAQ ──
function toggleFaq(el) { el.classList.toggle('open'); }

// ── Section title animation ──
function animateSectionTitle(section) {
  const wrap = section.querySelector('.sec-title-wrap');
  if (!wrap || wrap.dataset.animated) return;
  wrap.dataset.animated = '1';
  const title = wrap.querySelector('.sec-title');
  const sub   = wrap.querySelector('.sec-sub');
  const text  = title.textContent.trim();
  title.textContent = '';
  title.style.opacity = '1';
  [...text].forEach((char, i) => {
    const sp = document.createElement('span');
    sp.className = 'stagger-letter';
    sp.textContent = char === ' ' ? '\u00A0' : char;
    sp.style.animation = `letterReveal 0.9s cubic-bezier(0.23,1,0.32,1) ${(i * 0.065).toFixed(3)}s forwards`;
    title.appendChild(sp);
  });
  if (sub) {
    const delay = (text.length * 0.065 + 0.25) * 1000;
    sub.style.letterSpacing = '7px'; sub.style.opacity = '0';
    setTimeout(() => {
      sub.style.transition = 'opacity 0.9s ease, letter-spacing 0.9s ease';
      sub.style.opacity = '1'; sub.style.letterSpacing = '3px';
    }, delay);
  }
}

// ── Scroll observers ──
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      entry.target.classList.remove('hidden');
      animateSectionTitle(entry.target);
    } else {
      entry.target.classList.remove('visible');
      entry.target.classList.add('hidden');
    }
  });
}, { threshold: 0.15 });
document.querySelectorAll('.fade-section').forEach(s => observer.observe(s));

const navObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      document.querySelectorAll('#side-nav a').forEach(d => d.classList.remove('active'));
      const dot = document.querySelector(`#side-nav a[data-sec="${entry.target.id}"]`);
      if (dot) dot.classList.add('active');
    }
  });
}, { threshold: 0.5 });
document.querySelectorAll('section[id]').forEach(s => navObserver.observe(s));

// ── Music Player ──
(function() {
  const audio     = document.getElementById('bg-audio');
  const player    = document.getElementById('music-player');
  const toggle    = document.getElementById('music-toggle');
  const vinyl     = document.getElementById('vinyl-disc');
  const label     = document.getElementById('music-label');
  const iconPlay  = document.getElementById('icon-play');
  const iconPause = document.getElementById('icon-pause');

  let isPlaying  = false;
  let isCollapsed = false;

  audio.volume = 0.55;

  function setPlaying(state) {
    if (state) {
      audio.play().then(() => {
        isPlaying = true;
        player.classList.add('playing');
        iconPlay.style.display  = 'none';
        iconPause.style.display = 'block';
        // Once successfully playing, remove global unlock listeners
        removeUnlockListeners();
      }).catch(err => {
        console.warn("Playback prevented, waiting for interaction.");
        isPlaying = false;
      });
    } else {
      audio.pause();
      isPlaying = false;
      player.classList.remove('playing');
      iconPlay.style.display  = 'block';
      iconPause.style.display = 'none';
    }
  }

  function unlock() {
    if (!isPlaying) setPlaying(true);
  }

  function removeUnlockListeners() {
    document.removeEventListener('click',      unlock);
    document.removeEventListener('touchstart', unlock);
    document.removeEventListener('keydown',    unlock);
    document.removeEventListener('mousedown',  unlock);
  }

  function addUnlockListeners() {
    document.addEventListener('click',      unlock);
    document.addEventListener('touchstart', unlock);
    document.addEventListener('keydown',    unlock);
    document.addEventListener('mousedown',  unlock);
  }

  toggle.addEventListener('click', (e) => {
    e.stopPropagation();
    setPlaying(!isPlaying);
  });

  vinyl.addEventListener('click', () => {
    isCollapsed = !isCollapsed;
    player.classList.toggle('collapsed', isCollapsed);
  });

  // 1. Try to play immediately on load
  audio.play().then(() => {
    isPlaying = true;
    player.classList.add('playing');
    iconPlay.style.display  = 'none';
    iconPause.style.display = 'block';
  }).catch(() => {
    // 2. If blocked, setup listeners for ANY user interaction
    addUnlockListeners();
  });
})();

// ── Falling Petals ──
(function(){
  const canvas = document.getElementById('petals-canvas');
  const colors = [
    '#ffffff', '#f0f0f0', '#d8d8d8', '#c0c0c0',
    '#a0a0a0', '#787878', '#505050', '#303030', '#1a1a1a'
  ];
  const count = 12;
  for(let i=0; i<count; i++){
    const el = document.createElement('div');
    el.className = 'petal';
    const size = (Math.random()*14+10)+'px';
    const x = (Math.random()*100)+'vw';
    const dur = (Math.random()*9+10)+'s';
    const delay = (Math.random()*20)+'s';
    const drift = ((Math.random()-0.5)*160)+'px';
    const spin = (Math.random()*540-270)+'deg';
    const color = colors[Math.floor(Math.random()*colors.length)];
    const colorInner = colors[Math.floor(Math.random()*colors.length)];
    const baseOpacity = color === '#ffffff' ? '0.70' : '0.88';
    el.style.cssText = `--x:${x};--size:${size};--dur:${dur};--delay:${delay};--drift:${drift};--spin:${spin};`;
    el.innerHTML = `<svg viewBox="0 0 30 38" xmlns="http://www.w3.org/2000/svg">
      <path d="M15 2 C22 2, 28 10, 28 18 C28 28, 22 36, 15 36 C8 36, 2 28, 2 18 C2 10, 8 2, 15 2 Z" fill="${color}" opacity="${baseOpacity}" stroke="${colorInner}" stroke-width="0.5"/>
      <path d="M15 4 C15 4, 15 18, 15 34" stroke="${colorInner}" stroke-width="0.8" fill="none" opacity="0.4"/>
    </svg>`;
    canvas.appendChild(el);
  }
})();

// ── 404 / broken resource reporter ──
(function () {
  const panel = document.createElement('div');
  panel.id = 'error-panel';
  panel.style.cssText = `
    position:fixed; bottom:28px; right:28px; z-index:99999;
    display:none; flex-direction:column; gap:6px;
    max-width:320px; max-height:260px; overflow-y:auto;
    font-family:'Montserrat',sans-serif;
  `;
  document.body.appendChild(panel);

  const errors = [];

  function addError(msg) {
    if (errors.includes(msg)) return;
    errors.push(msg);
    panel.style.display = 'flex';

    const item = document.createElement('div');
    item.style.cssText = `
      background:rgba(20,20,20,0.92); border:1px solid #555;
      border-left:3px solid #c0392b; backdrop-filter:blur(8px);
      padding:10px 14px; border-radius:2px;
      display:flex; align-items:flex-start; gap:10px;
    `;
    item.innerHTML = `
      <span style="color:#e74c3c;font-size:14px;flex-shrink:0;margin-top:1px;">⚠</span>
      <span style="color:#ccc;font-size:9px;font-weight:500;letter-spacing:1px;line-height:1.7;flex:1;">${msg}</span>
      <span onclick="this.parentElement.remove()" style="color:#666;font-size:14px;cursor:pointer;flex-shrink:0;line-height:1;">&times;</span>
    `;
    panel.appendChild(item);

    // Auto-dismiss after 8s
    setTimeout(() => {
      item.remove();
      if (!panel.children.length) panel.style.display = 'none';
    }, 8000);
  }

  // Intercept broken images & scripts
  window.addEventListener('error', function (e) {
    const t = e.target;
    if (t && (t.tagName === 'IMG' || t.tagName === 'SCRIPT' || t.tagName === 'LINK')) {
      const src = t.src || t.href || '(unknown)';
      const file = src.split('/').pop() || src;
      addError('404 NOT FOUND — ' + file);
    }
  }, true);

  // Intercept failed fetch / XHR
  const origFetch = window.fetch;
  window.fetch = function (...args) {
    return origFetch.apply(this, args).then(res => {
      if (res.status === 404) addError('404 NOT FOUND — ' + (args[0] || 'fetch request'));
      return res;
    });
  };
})();

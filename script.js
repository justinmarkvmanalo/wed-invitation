const WEDDING_DATE = new Date('2026-06-20T09:00:00');

function updateCountdown() {
  const diff = WEDDING_DATE - new Date();
  const parts = {
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  };

  if (diff > 0) {
    parts.days = Math.floor(diff / 86400000);
    parts.hours = Math.floor((diff % 86400000) / 3600000);
    parts.minutes = Math.floor((diff % 3600000) / 60000);
    parts.seconds = Math.floor((diff % 60000) / 1000);
  }

  Object.entries(parts).forEach(([id, value]) => {
    const element = document.getElementById(id);
    if (element) {
      element.textContent = String(value).padStart(2, '0');
    }
  });
}

function animateSectionTitle(section) {
  const wrap = section.querySelector('.sec-title-wrap');
  if (!wrap || wrap.dataset.animated) {
    return;
  }

  wrap.dataset.animated = 'true';

  const title = wrap.querySelector('.sec-title');
  const sub = wrap.querySelector('.sec-sub');
  if (!title) {
    return;
  }

  const text = title.textContent.trim();
  title.textContent = '';
  title.style.opacity = '1';

  [...text].forEach((char, index) => {
    const letter = document.createElement('span');
    letter.className = 'stagger-letter';
    letter.textContent = char === ' ' ? '\u00A0' : char;
    letter.style.animation = `letterReveal 0.9s cubic-bezier(0.23,1,0.32,1) ${(index * 0.065).toFixed(3)}s forwards`;
    title.appendChild(letter);
  });

  if (!sub) {
    return;
  }

  const delay = (text.length * 0.065 + 0.25) * 1000;
  sub.style.letterSpacing = '7px';
  sub.style.opacity = '0';

  window.setTimeout(() => {
    sub.style.transition = 'opacity 0.9s ease, letter-spacing 0.9s ease';
    sub.style.opacity = '1';
    sub.style.letterSpacing = '3px';
  }, delay);
}

function initSectionObservers() {
  const sections = document.querySelectorAll('.fade-section');
  const navSections = document.querySelectorAll('section[id]');
  const navDots = document.querySelectorAll('#side-nav a');

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      entry.target.classList.toggle('visible', entry.isIntersecting);
      entry.target.classList.toggle('hidden', !entry.isIntersecting);

      if (entry.isIntersecting) {
        animateSectionTitle(entry.target);
      }
    });
  }, { threshold: 0.15 });

  sections.forEach((section) => sectionObserver.observe(section));

  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        return;
      }

      navDots.forEach((dot) => dot.classList.remove('active'));

      const activeDot = document.querySelector(`#side-nav a[data-sec="${entry.target.id}"]`);
      if (activeDot) {
        activeDot.classList.add('active');
      }
    });
  }, { threshold: 0.5 });

  navSections.forEach((section) => navObserver.observe(section));
}

function initFaqs() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach((item) => {
    const button = item.querySelector('.faq-q');
    const answer = item.querySelector('.faq-a');

    if (!button || !answer) {
      return;
    }

    answer.setAttribute('aria-hidden', 'true');

    button.addEventListener('click', () => {
      const isOpen = item.classList.toggle('open');
      button.setAttribute('aria-expanded', String(isOpen));
      answer.setAttribute('aria-hidden', String(!isOpen));
    });
  });
}

function initMusicPlayer() {
  const audio = document.getElementById('bg-audio');
  const player = document.getElementById('music-player');
  const toggle = document.getElementById('music-toggle');
  const vinyl = document.getElementById('vinyl-disc');
  const playIcon = document.getElementById('icon-play');
  const pauseIcon = document.getElementById('icon-pause');

  if (!audio || !player || !toggle || !vinyl || !playIcon || !pauseIcon) {
    return;
  }

  let isPlaying = false;
  let isCollapsed = false;

  audio.volume = 0.55;

  function syncPlayerState(playing) {
    isPlaying = playing;
    player.classList.toggle('playing', playing);
    playIcon.hidden = playing;
    pauseIcon.hidden = !playing;
  }

  function removeUnlockListeners() {
    ['click', 'touchstart', 'keydown', 'mousedown'].forEach((eventName) => {
      document.removeEventListener(eventName, handleUnlock);
    });
  }

  function handlePlayRequest() {
    return audio.play()
      .then(() => {
        syncPlayerState(true);
        removeUnlockListeners();
      })
      .catch(() => {
        syncPlayerState(false);
      });
  }

  function handleUnlock() {
    if (!isPlaying) {
      handlePlayRequest();
    }
  }

  function setPlaying(playing) {
    if (playing) {
      handlePlayRequest();
      return;
    }

    audio.pause();
    syncPlayerState(false);
  }

  ['click', 'touchstart', 'keydown', 'mousedown'].forEach((eventName) => {
    document.addEventListener(eventName, handleUnlock);
  });

  toggle.addEventListener('click', (event) => {
    event.stopPropagation();
    setPlaying(!isPlaying);
  });

  vinyl.addEventListener('click', () => {
    isCollapsed = !isCollapsed;
    player.classList.toggle('collapsed', isCollapsed);
  });

  handlePlayRequest();
}

function initPetals() {
  const canvas = document.getElementById('petals-canvas');
  if (!canvas) {
    return;
  }

  const colors = [
    '#ffffff', '#f0f0f0', '#d8d8d8', '#c0c0c0',
    '#a0a0a0', '#787878', '#505050', '#303030', '#1a1a1a'
  ];

  for (let index = 0; index < 12; index += 1) {
    const petal = document.createElement('div');
    const size = `${Math.random() * 14 + 10}px`;
    const x = `${Math.random() * 100}vw`;
    const duration = `${Math.random() * 9 + 10}s`;
    const delay = `${Math.random() * 20}s`;
    const drift = `${(Math.random() - 0.5) * 160}px`;
    const spin = `${Math.random() * 540 - 270}deg`;
    const color = colors[Math.floor(Math.random() * colors.length)];
    const innerColor = colors[Math.floor(Math.random() * colors.length)];
    const opacity = color === '#ffffff' ? '0.70' : '0.88';

    petal.className = 'petal';
    petal.style.cssText = `--x:${x};--size:${size};--dur:${duration};--delay:${delay};--drift:${drift};--spin:${spin};`;
    petal.innerHTML = `<svg viewBox="0 0 30 38" xmlns="http://www.w3.org/2000/svg">
      <path d="M15 2 C22 2, 28 10, 28 18 C28 28, 22 36, 15 36 C8 36, 2 28, 2 18 C2 10, 8 2, 15 2 Z" fill="${color}" opacity="${opacity}" stroke="${innerColor}" stroke-width="0.5"></path>
      <path d="M15 4 C15 4, 15 18, 15 34" stroke="${innerColor}" stroke-width="0.8" fill="none" opacity="0.4"></path>
    </svg>`;

    canvas.appendChild(petal);
  }
}

function initBrokenResourceReporter() {
  const panel = document.createElement('div');
  const errors = new Set();

  panel.id = 'error-panel';
  panel.style.cssText = `
    position:fixed; bottom:28px; right:28px; z-index:99999;
    display:none; flex-direction:column; gap:6px;
    max-width:320px; max-height:260px; overflow-y:auto;
    font-family:'Montserrat',sans-serif;
  `;

  document.body.appendChild(panel);

  function addError(message) {
    if (errors.has(message)) {
      return;
    }

    errors.add(message);
    panel.style.display = 'flex';

    const item = document.createElement('div');
    item.style.cssText = `
      background:rgba(20,20,20,0.92); border:1px solid #555;
      border-left:3px solid #c0392b; backdrop-filter:blur(8px);
      padding:10px 14px; border-radius:2px;
      display:flex; align-items:flex-start; gap:10px;
    `;
    item.innerHTML = `
      <span style="color:#e74c3c;font-size:14px;flex-shrink:0;margin-top:1px;">[!]</span>
      <span style="color:#ccc;font-size:9px;font-weight:500;letter-spacing:1px;line-height:1.7;flex:1;">${message}</span>
      <button type="button" style="color:#666;font-size:14px;cursor:pointer;flex-shrink:0;line-height:1;background:none;border:0;">&times;</button>
    `;

    const dismissButton = item.querySelector('button');
    if (dismissButton) {
      dismissButton.addEventListener('click', () => {
        item.remove();
        if (!panel.children.length) {
          panel.style.display = 'none';
        }
      });
    }

    panel.appendChild(item);

    window.setTimeout(() => {
      if (item.isConnected) {
        item.remove();
      }

      if (!panel.children.length) {
        panel.style.display = 'none';
      }
    }, 8000);
  }

  window.addEventListener('error', (event) => {
    const target = event.target;
    if (target && (target.tagName === 'IMG' || target.tagName === 'SCRIPT' || target.tagName === 'LINK')) {
      const src = target.src || target.href || '(unknown)';
      const fileName = src.split('/').pop() || src;
      addError(`404 NOT FOUND - ${fileName}`);
    }
  }, true);

  const originalFetch = window.fetch;
  window.fetch = (...args) => originalFetch(...args).then((response) => {
    if (response.status === 404) {
      addError(`404 NOT FOUND - ${args[0] || 'fetch request'}`);
    }
    return response;
  });
}

document.addEventListener('DOMContentLoaded', () => {
  updateCountdown();
  window.setInterval(updateCountdown, 1000);

  initSectionObservers();
  initFaqs();
  initMusicPlayer();
  initPetals();
  initBrokenResourceReporter();
});

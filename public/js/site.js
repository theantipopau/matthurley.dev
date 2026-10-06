// matthurley.dev — interaction layer
// Re-runs on every page load (initial + view transition navigations).
// Everything here respects prefers-reduced-motion.

const prefersReducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function initPage() {
  // Each init is isolated: one failure (an unexpected DOM shape, a blocked
  // storage API) must never take down the rest — especially the nav and
  // theme toggles, which live in the same file.
  const inits = [
    initMobileNav,
    initThemeToggle,
    initReveal,
    initBackToTop,
    initHeaderScroll,
    initCountUps,
    initSpotlights,
    initTilt,
    initSplitHeadlines
  ];
  for (const init of inits) {
    try {
      init();
    } catch (error) {
      console.error(`[site] ${init.name} failed`, error);
    }
  }
}

/* ---------- Scroll reveal ---------- */

function initReveal() {
  const targets = document.querySelectorAll('.reveal');
  if (!targets.length) return;

  const showAll = () => targets.forEach((el) => el.classList.add('visible'));

  if (!('IntersectionObserver' in window) || prefersReducedMotion()) {
    showAll();
    return;
  }

  try {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      // threshold 0 is load-bearing: a ratio threshold (e.g. 0.1) can
      // never be satisfied by a section taller than 10x the viewport —
      // on a phone the flagship/projects sections are 8000-12000px tall,
      // so they would stay invisible forever while occupying the space.
      { threshold: 0, rootMargin: '0px 0px -40px 0px' }
    );

    targets.forEach((el) => observer.observe(el));

    // Safety net: if intersection callbacks never arrive (throttled or
    // embedded browsers), anything actually on screen still becomes
    // visible after a beat — a hidden hero leaves a huge blank gap
    // under the header. Below-fold sections keep their scroll reveal.
    window.setTimeout(() => {
      targets.forEach((el) => {
        if (el.classList.contains('visible')) return;
        const box = el.getBoundingClientRect();
        if (box.top < window.innerHeight && box.bottom > 0) {
          el.classList.add('visible');
        }
      });
    }, 1200);
  } catch (error) {
    // Never let the reveal animation hide the page.
    console.error('[site] reveal observer failed', error);
    showAll();
  }
}

/* ---------- Back to top ---------- */

function initBackToTop() {
  const backToTop = document.getElementById('back-to-top');
  if (!backToTop || backToTop.dataset.bound) return;
  backToTop.dataset.bound = 'true';
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
  });
}

/* ---------- Theme toggle ---------- */

function initThemeToggle() {
  const themeToggle = document.getElementById('theme-toggle');
  if (!themeToggle || themeToggle.dataset.bound) return;
  themeToggle.dataset.bound = 'true';

  themeToggle.addEventListener('click', () => {
    const root = document.documentElement;
    const nextTheme = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    try {
      localStorage.setItem('theme', nextTheme);
    } catch (error) {
      // Storage can be blocked (private mode, tracking policies) — the
      // theme must still switch for this session.
    }
    applyTheme(nextTheme);
  });
}

/* ---------- Mobile nav ---------- */

function initMobileNav() {
  const toggle = document.getElementById('nav-toggle');
  const nav = document.getElementById('primary-nav');
  if (!toggle || !nav) return;

  const setOpen = (open) => {
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    document.body.classList.toggle('nav-open', open);
    document.body.classList.toggle('nav-locked', open);
  };

  const isOpen = () => toggle.getAttribute('aria-expanded') === 'true';

  if (!toggle.dataset.bound) {
    toggle.dataset.bound = 'true';

    toggle.addEventListener('click', () => setOpen(!isOpen()));

    nav.addEventListener('click', (event) => {
      if (event.target.closest('a')) setOpen(false);
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && isOpen()) {
        setOpen(false);
        toggle.focus();
      }
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth > 980 && isOpen()) setOpen(false);
    });
  }

  // View transitions land on a fresh header — keep state consistent.
  setOpen(false);
}

/* ---------- Header hide on scroll ---------- */

function initHeaderScroll() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  let lastY = window.scrollY;
  let ticking = false;

  const update = () => {
    const y = window.scrollY;
    header.classList.toggle('is-scrolled', y > 8);

    const menuOpen = document.body.classList.contains('nav-open');
    const scrollingDown = y > lastY + 4;
    const scrollingUp = y < lastY - 4;

    if (!menuOpen && y > 260 && scrollingDown) header.classList.add('is-hidden');
    else if (scrollingUp || y < 120) header.classList.remove('is-hidden');

    lastY = y;
    ticking = false;
  };

  window.addEventListener(
    'scroll',
    () => {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(update);
      }
    },
    { passive: true }
  );

  update();
}

/* ---------- Count-up numbers ---------- */

function animateCount(el) {
  const target = Number(el.getAttribute('data-count-to'));
  if (!Number.isFinite(target)) return;

  const suffix = el.getAttribute('data-count-suffix') || '';
  const duration = 1400;

  if (prefersReducedMotion()) {
    el.textContent = `${target}${suffix}`;
    return;
  }

  const start = performance.now();
  const finish = () => {
    el.textContent = `${target}${suffix}`;
  };
  const step = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = `${Math.round(target * eased)}${suffix}`;
    if (progress < 1) window.requestAnimationFrame(step);
    else finish();
  };
  window.requestAnimationFrame(step);
  // Guarantee the final value even if rAF is starved (background tab,
  // uncomposited webview) — the number must never be left mid-animation.
  window.setTimeout(finish, duration + 300);
}

function initCountUps() {
  const counters = Array.from(document.querySelectorAll('[data-count-to]'));
  if (!counters.length) return;

  const pending = new Set(counters);
  const animate = (el) => {
    if (!pending.has(el)) return;
    pending.delete(el);
    animateCount(el);
  };

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animate(entry.target);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.4 }
    );
    counters.forEach((el) => observer.observe(el));
  }

  // Safety sweep: fast scrolls (or a throttled observer) can miss an element,
  // which would leave a wrong "0" on screen. Catch anything already reached.
  let lastSweep = 0;
  let interval = 0;
  const sweep = () => {
    lastSweep = Date.now();
    pending.forEach((el) => {
      const rect = el.getBoundingClientRect();
      if (rect.bottom <= 0 || rect.top < window.innerHeight * 0.92) animate(el);
    });
    if (!pending.size) {
      window.removeEventListener('scroll', onScroll);
      window.clearInterval(interval);
    }
  };
  const onScroll = () => {
    if (Date.now() - lastSweep > 250) sweep();
  };

  sweep();
  window.addEventListener('scroll', onScroll, { passive: true });
  interval = window.setInterval(sweep, 1200);
}

/* ---------- Cursor spotlight (sets --mx / --my) ---------- */

function initSpotlights() {
  if (prefersReducedMotion() || window.matchMedia('(hover: none)').matches) return;

  const selector =
    '.feature-card, .contact-card, .value-card, .topic-card, .service-card, ' +
    '.spotlight-project, .project-card, .repo-card, .hero-panel';

  document.querySelectorAll(selector).forEach((card) => {
    if (card.dataset.spotlight) return;
    card.dataset.spotlight = 'true';

    card.addEventListener('pointermove', (event) => {
      const rect = card.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 100;
      const y = ((event.clientY - rect.top) / rect.height) * 100;
      card.style.setProperty('--mx', `${x.toFixed(1)}%`);
      card.style.setProperty('--my', `${y.toFixed(1)}%`);
    });
  });
}

/* ---------- Subtle 3D tilt on [data-tilt] ---------- */

function initTilt() {
  if (prefersReducedMotion() || window.matchMedia('(hover: none)').matches) return;

  document.querySelectorAll('[data-tilt]').forEach((el) => {
    if (el.dataset.tiltBound) return;
    el.dataset.tiltBound = 'true';

    const max = 5;

    el.addEventListener('pointermove', (event) => {
      const rect = el.getBoundingClientRect();
      const px = (event.clientX - rect.left) / rect.width - 0.5;
      const py = (event.clientY - rect.top) / rect.height - 0.5;
      el.style.transform = `perspective(900px) rotateX(${(-py * max).toFixed(2)}deg) rotateY(${(px * max).toFixed(2)}deg) translateY(-4px)`;
    });

    el.addEventListener('pointerleave', () => {
      el.style.transform = '';
    });
  });
}

/* ---------- Split-text hero headline ---------- */

function initSplitHeadlines() {
  document.querySelectorAll('[data-split]').forEach((heading) => {
    if (heading.classList.contains('split-ready')) return;

    const nodes = Array.from(heading.childNodes);
    let wordIndex = 0;

    const wrapText = (text) => {
      const frag = document.createDocumentFragment();
      text.split(/(\s+)/).forEach((chunk) => {
        if (!chunk.trim()) {
          frag.appendChild(document.createTextNode(chunk));
          return;
        }
        const line = document.createElement('span');
        line.className = 'split-line';
        const inner = document.createElement('span');
        inner.style.setProperty('--i', String(wordIndex++));
        inner.textContent = chunk;
        line.appendChild(inner);
        frag.appendChild(line);
      });
      return frag;
    };

    const fragment = document.createDocumentFragment();
    nodes.forEach((node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        fragment.appendChild(wrapText(node.textContent || ''));
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        const clone = node.cloneNode(false);
        clone.appendChild(wrapText(node.textContent || ''));
        fragment.appendChild(clone);
      }
    });

    heading.replaceChildren(fragment);

    // Double rAF so the initial transform paints before we lift the reveal,
    // with a timer fallback in case rAF is throttled — the headline must
    // never stay hidden.
    let revealed = false;
    const reveal = () => {
      if (revealed) return;
      revealed = true;
      heading.classList.add('split-ready');
    };
    window.requestAnimationFrame(() => window.requestAnimationFrame(reveal));
    window.setTimeout(reveal, 400);
  });
}

/* ---------- Global scroll listeners (attached once) ---------- */

(function setupScrollListeners() {
  window.addEventListener(
    'scroll',
    () => {
      const scrollProgress = document.querySelector('.scroll-progress');
      if (scrollProgress) {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        scrollProgress.style.width = scrollPercent + '%';
      }

      const backToTop = document.getElementById('back-to-top');
      if (backToTop) backToTop.classList.toggle('visible', window.scrollY > 300);
    },
    { passive: true }
  );
})();

/* ---------- Theme ---------- */

const root = document.documentElement;
root.classList.add('js');

function applyTheme(theme) {
  root.setAttribute('data-theme', theme);
}

const storedTheme = localStorage.getItem('theme');
const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
applyTheme(storedTheme || (systemPrefersDark ? 'dark' : 'light'));

// Astro's view-transition swap clears every non-data-astro-* attribute from
// <html> (including data-theme). Stamping it onto the incoming document here
// stops the flash back to the unscoped (dark) default on every navigation.
document.addEventListener('astro:before-swap', (event) => {
  const currentTheme = root.getAttribute('data-theme');
  if (currentTheme) {
    event.newDocument.documentElement.setAttribute('data-theme', currentTheme);
  }
  // The swapped-in document never ran /js/early.js — keep reveal styles armed
  // and the JS-enabled marker in place across client-side navigations.
  event.newDocument.documentElement.classList.add('js');
});

document.addEventListener('keydown', (event) => {
  if (event.key.toLowerCase() !== 't' || event.metaKey || event.ctrlKey || event.altKey) return;
  const activeElement = document.activeElement;
  if (activeElement && (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA')) return;
  const nextTheme = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  localStorage.setItem('theme', nextTheme);
  applyTheme(nextTheme);
});

// Service worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {});
  });
}

// Run on initial page load and every view transition
document.addEventListener('astro:page-load', initPage);

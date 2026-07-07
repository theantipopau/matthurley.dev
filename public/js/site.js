// Re-runs on every page load (initial + view transition navigations)
function initPage() {
  // Reveal animations via IntersectionObserver
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  };
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);
  document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));

  // Back-to-top button
  const backToTop = document.getElementById('back-to-top');
  if (backToTop) {
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // Theme toggle button label sync
  const themeToggle = document.getElementById('theme-toggle');
  const root = document.documentElement;
  if (themeToggle) {
    themeToggle.textContent = root.getAttribute('data-theme') === 'dark' ? 'Light' : 'Dark';
    themeToggle.addEventListener('click', () => {
      const nextTheme = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      localStorage.setItem('theme', nextTheme);
      applyTheme(nextTheme);
    });
  }
}

// Global scroll listeners — attached once since window persists across transitions
(function setupScrollListeners() {
  const getScrollProgress = () => document.querySelector('.scroll-progress');
  const getBackToTop = () => document.getElementById('back-to-top');

  window.addEventListener('scroll', () => {
    const scrollProgress = getScrollProgress();
    if (scrollProgress) {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      scrollProgress.style.width = scrollPercent + '%';
    }

    const backToTop = getBackToTop();
    if (backToTop) {
      backToTop.classList.toggle('visible', window.scrollY > 300);
    }
  }, { passive: true });
})();

// Theme — applied before first paint and persisted across transitions
const root = document.documentElement;

function applyTheme(theme) {
  root.setAttribute('data-theme', theme);
  const themeToggle = document.getElementById('theme-toggle');
  if (themeToggle) {
    themeToggle.textContent = theme === 'dark' ? 'Light' : 'Dark';
  }
}

const storedTheme = localStorage.getItem('theme');
const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
applyTheme(storedTheme || (systemPrefersDark ? 'dark' : 'light'));

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


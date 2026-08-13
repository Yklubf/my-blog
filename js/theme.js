function getCurrentTheme() {
  return document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  const toggle = document.getElementById('theme-toggle');
  if (toggle) {
    toggle.setAttribute('aria-pressed', theme === 'dark' ? 'true' : 'false');
  }
}

function setTheme(theme) {
  localStorage.setItem('theme', theme);
  applyTheme(theme);
}

export function initThemeToggle() {
  applyTheme(getCurrentTheme());

  const toggle = document.getElementById('theme-toggle');
  if (toggle) {
    toggle.addEventListener('click', function () {
      setTheme(getCurrentTheme() === 'dark' ? 'light' : 'dark');
    });
  }

  var media = window.matchMedia('(prefers-color-scheme: dark)');
  media.addEventListener('change', function (event) {
    if (localStorage.getItem('theme') === null) {
      applyTheme(event.matches ? 'dark' : 'light');
    }
  });
}

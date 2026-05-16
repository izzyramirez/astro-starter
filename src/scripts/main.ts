// Global scripts — runs once on every page via BaseLayout.astro

function initSkipLink() {
  const skipLink = document.getElementById('skip-link');
  if (!skipLink) return;

  const handle = (e: MouseEvent | KeyboardEvent) => {
    if (e instanceof KeyboardEvent && e.key !== 'Enter') return;
    e.preventDefault();
    const main = document.querySelector<HTMLElement>('main');
    if (!main) return;
    main.setAttribute('tabindex', '-1');
    main.focus();
  };

  skipLink.addEventListener('click', handle);
  skipLink.addEventListener('keydown', handle);
}

function initCurrentYear() {
  document.querySelectorAll('[current-year]').forEach((el) => {
    el.textContent = String(new Date().getFullYear());
  });
}

initSkipLink();
initCurrentYear();

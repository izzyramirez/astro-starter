// Global scripts — runs once on every page via BaseLayout.astro
//
function initCurrentYear() {
   document.querySelectorAll("[current-year]").forEach((el) => {
      el.textContent = String(new Date().getFullYear());
   });
}

initCurrentYear();

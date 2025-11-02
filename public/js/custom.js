document.addEventListener("DOMContentLoaded", () => {
  document.body.setAttribute("data-theme", "light");
  try {
    window.localStorage.removeItem("cyber-frogy-theme");
  } catch (_) {
    /* localStorage may be unavailable; ignore */
  }
});

// scripts/injectPartials.js

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("[data-include]").forEach(async (el) => {
    const file = el.getAttribute("data-include");
    if (file) {
      try {
        const res = await fetch(file);
        const html = await res.text();
        el.innerHTML = html;
      } catch (err) {
        console.error(`Failed to load ${file}`, err);
        el.innerHTML = `<div style="color: red;">⚠️ Failed to load: ${file}</div>`;
      }
    }
  });
});

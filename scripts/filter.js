// scripts/filter.js

window.addEventListener('DOMContentLoaded', () => {
  const filterButtons = document.querySelectorAll('[data-filter]');

  function applyFilters() {
    const activeTags = Array.from(filterButtons)
      .filter(btn => btn.classList.contains('active'))
      .map(btn => btn.dataset.filter);

    const entries = document.querySelectorAll('.timeline-entry');
    entries.forEach(entry => {
      const tags = (entry.dataset.tags || '').split(',');
      const show = activeTags.length === 0 || activeTags.some(tag => tags.includes(tag));
      entry.style.display = show ? '' : 'none';
    });
  }

  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      button.classList.toggle('active');
      applyFilters();
    });
  });

  // Optional: Apply default filters on load
  applyFilters();
});

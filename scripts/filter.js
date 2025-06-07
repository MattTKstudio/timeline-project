// scripts/filter.js

window.addEventListener('DOMContentLoaded', () => {
  const filterBar = document.createElement('div');
  filterBar.id = 'filter-bar';
  filterBar.style = `
    position: absolute;
    top: 10px;
    left: 10px;
    background: rgba(0, 0, 0, 0.8);
    padding: 0.5rem 1rem;
    border-radius: 6px;
    color: white;
    font-size: 0.9rem;
    z-index: 5;
  `;

  filterBar.innerHTML = `
    <label><input type="checkbox" class="tag-filter" value="war" checked> War</label>
    <label><input type="checkbox" class="tag-filter" value="marian" checked> Marian</label>
    <label><input type="checkbox" class="tag-filter" value="saint" checked> Saint</label>
  `;

  document.body.appendChild(filterBar);

  function updateFilter() {
    const activeTags = Array.from(document.querySelectorAll('.tag-filter:checked')).map(cb => cb.value);
    document.querySelectorAll('.timeline-entry').forEach(entry => {
      const entryTags = (entry.dataset.tags || '').split(',');
      const matches = activeTags.some(tag => entryTags.includes(tag));
      entry.style.display = matches ? '' : 'none';
    });
  }

  document.querySelectorAll('.tag-filter').forEach(cb => {
    cb.addEventListener('change', updateFilter);
  });

  // Initial filter
  updateFilter();
});

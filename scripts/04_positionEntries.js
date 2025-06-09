// scripts/04_positionEntries.js

window.positionEntries = (() => {
  const entriesContainer = document.getElementById('entries-container');
  const { adjustYearForPosition } = window.datingUtils;
  const { getZoomState } = window.timelineZoom;

  function clearEntries() {
    entriesContainer.innerHTML = '';
  }

  function createEntryCard(entry) {
    const card = document.createElement('div');
    card.className = 'timeline-entry';
    card.dataset.slug = entry.slug;
    card.innerHTML = `
      <strong>${entry.title}</strong><br>
      <small>${window.datingUtils.toLabel(entry.year)}</small>
    `;
    return card;
  }

  function positionEntries(entryList) {
    clearEntries();

    const { zoom, offsetX } = getZoomState();

    entryList.forEach(entry => {
      const x = adjustYearForPosition(entry.year, zoom, offsetX);
      if (x === null) return;

      const card = createEntryCard(entry);
      card.style.left = `${x}px`;
      card.style.bottom = '0px';
      card.style.position = 'absolute';

      entriesContainer.appendChild(card);
    });
  }

  return {
    positionEntries
  };
})();

// scripts/positionEntries.js

window.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('timeline-section');
  const entryContainer = document.getElementById('timeline-entries');

  let zoom = 2.0;
  let offsetX = 0;
  const baseYear = -3000;

  function yearToX(year) {
    return (year + 3000) * zoom + offsetX;
  }

  function updateEntryPositions() {
    document.querySelectorAll('.timeline-entry').forEach(entry => {
      const start = parseInt(entry.dataset.startyear);
      const end = parseInt(entry.dataset.endyear);
      const mid = (start + end) / 2;
      const x = yearToX(mid);
      entry.style.left = `${x}px`;
    });
  }

  function updateZoomAndOffset(newZoom, newOffsetX) {
    zoom = newZoom;
    offsetX = newOffsetX;
    updateEntryPositions();
  }

  window.updateEntryPositions = updateEntryPositions;
  window.updateZoomAndOffset = updateZoomAndOffset;
});

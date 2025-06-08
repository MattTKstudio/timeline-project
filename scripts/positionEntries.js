// scripts/positionEntries.js

window.addEventListener('DOMContentLoaded', () => {
  const entriesContainer = document.getElementById('timeline-entries');

  window.updateEntryPositions = function () {
    const { zoom, offsetX } = window.timelineZoom.getZoomState();
    const offset = window.datingUtils.TIMELINE_OFFSET;

    document.querySelectorAll('.timeline-entry').forEach(entry => {
      const startYear = parseInt(entry.dataset.startYear);
      const visualYear = window.datingUtils.toVisualYear(startYear);
      if (visualYear === null) return;

      const x = (visualYear + offset) * zoom + offsetX;
      entry.style.left = `${x}px`;
    });
  };
});

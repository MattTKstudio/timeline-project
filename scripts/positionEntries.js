// scripts/positionEntries.js

window.updateEntryPositions = function () {
  const container = document.getElementById('timeline-entries');
  const entries = document.querySelectorAll('.timeline-entry');
  const { zoom, offsetX } = window.timelineZoom.getZoomState();
  const adjust = window.datingUtils.adjustYearForPosition;

  entries.forEach(entry => {
    const start = parseInt(entry.dataset.start);
    const end = parseInt(entry.dataset.end);
    if (!start || !end) return;

    const startX = adjust(start) * zoom + offsetX;
    const endX = adjust(end) * zoom + offsetX;
    const midX = (startX + endX) / 2;

    entry.style.left = `${midX}px`;
  });
};

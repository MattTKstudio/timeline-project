// scripts/zoomHandler.js

let zoom = 2.0;
let offsetX = 0;

function setZoomOffset(newZoom, newOffsetX) {
  zoom = newZoom;
  offsetX = newOffsetX;
  if (typeof window.drawTicks === 'function') window.drawTicks();
  if (typeof window.updateEntryPositions === 'function') window.updateEntryPositions();
  updateZoomUI();
}

function getZoomState() {
  return { zoom, offsetX };
}

function updateZoomUI() {
  let level = 'century';
  if (zoom > 4) level = 'decade';
  if (zoom > 10) level = 'year';
  document.body.setAttribute('data-zoom', level);

  document.querySelectorAll('.timeline-entry').forEach(el => {
    const threshold = el.dataset.visible;
    if (
      threshold === level ||
      (threshold === 'century' && level !== 'year') ||
      (threshold === 'decade' && level === 'decade') ||
      (threshold === 'year' && level === 'year')
    ) {
      el.classList.add('visible');
    } else {
      el.classList.remove('visible');
    }
  });
}

window.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('timeline-section');

  // Center the timeline on year 0 on load
  const centerX = container.clientWidth / 2;
  const initialZoom = zoom;
  offsetX = centerX - (0 + 3000) * initialZoom;
  setZoomOffset(initialZoom, offsetX);

  container.addEventListener('wheel', e => {
    if (e.ctrlKey || e.metaKey) return;
    e.preventDefault();

    const zoomSpeed = 0.0015;
    const delta = -e.deltaY;
    const prevZoom = zoom;
    zoom = Math.max(0.2, Math.min(20, zoom * (1 + delta * zoomSpeed)));

    const rect = container.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const yearUnderCursor = (mouseX - offsetX) / prevZoom - 3000;
    offsetX = mouseX - (yearUnderCursor + 3000) * zoom;

    if (typeof window.drawTicks === 'function') window.drawTicks();
    if (typeof window.updateEntryPositions === 'function') window.updateEntryPositions();
    updateZoomUI();
  });
});

// Expose state management
window.timelineZoom = {
  zoom,
  offsetX,
  setZoomOffset,
  getZoomState,
  updateZoomUI
};
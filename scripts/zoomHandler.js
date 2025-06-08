// scripts/zoomHandler.js

(function () {
  const OFFSET = 5000;
  const MIN_ZOOM = 0.2;
  const MAX_ZOOM = 20;
  const ZOOM_SPEED = 0.0015;

  let zoom = 2.0;
  let offsetX = 0;

  function setZoomOffset(newZoom, newOffsetX) {
    zoom = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, newZoom));
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

    const centerX = container.clientWidth / 2;
    const visualYearZero = window.datingUtils.adjustYearForPosition(1, OFFSET); // adjusted year 1 AD
    offsetX = centerX - visualYearZero * zoom;
    setZoomOffset(zoom, offsetX);

    container.addEventListener('wheel', e => {
      if (e.ctrlKey || e.metaKey) return;
      e.preventDefault();

      const delta = -e.deltaY;
      const prevZoom = zoom;
      zoom = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, zoom * (1 + delta * ZOOM_SPEED)));

      const rect = container.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const yearUnderCursor = (mouseX - offsetX) / prevZoom - OFFSET;
      offsetX = mouseX - (yearUnderCursor + OFFSET) * zoom;

      setZoomOffset(zoom, offsetX);
    });
  });

  window.timelineZoom = {
    get zoom() { return zoom; },
    get offsetX() { return offsetX; },
    setZoomOffset,
    getZoomState,
    updateZoomUI
  };
})();

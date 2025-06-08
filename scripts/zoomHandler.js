// scripts/zoomHandler.js

window.addEventListener('DOMContentLoaded', () => {
  const section = document.getElementById('timeline-section');
  const track = document.getElementById('timeline-track');

  let zoom = 1.5;
  let offsetX = 0;
  const zoomMin = 0.5;
  const zoomMax = 20;
  const zoomSpeed = 0.0015;

  function applyZoom() {
    if (typeof window.drawTicks === 'function') window.drawTicks();
    if (typeof window.updateEntryPositions === 'function') window.updateEntryPositions();
    document.body.setAttribute('data-zoom', zoom.toFixed(2));
  }

  function zoomAt(clientX, deltaY) {
    const rect = section.getBoundingClientRect();
    const mouseX = clientX - rect.left;
    const prevZoom = zoom;
    zoom = Math.max(zoomMin, Math.min(zoomMax, zoom * (1 + deltaY * zoomSpeed)));
    const visualYear = (mouseX - offsetX) / prevZoom;
    offsetX = mouseX - visualYear * zoom;
    applyZoom();
  }

  section.addEventListener('wheel', (e) => {
    if (e.ctrlKey || e.metaKey) return;
    e.preventDefault();
    zoomAt(e.clientX, -e.deltaY);
  });

  // Touch gestures for pinch zoom
  let lastDist = null;
  section.addEventListener('touchmove', (e) => {
    if (e.touches.length === 2) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (lastDist !== null) {
        const delta = dist - lastDist;
        zoomAt((e.touches[0].clientX + e.touches[1].clientX) / 2, -delta);
      }
      lastDist = dist;
    }
  });
  section.addEventListener('touchend', () => (lastDist = null));

  window.timelineZoom = {
    get zoom() {
      return zoom;
    },
    get offsetX() {
      return offsetX;
    },
    setZoomOffset(z, x) {
      zoom = z;
      offsetX = x;
      applyZoom();
    },
  };

  // Initial setup
  offsetX = section.clientWidth / 2 - window.datingUtils.adjustYearForPosition(1) * zoom;
  applyZoom();
});

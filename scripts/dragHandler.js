// scripts/dragHandler.js

window.addEventListener('DOMContentLoaded', () => {
  const section = document.getElementById('timeline-section');
  let isDragging = false;
  let lastX = 0;

  section.addEventListener('mousedown', e => {
    isDragging = true;
    lastX = e.clientX;
  });

  section.addEventListener('mouseup', () => {
    isDragging = false;
  });

  section.addEventListener('mouseleave', () => {
    isDragging = false;
  });

  section.addEventListener('mousemove', e => {
    if (!isDragging) return;
    const dx = e.clientX - lastX;
    lastX = e.clientX;

    if (window.timelineZoom && typeof window.timelineZoom.setZoomOffset === 'function') {
      const { zoom, offsetX } = window.timelineZoom.getZoomState();
      window.timelineZoom.setZoomOffset(zoom, offsetX + dx);
    }
  });
});

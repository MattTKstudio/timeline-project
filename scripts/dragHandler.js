// scripts/dragHandler.js

window.addEventListener('DOMContentLoaded', () => {
  const section = document.getElementById('timeline-section');

  let isDragging = false;
  let lastX = 0;

  section.addEventListener('mousedown', e => {
    isDragging = true;
    lastX = e.clientX;
  });

  section.addEventListener('mousemove', e => {
    if (!isDragging) return;
    const dx = e.clientX - lastX;
    lastX = e.clientX;

    const zoom = window.timelineZoom.zoom;
    const newOffsetX = window.timelineZoom.offsetX + dx;
    window.timelineZoom.setZoomOffset(zoom, newOffsetX);
  });

  section.addEventListener('mouseup', () => {
    isDragging = false;
  });

  section.addEventListener('mouseleave', () => {
    isDragging = false;
  });

  // Optional: handle touch for mobile
  section.addEventListener('touchstart', e => {
    if (e.touches.length === 1) {
      isDragging = true;
      lastX = e.touches[0].clientX;
    }
  });

  section.addEventListener('touchmove', e => {
    if (!isDragging || e.touches.length !== 1) return;
    const dx = e.touches[0].clientX - lastX;
    lastX = e.touches[0].clientX;

    const zoom = window.timelineZoom.zoom;
    const newOffsetX = window.timelineZoom.offsetX + dx;
    window.timelineZoom.setZoomOffset(zoom, newOffsetX);
  });

  section.addEventListener('touchend', () => {
    isDragging = false;
  });
});

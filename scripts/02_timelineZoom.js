// scripts/02_timelineZoom.js

window.timelineZoom = (() => {
  let zoom = 1;               // Current zoom level
  let offsetX = -8500;        // Current horizontal offset
  const minZoom = 0.1;
  const maxZoom = 80;

  const listeners = [];

  function notify() {
    listeners.forEach(fn => fn({ zoom, offsetX }));
  }

  function setZoom(newZoom, centerX = window.innerWidth / 2) {
    const clampedZoom = Math.max(minZoom, Math.min(maxZoom, newZoom));
    const zoomFactor = clampedZoom / zoom;

    // Adjust offset so zoom centers on pointer
    offsetX = (offsetX - centerX) * zoomFactor + centerX;
    zoom = clampedZoom;

    notify();
  }

  function setOffsetX(newOffsetX) {
    offsetX = newOffsetX;
    notify();
  }

  function addZoomListener(fn) {
    listeners.push(fn);
  }

  function getZoomState() {
    return { zoom, offsetX };
  }

  function setupZoomHandlers(canvas) {
    let isDragging = false;
    let lastX = 0;

    // Mouse drag
    canvas.addEventListener('mousedown', e => {
      isDragging = true;
      lastX = e.clientX;
    });

    window.addEventListener('mouseup', () => isDragging = false);
    window.addEventListener('mouseleave', () => isDragging = false);

    window.addEventListener('mousemove', e => {
      if (!isDragging) return;
      const dx = e.clientX - lastX;
      lastX = e.clientX;
      setOffsetX(offsetX + dx);
    });

    // Mouse wheel zoom
    canvas.addEventListener('wheel', e => {
      e.preventDefault(); // Block native scroll
      const zoomDelta = -e.deltaY * 0.001;
      setZoom(zoom * (1 + zoomDelta), e.clientX);
    }, { passive: false });

    // Pinch-to-zoom on touch
    let lastTouchDistance = null;

    canvas.addEventListener('touchmove', e => {
      if (e.touches.length === 2) {
        e.preventDefault();

        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (lastTouchDistance !== null) {
          const scale = distance / lastTouchDistance;
          const centerX = (e.touches[0].clientX + e.touches[1].clientX) / 2;
          setZoom(zoom * scale, centerX);
        }

        lastTouchDistance = distance;
      }
    }, { passive: false });

    canvas.addEventListener('touchend', () => {
      lastTouchDistance = null;
    });
  }

  return {
    getZoomState,
    setZoom,
    setOffsetX,
    addZoomListener,
    setupZoomHandlers
  };
})();

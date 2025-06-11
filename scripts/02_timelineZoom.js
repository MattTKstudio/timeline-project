// scripts/02_timelineZoom.js

window.timelineZoom = (() => {
  let zoom = 1;
  let offsetX = null; // Defer offset until datingUtils is ready
  const minZoom = 0.05;
  const maxZoom = 100;

  const listeners = [];

  function notify() {
    listeners.forEach(fn => fn({ zoom, offsetX }));
  }

  function setZoom(newZoom, centerX = window.innerWidth / 2) {
    const clampedZoom = Math.max(minZoom, Math.min(maxZoom, newZoom));
    const zoomFactor = clampedZoom / zoom;
    offsetX = (offsetX - centerX) * zoomFactor + centerX;
    zoom = clampedZoom;
    notify();
  }

  function setOffsetX(newOffsetX) {
    offsetX = newOffsetX;
    notify();
  }

  function getZoomState() {
    return { zoom, offsetX };
  }

  function addZoomListener(fn) {
    if (typeof fn === 'function') listeners.push(fn);
  }

  function setupZoomHandlers(target) {
    // Initialize offsetX on first run
    if (offsetX === null && window.datingUtils?.toVisualYear) {
      const ad1X = window.datingUtils.toVisualYear(1) * zoom;
      offsetX = -ad1X + window.innerWidth / 2;
      notify();
    }

    let isDragging = false;
    let lastX = 0;

    // Mouse drag
    target.addEventListener('mousedown', e => {
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

    // Scroll to zoom
    target.addEventListener('wheel', e => {
      e.preventDefault();
      const delta = -e.deltaY * 0.001;
      setZoom(zoom * (1 + delta), e.clientX);
    }, { passive: false });

    // Touch controls
    let lastTouchDistance = null;
    let lastTouchX = null;

    target.addEventListener('touchstart', e => {
      if (e.touches.length === 1) {
        lastTouchX = e.touches[0].clientX;
      }
    });

    target.addEventListener('touchmove', e => {
      if (e.touches.length === 1 && lastTouchX !== null) {
        const dx = e.touches[0].clientX - lastTouchX;
        lastTouchX = e.touches[0].clientX;
        setOffsetX(offsetX + dx);
      } else if (e.touches.length === 2) {
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

    target.addEventListener('touchend', () => {
      lastTouchDistance = null;
      lastTouchX = null;
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

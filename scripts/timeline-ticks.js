// scripts/timeline-ticks.js

window.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('timeline-canvas');
  const ctx = canvas.getContext('2d');
  const section = document.getElementById('timeline-section');
  const labelContainer = document.getElementById('year-labels');
  const banner = document.getElementById('banner');

  const { toLabel, adjustYearForPosition, isCentury, isDecade } = window.datingUtils;
  const { getZoomState } = window.timelineZoom;

  function resizeCanvas() {
    canvas.width = section.clientWidth;
    canvas.height = section.clientHeight;
  }

  function drawTicks() {
    const { zoom, offsetX } = getZoomState();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    labelContainer.innerHTML = '';

    const startYear = -5000;
    const endYear = new Date().getFullYear();
    const spacing = 1; // 1 year increment base

    for (let year = startYear; year <= endYear; year += spacing) {
      const x = adjustYearForPosition(year) * zoom + offsetX;
      if (x < -100 || x > canvas.width + 100) continue;

      ctx.beginPath();
      if (isCentury(year)) {
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.moveTo(x, 20);
        ctx.lineTo(x, 80);
        ctx.stroke();
      } else if (isDecade(year)) {
        ctx.strokeStyle = '#888';
        ctx.lineWidth = 1.5;
        ctx.moveTo(x, 30);
        ctx.lineTo(x, 70);
        ctx.stroke();
      } else if (zoom > 10) {
        ctx.strokeStyle = '#555';
        ctx.lineWidth = 1;
        ctx.moveTo(x, 40);
        ctx.lineTo(x, 60);
        ctx.stroke();
      }

      if (isCentury(year) || (zoom > 5 && isDecade(year))) {
        const label = document.createElement('div');
        label.className = 'year-label';
        label.style.left = `${x}px`;
        label.innerText = toLabel(year);
        labelContainer.appendChild(label);
      }
    }

    // Align banner art to the timeline scale and offset
    const bannerWidth = adjustYearForPosition(endYear) * zoom;
    banner.style.width = `${bannerWidth}px`;
    banner.style.left = `${offsetX}px`;
  }

  function setupDragToScroll() {
    let isDragging = false;
    let lastX = 0;

    section.addEventListener('mousedown', e => {
      isDragging = true;
      lastX = e.clientX;
    });
    section.addEventListener('mouseup', () => isDragging = false);
    section.addEventListener('mouseleave', () => isDragging = false);
    section.addEventListener('mousemove', e => {
      if (!isDragging) return;
      const dx = e.clientX - lastX;
      lastX = e.clientX;
      const { zoom, offsetX } = getZoomState();
      window.timelineZoom.setZoomOffset(zoom, offsetX + dx);
    });
  }

  resizeCanvas();
  setupDragToScroll();
  window.drawTicks = drawTicks;
  drawTicks();
});

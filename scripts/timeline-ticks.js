// scripts/timeline-ticks.js

window.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('timeline-canvas');
  const ctx = canvas.getContext('2d');
  const section = document.getElementById('timeline-section');
  const labelContainer = document.getElementById('year-labels');
  const banner = document.getElementById('banner');

  let zoom = 2.0;
  let offsetX = 0;
  const startYear = -3000;
  const endYear = 2025;

  function yearToX(year) {
    return (year + 3000) * zoom + offsetX;
  }

  function resizeCanvas() {
    canvas.width = section.clientWidth;
    canvas.height = section.clientHeight;
  }

  function drawTicks() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    labelContainer.innerHTML = '';

    for (let year = startYear; year <= endYear; year++) {
      const x = yearToX(year);
      if (x < -100 || x > canvas.width + 100) continue;

      ctx.beginPath();
      if (year % 100 === 0) {
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.moveTo(x, 20);
        ctx.lineTo(x, 80);
        ctx.stroke();
      } else if (year % 10 === 0) {
        ctx.strokeStyle = '#888';
        ctx.lineWidth = 1.5;
        ctx.moveTo(x, 30);
        ctx.lineTo(x, 70);
        ctx.stroke();
      } else {
        ctx.strokeStyle = '#555';
        ctx.lineWidth = 1;
        ctx.moveTo(x, 40);
        ctx.lineTo(x, 60);
        ctx.stroke();
      }

      if (year % 100 === 0 || (zoom > 5 && year % 10 === 0)) {
        const label = document.createElement('div');
        label.className = 'year-label';
        label.style.left = `${x}px`;
        label.innerText = `${Math.abs(year)} ${year < 0 ? 'BC' : 'AD'}`;
        labelContainer.appendChild(label);
      }
    }

    banner.style.width = `${(endYear - startYear) * zoom}px`;
    banner.style.left = `${offsetX}px`;
  }

  function zoomAt(mouseX, delta) {
    const zoomSpeed = 0.0015;
    const prevZoom = zoom;
    zoom = Math.max(0.2, Math.min(20, zoom * (1 + delta * zoomSpeed)));
    const yearUnderCursor = (mouseX - offsetX) / prevZoom - 3000;
    offsetX = mouseX - (yearUnderCursor + 3000) * zoom;
  }

  function setupEvents() {
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
      offsetX += dx;
      lastX = e.clientX;
      drawTicks();
    });

    section.addEventListener('wheel', e => {
      if (e.ctrlKey || e.metaKey) return;
      e.preventDefault();
      zoomAt(e.clientX, -e.deltaY);
      drawTicks();
    });

    window.addEventListener('resize', () => {
      resizeCanvas();
      drawTicks();
    });
  }

  resizeCanvas();

  // ✅ Center the timeline on year 0 after resizing
  offsetX = section.clientWidth / 2 - (0 + 3000) * zoom;

  setupEvents();
  drawTicks();
});

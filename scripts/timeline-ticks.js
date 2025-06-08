// scripts/timeline-ticks.js

window.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('timeline-canvas');
  const ctx = canvas.getContext('2d');
  const section = document.getElementById('timeline-section');
  const labelContainer = document.getElementById('year-labels');
  const banner = document.getElementById('banner');

  const startYear = -5000;
  const endYear = new Date().getFullYear();

  function yearToX(year) {
    const { zoom, offsetX } = window.timelineZoom.getZoomState();
    const visualYear = window.datingUtils.adjustYearForPosition(year);
    return visualYear * zoom + offsetX;
  }

  function resizeCanvas() {
    canvas.width = section.clientWidth;
    canvas.height = section.clientHeight;
  }

  function drawTicks() {
    const { zoom, offsetX } = window.timelineZoom.getZoomState();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    labelContainer.innerHTML = '';

    for (let year = startYear; year <= endYear; year++) {
      if (year === 0) continue; // Skip year 0
      const x = yearToX(year);
      if (x < -100 || x > canvas.width + 100) continue;

      ctx.beginPath();
      if (window.datingUtils.isCentury(year)) {
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.moveTo(x, 20);
        ctx.lineTo(x, 80);
      } else if (window.datingUtils.isDecade(year)) {
        ctx.strokeStyle = '#888';
        ctx.lineWidth = 1.5;
        ctx.moveTo(x, 30);
        ctx.lineTo(x, 70);
      } else {
        ctx.strokeStyle = '#555';
        ctx.lineWidth = 1;
        ctx.moveTo(x, 40);
        ctx.lineTo(x, 60);
      }
      ctx.stroke();

      if (window.datingUtils.isCentury(year) || (zoom > 5 && window.datingUtils.isDecade(year))) {
        const label = document.createElement('div');
        label.className = 'year-label';
        label.style.left = `${x}px`;
        label.innerText = window.datingUtils.toLabel(year);
        labelContainer.appendChild(label);
      }
    }

    banner.style.width = `${window.datingUtils.adjustYearForPosition(endYear) * zoom}px`;
    banner.style.left = `${offsetX}px`;
  }

  window.drawTicks = drawTicks;

  resizeCanvas();
  drawTicks();
  window.addEventListener('resize', () => {
    resizeCanvas();
    drawTicks();
  });
});

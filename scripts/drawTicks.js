// scripts/drawTicks.js

window.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('timeline-canvas');
  const ctx = canvas.getContext('2d');
  const labelContainer = document.getElementById('year-labels');
  const banner = document.getElementById('banner');

  let zoom = 2.0;
  let offsetX = 0;
  const startYear = -3000;
  const endYear = 2025;

  function yearToX(year) {
    return (year + 3000) * zoom + offsetX;
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

  // Expose the tick drawer to the window for global access
  window.drawTicks = drawTicks;
  window.setTimelineZoomOffset = (z, o) => {
    zoom = z;
    offsetX = o;
    drawTicks();
  };
});

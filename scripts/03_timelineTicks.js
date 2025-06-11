// scripts/03_timelineTicks.js

window.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('timeline-canvas');
  const ctx = canvas.getContext('2d');
  const section = document.getElementById('timeline-section');
  const labelContainer = document.getElementById('year-labels');
  const banner = document.getElementById('banner');

  const {
    START_YEAR,
    END_YEAR,
    OFFSET,
    toLabel,
    toVisualYear,
    AD1,
    isMegaannum,
    isKiloyear,
    isMillennium,
    isCentury,
    isDecade,
    isYear
  } = window.datingUtils;

  const { getZoomState, addZoomListener, setupZoomHandlers } = window.timelineZoom;

  function resizeCanvas() {
    canvas.width = section.clientWidth;
    canvas.height = section.clientHeight;
  }

  function drawTicks() {
    const { zoom, offsetX } = getZoomState();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    labelContainer.innerHTML = '';

    for (let year = START_YEAR; year <= END_YEAR; year++) {
      const visualYear = toVisualYear(year);
      if (visualYear === null) continue;

      const x = visualYear * zoom + offsetX;
      if (x < -100 || x > canvas.width + 100) continue;

      let tickHeight = 0;
      let lineWidth = 1;
      const color = '#000';

      if (AD1(year)) {
        tickHeight = canvas.height;
        lineWidth = 4;
      } else if (zoom >= 0.01 && isMegaannum(year)) {
        tickHeight = 100;
        lineWidth = 4;
      } else if (zoom >= 0.03 && isKiloyear(year)) {
        tickHeight = 80;
        lineWidth = 3;
      } else if (zoom >= 0.1 && isMillennium(year)) {
        tickHeight = 70;
        lineWidth = 2.5;
      } else if (zoom >= 0.5 && isCentury(year)) {
        tickHeight = 60;
        lineWidth = 2;
      } else if (zoom >= 1 && isDecade(year)) {
        tickHeight = 50;
        lineWidth = 1.5;
      } else if (zoom >= 2 && isYear(year)) {
        tickHeight = 40;
        lineWidth = 1;
      }

      if (tickHeight > 0) {
        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.lineWidth = lineWidth;
        ctx.moveTo(x, 0);
        ctx.lineTo(x, tickHeight);
        ctx.stroke();
      }

      const showLabel =
        AD1(year) ||
        (zoom >= 0.01 && isMegaannum(year)) ||
        (zoom >= 0.03 && isKiloyear(year)) ||
        (zoom >= 0.1 && isMillennium(year)) ||
        (zoom >= 0.5 && isCentury(year)) ||
        (zoom >= 5 && isDecade(year)) ||
        (zoom >= 60 && isYear(year));

      if (showLabel) {
        const label = document.createElement('div');
        label.className = 'year-label';
        label.style.left = `${x}px`;
        label.textContent = toLabel(year);
        labelContainer.appendChild(label);

        requestAnimationFrame(() => {
          label.style.opacity = '1';
        });
      }
    }

    // Move banner to align with AD 1
    const ad1X = toVisualYear(1) * zoom + offsetX;
    banner.style.transform = `translateX(${ad1X}px) translateX(-50%) scale(${zoom})`;
    banner.style.transformOrigin = 'center center';
  }

  resizeCanvas();
  setupZoomHandlers(section);
  drawTicks();

  addZoomListener(drawTicks);
  window.addEventListener('resize', () => {
    resizeCanvas();
    drawTicks();
  });
});

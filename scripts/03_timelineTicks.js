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
    isMegaannum,
    isKiloyear,
    isMillennium,
    isCentury,
    isDecade,
    isYear,
    adjustYearForPosition
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
      const x = (toVisualYear(year) + OFFSET) * zoom + offsetX;
      if (x < -100 || x > canvas.width + 100) continue;

      ctx.beginPath();

      if (zoom >= 0.01 && isMegaannum(year)) {
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 4;
        ctx.moveTo(x, 0);
        ctx.lineTo(x, 100);
        ctx.stroke();
      } else if (zoom >= 0.03 && isKiloyear(year)) {
        ctx.strokeStyle = '#111';
        ctx.lineWidth = 3;
        ctx.moveTo(x, 0);
        ctx.lineTo(x, 80);
        ctx.stroke();
      } else if (zoom >= 0.1 && isMillennium(year)) {
        ctx.strokeStyle = '#222';
        ctx.lineWidth = 2.5;
        ctx.moveTo(x, 0);
        ctx.lineTo(x, 70);
        ctx.stroke();
      } else if (zoom >= 0.5 && isCentury(year)) {
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 2;
        ctx.moveTo(x, 10);
        ctx.lineTo(x, 60);
        ctx.stroke();
      } else if (zoom >= 1.5 && isDecade(year)) {
        ctx.strokeStyle = '#444';
        ctx.lineWidth = 1.5;
        ctx.moveTo(x, 20);
        ctx.lineTo(x, 50);
        ctx.stroke();
      } else if (zoom >= 3 && isYear(year)) {
        ctx.strokeStyle = '#888';
        ctx.lineWidth = 1;
        ctx.moveTo(x, 30);
        ctx.lineTo(x, 40);
        ctx.stroke();
      }

      // Add label if visible
      if (
        (zoom >= 0.01 && isMegaannum(year)) ||
        (zoom >= 0.03 && isKiloyear(year)) ||
        (zoom >= 0.1 && isMillennium(year)) ||
        (zoom >= 0.5 && isCentury(year)) ||
        (zoom >= 10 && isDecade(year)) ||
        (zoom >= 60 && isYear(year))
      ) {
        const label = document.createElement('div');
        label.className = 'year-label';
        label.style.left = `${x}px`;
        label.style.opacity = '0';
        label.style.transition = 'opacity 0.3s ease';
        label.innerText = toLabel(year);
        labelContainer.appendChild(label);

        requestAnimationFrame(() => {
          label.style.opacity = '1';
        });
      }
    }

    // Position banner to align center at AD 1
    const ad1X = (toVisualYear(1) + OFFSET) * zoom + offsetX;
    banner.style.transform = `translateX(${ad1X}px) translateX(-50%) scale(${zoom})`;
    banner.style.transformOrigin = 'center center';
  }

  resizeCanvas();
  setupZoomHandlers(canvas);
  drawTicks();

  addZoomListener(drawTicks);
  window.addEventListener('resize', () => {
    resizeCanvas();
    drawTicks();
  });
});

// scripts/renderTimeline.js

window.addEventListener('DOMContentLoaded', () => {
  function renderTimeline() {
    if (typeof window.drawTicks !== 'function') {
      console.warn('drawTicks not defined');
    } else {
      window.drawTicks();
    }

    if (typeof window.updateEntryPositions !== 'function') {
      console.warn('updateEntryPositions not defined');
    } else {
      window.updateEntryPositions();
    }
  }

  window.renderTimeline = renderTimeline;

  renderTimeline();
  window.addEventListener('resize', renderTimeline);
});

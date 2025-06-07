// scripts/renderTimeline.js

window.addEventListener('DOMContentLoaded', () => {
  function renderTimeline() {
    if (typeof window.drawTicks === 'function') {
      window.drawTicks();
    }
    if (typeof window.updateEntryPositions === 'function') {
      window.updateEntryPositions();
    }
  }

  window.renderTimeline = renderTimeline;

  // Automatically render on load
  renderTimeline();

  // Optional: Re-render when window resizes
  window.addEventListener('resize', renderTimeline);
});

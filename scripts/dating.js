// scripts/dating.js

window.datingUtils = (() => {
  // Central date constants — update here to affect everything
  const START_YEAR = -5000;
  const END_YEAR = 2025;
  const OFFSET = Math.abs(START_YEAR); // Timeline shifts to make 0 AD center cleanly

  // Convert a historical year into a visual label
  function toLabel(year) {
    if (year === 0 || typeof year !== 'number') return '';
    return year < 0 ? `${Math.abs(year)} BC` : `AD ${year}`;
  }

  // Adjust a historical year for visual positioning on canvas
  function toVisualYear(year) {
    if (typeof year !== 'number' || year === 0) return null;
    return year > 0 ? year : year + 1; // Skip year 0 gap
  }

  // Convert to canvas x-position given current zoom and offset
  function adjustYearForPosition(year, zoom, offsetX) {
    const visualYear = toVisualYear(year);
    return visualYear !== null ? (visualYear + OFFSET) * zoom + offsetX : null;
  }

  // Tick logic
  function isCentury(year) {
    return year % 100 === 0;
  }

  function isDecade(year) {
    return year % 10 === 0;
  }

  return {
    START_YEAR,
    END_YEAR,
    OFFSET,
    toLabel,
    toVisualYear,
    adjustYearForPosition,
    isCentury,
    isDecade
  };
})();

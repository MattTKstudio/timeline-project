// scripts/01_dating.js

window.datingUtils = (() => {
  const START_YEAR = -5000;
  const END_YEAR = 2025;
  const OFFSET = Math.abs(START_YEAR); // Aligns BC years into positive space

  // Convert year to human-readable label
  function toLabel(year) {
    if (typeof year !== 'number') return '';
    if (year < 0) return `${Math.abs(year)} BC`;
    if (year > 0) return `AD ${year}`;
    return '1 BC / AD 1'; // for synthetic midpoint, which we may now skip
  }

  // Map real year (e.g., -2) to continuous visual year
  function toVisualYear(year) {
    if (typeof year !== 'number') return null;
    // Treat 1 BC and AD 1 as *adjacent* years with no year 0
    if (year < 0) return year + 1; // -1 (1 BC) → 0
    if (year > 0) return year;     // 1 (AD 1) → 1
    return null; // never use 0
  }

  // Convert year to canvas position
  function adjustYearForPosition(year, zoom = 1, offsetX = 0) {
    const visualYear = toVisualYear(year);
    return visualYear !== null
      ? (visualYear + OFFSET) * zoom + offsetX
      : null;
  }

  // Tick logic
    function isMegaannum(year) {
    return year !== 0 && year % 1000000 === 0;
  }
  
  function isMegaannum(year) {
    return year !== 0 && year % 1000000 === 0;
  }

  function isKiloyear(year) {
    return year !== 0 && year % 10000 === 0;
  }

  function isMillennium(year) {
    return year !== 0 && year % 1000 === 0;
  }

  function isCentury(year) {
    return year !== 0 && year % 100 === 0;
  }

  function isDecade(year) {
    return year !== 0 && year % 10 === 0;
  }

  function isYear(year) {
    return year !== 0; // Every year is a year tick except 0
  }

  return {
    START_YEAR,
    END_YEAR,
    OFFSET,
    toLabel,
    toVisualYear,
    adjustYearForPosition,
    isMegaannum,
    isKiloyear,
    isMillennium,
    isCentury,
    isDecade,
    isYear,
  };
})();

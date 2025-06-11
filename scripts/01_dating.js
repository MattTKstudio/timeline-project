// scripts/01_dating.js

window.datingUtils = (() => {
  const START_YEAR = -2000;
  const END_YEAR = new Date().getFullYear();
  const OFFSET = Math.abs(START_YEAR); // Aligns year 0 to center

  // Convert year to display label
  function toLabel(year) {
    if (typeof year !== 'number') return '';
    if (year < 0) return `${Math.abs(year)} BC`;
    if (year > 0) return `AD ${year}`;
    return '1 BC / AD 1'; // Skip year zero
  }

  // Convert real year to visual position (timeline unit)
  function toVisualYear(year) {
    if (typeof year !== 'number') return null;
    if (year === 0) return null; // No year zero
    return year > 0 ? year + OFFSET : year + OFFSET + 1;
  }

  // Adjust year to position with zoom and offset
  function adjustYearForPosition(year, zoom, offsetX) {
    const visualYear = toVisualYear(year);
    if (visualYear === null) return null;
    return visualYear * zoom + offsetX;
  }

  // Check time types
  function AD1(year) {
    return year === 1;
  }

  function isMegaannum(year) {
    return year % 1000000 === 0;
  }

  function isKiloyear(year) {
    return year % 1000 === 0;
  }

  function isMillennium(year) {
    return year % 1000 === 0;
  }

  function isCentury(year) {
    return year % 100 === 0;
  }

  function isDecade(year) {
    return year % 10 === 0;
  }

  function isYear(year) {
    return true;
  }

  return {
    START_YEAR,
    END_YEAR,
    OFFSET,
    toLabel,
    toVisualYear,
    adjustYearForPosition,
    AD1,
    isMegaannum,
    isKiloyear,
    isMillennium,
    isCentury,
    isDecade,
    isYear
  };
})();

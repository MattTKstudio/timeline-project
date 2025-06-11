// scripts/04_loadData.js
import { renderEntries } from './05_renderEntries.js';

window.addEventListener('DOMContentLoaded', () => {
  fetch('entries/entries.json')
    .then(res => res.json())
    .then(data => {
      renderEntries(data);
    })
    .catch(err => {
      console.error('❌ Failed to load entries.json:', err);
    });
});

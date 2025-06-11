// scripts/05_renderEntries.js

const container = document.getElementById('entries-container');

export function renderEntries(entries) {
  if (!container || !Array.isArray(entries)) {
    console.error('❌ Missing container or entries.');
    return;
  }

  const { toVisualYear } = window.datingUtils;
  const { zoom: currentZoom, offsetX } = window.timelineZoom.getZoomState();
  const spacing = currentZoom;

  function isVisibleAtZoom(entryZoom, currentZoom) {
    const zoomThresholds = {
      millennium: 0.05,
      century: 0.5,
      decade: 5,
      year: 50,
    };
    return currentZoom >= (zoomThresholds[entryZoom] ?? Infinity);
  }

  container.innerHTML = '';

  entries.forEach(entry => {
    const startX = toVisualYear(entry.startYear);
    const endX = toVisualYear(entry.endYear ?? entry.startYear);
    if (startX === null || endX === null) return;

   // if (!isVisibleAtZoom(entry.visible, currentZoom)) return;

    const x = startX * spacing + offsetX;
    const width = (endX - startX) * spacing || 2;

    const el = document.createElement('div');
    el.className = 'timeline-entry';
    el.style.position = 'absolute';
    el.style.transform = `translateX(${x}px)`;

    const bar = document.createElement('div');
    bar.className = 'entry-line';
    bar.style.width = `${width}px`;
    el.appendChild(bar);

    const icon = document.createElement('img');
    icon.className = 'entry-icon';
    icon.src = entry.icon || 'assets/icons/default.svg';
    icon.alt = entry.title || 'Timeline Event';
    icon.onerror = () => { icon.src = 'assets/icons/default.svg'; };
    icon.style.left = '50%'; // Center within entry box
    icon.addEventListener('click', () => openEntryPopup(entry));
    el.appendChild(icon);

    container.appendChild(el);
  });
}

function openEntryPopup(entry) {
  const popup = document.getElementById('entry-popup');
  if (!popup) return;

  popup.querySelector('.popup-title').textContent = entry.title || '';
  popup.querySelector('.popup-quote').textContent = entry.quote || '';
  popup.querySelector('.popup-desc').textContent = entry.description || '';

  const image = popup.querySelector('.popup-image');
  if (image) {
    if (entry.image) {
      image.src = entry.image;
      image.alt = entry.title || '';
      image.style.display = 'block';
    } else {
      image.style.display = 'none';
    }
  }

  popup.classList.add('visible');
  popup.scrollIntoView({ behavior: 'smooth' });
}

window.closeEntryPopup = () => {
  const popup = document.getElementById('entry-popup');
  popup?.classList.remove('visible');
};

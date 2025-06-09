// scripts/buildEntries.js
// Run with: node scripts/buildEntries.js

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Root: /data/timeline/
const dataDir = path.join(__dirname, '../data/timeline');
const outputFile = path.join(__dirname, '../entries/entries.json');
const entries = [];

function walkDirectory(dir) {
  const items = fs.readdirSync(dir);

  for (const item of items) {
    const itemPath = path.join(dir, item);
    const stat = fs.statSync(itemPath);

    if (stat.isDirectory()) {
      const metaPath = path.join(itemPath, 'meta.json');

      if (fs.existsSync(metaPath)) {
        try {
          const raw = fs.readFileSync(metaPath, 'utf-8');
          const meta = JSON.parse(raw);

          const relative = path.relative(dataDir, itemPath).replace(/\\/g, '/');

          const entry = {
            title: meta.title || 'Untitled',
            startYear: meta.startYear ?? meta.year ?? 0,
            endYear: meta.endYear ?? meta.year ?? 0,
            icon: `data/timeline/${relative}/${meta.icon || 'icon.png'}`,
            image: `data/timeline/${relative}/${meta.image || 'art.webp'}`,
            quote: meta.quote || '',
            description: meta.description || '',
            tags: meta.tags || [],
            visible: meta.visible || 'century',
            path: `data/timeline/${relative}`
          };

          entries.push(entry);
          console.log(`🗂️  Added: ${entry.title} (${entry.startYear})`);
        } catch (err) {
          console.error(`❌ Error in ${metaPath}:\n`, err.message);
        }
      } else {
        walkDirectory(itemPath); // Keep searching deeper
      }
    }
  }
}

walkDirectory(dataDir);

fs.writeFileSync(outputFile, JSON.stringify(entries, null, 2));
console.log(`✅ Built entries.json with ${entries.length} total entries.`);

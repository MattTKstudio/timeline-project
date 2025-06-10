// scripts/buildEntries.js
// Run with: node scripts/buildEntries.js [optionalOutputFile.json]

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Paths and setup
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataDir = path.join(__dirname, '../data/timeline');
const outputArg = process.argv[2] || 'entries.json';
const outputFile = path.join(__dirname, '../entries', outputArg);

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

          const startYear = Number(meta.startYear ?? meta.year ?? 0);
          const endYear = Number(meta.endYear ?? meta.year ?? 0);
          const title = meta.title || 'Untitled';

          if (!meta.title) {
            console.warn(`⚠️ Missing title in: ${metaPath}`);
          }

          const entry = {
            title,
            startYear,
            endYear,
            icon: `data/timeline/${relative}/${meta.icon || 'icon.png'}`,
            image: `data/timeline/${relative}/${meta.image || 'art.webp'}`,
            quote: meta.quote || '',
            description: meta.description || '',
            tags: meta.tags || [],
            visible: meta.visible || 'century',
            path: `data/timeline/${relative}`
          };

          entries.push(entry);
          console.log(`🗂️  Added: ${title} (${startYear})`);
        } catch (err) {
          console.error(`❌ Error in ${metaPath}:\n`, err.message);
        }
      } else {
        walkDirectory(itemPath); // Keep going deeper
      }
    }
  }
}

// Build and write
walkDirectory(dataDir);
entries.sort((a, b) => a.startYear - b.startYear);

fs.writeFileSync(outputFile, JSON.stringify(entries, null, 2));
console.log(`✅ Built ${outputArg} with ${entries.length} entries.`);

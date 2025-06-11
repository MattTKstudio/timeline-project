// scripts/buildEntries.js
// Run with: node scripts/buildEntries.js

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const entriesRoot = path.join(__dirname, '../entries');
const outputFile = path.join(entriesRoot, 'entries.json');

const allEntries = [];

function walk(dir) {
  const items = fs.readdirSync(dir, { withFileTypes: true });

  for (const item of items) {
    const fullPath = path.join(dir, item.name);

    if (item.isDirectory()) {
      walk(fullPath);
    } else if (item.name === 'meta.json') {
      const folder = path.dirname(fullPath);
      const raw = fs.readFileSync(fullPath, 'utf-8');
      const meta = JSON.parse(raw);

      if (!meta.slug || !meta.startYear || !meta.title) {
        console.warn(`⚠️ Skipping incomplete meta in: ${fullPath}`);
        continue;
      }

      const relativePath = path.relative(entriesRoot, folder).replace(/\\/g, '/');

      const entry = {
        ...meta,
        slug: meta.slug,
        folder: `entries/${relativePath}`, // For clarity/debug
        icon: `entries/${relativePath}/${meta.icon || 'icon.svg'}`,
        art: `entries/${relativePath}/art.webp`
      };

      allEntries.push(entry);
    }
  }
}

walk(entriesRoot);

fs.writeFileSync(outputFile, JSON.stringify(allEntries, null, 2));
console.log(`✅ Built entries.json with ${allEntries.length} entries.`);

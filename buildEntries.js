// scripts/buildEntries.js
// Run with: `node scripts/buildEntries.js`

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const entryRoot = path.join(__dirname, '../entries');
const outputFile = path.join(__dirname, '../entries.json');
const output = [];

function walk(dir) {
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      const indexPath = path.join(fullPath, 'index.json');
      if (fs.existsSync(indexPath)) {
        try {
          const json = JSON.parse(fs.readFileSync(indexPath, 'utf8'));
          const relativePath = path.relative(entryRoot, fullPath).replace(/\\/g, '/');

          const entry = {
            title: json.title || 'Untitled',
            startYear: json.startYear || json.year || 0,
            endYear: json.endYear || json.year || 0,
            visible: json.visible || 'century',
            tags: json.tags || [],
            icon: `${relativePath}/${json.icon || 'icon.svg'}`,
            image: `${relativePath}/${json.image || 'art.webp'}`,
            quote: json.quote || '',
            description: json.description || '',
            path: `entries/${relativePath}`
          };

          output.push(entry);
        } catch (err) {
          console.error(`⚠️ Error parsing ${indexPath}:`, err);
        }
      } else {
        walk(fullPath);
      }
    }
  }
}

walk(entryRoot);

fs.writeFileSync(outputFile, JSON.stringify(output, null, 2));
console.log(`✅ Built entries.json with ${output.length} entries.`);

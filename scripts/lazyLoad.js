// scripts/buildEntries.js
// Run this script in Node.js with: `node scripts/buildEntries.js`

const fs = require('fs');
const path = require('path');

const entryRoot = path.join(__dirname, '../entries');
const outputFile = path.join(__dirname, '../entries.json');
const output = [];
const OFFSET = 5000; // Referenced in dating.js

function parseEntry(entryPath, relativePath) {
  const indexPath = path.join(entryPath, 'index.json');
  if (!fs.existsSync(indexPath)) return;

  try {
    const json = JSON.parse(fs.readFileSync(indexPath, 'utf8'));

    const startYear = json.startYear || json.year || 0;
    const endYear = json.endYear || json.year || 0;

    output.push({
      title: json.title || 'Untitled',
      startYear,
      endYear,
      visible: json.visible || 'century',
      tags: json.tags || [],
      icon: `${relativePath}/${json.icon || 'icon.svg'}`,
      image: `${relativePath}/${json.image || 'art.webp'}`,
      quote: json.quote || '',
      description: json.description || '',
      path: `entries/${relativePath}`
    });
  } catch (err) {
    console.error(`⚠️ Error parsing ${indexPath}:`, err);
  }
}

function walk(dir, relative = '') {
  const items = fs.readdirSync(dir);
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    const relPath = path.join(relative, item).replace(/\\/g, '/');

    if (stat.isDirectory()) {
      if (fs.existsSync(path.join(fullPath, 'index.json'))) {
        parseEntry(fullPath, relPath);
      } else {
        walk(fullPath, relPath);
      }
    }
  }
}

walk(entryRoot);
fs.writeFileSync(outputFile, JSON.stringify(output, null, 2));
console.log(`✅ Built entries.json with ${output.length} entries.`);

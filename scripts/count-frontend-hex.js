const fs = require('fs');
const path = require('path');
const root = path.join(process.cwd(), 'frontend');
const exts = new Set(['.ts', '.tsx']);
const pattern = /#([0-9A-Fa-f]{6})/g;
const counts = {};
function walk(dir, list=[]) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const res = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (res.includes('node_modules') || res.includes('.next')) continue;
      walk(res, list);
    } else if (exts.has(path.extname(res))) {
      list.push(res);
    }
  }
  return list;
}
const files = walk(root);
files.forEach(file => {
  const text = fs.readFileSync(file, 'utf8');
  let match;
  while ((match = pattern.exec(text))) {
    const hex = match[0].toUpperCase();
    counts[hex] = (counts[hex] || 0) + 1;
  }
});
Object.entries(counts).sort((a,b)=>b[1]-a[1]).slice(0,50).forEach(([hex, count]) => console.log(`${hex}: ${count}`));
console.log('files scanned:', files.length);

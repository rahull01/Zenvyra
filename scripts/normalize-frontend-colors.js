const fs = require('fs');
const path = require('path');
const root = path.join(process.cwd(), 'frontend');
const extensions = new Set(['.ts', '.tsx']);
const replacements = [
  [/bg-\[#0F0F1A\]/g, 'bg-secondary-darker'],
  [/bg-\[#0F172A\]/g, 'bg-secondary-darker'],
  [/bg-\[#1A1A2E\]/g, 'bg-secondary'],
  [/bg-\[#1E293B\]/g, 'bg-secondary'],
  [/bg-\[#334155\]/g, 'bg-tertiary'],
  [/bg-\[#F8FAFC\]/g, 'bg-light'],
  [/bg-\[#FFFFFF\]/g, 'bg-surface'],
  [/bg-\[#ffffff\]/g, 'bg-surface'],
  [/bg-\[#E67E22\]/g, 'bg-accent'],
  [/bg-\[#F59E0B\]/g, 'bg-accent'],
  [/bg-\[#D35400\]/g, 'bg-accent-dark'],
  [/bg-\[#B85C00\]/g, 'bg-accent-dark'],
  [/bg-\[#FBBF24\]/g, 'bg-accent-light'],
  [/text-\[#F8FAFC\]/g, 'text-text-primary'],
  [/text-\[#ffffff\]/g, 'text-text-primary'],
  [/text-\[#94A3B8\]/g, 'text-text-secondary'],
  [/text-\[#64748B\]/g, 'text-text-muted'],
  [/text-\[#0F172A\]/g, 'text-text-dark'],
  [/text-\[#1A1A2E\]/g, 'text-text-dark'],
  [/text-\[#EF4444\]/g, 'text-error'],
  [/text-\[#10B981\]/g, 'text-success'],
  [/text-\[#F59E0B\]/g, 'text-accent'],
  [/text-\[#E67E22\]/g, 'text-accent'],
  [/text-\[#06B6D4\]/g, 'text-info'],
  [/text-\[#3B82F6\]/g, 'text-info'],
  [/border-\[#E2E8F0\]/g, 'border-border-light'],
  [/border-\[#334155\]/g, 'border-border-light'],
  [/border-\[#1A1A2E\]/g, 'border-border-light'],
  [/border-\[#0F172A\]/g, 'border-border-light'],
  [/from-\[#E67E22\]/g, 'from-accent'],
  [/from-\[#F59E0B\]/g, 'from-accent'],
  [/to-\[#D35400\]/g, 'to-accent-dark'],
  [/to-\[#FBBF24\]/g, 'to-accent-light'],
  [/stroke-\[#1A1A2E\]/g, 'stroke-border-light'],
  [/stroke-\[#1E293B\]/g, 'stroke-border-light'],
  [/stroke-\[#64748B\]/g, 'stroke-text-muted'],
  [/fill-\[#F8FAFC\]/g, 'fill-text-primary'],
  [/fill-\[#ffffff\]/g, 'fill-text-primary'],
  [/bg-\[#([A-F0-9]{6})\]/g, (match, c) => {
    const map = {
      '0F0F1A': 'bg-secondary-darker',
      '0F172A': 'bg-secondary-darker',
      '1A1A2E': 'bg-secondary',
      '1E293B': 'bg-secondary',
      '334155': 'bg-tertiary',
      'F8FAFC': 'bg-light',
      'FFFFFF': 'bg-surface',
      'E67E22': 'bg-accent',
      'F59E0B': 'bg-accent',
      'D35400': 'bg-accent-dark',
      'B85C00': 'bg-accent-dark',
      'FBBF24': 'bg-accent-light',
    };
    return map[c] || match;
  }],
  [/text-\[#([A-F0-9]{6})\]/g, (match, c) => {
    const map = {
      'F8FAFC': 'text-text-primary',
      'FFFFFF': 'text-text-primary',
      '94A3B8': 'text-text-secondary',
      '64748B': 'text-text-muted',
      '0F172A': 'text-text-dark',
      '1A1A2E': 'text-text-dark',
      'EF4444': 'text-error',
      '10B981': 'text-success',
      'F59E0B': 'text-accent',
      'E67E22': 'text-accent',
      '06B6D4': 'text-info',
      '3B82F6': 'text-info',
    };
    return map[c] || match;
  }],
  [/border-\[#([A-F0-9]{6})\]/g, (match, c) => {
    const map = {
      'E2E8F0': 'border-border-light',
      '334155': 'border-border-light',
      '1A1A2E': 'border-border-light',
      '0F172A': 'border-border-light',
    };
    return map[c] || match;
  }],
  [/from-\[#([A-F0-9]{6})\]/g, (match, c) => {
    const map = {
      'E67E22': 'from-accent',
      'F59E0B': 'from-accent',
      '06B6D4': 'from-info',
      '8B5CF6': 'from-info',
    };
    return map[c] || match;
  }],
  [/to-\[#([A-F0-9]{6})\]/g, (match, c) => {
    const map = {
      'D35400': 'to-accent-dark',
      'FBBF24': 'to-accent-light',
      'E67E22': 'to-accent',
    };
    return map[c] || match;
  }],
  [/backgroundColor:\s*['\"]#0F172A['\"]/g, 'backgroundColor: "var(--bg-secondary-darker)"'],
  [/backgroundColor:\s*['\"]#1A1A2E['\"]/g, 'backgroundColor: "var(--bg-secondary)"'],
  [/backgroundColor:\s*['\"]#1E293B['\"]/g, 'backgroundColor: "var(--bg-secondary)"'],
  [/backgroundColor:\s*['\"]#334155['\"]/g, 'backgroundColor: "var(--bg-tertiary)"'],
  [/backgroundColor:\s*['\"]#F8FAFC['\"]/g, 'backgroundColor: "var(--bg-light)"'],
  [/backgroundColor:\s*['\"]#FFFFFF['\"]/g, 'backgroundColor: "var(--bg-surface)"'],
  [/backgroundColor:\s*['\"]#ffffff['\"]/g, 'backgroundColor: "var(--bg-surface)"'],
  [/color:\s*['\"]#F8FAFC['\"]/g, 'color: "var(--text-primary)"'],
  [/color:\s*['\"]#ffffff['\"]/g, 'color: "var(--text-primary)"'],
  [/color:\s*['\"]#94A3B8['\"]/g, 'color: "var(--text-secondary)"'],
  [/color:\s*['\"]#64748B['\"]/g, 'color: "var(--text-muted)"'],
  [/color:\s*['\"]#0F172A['\"]/g, 'color: "var(--text-dark)"'],
  [/border:\s*['\"]1px solid #E2E8F0['\"]/g, 'border: "1px solid var(--border-light)"'],
  [/border:\s*['\"]1px solid #1A1A2E['\"]/g, 'border: "1px solid var(--border-light)"'],
  [/border:\s*['\"]1px solid #0F172A['\"]/g, 'border: "1px solid var(--border-light)"'],
  [/border:\s*['\"]1px solid #334155['\"]/g, 'border: "1px solid var(--border-light)"'],
  [/border:\s*['\"]2px solid #E2E8F0['\"]/g, 'border: "2px solid var(--border-light)"'],
];

async function walk(dir, filelist = []) {
  const dirents = await fs.promises.readdir(dir, { withFileTypes: true });
  for (const dirent of dirents) {
    const res = path.join(dir, dirent.name);
    if (dirent.isDirectory()) {
      if (res.includes('node_modules') || res.includes('.next')) continue;
      filelist = await walk(res, filelist);
    } else if (extensions.has(path.extname(res))) {
      filelist.push(res);
    }
  }
  return filelist;
}

(async () => {
  const files = await walk(root);
  const changed = [];
  for (const file of files) {
    let text = await fs.promises.readFile(file, 'utf8');
    const before = text;
    for (const [regex, replacement] of replacements) {
      text = text.replace(regex, replacement);
    }
    if (text !== before) {
      changed.push(file.replace(process.cwd() + path.sep, ''));
      await fs.promises.writeFile(file, text, 'utf8');
    }
  }
  console.log('Modified files:', changed.length);
  changed.forEach((f) => console.log(f));
})();

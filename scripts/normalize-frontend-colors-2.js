const fs = require('fs');
const path = require('path');
const root = path.join(process.cwd(), 'frontend');
const extensions = new Set(['.ts', '.tsx']);
const colorMap = {
  '0F0F1A': 'secondary-darker',
  '0F172A': 'secondary-darker',
  '1A1A2E': 'secondary',
  '1E293B': 'secondary',
  '334155': 'tertiary',
  'F8FAFC': 'light',
  'FFFFFF': 'surface',
  'E67E22': 'accent',
  'F59E0B': 'accent',
  'D35400': 'accent-dark',
  'B85C00': 'accent-dark',
  'FBBF24': 'accent-light',
  '94A3B8': 'text-secondary',
  '64748B': 'text-muted',
  'EF4444': 'error',
  '10B981': 'success',
  '06B6D4': 'info',
  '3B82F6': 'info',
  'E5E7EB': 'surface',
  '4B5563': 'text-muted',
  'F1F5F9': 'bg-light',
  '071827': 'secondary-darker',
};
const replacements = [
  // class patterns
  {
    regex: /bg-\[#([0-9A-Fa-f]{6})\]/g,
    replace: (match, c) => {
      const key = c.toUpperCase();
      return colorMap[key] ? `bg-${colorMap[key]}` : match;
    },
  },
  {
    regex: /text-\[#([0-9A-Fa-f]{6})\]/g,
    replace: (match, c) => {
      const key = c.toUpperCase();
      if (colorMap[key]) {
        if (colorMap[key].startsWith('text-') || colorMap[key] === 'error' || colorMap[key] === 'success' || colorMap[key] === 'info' || colorMap[key] === 'accent') {
          return `text-${colorMap[key]}`;
        }
        return `text-${colorMap[key]}`;
      }
      return match;
    },
  },
  {
    regex: /border-\[#([0-9A-Fa-f]{6})\]/g,
    replace: (match, c) => {
      const key = c.toUpperCase();
      if (key === 'E2E8F0' || key === '334155' || key === '1A1A2E' || key === '0F172A') {
        return 'border-border-light';
      }
      return match;
    },
  },
  {
    regex: /from-\[#([0-9A-Fa-f]{6})\]/g,
    replace: (match, c) => {
      const key = c.toUpperCase();
      if (key === 'E67E22' || key === 'F59E0B') return 'from-accent';
      if (key === 'D35400') return 'from-accent-dark';
      if (key === 'FBBF24') return 'from-accent-light';
      if (key === '06B6D4' || key === '8B5CF6') return 'from-info';
      return match;
    },
  },
  {
    regex: /to-\[#([0-9A-Fa-f]{6})\]/g,
    replace: (match, c) => {
      const key = c.toUpperCase();
      if (key === 'D35400') return 'to-accent-dark';
      if (key === 'FBBF24') return 'to-accent-light';
      if (key === 'E67E22') return 'to-accent';
      return match;
    },
  },
  {
    regex: /stroke-\[#([0-9A-Fa-f]{6})\]/g,
    replace: (match, c) => {
      const key = c.toUpperCase();
      if (key === '1A1A2E' || key === '1E293B') return 'stroke-border-light';
      if (key === '64748B' || key === '4B5563') return 'stroke-text-muted';
      return match;
    },
  },
  {
    regex: /fill-\[#([0-9A-Fa-f]{6})\]/g,
    replace: (match, c) => {
      const key = c.toUpperCase();
      if (key === 'F8FAFC' || key === 'FFFFFF') return 'fill-text-primary';
      return match;
    },
  },
  // inline style values
  {
    regex: /backgroundColor:\s*['\"]#([0-9A-Fa-f]{6})['\"]/g,
    replace: (match, c) => {
      const key = c.toUpperCase();
      const bgMap = {
        '0F172A': 'bg-secondary-darker',
        '1A1A2E': 'bg-secondary',
        '1E293B': 'bg-secondary',
        '334155': 'bg-tertiary',
        'F8FAFC': 'bg-light',
        'FFFFFF': 'bg-surface',
      };
      if (bgMap[key]) return `backgroundColor: "var(--${bgMap[key]})"`;
      return match;
    },
  },
  {
    regex: /color:\s*['\"]#([0-9A-Fa-f]{6})['\"]/g,
    replace: (match, c) => {
      const key = c.toUpperCase();
      const colorMapInline = {
        'F8FAFC': 'text-primary',
        'FFFFFF': 'text-primary',
        '94A3B8': 'text-secondary',
        '64748B': 'text-muted',
        '0F172A': 'text-dark',
        '1A1A2E': 'text-dark',
        'EF4444': 'error',
        '10B981': 'success',
        'F59E0B': 'accent',
        'E67E22': 'accent',
        '06B6D4': 'info',
      };
      if (colorMapInline[key]) return `color: "var(--${colorMapInline[key]})"`;
      return match;
    },
  },
  {
    regex: /border:\s*['\"]1px solid #([0-9A-Fa-f]{6})['\"]/g,
    replace: (match, c) => {
      const key = c.toUpperCase();
      if (key === 'E2E8F0' || key === '334155' || key === '1A1A2E' || key === '0F172A') {
        return 'border: "1px solid var(--border-light)"';
      }
      return match;
    },
  },
];

async function walk(dir) {
  const results = [];
  for (const entry of await fs.promises.readdir(dir, { withFileTypes: true })) {
    const res = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (res.includes('node_modules') || res.includes('.next')) continue;
      results.push(...await walk(res));
    } else if (extensions.has(path.extname(res))) {
      results.push(res);
    }
  }
  return results;
}

(async () => {
  const files = await walk(root);
  const modifiedFiles = [];
  for (const file of files) {
    let text = await fs.promises.readFile(file, 'utf8');
    const original = text;
    for (const { regex, replace } of replacements) {
      text = text.replace(regex, replace);
    }
    if (text !== original) {
      modifiedFiles.push(file.replace(process.cwd() + path.sep, ''));
      await fs.promises.writeFile(file, text, 'utf8');
    }
  }
  console.log('Modified files:', modifiedFiles.length);
  modifiedFiles.forEach((f) => console.log(f));
})();

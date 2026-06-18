const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

const colorMap = {
  '#00B4D8': 'var(--color-accent-blue)',
  '#1A56FF': 'var(--sg-accent)',
  '#0D9488': 'var(--color-success)',
  '#F43F5E': 'var(--color-danger)',
  '#059669': 'var(--color-success)',
  '#D97706': 'var(--color-warning)',
  '#F59E0B': 'var(--color-warning)',
  '#10B981': 'var(--color-success)',
  '#64748B': 'var(--color-accent-violet)',
  '#FF5C35': 'var(--color-accent-coral)',
  '#0891B2': 'var(--color-accent-blue)',
  '#FF5F57': 'var(--color-danger)',
  '#FEBC2E': 'var(--color-warning)',
  '#28C840': 'var(--color-success)',
  '#0B1730': 'var(--color-surface)',
  '#14B8A6': 'var(--color-success)',
  'var(--blue)': 'var(--sg-accent)',
  'var(--violet)': 'var(--sg-accent-2)'
};

function processFile(filePath) {
  if (fs.statSync(filePath).isDirectory()) {
    fs.readdirSync(filePath).forEach(file => {
      processFile(path.join(filePath, file));
    });
    return;
  }

  if (!filePath.endsWith('.jsx') && !filePath.endsWith('.js')) {
    return;
  }

  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;

  // Replace exact hex colors
  for (const [hex, cssVar] of Object.entries(colorMap)) {
    const regex = new RegExp(hex, 'g');
    content = content.replace(regex, cssVar);
  }

  // Replace rgba(..., opacity) with color-mix
  // Example: rgba(16,185,129,0.08) -> color-mix(in srgb, var(--color-success) 8%, transparent)
  // But wait, the rgba values map to hex colors:
  // 16,185,129 -> #10B981 -> var(--color-success)
  // 245,158,11 -> #F59E0B -> var(--color-warning)
  // 26,86,255 -> #1A56FF -> var(--sg-accent)
  // 13,148,136 -> #0D9488 -> var(--color-success)
  // 255,92,53 -> #FF5C35 -> var(--color-accent-coral)
  // 217,119,6 -> #D97706 -> var(--color-warning)
  // 5,150,105 -> #059669 -> var(--color-success)
  // 8,145,178 -> #0891B2 -> var(--color-accent-blue)
  // 0,212,255 -> #00D4FF -> var(--color-accent-blue)
  
  const rgbaMap = {
    '16,185,129': 'var(--color-success)',
    '245,158,11': 'var(--color-warning)',
    '26,86,255': 'var(--sg-accent)',
    '13,148,136': 'var(--color-success)',
    '255,92,53': 'var(--color-accent-coral)',
    '217,119,6': 'var(--color-warning)',
    '5,150,105': 'var(--color-success)',
    '8,145,178': 'var(--color-accent-blue)',
    '0,212,255': 'var(--color-accent-blue)',
    '100,210,200': 'var(--color-success)'
  };

  for (const [rgb, cssVar] of Object.entries(rgbaMap)) {
    const regex = new RegExp(`rgba\\(${rgb},([0-9.]+)\\)`, 'g');
    content = content.replace(regex, (match, opacity) => {
      const percentage = Math.round(parseFloat(opacity) * 100);
      return `color-mix(in srgb, ${cssVar} ${percentage}%, transparent)`;
    });
  }

  // Handle generic white opacity rgba(255,255,255,X) -> color-mix(in srgb, var(--color-text-heading) X%, transparent)
  content = content.replace(/rgba\((?:255,)?255,255,([0-9.]+)\)/g, (match, opacity) => {
    const percentage = Math.round(parseFloat(opacity) * 100);
    return `color-mix(in srgb, var(--color-text-heading) ${percentage}%, transparent)`;
  });

  // Handle #fff
  // We have to be careful with #fff since it's used as text color mostly.
  content = content.replace(/'#fff'/g, "'var(--color-text-heading)'");
  content = content.replace(/"#fff"/g, '"var(--color-text-heading)"');

  // Handle #1A56FF08 (hex with opacity)
  content = content.replace(/#1A56FF08/g, "color-mix(in srgb, var(--sg-accent) 8%, transparent)");
  content = content.replace(/#0D948808/g, "color-mix(in srgb, var(--color-success) 8%, transparent)");
  
  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${filePath}`);
  }
}

processFile(srcDir);
console.log('Done!');

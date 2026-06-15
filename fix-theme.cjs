const fs = require('fs');
const path = require('path');

function walk(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walk(dirPath, callback) : callback(path.join(dir, f));
  });
}

walk('./src', function(filePath) {
  if (filePath.endsWith('.tsx')) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Replace hardcoded dark colors with responsive light/dark pairs
    content = content.replace(/bg-\[#0f0a1a\]/g, 'bg-slate-50 dark:bg-[#0f0a1a]');
    content = content.replace(/text-white/g, 'text-slate-900 dark:text-white');
    content = content.replace(/bg-white\/5/g, 'bg-slate-900/5 dark:bg-white/5');
    content = content.replace(/border-white\/10/g, 'border-slate-900/10 dark:border-white/10');
    content = content.replace(/bg-white\/\[0\.03\]/g, 'bg-slate-900/[0.03] dark:bg-white/[0.03]');
    content = content.replace(/border-white\/\[0\.08\]/g, 'border-slate-900/[0.08] dark:border-white/[0.08]');
    content = content.replace(/text-gray-400/g, 'text-slate-600 dark:text-gray-400');
    content = content.replace(/text-gray-300/g, 'text-slate-700 dark:text-gray-300');
    content = content.replace(/bg-white\/10/g, 'bg-slate-900/10 dark:bg-white/10');
    content = content.replace(/border-white\/30/g, 'border-slate-900/30 dark:border-white/30');
    content = content.replace(/border-t-white/g, 'border-t-slate-900 dark:border-t-white');

    fs.writeFileSync(filePath, content, 'utf8');
  }
});
console.log('Theme classes updated successfully.');

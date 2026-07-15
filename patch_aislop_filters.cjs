const fs = require('fs');
let code = fs.readFileSync('src/components/AiSlop.tsx', 'utf-8');

// Remove filters on thumbnails
code = code.replace(/saturate-125 contrast-110 /g, "");

fs.writeFileSync('src/components/AiSlop.tsx', code);

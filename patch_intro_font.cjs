const fs = require('fs');
let css = fs.readFileSync('src/index.css', 'utf-8');

css = css.replace(/(\.psy-intro-copy p\s*\{[^}]*font-family:\s*)'Gondens',\s*sans-serif;(\s*font-size:\s*)clamp\([^)]+\);/, "$1'Pixelogist', monospace;$2clamp(0.7rem, 1.1vw, 1.1rem);");

fs.writeFileSync('src/index.css', css);

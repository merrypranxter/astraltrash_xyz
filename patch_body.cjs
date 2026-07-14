const fs = require('fs');
let css = fs.readFileSync('src/index.css', 'utf-8');

// revert .psy-intro-copy p back to Gondens
css = css.replace(/(\.psy-intro-copy p\s*\{[^}]*font-family:\s*)'Pixelogist',\s*monospace;(\s*font-size:\s*)clamp\([^)]+\);/, "$1'Gondens', sans-serif;$2clamp(1.4rem, 1.8vw, 1.8rem);");

// set .psy-report-copy p to Pixelogist and smaller
css = css.replace(/(\.psy-report-copy p\s*\{[^}]*font-family:\s*)'Gondens',\s*sans-serif;(\s*font-size:\s*)clamp\([^)]+\);/, "$1'Pixelogist', monospace;$2clamp(0.7rem, 1.1vw, 1.1rem);");

fs.writeFileSync('src/index.css', css);

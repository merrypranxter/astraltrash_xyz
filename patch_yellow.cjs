const fs = require('fs');
let css = fs.readFileSync('src/index.css', 'utf-8');
css = css.replace(/(\.psy-eyebrow\s*\{[^}]*font-family:\s*)'Computer 7',\s*monospace;/, "$1'VICTM___', sans-serif;");
fs.writeFileSync('src/index.css', css);

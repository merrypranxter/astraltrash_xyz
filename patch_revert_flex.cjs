const fs = require('fs');
let css = fs.readFileSync('src/index.css', 'utf-8');

css = css.replace(/\.psy-fragment\s*\{\s*flex:\s*1\s*1\s*auto;/g, ".psy-fragment { flex: 0 1 auto;");

// I'll make the font size bigger so it naturally spans the width
css = css.replace(/\.psy-fragment-title\s*\{\s*font-family:\s*'BarcodeFont',\s*monospace;\s*font-size:\s*clamp\([^)]+\);\s*white-space:\s*nowrap;\s*transform:\s*scaleY\(3.5\);\s*transform-origin:\s*center;\s*display:\s*inline-block;\s*letter-spacing:\s*-2px;\s*text-align:\s*center;\s*line-height:\s*1;\s*\}/g, ".psy-fragment-title { font-family: 'BarcodeFont', monospace; font-size: clamp(30px, 8vw, 150px); white-space: nowrap; transform: scaleY(3.5); transform-origin: center; display: inline-block; letter-spacing: -2px; text-align: center; line-height: 1; }");

fs.writeFileSync('src/index.css', css);

const fs = require('fs');
let css = fs.readFileSync('src/index.css', 'utf-8');

css = css.replace(/\.psy-fragment-title\s*\{[^}]+\}/, ".psy-fragment-title { font-family: 'BarcodeFont', monospace; font-size: clamp(40px, 13vw, 200px); white-space: nowrap; transform: scaleY(3.5); transform-origin: center; display: inline-block; letter-spacing: -2px; width: 100%; text-align: center; }");

fs.writeFileSync('src/index.css', css);

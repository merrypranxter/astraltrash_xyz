const fs = require('fs');
let ts = fs.readFileSync('src/psychedelic-portal.ts', 'utf-8');

ts = ts.replace(
  /<span class="psy-fragment-title">\$\{htmlEscape\(report\.nav\)\}<\/span>/,
  `<div style="display: flex; flex-direction: column; width: 100%; align-items: center;">
        <span class="psy-fragment-title">\${htmlEscape(report.nav)}</span>
        <span class="psy-fragment-label" style="font-family: 'Pixelogist', monospace; font-size: clamp(8px, 1.2vw, 16px); letter-spacing: 0.3em; text-transform: uppercase; margin-top: 15px; white-space: nowrap;">\${htmlEscape(report.nav)}</span>
      </div>`
);

fs.writeFileSync('src/psychedelic-portal.ts', ts);

let css = fs.readFileSync('src/index.css', 'utf-8');
css = css.replace(/\.psy-fragment-title\s*\{[^}]+\}/, ".psy-fragment-title { font-family: 'BarcodeFont', monospace; font-size: clamp(40px, 11vw, 200px); white-space: nowrap; transform: scaleY(2.5); transform-origin: center; display: inline-block; letter-spacing: -2px; width: 100%; text-align: center; line-height: 1; }");
fs.writeFileSync('src/index.css', css);


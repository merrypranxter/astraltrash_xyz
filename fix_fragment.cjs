const fs = require('fs');
let css = fs.readFileSync('src/index.css', 'utf-8');

css = css.replace(/\.psy-fragment\s*\{[^}]*\}/, ".psy-fragment { display: flex; align-items: center; justify-content: center; gap: 10px; width: auto; min-height: 58px; padding: 8px 12px; overflow: visible; border: 0; background: transparent; color: rgba(255,255,255,.62); text-align: left; cursor: pointer; transition: color .2s ease, padding .25s ease; position: relative; }");

fs.writeFileSync('src/index.css', css);

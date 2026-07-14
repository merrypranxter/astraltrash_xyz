const fs = require('fs');
let css = fs.readFileSync('src/index.css', 'utf-8');

css = css.replace(/\.psy-fragments\s*\{\s*display:\s*flex;\s*flex-wrap:\s*nowrap;\s*justify-content:\s*center;\s*width:\s*100%;\s*gap:\s*0px;\s*align-items:\s*center;\s*position:\s*relative;\s*top:\s*auto;\s*overflow:\s*visible;\s*padding:\s*40px\s*0;\s*\}/, ".psy-fragments { display: flex; flex-wrap: nowrap; justify-content: center; width: 100%; gap: 0px; align-items: center; position: relative; top: auto; overflow: visible; padding: clamp(30px, 10vw, 150px) 0 20px; }");

fs.writeFileSync('src/index.css', css);

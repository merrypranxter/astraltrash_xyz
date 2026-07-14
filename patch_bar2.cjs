const fs = require('fs');
let css = fs.readFileSync('src/index.css', 'utf-8');

// Reduce hero min height so it's not so spread out
css = css.replace(/\.psy-hero\s*\{\s*min-height:\s*min\([^)]+\);/, ".psy-hero { min-height: 40vh;");

// In media queries too
css = css.replace(/\.psy-hero\s*\{\s*min-height:\s*67vh;\s*\}/, ".psy-hero { min-height: 35vh; }");
css = css.replace(/\.psy-hero\s*\{\s*min-height:\s*58vh;\s*\}/, ".psy-hero { min-height: 30vh; }");

// Barcode font scaling
css = css.replace(/\.psy-fragment-title\s*\{[^}]+\}/, ".psy-fragment-title { font-family: 'BarcodeFont', monospace; font-size: clamp(20px, 5vw, 150px); white-space: nowrap; transform: scaleY(3.5); transform-origin: center; display: inline-block; letter-spacing: -1px; width: 100%; text-align: center; }");

// Psy-fragment container and items to ensure they touch and span 100%
css = css.replace(/\.psy-fragments\s*\{\s*display:\s*flex;\s*flex-wrap:\s*nowrap;\s*justify-content:\s*space-between;\s*width:\s*100%;\s*gap:\s*0px;\s*align-items:\s*center;\s*position:\s*relative;\s*top:\s*auto;\s*\}/, ".psy-fragments { display: flex; flex-wrap: nowrap; justify-content: stretch; width: 100%; gap: 0px; align-items: center; position: relative; top: auto; overflow: hidden; padding: 20px 0; }");

css = css.replace(/\.psy-fragment\s*\{\s*flex:\s*1;\s*display:\s*flex;\s*align-items:\s*center;\s*justify-content:\s*center;\s*gap:\s*0px;\s*width:\s*100%;\s*min-height:\s*58px;\s*padding:\s*0px;\s*overflow:\s*hidden;\s*border:\s*0;\s*background:\s*transparent;\s*color:\s*rgba\(255,255,255,\.62\);\s*text-align:\s*center;\s*cursor:\s*pointer;\s*transition:\s*color\s*\.2s\s*ease,\s*padding\s*\.2s\s*ease;\s*position:\s*relative;\s*\}/, ".psy-fragment { flex: 1; display: flex; align-items: center; justify-content: center; gap: 0px; padding: 0px; overflow: visible; border: 0; background: transparent; color: rgba(255,255,255,.62); text-align: center; cursor: pointer; transition: color .2s ease; position: relative; }");

fs.writeFileSync('src/index.css', css);

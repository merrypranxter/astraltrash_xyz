const fs = require('fs');
let css = fs.readFileSync('src/index.css', 'utf-8');

// Change fragments container
css = css.replace(/\.psy-fragments\s*\{[^}]+\}/, ".psy-fragments { display: flex; flex-wrap: nowrap; justify-content: space-between; width: 100%; gap: 0px; align-items: center; position: relative; top: auto; }");

// Make them stretch
css = css.replace(/\.psy-fragment\s*\{[^}]+\}/, ".psy-fragment { flex: 1; display: flex; align-items: center; justify-content: center; gap: 0px; width: 100%; min-height: 58px; padding: 0px; overflow: hidden; border: 0; background: transparent; color: rgba(255,255,255,.62); text-align: center; cursor: pointer; transition: color .2s ease, padding .25s ease; position: relative; }");

// Increase font size and stretch
css = css.replace(/\.psy-fragment-title\s*\{[^}]+\}/, ".psy-fragment-title { font-family: 'BarcodeFont', monospace; font-size: clamp(30px, 9vw, 150px); white-space: nowrap; transform: scaleY(1.3); display: inline-block; }");

// Remove margins/paddings between top section, links, and bottom section
css = css.replace(/\.psy-stage\s*\{[^}]+\}/, ".psy-stage { display: flex; flex-direction: column; align-items: center; gap: 0px; margin: 0px 0 20px; width: 100%; max-width: 1400px; }");
css = css.replace(/\.psy-intro\s*\{[^}]+\}/, ".psy-intro { margin: 0px; position: relative; }");
css = css.replace(/padding:\s*10px\s*0\s*20px;/, "padding: 0px;");
css = css.replace(/\.psy-report\s*\{\s*position:\s*relative;\s*padding:\s*clamp\([^)]+\)\s*0;/, ".psy-report { position: relative; padding: clamp(10px, 2vw, 20px) 0;");

// Fix media query for flex wrap on fragments
css = css.replace(/\.psy-fragments\s*\{\s*display:\s*flex;\s*flex-wrap:\s*wrap;\s*justify-content:\s*space-between;\s*width:\s*100%;\s*gap:\s*5px;\s*\}/, ".psy-fragments { display: flex; flex-wrap: nowrap; justify-content: space-between; width: 100%; gap: 0px; }");

fs.writeFileSync('src/index.css', css);

const fs = require('fs');
let css = fs.readFileSync('src/index.css', 'utf-8');

// remove horizontal scroll media query for fragments to ensure they always wrap
css = css.replace(/\.psy-fragments\s*\{\s*position:\s*relative;\s*top:\s*auto;\s*display:\s*flex;\s*overflow-x:\s*auto;\s*padding-bottom:\s*8px;\s*scroll-snap-type:\s*x\s*mandatory;\s*\}/, ".psy-fragments { display: flex; flex-wrap: wrap; justify-content: space-between; width: 100%; gap: 5px; }");
css = css.replace(/\.psy-fragment\s*\{\s*min-width:\s*190px;\s*scroll-snap-align:\s*start;\s*\}/, ".psy-fragment { min-width: auto; scroll-snap-align: none; }");

fs.writeFileSync('src/index.css', css);

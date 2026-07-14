const fs = require('fs');
let css = fs.readFileSync('src/index.css', 'utf-8');

css = css.replace(/\.psy-fragments\s*\{\s*display:\s*flex;\s*flex-wrap:\s*nowrap;\s*justify-content:\s*stretch;\s*width:\s*100%;\s*gap:\s*0px;\s*align-items:\s*center;\s*position:\s*relative;\s*top:\s*auto;\s*overflow:\s*visible;\s*padding:\s*40px\s*0;\s*\}/, ".psy-fragments { display: flex; flex-wrap: nowrap; justify-content: center; width: 100%; gap: 0px; align-items: center; position: relative; top: auto; overflow: visible; padding: 40px 0; }");

css = css.replace(/\.psy-fragment\s*\{\s*flex:\s*1;\s*display:\s*flex;\s*align-items:\s*center;\s*justify-content:\s*center;\s*width:\s*100%;\s*min-height:\s*58px;\s*padding:\s*0px;\s*overflow:\s*visible;\s*border:\s*0;\s*background:\s*transparent;\s*color:\s*rgba\(255,255,255,\.62\);\s*text-align:\s*center;\s*cursor:\s*pointer;\s*transition:\s*color\s*\.2s\s*ease;\s*position:\s*relative;\s*\}/, ".psy-fragment { flex: 0 1 auto; display: flex; align-items: center; justify-content: center; width: auto; min-height: 58px; padding: 0px; overflow: visible; border: 0; background: transparent; color: rgba(255,255,255,.62); text-align: center; cursor: pointer; transition: color .2s ease; position: relative; }");

fs.writeFileSync('src/index.css', css);

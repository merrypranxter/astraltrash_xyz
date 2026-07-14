const fs = require('fs');
let css = fs.readFileSync('src/index.css', 'utf-8');

css = css.replace(/\.psy-fragment:nth-child\(5n \+ 1\)\s*\.psy-fragment-title\s*\{[^}]+\}/, ".psy-fragment:nth-child(5n + 1) { color: var(--psy-pink); text-shadow: 0 0 10px var(--psy-pink); }");
css = css.replace(/\.psy-fragment:nth-child\(5n \+ 2\)\s*\.psy-fragment-title\s*\{[^}]+\}/, ".psy-fragment:nth-child(5n + 2) { color: var(--psy-cyan); text-shadow: 0 0 10px var(--psy-cyan); }");
css = css.replace(/\.psy-fragment:nth-child\(5n \+ 3\)\s*\.psy-fragment-title\s*\{[^}]+\}/, ".psy-fragment:nth-child(5n + 3) { color: var(--psy-acid); text-shadow: 0 0 10px var(--psy-acid); }");
css = css.replace(/\.psy-fragment:nth-child\(5n \+ 4\)\s*\.psy-fragment-title\s*\{[^}]+\}/, ".psy-fragment:nth-child(5n + 4) { color: var(--psy-violet); text-shadow: 0 0 10px var(--psy-violet); }");
css = css.replace(/\.psy-fragment:nth-child\(5n \+ 5\)\s*\.psy-fragment-title\s*\{[^}]+\}/, ".psy-fragment:nth-child(5n + 5) { color: var(--psy-orange); text-shadow: 0 0 10px var(--psy-orange); }");

fs.writeFileSync('src/index.css', css);

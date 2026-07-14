const fs = require('fs');
let css = fs.readFileSync('src/index.css', 'utf-8');

css = css.replace(/\.psy-fragment\s*\{[^}]+\}/, ".psy-fragment { flex: 1; display: flex; align-items: center; justify-content: center; width: 100%; min-height: 58px; padding: 0px; overflow: visible; border: 0; background: transparent; color: rgba(255,255,255,.62); text-align: center; cursor: pointer; transition: color .2s ease; position: relative; }");

css = css.replace(/\.psy-fragment::before\s*\{[^}]+\}/, ".psy-fragment::before { display: none; }");

// Also reduce the space of the deck further, as requested.
css = css.replace(/\.psy-deck\s*\{[^}]+\}/, ".psy-deck { max-width: 850px; margin-top: 10px; font-family: 'Pixeland', sans-serif; font-size: clamp(2.4rem, 4.1vw, 3.4rem); margin-left: auto; margin-right: auto; text-align: center; line-height: 1.1; text-wrap: balance; color: #fff; text-shadow: 0 2px 18px rgba(0,0,0,.9); }");

fs.writeFileSync('src/index.css', css);

const fs = require('fs');
let css = fs.readFileSync('src/index.css', 'utf-8');

// center everything
css = css.replace(/\.psy-shell\s*\{/, ".psy-shell { text-align: center; display: flex; flex-direction: column; align-items: center; ");
css = css.replace(/(\.psy-deck\s*\{[^}]*font-size:\s*)clamp\([^)]+\);/, "$1clamp(2.4rem, 4.1vw, 3.4rem); margin-left: auto; margin-right: auto; text-align: center;");

// set psy-intro-copy text align
css = css.replace(/\.psy-intro-copy\s*\{/, ".psy-intro-copy { text-align: center; ");
css = css.replace(/\.psy-report-copy\s*\{/, ".psy-report-copy { text-align: center; margin-left: auto; margin-right: auto; ");
css = css.replace(/\.psy-report blockquote\s*\{/, ".psy-report blockquote { text-align: center; ");
css = css.replace(/\.psy-report h2\s*\{/, ".psy-report h2 { text-align: center; ");
css = css.replace(/\.psy-report-meta\s*\{/, ".psy-report-meta { text-align: center; ");


// change grid to centered stack
css = css.replace(/\.psy-stage\s*\{[^}]*\}/, ".psy-stage { display: flex; flex-direction: column; align-items: center; gap: clamp(24px, 5vw, 74px); margin: 30px 0 100px; width: 100%; max-width: 1200px; }");

css = css.replace(/\.psy-fragments\s*\{[^}]*\}/, ".psy-fragments { display: flex; flex-wrap: wrap; justify-content: center; gap: 20px; align-items: center; position: relative; top: auto; }");

css = css.replace(/\.psy-fragment\s*\{/, ".psy-fragment { display: flex; align-items: center; justify-content: center; gap: 10px; width: auto; ");

// make sure media queries don't break flex layouts
css = css.replace(/\.psy-fragments\s*\{\s*position:\s*relative;\s*top:\s*auto;\s*display:\s*flex;\s*overflow-x:\s*auto;\s*padding-bottom:\s*8px;\s*scroll-snap-type:\s*x\s*mandatory;\s*\}/, ".psy-fragments { position: relative; top: auto; display: flex; overflow-x: auto; padding-bottom: 8px; scroll-snap-type: x mandatory; }");
css = css.replace(/\.psy-fragment\s*\{\s*min-width:\s*190px;\s*scroll-snap-align:\s*start;\s*grid-template-columns:\s*28px\s*34px\s*1fr;\s*\}/, ".psy-fragment { min-width: 190px; scroll-snap-align: start; }");
css = css.replace(/\.psy-stage\s*\{\s*grid-template-columns:\s*1fr;\s*\}/, ".psy-stage { }");

fs.writeFileSync('src/index.css', css);

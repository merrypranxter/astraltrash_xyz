const fs = require('fs');
let css = fs.readFileSync('src/index.css', 'utf-8');

css = css.replace(/\.psy-fragment\s*\{\s*flex:\s*0\s*1\s*auto;/g, ".psy-fragment { flex: 1 1 auto;");

// and we remove width: 100% from .psy-fragment-title so it doesn't act weird, just lets flex handle it
css = css.replace(/width:\s*100%;\s*text-align:\s*center;\s*line-height:\s*1;\s*\}/g, "text-align: center; line-height: 1; }");

fs.writeFileSync('src/index.css', css);

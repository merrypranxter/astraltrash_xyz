const fs = require('fs');
let css = fs.readFileSync('src/index.css', 'utf-8');

css = css.replace(/\.psy-deck\s*\{\s*font-size:\s*1.4rem;\s*\}/, ".psy-deck { font-size: 1.6rem; }");
css = css.replace(/\.psy-report blockquote\s*\{\s*font-size:\s*2.3rem;\s*margin:\s*20px 5%;\s*\}/, ".psy-report blockquote { font-size: 1.6rem; margin: 20px 5%; }");

fs.writeFileSync('src/index.css', css);

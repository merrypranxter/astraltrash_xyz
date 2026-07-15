const fs = require('fs');
let code = fs.readFileSync('src/index.css', 'utf-8');

code = code.replace(
  'html{scroll-behavior:smooth; background:var(--void); overscroll-behavior-y: none;}',
  'html{scroll-behavior:smooth; background:var(--void); overscroll-behavior-y: none; min-height: 100vh;}'
);
code = code.replace(
  'body.light-theme {',
  'html.light-theme, body.light-theme {'
);
code = code.replace(
  'body{\n  background:var(--void);',
  'body{\n  background:var(--void);\n  min-height: 100vh;'
);

fs.writeFileSync('src/index.css', code);

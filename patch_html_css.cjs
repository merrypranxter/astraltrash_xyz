const fs = require('fs');
let code = fs.readFileSync('src/index.css', 'utf-8');

code = code.replace(
  'html{scroll-behavior:smooth}',
  'html{scroll-behavior:smooth; background:var(--void); overscroll-behavior-y: none;}'
);

fs.writeFileSync('src/index.css', code);

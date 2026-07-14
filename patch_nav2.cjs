const fs = require('fs');
let ts = fs.readFileSync('src/psychedelic-portal.ts', 'utf-8');

ts = ts.replace(
  /margin-top:\s*15px;/g,
  `margin-top: clamp(20px, 9vw, 120px);`
);

fs.writeFileSync('src/psychedelic-portal.ts', ts);

const fs = require('fs');
let ts = fs.readFileSync('src/psychedelic-portal.ts', 'utf-8');

ts = ts.replace(
  /nav:\s*'other',/,
  `nav: 'other debris',`
);

fs.writeFileSync('src/psychedelic-portal.ts', ts);

const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');
const idMatches = code.match(/id: '([^']+)'/g);
const ids = idMatches.map(m => m.match(/id: '([^']+)'/)[1]);
const duplicates = ids.filter((item, index) => ids.indexOf(item) !== index);
console.log("Duplicates in App.tsx ids:", duplicates);

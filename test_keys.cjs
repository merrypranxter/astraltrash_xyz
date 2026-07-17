const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');
const hasOldId = code.includes('const id = file.sha || fileName;');
console.log("Has old id?", hasOldId);

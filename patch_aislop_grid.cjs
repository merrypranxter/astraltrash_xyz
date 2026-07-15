const fs = require('fs');
let code = fs.readFileSync('src/components/AiSlop.tsx', 'utf-8');

code = code.replace(
  /border border-zinc-900 bg-\\[#050505\\] p-5 rounded-xl h-full flex flex-col/g,
  "h-full flex flex-col"
);

fs.writeFileSync('src/components/AiSlop.tsx', code);

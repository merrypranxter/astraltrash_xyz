const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');
code = code.replace(
  '<div className="animate-fade-in text-left">\n\n                </div>',
  '<div className="animate-fade-in text-left">\n                  <AstralAbout />\n                </div>'
);
fs.writeFileSync('src/App.tsx', code);

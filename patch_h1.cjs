const fs = require('fs');
let code = fs.readFileSync('src/index.css', 'utf-8');

if (!code.includes('.hero h1 {')) {
    code = code.replace(
      'h1{',
      '.hero h1 { width: fit-content; max-width: 100%; }\nh1{'
    );
    fs.writeFileSync('src/index.css', code);
}

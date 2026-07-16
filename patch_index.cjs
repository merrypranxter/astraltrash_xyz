const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf-8');
const scriptTag = `<script src="/tensor-tantrum.js?v=${Date.now()}" data-size="96" data-roam="true" data-side="right"></script>\n  </body>`;
html = html.replace('</body>', scriptTag);
fs.writeFileSync('index.html', html);

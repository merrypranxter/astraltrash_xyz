const fs = require('fs');
let code = fs.readFileSync('src/index.css', 'utf-8');

const fontsToAdd = `
@font-face { font-family: 'Pixelmania'; src: url('https://raw.githubusercontent.com/merrypranxter/astraltrash_site_support/main/assets/fonts/Pixelmania.woff2') format('woff2'); }
@font-face { font-family: 'Dogica Pixel'; src: url('https://raw.githubusercontent.com/merrypranxter/astraltrash_site_support/main/assets/fonts/dogicapixelbold.woff2') format('woff2'); }
@font-face { font-family: 'StarThings'; src: url('https://raw.githubusercontent.com/merrypranxter/astraltrash_site_support/main/assets/fonts/StarThings-DLZx.woff2') format('woff2'); }
@font-face { font-family: 'CircleThings2'; src: url('https://raw.githubusercontent.com/merrypranxter/astraltrash_site_support/main/assets/fonts/CircleThings2-ap6J.woff2') format('woff2'); }
@font-face { font-family: 'Slsquiggles'; src: url('https://raw.githubusercontent.com/merrypranxter/astraltrash_site_support/main/assets/fonts/Slsquiggles-RJ96.woff2') format('woff2'); }
`;

code = code.replace(
  /@font-face \{ font-family: 'VICTM___'; src: url\('https:\/\/raw\.githubusercontent\.com\/merrypranxter\/astraltrash_site_support\/main\/assets\/fonts\/VICTM___\.woff2'\) format\('woff2'\); \}/g,
  `@font-face { font-family: 'VICTM___'; src: url('https://raw.githubusercontent.com/merrypranxter/astraltrash_site_support/main/assets/fonts/VICTM___.woff2') format('woff2'); }${fontsToAdd}`
);

fs.writeFileSync('src/index.css', code);

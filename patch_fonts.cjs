const fs = require('fs');
let css = fs.readFileSync('src/index.css', 'utf-8');

const fonts = `
@font-face { font-family: 'Pixeland'; src: url('https://raw.githubusercontent.com/merrypranxter/astraltrash_site_support/main/assets/fonts/Pixeland.woff2') format('woff2'); }
@font-face { font-family: 'Pixelogist'; src: url('https://raw.githubusercontent.com/merrypranxter/astraltrash_site_support/main/assets/fonts/Pixelogist.woff2') format('woff2'); }
@font-face { font-family: 'BarcodeFont'; src: url('https://raw.githubusercontent.com/merrypranxter/astraltrash_site_support/main/assets/fonts/BarcodeFont.woff2') format('woff2'); }
@font-face { font-family: 'VICTM___'; src: url('https://raw.githubusercontent.com/merrypranxter/astraltrash_site_support/main/assets/fonts/VICTM___.woff2') format('woff2'); }
`;

css = css.replace(/@font-face { font-family: 'Computer 7'; [^}]+ }/, match => match + fonts);

css = css.replace(/(\.psy-deck\s*\{[^}]*font-family:\s*)'Early Quake'/, "$1'Pixeland'");
// Make the intro-copy body text way smaller and Pixelogist
css = css.replace(/(\.psy-intro-copy p\s*\{[^}]*font-family:\s*)'Gondens',\s*sans-serif;(\s*font-size:\s*)clamp\([^)]+\);/, "$1'Pixelogist', monospace;$2clamp(0.7rem, 1.1vw, 1.1rem);");

// .psy-fragment-title -> BarcodeFont
css = css.replace(/(\.psy-fragment-title\s*\{[^}]*font-family:\s*)'Copixel',\s*monospace;/, "$1'BarcodeFont', monospace;");
// it's Barcode so maybe make it a little larger?
css = css.replace(/(\.psy-fragment-title\s*\{[^}]*font-size:\s*)clamp\([^)]+\);/, "$1clamp(24px, 3vw, 36px);"); 

// .psy-report blockquote -> VICTM___ and make it fit on 2 lines
css = css.replace(/(\.psy-report blockquote\s*\{[^}]*font-family:\s*)'Cream Cake Bold',\s*sans-serif;(\s*font-size:\s*)clamp\([^)]+\);/, "$1'VICTM___', sans-serif;$2clamp(1.6rem, 2.5vw, 2.5rem);");

fs.writeFileSync('src/index.css', css);

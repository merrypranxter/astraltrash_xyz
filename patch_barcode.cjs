const fs = require('fs');
let css = fs.readFileSync('src/index.css', 'utf-8');

// reduce margin in psy-intro
css = css.replace(/\.psy-intro\s*\{\s*margin:\s*0\s*0\s*90px;/, ".psy-intro { margin: 0 0 20px;");

// reduce padding in psy-intro-copy
css = css.replace(/padding:\s*20px\s*0\s*54px;/, "padding: 10px 0 20px;");

// reduce gap and margin in psy-stage
css = css.replace(/\.psy-stage\s*\{\s*display:\s*flex;\s*flex-direction:\s*column;\s*align-items:\s*center;\s*gap:\s*clamp\([^)]+\);\s*margin:\s*30px\s*0\s*100px;/, ".psy-stage { display: flex; flex-direction: column; align-items: center; gap: clamp(10px, 2vw, 24px); margin: 10px 0 40px;");

// stretch fragments and reduce gap
css = css.replace(/\.psy-fragments\s*\{\s*display:\s*flex;\s*flex-wrap:\s*wrap;\s*justify-content:\s*center;\s*gap:\s*20px;/, ".psy-fragments { display: flex; flex-wrap: wrap; justify-content: space-between; width: 100%; gap: 5px;");

// increase font size for barcode
css = css.replace(/\.psy-fragment-title\s*\{\s*font-family:\s*'BarcodeFont',\s*monospace;\s*font-size:\s*clamp\([^)]+\);/, ".psy-fragment-title { font-family: 'BarcodeFont', monospace; font-size: clamp(40px, 7vw, 90px);");

// modify fragment padding
css = css.replace(/padding:\s*8px\s*12px;/, "padding: 4px 8px;");

// Add colors for titles
const colors = `
.psy-fragment:nth-child(5n + 1) .psy-fragment-title { color: var(--psy-pink); text-shadow: 0 0 10px var(--psy-pink); }
.psy-fragment:nth-child(5n + 2) .psy-fragment-title { color: var(--psy-cyan); text-shadow: 0 0 10px var(--psy-cyan); }
.psy-fragment:nth-child(5n + 3) .psy-fragment-title { color: var(--psy-acid); text-shadow: 0 0 10px var(--psy-acid); }
.psy-fragment:nth-child(5n + 4) .psy-fragment-title { color: var(--psy-violet); text-shadow: 0 0 10px var(--psy-violet); }
.psy-fragment:nth-child(5n + 5) .psy-fragment-title { color: var(--psy-orange); text-shadow: 0 0 10px var(--psy-orange); }
`;
css = css.replace(/\.psy-fragment-title\s*\{[^}]+\}/, match => match + colors);

fs.writeFileSync('src/index.css', css);

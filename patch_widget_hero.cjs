const fs = require('fs');
let code = fs.readFileSync('public/neon-gremlin-widget-v3.js', 'utf-8');

code = code.replace(
  /function findHomeHero\(\) \{[\s\S]*?return title \|\| null;\n  \}/,
  `function findHomeHero() {
    const title = [...document.querySelectorAll("h1")].find((heading) =>
      heading.textContent?.replace(/\\s/g, "") === "AstralTrash"
    );
    return title ? title.closest('.hero') || title.parentElement : null;
  }`
);

fs.writeFileSync('public/neon-gremlin-widget-v3.js', code);

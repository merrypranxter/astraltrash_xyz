const fs = require('fs');
let code = fs.readFileSync('public/neon-gremlin-widget.js', 'utf-8');

const observerReplacement = `    observer = new MutationObserver(schedulePlacement);
    observer.observe(document.querySelector("#root") || document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['class', 'style']
    });`;

code = code.replace(
  /observer\.observe\(document\.querySelector\("\#root"\) \|\| document\.body, \{[\s\S]*?\}\);/,
  observerReplacement
);

fs.writeFileSync('public/neon-gremlin-widget.js', code);

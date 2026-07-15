const fs = require('fs');
let code = fs.readFileSync('public/neon-gremlin-widget.js', 'utf-8');

const positionLogic = `    const bootScreen = document.getElementById('boot');
    if (bootScreen && !bootScreen.classList.contains('done')) {
      canvas.style.display = "none";
      return;
    }`;

// Ensure we only check for booting, and make sure we wait for it to be completely gone
const newPositionLogic = `    const bootScreen = document.getElementById('boot');
    if (bootScreen) {
      canvas.style.display = "none";
      // schedule another check in a moment since boot is still active
      setTimeout(schedulePlacement, 200);
      return;
    }`;

code = code.replace(
  /const bootScreen = document\.getElementById\('boot'\);\n\s+if \(bootScreen && !bootScreen\.classList\.contains\('done'\)\) \{\n\s+canvas\.style\.display = "none";\n\s+return;\n\s+\}/,
  newPositionLogic
);

fs.writeFileSync('public/neon-gremlin-widget.js', code);

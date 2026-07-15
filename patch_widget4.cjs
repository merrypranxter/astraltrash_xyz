const fs = require('fs');
let code = fs.readFileSync('public/neon-gremlin-widget.js', 'utf-8');

const positionLogic = `    const heroRect = homeHero.getBoundingClientRect();
    const isMobile = window.innerWidth < 768;
    cssScale = isMobile ? 1 : preferredScale;
    
    canvas.style.position = "absolute";
    
    let leftPos = heroRect.right + window.scrollX + (isMobile ? 10 : 20);
    const topPos = heroRect.bottom + window.scrollY - (H * cssScale) + (isMobile ? 10 : 15);
    
    // Ensure it doesn't overflow the right edge of the screen
    if (leftPos + (W * cssScale) > window.innerWidth) {
      leftPos = window.innerWidth - (W * cssScale) - 10;
    }
    
    canvas.style.left = Math.round(leftPos) + "px";
    canvas.style.top = Math.round(topPos) + "px";`;

code = code.replace(
  /const heroRect = homeHero\.getBoundingClientRect\(\);[\s\S]*?canvas\.style\.top = Math\.round\(heroRect\.bottom \+ window\.scrollY - \(H \* cssScale\) \+ 20\) \+ "px";\n    \}/,
  positionLogic
);

fs.writeFileSync('public/neon-gremlin-widget.js', code);

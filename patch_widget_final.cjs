const fs = require('fs');
let code = fs.readFileSync('public/neon-gremlin-widget.js', 'utf-8');

const positionLogic = `    const heroRect = homeHero.getBoundingClientRect();
    const isMobile = window.innerWidth < 768;
    
    // Scale matching the red box proportion (smaller than 2.1)
    cssScale = isMobile ? 1.2 : 1.7;
    
    canvas.style.position = "absolute";
    
    const subElement = homeHero.querySelector('.sub');
    let topPos = 0;
    
    if (subElement && !isMobile) {
      const subRect = subElement.getBoundingClientRect();
      // Feet right on the very surface of the translucent black box
      topPos = subRect.top + window.scrollY - (H * cssScale);
    } else {
      topPos = heroRect.bottom + window.scrollY - (H * cssScale) + (isMobile ? 10 : 15);
    }
    
    const h1Element = homeHero.querySelector('h1');
    let leftPos = 0;
    
    if (h1Element && !isMobile) {
       const h1Rect = h1Element.getBoundingClientRect();
       // Right next to AstralTrash text, not overlapping it!
       leftPos = h1Rect.right + window.scrollX + 12;
    } else if (subElement && isMobile) {
       leftPos = subElement.getBoundingClientRect().right + window.scrollX - (W * cssScale) - 10;
    } else {
       leftPos = heroRect.right + window.scrollX - (W * cssScale) - 10;
    }
    
    // Bounds check
    if (leftPos + (W * cssScale) > window.innerWidth) {
      leftPos = window.innerWidth - (W * cssScale) - 10;
    }
    if (leftPos < 0) leftPos = 10;
    
    canvas.style.left = Math.round(leftPos) + "px";
    canvas.style.top = Math.round(topPos) + "px";`;

code = code.replace(
  /const heroRect = homeHero\.getBoundingClientRect\(\);[\s\S]*?canvas\.style\.top = Math\.round\(topPos\) \+ "px";/,
  positionLogic
);

fs.writeFileSync('public/neon-gremlin-widget.js', code);

const fs = require('fs');
let code = fs.readFileSync('public/neon-gremlin-widget.js', 'utf-8');

const positionLogic = `    const heroRect = homeHero.getBoundingClientRect();
    const isMobile = window.innerWidth < 768;
    
    // Scale matching the red box proportion
    cssScale = isMobile ? 1.2 : 1.6;
    
    canvas.style.position = "absolute";
    
    const subElement = homeHero.querySelector('.sub');
    const h1Element = homeHero.querySelector('h1');
    let topPos = 0;
    let leftPos = 0;
    
    if (subElement && !isMobile) {
      const subRect = subElement.getBoundingClientRect();
      // Feet right on the very surface of the translucent black box
      topPos = subRect.top + window.scrollY - (H * cssScale) + 12;
      
      if (h1Element) {
         const h1Rect = h1Element.getBoundingClientRect();
         // Far right of the h1 element!
         leftPos = h1Rect.right + window.scrollX + 45;
      } else {
         leftPos = subRect.left + window.scrollX + 400; // Fallback
      }
    } else {
      topPos = heroRect.bottom + window.scrollY - (H * cssScale) + (isMobile ? 10 : 15);
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

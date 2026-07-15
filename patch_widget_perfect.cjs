const fs = require('fs');
let code = fs.readFileSync('public/neon-gremlin-widget-v3.js', 'utf-8');

const positionLogic = `    const isMobile = window.innerWidth < 768;
    
    // Scale matching the red box proportion
    cssScale = isMobile ? 1.2 : 1.6;
    
    canvas.style.position = "absolute";
    
    const subElement = homeHero.querySelector('.sub');
    const h1Element = homeHero.querySelector('h1');
    let topPos = 0;
    let leftPos = 0;
    
    if (subElement && h1Element && !isMobile) {
      const subRect = subElement.getBoundingClientRect();
      const h1Rect = h1Element.getBoundingClientRect();
      
      // Feet right on the very surface of the translucent black box
      topPos = subRect.top + window.scrollY - (H * cssScale) + 12;
      
      // The user wants her FARTHER RIGHT. 
      // In the screenshot, she is basically aligned to the right edge of the .sub box!
      leftPos = subRect.right + window.scrollX - (W * cssScale);
      
      // Make absolutely sure she's to the right of the h1 text
      const minLeft = h1Rect.right + window.scrollX + 25;
      if (leftPos < minLeft) {
         leftPos = minLeft;
      }
      
    } else if (subElement && isMobile) {
      const subRect = subElement.getBoundingClientRect();
      topPos = subRect.top + window.scrollY - (H * cssScale) + 8;
      leftPos = subRect.right + window.scrollX - (W * cssScale) - 10;
    } else {
      const heroRect = homeHero.getBoundingClientRect();
      topPos = heroRect.bottom + window.scrollY - (H * cssScale) + (isMobile ? 10 : 15);
      leftPos = heroRect.right + window.scrollX - (W * cssScale) - 10;
    }
    
    // Bounds check
    let maxLeft = window.innerWidth - (W * cssScale) - 10;
    
    if (h1Element && !isMobile) {
        const h1Rect = h1Element.getBoundingClientRect();
        const minLeft = h1Rect.right + window.scrollX + 25;
        if (maxLeft < minLeft) {
            maxLeft = minLeft; 
        }
    }
    
    if (leftPos > maxLeft) {
      leftPos = maxLeft;
    }
    
    if (leftPos < 0) leftPos = 10;
    
    canvas.style.left = Math.round(leftPos) + "px";
    canvas.style.top = Math.round(topPos) + "px";`;

code = code.replace(
  /const heroRect = homeHero\.getBoundingClientRect\(\);[\s\S]*?canvas\.style\.top = Math\.round\(topPos\) \+ "px";/,
  positionLogic
);

fs.writeFileSync('public/neon-gremlin-widget-v3.js', code);

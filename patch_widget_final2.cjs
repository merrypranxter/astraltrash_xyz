const fs = require('fs');
let code = fs.readFileSync('public/neon-gremlin-widget.js', 'utf-8');

const positionLogic = `    const heroRect = homeHero.getBoundingClientRect();
    const isMobile = window.innerWidth < 768;
    
    // Scale matching the red box proportion (a tad smaller than 1.7)
    cssScale = isMobile ? 1.2 : 1.55;
    
    canvas.style.position = "absolute";
    
    const subElement = homeHero.querySelector('.sub');
    let topPos = 0;
    
    if (subElement && !isMobile) {
      const subRect = subElement.getBoundingClientRect();
      // Feet right on the very surface of the translucent black box + a wee bit lower (to account for sprite padding)
      topPos = subRect.top + window.scrollY - (H * cssScale) + 12;
    } else {
      topPos = heroRect.bottom + window.scrollY - (H * cssScale) + (isMobile ? 10 : 15);
    }
    
    const h1Element = homeHero.querySelector('h1');
    let leftPos = 0;
    
    if (h1Element && !isMobile) {
       const h1Rect = h1Element.getBoundingClientRect();
       // Right next to AstralTrash text, not overlapping it! Push it a bit further right.
       leftPos = h1Rect.right + window.scrollX + 25;
       
       // If it hits the right edge of the window, let's make sure it doesn't get pushed back over the h1
       if (leftPos + (W * cssScale) > window.innerWidth) {
         leftPos = Math.max(h1Rect.right + window.scrollX + 5, window.innerWidth - (W * cssScale) - 5);
       }
    } else if (subElement && isMobile) {
       leftPos = subElement.getBoundingClientRect().right + window.scrollX - (W * cssScale) - 10;
    } else {
       leftPos = heroRect.right + window.scrollX - (W * cssScale) - 10;
    }
    
    // Fallback bounds check for left edge
    if (leftPos < 0) leftPos = 10;
    
    canvas.style.left = Math.round(leftPos) + "px";
    canvas.style.top = Math.round(topPos) + "px";`;

code = code.replace(
  /const heroRect = homeHero\.getBoundingClientRect\(\);[\s\S]*?canvas\.style\.top = Math\.round\(topPos\) \+ "px";/,
  positionLogic
);

fs.writeFileSync('public/neon-gremlin-widget.js', code);

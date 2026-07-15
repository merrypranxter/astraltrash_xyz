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
      
      // Let's place her aligned to the RIGHT edge of the .sub box. 
      leftPos = subRect.right + window.scrollX - (W * cssScale) - 10;
      
      // CRITICAL: Make absolutely sure she doesn't overlap the h1 text
      if (h1Element) {
        const h1Rect = h1Element.getBoundingClientRect();
        // Give a healthy 30px margin to the right of the h1
        const minLeft = h1Rect.right + window.scrollX + 30;
        if (leftPos < minLeft) {
           leftPos = minLeft;
        }
      }
    } else {
      topPos = heroRect.bottom + window.scrollY - (H * cssScale) + (isMobile ? 10 : 15);
      leftPos = heroRect.right + window.scrollX - (W * cssScale) - 10;
    }
    
    // Bounds check - BUT NEVER push her left of the minLeft we just calculated
    let maxLeft = window.innerWidth - (W * cssScale) - 10;
    
    if (h1Element && !isMobile) {
        const h1Rect = h1Element.getBoundingClientRect();
        const minLeft = h1Rect.right + window.scrollX + 30;
        if (maxLeft < minLeft) {
            // Screen is too narrow to fit her without overlapping the h1.
            // Let her overflow the right side of the screen rather than overlapping the text!
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

fs.writeFileSync('public/neon-gremlin-widget.js', code);

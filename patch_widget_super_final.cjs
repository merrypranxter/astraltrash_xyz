const fs = require('fs');
let code = fs.readFileSync('public/neon-gremlin-widget.js', 'utf-8');

const positionLogic = `    const heroRect = homeHero.getBoundingClientRect();
    const isMobile = window.innerWidth < 768;
    
    // Scale matching the red box proportion
    cssScale = isMobile ? 1.2 : 1.55;
    
    canvas.style.position = "absolute";
    
    const subElement = homeHero.querySelector('.sub');
    let topPos = 0;
    let leftPos = 0;
    
    if (subElement) {
      const subRect = subElement.getBoundingClientRect();
      
      if (!isMobile) {
        // Feet right on the very surface of the translucent black box
        topPos = subRect.top + window.scrollY - (H * cssScale) + 12;
        
        // Align right edge of the canvas exactly with the right edge of the .sub box
        leftPos = subRect.right + window.scrollX - (W * cssScale);
      } else {
        topPos = subRect.top + window.scrollY - (H * cssScale) + 8;
        leftPos = subRect.right + window.scrollX - (W * cssScale) - 10;
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

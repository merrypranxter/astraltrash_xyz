const fs = require('fs');
let code = fs.readFileSync('public/neon-gremlin-widget.js', 'utf-8');

const positionLogic = `    const heroRect = homeHero.getBoundingClientRect();
    const isMobile = window.innerWidth < 768;
    
    // Make her bigger on desktop
    cssScale = isMobile ? 1 : Math.max(1.5, preferredScale * 1.5);
    
    canvas.style.position = "absolute";
    
    // Find the '.sub' element (the black box) inside the hero to align her feet
    const subElement = homeHero.querySelector('.sub');
    let topPos = 0;
    
    if (subElement && !isMobile) {
      const subRect = subElement.getBoundingClientRect();
      // Her feet (bottom of canvas) should touch the top of the .sub element
      topPos = subRect.top + window.scrollY - (H * cssScale);
    } else {
      // Fallback
      topPos = heroRect.bottom + window.scrollY - (H * cssScale) + (isMobile ? 10 : 15);
    }
    
    // Position her to the right of the h1 (AstralTrash)
    const h1Element = homeHero.querySelector('h1');
    let leftPos = 0;
    
    if (h1Element && !isMobile) {
       const h1Rect = h1Element.getBoundingClientRect();
       leftPos = h1Rect.right + window.scrollX + 10;
    } else {
       leftPos = heroRect.right + window.scrollX + (isMobile ? 10 : 20);
    }
    
    // Ensure it doesn't overflow the right edge of the screen
    if (leftPos + (W * cssScale) > window.innerWidth) {
      leftPos = window.innerWidth - (W * cssScale) - 10;
    }
    
    canvas.style.left = Math.round(leftPos) + "px";
    canvas.style.top = Math.round(topPos) + "px";`;

code = code.replace(
  /const heroRect = homeHero\.getBoundingClientRect\(\);[\s\S]*?canvas\.style\.top = Math\.round\(topPos\) \+ "px";/,
  positionLogic
);

fs.writeFileSync('public/neon-gremlin-widget.js', code);

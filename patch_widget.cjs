const fs = require('fs');
let code = fs.readFileSync('public/neon-gremlin-widget.js', 'utf-8');

const findHomeHeroReplacement = `  function findHomeHero() {
    const title = [...document.querySelectorAll("h1")].find((heading) =>
      heading.textContent?.replace(/\\s/g, "") === "AstralTrash"
    );
    return title || null;
  }`;

code = code.replace(
  /function findHomeHero\(\) \{[\s\S]*?return[^\}]+}/,
  findHomeHeroReplacement
);

const placeSpriteReplacement = `  function placeSprite() {
    placementQueued = false;

    if (demoMode) {
      if (canvas.parentElement !== document.body) document.body.appendChild(canvas);
      cssScale = preferredScale;
      canvas.style.position = "fixed";
      canvas.style.left = "12px";
      canvas.style.right = "auto";
      canvas.style.top = "auto";
      canvas.style.bottom = "8px";
      canvas.style.zIndex = "2147483000";
      canvas.style.display = "block";
      canvas.style.width = W * cssScale + "px";
      canvas.style.height = H * cssScale + "px";
      return;
    }

    const bootScreen = document.getElementById('boot');
    if (bootScreen && !bootScreen.classList.contains('done')) {
      canvas.style.display = "none";
      return;
    }

    const nextHero = findHomeHero();
    if (!nextHero) {
      homeHero = null;
      canvas.style.display = "none";
      return;
    }

    homeHero = nextHero;
    if (canvas.parentElement !== document.body) document.body.appendChild(canvas);

    const heroRect = homeHero.getBoundingClientRect();
    const isMobile = window.innerWidth < 768;
    cssScale = isMobile ? 1 : preferredScale;
    
    canvas.style.position = "absolute";
    
    if (isMobile) {
      canvas.style.left = Math.round(heroRect.right + window.scrollX - (W * cssScale) - 10) + "px";
      canvas.style.top = Math.round(heroRect.bottom + window.scrollY - (H * cssScale) + 30) + "px";
    } else {
      canvas.style.left = Math.round(heroRect.right + window.scrollX + 20) + "px";
      canvas.style.top = Math.round(heroRect.bottom + window.scrollY - (H * cssScale) + 20) + "px";
    }
    
    canvas.style.bottom = "auto";
    canvas.style.right = "auto";
    canvas.style.zIndex = "2147483000";
    canvas.style.display = "block";
    canvas.style.width = W * cssScale + "px";
    canvas.style.height = H * cssScale + "px";
  }`;

code = code.replace(
  /function placeSprite\(\) \{[\s\S]*?canvas\.style\.height = H \* cssScale \+ "px";\n  }/,
  placeSpriteReplacement
);

fs.writeFileSync('public/neon-gremlin-widget.js', code);

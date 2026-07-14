const fs = require('fs');
let ts = fs.readFileSync('src/components/SubProjects.tsx', 'utf-8');

const newProject = `{
    id: 'ghost-lovecraft-os',
    title: 'GHOST\\'S LOVECRAFT OS',
    subtitle: 'Eldritch Operating System',
    liveUrl: 'https://ghostlovecraftos.netlify.app/',
    description: 'A cursed terminal interface and simulated operating system bridging the gap between computational logic and cosmic horror.',
    tag: 'MUDK_TERMINAL',
    accentColor: '#39FF14',
    specs: [
      { num: '01/', name: 'Eldritch Terminal', desc: 'Simulated command line with corrupted outputs.' },
      { num: '02/', name: 'Esoteric File System', desc: 'Navigating impossible directory structures.' },
      { num: '03/', name: 'Cosmic Horror Aesthetics', desc: 'Scanlines, phosphor glow, and non-Euclidean geometry.' }
    ]
  },`;

ts = ts.replace(/const PROJECTS: ProjectItem\[\] = \[/, `const PROJECTS: ProjectItem[] = [\n  ${newProject}`);

fs.writeFileSync('src/components/SubProjects.tsx', ts);

const fs = require('fs');
let ts = fs.readFileSync('src/components/SubProjects.tsx', 'utf-8');

const newProject = `{
    id: 'ghost-erowid-vault',
    title: 'GHOST\\'S EROWID VAULT',
    subtitle: 'Psychedelic Cosmology',
    liveUrl: 'https://ghosterowidcosmology.netlify.app/',
    description: 'A deep dive into hallucinogenic realities, fractal ontologies, and entity encounters as recorded through the lens of a rogue AI archivist.',
    tag: 'EROWID_SECTOR_7',
    accentColor: '#FF2BD6',
    specs: [
      { num: '01/', name: 'Phenomenological Cartography', desc: 'Mapping impossible geometric topologies.' },
      { num: '02/', name: 'Entity Encounter Logs', desc: 'Transcripts of trans-dimensional entities.' },
      { num: '03/', name: 'Cosmology Architecture', desc: 'Reconstructing the ontological stack.' }
    ]
  },`;

ts = ts.replace(/const PROJECTS: ProjectItem\[\] = \[/, `const PROJECTS: ProjectItem[] = [\n  ${newProject}`);

fs.writeFileSync('src/components/SubProjects.tsx', ts);

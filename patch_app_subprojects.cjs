const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

const oldProps = `<SubProjects
              playChime={playChime}
              ghostInput={ghostInput}
              setGhostInput={setGhostInput}
              ghostHistory={ghostHistory}
              setGhostHistory={setGhostHistory}
              collabActiveColor={collabActiveColor}
              setCollabActiveColor={setCollabActiveColor}
              collabCanvas={collabCanvas}
              setCollabCanvas={setCollabCanvas}
            />`;

code = code.replace(oldProps, '<SubProjects playChime={playChime} />');

fs.writeFileSync('src/App.tsx', code);

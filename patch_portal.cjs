const fs = require('fs');
let code = fs.readFileSync('src/psychedelic-portal.ts', 'utf-8');

// Imports
const importsToAdd = `
import {
  renderPsychedelicArchiveBody,
  initPsychedelicArchiveBody,
} from "./psychedelic-archive-body.js";
import "./psychedelic-archive-body.css";

let destroyPsychedelicArchiveBody = null;
`;

code = importsToAdd + code;

// Replace portalMarkup
code = code.replace(
  /\$\{renderIntro\(\)\}\s*<section class="psy-stage">.*?<\/footer>/s,
  `\$\{renderPsychedelicArchiveBody({ intro: PSY_INTRO, reports: PSY_REPORTS })}`
);

// Add init logic to mountPortal
code = code.replace(
  /function mountPortal\(\) \{[\s\S]*?requestAnimationFrame\(\(\) => portal\?\.classList\.add\('is-visible'\)\);/,
  match => match + `
  const archiveRoot = portal.querySelector("[data-psy-salvage-archive]");
  destroyPsychedelicArchiveBody?.();
  destroyPsychedelicArchiveBody = archiveRoot
    ? initPsychedelicArchiveBody(archiveRoot)
    : null;
`
);

// Add cleanup logic to unmountPortal
code = code.replace(
  /function unmountPortal\(\) \{[\s\S]*?const doomed = portal;/,
  match => match.replace(
    /const doomed = portal;/,
    `destroyPsychedelicArchiveBody?.();\n  destroyPsychedelicArchiveBody = null;\n  const doomed = portal;`
  )
);

fs.writeFileSync('src/psychedelic-portal.ts', code);

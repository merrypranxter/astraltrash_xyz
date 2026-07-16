const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

code = code.replace(
  /<button \n              onClick=\{\(\) => \{ setActiveTab\('hub'\);/g,
  '<button data-tensor-action="teleport"\n              onClick={() => { setActiveTab(\'hub\');'
);

code = code.replace(
  /<button \n              onClick=\{\(\) => \{ setActiveTab\('shaderslop'\);/g,
  '<button data-tensor-action="flip"\n              onClick={() => { setActiveTab(\'shaderslop\');'
);

code = code.replace(
  /<button \n              onClick=\{\(\) => \{ setActiveTab\('aislop'\);/g,
  '<button data-tensor-action="hack"\n              onClick={() => { setActiveTab(\'aislop\');'
);

code = code.replace(
  /<button \n              onClick=\{\(\) => \{ setActiveTab\('karaoke'\);/g,
  '<button data-tensor-action="tantrum"\n              onClick={() => { setActiveTab(\'karaoke\');'
);

code = code.replace(
  /<button \n              onClick=\{\(\) => \{ setActiveTab\('projects'\);/g,
  '<button data-tensor-action="surf"\n              onClick={() => { setActiveTab(\'projects\');'
);

code = code.replace(
  /<button \n              onClick=\{\(\) => \{ setActiveTab\('about'\);/g,
  '<button data-tensor-action="celebrate"\n              onClick={() => { setActiveTab(\'about\');'
);

fs.writeFileSync('src/App.tsx', code);

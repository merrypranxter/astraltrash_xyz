const fs = require('fs');
let ts = fs.readFileSync('src/psychedelic-portal.ts', 'utf-8');

const tableHTML = `
        <h3 style="color: var(--psy-acid); margin-top: 40px; font-family: 'Pixelogist', monospace; font-size: 24px; text-transform: uppercase;">// PHENOMENAL QUALITIES & HIGHER DIMENSIONS</h3>
        <div class="tetra-table-wrapper">
          <table class="tetra-table">
            <thead>
              <tr>
                <th>OBJECT / PHENOMENON</th>
                <th>DIMENSIONALITY</th>
                <th>KEY PROPERTIES</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Tetragrammaton / Pentagrammaton Shape</td>
                <td>1D to 4D (Unified)</td>
                <td>Precision, co-originality, kosmic geometrism, '3D faces', interlocking field, recursive</td>
              </tr>
              <tr>
                <td>Hypercube (Tesseract)</td>
                <td>4D</td>
                <td>Extension in a fourth direction, incommensurability with 3D, 8 cubic cells, 24 square faces</td>
              </tr>
              <tr>
                <td>Color Experiences</td>
                <td>3D to 4D</td>
                <td>Hue, Saturation, Brightness, precision, similarity, fractal-like spirals</td>
              </tr>
              <tr>
                <td>DMT-induced Visuals</td>
                <td>4D / Hyperbolic</td>
                <td>Ineffability, negative curvature, self-transforming, information density</td>
              </tr>
              <tr>
                <td>Space-Mind</td>
                <td>Transfinite</td>
                <td>Omniscience, "At-one-ment", identity with space, reconciliation of opposites</td>
              </tr>
              <tr>
                <td>Linga Sharira (Time-body)</td>
                <td>4D</td>
                <td>Constancy amid physical change; form of the human body stretched from birth to death</td>
              </tr>
              <tr>
                <td>Quantum Wavefunction</td>
                <td>5D (3 real + 2 imaginary)</td>
                <td>Non-locality, entanglement, complex phase</td>
              </tr>
            </tbody>
          </table>
        </div>
`;

// Insert it right after the tetra-terminal
ts = ts.replace(/<\/div>\s*<\/div>\s*<\/div>\s*`;\s*}\s*return `/g, `</div></div>\${tableHTML}</div>\`; } return \``);
fs.writeFileSync('src/psychedelic-portal.ts', ts);

let css = fs.readFileSync('src/index.css', 'utf-8');
const tableCss = `
.tetra-table-wrapper {
  width: 100%;
  overflow-x: auto;
  margin-top: 20px;
  border: 1px solid var(--psy-acid);
  background: rgba(0,0,0,0.4);
}

.tetra-table {
  width: 100%;
  border-collapse: collapse;
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.8);
  text-align: left;
}

.tetra-table th {
  background: var(--psy-acid);
  color: #000;
  font-family: 'Computer 7', monospace;
  padding: 10px 15px;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.tetra-table td {
  padding: 12px 15px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.tetra-table tbody tr:hover {
  background: rgba(255, 255, 255, 0.05);
}

.tetra-table td:first-child {
  color: var(--psy-acid);
  font-weight: bold;
}
`;
css += tableCss;
fs.writeFileSync('src/index.css', css);

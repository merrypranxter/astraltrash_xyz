const fs = require('fs');
let ts = fs.readFileSync('src/psychedelic-portal.ts', 'utf-8');

const newRenderReport = `
function renderReport() {
  const report = PSY_REPORTS[activeReport];
  let extraHTML = '';
  
  if (activeReport === 0) { // my tetragrammaton
    extraHTML = \`
      <div class="tetra-data-container">
        <h3 style="color: var(--psy-cyan); margin-top: 40px; font-family: 'Pixelogist', monospace; font-size: 24px; text-transform: uppercase;">// EXTRACTED DATABANKS</h3>
        
        <div class="tetra-grid">
          <div class="tetra-card">
            <h4>TESSERACT_CONSCIOUSNESS.PDF</h4>
            <p>Access the original research document outlining the 4D topological bridge between Euclidean constraints and higher-order perception.</p>
            <a href="https://raw.githubusercontent.com/merrypranxter/astraltrash_site_support/main/public/psychedelic_page/tetragrammaton_section/info/Tesseract_Consciousness.pdf" target="_blank" class="tetra-btn">INITIATE DOWNLOAD</a>
          </div>

          <div class="tetra-card">
            <h4>GCS://MEDIA_CACHE</h4>
            <p>Raw media fragments recovered from the Tetragrammaton encounter.</p>
            <a href="https://console.cloud.google.com/storage/browser/astraltrash_other/psychedelic/tetratrammaton/media" target="_blank" class="tetra-btn">ACCESS BUCKET</a>
          </div>
        </div>

        <div class="tetra-terminal">
          <div class="tetra-terminal-header">
            <span>STRUCTURAL_ANALYSIS.TXT</span>
          </div>
          <div class="tetra-terminal-body">
The Tetragrammaton Geometry: A Multidimensional Structural Analysis

1. Dimensional Genesis: Extending the Euclidean Manifold
The "Tetragrammaton shape"—mathematically defined as the four-dimensional tesseract—functions as a rigorous topological bridge between the constraints of Euclidean physics and the expansive potential of higher-order perception. To inhabit a three-dimensional manifold is to be limited by the "three perpendiculars." However, modern neuro-phenomenology asserts that moving beyond these triadic axes is the necessary evolutionary step for human cognition. We must transition from mere 3D orientation toward a quartic understanding of the universe.

The "Extrusion Process" provides the mathematical blueprint for this genesis. By moving a point (0D) into a direction it does not contain, we generate a line (1D); repeating this orthogonally produces a square (2D), then a cube (3D). The Tetragrammaton arises when the cube is extruded into a fourth spatial direction—the W-axis—perpendicular to all three existing axes. To visualize this, we employ the "Deck of Cards" model: just as a 3D volume is a stack of 2D planes, the tesseract is a continuum of 3D "hyperplanes" or "three-planes" stacked along the W-axis. This creates a "hyper-area" measured in quartic units. Crucially, from the vantage point of the fourth dimension, a solid 3D cube appears "perfectly flat," possessing zero extent along the hyper-axis.

Grounding this in physical reality, we follow Ouspensky’s postulation: the "material atom" is not a 3D sphere, but rather the 3D cross-section of a four-dimensional line. Our physical world is a narrow slice of a higher-dimensional totality, a fact that our nervous system is only beginning to apprehend as it translates abstract geometry into felt experience.

2. The Phenomenology of the "Impossible": The Reality Switch Hypothesis
The transition from a 3D to a 4D cognitive framework is best analyzed via the Reality Switch Hypothesis. As neurobiologist Andrew Gallimore suggests, the brain typically acts as a tuning device locked into "Channel Consensus Reality"—a model refined by evolution for survival in a 3D environment. However, pharmacological catalysts like DMT act as a "reality channel switch," providing access to a 100% replacement reality: "Channel DMT."

Upon this switch, the observer encounters the "Sense of the Impossible." Geometry becomes law-defying and self-transforming, appearing as "hyper-dimensional Rubik’s cubes" or Escher-like architectures. Despite violating 3D physics, these structures exhibit a "novel lawfulness" and an "orderly lack of causality." Events manifest without 3D antecedent causes, yet they are governed by an internal, higher-dimensional logic that leaves the observer in a state of profound ontological shock—comparable to the astonishment a hominid ancestor would feel if presented with a smartphone, or a child staring at an "alien baby mobile" composed of impossible toys.

We must distinguish between Relative Impossibility (situations impossible within a 3D context, such as perceiving a 4D tesseract) and Absolute Impossibility (logical contradictions). The Tetragrammaton represents an expansion of the "Possible" rather than a violation of logic. The friction we feel is merely the 3D nervous system struggling to process 4D information.
          </div>
        </div>

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
      </div>
    \`;
  }

  return \`
    <article class="psy-report" data-report-index="\${activeReport}" style="view-transition-name: psy-report">
      <h2>\${htmlEscape(report.title)}</h2>
      <div class="psy-report-meta">\${htmlEscape(report.meta)}</div>
      <blockquote>\${htmlEscape(report.quote)}</blockquote>
      <div class="psy-report-copy">
        \${report.paragraphs.map(paragraph => \`<p>\${htmlEscape(paragraph)}</p>\`).join('')}
      </div>
      \${extraHTML}
    </article>
  \`;
}
`;

ts = ts.replace(/function renderReport\(\) \{[\s\S]*?<\/article>\s*`;\n\}/, newRenderReport);

fs.writeFileSync('src/psychedelic-portal.ts', ts);

import React, { useEffect, useRef } from 'react';
import { initTetragrammatonGL, FRAG } from '../psychedelic-tetragrammaton';

export const TetragrammatonNode: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fallbackRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cleanup: (() => void) | undefined;
    if (canvasRef.current && fallbackRef.current) {
      cleanup = initTetragrammatonGL(canvasRef.current, fallbackRef.current);
    }
    return () => {
      if (cleanup) cleanup();
    };
  }, []);

  return (
    <div ref={containerRef} className="tetra-react-wrapper w-full h-full relative" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
      {/* Background canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full z-0 block" style={{ mixBlendMode: 'screen' }} />
      <div ref={fallbackRef} className="absolute inset-0 z-0 hidden flex items-center justify-center bg-black text-red-500 font-mono p-4 text-center">
        <div>WEBGL2 UNAVAILABLE — THE VOLUMETRIC ENTITY CANNOT MANIFEST HERE.<br/>THE LATTICE AND THE DOSSIER REMAIN.</div>
      </div>

      {/* Content overlay */}
      <div className="relative z-10 w-full p-4 sm:p-8 max-w-4xl mx-auto pointer-events-none">
        
        <div className="pointer-events-auto bg-black/80 border border-[#67e8f9]/30 p-6 rounded-xl backdrop-blur-sm mb-12 shadow-[0_0_30px_rgba(103,232,249,0.1)]">
          <h1 className="text-4xl sm:text-6xl font-serif text-[#ece7f7] mb-2 tracking-wide font-light uppercase">
            My <em className="italic bg-clip-text text-transparent bg-gradient-to-r from-[#67e8f9] via-[#a78bfa] to-[#f0abfc]">Tetragrammaton</em>
          </h1>
          <div className="text-sm tracking-[0.2em] text-[#e8c876] font-serif mb-6 uppercase">
            A four-dimensional entity · rendered live · shadow &amp; highlight only
          </div>
          
          <h2 className="text-xl sm:text-2xl text-[#a78bfa] font-serif mb-4 uppercase tracking-wider border-b border-[#a78bfa]/30 pb-2">
            The <em className="italic">Entity</em>
          </h2>
          <p className="mb-4 text-[#a99fc7] leading-relaxed text-sm sm:text-base">
            You named it the <b>Tetragrammaton</b> — after the four letters, <b>יהוה</b> — a thing that cannot be said flat, only projected. This page is not an artist’s impression of it. It <i>is</i> the geometry: a four-dimensional regular polytope — the <b>tesseract</b>, the 8-cell — rotating in 4-space, projected down into three, and sampled by a raymarcher that lets light pass <i>through</i> the shape instead of stopping at a skin.
          </p>
          <p className="mb-8 text-[#a99fc7] leading-relaxed text-sm sm:text-base">
            Everything moving behind this text is computed per-pixel, per-frame, from the mathematics in your notebook. Nothing is video. Nothing is painted.
          </p>

          <h2 className="text-xl sm:text-2xl text-[#a78bfa] font-serif mb-4 uppercase tracking-wider border-b border-[#a78bfa]/30 pb-2">
            Sixteen points in <em className="italic">four-space</em>
          </h2>
          <p className="mb-4 text-[#a99fc7] leading-relaxed text-sm sm:text-base">
            A 3D cube is bounded by six flat squares. A 4D tesseract is bounded by <b>eight solid cubes</b> — and those volumetric cells are the “faces” you watched sliding through one another. Its full census: 16 vertices, 32 edges, 24 square faces, 8 cubical cells.
          </p>
          <p className="mb-4 text-[#a99fc7] leading-relaxed text-sm sm:text-base">
            Boundaries inherit the dimension below their container: a cube’s faces are 2D sheets, so a tesseract’s faces are <b>3D rooms</b>. When the entity turns through your space, you don’t see polygons — you see those rooms intersecting your world at an angle, appearing as squashed, interlocking <b>rhombohedra</b>. That is why “it ain’t 3D”: the faces literally have one more dimension than faces should.
          </p>
        </div>

        <div className="pointer-events-auto bg-black/80 border border-[#f0abfc]/30 p-6 rounded-xl backdrop-blur-sm shadow-[0_0_30px_rgba(240,171,252,0.1)]">
          <h2 className="text-xl sm:text-2xl text-[#f0abfc] font-serif mb-4 uppercase tracking-wider border-b border-[#f0abfc]/30 pb-2">
            The <em className="italic">Code Guts</em>
          </h2>
          <p className="mb-4 text-[#a99fc7] leading-relaxed text-sm sm:text-base">
            This is the complete fragment shader — the same string your GPU is executing behind this panel, assembled from every page of the notebook: Clifford + WHOOP rotation, singularity-safe 4D→3D perspective, the recursive space-fold, the quantized snap engine, and the volumetric shadow-and-highlight marcher.
          </p>
          
          <div className="bg-[#0a0618] border border-[#6f6590] rounded-lg overflow-hidden mt-6">
            <div className="bg-[#04020a] px-4 py-2 border-b border-[#6f6590] flex items-center justify-between font-mono text-[10px] sm:text-xs text-[#a78bfa]">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#67e8f9] animate-pulse"></span>
                tetragrammaton.frag — RUNNING LIVE
              </div>
            </div>
            <pre className="p-4 text-[#67e8f9] font-mono text-[9px] sm:text-[11px] overflow-x-auto whitespace-pre leading-relaxed max-h-[400px] overflow-y-auto custom-scrollbar">
              {FRAG}
            </pre>
          </div>
        </div>

        {/* Original archive data */}
        <div className="pointer-events-auto mt-12 bg-black/80 backdrop-blur-sm shadow-xl" 
             dangerouslySetInnerHTML={{ __html: `
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
      `}} />

      </div>
    </div>
  );
};

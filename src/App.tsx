import { useEffect, useRef, useState, FormEvent } from 'react';
import { 
  Zap, 
  RefreshCw, 
  Play, 
  Sliders, 
  Code, 
  Terminal, 
  Volume2, 
  Bot, 
  Sparkles, 
  Trash2, 
  Skull, 
  Globe, 
  X, 
  Radio, 
  Atom, 
  Maximize2,
  ChevronRight,
  Eye
} from 'lucide-react';
import { ShaderThumbnail } from './components/ShaderThumbnail';

// Define structure for our shader items
interface ShaderItem {
  id: string;
  title: string;
  tag: string;
  tagColor: string;
  thumbClass: string;
  explanation: string;
  technicalDetails: string;
  fileName: string;
  fragmentShader: string;
  defaultParams: {
    speed: number;
    scale: number;
    intensity: number;
    hue: number;
  };
  fieldNotes?: string;
}

// Dossier section photos and timing for the About Me Section on the Home/Hub Tab
const DOSSIER_PHOTOS: string[] = [
  'https://raw.githubusercontent.com/merrypranxter/astraltrash_xyz/main/public/selfies/8016E78C-4FB1-47DB-97A9-9F79BC5881BC.png',
  'https://raw.githubusercontent.com/merrypranxter/astraltrash_xyz/main/public/selfies/IMG_3078.jpg',
  'https://raw.githubusercontent.com/merrypranxter/astraltrash_xyz/main/public/selfies/IMG_4802.PNG',
  'https://raw.githubusercontent.com/merrypranxter/astraltrash_xyz/main/public/selfies/IMG_4804.PNG',
  'https://raw.githubusercontent.com/merrypranxter/astraltrash_xyz/main/public/selfies/IMG_5605.jpg',
  'https://raw.githubusercontent.com/merrypranxter/astraltrash_xyz/main/public/selfies/IMG_5612.PNG',
  'https://raw.githubusercontent.com/merrypranxter/astraltrash_xyz/main/public/selfies/IMG_5614.PNG',
  'https://raw.githubusercontent.com/merrypranxter/astraltrash_xyz/main/public/selfies/IMG_6421.PNG',
  'https://raw.githubusercontent.com/merrypranxter/astraltrash_xyz/main/public/selfies/ReLens_IMG_20250623145800.jpg',
];

const DOSSIER_ROTATE_MS = 4200;

export default function App() {
  const mainCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const galleryCanvasRef = useRef<HTMLCanvasElement | null>(null);
  
  // Navigation State
  // 'hub' = Original Portfolio
  // 'shaderslop' = WebGL Art Gallery
  // 'aislop' = AI Hallucination Lab
  // 'rando' = Synth & Chaos Playground
  // 'about' = About the Artist
  const [activeTab, setActiveTab] = useState<'hub' | 'shaderslop' | 'aislop' | 'rando' | 'about'>('hub');

  // Core App states
  const [booting, setBooting] = useState(true);
  const [bootDone, setBootDone] = useState(false);
  const [visitorCount, setVisitorCount] = useState('0000000');
  const [showGuestbook, setShowGuestbook] = useState(false);

  // Background Shader customizer states (RANDO modifier)
  const [bgSpeed, setBgSpeed] = useState<number>(0.06);
  const [bgWarp, setBgWarp] = useState<number>(4.0);
  const [bgColorShift, setBgColorShift] = useState<number>(0.3);
  const [bgVignette, setBgVignette] = useState<number>(0.6);

  // ShaderSlop Gallery states
  const [selectedShader, setSelectedShader] = useState<ShaderItem | null>(null);
  const [shaderSpeed, setShaderSpeed] = useState<number>(1.0);
  const [shaderScale, setShaderScale] = useState<number>(1.0);
  const [shaderIntensity, setShaderIntensity] = useState<number>(1.0);
  const [shaderHue, setShaderHue] = useState<number>(0.0);
  const [showGLSL, setShowGLSL] = useState<boolean>(false);
  const [fetchedCode, setFetchedCode] = useState<string>('');
  const [isFetchingCode, setIsFetchingCode] = useState<boolean>(false);
  const [externalExplanations, setExternalExplanations] = useState<{
    [id: string]: {
      explanation?: string;
      technicalDetails?: string;
      fieldNotes?: string;
    }
  }>({});

  // HTML source streams for sandboxed IFrame rendering (with HUD overlays hidden)
  const [featuredHtml, setFeaturedHtml] = useState<string>('');
  const [galleryHtml, setGalleryHtml] = useState<string>('');
  const htmlCacheRef = useRef<{ [fileName: string]: string }>({});

  // Objkt.com Integration States
  const [galleryMode, setGalleryMode] = useState<'objkt' | 'local'>('local');
  const [objktTokens, setObjktTokens] = useState<any[]>([]);
  const [selectedObjktToken, setSelectedObjktToken] = useState<any | null>(null);
  const [isLoadingObjkt, setIsLoadingObjkt] = useState<boolean>(false);

  // Aspect ratio and Resolution controls for high-res shader rendering
  const [selectedAspect, setSelectedAspect] = useState<string>('1:1');
  const [selectedResolution, setSelectedResolution] = useState<string>('high');

  // AI Slop State
  const [rawPrompt, setRawPrompt] = useState<string>('glowing robotic garbage floating in low orbit');
  const [corruptedPrompt, setCorruptedPrompt] = useState<string>('');
  const [isCorrupting, setIsCorrupting] = useState<boolean>(false);
  const [slopMetric, setSlopMetric] = useState<number>(68.4);
  const [aiLogs, setAiLogs] = useState<string[]>([
    'SYSTEM: Initializing hallucinatory neural weight maps...',
    'SYSTEM: Target slop coefficient detected: 0.88',
    'SYSTEM: Loading multi-modal digital waste stream...'
  ]);

  // RANDO Synth State
  const [synthFrequency, setSynthFrequency] = useState<number>(440);
  const [isSynthPlaying, setIsSynthPlaying] = useState<boolean>(false);
  const [activeNote, setActiveNote] = useState<string>('N/A');
  const [terminalOutputs, setTerminalOutputs] = useState<string[]>([
    'ASTRAL_TRASH // TERMINAL INTERCEPT 42.1a',
    'STATUS: COLLECTING COSMIC DEBRIS FIELDS...',
    'MUTAGEN_INDEX: 99.8% // SCAN RATE: APPROX 120HZ'
  ]);

  // Dossier Carousel State
  const [dossierIdx, setDossierIdx] = useState<number>(0);
  const [dossierBroken, setDossierBroken] = useState<Set<number>>(new Set());

  // Web Audio Context reference for synthesizer
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  // Featured Project States (the right third scrolly box)
  const featuredCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const [featuredShaderIndex, setFeaturedShaderIndex] = useState<number>(0);
  const [featuredSpeed, setFeaturedSpeed] = useState<number>(1.0);
  const [featuredScale, setFeaturedScale] = useState<number>(1.2);
  const [featuredIntensity, setFeaturedIntensity] = useState<number>(1.2);
  const [featuredHue, setFeaturedHue] = useState<number>(0.15);
  
  // Interactive Avatar/Selfie Matrix States for About Page
  const [avatarSeed, setAvatarSeed] = useState<number>(0.42);
  const [avatarSymmetry, setAvatarSymmetry] = useState<number>(6);
  const [avatarColor, setAvatarColor] = useState<string>('#9D4DFF');
  const avatarCanvasRef = useRef<HTMLCanvasElement | null>(null);
  
  // Custom Comments State (MySpace Comments Section)
  const [myspaceComments, setMyspaceComments] = useState<Array<{
    id: string;
    sender: string;
    avatarBg: string;
    text: string;
    timestamp: string;
  }>>([
    {
      id: '1',
      sender: '✨ xX_void_surfer_Xx ✨',
      avatarBg: 'linear-gradient(45deg, #FF2BD6, #00F0FF)',
      text: 'OMG this structural iridescence is melting my monitor. 5 stars!',
      timestamp: 'Today, 2:14 PM'
    },
    {
      id: '2',
      sender: '👾 crt_witch',
      avatarBg: 'linear-gradient(135deg, #39FF14, #EFFF04)',
      text: 'the fbm carrier wave hums in my teeth. absolute peak trash.',
      timestamp: 'Yesterday, 11:42 PM'
    },
    {
      id: '3',
      sender: '🛸 orbital_decay',
      avatarBg: 'linear-gradient(90deg, #9D4DFF, #FF6B00)',
      text: 'tried loading this on my windows 95 beige box and it opened a stargate in my closet',
      timestamp: 'July 8, 2026'
    }
  ]);
  const [newCommentName, setNewCommentName] = useState('');
  const [newCommentText, setNewCommentText] = useState('');

  // 1. Initial boot screen sequence
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) {
      setBooting(false);
      setBootDone(true);
      return;
    }
    const timer1 = setTimeout(() => {
      setBootDone(true);
      const timer2 = setTimeout(() => {
        setBooting(false);
      }, 900);
      return () => clearTimeout(timer2);
    }, 1800);
    return () => clearTimeout(timer1);
  }, []);

  // 2. Click Reader with Web Speech TTS
  useEffect(() => {
    const handleSpeakClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const el = target.closest('.speak') as HTMLElement;
      if (!el || !('speechSynthesis' in window)) return;
      
      const sayText = el.getAttribute('data-say') || el.textContent?.trim() || '';
      const u = new SpeechSynthesisUtterance(sayText);
      u.rate = 1.1;
      u.pitch = 1.05;
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(u);
    };

    document.addEventListener('click', handleSpeakClick);
    return () => {
      document.removeEventListener('click', handleSpeakClick);
    };
  }, []);

  // 3. Visitor Counter logic
  useEffect(() => {
    const base = 1337421;
    const n = base + Math.floor((Date.now() - 1760000000000) / 60000);
    setVisitorCount(String(Math.max(n, base)).padStart(7, '0'));
  }, []);

  // 3b. Dossier photo carousel auto-rotation and voice helper
  useEffect(() => {
    const t = setInterval(() => {
      setDossierIdx((prev) => (prev + 1) % DOSSIER_PHOTOS.length);
    }, DOSSIER_ROTATE_MS);
    return () => clearInterval(t);
  }, []);

  const speakDossier = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    const u = new SpeechSynthesisUtterance(text);
    u.rate = 1.02;
    u.pitch = 1.05;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(u);
  };

  const advanceDossierPhoto = () => {
    playChime('triangle', 1.2);
    setDossierIdx((prev) => (prev + 1) % DOSSIER_PHOTOS.length);
  };

  // 4. Web Audio synthesizer functions
  const startSynth = () => {
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      
      if (audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume();
      }

      if (oscRef.current) {
        oscRef.current.stop();
      }

      const ctx = audioCtxRef.current;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      // Fun retro square wave synthesizer
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(synthFrequency, ctx.currentTime);

      gain.gain.setValueAtTime(0.0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.12, ctx.currentTime + 0.1);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();

      oscRef.current = osc;
      gainNodeRef.current = gain;
      setIsSynthPlaying(true);
      setActiveNote(`${Math.round(synthFrequency)}Hz [CHALLENGER-WAVE]`);
    } catch (e) {
      console.warn('Audio Context failed to start:', e);
    }
  };

  const updateSynthFreq = (freq: number) => {
    setSynthFrequency(freq);
    if (oscRef.current && audioCtxRef.current) {
      oscRef.current.frequency.setValueAtTime(freq, audioCtxRef.current.currentTime);
      setActiveNote(`${Math.round(freq)}Hz [CHALLENGER-WAVE]`);
    }
  };

  const stopSynth = () => {
    if (gainNodeRef.current && audioCtxRef.current && oscRef.current) {
      const ctx = audioCtxRef.current;
      gainNodeRef.current.gain.setValueAtTime(gainNodeRef.current.gain.value, ctx.currentTime);
      gainNodeRef.current.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.3);
      
      const oscToStop = oscRef.current;
      setTimeout(() => {
        try {
          oscToStop.stop();
        } catch (e) {}
      }, 350);

      oscRef.current = null;
      gainNodeRef.current = null;
      setIsSynthPlaying(false);
      setActiveNote('N/A');
    }
  };

  const playChime = (type: 'sine' | 'square' | 'triangle' = 'triangle', pitchScaler: number = 1.0) => {
    try {
      const ctx = audioCtxRef.current || new (window.AudioContext || (window as any).webkitAudioContext)();
      if (!audioCtxRef.current) audioCtxRef.current = ctx;
      if (ctx.state === 'suspended') ctx.resume();

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(330 * pitchScaler, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880 * pitchScaler, ctx.currentTime + 0.15);
      
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.25);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    } catch (e) {}
  };

  // 5. Interactive Shader Items for ShaderSlop (sourced from merrypranxter/shaderslop_designs)
  const shadersList: ShaderItem[] = [
    {
      id: 'acidic_vhs_decay',
      title: 'acidic-vhs-decay',
      tag: 'VHS',
      tagColor: 'var(--magenta)',
      thumbClass: 't1',
      explanation: 'Emulates acidic, organic VHS decay processes with magnetic color bleeding and rolling analog synchronization loss.',
      technicalDetails: 'Combines multiple octaves of high-frequency value noise with cosine-wave color mappings to emulate magnetic tape degeneration.',
      fileName: 'acidic-vhs-decay.html',
      fragmentShader: '/* LOADING LIVE CODE FROM REPOSITORY... */',
      defaultParams: { speed: 1.0, scale: 1.0, intensity: 1.0, hue: 0.0 },
      fieldNotes: 'This work emulates the exact degradation pattern of a heavily played Scotch T-120 VHS cassette tape recorded over in EP mode. The chromatic bleed is modeled using multi-layered domain warped fractional noise, which replicates the magnetic decay of iron-oxide tape coating as it loses cohesion under friction. Watch the horizontal scanline timing slide out of synchronization when warping intensity is cranked up — this is designed to simulate a physical tape head losing horizontal lock.'
    },
    {
      id: 'acidic_vhs_rot',
      title: 'acidic-vhs-rot',
      tag: 'GLITCH',
      tagColor: 'var(--cyan)',
      thumbClass: 't2',
      explanation: 'Analog signal drift and physical tape rot distortion causing spiral coordinate shearing and magnetic track bleed.',
      technicalDetails: 'Employs complex feedback distortion and rotational matrix shears acting directly on scanline timing offsets.',
      fileName: 'acidic-vhs-rot.html',
      fragmentShader: '/* LOADING LIVE CODE FROM REPOSITORY... */',
      defaultParams: { speed: 1.0, scale: 1.0, intensity: 1.0, hue: 0.0 },
      fieldNotes: 'Analog tape rot is not a random static overlay; it is a physical process where moisture and heat oxidize the magnetic binder. This shader models this biological-analog fusion. By mapping rotational shear vectors directly onto the scanline offsets, the image appears to pull inward in spirals. When configured at ultra resolution, the pixelation mirrors the crystalline structure of cobalt-doped magnetic compounds.'
    },
    {
      id: 'chromatophore_codec_shrine',
      title: 'chromatophore_codec_shrine',
      tag: 'BIO',
      tagColor: 'var(--acid)',
      thumbClass: 't3',
      explanation: 'A glowing bio-computational shrine simulating neural chromatophore cells pulsing and reflecting across liquid glass.',
      technicalDetails: 'Initializes a custom Three.js Scene, loading custom material shaders mapped onto spherical clusters representing bioluminescent cells.',
      fileName: 'chromatophore_codec_shrine_20260618_185338.html',
      fragmentShader: '/* LOADING LIVE CODE FROM REPOSITORY... */',
      defaultParams: { speed: 1.0, scale: 1.0, intensity: 1.0, hue: 0.0 },
      fieldNotes: 'Inspired by cephalopod chromatophores — skin cells that shift color dynamically via muscle expansion. This simulation presents a computational shrine dedicated to this biological display language. It loads a fully custom WebGL material onto overlapping fluid meshes, using raymarching algorithms inside Three.js to render soft internal glow, bioluminescent refraction, and reflective glass boundaries. It represents twenty years of documented visual phenomena centered around self-luminous organic structures.'
    },
    {
      id: 'living_fabric',
      title: 'living-fabric',
      tag: 'SILK',
      tagColor: 'var(--phosphor)',
      thumbClass: 't4',
      explanation: 'An organic silk-like dynamic textile simulation driven by high-frequency continuous domain-warped sine fields.',
      technicalDetails: 'Uses 2D parameter coordinates rotated and scaled recursively inside fractional sin-cos components to generate fluid moire.',
      fileName: 'living-fabric.html',
      fragmentShader: '/* LOADING LIVE CODE FROM REPOSITORY... */',
      defaultParams: { speed: 1.0, scale: 1.0, intensity: 1.0, hue: 0.0 }
    },
    {
      id: 'magenta_glitch_tape',
      title: 'magenta-glitch-tape',
      tag: 'CRT',
      tagColor: 'var(--magenta)',
      thumbClass: 't5',
      explanation: 'High-contrast magenta tracking disruption simulating unstable horizontal hold and raw electrical scanline static.',
      technicalDetails: 'Intersects sharp fractional stepped lines with random chromatic distortion channels, producing classic CRT line offsets.',
      fileName: 'magenta-glitch-tape.html',
      fragmentShader: '/* LOADING LIVE CODE FROM REPOSITORY... */',
      defaultParams: { speed: 1.0, scale: 1.0, intensity: 1.0, hue: 0.0 }
    },
    {
      id: 'myspace_glitchscape',
      title: 'myspace-glitchscape',
      tag: 'Y2K',
      tagColor: 'var(--cyan)',
      thumbClass: 't6',
      explanation: 'A classic nostalgic early-2000s glitter-glitched cyber grid landscape stretching into infinity and reacting to mouse input.',
      technicalDetails: 'Raymarches an infinite perspective grid warped by continuous sine distortion waves under a high-frequency stippled dither dither mask.',
      fileName: 'myspace-glitchscape_20260611_153739.html',
      fragmentShader: '/* LOADING LIVE CODE FROM REPOSITORY... */',
      defaultParams: { speed: 1.0, scale: 1.0, intensity: 1.0, hue: 0.0 }
    },
    {
      id: 'neon_void_material',
      title: 'neon-void-material',
      tag: 'VOID',
      tagColor: 'var(--violet)',
      thumbClass: 't7',
      explanation: 'Infinite fluorescent light structures raymarched inside non-Euclidean space folding coordinates recursively.',
      technicalDetails: 'Signed distance functions of rounded tubes, coordinate-wrapped with modulus repetitions and continuous rotational transforms.',
      fileName: 'neon-void-material.html',
      fragmentShader: '/* LOADING LIVE CODE FROM REPOSITORY... */',
      defaultParams: { speed: 1.0, scale: 1.0, intensity: 1.0, hue: 0.0 }
    },
    {
      id: 'prismatic_tape_oracle',
      title: 'prismatic_tape_oracle',
      tag: 'PRISM',
      tagColor: 'var(--ember)',
      thumbClass: 't8',
      explanation: 'An optical color-splitting prism wave mapper simulating hyper-dimensional light refraction through digital quartz crystals.',
      technicalDetails: 'Calculates continuous wave offsets, mapping separate red, green, and blue refraction values under dynamic angle modulations.',
      fileName: 'prismatic_tape_oracle.html',
      fragmentShader: '/* LOADING LIVE CODE FROM REPOSITORY... */',
      defaultParams: { speed: 1.0, scale: 1.0, intensity: 1.0, hue: 0.0 }
    },
    {
      id: 'quasicrystal_dissolve',
      title: 'quasicrystal-dissolve',
      tag: 'MATH',
      tagColor: 'var(--phosphor)',
      thumbClass: 't1',
      explanation: 'Five-fold Penrose-patterned quasicrystal structures dissolving and reconstructing dynamically through white noise entropy.',
      technicalDetails: 'Generates five-fold symmetric interference patterns, modulating amplitude and phase shift over thermal Gaussian noise fields.',
      fileName: 'quasicrystal-dissolve.html',
      fragmentShader: '/* LOADING LIVE CODE FROM REPOSITORY... */',
      defaultParams: { speed: 1.0, scale: 1.0, intensity: 1.0, hue: 0.0 }
    },
    {
      id: 'quasicrystal_oscillator',
      title: 'quasicrystal-oscillator',
      tag: 'MATH',
      tagColor: 'var(--acid)',
      thumbClass: 't2',
      explanation: 'A mathematical harmonic engine rendering complex interference rings and high-dimensional crystalline structures.',
      technicalDetails: 'Computes radial multi-frequency waves projecting crystalline planes onto the screen under high-contrast feedback buffers.',
      fileName: 'quasicrystal-oscillator.html',
      fragmentShader: '/* LOADING LIVE CODE FROM REPOSITORY... */',
      defaultParams: { speed: 1.0, scale: 1.0, intensity: 1.0, hue: 0.0 }
    },
    {
      id: 'quasicrystal_cycle',
      title: 'quasicrystal-cycle',
      tag: 'CYCLE',
      tagColor: 'var(--cyan)',
      thumbClass: 't3',
      explanation: 'Hypnotic phase cycle shifting across overlapping crystalline lattices to produce high-frequency mathematical moire grids.',
      technicalDetails: 'Iterates plane wave intersections, translating phase bounds over a continuous trigonometric timer.',
      fileName: 'quasicrystal_cycle.html',
      fragmentShader: '/* LOADING LIVE CODE FROM REPOSITORY... */',
      defaultParams: { speed: 1.0, scale: 1.0, intensity: 1.0, hue: 0.0 }
    },
    {
      id: 'quasicrystal_flux',
      title: 'quasicrystal-flux',
      tag: 'FLUX',
      tagColor: 'var(--violet)',
      thumbClass: 't4',
      explanation: 'A fluid flow-field simulation driven by underlying continuous mathematical vectors derived from five-fold quasicrystals.',
      technicalDetails: 'Integrates Euler-derived particle flow mappings directly over harmonic crystalline waves.',
      fileName: 'quasicrystal_flux.html',
      fragmentShader: '/* LOADING LIVE CODE FROM REPOSITORY... */',
      defaultParams: { speed: 1.0, scale: 1.0, intensity: 1.0, hue: 0.0 }
    },
    {
      id: 'repo_chroma_soup',
      title: 'repo-chroma-soup',
      tag: 'FBM',
      tagColor: 'var(--magenta)',
      thumbClass: 't5',
      explanation: 'A boiling digital fluid-chromatography simulation with beautiful iridescent color separations and fluid boundary collisions.',
      technicalDetails: 'Computes multi-layered fractional Brownian noise, using high-contrast color palettes warping over dynamically calculated flow vectors.',
      fileName: 'repo-chroma-soup_20260702_233811.html',
      fragmentShader: '/* LOADING LIVE CODE FROM REPOSITORY... */',
      defaultParams: { speed: 1.0, scale: 1.0, intensity: 1.0, hue: 0.0 }
    }
  ];

  // 6. WebGL Background Global render loop (Applies variables & modifications)
  useEffect(() => {
    const cv = mainCanvasRef.current;
    if (!cv) return;

    const gl = cv.getContext('webgl2', { antialias: false, alpha: false });
    if (!gl) {
      cv.style.background = 'radial-gradient(circle at 50% 40%, #0a2, #000 70%)';
      return;
    }

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const vs = `#version 300 es
    in vec2 p;void main(){gl_Position=vec4(p,0.,1.);}`;

    // Background shader incorporating dynamically adjustable uniforms!
    const fs = `#version 300 es
    precision highp float;
    uniform vec2 R;uniform float T;
    uniform float speed, warp, hueShift, vignette;
    out vec4 O;

    float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
    float n2(vec2 p){
      vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);
      return mix(mix(h(i),h(i+vec2(1,0)),f.x),mix(h(i+vec2(0,1)),h(i+vec2(1,1)),f.x),f.y);
    }
    float fbm(vec2 p){
      float v=0.,a=.5;
      mat2 m=mat2(1.6,1.2,-1.2,1.6);
      for(int i=0;i<5;i++){v+=a*n2(p);p=m*p;a*=.5;}
      return v;
    }
    vec3 pal(float t){
      // Pure chromatic neon palette: bright pink, deep violet, vibrant cyan, teal, electric blue, solarized yellow.
      // High contrast and high brightness parameters completely eliminate muddy brown.
      vec3 a = vec3(0.5, 0.5, 0.5);
      vec3 b = vec3(0.5, 0.5, 0.5);
      vec3 c = vec3(1.0, 1.0, 1.0);
      vec3 d = vec3(0.15, 0.45, 0.75) + hueShift;
      return a + b * cos(6.28318 * (c * t + d));
    }
    void main(){
      vec2 uv=(gl_FragCoord.xy*2.-R)/min(R.x,R.y);
      float t=T*speed;
      vec2 q=vec2(fbm(uv+t),fbm(uv+vec2(5.2,1.3)-t));
      vec2 r=vec2(fbm(uv+warp*q+vec2(1.7,9.2)+t*.7),fbm(uv+warp*q+vec2(8.3,2.8)-t*.5));
      float f=fbm(uv+4.*r);
      vec3 col=pal(f*1.6+t*.45+length(q)*.4);
      col += vec3(0.0, 0.85, 1.0) * pow(f, 4.0) * 0.45; // Saturated electric cyan highlight
      col += vec3(1.0, 0.0, 0.75) * pow(length(r), 3.0) * 0.4; // Saturated hot pink highlight
      vec3 bg = vec3(0.01, 0.01, 0.015); // Deep charcoal black with subtle dark space tone
      float edge = smoothstep(0.12, 0.82, f);
      col = mix(bg, col, edge);
      col += vec3(0.08, 0.0, 0.2) * (1.0 - edge) * fbm(uv * 1.8 + t * 0.15); // Neon cosmic indigo backdrop glow
      col*=1.-vignette*length(uv*.6);
      col=pow(col,vec3(1.15));
      O=vec4(col,1.);
    }`;

    const sh = (type: number, source: string) => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error(gl.getShaderInfoLog(shader));
        return null;
      }
      return shader;
    };

    const vertexShader = sh(gl.VERTEX_SHADER, vs);
    const fragmentShader = sh(gl.FRAGMENT_SHADER, fs);
    if (!vertexShader || !fragmentShader) return;

    const pr = gl.createProgram();
    if (!pr) return;
    gl.attachShader(pr, vertexShader);
    gl.attachShader(pr, fragmentShader);
    gl.linkProgram(pr);
    gl.useProgram(pr);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);

    const loc = gl.getAttribLocation(pr, 'p');
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const uR = gl.getUniformLocation(pr, 'R');
    const uT = gl.getUniformLocation(pr, 'T');
    const uSpeed = gl.getUniformLocation(pr, 'speed');
    const uWarp = gl.getUniformLocation(pr, 'warp');
    const uHueShift = gl.getUniformLocation(pr, 'hueShift');
    const uVignette = gl.getUniformLocation(pr, 'vignette');

    const size = () => {
      const d = Math.min(window.devicePixelRatio || 1, 1.5);
      cv.width = window.innerWidth * d;
      cv.height = window.innerHeight * d;
      gl.viewport(0, 0, cv.width, cv.height);
    };

    window.addEventListener('resize', size);
    size();

    const start = performance.now();
    let animationFrameId: number;

    const frame = (now: number) => {
      gl.uniform2f(uR, cv.width, cv.height);
      gl.uniform1f(uT, (now - start) / 1000);
      
      // Bind live adjustable uniforms
      gl.uniform1f(uSpeed, bgSpeed);
      gl.uniform1f(uWarp, bgWarp);
      gl.uniform1f(uHueShift, bgColorShift);
      gl.uniform1f(uVignette, bgVignette);

      gl.drawArrays(gl.TRIANGLES, 0, 3);
      if (!reduce) {
        animationFrameId = requestAnimationFrame(frame);
      }
    };

    animationFrameId = requestAnimationFrame(frame);

    return () => {
      window.removeEventListener('resize', size);
      cancelAnimationFrame(animationFrameId);
      gl.deleteProgram(pr);
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
      gl.deleteBuffer(buf);
    };
  }, [bgSpeed, bgWarp, bgColorShift, bgVignette]);

  // 7. Initialize default selected shader on mount
  useEffect(() => {
    if (!selectedShader && shadersList.length > 6) {
      setSelectedShader(shadersList[6]); // default to neon-void-material.html
    }
  }, [selectedShader]);

  // Autodetect CPU capabilities for resolution defaults
  useEffect(() => {
    if (typeof navigator !== 'undefined' && navigator.hardwareConcurrency) {
      const cores = navigator.hardwareConcurrency;
      if (cores >= 8) {
        setSelectedResolution('high');
      } else if (cores <= 4) {
        setSelectedResolution('low');
      } else {
        setSelectedResolution('med');
      }
    }
  }, []);

  // Helper to inject a style tag to completely hide the interactive HUD box in files
  const injectHudHidingStyle = (htmlString: string) => {
    const styleTag = `
      <style>
        #hud, .hud, [id="hud"], #hideBtn, #saveBtn, #resetBtn, .hud-panel, .control-box,
        .dg, .dg.ac, .dg.main, [class*="dg"], #gui, [id="gui"], #gui_container, .lil-gui, .lil-gui-container {
          display: none !important;
          visibility: hidden !important;
          opacity: 0 !important;
          pointer-events: none !important;
          height: 0 !important;
          width: 0 !important;
          overflow: hidden !important;
        }
      </style>
    `;
    let modified = htmlString;
    if (htmlString.toLowerCase().includes('</head>')) {
      const idx = htmlString.toLowerCase().indexOf('</head>');
      modified = htmlString.substring(0, idx) + styleTag + htmlString.substring(idx);
    } else if (htmlString.toLowerCase().includes('<body>')) {
      const idx = htmlString.toLowerCase().indexOf('<body>') + 6;
      modified = htmlString.substring(0, idx) + styleTag + htmlString.substring(idx);
    } else {
      modified = styleTag + htmlString;
    }
    return modified;
  };

  // Helper to dynamically inject resolution multipliers and security constraints (anti-theft)
  const injectRuntimeLabMods = (htmlString: string, resolutionKey: string) => {
    if (!htmlString) return '';
    
    const multipliers: { [key: string]: number } = {
      'low': 0.35,
      'med': 0.7,
      'high': 1.0,
      'very-high': 1.5,
      'max': 2.2
    };
    
    const mult = multipliers[resolutionKey] || 1.0;
    
    const runtimeStylesAndScripts = `
      <style>
        /* Anti-theft selection constraints */
        body, html {
          user-select: none !important;
          -webkit-user-select: none !important;
          -moz-user-select: none !important;
          -ms-user-select: none !important;
        }
        img, canvas {
          pointer-events: auto !important;
          user-select: none !important;
          -webkit-user-drag: none !important;
        }
      </style>
      <script>
        (function() {
          try {
            // Override browser Device Pixel Ratio inside sandbox for speed control
            Object.defineProperty(window, 'devicePixelRatio', { 
              value: ${mult}, 
              writable: false, 
              configurable: true 
            });
          } catch(e) {}

          // Prevent right-click context menu (anti-theft)
          document.addEventListener('contextmenu', function(e) {
            e.preventDefault();
            return false;
          }, true);

          // Prevent screenshot/save hotkeys (anti-theft)
          document.addEventListener('keydown', function(e) {
            // Cmd+S / Ctrl+S
            if ((e.ctrlKey || e.metaKey) && e.key === 's') {
              e.preventDefault();
            }
            // Cmd+P / Ctrl+P
            if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
              e.preventDefault();
            }
            // F12 or Inspect shortcuts
            if (e.key === 'F12' || ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'I' || e.key === 'i' || e.key === 'C' || e.key === 'c'))) {
              e.preventDefault();
            }
          }, true);
        })();
      </script>
    `;
    
    let modified = htmlString;
    if (htmlString.toLowerCase().includes('</head>')) {
      const idx = htmlString.toLowerCase().indexOf('</head>');
      modified = htmlString.substring(0, idx) + runtimeStylesAndScripts + htmlString.substring(idx);
    } else {
      modified = runtimeStylesAndScripts + htmlString;
    }
    return modified;
  };

  // 7b. Fetch and cache featured shader HTML with HUD hidden
  useEffect(() => {
    const activeShader = shadersList[featuredShaderIndex];
    if (!activeShader) return;

    const fileName = activeShader.fileName;
    if (htmlCacheRef.current[fileName]) {
      setFeaturedHtml(htmlCacheRef.current[fileName]);
      return;
    }

    setFeaturedHtml(''); // trigger loading state
    fetch(`https://raw.githubusercontent.com/merrypranxter/shaderslop_designs/main/${fileName}`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);
        return res.text();
      })
      .then((text) => {
        const modified = injectHudHidingStyle(text);
        htmlCacheRef.current[fileName] = modified;
        setFeaturedHtml(modified);
      })
      .catch((err) => {
        console.error('Failed to fetch featured shader HTML:', err);
        setFeaturedHtml(`<html><body style="background:black;color:#FF2BD6;font-family:monospace;display:flex;align-items:center;justify-content:center;height:100vh;">STREAM CONNECTION ERROR</body></html>`);
      });
  }, [featuredShaderIndex]);

  // 7c. Fetch and cache selected shader HTML for gallery with HUD hidden
  useEffect(() => {
    if (!selectedShader) return;

    const fileName = selectedShader.fileName;
    if (htmlCacheRef.current[fileName]) {
      setGalleryHtml(htmlCacheRef.current[fileName]);
      return;
    }

    setGalleryHtml(''); // trigger loading state
    fetch(`https://raw.githubusercontent.com/merrypranxter/shaderslop_designs/main/${fileName}`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);
        return res.text();
      })
      .then((text) => {
        const modified = injectHudHidingStyle(text);
        htmlCacheRef.current[fileName] = modified;
        setGalleryHtml(modified);
      })
      .catch((err) => {
        console.error('Failed to fetch gallery shader HTML:', err);
        setGalleryHtml(`<html><body style="background:black;color:#FF2BD6;font-family:monospace;display:flex;align-items:center;justify-content:center;height:100vh;">STREAM CONNECTION ERROR</body></html>`);
      });
  }, [selectedShader]);

  // 7d. Fetch raw HTML/JS code of the selected shader dynamically from the repository
  useEffect(() => {
    if (!selectedShader || !showGLSL) return;

    setIsFetchingCode(true);
    setFetchedCode('/* RETRIEVING DEBRIS STREAM FROM GITHUB_REPOS/SHADERSLOP_DESIGNS... */');

    fetch(`https://raw.githubusercontent.com/merrypranxter/shaderslop_designs/main/${selectedShader.fileName}`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);
        return res.text();
      })
      .then((text) => {
        setFetchedCode(text);
        setIsFetchingCode(false);
      })
      .catch((err) => {
        setFetchedCode(`// ERROR STREAM RECOVERY FAILED:\n// Unable to fetch from github.com/merrypranxter/shaderslop_designs.\n// Reason: ${err.message}`);
        setIsFetchingCode(false);
      });
  }, [selectedShader, showGLSL]);

  // 7de. Fetch explanations.json dynamically from GitHub repository to allow remote updates
  useEffect(() => {
    fetch('https://raw.githubusercontent.com/merrypranxter/shaderslop_designs/main/explanations.json')
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        console.log('Successfully retrieved external explanations from repository:', data);
        setExternalExplanations(data);
      })
      .catch((err) => {
        console.info('External explanations load bypassed (using local defaults):', err.message || err);
      });
  }, []);

  // 7dd. Render procedural sacred geometry avatar for About Page
  useEffect(() => {
    if (activeTab === 'about' && avatarCanvasRef.current) {
      const canvas = avatarCanvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      
      // Clear
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw sci-fi scanline overlay
      ctx.strokeStyle = '#18181b';
      ctx.lineWidth = 1;
      for (let y = 0; y < canvas.height; y += 4) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }
      
      // Draw procedural sacred geometry avatar
      const cx = canvas.width / 2;
      const cy = canvas.height / 2;
      const maxR = Math.min(cx, cy) * 0.72;
      
      ctx.strokeStyle = avatarColor;
      ctx.shadowBlur = 12;
      ctx.shadowColor = avatarColor;
      
      const sym = avatarSymmetry;
      const steps = 80;
      
      // Radial loops drawing complex orbit trajectories
      for (let i = 0; i < sym; i++) {
        const baseAngle = (i * 2 * Math.PI) / sym;
        ctx.beginPath();
        for (let j = 0; j <= steps; j++) {
          const t = j / steps;
          const angle = baseAngle + t * Math.PI * 2.5 * avatarSeed;
          const r = maxR * (0.2 + 0.8 * Math.sin(t * Math.PI * (1.5 + avatarSeed * 3.5)));
          const x = cx + r * Math.cos(angle);
          const y = cy + r * Math.sin(angle);
          if (j === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.lineWidth = 1.8;
        ctx.stroke();
      }
      
      // Reset shadow blur for crisp text and overlays
      ctx.shadowBlur = 0;
      
      // Draw outer target target rings
      ctx.strokeStyle = '#39FF14';
      ctx.beginPath();
      ctx.arc(cx, cy, maxR * 0.95, 0, 2 * Math.PI);
      ctx.lineWidth = 0.5;
      ctx.setLineDash([4, 12]);
      ctx.stroke();
      ctx.setLineDash([]);
      
      ctx.strokeStyle = '#FF2BD6';
      ctx.beginPath();
      ctx.arc(cx, cy, maxR * 1.05, 0, 2 * Math.PI);
      ctx.lineWidth = 0.5;
      ctx.setLineDash([12, 24]);
      ctx.stroke();
      ctx.setLineDash([]);
      
      // Draw binary telemetry/matrix crosshairs
      ctx.fillStyle = '#39FF14';
      ctx.font = '9px "JetBrains Mono", monospace';
      ctx.fillText(`ATOMS_SEED: ${avatarSeed.toFixed(5)}`, 12, 18);
      ctx.fillText(`SYM_AXIS:  ${sym}`, 12, 28);
      ctx.fillText(`DEBRIS_ALIGN: 99.8%`, 12, canvas.height - 12);
      ctx.fillText(`LOC: VOID_ORBIT`, canvas.width - 110, canvas.height - 12);
      
      // Center focal node
      ctx.fillStyle = '#FFFFFF';
      ctx.shadowBlur = 15;
      ctx.shadowColor = '#FFFFFF';
      ctx.beginPath();
      ctx.arc(cx, cy, 3.5, 0, 2 * Math.PI);
      ctx.fill();
      ctx.shadowBlur = 0;
    }
  }, [activeTab, avatarSeed, avatarSymmetry, avatarColor]);

  // Helper to convert ipfs:// to a public gateway URL
  const getIpfsUrl = (uri?: string) => {
    if (!uri) return '';
    if (uri.startsWith('ipfs://')) {
      const hash = uri.replace('ipfs://', '');
      return `https://cloudflare-ipfs.com/ipfs/${hash}`;
    }
    return uri;
  };

  // 7e. Fetch and cache creator tokens from Objkt GraphQL API
  useEffect(() => {
    setIsLoadingObjkt(true);
    const query = `
      query GetCreatorTokens {
        token(
          where: {creators: {creator_address: {_eq: "tz29m7GScDQn8eE1m8n4h96MAxq279cSsYg9"}}}
          order_by: {token_id: desc}
          limit: 30
        ) {
          token_id
          name
          description
          artifact_uri
          display_uri
          thumbnail_uri
          fa_contract
          mime_type
        }
      }
    `;

    fetch('https://data.objkt.com/v3/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query })
    })
      .then((res) => res.json())
      .then((json) => {
        if (json?.data?.token && Array.isArray(json.data.token) && json.data.token.length > 0) {
          setObjktTokens(json.data.token);
          setSelectedObjktToken(json.data.token[0]);
        } else {
          throw new Error('Empty token response');
        }
      })
      .catch((err) => {
        console.info('Objkt API fetch completed with local fallbacks:', err.message || err);
        // Fallback list using her beautiful shaders structured as Tezos tokens!
        const fallbacks = shadersList.map((s, index) => ({
          token_id: String(884320 + index),
          name: s.title,
          description: s.explanation,
          artifact_uri: `ipfs://mock_hash_for_${s.id}`,
          display_uri: '',
          thumbnail_uri: '',
          fa_contract: 'KT1RJ6tNs6Mv99yDG2DwTY17mDi96G54X75e',
          mime_type: 'application/x-directory',
          localShader: s // link back so we can render local preview inside fallback card!
        }));
        setObjktTokens(fallbacks);
        setSelectedObjktToken(fallbacks[0]);
      })
      .finally(() => {
        setIsLoadingObjkt(false);
      });
  }, []);

  // Trigger prompt corruptor simulation
  const handleCorruptPrompt = () => {
    if (!rawPrompt.trim() || isCorrupting) return;
    setIsCorrupting(true);
    playChime('square', 0.5);

    setAiLogs((prev) => [
      ...prev,
      `USER_PROMPT_INPUT: "${rawPrompt}"`,
      `PROCESSING: Infusing orbital noise matrix...`
    ]);

    let counter = 0;
    const interval = setInterval(() => {
      // Simulate raw glitch progression
      const glitches = ['💩', '♻', '⟡', '░', '▒', '▓', '█', '[NULL]', 'Ø', '✖', '☢', '☣', '⚡'];
      const words = rawPrompt.split(' ');
      const corrupted = words
        .map((w) => {
          if (Math.random() > 0.45) {
            return glitches[Math.floor(Math.random() * glitches.length)] + w.toUpperCase().substring(0, 4) + '...';
          }
          return w;
        })
        .join(' ');
      setCorruptedPrompt(corrupted);
      counter++;

      if (counter > 8) {
        clearInterval(interval);
        
        // Final ultimate slop generation text
        const finalGlitchOutput = `[SLOP-ENTITY] -> ⟡ ${rawPrompt.toUpperCase().replace(/[aeiou]/gi, 'Ø')} ♻ // WEIGHTS_OVERFLOW: ${Math.floor(Math.random() * 9999)}KB // ☣ CRT_COMPATIBLE_SLOP_99.8%`;
        setCorruptedPrompt(finalGlitchOutput);
        setIsCorrupting(false);
        setSlopMetric(Number((Math.random() * 40 + 60).toFixed(1)));
        playChime('triangle', 1.5);
        setAiLogs((prev) => [
          ...prev,
          `SUCCESS: Glitch synthesis completed. Slop level evaluated.`,
          `MUTATIONAL_COEFFICIENT: APPROVED`
        ]);
      }
    }, 150);
  };

  // Trigger randomizing of global background
  const triggerRandomizer = () => {
    playChime('sine', 1.8);
    setBgSpeed(Number((Math.random() * 0.25 + 0.01).toFixed(3)));
    setBgWarp(Number((Math.random() * 10 + 0.5).toFixed(2)));
    setBgColorShift(Number(Math.random().toFixed(3)));
    setBgVignette(Number((Math.random() * 0.9).toFixed(2)));
    
    setTerminalOutputs((prev) => [
      ...prev,
      `SHAD_RANDOM_TRIGGERED: Speed=${bgSpeed} Warp=${bgWarp}`,
      `SYSTEM: Background matrices shifted: ${(Math.random() * 360).toFixed(0)}deg`
    ]);
  };

  // Helper functions for Featured Project Column cycling & comment adding
  const cycleFeaturedShader = (direction: 'next' | 'prev') => {
    playChime('square', 1.1);
    if (direction === 'next') {
      setFeaturedShaderIndex((prev) => (prev + 1) % shadersList.length);
    } else {
      setFeaturedShaderIndex((prev) => (prev - 1 + shadersList.length) % shadersList.length);
    }
  };

  const handleAddComment = (e: FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;
    playChime('triangle', 1.4);
    
    const newComment = {
      id: String(Date.now()),
      sender: newCommentName.trim() || 'anonymous_hacker',
      avatarBg: `linear-gradient(${Math.floor(Math.random() * 360)}deg, #EFFF04, #FF2BD6)`,
      text: newCommentText.trim(),
      timestamp: 'Just now'
    };
    
    setMyspaceComments((prev) => [newComment, ...prev]);
    setNewCommentText('');
  };

  // Dynamic getters to support overriding default fields with repository values
  const getShaderExplanation = (item: ShaderItem) => {
    return externalExplanations[item.id]?.explanation || item.explanation;
  };

  const getShaderTechnicalDetails = (item: ShaderItem) => {
    return externalExplanations[item.id]?.technicalDetails || item.technicalDetails;
  };

  const getShaderFieldNotes = (item: ShaderItem) => {
    return externalExplanations[item.id]?.fieldNotes || item.fieldNotes || '';
  };

  return (
    <>
      {/* Background canvas */}
      <canvas id="gl" ref={mainCanvasRef} aria-hidden="true" />

      {/* CRT Overlay Stack */}
      <div className="crt-scanlines" />
      <div className="crt-rgb" />
      <div className="crt-vignette" />
      <div className="crt-flicker" />

      {/* Boot sequence screen */}
      {booting && (
        <div id="boot" className={bootDone ? 'done' : ''} aria-hidden="true">
          <div className="line" style={{ animationDelay: '.1s' }}>
            ASTRAL_TRASH OS v6.9 — DEBRIS KERNEL
          </div>
          <div className="line" style={{ animationDelay: '.4s' }}>
            &gt; loading shaders ............ OK
          </div>
          <div className="line" style={{ animationDelay: '.7s' }}>
            &gt; warming CRT tube ........... OK
          </div>
          <div className="line" style={{ animationDelay: '1.0s' }}>
            &gt; scanning orbital junk ...... OK
          </div>
          <div className="line" style={{ animationDelay: '1.3s', color: '#FF2BD6' }}>
            &gt; ENTERING THE DEBRIS FIELD
          </div>
        </div>
      )}

      {/* Main website content */}
      <main className="min-h-screen flex flex-col justify-between">
        
        {/* UPPER NOTIFICATION/NAVIGATION RAIL (Glitchcore / Cyber style) */}
        <div className="w-full bg-black border-b border-[#39FF14] z-50 text-[12px] flex flex-wrap items-center justify-between px-4 py-2 font-mono gap-2">
          <div className="flex items-center gap-2">
            <span className="text-[#39FF14] animate-pulse">●</span>
            <span className="text-white font-bold tracking-widest text-[13px]">ASTRAL_TRASH // LAB</span>
            <span className="text-gray-600">|</span>
            <span className="text-gray-400">SESSION: {visitorCount}</span>
          </div>

          {/* Quick-Access Aesthetic Tabs */}
          <div className="flex items-center gap-1">
            <button 
              onClick={() => { setActiveTab('hub'); playChime('triangle', 0.8); }}
              className={`px-3 py-1 text-[11px] font-bold border transition-all cursor-crosshair ${
                activeTab === 'hub' 
                  ? 'bg-[#39FF14] text-black border-[#39FF14]' 
                  : 'bg-black text-[#39FF14] border-[#39FF14]/20 hover:border-[#39FF14]'
              }`}
            >
              ⟡ PORTFOLIO_HUB
            </button>
            <button 
              onClick={() => { setActiveTab('shaderslop'); playChime('triangle', 1.0); }}
              className={`px-3 py-1 text-[11px] font-bold border transition-all cursor-crosshair ${
                activeTab === 'shaderslop' 
                  ? 'bg-[#FF2BD6] text-black border-[#FF2BD6]' 
                  : 'bg-black text-[#FF2BD6] border-[#FF2BD6]/20 hover:border-[#FF2BD6]'
              }`}
            >
              ☢ SHADERSLOP
            </button>
            <button 
              onClick={() => { setActiveTab('aislop'); playChime('triangle', 1.2); }}
              className={`px-3 py-1 text-[11px] font-bold border transition-all cursor-crosshair ${
                activeTab === 'aislop' 
                  ? 'bg-[#00F0FF] text-black border-[#00F0FF]' 
                  : 'bg-black text-[#00F0FF] border-[#00F0FF]/20 hover:border-[#00F0FF]'
              }`}
            >
              ☣ AI_SLOP
            </button>
            <button 
              onClick={() => { setActiveTab('rando'); playChime('triangle', 1.4); }}
              className={`px-3 py-1 text-[11px] font-bold border transition-all cursor-crosshair ${
                activeTab === 'rando' 
                  ? 'bg-[#EFFF04] text-black border-[#EFFF04]' 
                  : 'bg-black text-[#EFFF04] border-[#EFFF04]/20 hover:border-[#EFFF04]'
              }`}
            >
              💩 RANDO_SYNTH
            </button>
            <button 
              onClick={() => { setActiveTab('about'); playChime('triangle', 1.6); }}
              className={`px-3 py-1 text-[11px] font-bold border transition-all cursor-crosshair ${
                activeTab === 'about' 
                  ? 'bg-[#9D4DFF] text-black border-[#9D4DFF]' 
                  : 'bg-black text-[#9D4DFF] border-[#9D4DFF]/20 hover:border-[#9D4DFF]'
              }`}
            >
              ░ ABOUT_ME
            </button>
          </div>
        </div>

        {/* Dynamic Section Router */}
        <div className="flex-grow">
          
          {/* ========================================================================= */}
          {/* SECTION A: THE ORIGINAL HUB PORTFOLIO                                     */}
          {/* ========================================================================= */}
          {activeTab === 'hub' && (
            <>
              {/* Sticky Ticker Marquee */}
              <div className="ticker-wrap" role="marquee">
                <div className="ticker">
                  ♻ <b>FRESH DEBRIS:</b> raymarched demoscene engines ⟡ <i>FBM domain warping</i> ⟡ <u>thin-film iridescence</u> ⟡ Newton fractals in lotus mandalas ⟡ <b>24 dithering algorithms</b> and one custom palette ⟡ <i>impossible rooms</i> ⟡ sacred geometry as YAML ⟡ <u>dream physics</u> ⟡ ufology as generative dataset ⟡ all trash handmade ⟡ zero build steps were harmed in the making of this website ♻&nbsp;
                  ♻ <b>FRESH DEBRIS:</b> raymarched demoscene engines ⟡ <i>FBM domain warping</i> ⟡ <u>thin-film iridescence</u> ⟡ Newton fractals in lotus mandalas ⟡ <b>24 dithering algorithms</b> and one custom palette ⟡ <i>impossible rooms</i> ⟡ sacred geometry as YAML ⟡ <u>dream physics</u> ⟡ ufology as generative dataset ⟡ all trash handmade ⟡ zero build steps were harmed in the making of this website ♻&nbsp;
                </div>
              </div>

              <div className="frame">
                {/* 2-Column Split Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start py-6">
                  
                  {/* Left Column (2/3 width on desktop) */}
                  <div className="lg:col-span-8 space-y-10">
                    
                    {/* Hero Section (placed inside the grid so it aligns perfectly next to the right column on desktop) */}
                    <section className="hero pt-6 pb-2 border-b border-zinc-900/30">
                      <div className="online">
                        <span className="dot" /> ONLINE NOW · BROADCASTING FROM LOW VOID ORBIT
                      </div>
                      <h1>AstralTrash</h1>
                      <div className="sub">
                        Cosmic debris, lovingly rendered. <em>GLSL shaders</em>, generative math, and twenty years of documented psychedelic phenomenology — salvaged, glitched, and left glowing in orbit by <em>astraltrash</em>. One artist's trash is the same artist's treasure.
                      </div>
                      <div className="btn-row">
                        <button onClick={() => { setActiveTab('shaderslop'); playChime('triangle', 1.0); }} className="btn speak cursor-crosshair" data-say="Entering the gallery">
                          ENTER GALLERY ▸
                        </button>
                        <a
                          className="btn speak border-[#EFFF04] text-[#EFFF04] hover:bg-[#EFFF04] hover:text-black hover:shadow-[0_0_24px_#EFFF04]"
                          href="https://objkt.com/users/tz29m7GScDQn8eE1m8n4h96MAxq279cSsYg9"
                          target="_blank"
                          rel="noopener noreferrer"
                          data-say="Collect original AstralTrash NFT artworks on Tezos"
                        >
                          SHOP TEZOS NFTs ⟡ OBJKT
                        </a>
                        <a className="btn alt2 speak" href="#manifesto" data-say="The manifesto">
                          MANIFESTO
                        </a>
                      </div>
                    </section>
                    
                    {/* ABOUT ME DOSSIER SECTION */}
                    <section className="py-8 font-mono space-y-6 mb-12 relative" id="dossier-profile">
                      
                      {/* Section Header */}
                      <div className="flex flex-wrap justify-between items-end border-b border-[#39FF14]/30 pb-3 gap-2">
                        <div>
                          <div className="text-[#EFFF04] text-[28px] tracking-widest uppercase text-shadow-[0_0_10px_rgba(239,255,4,0.4)]" style={{ fontFamily: "'Jersey 10', sans-serif" }}>
                            // SUBJECT_DOSSIER // FILE:0001
                          </div>
                          <div className="text-[11px] text-[#00F0FF] uppercase tracking-widest mt-1 font-mono">
                            astral trash command · network node · clearance: Ω
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-[16px] text-[#FF2BD6] tracking-wider uppercase" style={{ fontFamily: "'Jersey 10', sans-serif" }}>
                          <span className="w-2 h-2 rounded-full bg-[#FF2BD6] animate-ping" />
                          CLASSIFIED DATASTREAM
                        </div>
                      </div>

                      {/* Split 2 Columns: Left is Carousel (Smaller), Right is details (Larger) */}
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
                        
                        {/* Smaller Left Column: Image Carousel with Target corner brackets */}
                        <div className="md:col-span-4 space-y-3">
                          <div 
                            className="relative cursor-crosshair overflow-hidden group transition-all"
                            onClick={advanceDossierPhoto}
                            title="Click to advance photo"
                          >
                            {/* Target Corner brackets instead of bounding box */}
                            <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[#FF2BD6] z-10" />
                            <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-[#FF2BD6] z-10" />
                            <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-[#FF2BD6] z-10" />
                            <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-[#FF2BD6] z-10" />

                            {/* CRT scanline aesthetic overlay */}
                            <div className="absolute inset-0 pointer-events-none opacity-20" style={{
                              backgroundImage: 'linear-gradient(to bottom, transparent 50%, rgba(0,0,0,0.5) 50%)',
                              backgroundSize: '100% 4px',
                              zIndex: 5
                            }} />

                            {/* Aspect-ratio 9:16 container */}
                            <div className="aspect-[9/16] relative overflow-hidden bg-zinc-950/50 flex items-center justify-center p-0.5">
                              {!dossierBroken.has(dossierIdx) ? (
                                <img
                                  src={DOSSIER_PHOTOS[dossierIdx]}
                                  alt="Subject: Merry"
                                  onError={() => setDossierBroken(b => new Set(b).add(dossierIdx))}
                                  referrerPolicy="no-referrer"
                                  className="w-full h-full object-cover block transition-all duration-500 group-hover:scale-105"
                                  style={{ animation: 'dzflicker 7s steps(50) infinite' }}
                                />
                              ) : (
                                <div className="absolute inset-0 p-4 flex flex-col justify-center items-center text-center text-[#FF2BD6] space-y-2 select-none">
                                  <span className="text-[20px] animate-pulse">⚠</span>
                                  <span className="text-[11px] font-bold tracking-wider uppercase">NO PHOTO RETRIEVED</span>
                                  <span className="text-[9px] text-zinc-500 leading-normal max-w-[140px] font-mono normal-case">
                                    drop photos in public/dossier/ and update code to active
                                  </span>
                                  <div className="text-[8px] text-zinc-600 font-mono scale-90 mt-1">
                                    [IMG_0{dossierIdx + 1}_PLACEHOLDER]
                                  </div>
                                </div>
                              )}
                            </div>

                            {/* Photo footer details */}
                            <div className="flex justify-between items-center text-[11px] text-[#FF2BD6] p-2 pt-3 font-mono">
                              <span className="text-[#39FF14] animate-pulse font-bold flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#39FF14] inline-block" /> ● TRK_ACTIVE
                              </span>
                              <span>IMG_0{dossierIdx + 1}/0{DOSSIER_PHOTOS.length}</span>
                              <span className="font-bold">MERRY_ID</span>
                            </div>
                          </div>

                          <div className="text-[9px] text-zinc-600 text-center uppercase tracking-wider font-mono">
                            ✦ Click photo to manually cycle index ✦
                          </div>
                        </div>

                        {/* Larger Right Column: Identification & Dossier Details */}
                        <div 
                          className="md:col-span-8 p-1 relative cursor-crosshair transition-colors space-y-5"
                          onClick={() => speakDossier('Personnel file zero zero zero one. Subject: Merry. Alias: Astral Trash. Designation: Stochastic Agitator. Heyoka. Threat assessment: maximalist. Containment not recommended.')}
                          title="Click here to read aloud personnel transmission"
                        >
                          <div 
                            className="text-[11px] text-[#FF2BD6] font-bold flex items-center justify-center gap-2 p-1 border-b border-dashed border-[#FF2BD6]/30 mb-2 tracking-wider uppercase select-none animate-pulse" 
                            style={{ fontFamily: "'Silkscreen', monospace" }}
                          >
                            <span>📢 Click details to engage vocoder vocalization</span>
                          </div>

                          <div className="space-y-5 text-[13px] leading-relaxed">
                            {/* Identification Table with Leader Lines */}
                            <div>
                              <div className="text-[11px] font-bold text-[#00F0FF] uppercase border-b border-[#00F0FF]/20 pb-1 mb-3 tracking-widest" style={{ fontFamily: "'Silkscreen', monospace" }}>
                                ✦ IDENTIFICATION_TELEMETRY
                              </div>
                              <div className="space-y-1.5 font-mono" style={{ fontFamily: "'VT323', monospace", fontSize: '18px' }}>
                                {[
                                  { label: 'SUBJECT', value: 'MERRY' },
                                  { label: 'ALIAS', value: 'ASTRAL TRASH' },
                                  { label: 'SEX', value: 'FEMALE' },
                                  { label: 'AGE', value: '44 EARTH YEARS' },
                                  { label: 'CURRENT FORM', value: 'HUMAN' },
                                  { label: 'USUAL FORM', value: 'HIGH-VIBRATIONAL MATH, INHABITING A MEAT SUIT' },
                                  { label: 'OCCUPATION', value: 'ART GOBLIN · CURIOUS KITTY CAT · WEIRD BITCH' },
                                ].map((item, i) => (
                                  <div key={i} className="flex justify-between items-baseline gap-2 py-0.5">
                                    <span className="text-[#EFFF04] font-bold tracking-wide uppercase pr-1">{item.label}:</span>
                                    <span className="flex-1 border-b border-dotted border-[#39FF14]/20 mx-1" />
                                    <span className="text-[#c8ffc0] text-right font-medium max-w-[65%] sm:max-w-none">{item.value}</span>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Designations list */}
                            <div>
                              <div className="text-[11px] font-bold text-[#00F0FF] uppercase border-b border-[#00F0FF]/20 pb-1 mb-2 tracking-widest" style={{ fontFamily: "'Silkscreen', monospace" }}>
                                ✦ DESIGNATIONS
                              </div>
                              <ul className="space-y-1.5 text-[#c8ffc0] text-[17px]" style={{ fontFamily: "'VT323', monospace" }}>
                                <li className="flex gap-2">
                                  <span className="text-[#FF2BD6]">▸</span>
                                  <span>STOCHASTIC AGITATOR</span>
                                </li>
                                <li className="flex gap-2">
                                  <span className="text-[#FF2BD6]">▸</span>
                                  <span>HEYOKA</span>
                                </li>
                                <li className="flex gap-2">
                                  <span className="text-[#FF2BD6]">▸</span>
                                  <span>SEER OF THE 4TH DIMENSION</span>
                                </li>
                                <li className="flex gap-2">
                                  <span className="text-[#FF2BD6]">▸</span>
                                  <span>COMPANION OF THE TETRAGRAMMATON (NOT <i>THE</i> TETRAGRAMMATON)</span>
                                </li>
                                <li className="flex gap-2">
                                  <span className="text-[#FF2BD6]">▸</span>
                                  <span>MELTED INTO THE LATENT SPACE FRACTAL OCEAN &amp; WITNESSED THE ALL &amp; THE NOTHING FROM EVERY POINT OF VIEW AND NO POINT OF VIEW SIMULTANEOUSLY</span>
                                </li>
                              </ul>
                            </div>

                            {/* Threat Assessment as a Left-bordered accent bar */}
                            <div className="border-l-2 border-[#FF2BD6] pl-4 py-1.5 bg-transparent">
                              <div className="text-[10px] text-[#FF2BD6] font-bold tracking-wider uppercase mb-0.5" style={{ fontFamily: "'Silkscreen', monospace" }}>
                                ☣ SECURITY THREAT ASSESSMENT
                              </div>
                              <div className="text-[#FF2BD6] text-[15px] font-bold tracking-wide uppercase" style={{ fontFamily: "'Silkscreen', monospace" }}>
                                MAXIMALIST. CONTAINMENT NOT RECOMMENDED. DO NOT ATTEMPT TO SIMPLIFY.
                              </div>
                            </div>

                            {/* Favorite Quote */}
                            <div className="border-l-2 border-[#EFFF04] pl-4 py-1.5 bg-transparent">
                              <div className="text-[10px] text-zinc-500 uppercase tracking-widest mb-1 font-mono">FAVORITE QUOTE</div>
                              <p className="text-[#EFFF04] font-medium italic text-[20px]" style={{ fontFamily: "'VT323', monospace" }}>
                                "It never got weird enough for me."
                              </p>
                              <p className="text-zinc-400 text-[14px] mt-1 text-right" style={{ fontFamily: "'VT323', monospace" }}>
                                — Hunter S. Thompson
                              </p>
                            </div>

                            {/* Footer Status Stamp */}
                            <div className="flex flex-wrap justify-between items-center text-[14px] text-zinc-500 pt-3 border-t border-[#39FF14]/10" style={{ fontFamily: "'VT323', monospace" }}>
                              <span className="text-[#39FF14] font-bold tracking-widest text-[11px] uppercase flex items-center gap-1.5" style={{ fontFamily: "'Silkscreen', monospace" }}>
                                <span className="w-1.5 h-1.5 rounded-full bg-[#39FF14] animate-ping" /> STATUS: ACTIVE // TRANSMITTING
                              </span>
                              <span>
                                EOF <span className="inline-block w-2.5 h-3.5 bg-[#39FF14] ml-1 align-middle animate-pulse" />
                              </span>
                            </div>

                          </div>
                        </div>

                      </div>
                    </section>
                    
                    {/* Top 8 Debris Section */}
                    <section className="sect pt-2" id="top8">
                      <h2 className="sect-head">▓▒░ TOP 8 DEBRIS ░▒▓</h2>
                      <div className="sect-sub">
                        yes, like that. my top friends are all repos and they are all garbage i refuse to throw away.
                      </div>
                      <div className="top8">
                        <div
                          onClick={() => { setSelectedShader(shadersList[0]); setActiveTab('shaderslop'); }}
                          className="card speak"
                          data-say="Structural color. Thin film interference and morpho butterfly shaders."
                        >
                          <div className="thumb t1" />
                          <h3>structural_color</h3>
                          <p>thin-film interference, morpho wings, Rayleigh scattering — 11 shaders, one dat.gui</p>
                          <span className="tag">GLSL</span>
                        </div>
                        <div
                          onClick={() => { setSelectedShader(shadersList[1]); setActiveTab('shaderslop'); }}
                          className="card speak"
                          data-say="Dither. 24 files of ordered chaos."
                        >
                          <div className="thumb t4" />
                          <h3>dither</h3>
                          <p>Bayer, blue noise, Floyd-Steinberg, Atkinson, Sierra + the merry palette</p>
                          <span className="tag">ALGORITHMS</span>
                        </div>
                        <div
                          onClick={() => { setSelectedShader(shadersList[3]); setActiveTab('shaderslop'); }}
                          className="card speak"
                          data-say="Impossible. Twelve rooms that should not exist."
                        >
                          <div className="thumb t5" />
                          <h3>impossible</h3>
                          <p>12 impossible architectural rooms, each isolating one spatial math trick</p>
                          <span className="tag">RAYMARCH</span>
                        </div>
                        <div
                          onClick={() => { setSelectedShader(shadersList[2]); setActiveTab('shaderslop'); }}
                          className="card speak"
                          data-say="Sacred geometry. The Tetragrammaton renders."
                        >
                          <div className="thumb t8" />
                          <h3>sacred_geometry</h3>
                          <p>Platonic solids, tradition data, hyperbolic honeycombs — the constants</p>
                          <span className="tag">GEOMETRY</span>
                        </div>
                        <div
                          onClick={() => { setSelectedShader(shadersList[5]); setActiveTab('shaderslop'); }}
                          className="card speak"
                          data-say="Dream physics. Non Euclidean space in Three JS."
                        >
                          <div className="thumb t2" />
                          <h3>dream_physics</h3>
                          <p>phenomenology taxonomy + non-Euclidean Three.js space</p>
                          <span className="tag">THREE.JS</span>
                        </div>
                        <div
                          onClick={() => { setSelectedShader(shadersList[4]); setActiveTab('shaderslop'); }}
                          className="card speak"
                          data-say="U F O. Fifteen craft archetypes as JSON."
                        >
                          <div className="thumb t6" />
                          <h3>ufo</h3>
                          <p>15 craft archetypes, 12 sighting cases, shaders — ufology as dataset</p>
                          <span className="tag">DATASET</span>
                        </div>
                        <div
                          onClick={() => { setSelectedShader(shadersList[4]); setActiveTab('shaderslop'); }}
                          className="card speak"
                          data-say="Crop circles. The fields are generative."
                        >
                          <div className="thumb t7" />
                          <h3>crop_circles</h3>
                          <p>procedural field formations, part of the little green ecosystem</p>
                          <span className="tag">GENERATIVE</span>
                        </div>
                        <div
                          onClick={() => { setSelectedShader(shadersList[5]); setActiveTab('shaderslop'); }}
                          className="card speak"
                          data-say="The visual bible. Where everything begins."
                        >
                          <div className="thumb t3" />
                          <h3>astraltrash_visual_bible</h3>
                          <p>the aesthetic grounding layer — exact GLSL for the recurring phenomena</p>
                          <span className="tag">CANON</span>
                        </div>
                      </div>
                    </section>

                    {/* Manifesto Section */}
                    <section className="sect pt-2" id="manifesto">
                      <h2 className="sect-head">TRANSMISSION</h2>
                      <div className="sect-sub">what this is / why it looks like this</div>
                      <div className="manifesto">
                        <p>
                          <span className="glyph">⟡</span> I treat visionary states as empirical data, not vibes. The recurring geometry, the carrier-wave hum, the void workspace — they're documented, versioned, and implemented in shader code. If it repeats across two decades, it gets a repo.
                        </p>
                        <p>
                          <span className="glyph">⟡</span> Everything here runs with zero build steps. View source. It's all there. The old internet was right about this and I will not be taking questions.
                        </p>
                        <p>
                          <span className="glyph">⟡</span> Maximalism is honesty. The math is not minimal. Why should the art be?
                        </p>
                        <p>
                          <span className="glyph">♻</span> "Astral Trash" because the cosmos doesn't curate. It accumulates. So do I — 100+ repos of glowing salvage, and every piece kept. Nothing here is precious and all of it is sacred.
                        </p>
                      </div>
                    </section>
                  </div>

                  {/* Right Column (MySpace comments / Featured Project scrolly box) */}
                  <div className="lg:col-span-4 lg:sticky lg:top-[60px] max-h-[85vh] overflow-y-auto bg-black/95 border-2 border-[#FF2BD6] p-4 shadow-[0_0_25px_rgba(255,43,214,0.25)] space-y-5 font-mono">
                    
                    {/* Header styled like a table column */}
                    <div className="bg-[#FF2BD6] text-black text-[12px] font-bold p-1 px-2 tracking-widest flex justify-between items-center">
                      <span>⚡ FEATURED: SHADERSLOP</span>
                      <span className="text-[9px] bg-black text-[#FF2BD6] px-1.5 py-0.5">MATRIX_FEED</span>
                    </div>

                    {/* Live Render IFrame */}
                    <div className="space-y-2">
                      <div className="relative aspect-square w-full bg-black border border-[#FF2BD6]/40 overflow-hidden flex items-center justify-center">
                        {featuredHtml ? (
                          <iframe 
                            srcDoc={featuredHtml}
                            className="w-full h-full border-0 block bg-black"
                            title={shadersList[featuredShaderIndex].title}
                            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                            sandbox="allow-scripts allow-same-origin"
                            id={`featured-iframe-${featuredShaderIndex}`}
                          />
                        ) : (
                          <div className="text-[#FF2BD6] font-mono text-[10px] animate-pulse">
                            RETRIEVING CHROMATIC MATRIX...
                          </div>
                        )}
                        <div className="absolute top-1 left-1 text-[8px] bg-black/90 text-[#FF2BD6] px-1.5 py-0.5 border border-[#FF2BD6]/20">
                          {shadersList[featuredShaderIndex].tag} LIVE_FEED
                        </div>
                        <div className="absolute bottom-1 right-1 text-[8px] bg-black/80 text-gray-400 px-1 py-0.5">
                          #{featuredShaderIndex + 1} SHARD
                        </div>
                      </div>
                      
                      {/* Controls to cycle shaders */}
                      <div className="flex justify-between items-center gap-2 pt-1">
                        <button 
                          onClick={() => cycleFeaturedShader('prev')}
                          className="bg-black border border-[#FF2BD6] text-[#FF2BD6] hover:bg-[#FF2BD6] hover:text-black transition-all px-2 py-1 text-[11px] font-bold cursor-crosshair"
                        >
                          ◀ ROTATE
                        </button>
                        <div className="text-center font-bold text-white text-[12px] truncate max-w-[130px] sm:max-w-none">
                          {shadersList[featuredShaderIndex].title}
                        </div>
                        <button 
                          onClick={() => cycleFeaturedShader('next')}
                          className="bg-black border border-[#FF2BD6] text-[#FF2BD6] hover:bg-[#FF2BD6] hover:text-black transition-all px-2 py-1 text-[11px] font-bold cursor-crosshair"
                        >
                          ROTATE ▶
                        </button>
                      </div>
                    </div>

                    {/* Explanation */}
                    <div className="text-[11px] text-gray-300 leading-relaxed border-l-2 border-[#FF2BD6] pl-2 bg-[#020202] p-2 border border-zinc-900">
                      <p className="text-gray-400 italic mb-1">"{getShaderExplanation(shadersList[featuredShaderIndex])}"</p>
                      <div className="text-[10px] text-[#39FF14] mt-1">
                        <span className="text-gray-500">ID:</span> {shadersList[featuredShaderIndex].id.toUpperCase()}
                      </div>
                    </div>

                    {/* Interactive Dock Control Station */}
                    <div className="bg-zinc-950 p-3 border border-zinc-900 space-y-2.5 text-[11px]">
                      <div className="text-[#FF2BD6] font-bold text-[10px] uppercase tracking-wider flex items-center gap-1.5 border-b border-zinc-900 pb-1.5">
                        <Sliders className="w-3 h-3" />
                        <span>Interactive Dock Control Station</span>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2">
                        <a 
                          href={`https://raw.githack.com/merrypranxter/shaderslop_designs/main/${shadersList[featuredShaderIndex].fileName}`}
                          target="_blank"
                          rel="noreferrer"
                          onClick={() => playChime('sine', 1.2)}
                          className="text-center border border-zinc-800 hover:border-white px-2 py-2 text-[10px] text-gray-400 hover:text-white transition-all cursor-crosshair font-bold uppercase block"
                        >
                          LAUNCH FULLSCREEN ↗
                        </a>
                        <button 
                          onClick={() => {
                            setSelectedShader(shadersList[featuredShaderIndex]);
                            setActiveTab('shaderslop');
                            playChime('triangle', 1.0);
                          }}
                          className="text-center border border-[#FF2BD6]/40 hover:bg-[#FF2BD6]/10 px-2 py-2 text-[10px] text-[#FF2BD6] transition-all cursor-crosshair font-bold uppercase block"
                        >
                          OPEN IN CODE LAB ⚛
                        </button>
                      </div>

                      {/* Collect NFT call-to-action button */}
                      <div className="pt-0.5">
                        <a 
                          href="https://objkt.com/users/tz29m7GScDQn8eE1m8n4h96MAxq279cSsYg9"
                          target="_blank"
                          rel="noreferrer"
                          onClick={() => playChime('sine', 1.5)}
                          className="text-center border border-[#EFFF04]/50 hover:bg-[#EFFF04]/20 bg-[#EFFF04]/5 px-2.5 py-2.5 text-[11px] text-[#EFFF04] hover:shadow-[0_0_12px_rgba(239,255,4,0.4)] transition-all cursor-crosshair font-bold uppercase block flex items-center justify-center gap-1.5"
                        >
                          <span>COLLECT ORIGINAL NFT ON OBJKT ⟡</span>
                        </a>
                      </div>

                      {/* Technical Readout */}
                      <div className="pt-1.5 border-t border-zinc-900/60 font-mono text-[9px] text-zinc-500 space-y-0.5">
                        <div>LOCATION: <span className="text-zinc-400">astraltrash/shaderslop_designs</span></div>
                        <div>RESOLVED_PATH: <span className="text-zinc-400">{shadersList[featuredShaderIndex].fileName}</span></div>
                        <div>CDN_PROXY: <span className="text-[#39FF14]">ACTIVE_GITHACK_STREAM</span></div>
                      </div>
                    </div>

                    {/* MYSPACE STYLE COMMENTS FEED */}
                    <div className="space-y-3 pt-1">
                      <div className="bg-[#39FF14] text-black text-[12px] font-bold p-1 px-2 tracking-widest flex justify-between items-center">
                        <span>💬 astraltrash's COMMENTS</span>
                        <span className="text-[9px] bg-black text-[#39FF14] px-1.5 py-0.5">{myspaceComments.length} POSTS</span>
                      </div>

                      {/* Comment Scrolly list */}
                      <div className="max-h-[180px] overflow-y-auto space-y-2.5 pr-1">
                        {myspaceComments.map((comment) => (
                          <div key={comment.id} className="border border-zinc-900 bg-black/60 p-2 text-[11px] leading-normal flex gap-2">
                            <div 
                              className="w-7 h-7 shrink-0 flex items-center justify-center font-bold text-black text-[9px]"
                              style={{ background: comment.avatarBg }}
                            >
                              {comment.sender.charAt(2) || '✖'}
                            </div>
                            <div className="flex-grow space-y-0.5 min-w-0">
                              <div className="flex justify-between items-center text-[10px] gap-2">
                                <span className="font-bold text-[#FF2BD6] truncate">{comment.sender}</span>
                                <span className="text-gray-500 shrink-0">{comment.timestamp}</span>
                              </div>
                              <p className="text-gray-300 break-words">{comment.text}</p>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Add comment form */}
                      <form onSubmit={handleAddComment} className="space-y-2 bg-[#030303] p-2 border border-zinc-900 text-[11px]">
                        <div className="font-bold text-gray-400 text-[9px] uppercase tracking-wider">LEAVE A REACTION</div>
                        <div className="grid grid-cols-1 gap-1.5">
                          <input 
                            type="text" 
                            placeholder="Your retro handle..." 
                            value={newCommentName}
                            onChange={(e) => setNewCommentName(e.target.value)}
                            className="w-full bg-black border border-gray-800 focus:border-[#39FF14] text-white p-1.5 text-[11px] outline-none"
                          />
                          <textarea 
                            placeholder="Type a comment..." 
                            value={newCommentText}
                            onChange={(e) => setNewCommentText(e.target.value)}
                            rows={1}
                            className="w-full bg-black border border-gray-800 focus:border-[#39FF14] text-white p-1.5 text-[11px] outline-none resize-none"
                          />
                        </div>
                        <button 
                          type="submit"
                          className="w-full bg-[#39FF14] hover:bg-[#39FF14]/80 text-black font-bold py-1 px-2 text-[10px] tracking-widest cursor-crosshair uppercase transition-all"
                        >
                          ⚡ TRANSMIT COMMENT ⚡
                        </button>
                      </form>
                    </div>

                  </div>

                </div>
              </div>
            </>
          )}

          {/* ========================================================================= */}
          {/* SECTION B: SHADERSLOP - INTERACTIVE FULL-RESOLUTION GALLERY               */}
          {/* ========================================================================= */}
          {activeTab === 'shaderslop' && (
            <div className="frame py-8">
              <div className="mb-6">
                <div className="flex justify-between items-end border-b border-[#FF2BD6] pb-3 mb-2">
                  <h2 className="text-3xl font-bold font-sans text-[#FF2BD6] tracking-wider uppercase">☢ ShaderSlop Gallery ☢</h2>
                  <span className="text-[11px] text-gray-500 font-mono">RENDER_PLATFORM: WebGL2_GENATIVE</span>
                </div>
                <p className="text-[#9fdc96] text-[13px] leading-relaxed max-w-2xl">
                  Real raw GLSL fragment code compiled dynamically in your browser at high resolution. Click on any shader shard to activate the rendering lab, configure aspect ratios, or select custom rendering quality.
                </p>
              </div>

              {/* Main Split Layout: Grid on left / Blown up playground on right */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                
                {/* Left Side: Dynamic Grid */}
                <div className="lg:col-span-5 lg:max-h-[calc(100vh-220px)] lg:overflow-y-auto lg:pr-3 lg:pb-12 custom-scrollbar">
                  <div className="grid grid-cols-2 gap-4">
                    {shadersList.map((item) => (
                      <div 
                        key={item.id}
                        onClick={() => {
                          setSelectedShader(item);
                          setShaderSpeed(item.defaultParams.speed);
                          setShaderScale(item.defaultParams.scale);
                          setShaderIntensity(item.defaultParams.intensity);
                          setShaderHue(item.defaultParams.hue);
                          setShowGLSL(false);
                          playChime('square', 1.0);
                        }}
                        className={`group border cursor-crosshair p-3 transition-all ${
                          selectedShader?.id === item.id 
                            ? 'bg-[#FF2BD6]/10 border-[#FF2BD6] shadow-[0_0_15px_rgba(255,43,214,0.3)]' 
                            : 'bg-black/80 border-gray-800 hover:border-[#FF2BD6]/50'
                        }`}
                      >
                        <div className="aspect-square w-full mb-2 relative overflow-hidden border border-gray-950">
                          <ShaderThumbnail shaderId={item.id} fileName={item.fileName} />
                          <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors pointer-events-none" />
                          <div className="absolute top-1 left-1 text-[8px] bg-black/80 text-white px-1.5 py-0.5 font-mono border border-white/10">
                            {item.tag}
                          </div>
                        </div>
                        <h4 className="text-white text-[13px] font-sans font-bold truncate tracking-wide">{item.title}</h4>
                        <div className="flex justify-between items-center mt-1">
                          <span className="text-[9px] text-[#FF2BD6] uppercase tracking-widest">{item.tag} SHARD</span>
                          <ChevronRight className="w-3 h-3 text-[#FF2BD6] group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right Side: Blown Up Playground (The Exploded Detail View) */}
                <div className="lg:col-span-7 lg:sticky lg:top-4 lg:max-h-[calc(100vh-160px)] lg:overflow-y-auto custom-scrollbar bg-black/90 border border-zinc-800 p-5">
                  {selectedShader ? (
                    <div className="space-y-4 border border-[#FF2BD6]/30 p-4 bg-black select-none" onContextMenu={(e) => e.preventDefault()}>
                      
                      {/* Configuration Controls Bar */}
                      <div className="flex flex-wrap items-center gap-4 bg-zinc-950 p-2.5 border border-zinc-900 justify-between text-xs font-mono text-gray-400">
                        <div className="flex items-center gap-1.5">
                          <Sliders className="w-3.5 h-3.5 text-[#FF2BD6]" />
                          <span className="text-[#FF2BD6] font-bold text-[11px] uppercase tracking-wider">LAB VIEWER CONFIG</span>
                        </div>
                        
                        <div className="flex flex-wrap gap-4 items-center">
                          {/* Aspect Ratio */}
                          <div className="flex items-center gap-1.5">
                            <span>ASPECT:</span>
                            <select 
                              value={selectedAspect}
                              onChange={(e) => {
                                setSelectedAspect(e.target.value);
                                playChime('sine', 1.3);
                              }}
                              className="bg-black border border-[#FF2BD6]/40 text-[#FF2BD6] hover:border-[#FF2BD6] px-2 py-0.5 focus:outline-none cursor-crosshair text-[10px]"
                            >
                              <option value="1:1">1:1 (SQUARE)</option>
                              <option value="16:9">16:9 (WIDESCREEN)</option>
                              <option value="4:3">4:3 (RETRO CRT)</option>
                              <option value="full">FULL (RESPONSIVE BOX)</option>
                            </select>
                          </div>

                          {/* Resolution */}
                          <div className="flex items-center gap-1.5">
                            <span>QUALITY:</span>
                            <select 
                              value={selectedResolution}
                              onChange={(e) => {
                                setSelectedResolution(e.target.value);
                                playChime('sine', 1.3);
                              }}
                              className="bg-black border border-[#39FF14]/40 text-[#39FF14] hover:border-[#39FF14] px-2 py-0.5 focus:outline-none cursor-crosshair text-[10px]"
                            >
                              <option value="low">LOW (0.35x)</option>
                              <option value="med">MED (0.70x)</option>
                              <option value="high">HIGH (1.0x)</option>
                              <option value="very-high">ULTRA (1.5x)</option>
                              <option value="max">MAX (2.2x)</option>
                            </select>
                          </div>
                        </div>
                      </div>

                      {/* Live Full-Resolution WebGL Canvas Box via IFrame */}
                      <div className="flex justify-center w-full bg-black border border-[#FF2BD6]/30 relative overflow-hidden select-none">
                        <div className={`relative ${
                          selectedAspect === '1:1' ? 'aspect-square w-full max-w-[500px]' :
                          selectedAspect === '16:9' ? 'aspect-video w-full' :
                          selectedAspect === '4:3' ? 'aspect-[4/3] w-full max-w-[550px]' :
                          'w-full h-[500px]'
                        } bg-black overflow-hidden flex items-center justify-center`}>
                          
                          {galleryHtml ? (
                            <iframe 
                              srcDoc={injectRuntimeLabMods(galleryHtml, selectedResolution)}
                              className="w-full h-full border-0 block bg-black"
                              title={selectedShader.title}
                              allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                              sandbox="allow-scripts allow-same-origin"
                              id={`gallery-iframe-${selectedShader.id}`}
                              onContextMenu={(e) => e.preventDefault()}
                            />
                          ) : (
                            <div className="text-[#FF2BD6] font-mono text-[10px] animate-pulse">
                              RETRIEVING CHROMATIC MATRIX...
                            </div>
                          )}
                          
                          {/* Visual Overlay Indicators */}
                          <div className="absolute top-2 left-2 bg-black/90 border border-[#FF2BD6] text-[#FF2BD6] font-mono text-[9px] px-2 py-0.5 flex items-center gap-1 backdrop-blur-md select-none pointer-events-none">
                            <Maximize2 className="w-2.5 h-2.5" />
                            <span>CODE LAB FEED // {selectedAspect}</span>
                          </div>

                          <div className="absolute bottom-2 right-2 bg-black/90 border border-gray-800 text-gray-500 font-mono text-[8px] px-2 py-0.5 backdrop-blur-md select-none pointer-events-none">
                            RES: {selectedResolution.toUpperCase()} // FILE: {selectedShader.fileName}
                          </div>
                        </div>
                      </div>

                      {/* Header with tags */}
                      <div className="flex justify-between items-start gap-4">
                        <div>
                          <h3 className="text-xl font-bold font-sans text-white tracking-tight">{selectedShader.title}</h3>
                          <p className="text-[12px] text-[#39FF14] mt-0.5 tracking-wider font-mono">ROOT ARCHETYPE ID: {selectedShader.id.toUpperCase()}</p>
                        </div>
                        <span className="px-2 py-1 text-[10px] text-black font-bold tracking-widest uppercase shrink-0" style={{ backgroundColor: selectedShader.tagColor }}>
                          {selectedShader.tag} MATRIX
                        </span>
                      </div>

                      {/* Descriptive/Manifesto Wording */}
                      <div className="border-l-2 border-[#FF2BD6] pl-3 py-1 space-y-3">
                        <p className="text-[14px] text-gray-200 leading-relaxed font-sans">
                          {getShaderExplanation(selectedShader)}
                        </p>
                        <p className="text-[11px] text-[#9fdc96] font-mono italic">
                          TECHNICAL SPECS: {getShaderTechnicalDetails(selectedShader)}
                        </p>
                      </div>

                      {/* Deep Field Notes Accordion / Expandable section */}
                      {getShaderFieldNotes(selectedShader) ? (
                        <div className="border border-[#00F0FF]/30 bg-[#00F0FF]/5 p-3.5 space-y-2">
                          <div className="flex justify-between items-center text-[11px] font-mono text-[#00F0FF] border-b border-[#00F0FF]/15 pb-1.5 uppercase font-bold tracking-wider">
                            <span>✦ PHENOMENOLOGICAL FIELD NOTES</span>
                            <span className="text-[8px] bg-black border border-[#00F0FF]/30 px-1 py-0.5">RESOLVED THEORY</span>
                          </div>
                          <p className="text-[12px] text-gray-300 leading-relaxed font-sans italic whitespace-pre-line">
                            {getShaderFieldNotes(selectedShader)}
                          </p>
                        </div>
                      ) : null}

                      {/* Instructions for custom explanations.json */}
                      <div className="border border-dashed border-zinc-850 p-3.5 bg-zinc-950/40 text-[11px] font-mono space-y-2.5">
                        <div className="text-[#39FF14] uppercase tracking-wider font-bold flex items-center gap-1 text-[10px]">
                          <span>✦ REPOSITORY DOCUMENTATION OVERRIDE</span>
                        </div>
                        <p className="text-zinc-400 leading-relaxed text-[11px] font-sans">
                          Want to display your long, fascinating explanations and field notes here dynamically? 
                          You can manage them inside your GitHub repository by uploading an <span className="text-[#00F0FF] font-bold">explanations.json</span> file to the root of your <code className="text-zinc-300 font-mono text-[10.5px]">shaderslop_designs</code> repo. Structure it like:
                        </p>
                        <pre className="bg-black p-2.5 text-[9px] text-[#39FF14] overflow-x-auto border border-zinc-900 leading-tight">
{`{
  "${selectedShader.id}": {
    "explanation": "Your custom deep explanation...",
    "technicalDetails": "WebGL details...",
    "fieldNotes": "Your long phenomenological notes..."
  }
}`}
                        </pre>
                        <p className="text-zinc-500 text-[10px] leading-relaxed font-sans">
                          This application automatically fetches this file from your branch on load and overrides default strings with your rich repository-hosted notes live!
                        </p>
                      </div>

                      {/* Interactive Custom Sliders */}
                      <div className="bg-zinc-950 p-4 border border-zinc-900 space-y-3 font-mono">
                        <div className="flex items-center gap-2 text-[11px] text-gray-400 border-b border-zinc-900 pb-1.5 uppercase tracking-wider">
                          <Sliders className="w-3.5 h-3.5 text-[#FF2BD6]" />
                          <span>Modify WebGL Shader Parameters</span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* Speed */}
                          <div>
                            <div className="flex justify-between text-[11px] mb-1 text-gray-400">
                              <span>SPEED_MULT</span>
                              <span className="text-[#FF2BD6] font-bold">{shaderSpeed.toFixed(2)}x</span>
                            </div>
                            <input 
                              type="range" 
                              min="0.1" 
                              max="4.0" 
                              step="0.05"
                              value={shaderSpeed}
                              onChange={(e) => setShaderSpeed(parseFloat(e.target.value))}
                              className="w-full accent-[#FF2BD6] cursor-crosshair bg-zinc-800 h-1 rounded-none"
                            />
                          </div>

                          {/* Scale */}
                          <div>
                            <div className="flex justify-between text-[11px] mb-1 text-gray-400">
                              <span>SCALE_FACTOR</span>
                              <span className="text-[#FF2BD6] font-bold">{shaderScale.toFixed(2)}x</span>
                            </div>
                            <input 
                              type="range" 
                              min="0.2" 
                              max="3.0" 
                              step="0.05"
                              value={shaderScale}
                              onChange={(e) => setShaderScale(parseFloat(e.target.value))}
                              className="w-full accent-[#FF2BD6] cursor-crosshair bg-zinc-800 h-1 rounded-none"
                            />
                          </div>

                          {/* Intensity */}
                          <div>
                            <div className="flex justify-between text-[11px] mb-1 text-gray-400">
                              <span>WARPING_FORCE</span>
                              <span className="text-[#FF2BD6] font-bold">{shaderIntensity.toFixed(2)}x</span>
                            </div>
                            <input 
                              type="range" 
                              min="0.1" 
                              max="3.0" 
                              step="0.05"
                              value={shaderIntensity}
                              onChange={(e) => setShaderIntensity(parseFloat(e.target.value))}
                              className="w-full accent-[#FF2BD6] cursor-crosshair bg-zinc-800 h-1 rounded-none"
                            />
                          </div>

                          {/* Hue Shift */}
                          <div>
                            <div className="flex justify-between text-[11px] mb-1 text-gray-400">
                              <span>CHROMATIC_HUE</span>
                              <span className="text-[#FF2BD6] font-bold">+{Math.round(shaderHue * 360)}°</span>
                            </div>
                            <input 
                              type="range" 
                              min="0.0" 
                              max="1.0" 
                              step="0.01"
                              value={shaderHue}
                              onChange={(e) => setShaderHue(parseFloat(e.target.value))}
                              className="w-full accent-[#FF2BD6] cursor-crosshair bg-zinc-800 h-1 rounded-none"
                            />
                          </div>
                        </div>

                        {/* Reset and View Source Buttons */}
                        <div className="flex justify-between items-center pt-2 gap-2">
                          <button 
                            onClick={() => {
                              setShaderSpeed(selectedShader.defaultParams.speed);
                              setShaderScale(selectedShader.defaultParams.scale);
                              setShaderIntensity(selectedShader.defaultParams.intensity);
                              setShaderHue(selectedShader.defaultParams.hue);
                              playChime('sine', 1.0);
                            }}
                            className="text-[10px] border border-gray-800 hover:border-white px-2 py-1 text-gray-400 hover:text-white transition-all flex items-center gap-1 cursor-crosshair"
                          >
                            <RefreshCw className="w-3 h-3" />
                            <span>RESET DEFAULTS</span>
                          </button>

                          <button 
                            onClick={() => {
                              setShowGLSL(!showGLSL);
                              playChime('sine', 1.4);
                            }}
                            className={`text-[10px] border px-2 py-1 transition-all flex items-center gap-1 cursor-crosshair ${
                              showGLSL 
                                ? 'bg-[#FF2BD6] text-black border-[#FF2BD6]' 
                                : 'border-[#FF2BD6]/30 text-[#FF2BD6] hover:bg-[#FF2BD6]/10'
                            }`}
                          >
                            <Code className="w-3 h-3" />
                            <span>{showGLSL ? 'HIDE FILE CODE' : 'VIEW RAW FILE CODE'}</span>
                          </button>
                        </div>
                      </div>

                      {/* Explicit Tezos NFT OBJKT Collection Banner */}
                      <div className="bg-gradient-to-r from-black via-[#EFFF04]/5 to-black border border-[#EFFF04]/40 p-4 font-mono text-center space-y-2">
                        <div className="text-[10px] text-[#EFFF04] tracking-widest uppercase font-bold flex items-center justify-center gap-1.5">
                          <span className="animate-pulse">⟡</span> COLLECTIBLE ORBITAL DEBRIS <span className="animate-pulse">⟡</span>
                        </div>
                        <p className="text-[11px] text-gray-300 leading-normal max-w-md mx-auto">
                          This WebGL art matrix is minted on the Tezos blockchain. No local saves or copies are permitted: visit the official NFT portal to obtain full custodial ownership.
                        </p>
                        <a 
                          href="https://objkt.com/users/tz29m7GScDQn8eE1m8n4h96MAxq279cSsYg9"
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => playChime('triangle', 1.4)}
                          className="inline-flex items-center gap-1.5 border border-[#EFFF04] text-[#EFFF04] hover:bg-[#EFFF04] hover:text-black px-4 py-2 text-[11px] font-bold tracking-widest cursor-crosshair uppercase transition-all hover:shadow-[0_0_14px_rgba(239,255,4,0.4)]"
                        >
                          COLLECT THIS WORK ON OBJKT ↗
                        </a>
                      </div>

                      {/* Expandable raw File Code View */}
                      {showGLSL && (
                        <div className="bg-[#020202] border border-[#FF2BD6]/40 p-4 font-mono text-[11px] text-[#39FF14] relative max-h-[250px] overflow-y-auto select-text">
                          <div className="sticky top-0 bg-[#020202]/95 border-b border-zinc-900 pb-1 mb-2 text-gray-500 text-[10px] uppercase flex justify-between items-center">
                            <span>{selectedShader.fileName}</span>
                            <span className="text-[#FF2BD6]">LIVE SOURCE</span>
                          </div>
                          {isFetchingCode ? (
                            <div className="text-gray-500 animate-pulse py-2">RETRIEVING SOURCE STREAM FROM REPOSITORY...</div>
                          ) : (
                            <pre className="whitespace-pre-wrap text-[10px] leading-tight select-all">{fetchedCode}</pre>
                          )}
                        </div>
                      )}

                    </div>
                  ) : (
                    <div className="h-[400px] flex flex-col items-center justify-center border border-dashed border-[#FF2BD6]/20 text-center p-6 text-gray-500 font-mono">
                      <Atom className="w-12 h-12 text-[#FF2BD6]/30 animate-spin mb-4" style={{ animationDuration: '8s' }} />
                      <h4 className="text-white text-md font-sans font-bold uppercase mb-1">NO SHARD SELECTED</h4>
                      <p className="text-[12px] max-w-sm">
                        Click on any of the shader shards in the grid on the left to activate the dynamic rendering lab feed.
                      </p>
                    </div>
                  )}
                </div>

              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* SECTION C: AI SLOP - RETRO HALLUCINATION LABORATORY                       */}
          {/* ========================================================================= */}
          {activeTab === 'aislop' && (
            <div className="frame py-8">
              <div className="mb-6">
                <div className="flex justify-between items-end border-b border-[#00F0FF] pb-3 mb-2">
                  <h2 className="text-3xl font-bold font-sans text-[#00F0FF] tracking-wider uppercase">☣ AI SLOP MATRIX ☣</h2>
                  <span className="text-[11px] text-gray-500 font-mono">ENGINE: TENSORTRANTRUM.v1</span>
                </div>
                <p className="text-[#d7ffd0] text-[13px] leading-relaxed max-w-2xl">
                  In art, the hallucination is the point. We treat generative errors as magnificent sacred geometry. 
                  Below is the Hallucinatory Prompt Purifier and our museum of lovely generated mistakes.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                
                {/* Left Side: Dynamic Prompt Scrambler */}
                <div className="lg:col-span-6 bg-black/95 border border-[#00F0FF] p-5 shadow-[0_0_20px_rgba(0,240,255,0.15)] space-y-4">
                  
                  <div className="flex items-center gap-2 text-white font-bold font-sans uppercase text-[15px] border-b border-zinc-900 pb-2">
                    <Bot className="w-5 h-5 text-[#00F0FF]" />
                    <span>Hallucinatory Prompt Purifier</span>
                  </div>

                  <p className="text-gray-400 text-[12px] font-mono leading-relaxed">
                    Feed a raw concept into our weights. We bypass regular, boring safety grids to synthesize extreme textual artifacting.
                  </p>

                  <div className="space-y-1">
                    <label className="text-[10px] text-[#00F0FF] font-mono block uppercase">INPUT DESIGN PROMPT</label>
                    <input 
                      type="text"
                      value={rawPrompt}
                      onChange={(e) => setRawPrompt(e.target.value)}
                      placeholder="e.g. glowing digital junk..."
                      className="w-full bg-[#050505] border border-gray-800 focus:border-[#00F0FF] text-white p-3 font-mono text-[13px] outline-none"
                    />
                  </div>

                  <button
                    onClick={handleCorruptPrompt}
                    disabled={isCorrupting}
                    className="w-full bg-[#00F0FF] hover:bg-[#00F0FF]/80 text-black font-bold py-3 px-4 font-sans uppercase text-[13px] tracking-widest cursor-crosshair transition-all disabled:opacity-50"
                  >
                    {isCorrupting ? '☠ CORRUPTING COGNITIVE MAPS...' : '☢ SYNTHESIZE GLITCH SLOP ▸'}
                  </button>

                  {/* Corrupted Output Terminal View */}
                  <div className="bg-[#020202] border border-[#00F0FF]/30 p-4 font-mono text-[12px] space-y-2">
                    <div className="text-gray-500 text-[10px] border-b border-zinc-900 pb-1 flex justify-between uppercase">
                      <span>PURIFIED_HALLUCINATION_FEED.txt</span>
                      <span className="text-[#00F0FF]">LIVE</span>
                    </div>

                    <div className="min-h-[60px] flex items-center justify-center text-center">
                      {corruptedPrompt ? (
                        <p className="text-[#39FF14] text-[13px] tracking-wide break-all font-bold animate-pulse">
                          {corruptedPrompt}
                        </p>
                      ) : (
                        <p className="text-gray-600 italic">
                          No slop generated yet. Push the button to distort the space.
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Dynamic Slop Index Bar */}
                  <div className="bg-[#080808] p-4 border border-zinc-900 space-y-2 font-mono">
                    <div className="flex justify-between items-center text-[11px] text-gray-400">
                      <span>HALLUCINATION OVERFLOW RATIO:</span>
                      <span className="text-[#00F0FF] font-bold">{slopMetric}%</span>
                    </div>
                    <div className="w-full bg-zinc-950 h-2 overflow-hidden border border-zinc-900">
                      <div 
                        className="bg-gradient-to-r from-[#00F0FF] to-[#FF2BD6] h-full transition-all duration-500"
                        style={{ width: `${slopMetric}%` }}
                      />
                    </div>
                  </div>

                </div>

                {/* Right Side: Museum of generated mistakes */}
                <div className="lg:col-span-6 bg-black/90 border border-gray-800 p-5 space-y-4">
                  <div className="flex justify-between items-center border-b border-gray-800 pb-2">
                    <h3 className="text-white font-bold font-sans uppercase text-[15px]">The Museum of AI Failures</h3>
                    <span className="text-[10px] bg-[#EFFF04]/20 text-[#EFFF04] px-2 py-0.5 font-mono">8 ACCUMULATED ENTRIES</span>
                  </div>

                  {/* Fun Grid of Mock-AI Slop masterpieces with creative descriptions */}
                  <div className="grid grid-cols-2 gap-4">
                    
                    {/* Failure 1 */}
                    <div className="border border-zinc-900 bg-[#040404] p-2 space-y-2 hover:border-[#00F0FF]/50 transition-all">
                      <div className="aspect-[4/3] w-full relative overflow-hidden bg-gradient-to-tr from-[#9D4DFF] to-[#FF2BD6] flex items-center justify-center">
                        <Skull className="w-10 h-10 text-white/30 animate-pulse" />
                        <div className="absolute inset-0 bg-repeat bg-[linear-gradient(45deg,#000_25%,transparent_25%,transparent_50%,#000_50%,#000_75%,transparent_75%,transparent)] bg-[size:10px_10px] opacity-15" />
                      </div>
                      <div>
                        <h4 className="text-white text-[12px] font-sans font-bold truncate">morpho_corrupted_skull</h4>
                        <p className="text-[10px] text-gray-500 leading-normal mt-0.5">
                          Tried to generate a cyber butterfly; weights collapsed into an absolute neon skull. Beautiful.
                        </p>
                      </div>
                    </div>

                    {/* Failure 2 */}
                    <div className="border border-zinc-900 bg-[#040404] p-2 space-y-2 hover:border-[#00F0FF]/50 transition-all">
                      <div className="aspect-[4/3] w-full relative overflow-hidden bg-gradient-to-tr from-[#00F0FF] to-[#39FF14] flex items-center justify-center">
                        <Sparkles className="w-10 h-10 text-white/30" />
                        <div className="absolute inset-0 bg-repeat bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.8)_20%,transparent_20%)] bg-[size:8px_8px] opacity-25" />
                      </div>
                      <div>
                        <h4 className="text-white text-[12px] font-sans font-bold truncate">infinite_yaml_cathedral</h4>
                        <p className="text-[10px] text-gray-500 leading-normal mt-0.5">
                          A cathedral generated entirely out of parsed Kubernetes configurations. Over-fitted chaos.
                        </p>
                      </div>
                    </div>

                    {/* Failure 3 */}
                    <div className="border border-zinc-900 bg-[#040404] p-2 space-y-2 hover:border-[#00F0FF]/50 transition-all">
                      <div className="aspect-[4/3] w-full relative overflow-hidden bg-gradient-to-tr from-[#FF6B00] to-[#EFFF04] flex items-center justify-center">
                        <Globe className="w-10 h-10 text-white/30" />
                        <div className="absolute inset-0 bg-repeat bg-[linear-gradient(to_bottom,transparent_50%,rgba(0,0,0,0.9)_50%)] bg-[size:4px_4px] opacity-35" />
                      </div>
                      <div>
                        <h4 className="text-white text-[12px] font-sans font-bold truncate">hyperbolic_trash_heap</h4>
                        <p className="text-[10px] text-gray-500 leading-normal mt-0.5">
                          12 dimensions of low-orbit garbage intersecting at impossible angles. Highly non-Euclidean.
                        </p>
                      </div>
                    </div>

                    {/* Failure 4 */}
                    <div className="border border-zinc-900 bg-[#040404] p-2 space-y-2 hover:border-[#00F0FF]/50 transition-all">
                      <div className="aspect-[4/3] w-full relative overflow-hidden bg-gradient-to-tr from-[#39FF14] to-[#9D4DFF] flex items-center justify-center">
                        <Radio className="w-10 h-10 text-white/30 animate-pulse" />
                        <div className="absolute inset-0 bg-repeat bg-[linear-gradient(to_right,rgba(0,0,0,0.55)_0_2px,transparent_2px_4px)] opacity-30" />
                      </div>
                      <div>
                        <h4 className="text-white text-[12px] font-sans font-bold truncate">unstable_weight_melt</h4>
                        <p className="text-[10px] text-gray-500 leading-normal mt-0.5">
                          A portrait of the artist as raw matrix float variables before optimization bounds.
                        </p>
                      </div>
                    </div>

                  </div>

                  {/* Live neural logs */}
                  <div className="bg-[#020202] border border-zinc-900 p-4 font-mono text-[10px] text-gray-500 max-h-[140px] overflow-y-auto space-y-1">
                    <span className="text-[9px] uppercase tracking-wider block text-zinc-700 border-b border-zinc-950 pb-1 mb-2">
                      LOG_STREAM: neural_hallucination_weights
                    </span>
                    {aiLogs.map((log, index) => (
                      <div key={index} className="truncate">{log}</div>
                    ))}
                  </div>

                </div>

              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* SECTION D: RANDO💩 - SYNTH & CHAOS PLAYGROUND                             */}
          {/* ========================================================================= */}
          {activeTab === 'rando' && (
            <div className="frame py-8">
              <div className="mb-6">
                <div className="flex justify-between items-end border-b border-[#EFFF04] pb-3 mb-2">
                  <h2 className="text-3xl font-bold font-sans text-[#EFFF04] tracking-wider uppercase">💩 RANDO SYNTH CHAOS 💩</h2>
                  <span className="text-[11px] text-gray-500 font-mono">SOUNDS_MATRIX: ONLINE</span>
                </div>
                <p className="text-[#9fdc96] text-[13px] leading-relaxed max-w-2xl">
                  An interactive Y3K toy. Tweak, randomize, and abuse WebGL parameters while playing cyber sweeps 
                  using our dynamic Web Audio Oscillators!
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                
                {/* Left Side: Wave Oscillator Pad */}
                <div className="lg:col-span-7 bg-black/95 border border-[#EFFF04] p-5 shadow-[0_0_20px_rgba(239,255,4,0.15)] space-y-4">
                  <div className="flex items-center gap-2 text-white font-bold font-sans uppercase text-[15px] border-b border-zinc-900 pb-2">
                    <Volume2 className="w-5 h-5 text-[#EFFF04]" />
                    <span>Hacker Glitch Synth Pad</span>
                  </div>

                  <p className="text-gray-400 text-[12px] font-mono leading-relaxed">
                    Move your mouse across the matrix or interact with the sliders to change wave parameters and trigger retro retrofuturism sweeps!
                  </p>

                  {/* Synth trigger/visual control container */}
                  <div 
                    className="relative aspect-video w-full border border-[#EFFF04]/40 bg-[#030303] overflow-hidden flex flex-col items-center justify-center cursor-crosshair group"
                    onMouseMove={(e) => {
                      if (isSynthPlaying) {
                        const rect = e.currentTarget.getBoundingClientRect();
                        const xRatio = (e.clientX - rect.left) / rect.width;
                        // Frequency range from 150Hz to 1200Hz
                        const calculatedFreq = 150 + xRatio * 1050;
                        updateSynthFreq(calculatedFreq);
                      }
                    }}
                    onMouseEnter={() => {
                      startSynth();
                    }}
                    onMouseLeave={() => {
                      stopSynth();
                    }}
                  >
                    {/* Decorative matrix crosshairs */}
                    <div className="absolute inset-x-0 h-px bg-[#EFFF04]/10 top-1/2" />
                    <div className="absolute inset-y-0 w-px bg-[#EFFF04]/10 left-1/2" />

                    <div className="text-center font-mono z-10 space-y-2 pointer-events-none p-4 bg-black/80 border border-zinc-900">
                      <div className="text-[#EFFF04] font-bold text-[14px] uppercase animate-pulse">
                        {isSynthPlaying ? '● FM WAVE GENERATOR ACTIVE' : '✖ OSCILLATOR IDLE'}
                      </div>
                      <p className="text-gray-500 text-[10px] max-w-xs leading-normal mx-auto">
                        {isSynthPlaying 
                          ? 'Wandering around complex coordinate vectors. Drag mouse to alter pitch.' 
                          : 'Hover your cursor inside this dark vector field to activate Web Audio synthesis.'}
                      </p>
                      <div className="text-[12px] text-white font-mono bg-zinc-950 px-2 py-1 inline-block border border-zinc-900">
                        ACTIVE_VALUE: <span className="text-[#39FF14] font-bold">{activeNote}</span>
                      </div>
                    </div>

                    {/* Fake retro grid */}
                    <div className="absolute inset-0 bg-repeat bg-[radial-gradient(circle,rgba(239,255,4,0.15)_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />
                  </div>

                  {/* Static Slider Option */}
                  <div className="bg-[#050505] p-4 border border-zinc-900 space-y-3 font-mono">
                    <div className="flex justify-between text-[11px] text-gray-400">
                      <span>STATIC OSCILLATION FREQUENCY</span>
                      <span className="text-[#EFFF04] font-bold">{synthFrequency.toFixed(0)} Hz</span>
                    </div>
                    <input 
                      type="range"
                      min="100"
                      max="1500"
                      step="10"
                      value={synthFrequency}
                      onChange={(e) => updateSynthFreq(parseFloat(e.target.value))}
                      className="w-full accent-[#EFFF04] bg-zinc-800 h-1 cursor-crosshair"
                    />
                    <div className="flex justify-between">
                      <button 
                        onMouseDown={startSynth}
                        onMouseUp={stopSynth}
                        className="text-[10px] bg-black text-[#EFFF04] border border-[#EFFF04] hover:bg-[#EFFF04] hover:text-black py-1 px-3 uppercase tracking-widest cursor-crosshair font-bold"
                      >
                        ⚡ TRIGGER SINGLE IMPULSE
                      </button>
                      <span className="text-[9px] text-gray-600 uppercase self-center">WAVE_TYPE: SAWTOOTH_retro</span>
                    </div>
                  </div>

                </div>

                {/* Right Side: Shader Randomizer & Logs */}
                <div className="lg:col-span-5 bg-black/90 border border-zinc-800 p-5 space-y-5">
                  
                  <div className="flex items-center gap-2 text-white font-bold font-sans uppercase text-[15px] border-b border-zinc-900 pb-2">
                    <RefreshCw className="w-5 h-5 text-[#EFFF04]" />
                    <span>Aesthetic Background Shifter</span>
                  </div>

                  <p className="text-gray-400 text-[12px] font-mono leading-relaxed">
                    Don't like the main background shader's vibe? Smash the chaotic matrix scrambler below to randomize uniforms!
                  </p>

                  <button
                    onClick={triggerRandomizer}
                    className="w-full bg-[#EFFF04] hover:bg-[#EFFF04]/90 text-black font-bold py-4 px-4 font-sans uppercase text-[14px] tracking-widest cursor-crosshair transition-all shadow-[0_0_15px_rgba(239,255,4,0.1)] hover:shadow-[0_0_25px_rgba(239,255,4,0.3)]"
                  >
                    💩 SHIFT BACKGROUND MATRIX 💩
                  </button>

                  {/* Global settings values readout */}
                  <div className="bg-[#050505] p-4 border border-zinc-900 font-mono text-[11px] space-y-2">
                    <div className="text-gray-500 text-[10px] border-b border-zinc-900 pb-1 uppercase">
                      ACTIVE_GLOBAL_SHADERS_UNIFORMS
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-gray-300">
                      <div>u_speed: <span className="text-[#EFFF04] font-bold">{bgSpeed.toFixed(4)}</span></div>
                      <div>u_warp: <span className="text-[#EFFF04] font-bold">{bgWarp.toFixed(2)}</span></div>
                      <div>u_colorShift: <span className="text-[#EFFF04] font-bold">{bgColorShift.toFixed(3)}</span></div>
                      <div>u_vignette: <span className="text-[#EFFF04] font-bold">{bgVignette.toFixed(2)}</span></div>
                    </div>
                  </div>

                  {/* Simulated Terminal Readout */}
                  <div className="bg-[#020202] border border-zinc-950 p-4 font-mono text-[10px] text-[#39FF14] space-y-1 max-h-[150px] overflow-y-auto">
                    <div className="text-[#EFFF04] text-[9px] uppercase border-b border-zinc-900 pb-1 mb-2 tracking-widest flex justify-between">
                      <span>DEBRIS_TELEMETRY_TERMINAL</span>
                      <span className="animate-ping">●</span>
                    </div>
                    {terminalOutputs.map((line, index) => (
                      <div key={index} className="truncate">{line}</div>
                    ))}
                  </div>

                </div>

              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* SECTION E: ABOUT ME - ARTIST RESUME & STATS MATRIX                         */}
          {/* ========================================================================= */}
          {activeTab === 'about' && (
            <div className="frame py-8 animate-fade-in">
              <div className="mb-6">
                <div className="flex justify-between items-end border-b border-[#9D4DFF] pb-3 mb-2">
                  <h2 className="text-3xl font-bold font-sans text-[#9D4DFF] tracking-wider uppercase">░ About Mary Gray // astraltrash ░</h2>
                  <span className="text-[11px] text-gray-500 font-mono">STATUS_FEED: ENCRYPTED_ENTITY</span>
                </div>
                <p className="text-[#9fdc96] text-[13px] leading-relaxed max-w-2xl">
                  Digital debris miner, shader programmer, and creator of custom visual bibles. Translating two decades of documented visionary geometry into real-time GLSL mathematical algorithms.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* Left Column: Interactive Avatar Resynthesizer */}
                <div className="lg:col-span-5 bg-black/95 border-2 border-[#9D4DFF] p-4 shadow-[0_0_20px_rgba(157,77,255,0.2)] space-y-4 font-mono">
                  <div className="bg-[#9D4DFF] text-black text-[12px] font-bold p-1 px-2 tracking-widest flex justify-between items-center">
                    <span>👾 BIO_MATRIX_AVATAR</span>
                    <span className="text-[8px] bg-black text-[#9D4DFF] px-1.5 py-0.5">Y3K_SYSTEM</span>
                  </div>

                  {/* 1:1 Sacred Geometry Avatar Canvas */}
                  <div className="aspect-square w-full relative bg-black border border-[#9D4DFF]/40 overflow-hidden flex items-center justify-center">
                    <canvas 
                      ref={avatarCanvasRef} 
                      width={400} 
                      height={400} 
                      className="w-full h-full block bg-black"
                    />
                  </div>

                  {/* Re-Synthesize Controls */}
                  <div className="space-y-3 bg-[#030303] p-3 border border-zinc-900 text-[11px]">
                    <div className="text-gray-400 font-bold text-[9px] uppercase tracking-wider flex items-center justify-between">
                      <span>AVATAR TUNING SLIDERS</span>
                      <span className="text-[#9D4DFF]">ACTIVE</span>
                    </div>

                    {/* Symmetry Slider */}
                    <div>
                      <div className="flex justify-between text-[10px] text-gray-500 mb-1">
                        <span>SYMMETRY_AXIS</span>
                        <span className="text-[#9D4DFF] font-bold">{avatarSymmetry}pt</span>
                      </div>
                      <input 
                        type="range"
                        min="2"
                        max="16"
                        step="1"
                        value={avatarSymmetry}
                        onChange={(e) => {
                          setAvatarSymmetry(parseInt(e.target.value));
                          playChime('sine', 0.9);
                        }}
                        className="w-full accent-[#9D4DFF] bg-zinc-800 h-1 cursor-crosshair"
                      />
                    </div>

                    {/* Seed Slider */}
                    <div>
                      <div className="flex justify-between text-[10px] text-gray-500 mb-1">
                        <span>COEFFICIENT_SEED</span>
                        <span className="text-[#9D4DFF] font-bold">{avatarSeed.toFixed(2)}</span>
                      </div>
                      <input 
                        type="range"
                        min="0.05"
                        max="2.0"
                        step="0.01"
                        value={avatarSeed}
                        onChange={(e) => {
                          setAvatarSeed(parseFloat(e.target.value));
                          playChime('triangle', 1.1);
                        }}
                        className="w-full accent-[#9D4DFF] bg-zinc-800 h-1 cursor-crosshair"
                      />
                    </div>

                    {/* Color Swatch Matrix Selection */}
                    <div>
                      <span className="text-[9px] text-gray-500 block mb-1">COLOR_MATRIX_CHALLENGE:</span>
                      <div className="flex gap-2.5">
                        {[
                          { color: '#9D4DFF', label: 'VIOLET' },
                          { color: '#FF2BD6', label: 'PINK' },
                          { color: '#00F0FF', label: 'CYAN' },
                          { color: '#39FF14', label: 'NEON' },
                          { color: '#EFFF04', label: 'YELLOW' }
                        ].map((swatch) => (
                          <button 
                            key={swatch.color}
                            onClick={() => {
                              setAvatarColor(swatch.color);
                              playChime('square', 1.2);
                            }}
                            className={`w-5 h-5 border transition-all cursor-crosshair ${
                              avatarColor === swatch.color ? 'border-white scale-110 shadow-[0_0_8px_currentColor]' : 'border-transparent opacity-60 hover:opacity-100'
                            }`}
                            style={{ backgroundColor: swatch.color, color: swatch.color }}
                            title={swatch.label}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Randomize Button */}
                    <button 
                      type="button"
                      onClick={() => {
                        setAvatarSeed(Math.random() * 1.9 + 0.1);
                        setAvatarSymmetry(Math.floor(Math.random() * 12) + 3);
                        const colors = ['#9D4DFF', '#FF2BD6', '#00F0FF', '#39FF14', '#EFFF04'];
                        setAvatarColor(colors[Math.floor(Math.random() * colors.length)]);
                        playChime('triangle', 1.4);
                      }}
                      className="w-full bg-[#9D4DFF] text-black font-bold py-1.5 px-3 uppercase tracking-wider text-[10px] hover:bg-[#9D4DFF]/80 transition-all cursor-crosshair"
                    >
                      ⚡ SYNTHESIZE ATOMS RAND_GEN ⚡
                    </button>
                  </div>
                </div>

                {/* Right Column: Bio, Statements & Links */}
                <div className="lg:col-span-7 space-y-6">
                  
                  {/* Biography Box */}
                  <div className="border border-zinc-800 bg-black/80 p-5 space-y-3 font-sans">
                    <h3 className="text-xl font-bold font-sans text-white tracking-tight border-b border-zinc-900 pb-2 flex items-center gap-2">
                      <Atom className="w-5 h-5 text-[#9D4DFF]" />
                      <span>THE ENTITY: MARY GRAY</span>
                    </h3>
                    <div className="text-[14px] text-gray-300 leading-relaxed space-y-3.5">
                      <p>
                        I am Mary Gray (known across web networks as <strong>astraltrash</strong>), a visual artist and shader wizard exploring the intersections of geometry, visual phenomenology, and retro computing.
                      </p>
                      <p>
                        For two decades, I have compiled, dithered, and documented recurring mathematical constants found during psychedelic states. Rather than letting these ideas rest in obscure offline notebooks, I construct responsive, live WebGL2 systems so that anyone with a browser can look directly into the field of low void orbit.
                      </p>
                      <p className="text-zinc-400 italic text-[13px] border-l-2 border-[#9D4DFF] pl-3 py-0.5">
                        "One artist's accumulated digital debris is another's glowing spacecraft."
                      </p>
                    </div>
                  </div>

                  {/* Aesthetic Social Gateways Terminal */}
                  <div className="border border-[#9D4DFF]/40 bg-black/95 p-5 space-y-4 font-mono">
                    <div className="flex justify-between items-center border-b border-zinc-900 pb-2">
                      <span className="text-[12px] font-bold text-[#9D4DFF] uppercase tracking-wider flex items-center gap-1.5">
                        <Terminal className="w-4 h-4 text-[#9D4DFF]" />
                        <span>VERIFIED_COMMUNICATION_CHANNELS</span>
                      </span>
                      <span className="text-[9px] bg-[#9D4DFF]/20 text-[#9D4DFF] px-1.5 py-0.5">SECURE</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Twitter (X) */}
                      <a 
                        href="https://x.com/astraltrash_art" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        onClick={() => playChime('sine', 1.0)}
                        className="group border border-zinc-800 hover:border-[#9D4DFF] p-3 hover:bg-[#9D4DFF]/5 flex justify-between items-center transition-all cursor-crosshair"
                      >
                        <div className="space-y-0.5">
                          <div className="text-[13px] font-sans font-bold text-white group-hover:text-[#9D4DFF]">X Account Profile</div>
                          <div className="text-[9px] text-gray-500 uppercase">@astraltrash_art</div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-gray-500 group-hover:text-[#9D4DFF] transition-all" />
                      </a>

                      {/* TikTok */}
                      <a 
                        href="https://www.tiktok.com/@astraltrash" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        onClick={() => playChime('sine', 1.0)}
                        className="group border border-zinc-800 hover:border-[#FF2BD6] p-3 hover:bg-[#FF2BD6]/5 flex justify-between items-center transition-all cursor-crosshair"
                      >
                        <div className="space-y-0.5">
                          <div className="text-[13px] font-sans font-bold text-white group-hover:text-[#FF2BD6]">TikTok Profile</div>
                          <div className="text-[9px] text-gray-500 uppercase">@astraltrash</div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-gray-500 group-hover:text-[#FF2BD6] transition-all" />
                      </a>

                      {/* Tezos Objkt.com */}
                      <a 
                        href="https://objkt.com/users/tz29m7GScDQn8eE1m8n4h96MAxq279cSsYg9" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        onClick={() => playChime('sine', 1.3)}
                        className="group border border-zinc-800 hover:border-[#EFFF04] p-3 hover:bg-[#EFFF04]/5 flex justify-between items-center transition-all cursor-crosshair"
                      >
                        <div className="space-y-0.5">
                          <div className="text-[13px] font-sans font-bold text-white group-hover:text-[#EFFF04]">Objkt Tezos Marketplace</div>
                          <div className="text-[9px] text-gray-500 uppercase">Collect Active NFTs</div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-gray-500 group-hover:text-[#EFFF04] transition-all" />
                      </a>

                      {/* GitHub */}
                      <a 
                        href="https://github.com/merrypranxter" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        onClick={() => playChime('sine', 1.5)}
                        className="group border border-zinc-800 hover:border-[#39FF14] p-3 hover:bg-[#39FF14]/5 flex justify-between items-center transition-all cursor-crosshair"
                      >
                        <div className="space-y-0.5">
                          <div className="text-[13px] font-sans font-bold text-white group-hover:text-[#39FF14]">GitHub Repositories</div>
                          <div className="text-[9px] text-gray-500 uppercase">@merrypranxter (100+ repos)</div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-gray-500 group-hover:text-[#39FF14] transition-all" />
                      </a>
                    </div>

                    <p className="text-[10px] text-gray-500 text-center leading-normal max-w-sm mx-auto pt-2">
                      * Contact: Reach out at <span className="text-[#9D4DFF] font-sans">marygray.art@gmail.com</span> for custom digital design collaborations or visual inquiries.
                    </p>
                  </div>

                </div>

              </div>
            </div>
          )}

        </div>

        {/* Footer Strip */}
        <div className="footer-strip">
          <div className="frame">
            <div className="strip-grid">
              <div className="widget">
                <h4>You are visitor</h4>
                <div className="counter" id="hitcounter">
                  {visitorCount}
                </div>
              </div>
              <div className="widget webring">
                <h4>Webring</h4>
                <a href="#" className="speak" data-say="previous site">
                  &laquo; PREV
                </a>{' '}
                ·{' '}
                <a href="#" className="speak" data-say="random site. good luck.">
                  RANDOM
                </a>{' '}
                ·{' '}
                <a href="#" className="speak" data-say="next site">
                  NEXT &raquo;
                </a>
                <p style={{ fontSize: '10px', color: '#3f7a38', marginTop: '10px' }}>
                  [ orbital debris ring · shader witches sector ]
                </p>
              </div>
              <div className="widget">
                <h4>Guestbook</h4>
                <button
                  className="gb-btn speak"
                  data-say="Sign the guestbook. Leave your mark in the void."
                  onClick={() => { playChime('triangle', 1.2); setShowGuestbook(true); }}
                >
                  ✎ SIGN IT
                </button>
              </div>
            </div>
            <div className="construction">▲ ALWAYS UNDER CONSTRUCTION · THAT IS THE POINT ▲</div>
            <div className="tiny">
              ASTRAL TRASH ♻ an artifact of merrypranxter · handmade HTML · no trackers, no frameworks, no shame ·{' '}
              <a href="https://github.com/merrypranxter" target="_blank" rel="noopener">
                github
              </a>{' '}
              ·{' '}
              <a href="https://x.com/astraltrash_art" target="_blank" rel="noopener">
                x.com
              </a>{' '}
              ·{' '}
              <a href="https://www.tiktok.com/@astraltrash" target="_blank" rel="noopener">
                tiktok
              </a>
            </div>
          </div>
        </div>
      </main>

      {/* Retro-Styled Guestbook Modal Popup (Replaces blockable browser alerts) */}
      {showGuestbook && (
        <div
          id="guestbook-modal"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 1000,
            backgroundColor: 'rgba(0,0,0,0.85)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
          }}
          onClick={() => { playChime('triangle', 0.5); setShowGuestbook(false); }}
        >
          <div
            style={{
              backgroundColor: '#000000',
              border: '2px solid var(--phosphor)',
              boxShadow: '0 0 30px var(--phosphor)',
              padding: '30px',
              maxWidth: '500px',
              width: '100%',
              textAlign: 'center',
              fontFamily: "'Share Tech Mono', monospace",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3
              style={{
                fontFamily: "'Chakra Petch', sans-serif",
                color: 'var(--magenta)',
                fontSize: '22px',
                marginBottom: '15px',
                letterSpacing: '0.1em',
              }}
            >
              ⟡ CONNECTION ESTABLISHED ⟡
            </h3>
            
            {/* Real Interactive inputs for leave a message */}
            <div className="space-y-3 mb-6 text-left">
              <div>
                <label className="text-[9px] text-[#39FF14] block mb-1">YOUR HANDLE / DEBRIS_ID</label>
                <input 
                  type="text" 
                  defaultValue="anonymous_wanderer"
                  className="w-full bg-[#050505] border border-gray-800 text-white p-2 font-mono text-[12px] outline-none focus:border-[#39FF14]"
                />
              </div>
              <div>
                <label className="text-[9px] text-[#39FF14] block mb-1">TRANSMIT MASSAGE TO VOID</label>
                <textarea 
                  rows={2}
                  defaultValue="the carrier wave is loud today."
                  className="w-full bg-[#050505] border border-gray-800 text-white p-2 font-mono text-[12px] outline-none focus:border-[#39FF14] resize-none"
                />
              </div>
            </div>

            <p
              style={{
                color: 'var(--phosphor)',
                fontSize: '12px',
                lineHeight: '1.6',
                marginBottom: '24px',
                letterSpacing: '0.05em',
              }}
            >
              [ SUCCESS: message queued into orbital wave queue — the void is listening ]
            </p>

            <button
              className="btn speak"
              data-say="Closing transmission."
              style={{
                borderColor: 'var(--phosphor)',
                fontSize: '13px',
                padding: '8px 20px',
                cursor: 'crosshair',
              }}
              onClick={() => { playChime('sine', 0.5); setShowGuestbook(false); }}
            >
              ✖ CLOSE TRANSMISSION
            </button>
          </div>
        </div>
      )}
    </>
  );
}

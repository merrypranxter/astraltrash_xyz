import React, { useState } from 'react';
import { 
  Github, 
  ExternalLink, 
  Terminal, 
  Cpu, 
  RotateCcw,
  Volume2,
  Layers
} from 'lucide-react';

interface SubProjectsProps {
  playChime: (type: 'sine' | 'triangle' | 'sawtooth' | 'square', pitchModifier: number) => void;
  ghostInput: string;
  setGhostInput: (val: string) => void;
  ghostHistory: { sender: 'user' | 'ghost'; text: string }[];
  setGhostHistory: React.Dispatch<React.SetStateAction<{ sender: 'user' | 'ghost'; text: string }[]>>;
  collabActiveColor: string;
  setCollabActiveColor: (val: string) => void;
  collabCanvas: string[];
  setCollabCanvas: React.Dispatch<React.SetStateAction<string[]>>;
}

interface ProjectItem {
  id: string;
  title: string;
  subtitle: string;
  liveUrl: string;
  repoUrl?: string;
  description: string;
  tag: string;
  specs: { num: string; name: string; desc: string }[];
  accentColor: string;
}

const PROJECTS: ProjectItem[] = [
  {
    id: 'ascii-trip',
    title: 'ASCII TRIP',
    subtitle: 'An interactive micro-synthesizer and generative typewriter matrix. Generates real-time retro CRT structures and audio signals.',
    liveUrl: 'https://asciitrip.netlify.app/',
    repoUrl: 'https://github.com/merrypranxter/Glitch-Cookbook',
    description: 'An interactive retro keyboard sequencer and typewriter utilizing web audio oscillators and CRT character dither pipelines.',
    tag: 'ASCII_TRIP_PORT_80',
    accentColor: '#EFFF04', // Radiant Gold
    specs: [
      { num: '01/', name: 'ASCII Character Rasterization', desc: 'Interactive real-time text matrix character map.' },
      { num: '02/', name: 'Web Audio Oscillators', desc: 'Real-time microtonal oscillator sound design engine.' },
      { num: '03/', name: 'Keyboard Typewriter Loop', desc: 'Sound waves mapped to custom retro character inputs.' }
    ]
  },
  {
    id: 'ghost-node',
    title: 'GHOST NODE',
    subtitle: 'An autonomous, generative poetic presence and deep analog projection environment.',
    liveUrl: 'https://melodious-zabaione-c5fb66.netlify.app/',
    description: 'A sensory poetic stream environment designed with haunting text fragments, feedback noise, and interactive frequency generators.',
    tag: 'GHOST_NODE_PORT_80',
    accentColor: '#FF007F', // Neon Pink
    specs: [
      { num: '01/', name: 'Poetic Language Matrix', desc: 'Autonomous lyric generation based on structural algorithms.' },
      { num: '02/', name: 'Nostalgic Terminal Styling', desc: 'Atmospheric interface featuring feedback layers and grain scanlines.' },
      { num: '03/', name: 'Spectral Feedback Nodes', desc: 'Sensory sound frequencies that echo your terminal queries.' }
    ]
  },
  {
    id: 'terence-chatbot',
    title: 'TERENCE BOT',
    subtitle: 'A hyper-dimensional linguistic synthesizer mirroring the thoughts, syntax, and voice of Terence McKenna.',
    liveUrl: 'https://terencechatbot.netlify.app/',
    description: 'An AI linguistic sandbox tuned to synthesize thoughts regarding DMT, alchemy, history, the i Ching, novel theory, and hyper-dimensional fungal consciousness.',
    tag: 'TERENCE_CHAT_PORT_80',
    accentColor: '#39FF14', // Toxic Green
    specs: [
      { num: '01/', name: 'Psychonautic Lexicon', desc: 'Dynamic stream of consciousness output mirroring McKenna\'s lectures.' },
      { num: '02/', name: 'Linguistic Alchemy', desc: 'Conversational loop built to discuss novel theory and time wave zero.' },
      { num: '03/', name: 'Dimensional Static', desc: 'Generative noise algorithms that respond as you dive deeper into linguistic space.' }
    ]
  },
  {
    id: 'glitch-cookbook',
    title: 'GLITCH COOKBOOK',
    subtitle: 'A comprehensive repository of modular visual distortion formulas, digital decay mockups, and performance benchmarks for glitch aesthetics.',
    liveUrl: '',
    repoUrl: 'https://github.com/merrypranxter/Glitch-Cookbook',
    description: 'A developer-focused reference library containing canvas raster corruption logic, retro color filters, and dither algorithms.',
    tag: 'GLITCH_COOKBOOK_REPO',
    accentColor: '#00F0FF', // Cyan
    specs: [
      { num: '01/', name: 'Glitch Matrices', desc: 'Standard formulaic references for web canvas and asset corruption.' },
      { num: '02/', name: 'Modular Retro Shaders', desc: 'Highly scalable custom retro CRT scanline templates.' },
      { num: '03/', name: 'Interactive Code Recipes', desc: 'Directly customizable CSS/JS codeblocks to destroy visual symmetry beautifully.' }
    ]
  }
];

export function SubProjects({
  playChime,
  ghostInput,
  setGhostInput,
  ghostHistory,
  setGhostHistory,
  collabActiveColor,
  setCollabActiveColor,
  collabCanvas,
  setCollabCanvas
}: SubProjectsProps) {
  const [crtFilter, setCrtFilter] = useState<boolean>(true);
  const [refreshKeys, setRefreshKeys] = useState<Record<string, number>>({});

  const handleRefreshIframe = (id: string) => {
    playChime('square', 1.2);
    setRefreshKeys(prev => ({
      ...prev,
      [id]: (prev[id] || 0) + 1
    }));
  };

  const scrollToSection = (id: string) => {
    playChime('triangle', 1.1);
    const element = document.getElementById(`section-${id}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const scrollToTop = () => {
    playChime('sine', 1.0);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="w-full flex flex-col items-center py-16 px-4 animate-fade-in" id="projects-mainframe">
      <div className="w-full max-w-5xl space-y-24">
      
      {/* 1. Header Segment: Spacious and Atmospheric */}
      <div className="text-center space-y-4">
        <h1 
          className="text-4xl md:text-5xl font-extrabold uppercase tracking-widest text-white select-none"
          style={{
            fontFamily: "'Bitcount Prop Double', 'Chakra Petch', sans-serif",
            textShadow: '0 0 10px #EFFF04, 0 0 40px rgba(239,255,4,0.2)'
          }}
        >
          ☄️ Projects Cabinet ☄️
        </h1>
        <p className="text-xs md:text-sm text-[#EFFF04]/90 font-mono max-w-2xl mx-auto leading-relaxed uppercase tracking-widest font-semibold">
          Hosting interactive micro-synthesizers, generative linguistic typewriters, and retro emulations.
        </p>
      </div>

      {/* 2. Table of Contents: Cute, Pixely Index (NOT in a Box) */}
      <div className="py-4 font-mono text-xs text-zinc-400 space-y-6 text-center">
        <div className="text-zinc-600 uppercase tracking-widest text-[10px] font-bold">
          ◄◄ TRANSMISSION INDEX // SMOOTH SCROLL ROUTING ►►
        </div>
        
        <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 max-w-3xl mx-auto">
          {PROJECTS.map((proj, idx) => (
            <button
              key={proj.id}
              onClick={() => scrollToSection(proj.id)}
              className="group flex items-center gap-2 hover:text-[#EFFF04] transition-all cursor-crosshair py-1 px-2.5"
            >
              <span style={{ color: proj.accentColor }} className="font-bold">
                [0{idx + 1}]
              </span>
              <span className="text-white uppercase font-bold tracking-widest group-hover:underline decoration-1 decoration-[#EFFF04]/50 underline-offset-4">
                {proj.title}
              </span>
              <span className="text-[10px] text-zinc-600 group-hover:text-[#EFFF04]/80 transition-colors">
                ↳
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* 3. The Sequential Stream */}
      <div className="space-y-32 pt-8">
        {PROJECTS.map((proj, idx) => {
          const iframeKey = refreshKeys[proj.id] || 0;
          return (
            <div 
              key={proj.id} 
              id={`section-${proj.id}`} 
              className="space-y-12 scroll-mt-24"
            >
              
              {/* Project Header Info: Breathable and Minimalist */}
              <div className="space-y-4 border-b border-zinc-900 pb-6">
                <div className="flex flex-wrap justify-between items-center gap-3 text-xs font-mono">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: proj.accentColor }} />
                    <span className="text-zinc-500 uppercase tracking-wider">SYSTEM_NODE // 0{idx + 1}</span>
                    <span className="text-zinc-700">|</span>
                    <span className="font-bold tracking-wider" style={{ color: proj.accentColor }}>{proj.tag}</span>
                  </div>
                  {proj.liveUrl && (
                    <div className="flex items-center gap-3 text-zinc-500">
                      <span className="hidden sm:inline font-mono text-[10px] tracking-tight">{proj.liveUrl}</span>
                      <button 
                        onClick={() => handleRefreshIframe(proj.id)}
                        className="hover:text-white p-1 rounded hover:bg-zinc-900 transition-all"
                        title="Re-Initialize Frame"
                      >
                        <RotateCcw className="w-4 h-4" style={{ color: proj.accentColor }} />
                      </button>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <h2 className="text-2xl md:text-3xl font-extrabold text-white uppercase tracking-wider">
                    {proj.title}
                  </h2>
                  <p className="text-xs sm:text-sm text-zinc-400 font-mono leading-relaxed max-w-4xl uppercase">
                    {proj.subtitle}
                  </p>
                </div>
              </div>

              {/* Live Interactive Node Container (Spacious, non-enclosed, full vertical room) */}
              {proj.liveUrl ? (
                <div className="relative bg-[#010101] overflow-hidden aspect-[16/10] min-h-[550px] md:min-h-[850px] w-full border-t border-b border-zinc-900/60 shadow-[0_0_50px_rgba(0,0,0,0.6)]">
                  {crtFilter && (
                    <div className="absolute inset-0 pointer-events-none z-30 bg-scanlines opacity-[0.14]" />
                  )}
                  <iframe
                    key={`${proj.id}-${iframeKey}`}
                    src={proj.liveUrl}
                    title={`${proj.title} Live Node`}
                    className="w-full h-full border-0 bg-black z-10"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
                  />
                </div>
              ) : (
                /* Glitch Cookbook Standalone Code Console */
                <div className="bg-zinc-950/20 border border-zinc-900/60 rounded-2xl p-8 font-mono text-xs text-zinc-400 space-y-6">
                  <div className="flex items-center justify-between border-b border-zinc-900 pb-4">
                    <span className="text-white font-extrabold uppercase text-sm tracking-widest flex items-center gap-2">
                      <Cpu className="w-4 h-4 text-[#00F0FF]" />
                      GLITCH COOKBOOK REPOSITORY TERMINAL
                    </span>
                    <span className="text-[10px] bg-[#00F0FF]/10 text-[#00F0FF] px-2 py-0.5 rounded font-bold uppercase">
                      STANDALONE REPO
                    </span>
                  </div>
                  
                  <div className="space-y-4">
                    <p className="leading-relaxed uppercase">
                      This package contains raw code setups, CRT shader pipelines, canvas dither loops, and modular glitch formulas. It runs as a standalone dev workspace.
                    </p>
                    
                    <div className="space-y-2 bg-black/50 p-6 rounded-xl border border-zinc-900">
                      <div className="flex items-center justify-between text-[10px] text-zinc-600 border-b border-zinc-950 pb-2 mb-2">
                        <span>SHELL_TERMINAL</span>
                        <span>BASH</span>
                      </div>
                      <pre className="text-[11px] text-[#00F0FF] font-mono leading-relaxed select-all overflow-x-auto whitespace-pre-wrap">
                        {`# Clone the repository
git clone https://github.com/merrypranxter/Glitch-Cookbook.git

# Navigate to workspace
cd Glitch-Cookbook

# Install visual compiler packages
npm install

# Start local server node
npm run dev`}
                      </pre>
                    </div>
                  </div>
                </div>
              )}

              {/* Stage Controls: Launches and filters */}
              <div className="flex flex-col sm:flex-row gap-4 justify-between items-stretch sm:items-center pt-2">
                {proj.liveUrl && (
                  <a
                    href={proj.liveUrl}
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => playChime('sine', 1.3)}
                    className="flex-grow text-center bg-zinc-950 hover:bg-zinc-900 text-[#EFFF04] border border-zinc-800 hover:border-[#EFFF04]/50 font-bold font-mono text-xs py-3 px-6 flex items-center justify-center gap-2 transition-all cursor-crosshair uppercase tracking-widest rounded-lg"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>Launch Transmission in New Tab 🚀</span>
                  </a>
                )}

                {proj.liveUrl && (
                  <button
                    onClick={() => {
                      playChime('triangle', 1.1);
                      setCrtFilter(!crtFilter);
                    }}
                    className={`px-6 py-3 font-mono text-xs font-bold border rounded-lg transition-all flex items-center justify-center gap-2 cursor-crosshair uppercase ${
                      crtFilter 
                        ? 'bg-zinc-950 text-[#EFFF04] border-[#EFFF04]/40 hover:border-[#EFFF04]' 
                        : 'bg-black text-zinc-500 border-zinc-900 hover:text-white'
                    }`}
                  >
                    <Terminal className="w-4 h-4" />
                    <span>Scanline Grid: {crtFilter ? 'ON' : 'OFF'}</span>
                  </button>
                )}
              </div>

              {/* Info Specs & Diagnostics Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start border-t border-zinc-900/60 pt-10">
                
                {/* Specs */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-zinc-400 font-mono text-xs uppercase tracking-wider border-b border-zinc-900 pb-2">
                    <Cpu className="w-4 h-4" style={{ color: proj.accentColor }} />
                    <span>Technical Architecture Specs</span>
                  </div>
                  <div className="space-y-4 pt-2">
                    {proj.specs.map((spec) => (
                      <div key={spec.num} className="space-y-1">
                        <div className="flex items-center gap-2 text-xs font-mono font-bold" style={{ color: proj.accentColor }}>
                          <span>{spec.num}</span>
                          <span className="uppercase text-white text-xs">{spec.name}</span>
                        </div>
                        <p className="text-[11px] text-zinc-400 font-mono leading-relaxed pl-6 uppercase">
                          {spec.desc}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Coordinates & Diagnostics */}
                <div className="space-y-6 font-mono text-xs text-zinc-500">
                  <div className="bg-zinc-950/20 border border-zinc-900/60 p-5 rounded-xl space-y-3">
                    <div className="flex items-center justify-between uppercase border-b border-zinc-900 pb-2 font-bold text-zinc-400">
                      <span>Source Coord</span>
                      <span className="text-white">RECEPTOR</span>
                    </div>
                    <p className="text-[11px] text-zinc-400 leading-relaxed uppercase">
                      {proj.repoUrl 
                        ? 'Inspect compiled sources, retro shader packages, and local web synthesizer hooks directly on the GitHub directory.'
                        : 'This linguistic synthesizer works over cloud nodes and operates autonomously in full neural pipeline space.'
                      }
                    </p>
                    {proj.repoUrl && (
                      <a
                        href={proj.repoUrl}
                        target="_blank"
                        rel="noreferrer"
                        onClick={() => playChime('square', 0.9)}
                        className="w-full text-center border border-zinc-800 hover:border-white hover:bg-white/5 text-zinc-300 hover:text-white py-2 px-3 flex items-center justify-center gap-1.5 transition-all rounded cursor-crosshair uppercase font-bold"
                      >
                        <Github className="w-3.5 h-3.5" />
                        <span>Open Source Repo</span>
                      </a>
                    )}
                  </div>

                  {/* Tiny Audio Console per node */}
                  <div className="bg-zinc-950/20 border border-zinc-900/60 p-5 rounded-xl space-y-3">
                    <div className="flex items-center gap-2 text-zinc-400 font-bold uppercase border-b border-zinc-900 pb-2">
                      <Volume2 className="w-4 h-4 text-[#39FF14]" />
                      <span>Node Audio Signal Diagnostic</span>
                    </div>
                    <div className="grid grid-cols-4 gap-1.5">
                      {([
                        { label: 'SINE', t: 'sine', p: 1.0 },
                        { label: 'TRI', t: 'triangle', p: 1.3 },
                        { label: 'SAW', t: 'sawtooth', p: 0.8 },
                        { label: 'SQR', t: 'square', p: 1.1 }
                      ] as const).map((opt) => (
                        <button
                          key={opt.label}
                          onClick={() => playChime(opt.t, opt.p * (idx * 0.2 + 0.8))}
                          className="bg-black hover:bg-[#39FF14]/5 border border-zinc-900 hover:border-[#39FF14] text-[9px] font-bold py-1.5 text-zinc-500 hover:text-[#39FF14] transition-all uppercase rounded"
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

              </div>

              {/* Navigation Links Under the App */}
              <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-[11px] font-mono text-zinc-500 pt-6 border-t border-zinc-900/40">
                <button 
                  onClick={scrollToTop}
                  className="hover:text-white hover:underline transition-colors py-1.5 px-3 uppercase tracking-widest font-bold"
                >
                  ▲ RETURN TO INDEX
                </button>
                {idx > 0 && (
                  <button 
                    onClick={() => scrollToSection(PROJECTS[idx - 1].id)}
                    className="hover:text-white hover:underline transition-colors py-1.5 px-3 uppercase tracking-widest font-bold"
                  >
                    ◀ PREV CHANNEL
                  </button>
                )}
                {idx < PROJECTS.length - 1 && (
                  <button 
                    onClick={() => scrollToSection(PROJECTS[idx + 1].id)}
                    className="hover:text-white hover:underline transition-colors py-1.5 px-3 uppercase tracking-widest font-bold"
                  >
                    NEXT CHANNEL ▶
                  </button>
                )}
              </div>

              {/* Decorative Vibe Divider between stream entries */}
              {idx < PROJECTS.length - 1 && (
                <div className="flex items-center justify-center gap-4 py-20 text-zinc-800">
                  <span className="h-[1px] flex-grow bg-gradient-to-r from-transparent via-zinc-900 to-transparent" />
                  <span className="font-mono text-[9px] tracking-[0.2em] uppercase text-zinc-600 font-extrabold">
                    ✦ END TRANSMISSION_0{idx + 1} // BUFFERING NEXT_NODE ✦
                  </span>
                  <span className="h-[1px] flex-grow bg-gradient-to-r from-transparent via-zinc-900 to-transparent" />
                </div>
              )}

            </div>
          );
        })}
      </div>
    </div>
  </div>
  );
}



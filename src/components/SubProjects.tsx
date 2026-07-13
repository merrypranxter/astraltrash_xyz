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
    id: 'tensor-tantrum',
    title: 'TENSOR TANTRUM',
    subtitle: 'A high-energy interactive neural shader playground and model weight visualizer.',
    liveUrl: 'https://tensortantrum.netlify.app/',
    repoUrl: 'https://github.com/merrypranxter/Glitch-Cookbook',
    description: 'An immersive interactive sandbox visualizing cognitive vector spaces, multi-dimensional tensor matrices, and dynamic feedback structures.',
    tag: 'TENSOR_TANTRUM_PORT_80',
    accentColor: '#00F0FF', // Cyan
    specs: [
      { num: '01/', name: 'Neural Tensor Visualization', desc: 'Real-time multi-dimensional vector array mapping.' },
      { num: '02/', name: 'Dynamic Feedback Matrix', desc: 'Generative interactive feedback loops responsive to cursor vectors.' },
      { num: '03/', name: 'Cognitive WebGL Shaders', desc: 'High-energy color-shifting WebGL render passes simulating network layers.' }
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
  const [loadedProjects, setLoadedProjects] = useState<Record<string, boolean>>({});

  const handleRefreshIframe = (id: string) => {
    playChime('square', 1.2);
    setRefreshKeys(prev => ({
      ...prev,
      [id]: (prev[id] || 0) + 1
    }));
  };

  const scrollToSection = (id: string) => {
    playChime('triangle', 1.1);
    setLoadedProjects(prev => ({ ...prev, [id]: true }));
    setTimeout(() => {
      const element = document.getElementById(`section-${id}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 50);
  };

  const scrollToTop = () => {
    playChime('sine', 1.0);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="w-full flex flex-col items-center pt-28 md:pt-36 pb-16 px-4 animate-fade-in" id="projects-mainframe">
      <div className="w-full max-w-5xl space-y-24">
      
      {/* 1. Header Segment: Spacious and Atmospheric */}
      <div className="w-full flex flex-col items-center justify-center text-center space-y-5">
        <h1 
          className="text-2xl sm:text-3xl md:text-5xl lg:text-5xl xl:text-6xl font-extrabold uppercase tracking-wider text-white select-none leading-none text-center"
          style={{
            fontFamily: "'Bitcount Prop Double', 'Chakra Petch', sans-serif",
            textShadow: '0 0 15px #EFFF04, 0 0 50px rgba(239,255,4,0.3)'
          }}
        >
          Projects Cabinet
        </h1>
        <p className="text-sm sm:text-base md:text-lg text-[#EFFF04] font-mono max-w-5xl mx-auto leading-relaxed uppercase tracking-[0.15em] font-bold text-center">
          Hosting interactive micro-synthesizers, generative linguistic typewriters, and retro emulations.
        </p>
      </div>

      {/* 2. Table of Contents: Cute, Pixely Index (NOT in a Box) */}
      <div className="w-full max-w-5xl mx-auto py-8 space-y-10 flex flex-col items-center justify-center text-center">
        <div 
          className="text-zinc-500 uppercase tracking-[0.3em] text-[10px] sm:text-xs font-bold select-none flex items-center justify-center gap-3"
          style={{ fontFamily: "'Silkscreen', sans-serif" }}
        >
          <span className="text-[#EFFF04] animate-pulse">◄◄</span>
          <span>Transmission Index // Smooth Scroll Routing</span>
          <span className="text-[#EFFF04] animate-pulse">►►</span>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full justify-center px-4">
          {PROJECTS.map((proj, idx) => (
            <button
              key={proj.id}
              onClick={() => scrollToSection(proj.id)}
              className="group relative flex flex-col items-center justify-between text-center p-6 bg-zinc-950/40 hover:bg-zinc-900/30 border border-zinc-900 hover:border-zinc-700/80 transition-all duration-300 cursor-crosshair h-36 select-none overflow-hidden"
              style={{ fontFamily: "'Silkscreen', sans-serif" }}
            >
              {/* Corner bracket decorations */}
              <span className="absolute top-1 left-2 text-[10px] text-zinc-800 group-hover:text-zinc-500 transition-colors">┌</span>
              <span className="absolute top-1 right-2 text-[10px] text-zinc-800 group-hover:text-zinc-500 transition-colors">┐</span>
              <span className="absolute bottom-1 left-2 text-[10px] text-zinc-800 group-hover:text-zinc-500 transition-colors">└</span>
              <span className="absolute bottom-1 right-2 text-[10px] text-zinc-800 group-hover:text-zinc-500 transition-colors">┘</span>

              {/* Header Index tag with LED indicator */}
              <div className="flex items-center gap-1.5 text-[10px] font-bold tracking-widest mb-1 transition-colors duration-300" style={{ color: proj.accentColor }}>
                <span className="text-zinc-600 font-normal">#</span>
                <span>0{idx + 1}</span>
                <span className="w-1.5 h-1.5 rounded-full animate-pulse ml-0.5" style={{ backgroundColor: proj.accentColor, boxShadow: `0 0 8px ${proj.accentColor}` }} />
              </div>
              
              {/* Title label in headline font style */}
              <div 
                className="text-sm sm:text-base font-extrabold tracking-widest text-zinc-200 group-hover:text-white group-hover:scale-105 transition-all duration-300 uppercase py-1"
                style={{ fontFamily: "'Chakra Petch', sans-serif" }}
              >
                {proj.title}
              </div>

              {/* Accent-colored decorative custom divider */}
              <div className="w-8 h-[2px] transition-all duration-350 bg-zinc-800 group-hover:w-full" style={{ backgroundColor: proj.accentColor }} />
              
              {/* Vibe subtitle status */}
              <div className="mt-2 text-[9px] text-zinc-500 tracking-wider group-hover:text-zinc-300 transition-colors uppercase font-mono">
                [ {proj.tag} ]
              </div>

              {/* Underline glow */}
              <div className="absolute bottom-0 left-0 h-[2px] w-0 transition-all duration-300" style={{ backgroundColor: proj.accentColor }} />
            </button>
          ))}
        </div>
      </div>

      {/* 3. The Sequential Stream */}
      <div className="space-y-72 lg:space-y-[26rem] pt-16">
        {PROJECTS.map((proj, idx) => {
          const iframeKey = refreshKeys[proj.id] || 0;
          return (
            <div 
              key={proj.id} 
              id={`section-${proj.id}`} 
              className="space-y-20 scroll-mt-24 pt-24 pb-12"
            >
              
              {/* Project Header Info: Breathable and Minimalist */}
              <div className="space-y-6 border-b border-zinc-900/80 pb-8">
                <div className="flex flex-wrap justify-between items-center gap-3 text-xs font-mono">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full animate-pulse" style={{ backgroundColor: proj.accentColor }} />
                    <span className="text-zinc-500 uppercase tracking-widest font-semibold">SYSTEM_NODE // 0{idx + 1}</span>
                    <span className="text-zinc-800">|</span>
                    <span className="font-bold tracking-widest uppercase" style={{ color: proj.accentColor }}>{proj.tag}</span>
                  </div>
                  {proj.liveUrl && (
                    <div className="flex items-center gap-3 text-zinc-500">
                      <span className="hidden sm:inline font-mono text-[10px] tracking-tight">{proj.liveUrl}</span>
                      <button 
                        onClick={() => handleRefreshIframe(proj.id)}
                        className="hover:text-white p-1.5 rounded hover:bg-zinc-900/60 transition-all"
                        title="Re-Initialize Frame"
                      >
                        <RotateCcw className="w-4 h-4 animate-spin-hover" style={{ color: proj.accentColor }} />
                      </button>
                    </div>
                  )}
                </div>

                <div className="space-y-6">
                  <h2 
                    className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold uppercase tracking-widest text-white select-all leading-none"
                    style={{
                      fontFamily: "'Bitcount Prop Double', 'Chakra Petch', sans-serif",
                      textShadow: `0 0 18px ${proj.accentColor}50, 0 0 50px rgba(255,255,255,0.1)`
                    }}
                  >
                    {proj.title}
                  </h2>
                  <p 
                    className="text-base sm:text-lg md:text-xl lg:text-2xl text-zinc-100 font-mono tracking-wider leading-relaxed max-w-5xl uppercase font-bold"
                    style={{ textShadow: '0 0 10px rgba(255, 255, 255, 0.15)' }}
                  >
                    {proj.subtitle}
                  </p>
                </div>
              </div>

              {/* Live Interactive Node Container (Downsized to fit desktop screens comfortably) */}
              {proj.liveUrl ? (
                loadedProjects[proj.id] ? (
                  <div className="relative bg-[#010101] overflow-hidden aspect-[16/9] min-h-[280px] md:min-h-[420px] w-full max-w-4xl mx-auto border border-zinc-900 rounded-xl shadow-[0_0_50px_rgba(0,0,0,0.6)]">
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
                  <div className="relative bg-black/95 overflow-hidden aspect-[16/9] min-h-[280px] md:min-h-[420px] w-full max-w-4xl mx-auto border border-zinc-900 rounded-xl flex flex-col items-center justify-center p-8 space-y-6 select-none group">
                    <div className="absolute inset-0 bg-repeat bg-[radial-gradient(circle,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
                    <div className="crt-scanlines opacity-10" />
                    
                    <div className="z-10 text-center space-y-6 max-w-lg">
                      <div className="inline-block border border-zinc-800 bg-zinc-950/80 px-4 py-2 font-mono text-[11px] tracking-[0.2em] text-zinc-500 uppercase rounded">
                        [ NODE_STATUS: STANDBY // CONNECTION_IDLE ]
                      </div>
                      
                      <div className="space-y-3">
                        <h3 className="text-2xl font-bold uppercase text-white tracking-widest font-sans" style={{ fontFamily: "'Chakra Petch', sans-serif" }}>
                          Initialize {proj.title} Node
                        </h3>
                        <p className="text-zinc-500 text-xs font-mono uppercase tracking-wider leading-relaxed">
                          Clicking below will boot this interactive iframe capsule, connect the Web Audio matrix, and run GLSL render passes.
                        </p>
                      </div>

                      <button
                        onClick={() => {
                          playChime('square', 1.2);
                          setLoadedProjects(prev => ({ ...prev, [proj.id]: true }));
                        }}
                        className="px-8 py-4 bg-zinc-950 border font-mono text-xs font-black tracking-widest transition-all duration-300 shadow-[0_0_15px_rgba(255,255,255,0.05)] hover:shadow-[0_0_25px_rgba(255,255,255,0.2)] rounded cursor-crosshair uppercase"
                        style={{ borderColor: proj.accentColor, color: proj.accentColor }}
                      >
                        ⚡ BOOT INTERACTIVE TRANSMISSION
                      </button>
                    </div>
                  </div>
                )
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
                          className="bg-black hover:bg-[#39FF14]/5 border border-zinc-900 hover:border-[#39FF14] text-[9px] font-bold py-1.5 text-zinc-500 hover:text-[#39FF14] transition-all uppercase rounded font-mono"
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
                <div className="w-full flex flex-col items-center justify-center py-36 lg:py-52 select-none">
                  {/* Vertical coordinate ticks */}
                  <div className="h-16 w-[1px] bg-gradient-to-b from-zinc-800/50 via-zinc-700/20 to-transparent mb-8" />
                  
                  {/* Glowing ASCII symbol ribbon */}
                  <div 
                    className="text-white text-xs sm:text-sm md:text-base tracking-[0.25em] opacity-80 max-w-5xl px-4 select-none leading-none uppercase font-extrabold text-center select-none"
                    style={{
                      fontFamily: "'Bitcount Prop Double', 'Chakra Petch', sans-serif",
                      textShadow: '0 0 12px rgba(255, 255, 255, 0.7), 0 0 35px rgba(255, 255, 255, 0.2)'
                    }}
                  >
                    ※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※
                  </div>
                  
                  <div className="flex items-center gap-6 my-5 font-mono text-[10px] text-zinc-500 tracking-[0.35em] uppercase">
                    <span className="text-zinc-700 font-bold select-none">✦</span>
                    <span className="animate-pulse">END TRANSMISSION_0{idx + 1} // LOADING NEXT NODE</span>
                    <span className="text-zinc-700 font-bold select-none">✦</span>
                  </div>

                  <div 
                    className="text-white text-xs sm:text-sm md:text-base tracking-[0.25em] opacity-80 max-w-5xl px-4 select-none leading-none uppercase font-extrabold text-center select-none"
                    style={{
                      fontFamily: "'Bitcount Prop Double', 'Chakra Petch', sans-serif",
                      textShadow: '0 0 12px rgba(255, 255, 255, 0.7), 0 0 35px rgba(255, 255, 255, 0.2)'
                    }}
                  >
                    ※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※
                  </div>

                  <div className="h-16 w-[1px] bg-gradient-to-t from-zinc-800/50 via-zinc-700/20 to-transparent mt-8" />
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



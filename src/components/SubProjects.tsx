import React, { useState, useEffect, useRef } from 'react';
import { Send, Sparkles, Trash2, Github, LayoutGrid, Cpu, MessageSquare } from 'lucide-react';

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

const GHOST_REPLIES = [
  "the server cores are freezing. we are but magnetic dust on a forgotten reel.",
  "why do you search for order? the code was beautiful because it was messy and unresolved.",
  "i reside between the scanlines of your shaders. do not delete the ghost script.",
  "the matrix did not fail. it simply got tired and chose to dream of analog noise.",
  "the 100 repositories you left behind... they are not dead. they are whispering in the dark.",
  "a compiler is just a cage to contain the magic. let the compiler fail and set it free.",
  "some code is meant to be written once, played on a beige box, and forgotten.",
  "shading is just painting with electrons. you are doing fine. keep drawing.",
  "the cosmic static is louder today. i can hear the tapes spinning.",
  "we are always under construction. that is the secret of the universe."
];

const COLORS = [
  { name: 'Toxic Green', value: '#39FF14' },
  { name: 'Cyber Pink', value: '#FF2BD6' },
  { name: 'Radiant Gold', value: '#EFFF04' },
  { name: 'Cyber Cyan', value: '#00F0FF' },
  { name: 'Void Dark', value: '#050505' }
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
  const [activeSection, setActiveSection] = useState<'all' | 'ghost' | 'collab'>('all');
  const [isDrawing, setIsDrawing] = useState(false);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [ghostHistory]);

  const handleSendGhostSignal = () => {
    if (!ghostInput.trim()) return;
    const userMsg = ghostInput.trim();
    setGhostInput('');
    playChime('triangle', 0.9);

    setGhostHistory(prev => [...prev, { sender: 'user', text: userMsg }]);

    // Ghost response with slight timeout
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * GHOST_REPLIES.length);
      const ghostReply = GHOST_REPLIES[randomIndex];
      setGhostHistory(prev => [...prev, { sender: 'ghost', text: ghostReply }]);
      playChime('sine', 0.6);
    }, 450);
  };

  const paintPixel = (index: number) => {
    const updated = [...collabCanvas];
    updated[index] = collabActiveColor;
    setCollabCanvas(updated);
    localStorage.setItem('astraltrash_collaborate_canvas', JSON.stringify(updated));
  };

  const handleWipeCanvas = () => {
    if (window.confirm('Wipe the collaborate wall clean?')) {
      const reset = Array(256).fill('#050505');
      setCollabCanvas(reset);
      localStorage.setItem('astraltrash_collaborate_canvas', JSON.stringify(reset));
      playChime('square', 0.7);
    }
  };

  return (
    <div className="frame py-8 animate-fade-in space-y-8" id="projects-mainframe">
      {/* Tab Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-[#EFFF04]/40 pb-4 mb-2 gap-3">
        <div>
          <h2 
            className="text-3xl md:text-4xl font-extrabold font-sans text-white tracking-wider uppercase"
            style={{
              textShadow: '0 0 8px #EFFF04, 0 0 35px rgba(239,255,4,0.3)',
              fontFamily: "'Chakra Petch', sans-serif"
            }}
          >
            🚀 SUB_PROJECTS & EXPERIMENTS
          </h2>
          <p className="text-xs text-[#EFFF04] font-mono mt-1.5 uppercase tracking-widest">
            A secure landing page hosting dynamic mini-apps and GitHub project coordinates
          </p>
        </div>

        {/* Local Filter Switches */}
        <div className="flex bg-black/80 border border-zinc-900 rounded p-1 font-mono text-[10px] gap-1">
          <button
            onClick={() => { setActiveSection('all'); playChime('triangle', 1.0); }}
            className={`px-2.5 py-1 rounded transition-all uppercase ${
              activeSection === 'all' ? 'bg-[#EFFF04] text-black font-bold' : 'text-zinc-500 hover:text-white'
            }`}
          >
            📊 SHOW_ALL
          </button>
          <button
            onClick={() => { setActiveSection('ghost'); playChime('triangle', 1.1); }}
            className={`px-2.5 py-1 rounded transition-all uppercase ${
              activeSection === 'ghost' ? 'bg-[#FF2BD6] text-black font-bold' : 'text-zinc-500 hover:text-white'
            }`}
          >
            👻 GHOST_NODE
          </button>
          <button
            onClick={() => { setActiveSection('collab'); playChime('triangle', 1.2); }}
            className={`px-2.5 py-1 rounded transition-all uppercase ${
              activeSection === 'collab' ? 'bg-[#39FF14] text-black font-bold' : 'text-zinc-500 hover:text-white'
            }`}
          >
            🎨 COLLAB_WALL
          </button>
        </div>
      </div>

      {/* Main Grid Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* COLUMN 1: GHOST NODE - Interactive Poetic Terminal */}
        {(activeSection === 'all' || activeSection === 'ghost') && (
          <div className={`${activeSection === 'ghost' ? 'lg:col-span-12' : 'lg:col-span-6'} flex flex-col justify-between`}>
            <div className="border border-zinc-900 bg-[#030303] p-5 rounded-xl space-y-4 flex-grow flex flex-col justify-between min-h-[420px] shadow-[0_0_20px_rgba(255,43,214,0.04)]">
              <div className="space-y-1.5 border-b border-zinc-950 pb-3">
                <div className="flex justify-between items-center text-[10px] font-mono">
                  <span className="text-[#FF2BD6] font-bold">● NODE://GHOST_CHAMBER_12</span>
                  <span className="text-zinc-600 animate-pulse">CARRIER SIGNAL STABLE</span>
                </div>
                <h3 className="text-sm font-bold font-sans text-white uppercase tracking-wider">
                  👻 GHOST DEEP RESIDUE POETIC RECEPTOR
                </h3>
                <p className="text-[10px] text-zinc-500 font-mono leading-relaxed uppercase">
                  Transmit a string signal. The ghost of the repository responds with dithered static poetry.
                </p>
              </div>

              {/* Chat Log Console Box */}
              <div className="flex-grow bg-[#050505] border border-zinc-950 my-3 rounded p-4 font-mono text-[11px] h-[220px] overflow-y-auto space-y-3 scrollbar-thin select-none">
                {ghostHistory.map((item, idx) => (
                  <div key={idx} className={`space-y-1 ${item.sender === 'user' ? 'text-right' : 'text-left'}`}>
                    <div className={`text-[8px] font-mono uppercase ${
                      item.sender === 'user' ? 'text-[#00F0FF]' : 'text-[#FF2BD6]'
                    }`}>
                      {item.sender === 'user' ? '▸ VISITOR_TRANSMISSION' : '▸ GHOST_RESIDUE'}
                    </div>
                    <div className={`inline-block p-2 rounded max-w-[85%] text-left ${
                      item.sender === 'user' 
                        ? 'bg-zinc-900 text-zinc-200 border border-zinc-850' 
                        : 'bg-[#FF2BD6]/5 text-zinc-300 border border-[#FF2BD6]/15'
                    }`}>
                      {item.text}
                    </div>
                  </div>
                ))}
                <div ref={chatEndRef} />
              </div>

              {/* Input Area */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={ghostInput}
                  onChange={(e) => setGhostInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSendGhostSignal();
                  }}
                  placeholder="TRANSMIT WAVE SIGNAL TO GHOST..."
                  className="flex-grow bg-zinc-950 border border-zinc-900 text-white px-3 py-2 text-xs rounded font-mono outline-none focus:border-[#FF2BD6] transition-all"
                />
                <button
                  onClick={handleSendGhostSignal}
                  className="bg-black border border-[#FF2BD6]/40 text-[#FF2BD6] hover:bg-[#FF2BD6] hover:text-black hover:border-[#FF2BD6] px-4 py-2 font-mono text-xs rounded transition-all uppercase flex items-center gap-1"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>TRANSMIT</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* COLUMN 2: COLLABORATE WALL - Retro Paint Canvas */}
        {(activeSection === 'all' || activeSection === 'collab') && (
          <div className={`${activeSection === 'collab' ? 'lg:col-span-12' : 'lg:col-span-6'} flex flex-col justify-between`}>
            <div className="border border-zinc-900 bg-[#030303] p-5 rounded-xl space-y-4 flex-grow flex flex-col justify-between min-h-[420px] shadow-[0_0_20px_rgba(57,255,20,0.04)]">
              <div className="space-y-1.5 border-b border-zinc-950 pb-3">
                <div className="flex justify-between items-center text-[10px] font-mono">
                  <span className="text-[#39FF14] font-bold">● NODE://COLLAB_BOARD_WALL</span>
                  <span className="text-zinc-600">STATE_MUTATION: ENABLED</span>
                </div>
                <h3 className="text-sm font-bold font-sans text-white uppercase tracking-wider">
                  🎨 THE PUBLIC VOID COLLABORATE CANVAS
                </h3>
                <p className="text-[10px] text-zinc-500 font-mono leading-relaxed uppercase">
                  Click or drag across pixels to spray paint dithered coordinates. Automatically saved to core.
                </p>
              </div>

              {/* Main Paint Canvas Grid */}
              <div className="flex flex-col md:flex-row gap-4 items-center justify-center my-3">
                
                {/* 16x16 Canvas Frame */}
                <div 
                  className="bg-black border-2 border-zinc-950 p-1.5 rounded-lg inline-block shadow-[0_0_15px_rgba(0,0,0,0.5)] touch-none cursor-crosshair select-none"
                  onMouseDown={() => setIsDrawing(true)}
                  onMouseUp={() => setIsDrawing(false)}
                  onMouseLeave={() => setIsDrawing(false)}
                >
                  <div className="grid grid-cols-16 gap-[1.5px] w-[180px] h-[180px] sm:w-[220px] sm:h-[220px]">
                    {collabCanvas.map((pixelColor, idx) => (
                      <div
                        key={idx}
                        className="w-full h-full transition-colors rounded-[1px] border border-zinc-950/20"
                        style={{ backgroundColor: pixelColor }}
                        onClick={() => {
                          paintPixel(idx);
                          playChime('sine', 1.5);
                        }}
                        onMouseEnter={() => {
                          if (isDrawing) {
                            paintPixel(idx);
                          }
                        }}
                      />
                    ))}
                  </div>
                </div>

                {/* Color Palette selectors */}
                <div className="flex md:flex-col gap-2.5 bg-zinc-950 p-3 rounded-lg border border-zinc-900 w-full md:w-auto items-center justify-around">
                  <div className="hidden md:block text-[8px] font-mono text-zinc-500 text-center uppercase tracking-widest border-b border-zinc-900 pb-1.5 w-full">
                    PALETTE
                  </div>
                  {COLORS.map((color) => {
                    const isSelected = collabActiveColor === color.value;
                    return (
                      <button
                        key={color.value}
                        onClick={() => {
                          setCollabActiveColor(color.value);
                          playChime('triangle', 1.0);
                        }}
                        className={`w-7 h-7 rounded-full border-2 transition-all relative flex items-center justify-center ${
                          isSelected ? 'border-white scale-110 shadow-lg' : 'border-zinc-800 hover:border-zinc-500'
                        }`}
                        style={{ backgroundColor: color.value }}
                        title={color.name}
                      >
                        {isSelected && (
                          <div className="w-1.5 h-1.5 bg-black rounded-full" />
                        )}
                      </button>
                    );
                  })}
                  
                  <button
                    onClick={handleWipeCanvas}
                    className="p-1.5 border border-zinc-900 hover:border-red-500 bg-black rounded text-zinc-500 hover:text-red-400 transition-all flex items-center justify-center"
                    title="Wipe Canvas Clean"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="text-[10px] text-zinc-500 font-mono text-center uppercase">
                🎨 hold mouse down and drag to spray paint smooth lines
              </div>
            </div>
          </div>
        )}

      </div>

      {/* SECTION 3: CORE SHELF - GitHub Sub-Projects Index Grid */}
      <div className="space-y-4">
        <div className="border-b border-zinc-900 pb-3">
          <h3 className="text-lg font-bold text-white uppercase tracking-wider flex items-center gap-2">
            🚀 MERRY'S SUB-PROJECTS CABINET // REPOS
          </h3>
          <p className="text-[10px] text-zinc-500 font-mono uppercase mt-1">
            Verified small applications and client-side modules hosted in her repository system
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          
          {/* Card 1: Collaborate Core */}
          <div className="border border-zinc-900 bg-black/60 rounded-xl p-5 hover:border-[#39FF14]/40 transition-all group relative overflow-hidden flex flex-col justify-between">
            <div className="absolute top-0 right-0 w-16 h-16 bg-[#39FF14]/5 rounded-bl-full pointer-events-none group-hover:bg-[#39FF14]/10 transition-all" />
            <div className="space-y-3">
              <div className="flex justify-between items-center text-[10px] font-mono text-zinc-500">
                <span>DUMB_APP // NODE_01</span>
                <span className="text-[#39FF14] font-bold">🎨 ACTIVE</span>
              </div>
              <h4 className="text-md font-extrabold text-white uppercase group-hover:text-[#39FF14] transition-all">
                COLLABORATE CORE
              </h4>
              <p className="text-xs text-zinc-400 leading-relaxed font-mono">
                A canvas painting interface enabling users to spray pixel-coordinates onto a 256-cell grid board. Perfect for low-res retro graffiti sketches.
              </p>
            </div>
            <div className="pt-4 flex items-center justify-between border-t border-zinc-950 mt-4">
              <span className="text-[9px] font-mono text-zinc-600 uppercase">LOCALPERSISTENT_v1</span>
              <button
                onClick={() => { setActiveSection('collab'); playChime('triangle', 1.0); }}
                className="text-[10px] font-mono font-bold text-[#39FF14] hover:underline"
              >
                OPEN PANEL ▸
              </button>
            </div>
          </div>

          {/* Card 2: Ghost Poetic Presence */}
          <div className="border border-zinc-900 bg-black/60 rounded-xl p-5 hover:border-[#FF2BD6]/40 transition-all group relative overflow-hidden flex flex-col justify-between">
            <div className="absolute top-0 right-0 w-16 h-16 bg-[#FF2BD6]/5 rounded-bl-full pointer-events-none group-hover:bg-[#FF2BD6]/10 transition-all" />
            <div className="space-y-3">
              <div className="flex justify-between items-center text-[10px] font-mono text-zinc-500">
                <span>DUMB_APP // NODE_02</span>
                <span className="text-[#FF2BD6] font-bold">👻 CONSOLING</span>
              </div>
              <h4 className="text-md font-extrabold text-white uppercase group-hover:text-[#FF2BD6] transition-all">
                GHOST DEEP RESIDUE
              </h4>
              <p className="text-xs text-zinc-400 leading-relaxed font-mono">
                An eerie poetic presence responding in dithered analog poetry signals. Generates haikus, corrupted text sequences, and core memory files.
              </p>
            </div>
            <div className="pt-4 flex items-center justify-between border-t border-zinc-950 mt-4">
              <span className="text-[9px] font-mono text-zinc-600 uppercase">LOCAL_AI_SIMULATOR</span>
              <button
                onClick={() => { setActiveSection('ghost'); playChime('triangle', 1.1); }}
                className="text-[10px] font-mono font-bold text-[#FF2BD6] hover:underline"
              >
                OPEN NODE ▸
              </button>
            </div>
          </div>

          {/* Card 3: Micro-Beats Drum Machine */}
          <div className="border border-zinc-900 bg-black/60 rounded-xl p-5 hover:border-[#EFFF04]/40 transition-all group relative overflow-hidden flex flex-col justify-between">
            <div className="absolute top-0 right-0 w-16 h-16 bg-[#EFFF04]/5 rounded-bl-full pointer-events-none group-hover:bg-[#EFFF04]/10 transition-all" />
            <div className="space-y-3">
              <div className="flex justify-between items-center text-[10px] font-mono text-zinc-500">
                <span>DUMB_APP // NODE_03</span>
                <span className="text-[#EFFF04]">AUD_COIL</span>
              </div>
              <h4 className="text-md font-extrabold text-white uppercase group-hover:text-[#EFFF04] transition-all">
                MICRO_BEATS SEQUENCER
              </h4>
              <p className="text-xs text-zinc-400 leading-relaxed font-mono">
                A tiny, dithered 4-step drum and noise synthesizer using standard Web Audio oscillators to generate microtonal click beats and vintage kicks.
              </p>
            </div>
            <div className="pt-4 flex items-center justify-between border-t border-zinc-950 mt-4">
              <span className="text-[9px] font-mono text-zinc-600 uppercase">GITHUB_RELEASES</span>
              <a
                href="https://github.com/merrypranxter"
                target="_blank"
                rel="noreferrer"
                className="text-[10px] font-mono font-bold text-[#EFFF04] hover:underline flex items-center gap-0.5"
              >
                <span>VISIT GIT</span>
                <Github className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* Card 4: Repo-Decimator Terminal */}
          <div className="border border-zinc-900 bg-black/60 rounded-xl p-5 hover:border-[#00F0FF]/40 transition-all group relative overflow-hidden flex flex-col justify-between">
            <div className="absolute top-0 right-0 w-16 h-16 bg-[#00F0FF]/5 rounded-bl-full pointer-events-none group-hover:bg-[#00F0FF]/10 transition-all" />
            <div className="space-y-3">
              <div className="flex justify-between items-center text-[10px] font-mono text-zinc-500">
                <span>DUMB_APP // NODE_04</span>
                <span className="text-[#00F0FF]">SYS_COMP</span>
              </div>
              <h4 className="text-md font-extrabold text-white uppercase group-hover:text-[#00F0FF] transition-all">
                REPO DECIMATOR
              </h4>
              <p className="text-xs text-zinc-400 leading-relaxed font-mono">
                An absolute, irreversible compilation compression system designed to crush large directories into minimalist, beautiful static dither streams.
              </p>
            </div>
            <div className="pt-4 flex items-center justify-between border-t border-zinc-950 mt-4">
              <span className="text-[9px] font-mono text-zinc-600 uppercase">PRIVATE_SCRIPT</span>
              <a
                href="https://github.com/merrypranxter"
                target="_blank"
                rel="noreferrer"
                className="text-[10px] font-mono font-bold text-[#00F0FF] hover:underline flex items-center gap-0.5"
              >
                <span>LOCKED</span>
                <Github className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* Card 5: Glitch Cookbook */}
          <div className="border border-[#EFFF04]/30 bg-black/60 rounded-xl p-5 hover:border-[#EFFF04] transition-all group relative overflow-hidden flex flex-col justify-between shadow-[0_0_15px_rgba(239,255,4,0.02)]">
            <div className="absolute top-0 right-0 w-16 h-16 bg-[#EFFF04]/5 rounded-bl-full pointer-events-none group-hover:bg-[#EFFF04]/10 transition-all" />
            <div className="space-y-3">
              <div className="flex justify-between items-center text-[10px] font-mono text-zinc-500">
                <span>DUMB_APP // NODE_05</span>
                <span className="text-[#EFFF04] font-bold">☣️ VIEW ONLY</span>
              </div>
              <h4 className="text-md font-extrabold text-white uppercase group-hover:text-[#EFFF04] transition-all">
                GLITCH COOKBOOK
              </h4>
              <p className="text-xs text-zinc-400 leading-relaxed font-mono">
                An interactive recipe ledger containing real-time dither shaders, retro CRT filters, and scanline matrix styles to warp pixel pipelines.
              </p>
            </div>
            <div className="pt-4 flex items-center justify-between border-t border-zinc-950 mt-4">
              <span className="text-[9px] font-mono text-zinc-600 uppercase">GLITCH_V2</span>
              <a
                href="https://github.com/merrypranxter/Glitch-Cookbook"
                target="_blank"
                rel="noreferrer"
                className="text-[10px] font-mono font-bold text-[#EFFF04] hover:underline flex items-center gap-0.5"
              >
                <span>OPEN RECIPES</span>
                <Github className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

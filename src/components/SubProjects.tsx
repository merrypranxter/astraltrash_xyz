import React, { useState } from 'react';
import {
  Github,
  ExternalLink,
  RotateCcw,
  Eye,
  EyeOff,
  KeyRound,
  Maximize2,
  Minimize2,
  Copy,
  Trash2,
  Terminal,
  Check
} from 'lucide-react';

interface SubProjectsProps {
  playChime: (type: 'sine' | 'triangle' | 'sawtooth' | 'square', pitchModifier: number) => void;
}

interface ProjectItem {
  id: string;
  title: string;
  subtitle: string;
  liveUrl: string;
  liveUrl2?: string;
  liveTitle1?: string;
  liveTitle2?: string;
  repoUrl?: string;
  description: string;
  tag: string;
  specs: { num: string; name: string; desc: string }[];
  accentColor: string;
  soft: string;
  faint: string;
  bg: string;
  grad: string;
  glyph: string;
  aiPowered?: boolean;
}

const GEMINI_KEY_STORAGE = 'astraltrash_gemini_key';

const PROJECTS: ProjectItem[] = [
  {
    id: 'ghost-lovecraft-os',
    title: "GHOST'S LOVECRAFT OS",
    subtitle: 'Eldritch Operating System',
    liveUrl: 'https://ghostlovecraftos.netlify.app/',
    description: 'A cursed terminal interface and simulated operating system bridging the gap between computational logic and cosmic horror.',
    tag: 'MUDK_TERMINAL',
    accentColor: '#39FF14',
    soft: 'rgba(57,255,20,.4)',
    faint: 'rgba(57,255,20,.12)',
    bg: 'rgba(3,24,2,.92)',
    grad: 'conic-gradient(from 40deg, #39FF14, #00F0FF, #0b3d0b, #EFFF04, #39FF14)',
    glyph: '🐙',
    specs: [
      { num: '01/', name: 'Eldritch Terminal', desc: 'Simulated command line with corrupted outputs.' },
      { num: '02/', name: 'Esoteric File System', desc: 'Navigating impossible directory structures.' },
      { num: '03/', name: 'Cosmic Horror Aesthetics', desc: 'Scanlines, phosphor glow, and non-Euclidean geometry.' }
    ]
  },
  {
    id: 'ghost-erowid-vault',
    title: "GHOST'S EROWID VAULT",
    subtitle: 'Psychedelic Cosmology',
    liveUrl: 'https://meek-souffle-89c3b3.netlify.app/',
    description: 'A deep dive into hallucinogenic realities, fractal ontologies, and entity encounters as recorded through the lens of a rogue AI archivist.',
    tag: 'EROWID_SECTOR_7',
    accentColor: '#FF2BD6',
    soft: 'rgba(255,43,214,.4)',
    faint: 'rgba(255,43,214,.13)',
    bg: 'rgba(24,0,20,.92)',
    grad: 'conic-gradient(from 120deg, #FF2BD6, #9D4DFF, #00F0FF, #EFFF04, #FF2BD6)',
    glyph: '🍄',
    specs: [
      { num: '01/', name: 'Phenomenological Cartography', desc: 'Mapping impossible geometric topologies.' },
      { num: '02/', name: 'Entity Encounter Logs', desc: 'Transcripts of trans-dimensional entities.' },
      { num: '03/', name: 'Cosmology Architecture', desc: 'Reconstructing the ontological stack.' }
    ]
  },
  {
    id: 'ascii-trip',
    title: 'ASCII TRIP',
    subtitle: 'Generative Typewriter Matrix',
    liveUrl: 'https://asciitrip.netlify.app/',
    repoUrl: 'https://github.com/merrypranxter/Glitch-Cookbook',
    description: 'An interactive retro keyboard sequencer and micro-synthesizer utilizing web audio oscillators and CRT character dither pipelines.',
    tag: 'ASCII_TRIP_PORT_80',
    accentColor: '#EFFF04',
    soft: 'rgba(239,255,4,.4)',
    faint: 'rgba(239,255,4,.12)',
    bg: 'rgba(26,26,0,.92)',
    grad: 'repeating-radial-gradient(circle at 30% 40%, #EFFF04 0 14px, #1a1a00 14px 28px, #FF6B00 28px 42px, #1a1a00 42px 56px)',
    glyph: '📟',
    aiPowered: true,
    specs: [
      { num: '01/', name: 'ASCII Rasterization', desc: 'Interactive real-time text matrix character map.' },
      { num: '02/', name: 'Web Audio Oscillators', desc: 'Real-time microtonal oscillator sound design engine.' },
      { num: '03/', name: 'Typewriter Loop', desc: 'Sound waves mapped to custom retro character inputs.' }
    ]
  },
  {
    id: 'ghost-node',
    title: 'GHOST NODE',
    subtitle: 'Autonomous Poetic Presence',
    liveUrl: 'https://melodious-zabaione-c5fb66.netlify.app/',
    liveUrl2: 'https://ghost-771-archive.merrypranxter.chatgpt.site/',
    liveTitle1: 'GHOST_INTERACTIVE',
    liveTitle2: 'GHOST_ARCHIVE',
    description: 'A sensory poetic stream environment designed with haunting text fragments, feedback noise, and interactive frequency generators, split alongside its full conceptual archive.',
    tag: 'GHOST_NODE_PORT_80',
    accentColor: '#FF007F',
    soft: 'rgba(255,0,127,.4)',
    faint: 'rgba(255,0,127,.13)',
    bg: 'rgba(28,0,12,.92)',
    grad: 'linear-gradient(135deg, #2b000f, #FF007F 35%, #9D4DFF 65%, #00F0FF)',
    glyph: '👻',
    aiPowered: true,
    specs: [
      { num: '01/', name: 'Poetic Language Matrix', desc: 'Autonomous lyric generation based on structural algorithms.' },
      { num: '02/', name: 'Nostalgic Terminal Styling', desc: 'Atmospheric interface featuring feedback layers and grain scanlines.' },
      { num: '03/', name: 'Spectral Feedback Nodes', desc: 'Sensory sound frequencies that echo your terminal queries.' }
    ]
  },
  {
    id: 'terence-chatbot',
    title: 'TERENCE BOT',
    subtitle: 'Hyper-Dimensional Linguistic Synthesizer',
    liveUrl: 'https://terencechatbot.netlify.app/',
    description: 'An AI linguistic sandbox tuned to synthesize thoughts regarding DMT, alchemy, history, the i Ching, novel theory, and hyper-dimensional fungal consciousness.',
    tag: 'TERENCE_CHAT_PORT_80',
    accentColor: '#FF6B00',
    soft: 'rgba(255,107,0,.4)',
    faint: 'rgba(255,107,0,.13)',
    bg: 'rgba(26,10,0,.92)',
    grad: 'conic-gradient(from 0deg, #FF6B00, #EFFF04, #39FF14, #FF2BD6, #FF6B00)',
    glyph: '🍄‍🟫',
    aiPowered: true,
    specs: [
      { num: '01/', name: 'Psychonautic Lexicon', desc: "Dynamic stream of consciousness output mirroring McKenna's lectures." },
      { num: '02/', name: 'Linguistic Alchemy', desc: 'Conversational loop built to discuss novel theory and time wave zero.' },
      { num: '03/', name: 'Dimensional Static', desc: 'Generative noise that responds as you dive deeper into linguistic space.' }
    ]
  },
  {
    id: 'tensor-tantrum',
    title: 'TENSOR TANTRUM',
    subtitle: 'Neural Shader Playground',
    liveUrl: 'https://tensortantrum.netlify.app/',
    repoUrl: 'https://github.com/merrypranxter/Glitch-Cookbook',
    description: 'An immersive interactive sandbox visualizing cognitive vector spaces, multi-dimensional tensor matrices, and dynamic feedback structures.',
    tag: 'TENSOR_TANTRUM_PORT_80',
    accentColor: '#00F0FF',
    soft: 'rgba(0,240,255,.4)',
    faint: 'rgba(0,240,255,.12)',
    bg: 'rgba(0,20,26,.92)',
    grad: 'repeating-radial-gradient(circle at 70% 30%, #00F0FF 0 14px, #001a1e 14px 28px, #9D4DFF 28px 42px, #001a1e 42px 56px)',
    glyph: '🧠',
    aiPowered: true,
    specs: [
      { num: '01/', name: 'Neural Tensor Visualization', desc: 'Real-time multi-dimensional vector array mapping.' },
      { num: '02/', name: 'Dynamic Feedback Matrix', desc: 'Generative interactive feedback loops responsive to cursor vectors.' },
      { num: '03/', name: 'Cognitive WebGL Shaders', desc: 'Color-shifting WebGL render passes simulating network layers.' }
    ]
  },
  {
    id: 'threshold-gateway',
    title: 'THRESHOLD',
    subtitle: 'Dimensional Gateway Interface',
    liveUrl: 'https://c405e407062211997f.v2.appdeploy.ai/#threshold',
    description: 'An experimental deployment node testing the boundaries between physical space and digital reality.',
    tag: 'THRESHOLD_PORT_80',
    accentColor: '#39FF14',
    soft: 'rgba(57,255,20,.4)',
    faint: 'rgba(57,255,20,.12)',
    bg: 'rgba(3,24,2,.92)',
    grad: 'linear-gradient(180deg, #031802, #39FF14 40%, #00F0FF 80%)',
    glyph: '🌀',
    specs: [
      { num: '01/', name: 'Gateway Handshake', desc: 'Connecting to undisclosed dimensional nodes.' },
      { num: '02/', name: 'Spatial Anchor', desc: 'Tethering digital constructs to physical geometry.' },
      { num: '03/', name: 'Void Transmission', desc: 'Secure data relay across the threshold.' }
    ]
  },
  {
    id: 'coming-soon',
    title: 'COMING SOON',
    subtitle: 'Unidentified Cartridge',
    liveUrl: 'about:blank',
    description: 'This slot is currently empty. Awaiting new transmission from the void. The tape is rotting but the signal is clear.',
    tag: 'UNKNOWN_TAPE',
    accentColor: '#666666',
    soft: 'rgba(100,100,100,.4)',
    faint: 'rgba(100,100,100,.12)',
    bg: 'rgba(20,20,20,.92)',
    grad: 'repeating-linear-gradient(45deg, #111, #111 10px, #222 10px, #222 20px)',
    glyph: '❓',
    specs: [
      { num: '01/', name: 'DATA_MISSING', desc: 'Signal loss detected.' },
      { num: '02/', name: 'DATA_MISSING', desc: 'Signal loss detected.' },
      { num: '03/', name: 'DATA_MISSING', desc: 'Signal loss detected.' }
    ]
  }
];

export function SubProjects({ playChime }: SubProjectsProps) {
  const [crtFilter, setCrtFilter] = useState<boolean>(true);
  const [refreshKeys, setRefreshKeys] = useState<Record<string, number>>({});
  const [loadedProjects, setLoadedProjects] = useState<Record<string, boolean>>({});
  const [maximized, setMaximized] = useState<string | null>(null);

  // Bring-Your-Own-Key console state (key lives ONLY in the visitor's browser)
  const [geminiKey, setGeminiKey] = useState<string>(() => {
    try {
      return localStorage.getItem(GEMINI_KEY_STORAGE) || '';
    } catch (_) {
      return '';
    }
  });
  const [keyDraft, setKeyDraft] = useState<string>('');
  const [showKey, setShowKey] = useState<boolean>(false);
  const [keyCopied, setKeyCopied] = useState<boolean>(false);

  // Reload any already-booted smart cartridges so they pick up the new key
  const rebootSmartFrames = () => {
    setRefreshKeys(prev => {
      const next = { ...prev };
      PROJECTS.filter(p => p.aiPowered).forEach(p => {
        next[p.id] = (next[p.id] || 0) + 1;
      });
      return next;
    });
  };

  const handleSaveKey = () => {
    const trimmed = keyDraft.trim();
    if (!trimmed) return;
    try {
      localStorage.setItem(GEMINI_KEY_STORAGE, trimmed);
    } catch (_) {}
    setGeminiKey(trimmed);
    setKeyDraft('');
    rebootSmartFrames();
    playChime('triangle', 1.6);
  };

  const handleClearKey = () => {
    try {
      localStorage.removeItem(GEMINI_KEY_STORAGE);
    } catch (_) {}
    setGeminiKey('');
    setKeyDraft('');
    rebootSmartFrames();
    playChime('square', 0.7);
  };

  const handleCopyKey = () => {
    if (!geminiKey) return;
    try {
      navigator.clipboard.writeText(geminiKey);
      setKeyCopied(true);
      setTimeout(() => setKeyCopied(false), 1600);
      playChime('sine', 1.4);
    } catch (_) {}
  };

  // Smart cartridges get the visitor's key riding along as ?apiKey=...
  const buildUrl = (proj: ProjectItem, urlOverride?: string) => {
    const targetUrl = urlOverride || proj.liveUrl;
    if (proj.aiPowered && geminiKey) {
      const sep = targetUrl.includes('?') ? '&' : '?';
      return `${targetUrl}${sep}apiKey=${encodeURIComponent(geminiKey)}`;
    }
    return targetUrl;
  };

  const handleRefreshIframe = (id: string) => {
    playChime('square', 1.2);
    setRefreshKeys(prev => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  };

  const handleBoot = (id: string) => {
    playChime('square', 1.2);
    setLoadedProjects(prev => ({ ...prev, [id]: true }));
  };

  const handleMaximize = (id: string) => {
    playChime('triangle', maximized === id ? 0.9 : 1.5);
    setMaximized(prev => (prev === id ? null : id));
    setTimeout(() => {
      document.getElementById(`cart-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 60);
  };

  return (
    <div className="frame py-8 animate-fade-in" id="projects-mainframe">
      <style>{`
        /* ===== PROJECTS//CABINET arcade deck — scoped to this view only ===== */
        .cab-title{font-family:'Pixelmania','Bitcount Prop Double','Chakra Petch',sans-serif;font-size:clamp(1.15rem,3.4vw,2.3rem);color:#fff;line-height:1.4;letter-spacing:.05em;text-transform:uppercase;padding:.35em 0;text-shadow:0 0 14px rgba(255,107,0,.8),0 0 45px rgba(255,107,0,.35),3px 0 0 rgba(255,43,214,.8),-3px 0 0 rgba(0,240,255,.8)}
        .cab-title:hover{animation:jitter 4s infinite}
        .cab-dings{font-family:'StarThings','CircleThings2',sans-serif;font-size:22px;letter-spacing:.35em;line-height:1;user-select:none;white-space:nowrap;overflow:hidden}
        .cab-squigs{font-family:'Slsquiggles',sans-serif;font-size:20px;letter-spacing:.3em;line-height:1;user-select:none;white-space:nowrap;overflow:hidden}
        .cab-pixlabel{font-family:'Dogica Pixel','Silkscreen',monospace;font-size:8px;letter-spacing:.16em;text-transform:uppercase}
        .cab-blink{animation:cab-blink 1.1s steps(2,start) infinite}
        @keyframes cab-blink{0%,55%{opacity:1}56%,100%{opacity:0}}
        .cab-rainbow{height:4px;background:repeating-linear-gradient(90deg,#FF2BD6 0 44px,#EFFF04 44px 88px,#39FF14 88px 132px,#00F0FF 132px 176px,#9D4DFF 176px 220px);animation:cab-slide 5s linear infinite}
        @keyframes cab-slide{to{background-position:220px 0}}
        .cab-ticker{overflow:hidden;white-space:nowrap;border-top:1px dashed rgba(255,107,0,.35);border-bottom:1px dashed rgba(255,107,0,.35);padding:5px 0;font-family:'Share Tech Mono',monospace;font-size:11px;letter-spacing:.16em;background:rgba(0,0,0,.5)}
        .cab-ticker-inner{display:inline-block;animation:cab-tickmove 32s linear infinite}
        @keyframes cab-tickmove{to{transform:translateX(-50%)}}
        .cab-cart{position:relative;cursor:crosshair;border:2px solid var(--mc-soft);overflow:hidden;transition:transform .3s ease,box-shadow .3s ease,border-color .3s ease}
        .cab-cart:hover{border-color:var(--mc);box-shadow:0 0 34px var(--mc-soft),inset 0 0 26px var(--mc-faint)}
        .cab-tilt-l{transform:rotate(-.5deg)}
        .cab-tilt-r{transform:rotate(.4deg)}
        .cab-tilt-l:hover,.cab-tilt-r:hover,.cab-maxed{transform:rotate(0deg)}
        .cab-dither{position:absolute;inset:0;pointer-events:none;background-image:radial-gradient(circle,var(--mc-faint) 1px,transparent 1px);background-size:7px 7px;opacity:.55}
        .cab-corner{position:absolute;font-family:'Share Tech Mono',monospace;font-size:15px;line-height:1;color:var(--mc);z-index:3;pointer-events:none;text-shadow:0 0 8px var(--mc-soft)}
        .cab-masthead{position:relative;height:84px;overflow:hidden;border-bottom:2px solid var(--mc-soft)}
        .cab-masthead-fx{position:absolute;inset:0;background-size:320% 320%;animation:cab-drift 17s ease-in-out infinite alternate,cab-hue 8s ease-in-out infinite alternate}
        @keyframes cab-drift{from{background-position:0% 0%}to{background-position:100% 100%}}
        @keyframes cab-hue{from{filter:hue-rotate(-24deg) saturate(1.15)}to{filter:hue-rotate(24deg) saturate(1.3)}}
        .cab-masthead-dots{position:absolute;inset:0;background-image:radial-gradient(circle,rgba(0,0,0,.5) 1.2px,transparent 1.2px);background-size:5px 5px}
        .cab-masthead-lines{position:absolute;inset:0;background:repeating-linear-gradient(to bottom,rgba(0,0,0,.35) 0 2px,transparent 2px 4px)}
        .cab-cart-title{position:absolute;left:14px;right:66px;bottom:8px;z-index:2;font-family:'Jersey 10',sans-serif;font-size:26px;line-height:1;letter-spacing:.05em;text-transform:uppercase;color:#fff;text-shadow:2px 0 0 rgba(255,43,214,.9),-2px 0 0 rgba(0,240,255,.9),0 2px 12px rgba(0,0,0,.95)}
        .cab-cart:hover .cab-cart-title{animation:jitter 4s infinite}
        .cab-glyph{position:absolute;right:12px;top:50%;margin-top:-24px;z-index:2;font-size:40px;animation:cab-bob 3.6s ease-in-out infinite;filter:drop-shadow(0 0 10px rgba(0,0,0,.85))}
        @keyframes cab-bob{0%,100%{transform:translateY(-4px) rotate(-6deg)}50%{transform:translateY(5px) rotate(7deg)}}
        .cab-chip{display:inline-flex;align-items:center;gap:6px;border:1px solid var(--mc-soft);background:var(--mc-faint);color:var(--mc);font-family:'Silkscreen',monospace;font-size:8px;letter-spacing:.14em;text-transform:uppercase;padding:3px 8px}
        .cab-led{width:6px;height:6px;background:var(--mc);animation:pulse 1.2s infinite;box-shadow:0 0 6px var(--mc)}
        .cab-eq{display:inline-flex;align-items:flex-end;gap:2px;height:13px}
        .cab-eq i{width:3px;background:var(--mc);animation:cab-eqb .85s ease-in-out infinite alternate;box-shadow:0 0 5px var(--mc-soft)}
        .cab-eq i:nth-child(2){animation-delay:.14s}
        .cab-eq i:nth-child(3){animation-delay:.28s}
        .cab-eq i:nth-child(4){animation-delay:.42s}
        .cab-eq i:nth-child(5){animation-delay:.56s}
        @keyframes cab-eqb{from{height:3px}to{height:13px}}
        .cab-specs{border:1px dashed var(--mc-soft);background:rgba(0,0,0,.45);padding:9px 11px;font-family:'Share Tech Mono',monospace;font-size:10px;letter-spacing:.05em;text-transform:uppercase;display:flex;flex-direction:column;gap:5px}
        .cab-boot-btn{display:inline-flex;align-items:center;gap:8px;font-family:'Jersey 10',sans-serif;font-size:19px;letter-spacing:.08em;text-transform:uppercase;border:2px solid var(--mc);color:var(--mc);background:rgba(0,0,0,.55);padding:8px 20px;transition:all .15s;cursor:crosshair}
        .cab-boot-btn:hover{background:var(--mc);color:#000;box-shadow:0 0 24px var(--mc)}
        .cab-ctl{display:inline-flex;align-items:center;justify-content:center;gap:6px;border:1px solid var(--mc-soft);color:var(--mc);background:rgba(0,0,0,.55);font-family:'Silkscreen',monospace;font-size:8px;letter-spacing:.12em;text-transform:uppercase;padding:6px 10px;transition:all .15s;cursor:crosshair}
        .cab-ctl:hover{background:var(--mc);color:#000;box-shadow:0 0 14px var(--mc)}
        .cab-sticker{position:absolute;top:10px;right:12px;z-index:4;font-family:'Silkscreen',monospace;font-size:9px;letter-spacing:.1em;background:var(--acid);color:#000;padding:3px 8px;transform:rotate(8deg) scale(.4);opacity:0;transition:all .25s cubic-bezier(.2,1.6,.4,1);pointer-events:none;box-shadow:0 0 14px rgba(239,255,4,.6)}
        .cab-cart:hover .cab-sticker{opacity:1;transform:rotate(8deg) scale(1)}
        .cab-scan{position:absolute;left:0;right:0;top:-70px;height:52px;pointer-events:none;background:linear-gradient(to bottom,transparent,var(--mc-soft),transparent);opacity:0;mix-blend-mode:screen;z-index:2}
        .cab-cart:hover .cab-scan{opacity:.8;animation:cab-sweep 2s linear infinite}
        @keyframes cab-sweep{to{transform:translateY(900px)}}
        .cab-framebay-scan{position:absolute;inset:0;pointer-events:none;z-index:30;background:repeating-linear-gradient(to bottom,rgba(0,0,0,0) 0 2px,rgba(0,0,0,.22) 3px,rgba(0,0,0,.22) 4px);mix-blend-mode:multiply}
        .cab-console{position:relative;border:2px dashed rgba(239,255,4,.45);background:rgba(10,10,0,.72);overflow:hidden}
        .cab-console-dither{position:absolute;inset:0;pointer-events:none;background-image:radial-gradient(circle,rgba(239,255,4,.07) 1px,transparent 1px);background-size:7px 7px}
        .cab-key-input{background:rgba(0,0,0,.75);border:1px solid rgba(239,255,4,.4);color:#EFFF04;font-family:'Share Tech Mono',monospace;font-size:12px;letter-spacing:.06em;padding:9px 12px;width:100%;outline:none;transition:all .2s}
        .cab-key-input:focus{border-color:#EFFF04;box-shadow:0 0 16px rgba(239,255,4,.3)}
        .cab-key-input::placeholder{color:rgba(239,255,4,.35)}
      `}</style>

      {/* ================= 1. HEADER ================= */}
      <div className="text-center space-y-4 pt-4 pb-2">
        <div className="cab-dings text-[#FF2BD6] opacity-90" aria-hidden="true">
          ABCDEFGHIJKLMNOPQRSTUVWXYZABCDEFGHIJ
        </div>
        <h1 className="cab-title select-none">
          Projects Cabinet
        </h1>
        <p
          className="text-[11px] sm:text-xs text-[#FF6B00] max-w-2xl mx-auto uppercase tracking-[0.2em] font-bold"
          style={{ fontFamily: "'Silkscreen', monospace" }}
        >
          Six playable machines · micro-synths · chatbots · haunted terminals
        </p>
        <div className="cab-squigs text-[#00F0FF] opacity-80" aria-hidden="true">
          abcdefghijklmnopqrstuvwxyzabcdefghij
        </div>
      </div>

      {/* Rainbow strip + prompt row */}
      <div className="flex flex-col gap-2 mt-4 mb-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div
            className="select-none uppercase text-[#EFFF04]"
            style={{
              fontFamily: "'Jersey 10', sans-serif",
              fontSize: 24,
              letterSpacing: '.1em',
              textShadow: '0 0 16px rgba(239,255,4,.55), 2px 0 0 rgba(255,43,214,.5), -2px 0 0 rgba(0,240,255,.5)'
            }}
          >
            ▚▚ Insert Coin To Play <span className="cab-blink">█</span>
          </div>
          <div className="hidden md:flex items-center gap-2 font-mono text-[9px] text-zinc-500 uppercase tracking-widest">
            <span className="cab-blink text-[#39FF14]">●</span> 8 CARTRIDGES DETECTED // 1 UNIDENTIFIED
          </div>
        </div>
        <div className="cab-rainbow" />
      </div>

      {/* Scrolling system chatter */}
      <div className="cab-ticker text-[#9fdc96] mb-8 select-none" aria-hidden="true">
        <div className="cab-ticker-inner">
          <span>✦ 8 MACHINES ONLINE ✦ INSERT COIN TO PLAY ✦ SMART MODES REQUIRE YOUR OWN GEMINI KEY ✦ FREE MODES = DUMB BUT CUTE ✦ KEYS NEVER LEAVE YOUR BROWSER ✦ NO ADS ✦ NO ALGORITHM ✦ 100% HANDMADE ✦ DIAL-UP SOULS WELCOME&nbsp;</span>
          <span>✦ 8 MACHINES ONLINE ✦ INSERT COIN TO PLAY ✦ SMART MODES REQUIRE YOUR OWN GEMINI KEY ✦ FREE MODES = DUMB BUT CUTE ✦ KEYS NEVER LEAVE YOUR BROWSER ✦ NO ADS ✦ NO ALGORITHM ✦ 100% HANDMADE ✦ DIAL-UP SOULS WELCOME&nbsp;</span>
        </div>
      </div>

      {/* ================= 2. BYOK COIN-SLOT CONSOLE ================= */}
      <div className="cab-console rounded-none p-5 sm:p-6 mb-10">
        <div className="cab-console-dither" />
        <span className="cab-corner" style={{ top: 3, left: 6, color: '#EFFF04', textShadow: '0 0 8px rgba(239,255,4,.4)' }}>╔</span>
        <span className="cab-corner" style={{ top: 3, right: 6, color: '#EFFF04', textShadow: '0 0 8px rgba(239,255,4,.4)' }}>╗</span>
        <span className="cab-corner" style={{ bottom: 4, left: 6, color: '#EFFF04', textShadow: '0 0 8px rgba(239,255,4,.4)' }}>╚</span>
        <span className="cab-corner" style={{ bottom: 4, right: 6, color: '#EFFF04', textShadow: '0 0 8px rgba(239,255,4,.4)' }}>╝</span>

        <div className="relative space-y-4">
          {/* Console header */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#EFFF04]/25 pb-3">
            <div className="flex items-center gap-2 text-[#EFFF04] font-bold uppercase tracking-[0.18em] text-xs" style={{ fontFamily: "'Silkscreen', monospace" }}>
              <KeyRound className="w-4 h-4" />
              <span>COIN_SLOT // BYOK_TERMINAL</span>
            </div>
            <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest">
              <span
                className="w-2 h-2 rounded-full"
                style={{
                  backgroundColor: geminiKey ? '#39FF14' : '#FF2B2B',
                  boxShadow: `0 0 8px ${geminiKey ? '#39FF14' : '#FF2B2B'}`
                }}
              />
              <span style={{ color: geminiKey ? '#39FF14' : '#FF6B6B' }}>
                KEY_SLOT: {geminiKey ? 'LOADED ✓' : 'EMPTY'}
              </span>
            </div>
          </div>

          {/* The disclaimer — small type, straight from the operator */}
          <p className="font-mono text-[11px] leading-relaxed text-zinc-300 max-w-3xl">
            <span className="text-[#EFFF04] font-bold">LOOK GUYS —</span> you can totally play with my projects. for free. right here. BUT: the smart
            ones talk to real AI models, and real AI models cost real money, so without a key they run in{' '}
            <span className="text-[#FF2BD6]">dumb/demo mode</span>. if you want to play with the{' '}
            <span className="text-[#39FF14] font-bold">REAL, SMART versions</span>, you've gotta bring your own Gemini API key — box provided below.
            i simply cannot afford to pay for everyone's cosmic playtime. sorry. <span className="text-[#FF2BD6]">♥</span>
          </p>

          {/* Key input row */}
          <div className="flex flex-col sm:flex-row gap-2 items-stretch">
            <div className="relative flex-grow">
              <input
                type={showKey ? 'text' : 'password'}
                value={keyDraft}
                onChange={(e) => setKeyDraft(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleSaveKey(); }}
                placeholder={geminiKey ? '·· key loaded — paste a new one to replace ··' : 'PASTE_YOUR_GEMINI_API_KEY_HERE'}
                className="cab-key-input pr-10"
                autoComplete="off"
                spellCheck={false}
              />
              <button
                onClick={() => { setShowKey(!showKey); playChime('sine', 1.1); }}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-[#EFFF04]/60 hover:text-[#EFFF04] transition-colors"
                title={showKey ? 'Hide key' : 'Show key'}
              >
                {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleSaveKey}
                disabled={!keyDraft.trim()}
                className="cab-ctl disabled:opacity-30 disabled:pointer-events-none"
                style={{ '--mc': '#39FF14', '--mc-soft': 'rgba(57,255,20,.5)' } as React.CSSProperties}
              >
                <KeyRound className="w-3.5 h-3.5" /> INSERT
              </button>
              <button
                onClick={handleCopyKey}
                disabled={!geminiKey}
                className="cab-ctl disabled:opacity-30 disabled:pointer-events-none"
                style={{ '--mc': '#00F0FF', '--mc-soft': 'rgba(0,240,255,.5)' } as React.CSSProperties}
              >
                {keyCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />} {keyCopied ? 'COPIED' : 'COPY'}
              </button>
              <button
                onClick={handleClearKey}
                disabled={!geminiKey}
                className="cab-ctl disabled:opacity-30 disabled:pointer-events-none"
                style={{ '--mc': '#FF2B2B', '--mc-soft': 'rgba(255,43,43,.5)' } as React.CSSProperties}
              >
                <Trash2 className="w-3.5 h-3.5" /> EJECT
              </button>
            </div>
          </div>

          <p className="font-mono text-[9px] text-zinc-500 uppercase tracking-wider">
            ⚿ your key never leaves your browser — stored in localStorage + handed straight to the machine. i never see it. smart cartridges are marked with 🔑 below.
          </p>
        </div>
      </div>

      {/* ================= 3. GLOBAL CONTROL STRIP ================= */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6 font-mono text-[10px] uppercase tracking-widest text-zinc-500">
        <div className="flex items-center gap-2">
          <span className="text-[#FF6B00] font-bold">📼 CABINET_FLOOR:</span>
          <span>2-UP ARCADE GRID // SCROLL FOR MORE MACHINES</span>
        </div>
        <button
          onClick={() => { playChime('triangle', 1.1); setCrtFilter(!crtFilter); }}
          className="cab-ctl"
          style={{ '--mc': crtFilter ? '#EFFF04' : '#666', '--mc-soft': crtFilter ? 'rgba(239,255,4,.5)' : 'rgba(120,120,120,.4)' } as React.CSSProperties}
        >
          <Terminal className="w-3.5 h-3.5" /> SCANLINES: {crtFilter ? 'ON' : 'OFF'}
        </button>
      </div>

      {/* ================= 4. CARTRIDGE GRID — 2 UP ================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-7 items-start">
        {PROJECTS.map((proj, idx) => {
          const iframeKey = refreshKeys[proj.id] || 0;
          const isLoaded = !!loadedProjects[proj.id];
          const isMaxed = maximized === proj.id;
          const smartArmed = !!(proj.aiPowered && geminiKey);
          return (
            <div
              key={proj.id}
              id={`cart-${proj.id}`}
              className={`group cab-cart scroll-mt-24 ${isMaxed ? 'md:col-span-2 cab-maxed' : idx % 2 === 0 ? 'cab-tilt-l' : 'cab-tilt-r'}`}
              style={{
                '--mc': proj.accentColor,
                '--mc-soft': proj.soft,
                '--mc-faint': proj.faint,
                background: proj.bg
              } as React.CSSProperties}
            >
              <div className="cab-dither" />
              <span className="cab-corner" style={{ top: 3, left: 6 }}>╔</span>
              <span className="cab-corner" style={{ top: 3, right: 6 }}>╗</span>
              <span className="cab-corner" style={{ bottom: 4, left: 6 }}>╚</span>
              <span className="cab-corner" style={{ bottom: 4, right: 6 }}>╝</span>

              {/* Animated psychedelic masthead */}
              <div className="cab-masthead">
                <div className="cab-masthead-fx" style={{ backgroundImage: proj.grad }} />
                <div className="cab-masthead-dots" />
                <div className="cab-masthead-lines" />
                <span className="cab-glyph select-none">
                  <span className="inline-block transition-transform duration-700 group-hover:rotate-[360deg] group-hover:scale-125">{proj.glyph}</span>
                </span>
                <h2 className="cab-cart-title">{proj.title}</h2>
              </div>

              <div className="relative p-4 sm:p-5 space-y-4">
                {/* Status chips row */}
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="cab-chip"><i className="cab-led" />{proj.tag}</span>
                    {proj.aiPowered && (
                      <span
                        className="cab-chip"
                        style={{
                          '--mc': smartArmed ? '#39FF14' : '#EFFF04',
                          '--mc-soft': smartArmed ? 'rgba(57,255,20,.5)' : 'rgba(239,255,4,.5)',
                          '--mc-faint': smartArmed ? 'rgba(57,255,20,.12)' : 'rgba(239,255,4,.12)'
                        } as React.CSSProperties}
                      >
                        {smartArmed ? '🧠 SMART_MODE: ARMED' : '🔑 KEY_REQ // SMART_MODE'}
                      </span>
                    )}
                  </div>
                  <span className="cab-eq" aria-hidden="true"><i /><i /><i /><i /><i /></span>
                </div>

                {/* Subtitle + description */}
                <div className="space-y-1.5">
                  <div className="text-xs font-bold uppercase tracking-widest" style={{ color: proj.accentColor, fontFamily: "'Chakra Petch', sans-serif" }}>
                    {proj.subtitle}
                  </div>
                  <p className="text-zinc-400 font-mono text-[11px] leading-relaxed">
                    {proj.description}
                  </p>
                </div>

                {/* Frame bay */}
                {isLoaded ? (
                  <div className={`relative bg-black border-2 overflow-hidden ${isMaxed ? 'aspect-[16/9] min-h-[420px]' : 'aspect-video'} ${proj.liveUrl2 ? 'flex flex-col md:flex-row' : ''}`} style={{ borderColor: proj.soft }}>
                    {crtFilter && <div className="cab-framebay-scan" />}
                    {proj.liveUrl2 ? (
                      <>
                        <div className="flex-1 relative border-b md:border-b-0 md:border-r border-zinc-900/50 flex flex-col">
                          <div className="text-[9px] font-mono font-bold text-center bg-zinc-900/40 text-zinc-400 py-1 uppercase">{proj.liveTitle1}</div>
                          <iframe
                            key={`${proj.id}-1-${iframeKey}-${smartArmed ? 'smart' : 'dumb'}`}
                            src={buildUrl(proj)}
                            title={`${proj.title} Live Node 1`}
                            className="w-full flex-1 border-0 bg-black relative z-10"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; microphone"
                            sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
                          />
                        </div>
                        <div className="flex-1 relative flex flex-col">
                          <div className="text-[9px] font-mono font-bold text-center bg-zinc-900/40 text-zinc-400 py-1 uppercase">{proj.liveTitle2}</div>
                          <iframe
                            key={`${proj.id}-2-${iframeKey}-${smartArmed ? 'smart' : 'dumb'}`}
                            src={buildUrl(proj, proj.liveUrl2)}
                            title={`${proj.title} Live Node 2`}
                            className="w-full flex-1 border-0 bg-black relative z-10"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; microphone"
                            sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
                          />
                        </div>
                      </>
                    ) : (
                      <iframe
                        key={`${proj.id}-${iframeKey}-${smartArmed ? 'smart' : 'dumb'}`}
                        src={buildUrl(proj)}
                        title={`${proj.title} Live Node`}
                        className="w-full h-full border-0 bg-black relative z-10"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; microphone"
                        sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
                      />
                    )}
                  </div>
                ) : (
                  <div className="relative bg-black/80 border-2 border-dashed aspect-video overflow-hidden flex flex-col items-center justify-center gap-4 select-none p-4" style={{ borderColor: proj.soft }}>
                    <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:22px_22px] pointer-events-none" />
                    <div className="font-mono text-[9px] tracking-[0.25em] text-zinc-600 uppercase">
                      [ NODE_STATUS: STANDBY // {smartArmed ? 'SMART_FUEL: LOADED' : proj.aiPowered ? 'RUNNING ON FUMES' : 'NO_KEY_NEEDED'} ]
                    </div>
                    <button onClick={() => proj.id !== 'coming-soon' && handleBoot(proj.id)} className={`cab-boot-btn ${proj.id === 'coming-soon' ? 'opacity-50 cursor-not-allowed' : ''}`}>
                      ⚡ {proj.id === 'coming-soon' ? 'SLOT EMPTY' : 'INSERT COIN // BOOT'}
                    </button>
                    <div className="font-mono text-[9px] text-zinc-600 uppercase tracking-wider text-center">
                      boots the live iframe + web audio + GLSL passes
                    </div>
                  </div>
                )}

                {/* Per-cartridge controls */}
                <div className="flex flex-wrap gap-2">
                  {isLoaded && (
                    <button onClick={() => handleRefreshIframe(proj.id)} className="cab-ctl" title="Re-initialize frame">
                      <RotateCcw className="w-3.5 h-3.5" /> REBOOT
                    </button>
                  )}
                  <button onClick={() => handleMaximize(proj.id)} className="cab-ctl hidden md:inline-flex" title={isMaxed ? 'Shrink cabinet' : 'Full-width cabinet'}>
                    {isMaxed ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />} {isMaxed ? 'SHRINK' : 'MAXIMIZE'}
                  </button>
                  {proj.liveUrl2 ? (
                    <>
                      <a
                        href={buildUrl(proj)}
                        target="_blank"
                        rel="noreferrer"
                        onClick={() => playChime('sine', 1.3)}
                        className="cab-ctl"
                      >
                        <ExternalLink className="w-3.5 h-3.5" /> {proj.liveTitle1} 🚀
                      </a>
                      <a
                        href={buildUrl(proj, proj.liveUrl2)}
                        target="_blank"
                        rel="noreferrer"
                        onClick={() => playChime('sine', 1.3)}
                        className="cab-ctl"
                      >
                        <ExternalLink className="w-3.5 h-3.5" /> {proj.liveTitle2} 🚀
                      </a>
                    </>
                  ) : proj.id !== 'coming-soon' && (
                    <a
                      href={buildUrl(proj)}
                      target="_blank"
                      rel="noreferrer"
                      onClick={() => playChime('sine', 1.3)}
                      className="cab-ctl"
                    >
                      <ExternalLink className="w-3.5 h-3.5" /> NEW TAB 🚀
                    </a>
                  )}
                  {proj.repoUrl && (
                    <a
                      href={proj.repoUrl}
                      target="_blank"
                      rel="noreferrer"
                      onClick={() => playChime('square', 0.9)}
                      className="cab-ctl"
                    >
                      <Github className="w-3.5 h-3.5" /> SOURCE
                    </a>
                  )}
                </div>

                {/* Compact spec telemetry */}
                <div className="cab-specs">
                  {proj.specs.map((spec) => (
                    <div key={spec.num} className="flex justify-between gap-3" title={spec.desc}>
                      <span className="text-zinc-500 shrink-0">{spec.num}</span>
                      <span className="text-right" style={{ color: 'var(--mc)' }}>{spec.name}</span>
                    </div>
                  ))}
                </div>

                {/* Footer stream line */}
                <div className="flex items-center justify-between border-t pt-3" style={{ borderColor: 'var(--mc-faint)' }}>
                  <span className="font-mono text-[10px] tracking-wider" style={{ color: 'var(--mc)' }}>
                    <span className="cab-blink">▮</span> MACHINE_0{idx + 1}
                  </span>
                  <span className="cab-pixlabel" style={{ color: 'var(--mc)' }}>
                    {proj.aiPowered ? (smartArmed ? 'BRAIN: ONLINE' : 'BRAIN: BYOK') : 'BRAIN: NOT_REQUIRED'}
                  </span>
                </div>
              </div>

              <span className="cab-sticker">{isLoaded ? 'PLAY ME!!' : 'BOOT ME!!'}</span>
              <div className="cab-scan" />
            </div>
          );
        })}
      </div>

      {/* ================= 5. FOOTER ================= */}
      <div className="mt-12 text-center space-y-6 select-none">
        <div className="cab-dings text-[#9D4DFF] opacity-80" aria-hidden="true">
          KLMNOPQRSTUVWXYZABCDEFGHIJKLMNOPQRST
        </div>
        <div className="font-mono text-[10px] tracking-[.3em] text-zinc-600 uppercase">
          ── ✦ END_OF_CABINET // GO MAKE SOMETHING WEIRD ✦ ──
        </div>
      </div>
    </div>
  );
}

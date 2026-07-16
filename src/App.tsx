import { useEffect, useRef, useState, FormEvent } from 'react';
import { 
  Zap, 
  RefreshCw, 
  Play, 
  Sliders, 
  Code, 
  Terminal, 
  Volume2, 
  VolumeX,
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
  Eye,
  Clock,
  Pause,
  RotateCcw,
  ChevronLeft,
  ChevronsLeft,
  ChevronsRight,
  Mic,
  Music,
  Plus,
  Settings,
  FolderOpen
} from 'lucide-react';
import { ShaderThumbnail } from './components/ShaderThumbnail';
import { ShittyKaraoke } from './components/ShittyKaraoke';
import { SubProjects } from './components/SubProjects';
import AiSlop from './components/AiSlop';
import localExplanations from './explanations.json';
import AstralAbout from "./components/AstralAbout";

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

export interface Top8Item {
  id: number;
  title: string;
  fileName: string;
  desc: string;
  tag: string;
}

export interface BucketVideo {
  id: string;
  title: string;
  desc: string;
  fileName: string;
  duration?: string;
  tag?: string;
}

const defaultBucketVideos: BucketVideo[] = [
  {
    id: '1',
    title: 'KARAOKE_COIL_ALPHA',
    desc: 'raw mic test under maximum audio decay feedback filters',
    fileName: '043cc61ba55647cf9255de096ddca3b0',
    duration: '2:15',
    tag: 'VOX'
  },
  {
    id: '2',
    title: 'REPO_DECIMATOR_CHROME',
    desc: 'chroma soup visual accompaniment with heavy static buzz',
    fileName: '0ccfabac170d4647ad236b4c365c6978',
    duration: '3:45',
    tag: 'SLOP'
  },
  {
    id: '3',
    title: 'RAINBLOWN_RESONANCE',
    desc: 'psychedelic pitch warp vocal scales over computational sine waves',
    fileName: '0eb5bbb4779143a6a87e9958421d0df9',
    duration: '4:12',
    tag: 'MATH'
  },
  {
    id: '4',
    title: 'CHIMERIC_CATHEDRAL_SING',
    desc: 'sacred chamber delay resonance at 120hz',
    fileName: '1f3ae0ba040248be93daaa2c71c1bb82',
    duration: '2:50',
    tag: 'AMBIENT'
  },
  {
    id: '5',
    title: 'SPECTRAL_CANDY_BLUES',
    desc: 'recursive audio loop recorded on dithered microphone input',
    fileName: '2facc9c9d8eb417bb41164627263b08c',
    duration: '1:58',
    tag: 'FEEDBACK'
  },
  {
    id: '6',
    title: 'ORACLE_TAPE_DECAY',
    desc: 'prediction of database collapse delivered in screaming pitch',
    fileName: '2fbf47b319aa400bb5d81729b82ae12a',
    duration: '3:20',
    tag: 'GLITCH'
  },
  {
    id: '7',
    title: 'DITHERSCAPE_VORTEX',
    desc: 'infinite scrolling audio terrain with microtonal feedback',
    fileName: '3ea8120b040248be93daaa2c71c1bb82',
    duration: '2:40',
    tag: 'CRT'
  },
  {
    id: '8',
    title: 'ASTRAL_ANTHEM_FINAL',
    desc: 'ultimate sci-fi vocal explosion featuring 8-bit laser effects',
    fileName: '4fb147db97a9400bb5d81729b82ae12a',
    duration: '5:04',
    tag: 'CANON'
  }
];

const defaultTop8: Top8Item[] = [
  {
    id: 1,
    title: 'spectral_candy_garden_20260624_134032',
    fileName: 'spectral_candy_garden_20260624_134032.html',
    desc: 'vivid cosmic bloom of dithered particles and chromatic feedback loops',
    tag: 'GLSL'
  },
  {
    id: 2,
    title: 'repo-chroma-soup_20260701_223130.html',
    fileName: 'repo-chroma-soup_20260701_223130.html',
    desc: 'feral liquid soup of orbital repositories bleeding into chroma gradients',
    tag: 'FLUID'
  },
  {
    id: 3,
    title: 'rainblown_math.html',
    fileName: 'rainblown_math.html',
    desc: 'psychedelic wave formulas folded across a spectral field',
    tag: 'MATH'
  },
  {
    id: 4,
    title: 'chimeric-prism-cathedral_20260624_203924.html',
    fileName: 'chimeric-prism-cathedral_20260624_203924.html',
    desc: 'sacred space of refracting glass vectors and spectral light rays',
    tag: 'CMY'
  },
  {
    id: 5,
    title: 'spectral_candy_garden_20260626_151932.html',
    fileName: 'spectral_candy_garden_20260626_151932.html',
    desc: 'alternate candy seed blooming across recursive feedback planes',
    tag: 'GLSL'
  },
  {
    id: 6,
    title: 'repo-viz.html',
    fileName: 'repo-viz.html',
    desc: 'visualization of 100+ sacred artifacts glowing in raw orbit',
    tag: 'GLITCH'
  },
  {
    id: 7,
    title: 'rainblow-ditherscape (1).html',
    fileName: 'rainblow-ditherscape (1).html',
    desc: 'infinite horizontal dithering landscape under a chromatic sky',
    tag: 'VHS'
  },
  {
    id: 8,
    title: 'prismatic_tape_oracle_20260625_161140 (2).html',
    fileName: 'prismatic_tape_oracle_20260625_161140 (2).html',
    desc: 'prismatic feedback structures predicting the collapse of the database',
    tag: 'VOID'
  }
];

// Dossier section photos and timing for the About Me Section on the Home/Hub Tab
const DOSSIER_PHOTOS: string[] = [
  'https://raw.githubusercontent.com/merrypranxter/astraltrash_site_support/main/public/selfies/8016E78C-4FB1-47DB-97A9-9F79BC5881BC.png',
  'https://raw.githubusercontent.com/merrypranxter/astraltrash_site_support/main/public/selfies/IMG_0391.jpg',
  'https://raw.githubusercontent.com/merrypranxter/astraltrash_site_support/main/public/selfies/IMG_4171.jpg',
  'https://raw.githubusercontent.com/merrypranxter/astraltrash_site_support/main/public/selfies/IMG_4802.PNG',
  'https://raw.githubusercontent.com/merrypranxter/astraltrash_site_support/main/public/selfies/IMG_5614.PNG',
];

const DOSSIER_ROTATE_MS = 4200;

const DEFAULT_PSYCHEDELIC_INTRO = `I've been using psychedelics on and off for about twenty years.

It didn't start as some grand spiritual quest- honestly i just wanted to get fucked up. I wanted to escape. And if there was a substance that could temporarily make reality feel different, I'd probably try it. I spent a lot of years chasing escape through whatever worked.

Over time, though, almost everything else fell away.

I used to drink a lot too, but about a decade ago, mushrooms made me realize I didn't actually enjoy drinking OR being drunk—somehow I had convinced myself that I enjoyed it? And that I needed it to socialize..... but after that moment I haven't been able to drink ever since. I've TRIED to drink on a couple of occasions, but after a sip or two just DID NOT WANT. At all. Ew. No. They helped me do a lot of other work on myself too over the years. I went from giving MANY fucks what other people thought about me to giving ABSOLUTELY NONE WHATSOEVER (as long as i haven't hurt someone - AND I DONT.) And really, that has made all the difference. It's very zen once you stop giving fucks (in comparison to before when u did, at least.) 
Mushrooms stayed.

What began as recreation slowly became something else entirely.

They're not an escape for me anymore. They're a tool. Sometimes they're medicine. Sometimes they're a brutally honest therapist. Sometimes they're just hilarious. They've helped me untangle depression, addiction, trauma, fear, autism, masking, creativity, and my own weird brain in ways I honestly don't think I could have reached otherwise.

That doesn't mean every trip is sunshine and cosmic hugs. Some have been difficult. Some have been overwhelming. Some have completely dismantled everything I thought I understood. One was literally "Mysterium Tremendum et Fascinans" levels of terrifying (i stayed calm LIKE A PRO - until i finally came down- and then i LOST MY SHIT LOL. I stayed calm during bc i knew i had to or it would get worse but when it was over I CRIED A LOT LOL) // But even the hard ones have usually left me with something valuable once the dust settled.

One thing that has surprised me is how consistent my experiences have become. Over years and dozens of trips, certain places, themes, geometric structures, emotions, and patterns keep returning with remarkable consistency. Whether those experiences are revealing something fundamental about consciousness or simply the fascinating ways a human brain organizes information under psychedelics, I honestly don't know.

And I'm okay not knowing.

I'm not particularly interested in convincing anyone that my experiences are objectively "real." I don't need them to be. They're real enough to me, and they've changed my life in measurable ways.

This section isn't meant to preach, recruit, or romanticize psychedelics. They aren't for everyone, and they deserve respect. They can be psychologically intense, and they're certainly not something I'd recommend treating casually.

This is simply an archive. I have always felt a need or at least a want to document anything interesting during my experiences, so i record things a lot during them - to have them to look back at later during the integration processs. I'm going to put those here. Along with anything else created in the process of integrating my experiences.

Trip reports. Strange recurring phenomena. Voice recordings made while profoundly confused. Impossible geometry. Ideas that turned into artwork years later. Things I remembered for five minutes before they dissolved back into whatever strange corner of the mind they came from.

Take from it whatever you like.

Or just enjoy the weird. Whatever man - here it is: The trippy shit LEZGO!`;

export default function App() {
  const mainCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const galleryCanvasRef = useRef<HTMLCanvasElement | null>(null);
  
  // Navigation State
  // 'hub' = Original Portfolio
  // 'shaderslop' = WebGL Art Gallery
  // 'aislop' = AI Hallucination Lab
  // 'about' = About the Artist / More Sections
  const [activeTab, setActiveTab] = useState<'hub' | 'shaderslop' | 'aislop' | 'about' | 'karaoke' | 'projects'>('hub');
  const [moreSubTab, setMoreSubTab] = useState<'landing' | 'psychedelic' | 'opinions' | 'blog' | 'about-profile'>('landing');
  const [activeTripReport, setActiveTripReport] = useState<number>(0);
  const [activeOpinion, setActiveOpinion] = useState<number>(0);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => localStorage.getItem('astraltrash_sound_enabled') === 'true');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => localStorage.getItem('astraltrash_theme') !== 'light');

  // Core App states
  const [booting, setBooting] = useState(true);
  const [bootDone, setBootDone] = useState(false);
  const [visitorCount, setVisitorCount] = useState('0000000');
  const [showGuestbook, setShowGuestbook] = useState(false);

  // Sub-Projects States
  const [ghostInput, setGhostInput] = useState<string>('');
  const [ghostHistory, setGhostHistory] = useState<{sender: 'user' | 'ghost', text: string}[]>([
    { sender: 'ghost', text: 'DEEP_CORE_ONLINE... i am the residue left in the repository. ask me of the void.' }
  ]);
  const [collabActiveColor, setCollabActiveColor] = useState<string>('#39FF14'); // toxic green
  const [collabCanvas, setCollabCanvas] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('astraltrash_collaborate_canvas');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length === 256) return parsed;
      }
    } catch (_) {}
    return Array(256).fill('#050505'); // dark void background
  });

  // Background Shader customizer states (RANDO modifier)
  const [bgSpeed, setBgSpeed] = useState<number>(0.06);
  const [bgWarp, setBgWarp] = useState<number>(4.0);
  const [bgColorShift, setBgColorShift] = useState<number>(0.3);
  const [bgVignette, setBgVignette] = useState<number>(0.6);

  // ShaderSlop Gallery states
  const [selectedShader, setSelectedShader] = useState<ShaderItem | null>(null);
  const [allShaders, setAllShaders] = useState<ShaderItem[]>([]);
  const [galleryFilter, setGalleryFilter] = useState<string>('ALL');
  const [isFetchingRepoList, setIsFetchingRepoList] = useState<boolean>(false);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  
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
  }>(localExplanations);

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

  // Shader Time Virtualization and Controls
  const [currentShaderTime, setCurrentShaderTime] = useState<number>(0);
  const [isShaderPlaying, setIsShaderPlaying] = useState<boolean>(true);
  const [shaderStartTimeOffset, setShaderStartTimeOffset] = useState<number>(0);
  const [customJumpInput, setCustomJumpInput] = useState<string>('');

  const [psychedelicIntro, setPsychedelicIntro] = useState<string>(DEFAULT_PSYCHEDELIC_INTRO);

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

  // Top 8 Debris customizable states
  const [top8Debris, setTop8Debris] = useState<Top8Item[]>(() => {
    try {
      const saved = localStorage.getItem('astraltrash_top8_debris');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Failed to parse saved Top 8 debris', e);
    }
    return defaultTop8;
  });

  const [isEditingTop8, setIsEditingTop8] = useState<boolean>(false);
  const [editingSlotId, setEditingSlotId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState<string>('');
  const [editFileName, setEditFileName] = useState<string>('');
  const [editDesc, setEditDesc] = useState<string>('');
  const [editTag, setEditTag] = useState<string>('');

  // Helper to normalize and search shaders
  const findShader = (fileNameInput: string) => {
    if (!fileNameInput) return null;
    let normInput = fileNameInput.toLowerCase().trim();
    // Remove protocol prefixes if user pastes file://... or http://...
    if (normInput.startsWith('file:///')) {
      normInput = normInput.replace('file:///', '');
    }
    // Get last path segment
    const parts = normInput.split('/');
    let cleanName = parts[parts.length - 1];
    // Decode url encoding
    try {
      cleanName = decodeURIComponent(cleanName);
    } catch (_) {}
    
    // Clean up trailing extensions or spacing
    cleanName = cleanName.trim();
    
    // Look for match in allShaders
    const found = allShaders.find((s) => {
      const sFile = s.fileName.toLowerCase();
      return sFile === cleanName || 
             sFile.replace('.html', '') === cleanName.replace('.html', '') ||
             s.id === cleanName.replace('.html', '').replace(/[\s\(\)-]+/g, '_');
    });
    
    if (found) return found;

    // Substring fallback
    const part = cleanName.replace('.html', '');
    const partial = allShaders.find((s) => 
      s.fileName.toLowerCase().includes(part) || 
      s.title.toLowerCase().includes(part)
    );
    return partial || null;
  };

  const handleTop8Click = (item: Top8Item) => {
    const shader = findShader(item.fileName);
    if (shader) {
      setSelectedShader(shader);
      setActiveTab('shaderslop');
      playChime('triangle', 1.2);
    } else {
      // If the shader is not loaded yet (e.g. rate limit or cached file), 
      // dynamically create a virtual ShaderItem and push it to allShaders so it compiles in shaderslop!
      let cleanFileName = item.fileName;
      if (cleanFileName.startsWith('file:///')) {
        cleanFileName = cleanFileName.replace('file:///', '');
      }
      const parts = cleanFileName.split('/');
      cleanFileName = parts[parts.length - 1];
      try {
        cleanFileName = decodeURIComponent(cleanFileName);
      } catch (_) {}
      
      if (!cleanFileName.toLowerCase().endsWith('.html')) {
        cleanFileName += '.html';
      }

      const tempId = cleanFileName.replace('.html', '').replace(/[\s\(\)-]+/g, '_').toLowerCase();
      const tempTitle = cleanFileName.replace('.html', '');
      const tempShader: ShaderItem = {
        id: tempId,
        title: tempTitle,
        tag: item.tag || 'DYNAMIC',
        tagColor: 'var(--cyan)',
        thumbClass: 'dynamic',
        explanation: item.desc || `Discovered custom debris item.`,
        technicalDetails: `Compiled live. Source: ${cleanFileName}`,
        fileName: cleanFileName,
        fragmentShader: '/* LOADING LIVE CODE FROM REPOSITORY... */',
        defaultParams: { speed: 1.0, scale: 1.0, intensity: 1.0, hue: 0.0 }
      };

      setAllShaders(prev => {
        if (prev.some(s => s.fileName.toLowerCase() === cleanFileName.toLowerCase())) return prev;
        return [...prev, tempShader];
      });

      setSelectedShader(tempShader);
      setActiveTab('shaderslop');
      playChime('square', 1.4);
    }
  };

  // Dossier Carousel State
  const [dossierIdx, setDossierIdx] = useState<number>(0);
  const [dossierBroken, setDossierBroken] = useState<Set<number>>(new Set());
  const [dossierAttempts, setDossierAttempts] = useState<Record<number, number>>({});

  const DOSSIER_FILE_NAMES = [
    '8016E78C-4FB1-47DB-97A9-9F79BC5881BC.png',
    'IMG_0391.jpg',
    'IMG_4171.jpg',
    'IMG_4802.PNG',
    'IMG_5614.PNG'
  ];

  const getDossierPhotoUrl = (idx: number) => {
    const attempt = dossierAttempts[idx] || 0;
    const fileName = DOSSIER_FILE_NAMES[idx] || DOSSIER_FILE_NAMES[0];
    if (attempt === 0) {
      return `https://cdn.jsdelivr.net/gh/merrypranxter/astraltrash_site_support@main/public/selfies/${fileName}`;
    } else if (attempt === 1) {
      return `https://raw.githubusercontent.com/merrypranxter/astraltrash_site_support/main/public/selfies/${fileName}`;
    } else if (attempt === 2) {
      return `https://cdn.statically.io/gh/merrypranxter/astraltrash_site_support/main/public/selfies/${fileName}`;
    } else {
      return `https://raw.githack.com/merrypranxter/astraltrash_site_support/main/public/selfies/${fileName}`;
    }
  };

  const handleDossierError = (idx: number) => {
    const currentAttempt = dossierAttempts[idx] || 0;
    if (currentAttempt < 3) {
      setDossierAttempts(prev => ({ ...prev, [idx]: currentAttempt + 1 }));
    } else {
      setDossierBroken(prev => {
        const next = new Set(prev);
        next.add(idx);
        return next;
      });
    }
  };

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

  // Shitty Karaoke States
  const [karTrack, setKarTrack] = useState<string>('custom_url');
  const [karCustomUrl, setKarCustomUrl] = useState<string>('https://storage.googleapis.com/astraltrash_karaoke/043cc61ba55647cf9255de096ddca3b0');
  const [karMicEnabled, setKarMicEnabled] = useState<boolean>(false);
  const [karMicVol, setKarMicVol] = useState<number>(0.8);
  const [karEcho, setKarEcho] = useState<number>(0.3);
  const [karBitcrush, setKarBitcrush] = useState<boolean>(false);
  const [karPitchJitter, setKarPitchJitter] = useState<number>(0.2);
  const [karIsPlaying, setKarIsPlaying] = useState<boolean>(false);
  const [karLyricsSpeed, setKarLyricsSpeed] = useState<number>(3); // words speed modifier
  const [karTerminal, setKarTerminal] = useState<string[]>([
    'SHITTY_KARAOKE_OS // INITIALIZED...',
    'AWAITING INPUT_DEVICES...',
    'READY FOR LOUD MAXIMALIST SCREECHING.'
  ]);
  const [karLyricsOffset, setKarLyricsOffset] = useState<number>(0);
  const [micLevelVal, setMicLevelVal] = useState<number>(0);
  const [karPreselectedFile, setKarPreselectedFile] = useState<string | undefined>(undefined);

  // Google Storage Bucket Karaoke Visualizer & Customizer States
  const [karBucketName, setKarBucketName] = useState<string>(() => {
    const saved = localStorage.getItem('astraltrash_karaoke_bucket_name');
    if (saved && saved !== 'shitty_karaoke') return saved;
    return 'astraltrash_karaoke';
  });
  
  const [karBucketVideos, setKarBucketVideos] = useState<BucketVideo[]>(() => {
    try {
      const saved = localStorage.getItem('astraltrash_karaoke_bucket_videos');
      if (saved) return JSON.parse(saved);
    } catch (_) {}
    return defaultBucketVideos;
  });

  const [selectedBucketVideoId, setSelectedBucketVideoId] = useState<string>('1');
  const [isEditingBucketVideos, setIsEditingBucketVideos] = useState<boolean>(false);
  const [editingBucketVideoSlotId, setEditingBucketVideoSlotId] = useState<string | null>(null);
  const [editBTitle, setEditBTitle] = useState<string>('');
  const [editBFileName, setEditBFileName] = useState<string>('');
  const [editBDesc, setEditBDesc] = useState<string>('');
  const [editBDuration, setEditBDuration] = useState<string>('');
  const [editBTag, setEditBTag] = useState<string>('');

  const karVideoRef = useRef<HTMLVideoElement | null>(null);
  const karMicStreamRef = useRef<MediaStream | null>(null);
  const karAnalyserRef = useRef<AnalyserNode | null>(null);
  const karAnimationFrameRef = useRef<number | null>(null);
  const karAudioNodesRef = useRef<{
    source: MediaStreamAudioSourceNode | null;
    gain: GainNode | null;
    delay: DelayNode | null;
    feedback: GainNode | null;
  }>({ source: null, gain: null, delay: null, feedback: null });

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
    
    // Fetch and increment persistent visitor counter
    fetch('https://api.counterapi.dev/v1/astraltrash_marygray/visitor/up')
      .then(res => {
        if (!res.ok) throw new Error('CounterAPI offline or rate-limited');
        return res.json();
      })
      .then(data => {
        if (data && typeof data.count === 'number') {
          const totalCount = base + data.count;
          setVisitorCount(String(totalCount).padStart(7, '0'));
        } else {
          throw new Error('Response format unrecognized');
        }
      })
      .catch(err => {
        console.info('Using dynamic time fallback for visitor counter:', err.message);
        // Fallback to safe simulated dynamic value if API is offline
        const n = base + Math.floor((Date.now() - 1760000000000) / 60000);
        setVisitorCount(String(Math.max(n, base)).padStart(7, '0'));
      });
  }, []);

  // Fetch Psychedelic Introduction from GitHub dynamically
  useEffect(() => {
    fetch('https://raw.githubusercontent.com/merrypranxter/astraltrash_site_support/main/public/psychedelic_page/introduction.txt')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch psychedelic intro from GitHub');
        return res.text();
      })
      .then(text => {
        if (text) {
          // Clean up frontmatter or duplicate titles if present
          let cleaned = text;
          if (cleaned.startsWith('---')) {
            const nextDashes = cleaned.indexOf('---', 3);
            if (nextDashes !== -1) {
              cleaned = cleaned.substring(nextDashes + 3);
            }
          }
          // Remove duplicate titles
          cleaned = cleaned.replace(/##\s*Psychedelics/gi, '');
          setPsychedelicIntro(cleaned.trim());
        }
      })
      .catch(err => {
        console.warn('Using local fallback for psychedelic introduction:', err);
      });
  }, []);

  // 3c. Scroll to top on tab change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [activeTab]);

  // 3d. Persistent config states
  useEffect(() => {
    localStorage.setItem('astraltrash_sound_enabled', String(soundEnabled));
  }, [soundEnabled]);

  useEffect(() => {
    localStorage.setItem('astraltrash_theme', isDarkMode ? 'dark' : 'light');
    const metaTheme = document.getElementById('theme-color-meta');
    if (isDarkMode) {
      document.body.classList.remove('light-theme');
      document.documentElement.classList.remove('light-theme');
      if (metaTheme) metaTheme.setAttribute('content', '#000000');
    } else {
      document.body.classList.add('light-theme');
      document.documentElement.classList.add('light-theme');
      if (metaTheme) metaTheme.setAttribute('content', '#f2f2eb');
    }
  }, [isDarkMode]);

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
    if (!soundEnabled) return;
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

  // 7. Initialize default selected shader on mount (randomized each time)
  useEffect(() => {
    if (!selectedShader && allShaders.length > 0) {
      const randomIndex = Math.floor(Math.random() * allShaders.length);
      setSelectedShader(allShaders[randomIndex]);
    }
  }, [selectedShader, allShaders]);

  // Always default to High resolution so shaders look beautiful on all screens by default
  useEffect(() => {
    setSelectedResolution('high');
  }, []);

  // Shader virtual time message listener
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === 'SHADER_TIME_REPORT') {
        setCurrentShaderTime(event.data.virtualTime);
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  // Reset time state when active shader changes
  useEffect(() => {
    if (selectedShader) {
      setIsShaderPlaying(true);
      setShaderStartTimeOffset(0);
      setCurrentShaderTime(0);
      setCustomJumpInput('');
    }
  }, [selectedShader?.id]);

  const sendTimeCommand = (action: 'play' | 'pause' | 'set_offset', value?: number) => {
    if (!selectedShader) return;
    const iframe = document.getElementById(`gallery-iframe-${selectedShader.id}`) as HTMLIFrameElement;
    if (iframe && iframe.contentWindow) {
      iframe.contentWindow.postMessage({
        type: 'SHADER_TIME_CONTROL',
        action,
        value
      }, '*');
    }
  };

  const toggleShaderPlayback = () => {
    if (isShaderPlaying) {
      setIsShaderPlaying(false);
      sendTimeCommand('pause');
      playChime('square', 0.8);
    } else {
      setIsShaderPlaying(true);
      sendTimeCommand('play');
      playChime('triangle', 1.2);
    }
  };

  const adjustShaderTime = (seconds: number) => {
    const nextTime = Math.max(0, currentShaderTime + seconds);
    setShaderStartTimeOffset(nextTime);
    setCurrentShaderTime(nextTime);
    sendTimeCommand('set_offset', nextTime);
    playChime('sine', 1.1);
  };

  const jumpToShaderTime = (seconds: number) => {
    const nextTime = Math.max(0, seconds);
    setShaderStartTimeOffset(nextTime);
    setCurrentShaderTime(nextTime);
    sendTimeCommand('set_offset', nextTime);
    playChime('sine', 1.3);
  };

  const formatShaderTime = (timeInSeconds: number) => {
    const hours = Math.floor(timeInSeconds / 3600);
    const minutes = Math.floor((timeInSeconds % 3600) / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    const centiseconds = Math.floor((timeInSeconds % 1) * 100);

    const pad = (num: number) => String(num).padStart(2, '0');

    if (hours > 0) {
      return `${hours}:${pad(minutes)}:${pad(seconds)}.${pad(centiseconds)}`;
    }
    return `${pad(minutes)}:${pad(seconds)}.${pad(centiseconds)}`;
  };

  const scrollDeck = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const scrollAmount = 450; // scrolls roughly 3 thumbnail slots
      container.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
      playChime('triangle', 1.1);
    }
  };

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
  const injectRuntimeLabMods = (htmlString: string, resolutionKey: string, initialOffset = 0, initialPaused = false) => {
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
          let virtualBase = ${initialOffset * 1000}; // in ms
          let isPaused = ${initialPaused};
          
          let originalPerformanceNow;
          try {
            originalPerformanceNow = window.performance.now.bind(window.performance);
          } catch(e) {
            originalPerformanceNow = function() { return Date.now(); };
          }
          
          let startTime = originalPerformanceNow();
          let pauseTime = originalPerformanceNow();

          // Report function
          let lastReportedTime = -1;
          function reportTime() {
            try {
              const vt = (isPaused ? (virtualBase + (pauseTime - startTime)) : (virtualBase + (originalPerformanceNow() - startTime))) / 1000;
              if (Math.abs(vt - lastReportedTime) > 0.05) {
                window.parent.postMessage({
                  type: 'SHADER_TIME_REPORT',
                  virtualTime: vt
                }, '*');
                lastReportedTime = vt;
              }
            } catch(e) {}
          }

          window.addEventListener('message', function(event) {
            if (event.data && event.data.type === 'SHADER_TIME_CONTROL') {
              const payload = event.data;
              if (payload.action === 'set_offset') {
                virtualBase = payload.value * 1000;
                startTime = originalPerformanceNow();
                pauseTime = originalPerformanceNow();
                reportTime();
              } else if (payload.action === 'play') {
                if (isPaused) {
                  const pausedDuration = originalPerformanceNow() - pauseTime;
                  startTime += pausedDuration;
                  isPaused = false;
                  reportTime();
                }
              } else if (payload.action === 'pause') {
                if (!isPaused) {
                  pauseTime = originalPerformanceNow();
                  isPaused = true;
                  reportTime();
                }
              }
            }
          });

          // Override performance.now
          try {
            window.performance.now = function() {
              if (isPaused) {
                return virtualBase + (pauseTime - startTime);
              } else {
                return virtualBase + (originalPerformanceNow() - startTime);
              }
            };
          } catch(e) {}

          // Override Date.now
          const originalDateNow = Date.now;
          try {
            Date.now = function() {
              return originalDateNow() - originalPerformanceNow() + window.performance.now();
            };
          } catch(e) {}

          // Override Date constructor
          const OriginalDate = Date;
          try {
            window.Date = function(...args) {
              if (args.length === 0) {
                return new OriginalDate(Date.now());
              }
              return new OriginalDate(...args);
            };
            window.Date.prototype = OriginalDate.prototype;
            window.Date.now = Date.now;
            window.Date.UTC = OriginalDate.UTC;
            window.Date.parse = OriginalDate.parse;
          } catch(e) {}

          // Intercept requestAnimationFrame
          try {
            const originalRAF = window.requestAnimationFrame.bind(window);
            window.requestAnimationFrame = function(callback) {
              return originalRAF(function(timestamp) {
                reportTime();
                callback(window.performance.now());
              });
            };
          } catch(e) {}

          setInterval(reportTime, 100);

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

  // Fetch all HTML designs from github repo dynamically
  useEffect(() => {
    // Seed state immediately with local shadersList
    setAllShaders(shadersList);
    setIsFetchingRepoList(true);
    fetch('https://api.github.com/repos/merrypranxter/shaderslop_designs/contents')
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          const htmlFiles = data.filter((file: any) => file.name.endsWith('.html'));
          
          const dynamicShaders = htmlFiles.map((file: any) => {
            const fileName = file.name;
            const id = file.sha || fileName;
            const title = fileName.replace('.html', '');
            
            // Deduplicate against already hardcoded static list
            const alreadyExists = shadersList.some((s) => s.fileName.toLowerCase() === fileName.toLowerCase());
            if (alreadyExists) return null;

            // Intelligently guess category tags
            let tag = 'GLSL';
            let tagColor = 'var(--cyan)';
            const nameLower = fileName.toLowerCase();
            if (nameLower.includes('vhs') || nameLower.includes('decay') || nameLower.includes('rot') || nameLower.includes('glitch')) {
              tag = 'VHS';
              tagColor = 'var(--magenta)';
            } else if (nameLower.includes('crystal') || nameLower.includes('sierpinski') || nameLower.includes('mandelbrot') || nameLower.includes('ship') || nameLower.includes('automata')) {
              tag = 'MATH';
              tagColor = 'var(--phosphor)';
            } else if (nameLower.includes('chroma') || nameLower.includes('color') || nameLower.includes('cmy') || nameLower.includes('prism')) {
              tag = 'CMY';
              tagColor = 'var(--magenta)';
            } else if (nameLower.includes('soup') || nameLower.includes('fungi') || nameLower.includes('mycelium') || nameLower.includes('fabric')) {
              tag = 'FLUID';
              tagColor = 'var(--acid)';
            } else if (nameLower.includes('matrix') || nameLower.includes('void') || nameLower.includes('shrine') || nameLower.includes('oracle')) {
              tag = 'GLITCH';
              tagColor = 'var(--violet)';
            }

            return {
              id,
              title,
              tag,
              tagColor,
              thumbClass: 'dynamic',
              explanation: `Discovered remote shader artifact in merrypranxter/shaderslop_designs repository. Compiled in real-time.`,
              technicalDetails: `Sourced dynamically from the ${fileName} file. Generates interactive fractal, feedback, or continuous wave mathematics.`,
              fileName,
              fragmentShader: '/* LOADING LIVE CODE FROM REPOSITORY... */',
              defaultParams: { speed: 1.0, scale: 1.0, intensity: 1.0, hue: 0.0 }
            };
          }).filter((s): s is ShaderItem => s !== null);

          setAllShaders([...shadersList, ...dynamicShaders]);
        }
        setIsFetchingRepoList(false);
      })
      .catch((err) => {
        console.warn('Unable to fetch directory listing from GitHub (using static fallback):', err);
        setIsFetchingRepoList(false);
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

  // Shitty Karaoke Microphone & Audio Functions
  const toggleMicrophone = async () => {
    if (karMicEnabled) {
      cleanupMicrophone();
      setKarMicEnabled(false);
      setKarTerminal(prev => [...prev.slice(-15), 'SYSTEM: MICROPHONE_NODE_DEACTIVATED // RETURNING TO SILENT VOID']);
      setMicLevelVal(0);
      playChime('sine', 0.6);
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        karMicStreamRef.current = stream;
        
        const ctx = audioCtxRef.current || new (window.AudioContext || (window as any).webkitAudioContext)();
        if (!audioCtxRef.current) audioCtxRef.current = ctx;
        if (ctx.state === 'suspended') await ctx.resume();

        const source = ctx.createMediaStreamSource(stream);
        const gain = ctx.createGain();
        const analyser = ctx.createAnalyser();
        analyser.fftSize = 256;
        karAnalyserRef.current = analyser;

        gain.gain.value = karMicVol;

        const delay = ctx.createDelay(1.0);
        delay.delayTime.value = karEcho;
        const feedback = ctx.createGain();
        feedback.gain.value = karEcho > 0 ? 0.45 : 0.0;

        delay.connect(feedback);
        feedback.connect(delay);

        source.connect(analyser);
        source.connect(gain);
        delay.connect(gain);
        source.connect(delay);

        gain.connect(ctx.destination);

        karAudioNodesRef.current = { source, gain, delay, feedback };
        setKarMicEnabled(true);
        setKarTerminal(prev => [
          ...prev.slice(-15),
          'SYSTEM: MICROPHONE_NODE_ACTIVE // PERMISSION_GRANTED',
          `MIC_SAMPLING_RATE: ${ctx.sampleRate}HZ`,
          'ROUTING: SOUNDCARD_LOOPBACK -> COMPRESSION_COIL -> ANALYSER'
        ]);
        playChime('triangle', 1.4);
      } catch (err: any) {
        setKarMicEnabled(false);
        setKarTerminal(prev => [
          ...prev.slice(-15),
          `ERROR: MICROPHONE_NODE_FAILED // ${err.message?.toUpperCase() || 'PERMISSION_DENIED'}`,
          'SYSTEM: STANDBY FOR SIMULATED SIGNAL'
        ]);
        playChime('square', 0.5);
      }
    }
  };

  const cleanupMicrophone = () => {
    if (karMicStreamRef.current) {
      karMicStreamRef.current.getTracks().forEach(t => t.stop());
      karMicStreamRef.current = null;
    }
    if (karAudioNodesRef.current.source) {
      try { karAudioNodesRef.current.source.disconnect(); } catch (e) {}
    }
    if (karAudioNodesRef.current.gain) {
      try { karAudioNodesRef.current.gain.disconnect(); } catch (e) {}
    }
    if (karAudioNodesRef.current.delay) {
      try { karAudioNodesRef.current.delay.disconnect(); } catch (e) {}
    }
    if (karAudioNodesRef.current.feedback) {
      try { karAudioNodesRef.current.feedback.disconnect(); } catch (e) {}
    }
    karAudioNodesRef.current = { source: null, gain: null, delay: null, feedback: null };
    karAnalyserRef.current = null;
    setMicLevelVal(0);
  };

  const playKaraokeSFX = (type: 'applause' | 'boo' | 'laser' | 'screech') => {
    try {
      const ctx = audioCtxRef.current || new (window.AudioContext || (window as any).webkitAudioContext)();
      if (!audioCtxRef.current) audioCtxRef.current = ctx;
      if (ctx.state === 'suspended') ctx.resume();

      const duration = type === 'applause' ? 2.5 : type === 'boo' ? 2.0 : type === 'laser' ? 0.4 : 0.6;
      
      if (type === 'laser') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(880, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(110, ctx.currentTime + duration);
        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + duration);
      } else if (type === 'screech') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(1200, ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(1600, ctx.currentTime + 0.1);
        osc.frequency.linearRampToValueAtTime(1400, ctx.currentTime + duration);
        gain.gain.setValueAtTime(0.06, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + duration);
      } else {
        const bufferSize = ctx.sampleRate * duration;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = Math.random() * 2 - 1;
        }

        const noise = ctx.createBufferSource();
        noise.buffer = buffer;

        const filter = ctx.createBiquadFilter();
        if (type === 'applause') {
          filter.type = 'bandpass';
          filter.frequency.value = 1000;
          filter.Q.value = 1.0;
          const mod = ctx.createOscillator();
          mod.frequency.value = 8;
          const modGain = ctx.createGain();
          modGain.gain.value = 300;
          mod.connect(modGain);
          modGain.connect(filter.frequency);
          mod.start();
          mod.stop(ctx.currentTime + duration);
        } else {
          filter.type = 'lowpass';
          filter.frequency.value = 350;
        }

        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);
        noise.start();
        noise.stop(ctx.currentTime + duration);
      }

      setKarTerminal(prev => [
        ...prev.slice(-15),
        `TRIGGER_SFX: ${type.toUpperCase()} // EMITTING ANALOG_PULSE`
      ]);
    } catch (e) {}
  };

  useEffect(() => {
    if (karAudioNodesRef.current.gain) {
      karAudioNodesRef.current.gain.gain.value = karMicVol;
    }
  }, [karMicVol]);

  useEffect(() => {
    if (karAudioNodesRef.current.delay && karAudioNodesRef.current.feedback) {
      karAudioNodesRef.current.delay.delayTime.value = karEcho;
      karAudioNodesRef.current.feedback.gain.value = karEcho > 0 ? 0.45 : 0.0;
    }
  }, [karEcho]);

  // Karaoke Visualizer drawing loop
  useEffect(() => {
    if (activeTab !== 'karaoke') {
      cleanupMicrophone();
      if (karAnimationFrameRef.current) {
        cancelAnimationFrame(karAnimationFrameRef.current);
        karAnimationFrameRef.current = null;
      }
      return;
    }

    const canvas = document.getElementById('karaoke-visualizer-canvas') as HTMLCanvasElement | null;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let time = 0;
    const draw = () => {
      if (!canvas || !ctx) return;
      time += 0.05;

      const width = canvas.width;
      const height = canvas.height;

      ctx.fillStyle = 'rgba(0, 0, 0, 0.18)';
      ctx.fillRect(0, 0, width, height);

      ctx.strokeStyle = 'rgba(57, 255, 20, 0.15)';
      ctx.lineWidth = 1;
      
      for (let x = 0; x < width; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += 30) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      let dataArray = new Uint8Array(0);
      let bufferLength = 0;

      if (karAnalyserRef.current) {
        const analyser = karAnalyserRef.current;
        bufferLength = analyser.frequencyBinCount;
        dataArray = new Uint8Array(bufferLength);
        analyser.getByteTimeDomainData(dataArray);

        let sumSq = 0;
        for (let i = 0; i < bufferLength; i++) {
          const val = (dataArray[i] - 128) / 128;
          sumSq += val * val;
        }
        const rms = Math.sqrt(sumSq / bufferLength);
        const peak = Math.min(100, Math.round(rms * 450 * karMicVol));
        setMicLevelVal(peak);
      } else {
        if (karIsPlaying) {
          const simulatedPeak = Math.round(35 + Math.sin(time * 2.5) * 15 + Math.random() * 10);
          setMicLevelVal(simulatedPeak);
        } else {
          setMicLevelVal(0);
        }
      }

      ctx.lineWidth = 2;
      ctx.shadowBlur = 4;

      if (karAnalyserRef.current && dataArray.length > 0) {
        ctx.strokeStyle = '#39FF14';
        ctx.shadowColor = '#39FF14';
        ctx.beginPath();

        const sliceWidth = width / bufferLength;
        let x = 0;

        for (let i = 0; i < bufferLength; i++) {
          const v = dataArray[i] / 128.0;
          const y = (v * height) / 2;

          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }

          x += sliceWidth;
        }

        ctx.lineTo(width, height / 2);
        ctx.stroke();
      } else {
        ctx.strokeStyle = karIsPlaying ? '#FF2BD6' : '#39FF14';
        ctx.shadowColor = karIsPlaying ? '#FF2BD6' : '#39FF14';
        ctx.beginPath();

        for (let x = 0; x < width; x++) {
          const rawY = height / 2;
          const oscMultiplier = karIsPlaying ? (15 + Math.sin(time * 0.5) * 10) : 3;
          const noise = karIsPlaying ? (Math.sin(x * 0.05 + time * 5) * Math.cos(x * 0.02 - time * 2) * oscMultiplier) : (Math.sin(x * 0.08 + time * 3) * 1.5);
          
          let jitter = 0;
          if (karIsPlaying && Math.random() > 0.97) {
            jitter = (Math.random() - 0.5) * 35;
          }

          const y = rawY + noise + jitter;

          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.stroke();
      }

      ctx.shadowBlur = 0;

      // Draw high-performance vintage CRT static snow on screen-static canvas
      const staticCanvas = document.getElementById('karaoke-screen-static') as HTMLCanvasElement | null;
      if (staticCanvas) {
        const sCtx = staticCanvas.getContext('2d');
        if (sCtx) {
          const sW = staticCanvas.width;
          const sH = staticCanvas.height;
          const imgData = sCtx.createImageData(sW, sH);
          const data = imgData.data;
          const isStaticActive = !karIsPlaying || (karTrack !== 'custom_url');
          if (isStaticActive) {
            for (let i = 0; i < data.length; i += 4) {
              const r = Math.random();
              const noiseVal = r > 0.5 ? 240 : 15;
              data[i] = noiseVal;
              data[i + 1] = noiseVal;
              data[i + 2] = noiseVal;
              data[i + 3] = r > 0.92 ? 70 : 20; // soft overlay of snow
            }
            sCtx.putImageData(imgData, 0, 0);
          } else {
            sCtx.clearRect(0, 0, sW, sH);
          }
        }
      }

      karAnimationFrameRef.current = requestAnimationFrame(draw);
    };

    karAnimationFrameRef.current = requestAnimationFrame(draw);

    return () => {
      cleanupMicrophone();
      if (karAnimationFrameRef.current) {
        cancelAnimationFrame(karAnimationFrameRef.current);
        karAnimationFrameRef.current = null;
      }
    };
  }, [activeTab, karMicEnabled, karIsPlaying, karMicVol]);

  // Synchronized lyric scrolling effect
  useEffect(() => {
    if (!karIsPlaying) return;

    const interval = setInterval(() => {
      setKarLyricsOffset(prev => prev + 1);
    }, 1000 / (karLyricsSpeed || 1));

    return () => clearInterval(interval);
  }, [karIsPlaying, karLyricsSpeed]);

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

  const filteredShaders = allShaders.filter(shader => {
    if (galleryFilter === 'ALL') return true;
    if (galleryFilter === 'VHS') return shader.tag === 'VHS' || shader.tag === 'CRT';
    if (galleryFilter === 'MATH') return shader.tag === 'MATH' || shader.tag === 'CYCLE';
    if (galleryFilter === 'CMY') return shader.tag === 'CMY' || shader.tag === 'PRISM' || shader.tag === 'FBM';
    if (galleryFilter === 'FLUID') return shader.tag === 'FLUID' || shader.tag === 'BIO' || shader.tag === 'SILK';
    if (galleryFilter === 'GLITCH') return shader.tag === 'GLITCH' || shader.tag === 'Y2K' || shader.tag === 'VOID';
    if (galleryFilter === 'DYNAMIC') return shader.thumbClass === 'dynamic';
    return true;
  });

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
        <div className="sticky top-0 w-full bg-black border-b border-[#39FF14] z-50 px-4 py-2 font-mono">
          {/* Quick-Access Aesthetic Tabs */}
          <div className="w-full grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
            <button data-tensor-action="teleport"
              onClick={() => { setActiveTab('hub'); playChime('triangle', 0.8); }}
              className={`w-full text-center flex items-center justify-center px-4 py-3 sm:py-4 text-xl sm:text-2xl md:text-3xl font-normal tracking-widest border transition-all cursor-crosshair uppercase jersey-10-regular ${
                activeTab === 'hub' 
                  ? 'bg-[#39FF14] text-black border-[#39FF14] shadow-[0_0_12px_rgba(57,255,20,0.5)]' 
                  : 'bg-black text-[#39FF14] border-[#39FF14]/40 hover:border-[#39FF14] hover:bg-[#39FF14]/10'
              }`}
            >
              HOME
            </button>
            <button data-tensor-action="flip"
              onClick={() => { setActiveTab('shaderslop'); playChime('triangle', 1.0); }}
              className={`w-full text-center flex items-center justify-center px-4 py-2.5 sm:py-3 text-lg sm:text-xl md:text-2xl font-normal tracking-widest border transition-all cursor-crosshair uppercase jersey-10-regular ${
                activeTab === 'shaderslop' 
                  ? 'bg-[#FF2BD6] text-black border-[#FF2BD6] shadow-[0_0_12px_rgba(255,43,214,0.5)]' 
                  : 'bg-black text-[#FF2BD6] border-[#FF2BD6]/40 hover:border-[#FF2BD6] hover:bg-[#FF2BD6]/10'
              }`}
            >
              SHADERSLOP
            </button>
            <button data-tensor-action="hack"
              onClick={() => { setActiveTab('aislop'); playChime('triangle', 1.2); }}
              className={`w-full text-center flex items-center justify-center px-4 py-2.5 sm:py-3 text-lg sm:text-xl md:text-2xl font-normal tracking-widest border transition-all cursor-crosshair uppercase jersey-10-regular ${
                activeTab === 'aislop' 
                  ? 'bg-[#00F0FF] text-black border-[#00F0FF] shadow-[0_0_12px_rgba(0,240,255,0.5)]' 
                  : 'bg-black text-[#00F0FF] border-[#00F0FF]/40 hover:border-[#00F0FF] hover:bg-[#00F0FF]/10'
              }`}
            >
              ART_SLOP
            </button>
            <button data-tensor-action="tantrum"
              onClick={() => { setActiveTab('karaoke'); playChime('square', 1.8); }}
              className={`w-full text-center flex items-center justify-center px-4 py-2.5 sm:py-3 text-lg sm:text-xl md:text-2xl font-normal tracking-widest border transition-all cursor-crosshair uppercase jersey-10-regular ${
                activeTab === 'karaoke' 
                  ? 'bg-[#9D4DFF] text-black border-[#9D4DFF] shadow-[0_0_12px_rgba(157,77,255,0.5)]' 
                  : 'bg-black text-[#9D4DFF] border-[#9D4DFF]/40 hover:border-[#9D4DFF] hover:bg-[#9D4DFF]/10'
              }`}
            >
              SHITTY_KARAOKE
            </button>
            <button data-tensor-action="surf"
              onClick={() => { setActiveTab('projects'); playChime('triangle', 1.9); }}
              className={`w-full text-center flex items-center justify-center px-4 py-2.5 sm:py-3 text-lg sm:text-xl md:text-2xl font-normal tracking-widest border transition-all cursor-crosshair uppercase jersey-10-regular ${
                activeTab === 'projects' 
                  ? 'bg-[#FF6B00] text-black border-[#FF6B00] shadow-[0_0_12px_rgba(255,107,0,0.5)]' 
                  : 'bg-black text-[#FF6B00] border-[#FF6B00]/40 hover:border-[#FF6B00] hover:bg-[#FF6B00]/10'
              }`}
            >
              PROJECTS
            </button>
            <button data-tensor-action="celebrate"
              onClick={() => { setActiveTab('about'); setMoreSubTab('landing'); playChime('triangle', 1.6); }}
              className={`w-full text-center flex items-center justify-center px-4 py-2.5 sm:py-3 text-lg sm:text-xl md:text-2xl font-normal tracking-widest border transition-all cursor-crosshair uppercase jersey-10-regular ${
                activeTab === 'about' 
                  ? 'bg-[#EFFF04] text-black border-[#EFFF04] shadow-[0_0_12px_rgba(239,255,4,0.5)]' 
                  : 'bg-black text-[#EFFF04] border-[#EFFF04]/40 hover:border-[#EFFF04] hover:bg-[#EFFF04]/10'
              }`}
            >
              MORE
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
                  ♻ <b>FRESH DEBRIS:</b> raymarched demoscene engines ⟡ <i>FBM domain warping</i> ⟡ <u>thin-film iridescence</u> ⟡ Newton fractals in lotus mandalas ⟡ <b>24 dithering algorithms</b> and one custom palette ⟡ <i>impossible rooms</i> ⟡ sacred geometry as YAML ⟡ <u>dream physics</u> ⟡ ufology as generative dataset ⟡ all trash compiled ⟡ zero build steps were harmed in the making of this website ♻&nbsp;
                  ♻ <b>FRESH DEBRIS:</b> raymarched demoscene engines ⟡ <i>FBM domain warping</i> ⟡ <u>thin-film iridescence</u> ⟡ Newton fractals in lotus mandalas ⟡ <b>24 dithering algorithms</b> and one custom palette ⟡ <i>impossible rooms</i> ⟡ sacred geometry as YAML ⟡ <u>dream physics</u> ⟡ ufology as generative dataset ⟡ all trash compiled ⟡ zero build steps were harmed in the making of this website ♻&nbsp;
                </div>
              </div>

              <div className="frame">
                {/* 2-Column Split Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start py-6">
                  
                  {/* Left Column (2/3 width on desktop) */}
                  <div className="lg:col-span-8 space-y-10">
                    
                    {/* Hero Section (placed inside the grid so it aligns perfectly next to the right column on desktop) */}
                    <section className="hero pt-6 pb-2 border-b border-zinc-900/30">
                      <div className="flex flex-wrap items-center gap-3 mb-6">
                        <div className="online !mb-0">
                          <span className="dot" /> ONLINE NOW · BROADCASTING FROM LOW VOID ORBIT
                        </div>
                        <button 
                          onClick={() => setSoundEnabled(!soundEnabled)}
                          className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] uppercase font-mono tracking-widest border transition-all cursor-crosshair"
                          style={{
                            borderColor: soundEnabled ? '#FF2BD6' : '#666',
                            color: soundEnabled ? '#FF2BD6' : '#888',
                            backgroundColor: soundEnabled ? 'rgba(255,43,214,0.1)' : 'rgba(0,0,0,0.6)'
                          }}
                        >
                          {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
                          <span>SFX {soundEnabled ? 'ON' : 'OFF'}</span>
                        </button>
                      </div>
                      <h1>AstralTrash</h1>
                      <div className="sub">
                        Cosmic debris, lovingly rendered. <em>GLSL shaders</em>, generative math, and twenty years of documented psychedelic phenomenology — salvaged, glitched, and left glowing in orbit by <em>astraltrash</em>. One artist's trash is the same artist's treasure.
                      </div>
                      <div className="btn-row">
                        <button onClick={() => { setActiveTab('shaderslop'); playChime('triangle', 1.0); }} className="btn alt speak cursor-crosshair" data-say="Entering the shaderslop gallery" data-tensor-action="surf">
                          SHADERSLOP ▸
                        </button>
                        <a
                          className="btn speak border-[#EFFF04] text-[#EFFF04] hover:bg-[#EFFF04] hover:text-black hover:shadow-[0_0_24px_#EFFF04]"
                          href="https://objkt.com/users/tz29m7GScDQn8eE1m8n4h96MAxq279cSsYg9"
                          target="_blank"
                          rel="noopener noreferrer"
                          data-say="Collect original AstralTrash NFT artworks on Tezos" data-tensor-action="celebrate"
                        >
                          SHOP TEZOS NFTs ⟡ OBJKT
                        </a>
                        <a className="btn alt2 speak" href="#manifesto" data-say="The manifesto" data-tensor-action="jump">
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
                                  src={getDossierPhotoUrl(dossierIdx)}
                                  key={`dossier-hub-${dossierIdx}-${dossierAttempts[dossierIdx] || 0}`}
                                  alt="Subject: Merry"
                                  onError={() => handleDossierError(dossierIdx)}
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

                            {/* Autism Documentation link */}
                            <div className="border border-[#00F0FF]/40 bg-black/40 p-3 mt-4 hover:bg-[#00F0FF]/10 transition-colors cursor-crosshair group">
                              <a 
                                href="https://merrys-autism.merrypranxter.chatgpt.site/" data-tensor-action="celebrate"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block"
                              >
                                <div className="text-[10px] text-[#00F0FF] uppercase tracking-widest mb-1 font-mono flex justify-between">
                                  <span>EXTERNAL_ARCHIVE // MEDICAL_LOGS</span>
                                  <span className="text-[#00F0FF] group-hover:animate-pulse">▶ ACCESS</span>
                                </div>
                                <div className="text-white font-medium text-[16px]" style={{ fontFamily: "'VT323', monospace" }}>
                                  Autism Documentation & Field Notes
                                </div>
                              </a>
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
                      <div className="flex flex-wrap justify-between items-center gap-4 mb-2">
                        <h2 className="sect-head mb-0">▓▒░ TOP 8 DEBRIS ░▒▓</h2>
                        <button
                          onClick={() => {
                            setIsEditingTop8(!isEditingTop8);
                            setEditingSlotId(null);
                            playChime('triangle', 1.0);
                          }}
                          className={`px-3 py-1 text-xs font-mono border transition-all uppercase tracking-wider ${
                            isEditingTop8
                              ? 'bg-[#FF2BD6] text-black border-[#FF2BD6] shadow-[0_0_10px_rgba(255,43,214,0.4)]'
                              : 'bg-black text-[#39FF14] border-[#39FF14]/40 hover:border-[#39FF14] hover:bg-[#39FF14]/10'
                          }`}
                        >
                          {isEditingTop8 ? '✖ CLOSE COIL PANEL' : '⚙ CONFIGURE TOP 8'}
                        </button>
                      </div>
                      
                      <div className="sect-sub">
                        These are my favorite things I've made lately.
                      </div>

                      {/* CONFIGURE PANEL */}
                      {isEditingTop8 && (
                        <div className="border-2 border-dashed border-[#FF2BD6] bg-black/95 p-4 mb-6 rounded-none font-mono space-y-4 shadow-[0_0_15px_rgba(255,43,214,0.2)]">
                          <div className="flex justify-between items-center border-b border-[#FF2BD6]/30 pb-2">
                            <span className="text-sm font-bold text-[#FF2BD6] tracking-wider uppercase">⚡ RE-MAP ORBITAL DEBRIS COILS</span>
                            <button
                              onClick={() => {
                                if (window.confirm('Reset Top 8 debris array to original factory settings?')) {
                                  localStorage.removeItem('astraltrash_top8_debris');
                                  setTop8Debris(defaultTop8);
                                  setIsEditingTop8(false);
                                  playChime('square', 1.5);
                                }
                              }}
                              className="text-[10px] text-zinc-500 hover:text-white border border-zinc-700 hover:border-white px-2 py-0.5 transition-all"
                            >
                              RESET TO FACTORY DEFAULTS
                            </button>
                          </div>

                          {/* Slot selection grid */}
                          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-2">
                            {top8Debris.map((item) => (
                              <button
                                key={item.id}
                                onClick={() => {
                                  setEditingSlotId(item.id);
                                  setEditTitle(item.title);
                                  setEditFileName(item.fileName);
                                  setEditDesc(item.desc);
                                  setEditTag(item.tag);
                                  playChime('triangle', 0.9);
                                }}
                                className={`p-2 border text-center transition-all ${
                                  editingSlotId === item.id
                                    ? 'bg-[#39FF14] text-black border-[#39FF14] font-bold shadow-[0_0_8px_rgba(57,255,20,0.4)]'
                                    : 'bg-zinc-950 text-white border-zinc-800 hover:border-zinc-500'
                                }`}
                              >
                                <div className="text-[10px] opacity-70">SLOT {item.id}</div>
                                <div className="text-xs truncate max-w-[80px] mx-auto mt-1">
                                  {item.title || '[empty]'}
                                </div>
                              </button>
                            ))}
                          </div>

                          {/* Active editing slot form */}
                          {editingSlotId !== null ? (
                            <div className="bg-zinc-950/80 p-3 border border-zinc-800 space-y-3">
                              <div className="text-xs font-bold text-[#00F0FF] uppercase tracking-wider border-b border-zinc-800 pb-1">
                                EDITING COIL SLOT {editingSlotId}
                              </div>
                              
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {/* Autopopulate selection dropdown */}
                                <div className="space-y-1">
                                  <label className="block text-[11px] text-zinc-400 uppercase">ASTRAL_TRASH DEBRIS ARCHIVE (PRE-POPULATE)</label>
                                  <select
                                    onChange={(e) => {
                                      const matchedVal = e.target.value;
                                      if (matchedVal) {
                                        const foundS = allShaders.find(s => s.fileName === matchedVal);
                                        if (foundS) {
                                          setEditTitle(foundS.title);
                                          setEditFileName(foundS.fileName);
                                          // Intelligently clean description from technicalDetails / explanation or let user write
                                          setEditDesc(foundS.explanation || `interactive experimental shader artifact`);
                                          setEditTag(foundS.tag || 'GLSL');
                                          playChime('square', 0.8);
                                        }
                                      }
                                    }}
                                    className="w-full bg-black border border-zinc-800 text-xs text-white p-2 outline-none focus:border-[#FF2BD6]"
                                    defaultValue=""
                                  >
                                    <option value="" disabled>-- CHOOSE FROM GENERATIVE ARCHIVE --</option>
                                    {allShaders.map((sh, idx) => (
                                      <option key={idx} value={sh.fileName}>
                                        {sh.title} ({sh.fileName})
                                      </option>
                                    ))}
                                  </select>
                                </div>

                                {/* Custom Tag */}
                                <div className="space-y-1">
                                  <label className="block text-[11px] text-zinc-400 uppercase">CLASSIFICATION_TAG (e.g. GLSL, VHS, MATH)</label>
                                  <input
                                    type="text"
                                    value={editTag}
                                    onChange={(e) => setEditTag(e.target.value)}
                                    placeholder="GLSL"
                                    className="w-full bg-black border border-zinc-800 text-xs text-white p-2 outline-none focus:border-[#FF2BD6]"
                                  />
                                </div>

                                {/* Display Title */}
                                <div className="space-y-1">
                                  <label className="block text-[11px] text-zinc-400 uppercase">DISPLAY_NAME</label>
                                  <input
                                    type="text"
                                    value={editTitle}
                                    onChange={(e) => setEditTitle(e.target.value)}
                                    placeholder="spectral_candy_garden"
                                    className="w-full bg-black border border-zinc-800 text-xs text-white p-2 outline-none focus:border-[#FF2BD6]"
                                  />
                                </div>

                                {/* Source File / Path */}
                                <div className="space-y-1">
                                  <label className="block text-[11px] text-zinc-400 uppercase">SOURCE_FILE_OR_PATH</label>
                                  <input
                                    type="text"
                                    value={editFileName}
                                    onChange={(e) => setEditFileName(e.target.value)}
                                    placeholder="spectral_candy_garden_20260624_134032.html"
                                    className="w-full bg-black border border-zinc-800 text-xs text-[#39FF14] p-2 outline-none focus:border-[#FF2BD6] font-mono"
                                  />
                                </div>
                              </div>

                              {/* Custom description */}
                              <div className="space-y-1">
                                <label className="block text-[11px] text-zinc-400 uppercase">AESTHETIC_DESCRIPTION</label>
                                <textarea
                                  value={editDesc}
                                  onChange={(e) => setEditDesc(e.target.value)}
                                  placeholder="vivid cosmic bloom of dithered particles..."
                                  rows={2}
                                  className="w-full bg-black border border-zinc-800 text-xs text-white p-2 outline-none focus:border-[#FF2BD6]"
                                />
                              </div>

                              {/* Action Buttons */}
                              <div className="flex justify-end gap-2 pt-1">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setEditingSlotId(null);
                                    playChime('triangle', 0.5);
                                  }}
                                  className="bg-black border border-zinc-800 hover:bg-zinc-900 text-zinc-400 text-xs px-4 py-1.5 transition-all"
                                >
                                  CANCEL
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    const updated = top8Debris.map(item => {
                                      if (item.id === editingSlotId) {
                                        return {
                                          ...item,
                                          title: editTitle.trim() || `Debris #${editingSlotId}`,
                                          fileName: editFileName.trim(),
                                          desc: editDesc.trim(),
                                          tag: editTag.trim() || 'GLSL'
                                        };
                                      }
                                      return item;
                                    });
                                    setTop8Debris(updated);
                                    localStorage.setItem('astraltrash_top8_debris', JSON.stringify(updated));
                                    setEditingSlotId(null);
                                    playChime('triangle', 1.5);
                                    setTerminalOutputs(prev => [
                                      ...prev,
                                      `SUCCESS: Re-mapped debris slot #${editingSlotId} -> ${editTitle}`
                                    ]);
                                  }}
                                  className="bg-[#FF2BD6] text-black font-bold text-xs px-5 py-1.5 hover:bg-white hover:shadow-[0_0_10px_rgba(255,43,214,0.6)] transition-all"
                                >
                                  SAVE COIL SLOT
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="text-center py-6 text-xs text-zinc-500 border border-zinc-900 bg-zinc-950/20">
                              ▲ SELECT A COIL SLOT ABOVE TO RE-MAP IT ▲
                            </div>
                          )}
                        </div>
                      )}

                      {/* TOP 8 GRID */}
                      <div className="top8">
                        {top8Debris.map((item, index) => {
                          const isLoaded = !!findShader(item.fileName);
                          return (
                            <div
                              key={item.id}
                              onClick={() => handleTop8Click(item)}
                              className="card speak relative group"
                              data-say={`${item.title}. ${item.desc}`}
                            >
                              {/* Indicator dot showing if the shader is verified in directory */}
                              <span 
                                className={`absolute top-2 right-2 w-1.5 h-1.5 rounded-full ${
                                  isLoaded ? 'bg-[#39FF14]' : 'bg-[#FF2BD6]'
                                }`}
                                title={isLoaded ? "Verified in Repo Archive" : "External repository link (will compile dynamically)"}
                              />
                              <div className="thumb relative bg-zinc-950 border border-zinc-900/40">
                                <ShaderThumbnail shaderId={item.title} fileName={item.fileName} />
                              </div>
                              <h3>{item.title}</h3>
                              <p>{item.desc}</p>
                              <div className="flex justify-between items-center mt-2 pt-1 border-t border-zinc-900/40">
                                <span className="tag">{item.tag}</span>
                                <span className="text-[9px] text-zinc-600 font-mono tracking-tighter uppercase group-hover:text-zinc-400 transition-colors">
                                  COIL {item.id}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </section>

                    {/* SHITTY KARAOKE TEASER SECTION */}
                    <section className="sect py-4 border-t border-[#FF6B00]/20" id="karaoke-teaser">
                      <div className="border-2 border-[#FF6B00] bg-black/90 p-5 md:p-6 shadow-[0_0_20px_rgba(255,107,0,0.25)] relative overflow-hidden font-mono">
                        {/* Orange glow accent line on top */}
                        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#FF6B00] via-[#FF2BD6] to-[#EFFF04]" />
                        
                        {/* Header banner */}
                        <div className="flex flex-wrap justify-between items-baseline gap-2 border-b border-[#FF6B00]/30 pb-2.5 mb-4">
                          <span 
                            className="text-[#FF6B00] text-[24px] font-black tracking-widest uppercase flex items-center gap-2" 
                            style={{ fontFamily: "'Jersey 10', sans-serif" }}
                          >
                            🎤 SHITTY KARAOKE TIME!
                          </span>
                          <span className="text-[10px] text-zinc-500 uppercase tracking-wider">
                            vhs analog broadcast node
                          </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                          {/* Left Column: Call to Action */}
                          <div className="md:col-span-6 space-y-4">
                            <p className="text-[#ff9c54] text-[16px] leading-snug font-bold" style={{ fontFamily: "'Share Tech Mono', monospace" }}>
                              WET THE WHISTLE &amp; SPIN THE REELS.
                            </p>
                            <p className="text-[12.5px] text-zinc-300 leading-relaxed font-mono">
                              I have renamed all the files in my storage bucket to song titles and artists! Come play authentic, raw audio cassettes straight from Google Cloud Storage.
                            </p>
                            <button
                              onClick={() => {
                                setKarPreselectedFile(undefined);
                                setActiveTab('karaoke');
                                playChime('square', 1.8);
                              }}
                              className="w-full text-center border-2 border-[#FF6B00] hover:bg-[#FF6B00] text-[#FF6B00] hover:text-black transition-all py-3 font-bold uppercase text-xs tracking-wider cursor-crosshair flex items-center justify-center gap-2"
                            >
                              <span>👉 CLICK HERE FOR MEDIOCRE SINGING 🎙</span>
                            </button>
                          </div>

                          {/* Right Column: Mini CASSETTES (The requested Whattaman & Girl Anachronism thumbnails) */}
                          <div className="md:col-span-6 space-y-3.5">
                            <div className="text-[10px] text-zinc-500 uppercase tracking-widest font-semibold">
                              ✦ FAST LOAD SINGLE TRACKS
                            </div>
                            
                            <div className="grid grid-cols-2 gap-3">
                              {/* 1. Salt n Pepa - Whatta Man */}
                              <button 
                                onClick={() => {
                                  setKarPreselectedFile('Whatta_Man_by_Salt_n_Pepa.mov');
                                  setActiveTab('karaoke');
                                  playChime('triangle', 1.4);
                                }}
                                className="group/teaser text-left w-full cursor-crosshair border border-[#FF6B00]/40 hover:border-[#FF2BD6] bg-zinc-950 p-2 space-y-2 hover:shadow-[0_0_12px_rgba(255,43,214,0.3)] transition-all block"
                              >
                                <div className="aspect-[16/10] bg-black border border-zinc-900 rounded relative overflow-hidden flex items-center justify-center">
                                  <video
                                    src="https://storage.googleapis.com/astraltrash_karaoke/Whatta_Man_by_Salt_n_Pepa.mov#t=1"
                                    preload="metadata"
                                    playsInline
                                    muted
                                    className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover/teaser:opacity-90 transition-opacity duration-300"
                                  />
                                  <div className="absolute top-1 left-1.5 flex gap-0.5 items-center bg-black/80 px-1 py-0.5 border border-zinc-900 text-[5px] text-zinc-500 font-mono tracking-tighter">
                                    <div className="w-1 h-1 rounded-full border border-zinc-700 animate-spin" style={{ animationDuration: '3s' }} />
                                    <span>FAV</span>
                                  </div>
                                </div>
                                <div className="bg-zinc-100 p-1 text-zinc-950 text-[10px] font-mono leading-tight truncate rotate-[-0.5deg] shadow-[1px_1px_2px_rgba(0,0,0,0.15)] text-center font-bold">
                                  Whatta Man
                                </div>
                              </button>

                              {/* 2. The Dresden Dolls - Girl Anachronism */}
                              <button 
                                onClick={() => {
                                  setKarPreselectedFile('Girl_Anachronism_by_The_Dresden_Dolls.mp4');
                                  setActiveTab('karaoke');
                                  playChime('triangle', 1.4);
                                }}
                                className="group/teaser text-left w-full cursor-crosshair border border-[#FF6B00]/40 hover:border-[#FF2BD6] bg-zinc-950 p-2 space-y-2 hover:shadow-[0_0_12px_rgba(255,43,214,0.3)] transition-all block"
                              >
                                <div className="aspect-[16/10] bg-black border border-zinc-900 rounded relative overflow-hidden flex items-center justify-center">
                                  <video
                                    src="https://storage.googleapis.com/astraltrash_karaoke/Girl_Anachronism_by_The_Dresden_Dolls.mp4#t=1"
                                    preload="metadata"
                                    playsInline
                                    muted
                                    className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover/teaser:opacity-90 transition-opacity duration-300"
                                  />
                                  <div className="absolute top-1 left-1.5 flex gap-0.5 items-center bg-black/80 px-1 py-0.5 border border-zinc-900 text-[5px] text-zinc-500 font-mono tracking-tighter">
                                    <div className="w-1 h-1 rounded-full border border-zinc-700 animate-spin" style={{ animationDuration: '3s' }} />
                                    <span>PUNK</span>
                                  </div>
                                </div>
                                <div className="bg-zinc-100 p-1 text-zinc-950 text-[10px] font-mono leading-tight truncate rotate-[0.5deg] shadow-[1px_1px_2px_rgba(0,0,0,0.15)] text-center font-bold">
                                  Girl Anachronism
                                </div>
                              </button>

                            </div>
                          </div>
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
                  <div className="lg:col-span-4 lg:sticky lg:top-[60px] lg:max-h-[calc(100vh-80px)] overflow-y-auto bg-black/95 border-2 border-[#FF2BD6] p-6 shadow-[0_0_25px_rgba(255,43,214,0.35)] space-y-7 font-mono custom-scrollbar">
                    
                    {/* Header styled like a table column */}
                    <div className="bg-[#FF2BD6] text-black text-sm font-bold p-2 px-3 tracking-widest flex justify-between items-center">
                      <span>⚡ FEATURED: SHADERSLOP</span>
                      <span className="text-[10px] bg-black text-[#FF2BD6] px-2 py-1">MATRIX_FEED</span>
                    </div>

                    {/* Live Render IFrame */}
                    <div className="space-y-3">
                      <div className="relative aspect-square w-full bg-black border border-[#FF2BD6]/40 overflow-hidden flex items-center justify-center clean-container">
                        {featuredHtml ? (
                          <iframe 
                            srcDoc={featuredHtml}
                            className="w-full h-full border-0 block bg-black shader-iframe-clean"
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
                      <div className="flex justify-between items-center gap-3 pt-2">
                        <button 
                          onClick={() => cycleFeaturedShader('prev')}
                          className="bg-black border border-[#FF2BD6] text-[#FF2BD6] hover:bg-[#FF2BD6] hover:text-black transition-all px-3 py-1.5 text-xs font-bold cursor-crosshair tracking-wider"
                        >
                          ◀ ROTATE
                        </button>
                        <div className="text-center font-bold text-white text-sm tracking-wide truncate max-w-[160px] sm:max-w-none">
                          {shadersList[featuredShaderIndex].title}
                        </div>
                        <button 
                          onClick={() => cycleFeaturedShader('next')}
                          className="bg-black border border-[#FF2BD6] text-[#FF2BD6] hover:bg-[#FF2BD6] hover:text-black transition-all px-3 py-1.5 text-xs font-bold cursor-crosshair tracking-wider"
                        >
                          ROTATE ▶
                        </button>
                      </div>
                    </div>

                    {/* Shader Information Dossier */}
                    <div className="space-y-6">
                      {/* Concept Section */}
                      <div className="space-y-2 border-l-3 border-[#FF2BD6] pl-4">
                        <div className="text-[11px] text-[#FF2BD6] font-bold uppercase tracking-widest font-mono">
                          // CONCEPTUAL_SPECIFICATION
                        </div>
                        <p className="text-sm text-gray-200 leading-relaxed font-sans">
                          {getShaderExplanation(shadersList[featuredShaderIndex])}
                        </p>
                        <div className="text-[10px] text-[#39FF14]/80 font-mono flex items-center gap-1.5 pt-1">
                          <span className="text-gray-500 font-bold uppercase tracking-wider text-[9px]">REGISTRY ID:</span> 
                          <span className="font-bold bg-[#39FF14]/10 px-1 py-0.5 border border-[#39FF14]/20">{shadersList[featuredShaderIndex].id.toUpperCase()}</span>
                        </div>
                      </div>

                      {/* Technical Details Section */}
                      {shadersList[featuredShaderIndex].technicalDetails && (
                        <div className="space-y-2 bg-[#020202] border border-zinc-900/80 p-4">
                          <div className="text-[10px] text-[#00F0FF] font-bold uppercase tracking-widest flex items-center gap-1.5 border-b border-zinc-900 pb-1.5 font-mono">
                            <span className="text-xs">⚛</span> COMPUTATIONAL_FORMULA
                          </div>
                          <p className="text-[11px] text-gray-400 font-mono leading-relaxed">
                            {shadersList[featuredShaderIndex].technicalDetails}
                          </p>
                        </div>
                      )}

                      {/* Field Notes Section */}
                      {shadersList[featuredShaderIndex].fieldNotes && (
                        <div className="space-y-2 bg-[#05000a]/70 border border-zinc-900/80 p-4 relative">
                          <div className="text-[10px] text-[#EFFF04] font-bold uppercase tracking-widest flex items-center gap-1.5 border-b border-zinc-900 pb-1.5 font-mono">
                            <span className="text-xs">⟡</span> FIELD_DOSSIER // RESEARCH_ARCHIVE
                          </div>
                          <p className="text-xs text-gray-300 italic leading-relaxed font-sans">
                            "{shadersList[featuredShaderIndex].fieldNotes}"
                          </p>
                          <div className="text-[9px] text-zinc-600 text-right pt-1 font-mono">
                            CLEARANCE: DEEP_ORBITAL_STATION
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Interactive Dock Control Station */}
                    <div className="bg-zinc-950 p-5 border border-zinc-900/80 space-y-5 text-xs">
                      <div className="text-[#FF2BD6] font-bold text-xs uppercase tracking-wider flex items-center gap-2 border-b border-zinc-900 pb-2.5 font-mono">
                        <Sliders className="w-4 h-4 text-[#FF2BD6]" />
                        <span>Interactive Dock Control Station</span>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <a 
                          href={`https://raw.githack.com/merrypranxter/shaderslop_designs/main/${shadersList[featuredShaderIndex].fileName}`}
                          target="_blank"
                          rel="noreferrer"
                          onClick={() => playChime('sine', 1.2)}
                          className="text-center border border-zinc-800 hover:border-white px-4 py-3.5 text-xs text-gray-300 hover:text-white hover:bg-zinc-900/50 transition-all cursor-crosshair font-bold uppercase block tracking-widest font-mono"
                        >
                          LAUNCH FULLSCREEN ↗
                        </a>
                        <button 
                          onClick={() => {
                            setSelectedShader(shadersList[featuredShaderIndex]);
                            setActiveTab('shaderslop');
                            playChime('triangle', 1.0);
                          }}
                          className="text-center border border-[#FF2BD6]/40 hover:bg-[#FF2BD6]/10 px-4 py-3.5 text-xs text-[#FF2BD6] transition-all cursor-crosshair font-bold uppercase block tracking-widest font-mono"
                        >
                          OPEN IN CODE LAB ⚛
                        </button>
                      </div>

                      {/* Collect NFT call-to-action button */}
                      <div className="pt-1.5">
                        <a 
                          href="https://objkt.com/users/tz29m7GScDQn8eE1m8n4h96MAxq279cSsYg9"
                          target="_blank"
                          rel="noreferrer"
                          onClick={() => playChime('sine', 1.5)}
                          className="text-center border border-[#EFFF04]/50 hover:bg-[#EFFF04]/20 bg-[#EFFF04]/5 px-4.5 py-4 text-sm text-[#EFFF04] hover:shadow-[0_0_20px_rgba(239,255,4,0.6)] transition-all cursor-crosshair font-black uppercase block flex items-center justify-center gap-2 tracking-widest font-mono"
                        >
                          <span>COLLECT ORIGINAL NFT ON OBJKT ⟡</span>
                        </a>
                      </div>

                      {/* Technical Readout */}
                      <div className="pt-3 border-t border-zinc-900/60 font-mono text-xs text-zinc-500 space-y-1.5">
                        <div className="flex justify-between items-center">
                          <span className="text-zinc-600 font-bold">LOCATION:</span> 
                          <span className="text-zinc-400">astraltrash/shaderslop_designs</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-zinc-600 font-bold">RESOLVED_PATH:</span> 
                          <span className="text-zinc-400">{shadersList[featuredShaderIndex].fileName}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-zinc-600 font-bold">CDN_PROXY:</span> 
                          <span className="text-[#39FF14] font-bold">ACTIVE_GITHACK_STREAM</span>
                        </div>
                      </div>
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
            <div className="frame py-8 space-y-8">
              {/* Majestic Jittery White/Greenish Gallery Heading */}
              <div className="text-center pt-6 md:pt-10 space-y-3">
                <h2 
                  className="text-5xl md:text-6xl font-extrabold text-white tracking-wider uppercase mb-2 font-sans"
                  style={{
                    fontFamily: "'Bitcount Prop Double', 'Chakra Petch', sans-serif",
                    textShadow: '0 0 8px var(--phosphor), 0 0 30px rgba(57,255,20,0.5), 3px 0 0 rgba(255,43,214,0.8), -3px 0 0 rgba(0,240,255,0.8)',
                    animation: 'jitter 6s infinite'
                  }}
                >
                  ☢ ShaderSlop Gallery ☢
                </h2>
                <div className="flex justify-center items-center flex-wrap gap-x-3 gap-y-1 text-[11px] text-gray-500 font-mono">
                  <span>RENDER_PLATFORM: WebGL2_GENATIVE</span>
                  <span>•</span>
                  <span>DIRECTORY: {allShaders.length} SHARDS IDENTIFIED</span>
                  {isFetchingRepoList && (
                    <span className="text-[#39FF14] animate-pulse font-bold">[POLLING REMOTE REPOSITORY...]</span>
                  )}
                </div>
                <p className="text-[#9fdc96] text-[13px] leading-relaxed max-w-3xl mx-auto">
                  Some of my code is interactive! Some of it is not. Feel free to poke around at it with your mouse and find out what (if anything) happens!
                </p>
              </div>

              {/* Master Lab Command Station: Active Viewer (Left 7/12) & Active Info/Controls (Right 5/12) */}
              <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
                
                {/* Left Side: Centerpiece IFrame Viewer (Defaults to 1:1) */}
                <div className="xl:col-span-7 bg-black/95 border border-[#FF2BD6]/30 p-4 space-y-4">
                  <div className="flex justify-between items-center text-[10px] font-mono text-zinc-500 border-b border-zinc-900 pb-2">
                    <span className="text-zinc-400 font-bold uppercase tracking-widest flex items-center gap-1.5">
                      <Atom className="w-3.5 h-3.5 text-[#FF2BD6] animate-spin" />
                      <span>Live Simulation Feed // {selectedShader?.title || 'Inactive'}</span>
                    </span>
                    <span>FRAME_SYNC: CRT_EMU</span>
                  </div>

                  {selectedShader ? (
                    <div className="flex justify-center w-full bg-black border border-[#FF2BD6]/20 relative overflow-hidden select-none clean-container">
                      <div className={`relative ${
                        selectedAspect === '1:1' ? 'aspect-square w-full max-w-[580px]' :
                        selectedAspect === '16:9' ? 'aspect-video w-full' :
                        selectedAspect === '4:3' ? 'aspect-[4/3] w-full max-w-[580px]' :
                        'w-full h-[500px]'
                      } bg-black overflow-hidden flex items-center justify-center`}>
                        
                        {galleryHtml ? (
                          <iframe 
                            srcDoc={injectRuntimeLabMods(galleryHtml, selectedResolution, shaderStartTimeOffset, !isShaderPlaying)}
                            className="w-full h-full border-0 block bg-black shader-iframe-clean"
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
                  ) : (
                    <div className="aspect-square w-full max-w-[580px] mx-auto flex flex-col items-center justify-center border border-dashed border-[#FF2BD6]/20 text-center p-6 text-gray-500 font-mono">
                      <Atom className="w-12 h-12 text-[#FF2BD6]/30 animate-spin mb-4" style={{ animationDuration: '8s' }} />
                      <h4 className="text-white text-md font-sans font-bold uppercase mb-1">NO SHARD CHOSEN</h4>
                      <p className="text-[12px] max-w-xs">
                        Browse the Debris Deck below and choose any shard block to boot rendering.
                      </p>
                    </div>
                  )}
                </div>

                {/* Right Side: Configuration Panel, Metadata, and Controller Stations */}
                <div className="xl:col-span-5 bg-black/95 border border-zinc-800 p-7 space-y-8">
                  {selectedShader ? (
                    <div className="space-y-8">
                      
                      {/* Configuration Controls Console */}
                      <div className="bg-zinc-950 p-5 border border-zinc-900 space-y-4 font-mono text-xs text-gray-400">
                        <div className="flex items-center gap-1.5 border-b border-zinc-900 pb-2">
                          <Sliders className="w-3.5 h-3.5 text-[#FF2BD6]" />
                          <span className="text-[#FF2BD6] font-bold text-xs uppercase tracking-wider">LAB VIEWER CONFIG</span>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          {/* Aspect Ratio Selector */}
                          <div className="space-y-1">
                            <span className="text-zinc-500 text-[10px]">ASPECT RATIO</span>
                            <select 
                              value={selectedAspect}
                              onChange={(e) => {
                                setSelectedAspect(e.target.value);
                                playChime('sine', 1.3);
                              }}
                              className="bg-black border border-[#FF2BD6]/40 text-[#FF2BD6] hover:border-[#FF2BD6] px-2 py-1.5 w-full focus:outline-none cursor-crosshair text-[10px]"
                            >
                              <option value="1:1">1:1 (SQUARE)</option>
                              <option value="16:9">16:9 (WIDESCREEN)</option>
                              <option value="4:3">4:3 (RETRO CRT)</option>
                              <option value="full">FULL (RESPONSIVE BOX)</option>
                            </select>
                          </div>

                          {/* Resolution Quality Selector */}
                          <div className="space-y-1">
                            <span className="text-zinc-500 text-[10px]">RENDER QUALITY</span>
                            <select 
                              value={selectedResolution}
                              onChange={(e) => {
                                setSelectedResolution(e.target.value);
                                playChime('sine', 1.3);
                              }}
                              className="bg-black border border-[#39FF14]/40 text-[#39FF14] hover:border-[#39FF14] px-2 py-1.5 w-full focus:outline-none cursor-crosshair text-[10px]"
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

                      {/* Interactive Time & Simulation Clock Station */}
                      <div className="bg-zinc-950 border border-[#FF2BD6]/30 p-5 font-mono text-xs space-y-4">
                        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-900 pb-2">
                          <div className="flex items-center gap-1.5 text-gray-400">
                            <Clock className="w-4 h-4 text-[#00F0FF]" />
                            <span className="uppercase text-xs tracking-wider">WebGL Simulation Clock</span>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <span className={`text-[9px] px-1.5 py-0.5 rounded-none font-bold ${
                              isShaderPlaying 
                                ? 'bg-[#39FF14]/10 text-[#39FF14] border border-[#39FF14]/30' 
                                : 'bg-red-500/10 text-red-500 border border-red-500/30'
                            }`}>
                              {isShaderPlaying ? 'ACTIVE // RENDERING' : 'PAUSED // HALTED'}
                            </span>
                            <span className="text-[#00F0FF] font-bold text-sm tracking-widest bg-black px-2 py-0.5 border border-zinc-900 shadow-inner">
                              {formatShaderTime(currentShaderTime)}
                            </span>
                          </div>
                        </div>

                        {/* Interactive Timeline Scrub Slider */}
                        <div className="space-y-1">
                          <div className="flex justify-between text-[10px] text-gray-500">
                            <span>00:00.00</span>
                            <span className="text-[#FF2BD6]">TEMPORAL SCRUB COORDINATE (MAX 20M)</span>
                            <span>20:00.00</span>
                          </div>
                          <input 
                            type="range" 
                            min="0" 
                            max="1200" 
                            step="0.5"
                            value={currentShaderTime}
                            onChange={(e) => {
                              const val = parseFloat(e.target.value);
                              jumpToShaderTime(val);
                            }}
                            className="w-full accent-[#FF2BD6] cursor-crosshair bg-zinc-900 h-1 rounded-none border border-zinc-850"
                          />
                        </div>

                        {/* Simulation Actions & Instant Jump */}
                        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                          <div className="flex items-center gap-1">
                            <button 
                              onClick={() => adjustShaderTime(-30)}
                              className="text-[10px] border border-zinc-800 hover:border-[#FF2BD6] px-2 py-1 text-gray-400 hover:text-white transition-all cursor-crosshair flex items-center gap-0.5"
                              title="Rewind 30 seconds"
                            >
                              <ChevronsLeft className="w-3.5 h-3.5" />
                              <span>-30s</span>
                            </button>
                            <button 
                              onClick={() => adjustShaderTime(-10)}
                              className="text-[10px] border border-zinc-800 hover:border-[#FF2BD6] px-2 py-1 text-gray-400 hover:text-white transition-all cursor-crosshair flex items-center gap-0.5"
                              title="Rewind 10 seconds"
                            >
                              <ChevronLeft className="w-3.5 h-3.5" />
                              <span>-10s</span>
                            </button>
                            
                            <button 
                              onClick={toggleShaderPlayback}
                              className={`border px-3 py-1 flex items-center gap-1.5 transition-all font-bold cursor-crosshair ${
                                isShaderPlaying 
                                  ? 'bg-red-500/10 border-red-500/40 text-red-400 hover:bg-red-500/20' 
                                  : 'bg-[#39FF14]/10 border-[#39FF14]/40 text-[#39FF14] hover:bg-[#39FF14]/20'
                              }`}
                              title={isShaderPlaying ? "Pause rendering" : "Play rendering"}
                            >
                              {isShaderPlaying ? (
                                <>
                                  <Pause className="w-3.5 h-3.5" />
                                  <span>PAUSE</span>
                                </>
                              ) : (
                                <>
                                  <Play className="w-3.5 h-3.5 fill-current" />
                                  <span>PLAY</span>
                                </>
                              )}
                            </button>

                            <button 
                              onClick={() => adjustShaderTime(10)}
                              className="text-[10px] border border-zinc-800 hover:border-[#FF2BD6] px-2 py-1 text-gray-400 hover:text-white transition-all cursor-crosshair flex items-center gap-0.5"
                              title="Fast-forward 10 seconds"
                            >
                              <span>+10s</span>
                              <ChevronRight className="w-3.5 h-3.5" />
                            </button>
                            <button 
                              onClick={() => adjustShaderTime(30)}
                              className="text-[10px] border border-zinc-800 hover:border-[#FF2BD6] px-2 py-1 text-gray-400 hover:text-white transition-all cursor-crosshair flex items-center gap-0.5"
                              title="Fast-forward 30 seconds"
                            >
                              <span>+30s</span>
                              <ChevronsRight className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <div className="flex items-center gap-1">
                            <button 
                              onClick={() => jumpToShaderTime(0)}
                              className="text-[10px] border border-zinc-800 hover:border-white px-2 py-1 text-gray-400 hover:text-white transition-all cursor-crosshair flex items-center gap-1"
                              title="Reset simulation to 0.00"
                            >
                              <RotateCcw className="w-3 h-3" />
                              <span>RESET</span>
                            </button>

                            <div className="h-4 w-[1px] bg-zinc-900 mx-1" />

                            <form 
                              onSubmit={(e) => {
                                e.preventDefault();
                                const parsed = parseFloat(customJumpInput);
                                if (!isNaN(parsed) && parsed >= 0) {
                                  jumpToShaderTime(parsed);
                                }
                              }}
                              className="flex items-center gap-1"
                            >
                              <input 
                                type="text"
                                placeholder="JUMP SEC..."
                                value={customJumpInput}
                                onChange={(e) => setCustomJumpInput(e.target.value)}
                                className="bg-black border border-zinc-800 text-white font-mono px-1.5 py-0.5 text-[10px] w-16 focus:border-[#FF2BD6] focus:outline-none placeholder:text-gray-650 rounded-none text-right"
                              />
                              <button 
                                type="submit"
                                className="text-[10px] bg-[#FF2BD6]/10 border border-[#FF2BD6]/30 text-[#FF2BD6] hover:bg-[#FF2BD6]/20 px-2 py-1 transition-all cursor-crosshair"
                              >
                                GO
                              </button>
                            </form>
                          </div>
                        </div>
                      </div>

                      {/* Header Title with tags */}
                      <div className="flex flex-col md:flex-row justify-between items-start gap-4 border-b border-zinc-900 pb-4">
                        <div>
                          <h3 className="text-2xl md:text-3xl font-extrabold font-sans text-white tracking-tight uppercase">{selectedShader.title}</h3>
                          <p className="text-[12.5px] text-[#39FF14] mt-1.5 tracking-wider font-mono uppercase">
                            FILE: {selectedShader.fileName} // ARCHETYPE_ID: {selectedShader.id.toUpperCase()}
                          </p>
                        </div>
                        <span 
                          className="px-2.5 py-1 text-[10px] text-black font-extrabold tracking-widest uppercase shrink-0" 
                          style={{ backgroundColor: selectedShader.tagColor }}
                        >
                          {selectedShader.tag} MATRIX
                        </span>
                      </div>

                      {/* Descriptive Wording & Specs */}
                      <div className="border-l-2 border-[#FF2BD6] pl-4 py-2 my-2 space-y-4">
                        <p className="text-[15.5px] text-gray-200 leading-relaxed font-sans">
                          {getShaderExplanation(selectedShader)}
                        </p>
                        <p className="text-[12px] text-[#9fdc96] font-mono italic">
                          TECHNICAL SPECS: {getShaderTechnicalDetails(selectedShader)}
                        </p>
                      </div>

                      {/* Phenomenological Field Notes Section */}
                      {getShaderFieldNotes(selectedShader) ? (
                        <div className="border border-[#00F0FF]/30 bg-[#00F0FF]/5 p-5 space-y-3.5">
                          <div className="flex justify-between items-center text-xs md:text-[13px] font-mono text-[#00F0FF] border-b border-[#00F0FF]/25 pb-2 uppercase font-bold tracking-wider">
                            <span className="flex items-center gap-1.5">✦ PHENOMENOLOGICAL FIELD NOTES</span>
                            <span className="text-[9px] bg-black border border-[#00F0FF]/30 px-1.5 py-0.5">RESOLVED THEORY</span>
                          </div>
                          <p className="text-[13.5px] text-gray-300 leading-relaxed font-sans italic whitespace-pre-line">
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

                      {/* View Source Code Block & NFT Link */}
                      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                        <a 
                          href="https://objkt.com/users/tz29m7GScDQn8eE1m8n4h96MAxq279cSsYg9"
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => playChime('triangle', 1.4)}
                          className="text-[10px] border border-[#EFFF04]/50 text-[#EFFF04] hover:bg-[#EFFF04]/10 px-3 py-1.5 uppercase font-mono transition-all cursor-crosshair"
                        >
                          COLLECT DEBRIS ON OBJKT ↗
                        </a>

                        <button 
                          onClick={() => {
                            setShowGLSL(!showGLSL);
                            playChime('sine', 1.4);
                          }}
                          className={`text-[10px] border px-3 py-1.5 transition-all flex items-center gap-1.5 cursor-crosshair font-mono ${
                            showGLSL 
                              ? 'bg-[#FF2BD6] text-black border-[#FF2BD6]' 
                              : 'border-[#FF2BD6]/30 text-[#FF2BD6] hover:bg-[#FF2BD6]/10'
                          }`}
                        >
                          <Code className="w-3.5 h-3.5" />
                          <span>{showGLSL ? 'HIDE FILE CODE' : 'VIEW RAW FILE CODE'}</span>
                        </button>
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
                    <div className="h-[400px] flex flex-col items-center justify-center border border-dashed border-[#FF2BD6]/25 text-center p-6 text-gray-500 font-mono">
                      <Atom className="w-12 h-12 text-[#FF2BD6]/30 animate-spin mb-4" style={{ animationDuration: '8s' }} />
                      <h4 className="text-white text-md font-sans font-bold uppercase mb-1">NO SHARD CONFIGURED</h4>
                      <p className="text-[12px] max-w-sm">
                        Browse the Debris Deck below and select an orbital coordinate to boot up compiling.
                      </p>
                    </div>
                  )}
                </div>

              </div>

              {/* SECTION B_SUB: HORIZONTAL SHARD DECK SELECTOR */}
              <div className="border-t border-[#FF2BD6]/20 pt-12 pb-2 space-y-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="space-y-2">
                    <h3 className="text-xl md:text-2xl font-extrabold font-sans text-white tracking-wide uppercase flex items-center gap-2.5">
                      <Atom className="w-5 h-5 text-[#FF2BD6] animate-spin" style={{ animationDuration: '6s' }} />
                      <span>DEBRIS DECK SELECTOR</span>
                    </h3>
                    <p className="text-[12px] text-zinc-500 font-mono mt-1">BROWSE ALL REPOSITORY ARTIFACTS · SELECT SHARD TO INJECT TO LAB</p>
                  </div>

                  {/* Horizontal Scroll Deck Nav Buttons */}
                  <div className="flex items-center gap-2 self-end">
                    <button 
                      onClick={() => scrollDeck('left')}
                      className="border border-[#FF2BD6]/40 hover:border-[#FF2BD6] text-[#FF2BD6] hover:bg-[#FF2BD6]/10 px-3 py-1.5 text-[10px] font-mono font-bold uppercase transition-all cursor-crosshair"
                    >
                      ◀ SCROLL LEFT
                    </button>
                    <button 
                      onClick={() => scrollDeck('right')}
                      className="border border-[#FF2BD6]/40 hover:border-[#FF2BD6] text-[#FF2BD6] hover:bg-[#FF2BD6]/10 px-3 py-1.5 text-[10px] font-mono font-bold uppercase transition-all cursor-crosshair"
                    >
                      SCROLL RIGHT ▶
                    </button>
                  </div>
                </div>

                {/* Tactical category tabs for quick grouping filtering */}
                <div className="flex flex-wrap gap-1.5 border-b border-zinc-900 pb-3 font-mono text-[10px]">
                  {[
                    { id: 'ALL', label: 'ALL DEBRIS', count: allShaders.length },
                    { id: 'VHS', label: 'VHS / CRT', count: allShaders.filter(s => s.tag === 'VHS' || s.tag === 'CRT').length },
                    { id: 'MATH', label: 'COMPUTATIONAL MATH', count: allShaders.filter(s => s.tag === 'MATH' || s.tag === 'CYCLE').length },
                    { id: 'CMY', label: 'CMY / DIFFUSION', count: allShaders.filter(s => s.tag === 'CMY' || s.tag === 'PRISM' || s.tag === 'FBM').length },
                    { id: 'FLUID', label: 'BIOMORPHIC FLUID', count: allShaders.filter(s => s.tag === 'FLUID' || s.tag === 'BIO' || s.tag === 'SILK').length },
                    { id: 'GLITCH', label: 'GLITCH / CYBER', count: allShaders.filter(s => s.tag === 'GLITCH' || s.tag === 'Y2K' || s.tag === 'VOID').length },
                    { id: 'DYNAMIC', label: 'DYNAMIC REPO', count: allShaders.filter(s => s.thumbClass === 'dynamic').length },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => {
                        setGalleryFilter(tab.id);
                        playChime('sine', 1.3);
                      }}
                      className={`px-3 py-1.5 transition-all border font-bold cursor-crosshair ${
                        galleryFilter === tab.id 
                          ? 'bg-[#FF2BD6] text-black border-[#FF2BD6]' 
                          : 'bg-black text-gray-400 border-zinc-900 hover:border-zinc-700 hover:text-white'
                      }`}
                    >
                      {tab.label} ({tab.count})
                    </button>
                  ))}
                </div>

                {/* Horizontal scroll container with interactive items */}
                <div 
                  ref={scrollContainerRef}
                  className="flex gap-4 overflow-x-auto pb-4 pt-2 px-1 scroll-smooth"
                  style={{
                    scrollbarWidth: 'thin',
                    scrollbarColor: '#FF2BD633 #000000'
                  }}
                >
                  {filteredShaders.length > 0 ? (
                    filteredShaders.map((item) => (
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
                        className={`group border cursor-crosshair p-3 transition-all shrink-0 w-[170px] select-none ${
                          selectedShader?.id === item.id 
                            ? 'bg-[#FF2BD6]/10 border-[#FF2BD6] shadow-[0_0_15px_rgba(255,43,214,0.3)]' 
                            : 'bg-black/80 border-zinc-900 hover:border-[#FF2BD6]/50'
                        }`}
                      >
                        <div className="aspect-square w-full mb-2 relative overflow-hidden border border-zinc-950">
                          <ShaderThumbnail shaderId={item.id} fileName={item.fileName} />
                          <div className="absolute inset-0 bg-black/15 group-hover:bg-transparent transition-colors pointer-events-none" />
                          <div className="absolute top-1 left-1 text-[8px] bg-black/90 text-white px-1.5 py-0.5 font-mono border border-white/10">
                            {item.tag}
                          </div>
                        </div>
                        <h4 className="text-white text-[12px] font-sans font-bold truncate tracking-wide" title={item.title}>
                          {item.title}
                        </h4>
                        <div className="flex justify-between items-center mt-1">
                          <span className="text-[8px] text-[#FF2BD6] uppercase tracking-widest">{item.tag} SHARD</span>
                          <ChevronRight className="w-3.5 h-3.5 text-[#FF2BD6] group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="py-12 text-center w-full text-zinc-600 font-mono text-[11px] uppercase tracking-wider border border-dashed border-zinc-900">
                      [ NO SHARDS RECOVERED IN THIS CATEGORY DIRECTORY ]
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
            <AiSlop
              playChime={playChime}
              rawPrompt={rawPrompt}
              setRawPrompt={setRawPrompt}
              corruptedPrompt={corruptedPrompt}
              setCorruptedPrompt={setCorruptedPrompt}
              isCorrupting={isCorrupting}
              handleCorruptPrompt={handleCorruptPrompt}
              slopMetric={slopMetric}
              aiLogs={aiLogs}
            />
          )}

          {/* ========================================================================= */}
          {/* SECTION E: ABOUT ME / MORE - PORTAL GRID & SUB-ROUTING                     */}
          {/* ========================================================================= */}
          {activeTab === 'about' && (
            <div className="frame py-8 animate-fade-in">
              
              {/* Top Banner Title */}
              <div className="mb-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-[#EFFF04]/30 pb-3 mb-2 gap-2">
                  <h2 
                    className="text-3xl font-bold font-sans text-white tracking-wider uppercase"
                    style={{
                      fontFamily: "'Bitcount Prop Double', 'Chakra Petch', sans-serif",
                      textShadow: '0 0 8px var(--phosphor), 0 0 30px rgba(239,255,4,0.5), 3px 0 0 rgba(255,43,214,0.8), -3px 0 0 rgba(0,240,255,0.8)',
                      animation: 'jitter 6s infinite'
                    }}
                  >
                    ░ {moreSubTab === 'landing' ? 'More Sectors // astraltrash' : `More Sectors // ${moreSubTab.toUpperCase()}`} ░
                  </h2>
                  <span className="text-[11px] text-gray-500 font-mono">SYS_ROUTER: ACTIVE_DECK_STREAMS</span>
                </div>
                <p className="text-[#9fdc96] text-[13px] leading-relaxed max-w-2xl">
                  {moreSubTab === 'landing' && "Unlocking advanced directories: Explore documented trip reports, opinion essays on technology & design, chronologically indexed artist blogs, and biographical dossiers."}
                  {moreSubTab === 'psychedelic' && "Poetic records of raw visual geometry, dither-mapped visual reports, and research notes from altered realities."}
                  {moreSubTab === 'opinions' && "Critical essays and personal philosophies concerning modern technology, creative rebellion, and digital design."}
                  {moreSubTab === 'blog' && "Sequential process logs of WebGL shader design, physical acrylic painting, and retro hardware salvage."}
                  {moreSubTab === 'about-profile' && "Biographical dossier of the entity, stats matrix, interactive portrait photostream, and verified communications."}
                </p>
              </div>

              {/* Sub-Navigation Tabs */}
              <div className="mb-8 bg-black/60 border border-zinc-900 p-2 rounded-xl flex flex-wrap gap-2 items-center justify-between font-mono text-xs text-gray-400">
                <div className="flex items-center gap-2 pl-1">
                  <span className="text-[#EFFF04] font-bold">📂 DIRECTORY:</span>
                  <span className="text-zinc-600">/</span>
                  <span className="text-white font-semibold uppercase">{moreSubTab === 'landing' ? 'MENU' : moreSubTab}</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  <button 
                    onClick={() => { setMoreSubTab('landing'); playChime('sine', 1.0); }}
                    className={`px-2.5 py-1 border transition-all text-[10px] rounded hover:text-[#EFFF04] hover:border-[#EFFF04] cursor-crosshair uppercase ${moreSubTab === 'landing' ? 'bg-[#EFFF04] text-black border-[#EFFF04] font-bold shadow-[0_0_8px_rgba(239,255,4,0.3)]' : 'bg-black border-zinc-900'}`}
                  >
                    📡 MENU
                  </button>
                  <button 
                    onClick={() => { setMoreSubTab('psychedelic'); playChime('sine', 1.1); }}
                    className={`px-2.5 py-1 border transition-all text-[10px] rounded hover:text-[#FF2BD6] hover:border-[#FF2BD6] cursor-crosshair uppercase ${moreSubTab === 'psychedelic' ? 'bg-[#FF2BD6] text-white border-[#FF2BD6] font-bold shadow-[0_0_8px_rgba(255,43,214,0.3)]' : 'bg-black border-zinc-900'}`}
                  >
                    🌀 PSYCHEDELIC
                  </button>
                  <button 
                    onClick={() => { setMoreSubTab('opinions'); playChime('sine', 1.2); }}
                    className={`px-2.5 py-1 border transition-all text-[10px] rounded hover:text-[#00F0FF] hover:border-[#00F0FF] cursor-crosshair uppercase ${moreSubTab === 'opinions' ? 'bg-[#00F0FF] text-black border-[#00F0FF] font-bold shadow-[0_0_8px_rgba(0,240,255,0.3)]' : 'bg-black border-zinc-900'}`}
                  >
                    🧠 OPINIONS
                  </button>
                  <button 
                    onClick={() => { setMoreSubTab('blog'); playChime('sine', 1.3); }}
                    className={`px-2.5 py-1 border transition-all text-[10px] rounded hover:text-[#39FF14] hover:border-[#39FF14] cursor-crosshair uppercase ${moreSubTab === 'blog' ? 'bg-[#39FF14] text-black border-[#39FF14] font-bold shadow-[0_0_8px_rgba(57,255,20,0.3)]' : 'bg-black border-zinc-900'}`}
                  >
                    📝 BLOG
                  </button>
                  <button 
                    onClick={() => { setMoreSubTab('about-profile'); playChime('sine', 1.4); }}
                    className={`px-2.5 py-1 border transition-all text-[10px] rounded hover:text-[#9D4DFF] hover:border-[#9D4DFF] cursor-crosshair uppercase ${moreSubTab === 'about-profile' ? 'bg-[#9D4DFF] text-white border-[#9D4DFF] font-bold shadow-[0_0_8px_rgba(157,77,255,0.3)]' : 'bg-black border-zinc-900'}`}
                  >
                    👾 ABOUT_ME
                  </button>
                </div>
              </div>

              {/* ------------------------------------------------------------- */}
              {/* SUB-VIEW 1: LANDING MENU                                      */}
              {/* ------------------------------------------------------------- */}
              {moreSubTab === 'landing' && (
                <div className="animate-fade-in">
                  <style>{`
                    /* ===== MORE//MENU sector-select deck — scoped to this view only ===== */
                    .menu-prompt{font-family:'Jersey 10',sans-serif;font-size:26px;letter-spacing:.1em;text-transform:uppercase;color:var(--acid);text-shadow:0 0 16px rgba(239,255,4,.55),2px 0 0 rgba(255,43,214,.5),-2px 0 0 rgba(0,240,255,.5)}
                    .menu-blink{animation:menu-blink 1.1s steps(2,start) infinite}
                    @keyframes menu-blink{0%,55%{opacity:1}56%,100%{opacity:0}}
                    .menu-rainbow{height:4px;background:repeating-linear-gradient(90deg,#FF2BD6 0 44px,#EFFF04 44px 88px,#39FF14 88px 132px,#00F0FF 132px 176px,#9D4DFF 176px 220px);animation:menu-slide 5s linear infinite}
                    @keyframes menu-slide{to{background-position:220px 0}}
                    .menu-ticker{overflow:hidden;white-space:nowrap;border-top:1px dashed rgba(239,255,4,.3);border-bottom:1px dashed rgba(239,255,4,.3);padding:5px 0;font-family:'Share Tech Mono',monospace;font-size:11px;letter-spacing:.16em;background:rgba(0,0,0,.5)}
                    .menu-ticker-inner{display:inline-block;animation:menu-tickmove 30s linear infinite}
                    @keyframes menu-tickmove{to{transform:translateX(-50%)}}
                    .menu-cart{position:relative;cursor:crosshair;border:2px solid var(--mc-soft);overflow:hidden;transition:transform .3s ease,box-shadow .3s ease,border-color .3s ease}
                    .menu-cart:hover{border-color:var(--mc);box-shadow:0 0 34px var(--mc-soft),inset 0 0 26px var(--mc-faint)}
                    .menu-tilt-l{transform:rotate(-.55deg)}
                    .menu-tilt-r{transform:rotate(.45deg)}
                    .menu-tilt-l:hover,.menu-tilt-r:hover{transform:rotate(0deg) scale(1.015)}
                    .menu-dither{position:absolute;inset:0;pointer-events:none;background-image:radial-gradient(circle,var(--mc-faint) 1px,transparent 1px);background-size:7px 7px;opacity:.55}
                    .menu-scan{position:absolute;left:0;right:0;top:-70px;height:52px;pointer-events:none;background:linear-gradient(to bottom,transparent,var(--mc-soft),transparent);opacity:0;mix-blend-mode:screen}
                    .menu-cart:hover .menu-scan{opacity:.8;animation:menu-sweep 1.7s linear infinite}
                    @keyframes menu-sweep{to{transform:translateY(560px)}}
                    .menu-corner{position:absolute;font-family:'Share Tech Mono',monospace;font-size:15px;line-height:1;color:var(--mc);z-index:3;pointer-events:none;text-shadow:0 0 8px var(--mc-soft)}
                    .menu-masthead{position:relative;height:96px;overflow:hidden;border-bottom:2px solid var(--mc-soft)}
                    .menu-masthead-fx{position:absolute;inset:0;background-size:320% 320%;animation:menu-drift 17s ease-in-out infinite alternate,menu-hue 8s ease-in-out infinite alternate}
                    @keyframes menu-drift{from{background-position:0% 0%}to{background-position:100% 100%}}
                    @keyframes menu-hue{from{filter:hue-rotate(-24deg) saturate(1.15)}to{filter:hue-rotate(24deg) saturate(1.3)}}
                    .menu-masthead-dots{position:absolute;inset:0;background-image:radial-gradient(circle,rgba(0,0,0,.5) 1.2px,transparent 1.2px);background-size:5px 5px}
                    .menu-masthead-lines{position:absolute;inset:0;background:repeating-linear-gradient(to bottom,rgba(0,0,0,.35) 0 2px,transparent 2px 4px)}
                    .menu-title{position:absolute;left:14px;right:72px;bottom:6px;z-index:2;font-family:'Jersey 10',sans-serif;font-size:29px;line-height:1;letter-spacing:.05em;text-transform:uppercase;color:#fff;text-shadow:2px 0 0 rgba(255,43,214,.9),-2px 0 0 rgba(0,240,255,.9),0 2px 12px rgba(0,0,0,.95)}
                    .menu-cart:hover .menu-title{animation:jitter 4s infinite}
                    .menu-glyph{position:absolute;right:14px;top:50%;margin-top:-26px;z-index:2;font-size:44px;animation:menu-bob 3.6s ease-in-out infinite;filter:drop-shadow(0 0 10px rgba(0,0,0,.85))}
                    @keyframes menu-bob{0%,100%{transform:translateY(-4px) rotate(-6deg)}50%{transform:translateY(5px) rotate(7deg)}}
                    .menu-chip{display:inline-flex;align-items:center;gap:6px;border:1px solid var(--mc-soft);background:var(--mc-faint);color:var(--mc);font-family:'Silkscreen',monospace;font-size:8px;letter-spacing:.14em;text-transform:uppercase;padding:3px 8px}
                    .menu-led{width:6px;height:6px;background:var(--mc);animation:pulse 1.2s infinite;box-shadow:0 0 6px var(--mc)}
                    .menu-eq{display:inline-flex;align-items:flex-end;gap:2px;height:13px}
                    .menu-eq i{width:3px;background:var(--mc);animation:menu-eqb .85s ease-in-out infinite alternate;box-shadow:0 0 5px var(--mc-soft)}
                    .menu-eq i:nth-child(2){animation-delay:.14s}
                    .menu-eq i:nth-child(3){animation-delay:.28s}
                    .menu-eq i:nth-child(4){animation-delay:.42s}
                    .menu-eq i:nth-child(5){animation-delay:.56s}
                    @keyframes menu-eqb{from{height:3px}to{height:13px}}
                    .menu-stats{border:1px dashed var(--mc-soft);background:rgba(0,0,0,.45);padding:9px 11px;font-family:'Share Tech Mono',monospace;font-size:10px;letter-spacing:.05em;text-transform:uppercase;display:flex;flex-direction:column;gap:5px}
                    .menu-access{display:inline-flex;align-items:center;gap:6px;font-family:'Jersey 10',sans-serif;font-size:16px;letter-spacing:.08em;text-transform:uppercase;border:2px solid var(--mc);color:var(--mc);background:rgba(0,0,0,.55);padding:4px 13px;transition:all .15s}
                    .menu-cart:hover .menu-access{background:var(--mc);color:#000;box-shadow:0 0 20px var(--mc)}
                    .menu-sticker{position:absolute;top:10px;right:12px;z-index:4;font-family:'Silkscreen',monospace;font-size:9px;letter-spacing:.1em;background:var(--acid);color:#000;padding:3px 8px;transform:rotate(8deg) scale(.4);opacity:0;transition:all .25s cubic-bezier(.2,1.6,.4,1);pointer-events:none;box-shadow:0 0 14px rgba(239,255,4,.6)}
                    .menu-cart:hover .menu-sticker{opacity:1;transform:rotate(8deg) scale(1)}
                  `}</style>

                  {/* Select prompt + rainbow data-strip */}
                  <div className="flex flex-col gap-2 mb-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="menu-prompt select-none">▚▚ Select Your Sector <span className="menu-blink">█</span></div>
                      <div className="hidden md:flex items-center gap-2 font-mono text-[9px] text-zinc-500 uppercase tracking-widest">
                        <span className="menu-blink text-[#39FF14]">●</span> 4 DECKS ONLINE // 0 LOCKED
                      </div>
                    </div>
                    <div className="menu-rainbow" />
                  </div>

                  {/* Scrolling system chatter */}
                  <div className="menu-ticker text-[#9fdc96] mb-7 select-none" aria-hidden="true">
                    <div className="menu-ticker-inner">
                      <span>✦ 4 SECTORS ONLINE ✦ PHENO_DATA STREAM: STABLE ✦ THOUGHT_MATRIX: LEAKING UNENCRYPTED OPINIONS ✦ PROCESS_FEED: PAINT STILL WET ✦ ENTITY DOSSIER: DECLASSIFIED ✦ NO ADS ✦ NO ALGORITHM ✦ 100% HANDMADE ✦ DIAL-UP SOULS WELCOME&nbsp;</span>
                      <span>✦ 4 SECTORS ONLINE ✦ PHENO_DATA STREAM: STABLE ✦ THOUGHT_MATRIX: LEAKING UNENCRYPTED OPINIONS ✦ PROCESS_FEED: PAINT STILL WET ✦ ENTITY DOSSIER: DECLASSIFIED ✦ NO ADS ✦ NO ALGORITHM ✦ 100% HANDMADE ✦ DIAL-UP SOULS WELCOME&nbsp;</span>
                    </div>
                  </div>

                  {/* Sector cartridges */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {([
                      {
                        id: 'psychedelic', chime: 1.1, glyph: '🌀', title: 'Psychedelic Archive',
                        tag: 'PHENO_DATA', stream: 'SECURE_ENTRY_STREAM',
                        desc: 'Visionary geometry logs, trip research, and dither-mapped visual reports exploring altered dimensional states of consciousness.',
                        accent: '#FF2BD6', soft: 'rgba(255,43,214,.4)', faint: 'rgba(255,43,214,.13)', bg: 'rgba(20,0,28,.92)',
                        grad: 'conic-gradient(from 120deg, #FF2BD6, #9D4DFF, #00F0FF, #EFFF04, #FF2BD6)',
                        stats: [
                          ['GEOMETRY_DEPTH', '▓▓▓▓▓▓▓░░ LVL_7'],
                          ['REALITY_ANCHOR', '12% // SLIPPING'],
                          ['ENTITY_CONTACT', 'CONFIRMED x3 ✦'],
                        ],
                      },
                      {
                        id: 'opinions', chime: 1.2, glyph: '🧠', title: 'Opinions Board',
                        tag: 'UNENCRYPTED', stream: 'THOUGHT_MATRIX',
                        desc: 'Unencrypted brain debris and critical essays defending the weird web, the physics of low-fidelity dither, and anti-slop curation.',
                        accent: '#00F0FF', soft: 'rgba(0,240,255,.4)', faint: 'rgba(0,240,255,.12)', bg: 'rgba(0,23,26,.92)',
                        grad: 'repeating-radial-gradient(circle at 30% 40%, #00F0FF 0 14px, #050a1e 14px 28px, #FF2BD6 28px 42px, #050a1e 42px 56px)',
                        stats: [
                          ['HOT_TAKES_LOADED', '47 ROUNDS'],
                          ['SPICE_LEVEL', '▓▓▓▓▓▓▓▓░ 91%'],
                          ['FILTER_STATUS', 'NONE_DETECTED'],
                        ],
                      },
                      {
                        id: 'blog', chime: 1.3, glyph: '📝', title: "Artist's Blog",
                        tag: 'ACTIVE_LOGS', stream: 'PROCESS_FEED',
                        desc: 'Weekly process updates on shader engineering, physical painting, vintage hardware salvages, and custom visual bibles.',
                        accent: '#39FF14', soft: 'rgba(57,255,20,.4)', faint: 'rgba(57,255,20,.12)', bg: 'rgba(5,28,2,.92)',
                        grad: 'linear-gradient(135deg, #0b3d0b, #39FF14 35%, #EFFF04 65%, #FF6B00)',
                        stats: [
                          ['LOG_FREQUENCY', 'WEEKLY-ISH'],
                          ['PAINT_ON_HANDS', '▓▓▓▓▓▓▓▓░ 84%'],
                          ['SOLDER_FUMES', 'NOMINAL ☻'],
                        ],
                      },
                      {
                        id: 'about-profile', chime: 1.4, glyph: '👾', title: 'About the Artist',
                        tag: 'ENTITY_INFO', stream: 'PROFILE_DOSSIER',
                        desc: 'Original biography, interactive portrait photo dossier, stats matrix, and verified transmission/social networks.',
                        accent: '#9D4DFF', soft: 'rgba(157,77,255,.4)', faint: 'rgba(157,77,255,.13)', bg: 'rgba(17,1,33,.92)',
                        grad: 'conic-gradient(from 0deg, #9D4DFF, #00F0FF, #39FF14, #FF2BD6, #9D4DFF)',
                        stats: [
                          ['ENTITY_CLASS', 'HUMAN (?)'],
                          ['VIBE_OUTPUT', '▓▓▓▓▓▓▓▓▓ 97%'],
                          ['LAST_SEEN', 'THE_ASTRAL_BIN'],
                        ],
                      },
                    ] as const).map((c, i) => (
                      <div
                        key={c.id}
                        onClick={() => { setMoreSubTab(c.id); playChime('sine', c.chime); }}
                        className={`group menu-cart ${i % 2 === 0 ? 'menu-tilt-l' : 'menu-tilt-r'}`}
                        style={{ '--mc': c.accent, '--mc-soft': c.soft, '--mc-faint': c.faint, background: c.bg } as any}
                      >
                        <div className="menu-dither" />
                        <span className="menu-corner" style={{ top: 3, left: 6 }}>╔</span>
                        <span className="menu-corner" style={{ top: 3, right: 6 }}>╗</span>
                        <span className="menu-corner" style={{ bottom: 4, left: 6 }}>╚</span>
                        <span className="menu-corner" style={{ bottom: 4, right: 6 }}>╝</span>

                        {/* Animated psychedelic masthead */}
                        <div className="menu-masthead">
                          <div className="menu-masthead-fx" style={{ backgroundImage: c.grad }} />
                          <div className="menu-masthead-dots" />
                          <div className="menu-masthead-lines" />
                          <span className="menu-glyph select-none">
                            <span className="inline-block transition-transform duration-700 group-hover:rotate-[360deg] group-hover:scale-125">{c.glyph}</span>
                          </span>
                          <h3 className="menu-title">{c.title}</h3>
                        </div>

                        <div className="relative p-5 pt-4">
                          {/* Status row */}
                          <div className="flex items-center justify-between mb-3">
                            <span className="menu-chip"><i className="menu-led" />{c.tag}</span>
                            <span className="menu-eq" aria-hidden="true"><i /><i /><i /><i /><i /></span>
                          </div>

                          <p className="text-zinc-400 font-mono text-xs leading-relaxed mb-4">
                            {c.desc}
                          </p>

                          {/* Fake telemetry block */}
                          <div className="menu-stats mb-4">
                            {c.stats.map(([k, v]) => (
                              <div key={k} className="flex justify-between gap-3">
                                <span className="text-zinc-500">{k}</span>
                                <span className="text-right" style={{ color: 'var(--mc)' }}>{v}</span>
                              </div>
                            ))}
                          </div>

                          <div className="flex items-center justify-between border-t pt-3" style={{ borderColor: 'var(--mc-faint)' }}>
                            <span className="font-mono text-[10px] tracking-wider" style={{ color: 'var(--mc)' }}>
                              <span className="menu-blink">▮</span> {c.stream}
                            </span>
                            <span className="menu-access">ACCESS DECK <span className="inline-block transition-transform group-hover:translate-x-1">▸</span></span>
                          </div>
                        </div>

                        <span className="menu-sticker">CLICK ME!!</span>
                        <div className="menu-scan" />
                      </div>
                    ))}
                  </div>

                  <div className="mt-7 text-center font-mono text-[10px] tracking-[.3em] text-zinc-600 select-none uppercase">
                    ── ✦ END_OF_DIRECTORY // CHOOSE_WISELY ✦ ──
                  </div>
                </div>
              )}

              {/* ------------------------------------------------------------- */}
              {/* SUB-VIEW 2: PSYCHEDELIC                                        */}
              {/* ------------------------------------------------------------- */}
              {moreSubTab === 'psychedelic' && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start animate-fade-in text-left">
                  {/* Left Column: List of files */}
                  <div className="lg:col-span-4 bg-zinc-950/80 border border-[#FF2BD6]/30 p-4 rounded-xl space-y-3 font-mono">
                    <div className="text-[10px] text-[#FF2BD6] font-bold tracking-wider border-b border-[#FF2BD6]/20 pb-1.5 uppercase">
                      📂 Visionary Core Files
                    </div>
                    <div className="space-y-1.5">
                      {[
                        { title: 'Summary of everything', tag: 'INTEGRATION', date: 'ALL_TIME' },
                        { title: 'The Tetrogrammaton', tag: 'DMT_CORE', date: 'VISION' },
                        { title: 'The SHIPWREKTD event', tag: 'EXPERIENCE', date: '08/2025' },
                        { title: 'The Night of 9 grams (4 grams)', tag: 'HIGH_DOSE', date: '12/2025' },
                        { title: 'Other', tag: 'MISC_DEBRIS', date: 'DEBRIS' }
                      ].map((item, idx) => (
                        <button
                          key={idx}
                          onClick={() => { playChime('sine', 1.0 + idx * 0.1); setActiveTripReport(idx); }}
                          className={`w-full text-left p-2.5 rounded border transition-all text-xs flex justify-between items-center ${activeTripReport === idx ? 'bg-[#FF2BD6]/10 border-[#FF2BD6] text-white' : 'bg-black/50 border-zinc-900 text-zinc-400 hover:border-zinc-705 hover:text-white'}`}
                        >
                          <div className="space-y-0.5 truncate pr-2">
                            <div className="font-bold uppercase truncate">{item.title}</div>
                            <div className="text-[9px] text-zinc-500">{item.tag}</div>
                          </div>
                          <span className="text-[8px] shrink-0 font-mono bg-zinc-900 border border-zinc-800 text-zinc-500 px-1.5 py-0.5 rounded">{item.date}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Right Column: Active File Details */}
                  <div className="lg:col-span-8 space-y-6">
                    {/* Contained, Scrollable Introduction console box */}
                    <div className="bg-[#12011b]/80 border-2 border-[#FF2BD6]/30 rounded-xl p-5 shadow-[0_0_25px_rgba(255,43,214,0.08)] relative overflow-hidden group">
                      <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(255,43,214,0.02)_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none rounded-xl" />
                      <div className="flex justify-between items-center border-b border-[#FF2BD6]/20 pb-2 mb-3.5 select-none">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-[#FF2BD6] animate-ping shrink-0" />
                          <span className="w-2 h-2 rounded-full bg-[#FF2BD6] absolute shrink-0" />
                          <span className="text-[10px] font-mono text-[#FF2BD6] tracking-wider uppercase font-bold">📂 DEBRIS_STREAM_INTRO.txt</span>
                        </div>
                        <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">TRANSMISSION_INTEGRATED</span>
                      </div>
                      <div className="text-xs font-mono text-zinc-300 leading-relaxed max-h-[160px] overflow-y-auto pr-2 custom-scrollbar space-y-3.5 whitespace-pre-line">
                        {psychedelicIntro}
                      </div>
                    </div>

                    {/* Active File Details */}
                    <div className="bg-black/90 border border-[#FF2BD6]/40 p-6 rounded-xl space-y-4 shadow-[0_0_20px_rgba(255,43,214,0.05)]">
                    {activeTripReport === 0 && (
                      <div className="space-y-4">
                        <div className="flex justify-between items-start border-b border-zinc-900 pb-3 gap-2 flex-wrap">
                          <h3 className="text-xl font-bold font-sans text-[#FF2BD6] tracking-wide uppercase">FILE_01: Summary of Everything</h3>
                          <span className="text-[10px] font-mono text-zinc-500 bg-zinc-950 px-2 py-0.5 border border-zinc-900 rounded">DATE: ALL_TIME · ARCHIVE INTEGRATION</span>
                        </div>
                        <div className="text-sm font-sans text-gray-300 leading-relaxed space-y-3.5">
                          <p>
                            A complete diagnostic overview of deep-state psychedelic integrations and structural pattern alignments across multiple visionary cycles.
                          </p>
                          <p>
                            When combining multiple chemical and mathematical frameworks (including high-dose psilocybe, classical tryptamines, and lysergamides), we isolate a recurring set of geometries: dithered spatial decay, grid-based shear coordinate vectors, and custom chromatic aberration matrices that overlay standard physical perception. This is where creative artifacts emerge—not by representing organic watercolor, but by Mining raw dithered GLSL structures directly from the machine's debris.
                          </p>
                          <blockquote className="border-l-2 border-[#FF2BD6] pl-3 py-1 italic text-zinc-400 text-xs font-mono">
                            "Across all dimensions and thresholds, the unifying code is always dithered, structured, and mathematical."
                          </blockquote>
                          <p>
                            This metadata serves as the foundational catalog for the **Astral Trash** project. Every shader, interface, and sound element in this space is an archival translation of these integrated states.
                          </p>
                        </div>
                      </div>
                    )}
                    {activeTripReport === 1 && (
                      <div className="space-y-4">
                        <div className="flex justify-between items-start border-b border-zinc-900 pb-3 gap-2 flex-wrap">
                          <h3 className="text-xl font-bold font-sans text-[#FF2BD6] tracking-wide uppercase">FILE_02: The Tetrogrammaton Architecture</h3>
                          <span className="text-[10px] font-mono text-zinc-500 bg-zinc-950 px-2 py-0.5 border border-zinc-900 rounded">DATE: VISION · DMT_CORE</span>
                        </div>
                        <div className="text-sm font-sans text-gray-300 leading-relaxed space-y-3.5">
                          <p>
                            A detailed breakdown of the four-fold symmetrical entity gate encountered during deep tryptamine-induced coordinate translation.
                          </p>
                          <p>
                            At the core threshold of the encounter, the physical space decomposes. In its place stands the Tetrogrammaton: a fast-rotating, hyper-dimensional geometric structure radiating high-frequency electrical glyphs and dithered light. This construct behaves not as a separate entity, but as a core rendering engine—reconstructing user perception through recursive feedback loops of raw, structured math matrices.
                          </p>
                          <blockquote className="border-l-2 border-[#FF2BD6] pl-3 py-1 italic text-zinc-400 text-xs font-mono">
                            "The four-fold coordinates rotate on an axis of pure light, rendering the structure of the cosmos."
                          </blockquote>
                          <p>
                            The rotational mathematics behind this gate inspired our **Lattice Rotator** shaders, capturing the precise coordinate shearing observed at the vertices of the rotating structure.
                          </p>
                        </div>
                      </div>
                    )}
                    {activeTripReport === 2 && (
                      <div className="space-y-4">
                        <div className="flex justify-between items-start border-b border-zinc-900 pb-3 gap-2 flex-wrap">
                          <h3 className="text-xl font-bold font-sans text-[#FF2BD6] tracking-wide uppercase">FILE_03: The SHIPWREKTD Event</h3>
                          <span className="text-[10px] font-mono text-zinc-500 bg-zinc-950 px-2 py-0.5 border border-zinc-900 rounded">DATE: AUGUST 2025 · RADICAL DRIFT</span>
                        </div>
                        <div className="text-sm font-sans text-gray-300 leading-relaxed space-y-3.5">
                          <p>
                            An aggressive, absolute derailment of standard spatial coordinates and identity structures.
                          </p>
                          <p>
                            During the SHIPWREKTD sequence, the local sensory system suffered an instantaneous signal decay. The surrounding room shattered into floating digital junk panels, glowing code fragments, and structural scrap metal. There was no remaining body or ego construct, only a singular floating observer cataloging the virtual debris field.
                          </p>
                          <blockquote className="border-l-2 border-[#FF2BD6] pl-3 py-1 italic text-zinc-400 text-xs font-mono">
                            "Floating among the geometric wreckage of a shattered, low-fidelity digital construct."
                          </blockquote>
                          <p>
                            This complete decomposition of the visual plane is the definitive origin of our aesthetic. The digital junk floating in low orbit across these decks is a direct translation of that quiet, geometric scrap field.
                          </p>
                        </div>
                      </div>
                    )}
                    {activeTripReport === 3 && (
                      <div className="space-y-4">
                        <div className="flex justify-between items-start border-b border-zinc-900 pb-3 gap-2 flex-wrap">
                          <h3 className="text-xl font-bold font-sans text-[#FF2BD6] tracking-wide uppercase">FILE_04: The Night of 9 grams (4 grams)</h3>
                          <span className="text-[10px] font-mono text-zinc-500 bg-zinc-950 px-2 py-0.5 border border-zinc-900 rounded">DATE: DECEMBER 2025 · HIGH_DOSE_ORBIT</span>
                        </div>
                        <div className="text-sm font-sans text-gray-300 leading-relaxed space-y-3.5">
                          <p>
                            A deep, high-orbit psilocybe voyage utilizing 9.0 grams of Cubensis with a 4.0-gram booster dose administered at the peak of the sequence.
                          </p>
                          <p>
                            This double-dose protocol induced a total blackout of physical boundaries. The physical room was replaced by deep, pixelated tunnels and sliding dimensional corridors. The visual system processed these tunnels at 60fps with infinite, dithered depth maps. Closing the eyes intensified the shear, displaying fractional calculations at the vertices of rotating coordinate planes.
                          </p>
                          <blockquote className="border-l-2 border-[#FF2BD6] pl-3 py-1 italic text-zinc-400 text-xs font-mono">
                            "A double-dose journey through dithered depth maps and multi-layered coordinate grids."
                          </blockquote>
                          <p>
                            This encounter is the core reference for our **VCR tracking** and **high-frequency closed-eye visual grids** simulating raw chemical stresses on the visual system.
                          </p>
                        </div>
                      </div>
                    )}
                    {activeTripReport === 4 && (
                      <div className="space-y-4">
                        <div className="flex justify-between items-start border-b border-zinc-900 pb-3 gap-2 flex-wrap">
                          <h3 className="text-xl font-bold font-sans text-[#FF2BD6] tracking-wide uppercase">FILE_05: Other Visionary Debris</h3>
                          <span className="text-[10px] font-mono text-zinc-500 bg-zinc-950 px-2 py-0.5 border border-zinc-900 rounded">TRANSLATION GUIDE</span>
                        </div>
                        <div className="text-sm font-sans text-gray-300 leading-relaxed space-y-3.5">
                          <p>
                            A collection of auxiliary transmissions, including wave-interference guides, trigonometric sine wave formulas, and dither-miner observations.
                          </p>
                          <div className="space-y-3 font-mono text-xs bg-zinc-950 p-4 border border-zinc-900 rounded-lg">
                            <div>
                              <span className="text-[#FF2BD6] font-bold">1. Fractional Brownian Motion (fBm):</span>
                              <p className="text-zinc-400 ml-3 mt-1 leading-relaxed">Used to synthesize organic, fluid-like layouts that morph dynamically on the screen.</p>
                            </div>
                            <div className="mt-3">
                              <span className="text-[#FF2BD6] font-bold">2. Polar Coordinates (atan2):</span>
                              <p className="text-zinc-400 ml-3 mt-1 leading-relaxed">Replicates tunnel travel dynamics by warping simple 2D matrices into deep virtual tubes.</p>
                            </div>
                            <div className="mt-3">
                              <span className="text-[#FF2BD6] font-bold">3. Sine/Cosine Modulo Interference:</span>
                              <p className="text-zinc-400 ml-3 mt-1 leading-relaxed">Simulates high-frequency visionary grids that overlap without mixing, creating custom moiré patterns.</p>
                            </div>
                          </div>
                          <pre className="text-[9px] text-[#FF2BD6] font-mono bg-[#FF2BD6]/5 p-3 rounded-lg border border-[#FF2BD6]/20 leading-tight block text-center overflow-x-auto select-none">
{`   _     _ _ _ _   _ _ _ _ _   _     _
  | |   |  _ _ _| |___   ___| | |   | |
  | |   | | _ _       | |     | | _ | |
  | |   |  _ _ |      | |     |  _  | |
  | |   | | _ _ _     | |     | |   | |
  |_|   |_ _ _ _|     |_|     |_|   |_|`}
                          </pre>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

              {/* ------------------------------------------------------------- */}
              {/* SUB-VIEW 3: OPINIONS                                          */}
              {/* ------------------------------------------------------------- */}
              {moreSubTab === 'opinions' && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start animate-fade-in text-left">
                  {/* Left Column: Essay Directory */}
                  <div className="lg:col-span-4 bg-zinc-950/80 border border-[#00F0FF]/30 p-4 rounded-xl space-y-3 font-mono">
                    <div className="text-[10px] text-[#00F0FF] font-bold tracking-wider border-b border-[#00F0FF]/20 pb-1.5 uppercase">
                      📂 Opinion Essays Matrix
                    </div>
                    <div className="space-y-1.5">
                      {[
                        { title: 'Death of the Quirky Web', tag: 'CREATIVE REBELLION' },
                        { title: 'In Defense of Dither & Low-Fi', tag: 'AESTHETIC ESSAY' },
                        { title: 'The Paradox of AI Slop', tag: 'CURATION VS SLOP' }
                      ].map((item, idx) => (
                        <button
                          key={idx}
                          onClick={() => { playChime('sine', 1.0 + idx * 0.1); setActiveOpinion(idx); }}
                          className={`w-full text-left p-2.5 rounded border transition-all text-xs flex justify-between items-center ${activeOpinion === idx ? 'bg-[#00F0FF]/10 border-[#00F0FF] text-white' : 'bg-black/50 border-zinc-900 text-zinc-400 hover:border-[#00F0FF]/40 hover:text-white'}`}
                        >
                          <div className="space-y-0.5 truncate pr-2">
                            <div className="font-bold uppercase truncate">{item.title}</div>
                            <div className="text-[9px] text-zinc-500">{item.tag}</div>
                          </div>
                          <ChevronRight className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Right Column: Active Essay Content */}
                  <div className="lg:col-span-8 bg-black/90 border border-[#00F0FF]/40 p-6 rounded-xl space-y-4 shadow-[0_0_20px_rgba(0,240,255,0.05)]">
                    {activeOpinion === 0 && (
                       <div className="space-y-4">
                        <div className="flex justify-between items-start border-b border-zinc-900 pb-3 gap-2 flex-wrap">
                          <h3 className="text-xl font-bold font-sans text-[#00F0FF] tracking-wide uppercase">ESSAY_01: The Death of the Quirky Web</h3>
                          <span className="text-[10px] font-mono text-[#00F0FF] bg-[#00F0FF]/10 px-2 py-0.5 border border-[#00F0FF]/20 rounded">ESSAY</span>
                        </div>
                        <div className="text-sm font-sans text-gray-300 leading-relaxed space-y-3.5">
                          <p>
                            Modern web design is dying. Walk across 100 randomly sampled websites today, and they all look the same: slick, white, minimalist, optimized for ad-clicks, and built from the same cookie-cutter UI kits.
                          </p>
                          <p>
                            We have traded the quirky, wild personal homepages of the early internet—the geocities castles, the custom forums, the glowing dither backgrounds—for a corporate monoculture. Websites are no longer environments to explore; they are commercial transactions to navigate.
                          </p>
                          <blockquote className="border-l-2 border-[#00F0FF] pl-3 py-1 italic text-zinc-400 text-xs font-mono">
                            "In an age of uniform, sterile templates, building a highly customized, uncompromised, neon-dithered digital junk spacecraft is a radical act of rebellion."
                          </blockquote>
                          <p>
                            By constructing interactive platforms that reject corporate standardization, we carve out physical spaces for deep digital exploration. **Astral Trash** is designed to feel like an offline hard drive found in a flooded datacenter. It doesn't want your cookies, it doesn't want your email—it just invites you to poke around and experience the math.
                          </p>
                        </div>
                      </div>
                    )}
                    {activeOpinion === 1 && (
                      <div className="space-y-4">
                        <div className="flex justify-between items-start border-b border-zinc-900 pb-3 gap-2 flex-wrap">
                          <h3 className="text-xl font-bold font-sans text-[#00F0FF] tracking-wide uppercase">ESSAY_02: In Defense of Dither and Low-Fidelity</h3>
                          <span className="text-[10px] font-mono text-[#00F0FF] bg-[#00F0FF]/10 px-2 py-0.5 border border-[#00F0FF]/20 rounded">ESSAY</span>
                        </div>
                        <div className="text-sm font-sans text-gray-300 leading-relaxed space-y-3.5">
                          <p>
                            As screen resolutions went from standard VGA to retina 4K, digital art tried to emulate reality. In doing so, it fell into the uncanny valley—smooth, sterile, vector-perfect, and entirely dead.
                          </p>
                          <p>
                            Low-fidelity techniques—like 1-bit dithering, scanlines, and pixel-level constraints—are aesthetically superior. Dither doesn't try to lie to your eyes. It proudly displays its mechanical nature.
                          </p>
                          <blockquote className="border-l-2 border-[#00F0FF] pl-3 py-1 italic text-zinc-400 text-xs font-mono">
                            "Dither is participatory. By leaving gaps, it forces the viewer's visual system to bridge the missing steps."
                          </blockquote>
                          <p>
                            This is why my shaders are intentionally dithered and run through virtual CRT monitor grids. By exposing the grid structure, we create friction. This friction slows down the eyes, prompting a deep, contemplative state of looking rather than the immediate swipe-and-discard behavior of modern social media.
                          </p>
                        </div>
                      </div>
                    )}
                    {activeOpinion === 2 && (
                      <div className="space-y-4">
                        <div className="flex justify-between items-start border-b border-zinc-900 pb-3 gap-2 flex-wrap">
                          <h3 className="text-xl font-bold font-sans text-[#00F0FF] tracking-wide uppercase">ESSAY_03: The Paradox of AI Slop: Curation vs. Generation</h3>
                          <span className="text-[10px] font-mono text-[#00F0FF] bg-[#00F0FF]/10 px-2 py-0.5 border border-[#00F0FF]/20 rounded">ESSAY</span>
                        </div>
                        <div className="text-sm font-sans text-gray-300 leading-relaxed space-y-3.5">
                          <p>
                            We are living in an era of infinite generation. Algorithmic networks generate billions of high-gloss, slick, unearned images and videos every single day. We call it "slop"—not because the technology is poor, but because it has zero creative friction.
                          </p>
                          <p>
                            When generation costs nothing, images lose their soul. Curation, error, corruption, and intentional friction become the only ways for an artist to reclaim meaning.
                          </p>
                          <blockquote className="border-l-2 border-[#00F0FF] pl-3 py-1 italic text-zinc-400 text-xs font-mono">
                            "The role of the modern digital artist is no longer to be a camera, but to be a dither-miner of the machine's debris."
                          </blockquote>
                          <p>
                            In my "AI Slop" and "Shader Slop" experiments, I take raw, generated artifacts, distort them, run them through VCR distortion, dither them down, and embed them in vintage interfaces. By injecting deliberate noise, degradation, and structured creative friction, we purify the slop back into raw, expressive art.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ------------------------------------------------------------- */}
              {/* SUB-VIEW 4: BLOG                                              */}
              {/* ------------------------------------------------------------- */}
              {moreSubTab === 'blog' && (
                <div className="space-y-6 max-w-4xl mx-auto animate-fade-in text-left">
                  <div className="border border-[#39FF14]/30 bg-zinc-950/40 p-3 px-4 rounded-xl flex items-center justify-between font-mono text-[10px] text-zinc-500">
                    <span>📡 SUBSYSTEM_LOG_FEED: ACTIVE</span>
                    <span>TOTAL_ENTRIES: 03</span>
                  </div>

                  {[
                    {
                      id: '0x5C',
                      date: 'JULY 10, 2026',
                      title: 'Physical Acrylics meet WebGL Math',
                      tags: ['PAINTING', 'ANALOG_VS_DIGITAL'],
                      text: "Spent the last week inside my physical painting studio working with holographic and interference acrylic paints on birch panels. Replicating the color shifts of GLSL CMY/Diffusion shaders in physical space is intensely rewarding, yet full of beautiful, physical friction. There is an organic unevenness in the brush's stroke that code cannot perfectly recreate—but at the same time, I catch myself trying to hit Command-Z on the physical canvas. Working towards a hybrid projection system."
                    },
                    {
                      id: '0x5B',
                      date: 'JUNE 21, 2026',
                      title: 'Optimizing Tape Rot for Karaoke Decoders',
                      tags: ['SHADER_MATH', 'OPTIMIZATION'],
                      text: "Spent the weekend refactoring the VHS tape rot shader. Replaced heavy multi-pass Fractal Brownian Motion (FBM) with lightweight 1D noise lookups mapped to sinewave offsets. This allows the dithered tape decay effect to run smoothly at 60fps even on standard mobile phones, keeping the CRT aesthetic alive without boiling user batteries."
                    },
                    {
                      id: '0x5A',
                      date: 'MAY 04, 2026',
                      title: 'Salvaging a Vintage Oscilloscope',
                      tags: ['HARDWARE', 'RECONSTRUCTION'],
                      text: "Salvaged a discarded marine telemetry vector oscilloscope from a local shipyard scrapyard. Wired it up to a custom digital-to-analog converter driven by a Raspberry Pi. Seeing the raw, green vector trails drift across the actual analog phosphor grid is majestic. The subtle, organic phosphor glow cannot be perfectly simulated in GLSL, but it has given me some intense mathematical ideas for my next dithered coordinate system."
                    }
                  ].map((log) => (
                    <div key={log.id} className="border border-zinc-900 bg-black/60 hover:border-[#39FF14]/40 p-6 rounded-xl space-y-4 transition-all">
                      <div className="flex justify-between items-center border-b border-zinc-900 pb-3 flex-wrap gap-2">
                        <div className="space-y-1">
                          <span className="text-[9px] font-mono text-[#39FF14] bg-[#39FF14]/10 border border-[#39FF14]/20 px-2 py-0.5 rounded mr-2">LOG_{log.id}</span>
                          <span className="text-xs font-mono text-zinc-500">{log.date}</span>
                        </div>
                        <div className="flex gap-1.5">
                          {log.tags.map((t) => (
                            <span key={t} className="text-[9px] font-mono bg-zinc-950 border border-zinc-900 text-zinc-400 px-1.5 py-0.5 rounded">{t}</span>
                          ))}
                        </div>
                      </div>
                      <h3 className="text-lg font-bold text-white font-sans uppercase tracking-wide">{log.title}</h3>
                      <p className="text-sm font-sans text-gray-300 leading-relaxed font-normal">{log.text}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* ------------------------------------------------------------- */}
              {/* SUB-VIEW 5: ABOUT_ME (Original Portfolio dossier layout)       */}
              {/* ------------------------------------------------------------- */}
              {moreSubTab === 'about-profile' && (
                <div className="animate-fade-in text-left">
                  <AstralAbout />
                </div>
              )}

            </div>
          )}

          {/* ========================================================================= */}
          {/* SECTION F: SHITTY KARAOKE - CHUNKY CRT AUDIO-VISUAL EXPLOSION              */}
          {/* ========================================================================= */}
          {activeTab === 'karaoke' && (
            <ShittyKaraoke
              playChime={playChime}
              preselectedVideoFileName={karPreselectedFile}
              clearPreselectedVideoFileName={() => setKarPreselectedFile(undefined)}
            />
          )}

          {/* ========================================================================= */}
          {/* SECTION G: PROJECTS TAB - DYNAMIC BENTO-GRID MULTI-LANDING HUBS            */}
          {/* ========================================================================= */}
          {activeTab === 'projects' && (
            <SubProjects playChime={playChime} />
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
              ASTRAL TRASH ♻ an artifact of merrypranxter · designed HTML · no trackers, no frameworks, no shame ·{' '}
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

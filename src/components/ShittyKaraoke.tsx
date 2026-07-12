import { useState, useRef, useEffect } from 'react';
import { Play, Pause, Settings, Plus, Trash2, Sliders, RefreshCw } from 'lucide-react';

interface BucketVideo {
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
    title: 'ASTRAL_GLITCH_CORES_4',
    desc: 'Low-res rendering feedback loops and dither streams',
    fileName: '043cc61ba55647cf9255de096ddcc570.mov',
    duration: '3:40',
    tag: 'GLITCH'
  },
  {
    id: '2',
    title: 'MICROTONAL FEEDBACK COILS',
    desc: 'Vocal pitch variance and tape speed hum experiments',
    fileName: '0ccfabac170d4647ad236b4c3650bde.mov',
    duration: '5:04',
    tag: 'VOX'
  },
  {
    id: '3',
    title: 'DECAYING RESONANCE FLUX',
    desc: 'Ambient CRT scanlines and fluorescent light patterns',
    fileName: '0eb5bbb4779143a6a87e9958421ba6bc.mov',
    duration: '4:12',
    tag: 'LIVE'
  },
  {
    id: '4',
    title: 'ORBITAL STATIC DRIFT',
    desc: 'Handheld tracking shot of cathode ray monitors',
    fileName: '1f3ae0ba040248be93daaa2c71c12c28.mov',
    duration: '2:55',
    tag: 'DITHER'
  },
  {
    id: '5',
    title: 'COGNITIVE NOISE COUPLING',
    desc: 'Purple dithered feedback loop dithered and re-filmed',
    fileName: '283cebcdbfd448babf9dccd5e74bdfda.mov',
    duration: '6:12',
    tag: 'VISUAL'
  },
  {
    id: '6',
    title: 'PHOSPHOR TAPE REEL A',
    desc: 'Shouting into tin cups, microtonal synth distortion',
    fileName: '2fbbc3569943457fbb96d394fd77b5c5.mov',
    duration: '3:18',
    tag: 'VOX'
  },
  {
    id: '7',
    title: 'STARMAKER SEQUENCE V',
    desc: 'Singing with heavy dithered space echo',
    fileName: 'starmaker_3096224821203124.mp4',
    duration: '2:30',
    tag: 'VOX'
  },
  {
    id: '8',
    title: 'DYNAMIC VOID VOX',
    desc: 'Screaming through analog low-pass filters',
    fileName: 'starmaker_3096224821253725.mp4',
    duration: '3:15',
    tag: 'GLITCH'
  },
  {
    id: '9',
    title: 'VINTAGE DEBRIS FINALE',
    desc: 'Deep sub frequencies and fluorescent noise coupling',
    fileName: 'v15044gf0000cvgnad7og65oo0kocv60.mp4',
    duration: '1:45',
    tag: 'NOISE'
  },
  {
    id: '10',
    title: 'MICRO Beats & COILS',
    desc: 'Four-step dither dithered generator testing speed shifts',
    fileName: 'v15044gf0000cvgq3j7og65rq2s9ncs0.mp4',
    duration: '3:05',
    tag: 'BEATS'
  },
  {
    id: '11',
    title: 'FLUORESCENT OSCILLATOR',
    desc: 'Tones under heavy room hum and electrical hum',
    fileName: 'v15044gf0000cvskdknog65sujcql5tg.mp4',
    duration: '2:20',
    tag: 'COILS'
  },
  {
    id: '12',
    title: 'REVERB PORTRAIT FEED',
    desc: 'Corrupted MP4 frame dither sequencing',
    fileName: 'v15044gf0000d0eddb7og65gstnum4n0.mp4',
    duration: '4:02',
    tag: 'VISUAL'
  }
];

interface ShittyKaraokeProps {
  playChime: (type: 'sine' | 'triangle' | 'sawtooth' | 'square', pitchModifier: number) => void;
}

export function ShittyKaraoke({ playChime }: ShittyKaraokeProps) {
  // GCS Bucket state
  const [bucketName, setBucketName] = useState<string>(() => {
    return localStorage.getItem('astraltrash_karaoke_bucket_name') || 'astraltrash_karaoke';
  });

  const [videos, setVideos] = useState<BucketVideo[]>(() => {
    try {
      const saved = localStorage.getItem('astraltrash_karaoke_bucket_videos');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // If any video fileName does not contain '.' (old legacy mocks did not have extensions like .mov or .mp4), ignore cache
          const hasOldMocks = parsed.some(v => !v.fileName.includes('.') && !v.fileName.startsWith('http'));
          if (!hasOldMocks) {
            return parsed;
          }
        }
      }
    } catch (_) {}
    return defaultBucketVideos;
  });

  const [selectedVideo, setSelectedVideo] = useState<BucketVideo>(() => {
    return videos[0] || defaultBucketVideos[0];
  });

  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    'VCR_OS // INITIALIZED...',
    'ASTRAL_KARAOKE DECK_B READ: SUCCESS',
    'STATUS: READY TO SPIN RETRO COILS'
  ]);

  const [isEditingDeck, setIsEditingDeck] = useState<boolean>(false);
  const [editingVideoId, setEditingVideoId] = useState<string | null>(null);

  // Edit fields
  const [editTitle, setEditTitle] = useState('');
  const [editFileName, setEditFileName] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [editDuration, setEditDuration] = useState('');
  const [editTag, setEditTag] = useState('');

  const videoRef = useRef<HTMLVideoElement | null>(null);

  const addLog = (msg: string) => {
    setTerminalLogs(prev => [...prev.slice(-15), `[${new Date().toLocaleTimeString()}] ${msg}`]);
  };

  const getResolvedUrl = (fileName: string) => {
    if (fileName.startsWith('http://') || fileName.startsWith('https://')) {
      return fileName;
    }
    return `https://storage.googleapis.com/${bucketName}/${fileName}`;
  };

  // Sync state to selected video
  const activeUrl = getResolvedUrl(selectedVideo.fileName);

  const handlePlayPause = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
      addLog('VCR_STOP: TAPE STANDBY');
      playChime('square', 0.8);
    } else {
      videoRef.current.play().catch(err => {
        addLog(`PLAY_ERROR: ${err.message}. Raw codec may require a new tab or direct download.`);
      });
      setIsPlaying(true);
      addLog(`VCR_PLAY: SPINNING COILS [${selectedVideo.title}]`);
      playChime('triangle', 1.2);
    }
  };

  const loadTape = (video: BucketVideo) => {
    setSelectedVideo(video);
    setIsPlaying(false);
    addLog(`VCR_LOAD_TAPE: ${video.title} // OBJECT: ${video.fileName}`);
    playChime('triangle', 1.5);
    
    // Auto play after small timeout
    setTimeout(() => {
      if (videoRef.current) {
        videoRef.current.load();
        videoRef.current.play()
          .then(() => {
            setIsPlaying(true);
            addLog(`VCR_AUTOPLAY: Success`);
          })
          .catch(() => {
            addLog(`AUTOPLAY_PAUSED: Click play to start.`);
          });
      }
    }, 150);
  };

  const startEditing = (video: BucketVideo) => {
    setEditingVideoId(video.id);
    setEditTitle(video.title);
    setEditFileName(video.fileName);
    setEditDesc(video.desc);
    setEditDuration(video.duration || '0:00');
    setEditTag(video.tag || 'VOX');
    playChime('triangle', 1.0);
  };

  const saveEdit = () => {
    if (!editingVideoId) return;
    const updated = videos.map(v => {
      if (v.id === editingVideoId) {
        return {
          ...v,
          title: editTitle,
          fileName: editFileName,
          desc: editDesc,
          duration: editDuration,
          tag: editTag
        };
      }
      return v;
    });
    setVideos(updated);
    localStorage.setItem('astraltrash_karaoke_bucket_videos', JSON.stringify(updated));
    setEditingVideoId(null);
    addLog(`LABEL_UPDATE: Saved stickers for tape ID ${editingVideoId}`);
    playChime('sine', 1.2);

    // If edited active video, update selection
    const newlyEdited = updated.find(v => v.id === selectedVideo.id);
    if (newlyEdited) setSelectedVideo(newlyEdited);
  };

  const deleteVideo = (id: string) => {
    if (window.confirm('Discard this cassette tape?')) {
      const updated = videos.filter(v => v.id !== id);
      setVideos(updated);
      localStorage.setItem('astraltrash_karaoke_bucket_videos', JSON.stringify(updated));
      addLog('DISCARD_TAPE: Cassette discarded');
      playChime('square', 0.6);
      if (selectedVideo.id === id && updated.length > 0) {
        setSelectedVideo(updated[0]);
      }
    }
  };

  const createVideo = () => {
    const nextId = String(Date.now());
    const newTape: BucketVideo = {
      id: nextId,
      title: `COIL_RECORD_${videos.length + 1}`,
      desc: 'raw microtonal recording',
      fileName: '043cc61ba55647cf9255de096ddca3b0',
      duration: '3:00',
      tag: 'VOX'
    };
    const updated = [...videos, newTape];
    setVideos(updated);
    localStorage.setItem('astraltrash_karaoke_bucket_videos', JSON.stringify(updated));
    startEditing(newTape);
    addLog('MANIFEST_TAPE: Formed raw magnetic cassette tape.');
  };

  const moveTape = (index: number, direction: 'left' | 'right') => {
    const targetIdx = direction === 'left' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= videos.length) return;
    const updated = [...videos];
    const temp = updated[index];
    updated[index] = updated[targetIdx];
    updated[targetIdx] = temp;
    setVideos(updated);
    localStorage.setItem('astraltrash_karaoke_bucket_videos', JSON.stringify(updated));
    playChime('triangle', 0.9);
  };

  const handleReset = () => {
    if (window.confirm('Reset the VHS rack back to factory default?')) {
      localStorage.removeItem('astraltrash_karaoke_bucket_videos');
      localStorage.removeItem('astraltrash_karaoke_bucket_name');
      setBucketName('astraltrash_karaoke');
      setVideos(defaultBucketVideos);
      setSelectedVideo(defaultBucketVideos[0]);
      setIsEditingDeck(false);
      setEditingVideoId(null);
      addLog('FACTORY_RESET: Shelf restored');
      playChime('square', 1.5);
    }
  };

  return (
    <div className="frame py-8 animate-fade-in space-y-8" id="karaoke-mainframe">
      {/* Title Banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-[#FF6B00]/40 pb-4 mb-2 gap-3">
        <div>
          <h2 
            className="text-3xl md:text-4xl font-extrabold font-sans text-white tracking-wider uppercase"
            style={{
              textShadow: '0 0 8px #FF6B00, 0 0 35px rgba(255,107,0,0.4)',
              fontFamily: "'Chakra Petch', sans-serif"
            }}
          >
            📼 MERRY'S KARAOKE VHS DECK
          </h2>
          <p className="text-xs text-[#FF6B00] font-mono mt-1.5 uppercase tracking-widest">
            A Clean Archive of raw audio and recording clips straight from Google Storage
          </p>
        </div>
        <div className="bg-black/60 border border-[#FF6B00]/40 px-3 py-1 font-mono text-[10px] text-[#FF6B00] uppercase tracking-widest">
          VCR MODEM: ACTIVE
        </div>
      </div>

      {/* Grid: Player Area (Left) & Current Case Details (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* TV CRT Screen Box */}
        <div className="lg:col-span-8 space-y-4">
          <div className="relative border-4 border-zinc-900 bg-black shadow-[0_0_35px_rgba(255,107,0,0.15)] p-2 rounded-2xl overflow-hidden aspect-[16/10] flex flex-col justify-between">
            {/* Ambient Scanline Filter */}
            <div className="absolute inset-0 pointer-events-none z-10 bg-scanlines opacity-10" />
            
            {/* TV Screen Heading HUD */}
            <div className="flex justify-between items-center text-[10px] font-mono text-zinc-400 p-2 border-b border-zinc-950 bg-[#050505]/80 z-20">
              <div className="flex items-center gap-1.5">
                <span className="text-[#FF6B00] animate-pulse">● PLAY_MONITOR</span>
                <span className="text-zinc-600">|</span>
                <span className="text-zinc-300">GCS_SOURCE: {bucketName}</span>
              </div>
              <div className="text-right text-[#39FF14]">
                {isPlaying ? '📼 PLAYING' : '📼 STANDBY'}
              </div>
            </div>

            {/* Main Video Element */}
            <div className="flex-grow bg-black relative flex items-center justify-center overflow-hidden">
              <video
                ref={videoRef}
                src={activeUrl}
                controls
                className="w-full h-full object-contain z-10"
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
              />
              
              {!isPlaying && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 backdrop-blur-sm pointer-events-none z-0">
                  <div className="font-mono text-[11px] text-[#FF6B00] tracking-widest uppercase mb-1">
                    [ SLOTTED: {selectedVideo.title} ]
                  </div>
                  <div className="text-[10px] text-zinc-500 font-mono">
                    Press Play below or inside screen to spin tape
                  </div>
                </div>
              )}
            </div>

            {/* TV Bezel Control Strip */}
            <div className="flex items-center justify-between border-t border-zinc-950 p-2.5 bg-[#030303] z-20">
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePlayPause}
                  className={`px-4 py-1 text-xs font-mono font-bold border transition-all flex items-center gap-1.5 ${
                    isPlaying 
                      ? 'bg-[#FF2BD6] text-black border-[#FF2BD6]' 
                      : 'bg-black text-[#39FF14] border-[#39FF14]/40 hover:border-[#39FF14] hover:bg-[#39FF14]/10'
                  }`}
                >
                  {isPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                  <span>{isPlaying ? 'STOP TAPE' : 'SPIN TAPE'}</span>
                </button>
              </div>

              {/* External Fallbacks (EXTREMELY IMPORTANT FOR BROWSERS WITHOUT QUICKTIME CODECS) */}
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    playChime('triangle', 1.0);
                    window.open(activeUrl, '_blank');
                  }}
                  className="px-2.5 py-1 bg-black border border-zinc-850 hover:border-zinc-600 text-zinc-300 hover:text-white font-mono text-[10px] uppercase transition-all flex items-center gap-1"
                >
                  🔗 Open Raw Video
                </button>
                <a
                  href={activeUrl}
                  download
                  className="px-2.5 py-1 bg-black border border-zinc-850 hover:border-zinc-600 text-zinc-300 hover:text-white font-mono text-[10px] uppercase transition-all flex items-center gap-1"
                >
                  📥 Download Video
                </a>
              </div>
            </div>
          </div>

          <div className="bg-zinc-950 border border-zinc-900 p-3.5 rounded-lg space-y-1">
            <h4 className="text-xs font-mono text-zinc-400 uppercase tracking-widest font-semibold">💡 Browser Compatibility Notice</h4>
            <p className="text-[10px] text-zinc-500 leading-normal">
              Some karaoke videos are exported in standard Apple QuickTime format. If the video player screen above displays a black screen or shows a decoder error, simply click the <span className="text-[#FF6B00]">"Open Raw Video"</span> button to launch the file directly in a browser tab, or <span className="text-[#FF6B00]">"Download Video"</span> to play it with VLC.
            </p>
          </div>
        </div>

        {/* Right Sidebar: Active Cassette Sleeve & Metadata */}
        <div className="lg:col-span-4 flex flex-col justify-between">
          <div className="border border-zinc-900 bg-[#050505] p-5 rounded-xl space-y-4">
            <div className="flex justify-between items-center border-b border-zinc-900 pb-2">
              <span className="text-[10px] font-mono text-zinc-500 uppercase">ACTIVE_CASSETTE_SLEEVE</span>
              <span className="text-xs font-mono font-bold text-[#FF6B00] bg-[#FF6B00]/10 px-2 py-0.5 rounded border border-[#FF6B00]/20">
                {selectedVideo.tag || 'VOX'}
              </span>
            </div>

            <div className="space-y-3">
              <div className="font-mono text-[10px] text-zinc-500 uppercase">TITLE sticker label:</div>
              <h3 className="text-lg font-black text-white uppercase tracking-wider font-sans leading-tight border-b border-dashed border-zinc-900 pb-2">
                {selectedVideo.title}
              </h3>

              <div className="font-mono text-[10px] text-zinc-500 uppercase">FILE name:</div>
              <div className="bg-black border border-zinc-950 p-2 font-mono text-[11px] text-zinc-400 break-all select-all">
                {selectedVideo.fileName}
              </div>

              <div className="font-mono text-[10px] text-zinc-500 uppercase">SLEEVE credits:</div>
              <p className="text-xs text-zinc-400 leading-relaxed font-mono">
                {selectedVideo.desc}
              </p>

              <div className="flex justify-between items-center pt-2 border-t border-zinc-950 font-mono text-xs">
                <span className="text-zinc-600">EST_DURATION:</span>
                <span className="text-zinc-300 font-bold">{selectedVideo.duration || '0:00'}</span>
              </div>
            </div>
          </div>

          {/* Quick instructions block */}
          <div className="mt-4 border border-zinc-900 bg-black/40 p-4 rounded-xl">
            <h4 className="text-[11px] font-mono text-zinc-400 uppercase tracking-widest mb-1.5 font-bold">📼 How to spin video cassettes</h4>
            <ol className="text-[10px] text-zinc-500 font-mono space-y-1 list-decimal list-inside">
              <li>Select any magnetic VHS cassette from the shelf below.</li>
              <li>Click <span className="text-[#39FF14]">LOAD CASSETTE</span> to slot it in.</li>
              <li>The tape will load and play inside the monitor.</li>
              <li>Click configure below to rename or re-label your videos.</li>
            </ol>
          </div>
        </div>
      </div>

      {/* VHS TAPE SHELF */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-zinc-900 pb-3 gap-3">
          <div>
            <h3 className="text-lg font-bold text-white uppercase tracking-wider flex items-center gap-2">
              📼 THE MAGNETIC VIDEO RACK // SHELF
            </h3>
            <p className="text-[10px] text-zinc-500 font-mono uppercase mt-1">
              Hand-written magnetic cassette tapes. Drag, reorder, or edit sticker details on the fly.
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => {
                setIsEditingDeck(!isEditingDeck);
                setEditingVideoId(null);
                playChime('triangle', 1.0);
              }}
              className={`px-3 py-1 text-xs font-mono border transition-all uppercase tracking-wider ${
                isEditingDeck
                  ? 'bg-[#FF2BD6] text-black border-[#FF2BD6]'
                  : 'bg-black text-[#FF6B00] border-[#FF6B00]/40 hover:border-[#FF6B00] hover:bg-[#FF6B00]/10'
              }`}
            >
              ⚙ {isEditingDeck ? 'CLOSE LABELLER' : 'LABEL CONSOLE'}
            </button>

            <button
              onClick={createVideo}
              className="px-3 py-1 text-xs font-mono border bg-black text-[#39FF14] border-[#39FF14]/40 hover:border-[#39FF14] hover:bg-[#39FF14]/10 uppercase tracking-wider flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>MANIFEST TAPE</span>
            </button>
          </div>
        </div>

        {/* LABELLER MODAL PANEL */}
        {isEditingDeck && (
          <div className="border border-dashed border-[#FF6B00]/60 bg-black/95 p-5 rounded-xl font-mono space-y-4 text-xs animate-glow">
            <div className="flex justify-between items-center border-b border-zinc-900 pb-2">
              <span className="text-xs font-bold text-[#FF6B00] uppercase tracking-widest">⚡ VCR CABINET MODEM / CONSOLE</span>
              <button
                onClick={handleReset}
                className="text-[10px] text-zinc-500 hover:text-red-400 border border-zinc-900 hover:border-red-500/30 px-2 py-0.5 bg-black transition-all uppercase"
              >
                🔄 FACTORY_RESET SHELF
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] text-zinc-400 block uppercase">📡 GCS Storage Bucket Name</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={bucketName}
                    onChange={(e) => {
                      setBucketName(e.target.value);
                      localStorage.setItem('astraltrash_karaoke_bucket_name', e.target.value);
                    }}
                    className="flex-grow bg-zinc-950 border border-zinc-900 text-white px-3 py-1.5 outline-none focus:border-[#FF6B00] font-mono text-xs rounded"
                  />
                  <button
                    onClick={() => {
                      addLog(`BUCKET_SCAN: Connected to bucket [${bucketName}]`);
                      playChime('sine', 1.0);
                    }}
                    className="bg-zinc-900 border border-zinc-800 hover:border-zinc-750 text-white px-3 py-1.5"
                  >
                    SYNC
                  </button>
                </div>
                <span className="text-[9px] text-zinc-600 block leading-tight">
                  Default bucket is <span className="text-zinc-400">astraltrash_karaoke</span>. Set to yours to stream files directly. Make sure your bucket's permissions include public read capability so the browser can play files!
                </span>
              </div>

              <div className="bg-zinc-950 p-3 rounded border border-zinc-900 space-y-1">
                <h5 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">🔒 Google Bucket Permission Setup</h5>
                <p className="text-[9px] text-zinc-500 leading-normal">
                  To view videos, run this command in your Google Cloud Console terminal to make files readable to the web app:
                </p>
                <div className="bg-black p-2 rounded text-[10px] text-[#39FF14] font-mono select-all break-all border border-zinc-950">
                  gcloud storage buckets add-iam-policy-binding gs://astraltrash_karaoke --member=allUsers --role=roles/storage.objectViewer
                </div>
              </div>
            </div>

            {/* Editing Slot Panel */}
            {editingVideoId && (
              <div className="border border-zinc-850 bg-[#080808] p-4 rounded-lg mt-4 space-y-3 animate-fade-in">
                <div className="flex justify-between items-center text-[10px] text-[#FF2BD6] border-b border-zinc-900 pb-1.5 uppercase font-bold tracking-wider">
                  <span>🖋 Editing Tape Sticker Labels (ID: {editingVideoId})</span>
                  <button onClick={() => setEditingVideoId(null)} className="text-zinc-500 hover:text-white font-sans text-sm">✕</button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5">
                  <div className="md:col-span-4">
                    <label className="text-[9px] text-zinc-500 block mb-1">SONG TITLE / STICKER LABEL</label>
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-850 p-2 text-white text-xs rounded outline-none focus:border-[#FF2BD6]"
                    />
                  </div>

                  <div className="md:col-span-5">
                    <label className="text-[9px] text-zinc-500 block mb-1">GCS FILENAME / OBJECT PATH / URL</label>
                    <input
                      type="text"
                      value={editFileName}
                      onChange={(e) => setEditFileName(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-850 p-2 text-white text-xs rounded outline-none focus:border-[#FF2BD6]"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="text-[9px] text-zinc-500 block mb-1">DURATION</label>
                    <input
                      type="text"
                      value={editDuration}
                      onChange={(e) => setEditDuration(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-850 p-2 text-white text-xs rounded outline-none focus:border-[#FF2BD6] text-center"
                    />
                  </div>

                  <div className="md:col-span-1">
                    <label className="text-[9px] text-zinc-500 block mb-1">TAG</label>
                    <input
                      type="text"
                      value={editTag}
                      onChange={(e) => setEditTag(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-850 p-2 text-white text-xs rounded outline-none focus:border-[#FF2BD6] text-center"
                    />
                  </div>

                  <div className="md:col-span-12">
                    <label className="text-[9px] text-zinc-500 block mb-1">SLEEVE DESCRIPTION / CREDITS / NOTES</label>
                    <textarea
                      value={editDesc}
                      rows={1.5}
                      onChange={(e) => setEditDesc(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-850 p-2 text-white text-xs rounded outline-none focus:border-[#FF2BD6] resize-none"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-zinc-950">
                  <button
                    onClick={() => setEditingVideoId(null)}
                    className="bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white px-3 py-1 rounded"
                  >
                    CANCEL
                  </button>
                  <button
                    onClick={saveEdit}
                    className="bg-[#FF2BD6] hover:bg-[#FF2BD6]/80 text-black font-bold px-4 py-1 rounded"
                  >
                    SAVE CHANGES
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* RACK VHS GRID LAYOUT */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
          {videos.map((item, index) => {
            const isCurrent = selectedVideo.id === item.id;
            return (
              <div
                key={item.id}
                className={`group border relative transition-all rounded-lg overflow-hidden flex flex-col justify-between ${
                  isCurrent
                    ? 'border-[#39FF14] bg-[#39FF14]/5 shadow-[0_0_15px_rgba(57,255,20,0.12)]'
                    : 'border-zinc-900 bg-black/60 hover:border-zinc-700 hover:bg-black/80'
                }`}
              >
                {/* Visual cassette top labels */}
                <div className="p-3 space-y-2">
                  <div className="flex justify-between items-center text-[9px] font-mono">
                    <span className="text-zinc-500 font-semibold tracking-wider">VHS_C_30</span>
                    <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold ${
                      isCurrent ? 'bg-[#39FF14]/20 text-[#39FF14]' : 'bg-zinc-900 text-zinc-400'
                    }`}>
                      {item.tag || 'VOX'}
                    </span>
                  </div>

                  {/* Real Video Thumbnail Art */}
                  <div className="aspect-[16/10] bg-zinc-950 border border-zinc-900 rounded relative overflow-hidden flex items-center justify-center group-hover:border-zinc-700 transition-all">
                    <video
                      src={getResolvedUrl(item.fileName)}
                      preload="metadata"
                      playsInline
                      muted
                      loop
                      className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity"
                      onMouseEnter={(e) => {
                        e.currentTarget.play().catch(() => {});
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.pause();
                        e.currentTarget.currentTime = 0;
                      }}
                    />
                    
                    {/* Tiny cassette tape reels on top corner for that retro mechanical dither flavor */}
                    <div className="absolute top-1 left-1.5 flex gap-1 items-center bg-black/75 px-1 py-0.5 rounded border border-zinc-900 text-[6px] text-zinc-500 font-mono tracking-tighter">
                      <div className={`w-1.5 h-1.5 rounded-full border border-zinc-700 ${
                        isCurrent && isPlaying ? 'animate-spin' : ''
                      }`} style={{ animationDuration: '3s' }} />
                      <div className={`w-1.5 h-1.5 rounded-full border border-zinc-700 ${
                        isCurrent && isPlaying ? 'animate-spin' : ''
                      }`} style={{ animationDuration: '3s' }} />
                      <span>REEL</span>
                    </div>

                    {/* Scanning CRT Grid Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent h-[150%] pointer-events-none opacity-25" />
                  </div>

                  {/* Handwritten label sticker */}
                  <div className="bg-zinc-100 border border-zinc-200 text-zinc-950 p-2 font-mono text-[11px] leading-tight select-none rotate-[-0.5deg] shadow-[1px_2px_4px_rgba(0,0,0,0.15)]">
                    <div className="font-bold uppercase tracking-wider truncate mb-0.5">
                      {item.title}
                    </div>
                    <div className="text-[9px] text-zinc-500 flex justify-between">
                      <span>STILL: {item.duration || '0:00'}</span>
                      <span className="opacity-60"># {index + 1}</span>
                    </div>
                  </div>
                </div>

                {/* Cassette Action Controls */}
                <div className="p-2 border-t border-zinc-950 bg-black/40 space-y-1.5">
                  <div className="flex gap-1">
                    <button
                      onClick={() => loadTape(item)}
                      className={`flex-grow py-1 px-2 border text-[10px] uppercase font-mono font-bold transition-all flex items-center justify-center gap-1 ${
                        isCurrent
                          ? 'bg-[#39FF14] text-black border-[#39FF14]'
                          : 'bg-black text-[#39FF14] border-[#39FF14]/40 hover:border-[#39FF14] hover:bg-[#39FF14]/10'
                      }`}
                    >
                      <span>{isCurrent ? 'SLOTTED' : 'LOAD TAPE'}</span>
                    </button>

                    <button
                      onClick={() => startEditing(item)}
                      className="p-1 border border-zinc-900 hover:border-zinc-700 hover:text-white bg-black/80 transition-all rounded text-zinc-400"
                      title="Edit labels"
                    >
                      <Settings className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => deleteVideo(item.id)}
                      className="p-1 border border-zinc-900 hover:border-red-500 hover:text-red-400 bg-black/80 transition-all rounded text-zinc-500"
                      title="Discard cassette"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Move arrow buttons */}
                  <div className="flex justify-between gap-1 text-[9px] font-mono">
                    <button
                      disabled={index === 0}
                      onClick={() => moveTape(index, 'left')}
                      className={`px-1 py-0.5 border flex-grow text-center transition-all ${
                        index === 0
                          ? 'border-zinc-950 text-zinc-800 cursor-not-allowed'
                          : 'border-zinc-900 hover:border-zinc-700 text-zinc-500 hover:text-zinc-300'
                      }`}
                    >
                      ◀ MOVE LEFT
                    </button>
                    <button
                      disabled={index === videos.length - 1}
                      onClick={() => moveTape(index, 'right')}
                      className={`px-1 py-0.5 border flex-grow text-center transition-all ${
                        index === videos.length - 1
                          ? 'border-zinc-950 text-zinc-800 cursor-not-allowed'
                          : 'border-zinc-900 hover:border-zinc-700 text-zinc-500 hover:text-zinc-300'
                      }`}
                    >
                      MOVE RIGHT ▶
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Terminal logs */}
      <div className="col-span-12">
        <div className="bg-[#020202] border border-zinc-950 p-4 font-mono text-[10px] text-[#FF6B00] space-y-1 max-h-[140px] overflow-y-auto rounded-lg">
          <div className="text-zinc-500 text-[9px] uppercase border-b border-zinc-900 pb-1 mb-2 tracking-widest flex justify-between">
            <span>KARAOKE_VCR_MODEM_LOGS</span>
            <span className="animate-ping">●</span>
          </div>
          {terminalLogs.map((line, idx) => (
            <div key={idx} className="truncate">{line}</div>
          ))}
        </div>
      </div>
    </div>
  );
}

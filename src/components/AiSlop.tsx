import React, { useState, useEffect, useRef } from 'react';
import { 
  Film, 
  Image as ImageIcon, 
  Bot, 
  Sparkles, 
  RefreshCw, 
  Play, 
  Pause, 
  ExternalLink, 
  ChevronRight, 
  ChevronLeft,
  Maximize2, 
  Monitor, 
  Cpu, 
  Trash2,
  ListFilter
} from 'lucide-react';

interface BucketItem {
  id: string;
  title: string;
  fileName: string;
  desc: string;
  size: string;
  tag: string;
  type: 'video' | 'image';
}

interface AiSlopProps {
  playChime: (type?: 'sine' | 'square' | 'triangle', pitchScaler?: number) => void;
  rawPrompt: string;
  setRawPrompt: (val: string) => void;
  corruptedPrompt: string;
  setCorruptedPrompt: (val: string) => void;
  isCorrupting: boolean;
  handleCorruptPrompt: () => void;
  slopMetric: number;
  aiLogs: string[];
}

export default function AiSlop({
  playChime,
  rawPrompt,
  setRawPrompt,
  corruptedPrompt,
  setCorruptedPrompt,
  isCorrupting,
  handleCorruptPrompt,
  slopMetric,
  aiLogs
}: AiSlopProps) {
  const bucketName = 'astraltrash_aislop';
  const [items, setItems] = useState<BucketItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<BucketItem | null>(null);
  const [activeGroup, setActiveGroup] = useState<'video' | 'image'>('video');
  const [isScanning, setIsScanning] = useState<boolean>(false);
  
  // Customization States
  const [aspectRatio, setAspectRatio] = useState<'9:16' | '16:9' | '1:1' | '4:3'>('9:16');
  const [resolution, setResolution] = useState<'480p' | '720p' | '1080p' | 'raw'>('720p');
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  // Terminal & Logs state
  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    'TENSORTRANTRUM_V1 // KERNEL RUNTIME: ACTIVE',
    'SLOP_MONITOR: Listening for GCS cloud signal...',
    'READY FOR SYNAPSES TRANSFER'
  ]);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const carouselRef = useRef<HTMLDivElement | null>(null);

  const scrollCarousel = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const scrollAmount = 400;
      carouselRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const addLog = (msg: string) => {
    setTerminalLogs(prev => [...prev.slice(-12), `[${new Date().toLocaleTimeString()}] ${msg}`]);
  };

  const getResolvedUrl = (fileName: string) => {
    return `https://storage.googleapis.com/${bucketName}/${fileName}`;
  };

  // Helper to extract clean titles from filenames
  const formatSlopTitle = (fileName: string): string => {
    const withoutExt = fileName.substring(0, fileName.lastIndexOf('.')) || fileName;
    return withoutExt
      .replace(/[\s_\(\)-]+/g, ' ')
      .trim()
      .replace(/\b\w/g, c => c.toUpperCase());
  };

  // Scan GCS bucket on mount
  useEffect(() => {
    let active = true;
    const scanSlopBucket = async () => {
      setIsScanning(true);
      addLog(`RESOLVING_BUCKET: Fetching files from [gs://${bucketName}]...`);
      try {
        let foundItems: BucketItem[] = [];
        let fetchedSuccess = false;

        try {
          // Try standard XML API first
          const response = await fetch(`https://storage.googleapis.com/${bucketName}`);
          if (response.ok) {
            const xmlText = await response.text();
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
            const contentsNodes = xmlDoc.getElementsByTagName('Contents');
            
            for (let i = 0; i < contentsNodes.length; i++) {
              const keyNode = contentsNodes[i].getElementsByTagName('Key')[0];
              const sizeNode = contentsNodes[i].getElementsByTagName('Size')[0];
              
              if (keyNode && keyNode.textContent) {
                const key = keyNode.textContent;
                const bytes = sizeNode && sizeNode.textContent ? parseInt(sizeNode.textContent) : 0;
                const sizeString = bytes > 1024 * 1024 
                  ? `${(bytes / (1024 * 1024)).toFixed(1)} MB`
                  : `${(bytes / 1024).toFixed(0)} KB`;
                
                let type: 'video' | 'image' | null = null;
                let tag = 'RAW';

                if (key.match(/\.(mov|mp4|avi|mpeg|mpg|wmv|webm)$/i)) {
                  type = 'video';
                  tag = 'SLOP_CLIP';
                } else if (key.match(/\.(jpg|jpeg|png|gif|webp|bmp|svg)$/i)) {
                  type = 'image';
                  tag = 'SLOP_IMG';
                }

                if (type) {
                  const baseTitle = formatSlopTitle(key);
                  foundItems.push({
                    id: `slop-${i}-${key.substring(0, 6)}`,
                    title: baseTitle,
                    fileName: key,
                    desc: `Artifact compiled under index: "${baseTitle}"`,
                    size: sizeString,
                    tag: tag,
                    type: type
                  });
                }
              }
            }
            fetchedSuccess = true;
          } else {
            throw new Error(`HTTP XML status ${response.status}`);
          }
        } catch (xmlErr) {
          addLog(`RESOLVING_BUCKET: XML connection blocked/CORS error. Switching to JSON API proxy fallback...`);
          try {
            const response = await fetch(`https://storage.googleapis.com/storage/v1/b/${bucketName}/o`);
            if (response.ok) {
              const data = await response.json();
              const itemsList = data.items || [];
              itemsList.forEach((item: any, idx: number) => {
                const key = item.name;
                if (!key) return;
                const bytes = parseInt(item.size) || 0;
                const sizeString = bytes > 1024 * 1024 
                  ? `${(bytes / (1024 * 1024)).toFixed(1)} MB`
                  : `${(bytes / 1024).toFixed(0)} KB`;
                
                let type: 'video' | 'image' | null = null;
                let tag = 'RAW';

                if (key.match(/\.(mov|mp4|avi|mpeg|mpg|wmv|webm)$/i)) {
                  type = 'video';
                  tag = 'SLOP_CLIP';
                } else if (key.match(/\.(jpg|jpeg|png|gif|webp|bmp|svg)$/i)) {
                  type = 'image';
                  tag = 'SLOP_IMG';
                }

                if (type) {
                  const baseTitle = formatSlopTitle(key);
                  foundItems.push({
                    id: `slop-${idx}-${key.substring(0, 6)}`,
                    title: baseTitle,
                    fileName: key,
                    desc: `Artifact compiled under index: "${baseTitle}"`,
                    size: sizeString,
                    tag: tag,
                    type: type
                  });
                }
              });
              fetchedSuccess = true;
            } else {
              throw new Error(`HTTP JSON status ${response.status}`);
            }
          } catch (jsonErr: any) {
            throw new Error(`Both XML & JSON API listing fell back: ${jsonErr.message}`);
          }
        }

        if (!active) return;

        if (foundItems.length === 0) {
          addLog(`SCAN_WARN: No matching images or videos found in bucket.`);
          // Load cool fallback files so the app remains gorgeous and fully functional even if empty!
          const mockFallbacks: BucketItem[] = [
            {
              id: 'mock-1',
              title: 'cybernetic_over_fitted_debris',
              fileName: 'cybernetic_debris_916.mp4',
              desc: '9:16 portrait of floating motherboard ruins dithered live.',
              size: '1.4 MB',
              tag: '9:16 VIDEO',
              type: 'video'
            },
            {
              id: 'mock-2',
              title: 'analog_circuit_leak_hallucination',
              fileName: 'analog_circuit_916.png',
              desc: '9:16 high contrast sacred grid portrait leaked from stable matrices.',
              size: '420 KB',
              tag: '9:16 IMAGE',
              type: 'image'
            }
          ];
          setItems(mockFallbacks);
          setSelectedItem(mockFallbacks[0]);
          return;
        }

        addLog(`SCAN_SUCCESS: Discovered ${foundItems.length} orbital artifacts. Curating feeds...`);
        setItems(foundItems);

        // Sort out default selected items
        const defaultVideo = foundItems.find(item => item.type === 'video');
        const defaultImage = foundItems.find(item => item.type === 'image');
        setSelectedItem(defaultVideo || defaultImage || foundItems[0]);

        if (defaultVideo) {
          setActiveGroup('video');
        } else if (defaultImage) {
          setActiveGroup('image');
        }

      } catch (err: any) {
        addLog(`SCAN_ERROR: Could not query public storage index (${err.message})`);
        // Use beautiful default fallback items
        const mockFallbacks: BucketItem[] = [
          {
            id: 'mock-1',
            title: 'cybernetic_over_fitted_debris',
            fileName: 'cybernetic_debris_916.mp4',
            desc: '9:16 portrait of floating motherboard ruins dithered live.',
            size: '1.4 MB',
            tag: '9:16 VIDEO',
            type: 'video'
          },
          {
            id: 'mock-2',
            title: 'analog_circuit_leak_hallucination',
            fileName: 'analog_circuit_916.png',
            desc: '9:16 high contrast sacred grid portrait leaked from stable matrices.',
            size: '420 KB',
            tag: '9:16 IMAGE',
            type: 'image'
          }
        ];
        if (active) {
          setItems(mockFallbacks);
          setSelectedItem(mockFallbacks[0]);
        }
      } finally {
        if (active) {
          setIsScanning(false);
        }
      }
    };

    scanSlopBucket();
    return () => {
      active = false;
    };
  }, [bucketName]);

  // Video play state sync
  useEffect(() => {
    if (selectedItem?.type !== 'video' || !videoRef.current) return;
    if (isPlaying) {
      videoRef.current.play().catch(() => setIsPlaying(false));
    } else {
      videoRef.current.pause();
    }
  }, [isPlaying, selectedItem]);

  // Handle items click
  const handleItemSelect = (item: BucketItem) => {
    playChime('triangle', 1.3);
    setSelectedItem(item);
    setIsPlaying(item.type === 'video'); // autoplay videos on click
    addLog(`LOAD_TAPE: Loaded [${item.fileName}] into CRT matrix slot.`);
  };

  const getAspectClass = () => {
    switch (aspectRatio) {
      case '9:16': return 'aspect-[9/16] max-w-[340px]';
      case '16:9': return 'aspect-[16/9] max-w-[600px]';
      case '1:1': return 'aspect-square max-w-[450px]';
      case '4:3': return 'aspect-[4/3] max-w-[480px]';
    }
  };

  const getResolutionWidth = () => {
    if (resolution === 'raw') return undefined;
    if (resolution === '480p') return 480;
    if (resolution === '720p') return 720;
    if (resolution === '1080p') return 1080;
    return undefined;
  };

  const filteredItems = items.filter(i => i.type === activeGroup);

  return (
    <div className="frame py-8 animate-fade-in space-y-8" id="aislop-mainframe">
      {/* Title Banner */}
      <div className="border-b border-[#00F0FF]/40 pb-6 mb-2 space-y-4">
        {/* Top Status Row */}
        <div className="flex justify-between items-center text-xs">
          <div className="flex items-center gap-1.5 font-mono text-[10px] text-[#39FF14]">
            {isScanning ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>GCS LIST SCANNING...</span>
              </>
            ) : (
              <span className="text-zinc-600">NEURAL FEED STANDBY</span>
            )}
          </div>
          <div className="bg-black/60 border border-[#00F0FF]/40 px-3 py-1 font-mono text-[10px] text-[#00F0FF] uppercase tracking-widest">
            AI COGNITIVE RATIO: {slopMetric}%
          </div>
        </div>

        {/* Centered Main Header */}
        <div className="text-center space-y-3">
          <h1 
            className="text-center uppercase select-none"
            style={{
              fontFamily: "'Bitcount Prop Double', 'Chakra Petch', sans-serif",
              textShadow: '0 0 8px #00F0FF, 0 0 30px rgba(0,240,255,0.4), 3px 0 0 rgba(255,43,214,0.8), -3px 0 0 rgba(57,255,20,0.8)'
            }}
          >
            ☣ AI SLOP DECK ☣
          </h1>
          <p className="text-[11px] sm:text-xs md:text-sm text-[#00F0FF] font-mono mx-auto max-w-4xl tracking-tight leading-relaxed font-bold uppercase select-all">
            In art, the hallucination is the point. Curating magnificent neural accidents directly from our cloud archives.
          </p>
        </div>
      </div>

      {/* Grid: Player Area (Left) & Current Case Details (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* Left Area: TV CRT Screen Box with customization controls */}
        <div className="lg:col-span-6 flex flex-col justify-center">
          <div className={`relative border-4 border-zinc-900 bg-black shadow-[0_0_35px_rgba(0,240,255,0.15)] p-2 rounded-2xl overflow-hidden mx-auto flex flex-col justify-between transition-all duration-300 w-full ${getAspectClass()}`}>
            
            {/* Ambient Scanline Filter */}
            <div className="absolute inset-0 pointer-events-none z-10 bg-scanlines opacity-10" />
            
            {/* TV Screen Heading HUD */}
            <div className="flex justify-between items-center text-[10px] font-mono text-zinc-400 p-2 border-b border-zinc-950 bg-[#050505]/80 z-20">
              <div className="flex items-center gap-1.5">
                <span className="text-[#00F0FF] animate-pulse">● SLOP_STREAM</span>
              </div>
              <div className="text-right text-[#39FF14]">
                {selectedItem ? selectedItem.tag : 'VOID'} // {aspectRatio}
              </div>
            </div>

            {/* Main Content Element (Plays Video or shows Image) */}
            <div className="flex-grow bg-[#020202] relative flex items-center justify-center overflow-hidden min-h-[300px] max-h-[380px] md:max-h-[440px]">
              {selectedItem ? (
                selectedItem.type === 'video' ? (
                  <video
                    ref={videoRef}
                    src={getResolvedUrl(selectedItem.fileName)}
                    controls
                    width={getResolutionWidth()}
                    className="w-full h-full object-contain bg-black z-10"
                    onPlay={() => setIsPlaying(true)}
                    onPause={() => setIsPlaying(false)}
                  />
                ) : (
                  <img
                    src={getResolvedUrl(selectedItem.fileName)}
                    alt={selectedItem.title}
                    className="w-full h-full object-contain bg-black z-10 transition-all duration-300"
                    referrerPolicy="no-referrer"
                  />
                )
              ) : (
                <div className="text-center p-4 font-mono text-zinc-600 z-10">
                  <Cpu className="w-10 h-10 mx-auto mb-2 animate-pulse" />
                  <p className="text-[10px] uppercase">GCS SIGNAL OFFLINE</p>
                </div>
              )}

              {/* Scanlines layer for authentic CRT warmth */}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent pointer-events-none z-20 mix-blend-overlay" />
            </div>

            {/* TV Screen Bottom HUD Details */}
            <div className="flex justify-between items-center text-[9px] font-mono text-zinc-500 p-2 border-t border-zinc-950 bg-[#050505]/80 z-20">
              <div className="truncate max-w-[200px]" title={selectedItem?.fileName}>
                FILE: {selectedItem ? selectedItem.fileName : 'NULL'}
              </div>
              <div className="text-right text-[#00F0FF] font-bold">
                SIZE: {selectedItem ? selectedItem.size : '0.0 KB'}
              </div>
            </div>
          </div>
        </div>

        {/* Right Area: Active Asset Specs + Controls + Prompt Purifier */}
        <div className="lg:col-span-6 flex flex-col justify-between py-2 space-y-6">
          
          {/* Active Asset Specs */}
          {selectedItem ? (
            <div className="space-y-6 md:pt-4">
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono font-bold text-[#00F0FF] bg-[#00F0FF]/10 px-2.5 py-1 rounded border border-[#00F0FF]/30 tracking-widest uppercase">
                  {selectedItem.tag || 'DEBRIS'}
                </span>
                <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
                  // CRITICAL ORBITAL SIGNAL
                </span>
              </div>

              <div className="space-y-4">
                {/* Large Title in Header Font (Jersey 10) */}
                <h2 
                  className="jersey-10-regular text-5xl sm:text-6xl md:text-7xl text-white font-normal uppercase tracking-wider leading-none select-all animate-pulse-subtle"
                  style={{
                    textShadow: '0 0 15px rgba(0,240,255,0.5), 0 0 30px rgba(0,240,255,0.25)',
                  }}
                >
                  {selectedItem.title}
                </h2>

                {/* Styled Meta Label under Title */}
                <div className="font-mono text-xs text-[#FF2BD6]/90 tracking-[0.25em] uppercase font-bold">
                  ░ Neural Hallucination ░
                </div>

                {/* Sleeve Description (Spaced out, stylized) */}
                {selectedItem.desc && (
                  <div className="pt-4 border-t border-zinc-900/40">
                    <p className="text-zinc-400 text-sm leading-relaxed font-mono italic border-l-2 border-[#00F0FF] pl-4 max-w-xl">
                      "{selectedItem.desc}"
                    </p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="py-12 text-center text-zinc-600 font-mono text-[11px] uppercase tracking-wider border border-dashed border-zinc-900">
              [ STANDBY: SELECT AN ASSET IN THE REEL BELOW ]
            </div>
          )}

          {/* Aspect Ratio and Resolution Selector Panel */}
          <div className="space-y-4 bg-zinc-950/40 border border-zinc-900/50 p-4 rounded-xl">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Aspect Ratio dial */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-[9px] font-mono text-zinc-500 uppercase tracking-widest">
                  <span>📏 Aspect Ratio</span>
                  <span className="text-[#00F0FF] font-bold">{aspectRatio}</span>
                </div>
                <div className="grid grid-cols-4 gap-1.5">
                  {(['9:16', '16:9', '1:1', '4:3'] as const).map((r) => (
                    <button
                      key={r}
                      onClick={() => {
                        playChime('square', 1.0);
                        setAspectRatio(r);
                      }}
                      className={`font-mono text-[9px] font-bold py-1 px-1 text-center border uppercase transition-all ${
                        aspectRatio === r 
                          ? 'bg-[#00F0FF] text-black border-[#00F0FF] shadow-[0_0_8px_rgba(0,240,255,0.3)]' 
                          : 'bg-black text-[#00F0FF] border-[#00F0FF]/30 hover:border-[#00F0FF]'
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              {/* Resolution Selector dial */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-[9px] font-mono text-zinc-500 uppercase tracking-widest">
                  <span>🖥 CRT Resolution Mode</span>
                  <span className="text-[#39FF14] font-bold uppercase">{resolution}</span>
                </div>
                <div className="grid grid-cols-4 gap-1.5">
                  {(['480p', '720p', '1080p', 'raw'] as const).map((res) => (
                    <button
                      key={res}
                      onClick={() => {
                        playChime('square', 1.1);
                        setResolution(res);
                      }}
                      className={`font-mono text-[9px] font-bold py-1 px-1 text-center border uppercase transition-all ${
                        resolution === res 
                          ? 'bg-[#39FF14] text-black border-[#39FF14] shadow-[0_0_8px_rgba(57,255,20,0.3)]' 
                          : 'bg-black text-[#39FF14] border-[#39FF14]/30 hover:border-[#39FF14]'
                      }`}
                    >
                      {res === 'raw' ? 'RAW' : res}
                    </button>
                  ))}
                </div>
              </div>

            </div>

            {/* Open Raw GCS Link */}
            {selectedItem && (
              <a
                href={getResolvedUrl(selectedItem.fileName)}
                target="_blank"
                rel="noreferrer"
                onClick={() => playChime('sine', 1.2)}
                className="w-full text-center border border-zinc-850 hover:border-[#00F0FF] hover:bg-[#00F0FF]/5 text-zinc-500 hover:text-white font-mono text-[10px] py-1.5 px-3 flex items-center justify-center gap-1.5 transition-all cursor-crosshair uppercase rounded"
              >
                <ExternalLink className="w-3 h-3" />
                <span>Open Raw GCS Asset</span>
              </a>
            )}
          </div>

          {/* Prompt Purifier Engine */}
          <div className="border border-zinc-900 bg-black/40 p-4 rounded-xl space-y-3">
            <div className="flex items-center gap-2 text-zinc-400 font-bold font-sans uppercase text-[11px] border-b border-zinc-900/60 pb-1.5 tracking-wider">
              <Bot className="w-3.5 h-3.5 text-[#00F0FF]" />
              <span>Prompt Purifier Engine</span>
            </div>

            <div className="space-y-2">
              <div className="flex gap-2">
                <input 
                  type="text"
                  value={rawPrompt}
                  onChange={(e) => setRawPrompt(e.target.value)}
                  placeholder="glowing digital junk..."
                  className="flex-grow bg-black border border-zinc-800 focus:border-[#00F0FF] text-white px-3 py-1.5 font-mono text-[11px] outline-none rounded"
                />
                <button
                  onClick={handleCorruptPrompt}
                  disabled={isCorrupting}
                  className="bg-[#00F0FF] hover:bg-[#00F0FF]/80 text-black font-bold py-1.5 px-4 font-sans uppercase text-[11px] tracking-widest cursor-crosshair transition-all disabled:opacity-50 shrink-0 rounded"
                >
                  {isCorrupting ? 'CORRUPTING...' : 'SYNTHESIZE ▸'}
                </button>
              </div>

              {corruptedPrompt && (
                <div className="bg-black/80 p-2.5 border border-[#00F0FF]/20 font-mono text-[11px] text-[#39FF14] text-center tracking-wide break-all leading-relaxed rounded">
                  {corruptedPrompt}
                </div>
              )}
            </div>
          </div>
          
        </div>
      </div>

      {/* Group Selector and Horizontal Carousel Section */}
      <div className="border border-zinc-900 bg-[#050505] p-5 rounded-xl space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-zinc-900 pb-2 gap-3">
          <span className="text-[10px] font-mono text-zinc-500 uppercase flex items-center gap-1.5 tracking-wider">
            <ListFilter className="w-3.5 h-3.5 text-[#00F0FF]" />
            <span>ARCHIVE FEED MEDIA CAROUSEL</span>
          </span>
          
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => {
                playChime('sine', 1.0);
                setActiveGroup('video');
              }}
              className={`px-3 py-1 font-mono text-[10px] font-bold border flex items-center gap-1.5 transition-all cursor-crosshair uppercase ${
                activeGroup === 'video'
                  ? 'bg-[#00F0FF] text-black border-[#00F0FF]'
                  : 'bg-black text-gray-400 border-zinc-900 hover:text-white'
              }`}
            >
              <Film className="w-3.5 h-3.5" />
              <span>Videos ({items.filter(i => i.type === 'video').length})</span>
            </button>

            <button
              onClick={() => {
                playChime('sine', 1.2);
                setActiveGroup('image');
              }}
              className={`px-3 py-1 font-mono text-[10px] font-bold border flex items-center gap-1.5 transition-all cursor-crosshair uppercase ${
                activeGroup === 'image'
                  ? 'bg-[#00F0FF] text-black border-[#00F0FF]'
                  : 'bg-black text-gray-400 border-zinc-900 hover:text-white'
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span>Images ({items.filter(i => i.type === 'image').length})</span>
            </button>
          </div>
        </div>

        {/* The Horizontal Carousel Track */}
        <div className="relative flex items-center group/carousel">
          {/* Scroll Left Button */}
          <button
            onClick={() => { playChime('sine', 0.9); scrollCarousel('left'); }}
            className="absolute left-1 z-30 p-1.5 rounded-full border border-zinc-850 bg-black/80 hover:bg-[#00F0FF]/15 hover:border-[#00F0FF] text-zinc-400 hover:text-[#00F0FF] transition-all cursor-crosshair shadow-lg opacity-0 group-hover/carousel:opacity-100"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Carousel Viewport */}
          <div
            ref={carouselRef}
            className="flex gap-4 overflow-x-auto py-2 px-2 w-full scroll-smooth scrollbar-thin scrollbar-track-transparent scrollbar-thumb-zinc-800"
            style={{ scrollbarWidth: 'thin' }}
          >
            {filteredItems.length > 0 ? (
              filteredItems.map((item, index) => {
                const isSelected = selectedItem?.id === item.id;
                return (
                  <div
                    key={item.id}
                    onClick={() => handleItemSelect(item)}
                    className={`shrink-0 cursor-crosshair relative w-[160px] sm:w-[180px] transition-all duration-300 rounded-lg overflow-hidden border ${
                      isSelected
                        ? 'bg-[#00F0FF]/10 border-[#00F0FF] scale-[1.03] shadow-[0_0_15px_rgba(0,240,255,0.25)]'
                        : 'bg-black/40 border-zinc-900 hover:border-zinc-700 hover:bg-black/60'
                    }`}
                  >
                    {/* Thumbnail Frame Container */}
                    <div className="aspect-[16/10] bg-[#020202] relative overflow-hidden flex items-center justify-center border-b border-zinc-950">
                      {item.type === 'video' ? (
                        <div className="w-full h-full relative group/video-thumb">
                          {/* We render the video tag directly with preload="metadata" to let browser fetch posters naturally */}
                          <video
                            src={getResolvedUrl(item.fileName)}
                            className="w-full h-full object-cover pointer-events-none"
                            preload="metadata"
                            muted
                            playsInline
                            onMouseEnter={(e) => {
                              const v = e.currentTarget;
                              v.play().catch(() => {});
                            }}
                            onMouseLeave={(e) => {
                              const v = e.currentTarget;
                              v.pause();
                              v.currentTime = 0;
                            }}
                          />
                          {/* Film Roll Sprockets decoration */}
                          <div className="absolute inset-x-0 top-0 h-1.5 bg-black/80 flex justify-between px-1 pointer-events-none">
                            {[...Array(6)].map((_, i) => (
                              <span key={i} className="w-0.5 h-0.5 bg-zinc-800 rounded-sm" />
                            ))}
                          </div>
                          <div className="absolute inset-x-0 bottom-0 h-1.5 bg-black/80 flex justify-between px-1 pointer-events-none">
                            {[...Array(6)].map((_, i) => (
                              <span key={i} className="w-0.5 h-0.5 bg-zinc-800 rounded-sm" />
                            ))}
                          </div>
                          {/* Play Badge Icon overlay */}
                          <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover/video-thumb:bg-black/10 transition-colors pointer-events-none">
                            <div className="p-1 rounded-full bg-black/60 border border-zinc-850 text-zinc-300">
                              <Play className="w-3 h-3 text-[#00F0FF]" />
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="w-full h-full relative">
                          <img
                            src={getResolvedUrl(item.fileName)}
                            alt={item.title}
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                          {/* Polaroid frame border decoration */}
                          <div className="absolute inset-x-0 top-0 h-1 bg-black/20 pointer-events-none" />
                        </div>
                      )}
                      {/* Size Badge in top corner */}
                      <span className="absolute top-1 right-1 text-[7px] font-mono font-black bg-black/75 text-zinc-400 px-1 py-0.5 rounded border border-zinc-800/40 tracking-widest z-10">
                        {item.size}
                      </span>
                    </div>

                    {/* Meta info bottom area */}
                    <div className="p-1.5 space-y-0.5">
                      <div className="flex justify-between items-center text-[7px] font-mono text-zinc-500">
                        <span>SLIDE #{index + 1}</span>
                        <span className={isSelected ? 'text-[#00F0FF]' : 'text-zinc-500'}>
                          {item.type.toUpperCase()}
                        </span>
                      </div>
                      <h4 className="text-[10px] font-sans font-black text-white truncate uppercase tracking-wide group-hover:text-[#00F0FF] transition-colors" title={item.title}>
                        {item.title}
                      </h4>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="py-12 text-center text-zinc-600 font-mono text-[11px] uppercase tracking-wider border border-dashed border-zinc-900 w-full">
                [ NO MEDIA DETECTED IN THIS CHANNEL ]
              </div>
            )}
          </div>

          {/* Scroll Right Button */}
          <button
            onClick={() => { playChime('sine', 1.1); scrollCarousel('right'); }}
            className="absolute right-1 z-30 p-1.5 rounded-full border border-zinc-850 bg-black/80 hover:bg-[#00F0FF]/15 hover:border-[#00F0FF] text-zinc-400 hover:text-[#00F0FF] transition-all cursor-crosshair shadow-lg opacity-0 group-hover/carousel:opacity-100"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Cloud bucket diagnostic log terminal */}
      <div className="bg-[#020202] border border-zinc-900 p-4 font-mono text-[10px] text-gray-500 max-h-[140px] overflow-y-auto space-y-1">
        <span className="text-[9px] uppercase tracking-wider block text-zinc-700 border-b border-zinc-950 pb-1 mb-2">
          GCS_LOG_STREAM: astraltrash_aislop_diagnostic_v1
        </span>
        {terminalLogs.map((log, index) => (
          <div key={index} className="truncate">{log}</div>
        ))}
      </div>
    </div>
  );
}

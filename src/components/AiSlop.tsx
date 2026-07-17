import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Film,
  Image as ImageIcon,
  Bot,
  Sparkles,
  RefreshCw,
  Play,
  ExternalLink,
  Cpu,
  ListFilter,
  Orbit,
  Wand2
} from 'lucide-react';

type SlopCategory = 'ai' | 'non-ai';
type MediaType = 'video' | 'image';
type DisplayMode = 'auto' | 'portrait' | 'landscape' | 'square' | 'contain';
type GalleryMode = 'grid' | 'constellation';

interface BucketSource {
  id: SlopCategory;
  label: string;
  bucket: string;
  prefix?: string;
  tag: string;
  accent: string;
}

interface BucketItem {
  id: string;
  title: string;
  fileName: string;
  desc: string;
  size: string;
  tag: string;
  type: MediaType;
  bucket: string;
  sourceCategory: SlopCategory;
  sourceLabel: string;
  contentType?: string;
  updated?: string;
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

const BUCKET_SOURCES: BucketSource[] = [
  {
    id: 'ai',
    label: 'AI_SLOP',
    bucket: 'astraltrash_aislop',
    tag: 'AI_SLOP',
    accent: '#00F0FF'
  },
  {
    id: 'non-ai',
    label: 'NON_AI ART',
    bucket: 'astraltrash_other',
    prefix: 'art/non_ai/',
    tag: 'HAND_SIGNAL',
    accent: '#FF2BD6'
  }
];

const MEDIA_EXTENSIONS: Record<MediaType, RegExp> = {
  video: /\.(mov|mp4|m4v|avi|mpeg|mpg|wmv|webm)$/i,
  image: /\.(jpg|jpeg|png|gif|webp|bmp|svg|avif)$/i
};

const FALLBACK_ITEMS: BucketItem[] = [
  {
    id: 'fallback-ai-video',
    title: 'Cybernetic Over Fitted Debris',
    fileName: 'cybernetic_debris_916.mp4',
    desc: 'Fallback hallucination tape.',
    size: '1.4 MB',
    tag: 'AI_SLOP',
    type: 'video',
    bucket: 'astraltrash_aislop',
    sourceCategory: 'ai',
    sourceLabel: 'AI_SLOP'
  },
  {
    id: 'fallback-non-ai-image',
    title: 'Acrylic Texture Dither Scan',
    fileName: 'art/non_ai/acrylic_scan_916.png',
    desc: 'Fallback hand-signal placeholder.',
    size: '650 KB',
    tag: 'HAND_SIGNAL',
    type: 'image',
    bucket: 'astraltrash_other',
    sourceCategory: 'non-ai',
    sourceLabel: 'NON_AI ART'
  }
];

export default function AiSlop({
  playChime,
  rawPrompt,
  setRawPrompt,
  corruptedPrompt,
  isCorrupting,
  handleCorruptPrompt,
  slopMetric,
  aiLogs
}: AiSlopProps) {
  const [items, setItems] = useState<BucketItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<BucketItem | null>(null);
  const [activeGroup, setActiveGroup] = useState<MediaType>('image');
  const [categoryFilter, setCategoryFilter] = useState<SlopCategory>('ai');
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [displayMode, setDisplayMode] = useState<DisplayMode>('auto');
  const [galleryMode, setGalleryMode] = useState<GalleryMode>('grid');
  const [imageRes, setImageRes] = useState<'potato' | 'low' | 'high' | 'source'>('low');
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [detectedAspect, setDetectedAspect] = useState<DisplayMode>('portrait');
  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    'TENSORTRANTRUM_V2 // DUAL_BUCKET RUNTIME: ACTIVE',
    'SLOP_MONITOR: Listening for GCS cloud signal...',
    'READY FOR SYNAPSES TRANSFER'
  ]);

  const videoRef = useRef<HTMLVideoElement | null>(null);

  const addLog = (msg: string) => {
    setTerminalLogs(prev => [...prev.slice(-12), `[${new Date().toLocaleTimeString()}] ${msg}`]);
  };

  const formatSize = (bytes: number) => {
    if (!Number.isFinite(bytes) || bytes <= 0) return '0 KB';
    return bytes > 1024 * 1024
      ? `${(bytes / (1024 * 1024)).toFixed(1)} MB`
      : `${Math.max(1, Math.round(bytes / 1024))} KB`;
  };

  const formatSlopTitle = (fileName: string): string => {
    const cleanName = decodeURIComponent(fileName.split('/').pop() || fileName);
    const withoutExt = cleanName.substring(0, cleanName.lastIndexOf('.')) || cleanName;
    return withoutExt
      .replace(/[\s_().-]+/g, ' ')
      .trim()
      .replace(/\b\w/g, c => c.toUpperCase());
  };

  const getMediaType = (fileName: string, contentType = ''): MediaType | null => {
    if (contentType.startsWith('video/')) return 'video';
    if (contentType.startsWith('image/')) return 'image';
    if (MEDIA_EXTENSIONS.video.test(fileName)) return 'video';
    if (MEDIA_EXTENSIONS.image.test(fileName)) return 'image';
    return null;
  };

  const getRawUrl = (item: BucketItem) => {
    return `https://storage.googleapis.com/${item.bucket}/${encodeURI(item.fileName).replace(/#/g, '%23')}`;
  };

  const getResolvedUrl = (item: BucketItem) => {
    const raw = getRawUrl(item);
    if (item.type === 'video' || imageRes === 'source') return raw;
    const width = imageRes === 'high' ? 1920 : imageRes === 'low' ? 1280 : 854;
    return `https://wsrv.nl/?url=${encodeURIComponent(raw)}&w=${width}&output=webp&q=80`;
  };

  const getResolvedThumbUrl = (item: BucketItem) => {
    const raw = getRawUrl(item);
    if (item.type === 'video') return raw;
    return `https://wsrv.nl/?url=${encodeURIComponent(raw)}&w=300&output=webp&q=60`;
  };

  const listSourceObjects = async (source: BucketSource, signal: AbortSignal) => {
    const found: BucketItem[] = [];
    let pageToken = '';
    let page = 0;

    do {
      const params = new URLSearchParams({ maxResults: '1000' });
      if (source.prefix) params.set('prefix', source.prefix);
      if (pageToken) params.set('pageToken', pageToken);

      const response = await fetch(`https://storage.googleapis.com/storage/v1/b/${source.bucket}/o?${params}`, { signal });
      if (!response.ok) throw new Error(`${source.bucket} returned HTTP ${response.status}`);
      const data = await response.json();
      page += 1;

      (data.items || []).forEach((object: any, idx: number) => {
        const fileName = object.name;
        if (!fileName || fileName.endsWith('/')) return;
        const type = getMediaType(fileName, object.contentType || '');
        if (!type) return;

        const title = formatSlopTitle(fileName);
        found.push({
          id: `${source.id}-${page}-${idx}-${fileName}`,
          title,
          fileName,
          desc: source.id === 'ai'
            ? `Machine-dream residue pulled live from gs://${source.bucket}/${fileName}.`
            : `Handmade/procedural artifact pulled live from gs://${source.bucket}/${fileName}.`,
          size: formatSize(parseInt(object.size || '0', 10)),
          tag: type === 'video' ? `${source.tag}_TAPE` : `${source.tag}_STILL`,
          type,
          bucket: source.bucket,
          sourceCategory: source.id,
          sourceLabel: source.label,
          contentType: object.contentType,
          updated: object.updated
        });
      });

      pageToken = data.nextPageToken || '';
    } while (pageToken && !signal.aborted);

    return found;
  };

  useEffect(() => {
    const controller = new AbortController();

    const scanSlopBuckets = async () => {
      setIsScanning(true);
      addLog(`RESOLVING_BUCKETS: ${BUCKET_SOURCES.map(src => `gs://${src.bucket}/${src.prefix || ''}`).join(' + ')}`);

      try {
        const results = await Promise.allSettled(
          BUCKET_SOURCES.map(async source => {
            const sourceItems = await listSourceObjects(source, controller.signal);
            addLog(`SCAN_${source.id.toUpperCase()}: ${sourceItems.length} artifacts received from ${source.bucket}`);
            return sourceItems;
          })
        );

        if (controller.signal.aborted) return;

        const foundItems = results.flatMap((result, index) => {
          if (result.status === 'fulfilled') return result.value;
          addLog(`SCAN_WARN: ${BUCKET_SOURCES[index].bucket} failed: ${result.reason?.message || 'unknown error'}`);
          return [];
        });

        const curated = foundItems.sort((a, b) => {
          if (a.sourceCategory !== b.sourceCategory) return a.sourceCategory === 'ai' ? -1 : 1;
          if (a.type !== b.type) return a.type === 'image' ? -1 : 1;
          return a.title.localeCompare(b.title);
        });

        const nextItems = curated.length > 0 ? curated : FALLBACK_ITEMS;
        if (curated.length === 0) addLog('SCAN_WARN: No public media detected. Fallback ghosts loaded.');

        setItems(nextItems);
        const defaultItem = nextItems.find(item => item.sourceCategory === categoryFilter && item.type === activeGroup)
          || nextItems.find(item => item.sourceCategory === categoryFilter)
          || nextItems[0];
        setSelectedItem(defaultItem);
        setActiveGroup(defaultItem.type);
        addLog(`SCAN_SUCCESS: ${nextItems.length} total artifacts wired into the deck.`);
      } catch (err: any) {
        if (!controller.signal.aborted) {
          addLog(`SCAN_ERROR: ${err.message}`);
          setItems(FALLBACK_ITEMS);
          setSelectedItem(FALLBACK_ITEMS[0]);
        }
      } finally {
        if (!controller.signal.aborted) setIsScanning(false);
      }
    };

    scanSlopBuckets();
    return () => controller.abort();
  }, []);

  const categoryItems = useMemo(
    () => items.filter(item => item.sourceCategory === categoryFilter),
    [items, categoryFilter]
  );

  const filteredItems = useMemo(
    () => categoryItems.filter(item => item.type === activeGroup),
    [categoryItems, activeGroup]
  );

  const sourceCounts = useMemo(() => ({
    ai: items.filter(item => item.sourceCategory === 'ai').length,
    nonAi: items.filter(item => item.sourceCategory === 'non-ai').length,
    videos: categoryItems.filter(item => item.type === 'video').length,
    images: categoryItems.filter(item => item.type === 'image').length
  }), [items, categoryItems]);

  useEffect(() => {
    if (items.length === 0) return;
    const candidates = items.filter(item => item.sourceCategory === categoryFilter);
    const nextItem = candidates.find(item => item.type === activeGroup) || candidates[0] || null;
    setSelectedItem(nextItem);
    if (nextItem && nextItem.type !== activeGroup) setActiveGroup(nextItem.type);
    setIsPlaying(nextItem?.type === 'video');
  }, [categoryFilter]);

  useEffect(() => {
    if (filteredItems.length > 0) return;
    const alternate = categoryItems[0];
    if (alternate) {
      setActiveGroup(alternate.type);
      setSelectedItem(alternate);
    }
  }, [filteredItems.length, categoryItems]);

  useEffect(() => {
    if (selectedItem?.type !== 'video' || !videoRef.current) return;
    if (isPlaying) {
      videoRef.current.play().catch(() => setIsPlaying(false));
    } else {
      videoRef.current.pause();
    }
  }, [isPlaying, selectedItem]);

  const handleItemSelect = (item: BucketItem) => {
    playChime('triangle', item.sourceCategory === 'ai' ? 1.25 : 1.45);
    setSelectedItem(item);
    setIsPlaying(item.type === 'video');
    addLog(`LOAD_SIGNAL: ${item.sourceLabel} // ${item.fileName}`);
  };

  const inferAspect = (width: number, height: number) => {
    if (!width || !height) return;
    const ratio = width / height;
    if (ratio > 1.25) setDetectedAspect('landscape');
    else if (ratio < 0.8) setDetectedAspect('portrait');
    else setDetectedAspect('square');
  };

  const activeDisplay = displayMode === 'auto' ? detectedAspect : displayMode;
  const viewerAspectClass = {
    portrait: 'aspect-[9/14] max-w-[430px]',
    landscape: 'aspect-[16/10] max-w-[760px]',
    square: 'aspect-square max-w-[560px]',
    contain: 'aspect-[4/3] max-w-[680px]',
    auto: 'aspect-[9/14] max-w-[430px]'
  }[activeDisplay];

  return (
    <div className="frame py-8 animate-fade-in space-y-8" id="aislop-mainframe">
      <div className="border-b border-[#00F0FF]/40 pb-6 mb-2 space-y-4">
        <div className="flex justify-between items-center text-xs">
          <div className="flex items-center gap-1.5 font-mono text-[10px] text-[#39FF14]">
            {isScanning ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>DUAL GCS LIST SCANNING...</span>
              </>
            ) : (
              <span className="text-zinc-600">NEURAL FEED STANDBY // {items.length} ARTIFACTS</span>
            )}
          </div>
          <div className="bg-black/60 border border-[#00F0FF]/40 px-3 py-1 font-mono text-[10px] text-[#00F0FF] uppercase tracking-widest">
            AI COGNITIVE RATIO: {slopMetric}%
          </div>
        </div>

        <div className="text-center space-y-3">
          <h1
            className="text-center uppercase select-none text-5xl sm:text-7xl md:text-8xl leading-none"
            style={{
              fontFamily: "'Bitcount Prop Double', 'Chakra Petch', sans-serif",
              textShadow: '0 0 8px #00F0FF, 0 0 30px rgba(0,240,255,0.4), 3px 0 0 rgba(255,43,214,0.8), -3px 0 0 rgba(57,255,20,0.8)'
            }}
          >
            ☣ ART SLOP DECK ☣
          </h1>
          <p className="text-[11px] sm:text-xs md:text-sm text-[#00F0FF] font-mono mx-auto max-w-4xl tracking-tight leading-relaxed font-bold uppercase select-all">
            BOX: fast bucket gallery. MUTATION: constellation mode for art that refuses to line up politely.
          </p>

          <div className="flex flex-wrap justify-center items-center gap-3 pt-3">
            <div className="inline-flex rounded-md border border-[#00F0FF]/30 p-1 bg-black/60 shadow-[0_0_12px_rgba(0,240,255,0.15)]">
              <button
                onClick={() => { playChime('triangle', 1.0); setCategoryFilter('ai'); }}
                className={`px-5 py-2 font-mono text-xs sm:text-sm font-bold uppercase transition-all tracking-wider flex items-center gap-2 rounded ${categoryFilter === 'ai' ? 'bg-[#00F0FF] text-black shadow-[0_0_10px_rgba(0,240,255,0.5)]' : 'text-zinc-500 hover:text-[#00F0FF]/80'}`}
              >
                <Bot className="w-4 h-4" />
                <span>AI_SLOP ({sourceCounts.ai})</span>
              </button>
              <button
                onClick={() => { playChime('triangle', 1.3); setCategoryFilter('non-ai'); }}
                className={`px-5 py-2 font-mono text-xs sm:text-sm font-bold uppercase transition-all tracking-wider flex items-center gap-2 rounded ${categoryFilter === 'non-ai' ? 'bg-[#FF2BD6] text-black shadow-[0_0_10px_rgba(255,43,214,0.5)]' : 'text-zinc-500 hover:text-[#FF2BD6]/80'}`}
              >
                <Sparkles className="w-4 h-4" />
                <span>Non-AI ({sourceCounts.nonAi})</span>
              </button>
            </div>

            <button
              onClick={() => { playChime('square', 1.2); setGalleryMode(galleryMode === 'grid' ? 'constellation' : 'grid'); }}
              className="border border-[#39FF14]/50 bg-black/70 px-4 py-2 text-[#39FF14] hover:bg-[#39FF14] hover:text-black font-mono text-xs font-black uppercase tracking-widest transition-all rounded cursor-crosshair flex items-center gap-2"
            >
              <Orbit className="w-4 h-4" /> {galleryMode === 'grid' ? 'Constellation Mode' : 'Grid Mode'}
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        <div className="lg:col-span-7 flex flex-col justify-start">
          <div className={`relative border-4 border-zinc-900 bg-black shadow-[0_0_35px_rgba(0,240,255,0.15)] p-2 rounded-2xl overflow-hidden mx-auto flex flex-col transition-all duration-300 w-full ${viewerAspectClass}`}>
            
            <div className="flex-grow bg-black relative flex items-center justify-center overflow-hidden min-h-[330px]">
              {selectedItem ? (
                selectedItem.type === 'video' ? (
                  <video
                    ref={videoRef}
                    key={selectedItem.id}
                    src={getResolvedUrl(selectedItem)}
                    controls
                    className="w-full h-full object-contain bg-black z-10"
                    onLoadedMetadata={(e) => inferAspect(e.currentTarget.videoWidth, e.currentTarget.videoHeight)}
                    onPlay={() => setIsPlaying(true)}
                    onPause={() => setIsPlaying(false)}
                  />
                ) : (
                  <img
                    key={selectedItem.id}
                    src={getResolvedUrl(selectedItem)}
                    alt={selectedItem.title}
                    loading="eager"
                    decoding="async"
                    className="w-full h-full object-contain bg-black z-10 transition-all duration-300"
                    referrerPolicy="no-referrer"
                    onLoad={(e) => inferAspect(e.currentTarget.naturalWidth, e.currentTarget.naturalHeight)}
                  />
                )
              ) : (
                <div className="text-center p-4 font-mono text-zinc-600 z-10">
                  <Cpu className="w-10 h-10 mx-auto mb-2 animate-pulse" />
                  <p className="text-[10px] uppercase">GCS SIGNAL OFFLINE</p>
                </div>
              )}
            </div>

            <div className="flex justify-between items-center text-[9px] font-mono text-zinc-500 p-2 border-t border-zinc-950 bg-[#050505] z-20">
              <div className="text-right text-[#00F0FF] font-bold">SIZE: {selectedItem ? selectedItem.size : '0.0 KB'}</div>
              {selectedItem && (
                  <a href={getRawUrl(selectedItem)} target="_blank" rel="noreferrer" onClick={() => playChime('sine', 1.2)} className="hover:text-white flex items-center gap-1">
                    <ExternalLink className="w-3 h-3" /> RAW FILE
                  </a>
              )}
            </div>
          </div>
          
          <div className="flex justify-center mt-6">
            <div className="space-y-2 max-w-[430px] w-full bg-zinc-950/40 border border-zinc-900/50 p-4 rounded-xl">
              <div className="flex justify-between items-center text-[9px] font-mono text-zinc-500 uppercase tracking-widest"><span>📐 Display Geometry</span><span className="text-[#00F0FF] font-bold">{displayMode}</span></div>
              <div className="grid grid-cols-5 gap-1.5">
                {(['auto', 'portrait', 'landscape', 'square', 'contain'] as const).map(mode => (
                  <button key={mode} onClick={() => { playChime('square', 1.0); setDisplayMode(mode); }} className={`font-mono text-[8px] font-bold py-1 px-1 text-center border uppercase transition-all ${displayMode === mode ? 'bg-[#00F0FF] text-black border-[#00F0FF]' : 'bg-black text-[#00F0FF] border-[#00F0FF]/30 hover:border-[#00F0FF]'}`}>{mode}</button>
                ))}
              </div>
              <div className="flex justify-between items-center text-[9px] font-mono text-zinc-500 uppercase tracking-widest mt-4"><span>🖼️ Image Resolution</span><span className="text-[#FF2BD6] font-bold">{imageRes}</span></div>
              <div className="grid grid-cols-4 gap-1.5">
                {(['potato', 'low', 'high', 'source'] as const).map(res => (
                  <button key={res} onClick={() => { playChime('square', 1.0); setImageRes(res); }} className={`font-mono text-[8px] font-bold py-1 px-1 text-center border uppercase transition-all ${imageRes === res ? 'bg-[#FF2BD6] text-black border-[#FF2BD6]' : 'bg-black text-[#FF2BD6] border-[#FF2BD6]/30 hover:border-[#FF2BD6]'}`}>{res}</button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 flex flex-col justify-start py-2 h-[800px]">
           <div className={`h-full flex flex-col ${galleryMode === 'constellation' ? 'overflow-hidden' : ''}`}>
             <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-2 gap-3 mb-2 shrink-0">
               <span className="text-[10px] font-mono text-zinc-500 uppercase flex items-center gap-1.5 tracking-wider"><ListFilter className="w-3.5 h-3.5 text-[#00F0FF]" /> {galleryMode === 'constellation' ? 'CONSTELLATION' : 'GRID'}</span>
               <div className="flex items-center gap-1.5">
                 <button onClick={() => { playChime('sine', 1.0); setActiveGroup('video'); }} className={`px-3 py-1 font-mono text-[10px] font-bold border flex items-center gap-1.5 transition-all cursor-crosshair uppercase ${activeGroup === 'video' ? categoryFilter === 'ai' ? 'bg-[#00F0FF] text-black border-[#00F0FF]' : 'bg-[#FF2BD6] text-black border-[#FF2BD6]' : 'bg-black text-gray-400 border-zinc-900 hover:text-white'}`}><Film className="w-3.5 h-3.5" /> Videos ({sourceCounts.videos})</button>
                 <button onClick={() => { playChime('sine', 1.2); setActiveGroup('image'); }} className={`px-3 py-1 font-mono text-[10px] font-bold border flex items-center gap-1.5 transition-all cursor-crosshair uppercase ${activeGroup === 'image' ? categoryFilter === 'ai' ? 'bg-[#00F0FF] text-black border-[#00F0FF]' : 'bg-[#FF2BD6] text-black border-[#FF2BD6]' : 'bg-black text-gray-400 border-zinc-900 hover:text-white'}`}><ImageIcon className="w-3.5 h-3.5" /> Images ({sourceCounts.images})</button>
               </div>
             </div>

             <div className={`flex-grow relative ${galleryMode === 'constellation' ? '' : 'overflow-y-auto custom-scrollbar'}`} style={{ scrollbarWidth: 'thin' }}>
                <div className={`${galleryMode === 'constellation' ? 'relative w-full h-full min-h-[500px]' : 'grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-3 pb-4'}`}>
                  {filteredItems.length > 0 ? filteredItems.map((item, index) => {
                    const isSelected = selectedItem?.id === item.id;
                    const rotate = galleryMode === 'constellation' ? ((index % 7) - 3) * 2.4 : 0;
                    return (
                      <button
                        type="button"
                        key={item.id}
                        onClick={() => handleItemSelect(item)}
                        className={`text-left cursor-crosshair relative transition-all duration-300 rounded-lg overflow-hidden group/card ${galleryMode === 'constellation' ? 'absolute w-32 hover:z-20 shadow-lg' : 'w-full hover:z-20'} ${isSelected ? 'ring-2 ring-[#00F0FF] scale-[1.03] shadow-[0_0_22px_rgba(0,240,255,0.35)] z-10' : 'hover:ring-1 hover:ring-zinc-700'}`}
                        style={{ 
                          transform: galleryMode === 'constellation' ? `rotate(${rotate}deg)` : undefined,
                          left: galleryMode === 'constellation' ? `${(index % 3) * 30 + (index % 2) * 5}%` : undefined,
                          top: galleryMode === 'constellation' ? `${Math.floor(index / 3) * 120 + (index % 3) * 20}px` : undefined,
                        }}
                      >
                        <div className="aspect-square bg-[#020202] relative overflow-hidden flex items-center justify-center">
                          {item.type === 'video' ? (
                            <div className="w-full h-full relative group/video-thumb">
                              <video src={getResolvedUrl(item)} className="w-full h-full object-cover pointer-events-none opacity-80 group-hover/card:opacity-100" preload="none" muted playsInline onMouseEnter={(e) => e.currentTarget.play().catch(() => {})} onMouseLeave={(e) => { e.currentTarget.pause(); e.currentTarget.currentTime = 0; }} />
                              <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover/video-thumb:bg-black/10 transition-colors pointer-events-none"><div className="p-1 rounded-full bg-black/60 border border-zinc-850 text-zinc-300"><Play className="w-3 h-3 text-[#00F0FF]" /></div></div>
                            </div>
                          ) : (
                            <img src={getResolvedThumbUrl(item)} alt={item.title} loading="lazy" decoding="async" className="w-full h-full object-cover group-hover/card:scale-105 transition-transform duration-500" referrerPolicy="no-referrer" />
                          )}
                        </div>
                      </button>
                    );
                  }) : <div className="py-12 text-center text-zinc-600 font-mono text-[11px] uppercase tracking-wider border border-dashed border-zinc-900 w-full col-span-full">[ NO MEDIA DETECTED IN THIS CHANNEL ]</div>}
                </div>
             </div>
           </div>
        </div>
      </div>

      <div className="bg-[#020202] border border-zinc-900 p-4 font-mono text-[10px] text-gray-500 max-h-[160px] overflow-y-auto space-y-1 custom-scrollbar">
        <span className="text-[9px] uppercase tracking-wider block text-zinc-700 border-b border-zinc-950 pb-1 mb-2">GCS_LOG_STREAM: astraltrash_dual_bucket_diagnostic_v2</span>
        {[...terminalLogs, ...aiLogs.slice(-3).map(log => `AI_LOG: ${log}`)].map((log, index) => <div key={index} className="truncate">{log}</div>)}
      </div>
    </div>
  );
}

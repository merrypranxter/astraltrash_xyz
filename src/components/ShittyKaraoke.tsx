import { useState, useRef, useEffect } from 'react';
import { Play, Pause, Settings, Plus, Trash2, Sliders, RefreshCw } from 'lucide-react';

interface BucketVideo {
  id: string;
  title: string;
  artist?: string;
  desc: string;
  fileName: string;
  duration?: string;
  tag?: string;
}

const topSongsOrder = [
  'Work_It_by_Missy_Elliott.mov',
  'Girl_Anachronism_by_The_Dresden_Dolls.mp4',
  'Faith_by_George_Michael.mov',
  'Hi_Dee_Ho.mov',
  'Bouncing_Around_The_Room_by_Phish.mp4',
  'Whatta_Man_by_Salt_n_Pepa.mov',
  'Too_Many_Dicks_On_The_Dancefloor_by_Flight_of_the_Conchords.mp4',
  'Whoomp_There_It_Is_by_Tag_Team.mov',
  'The_Medical_Love_Song_by_Monty_Python.mp4',
  'Smell_Yo_Dick_by_Risquay.mov',
  'Walk_It_Out_by_DJ_Unk.mov'
];

const defaultBucketVideos: BucketVideo[] = [
  {
    id: 'work_it',
    title: 'Work It',
    artist: 'Missy Elliott',
    desc: 'Rewind and flip it, retro dither glitch jam',
    fileName: 'Work_It_by_Missy_Elliott.mov',
    duration: '4:24',
    tag: 'GLITCH'
  },
  {
    id: 'girl_anachronism',
    title: 'Girl Anachronism',
    artist: 'The Dresden Dolls',
    desc: 'High-octane piano punk performance',
    fileName: 'Girl_Anachronism_by_The_Dresden_Dolls.mp4',
    duration: '3:02',
    tag: 'PUNK'
  },
  {
    id: 'faith',
    title: 'Faith',
    artist: 'George Michael',
    desc: 'Classic acoustic rock and roll leather jacket vibe',
    fileName: 'Faith_by_George_Michael.mov',
    duration: '3:12',
    tag: 'CLASSIC'
  },
  {
    id: 'hi_dee_ho',
    title: 'Hi Dee Ho',
    artist: '',
    desc: 'Big band vintage swing and microphone coils',
    fileName: 'Hi_Dee_Ho.mov',
    duration: '3:45',
    tag: 'VINTAGE'
  },
  {
    id: 'bouncing_around',
    title: 'Bouncing Around The Room',
    artist: 'Phish',
    desc: 'Live looping jam and ambient dithered crowd echo',
    fileName: 'Bouncing_Around_The_Room_by_Phish.mp4',
    duration: '3:50',
    tag: 'LIVE'
  },
  {
    id: 'whatta_man',
    title: 'Whatta Man',
    artist: 'Salt n Pepa',
    desc: "Mary's favorite - retro jam slotted and ready to spin!",
    fileName: 'Whatta_Man_by_Salt_n_Pepa.mov',
    duration: '4:52',
    tag: 'FAV'
  },
  {
    id: 'too_many_dicks',
    title: 'Too Many Dicks On The Dancefloor',
    artist: 'Flight of the Conchords',
    desc: 'Comedic electronic synth hum and beats',
    fileName: 'Too_Many_Dicks_On_The_Dancefloor_by_Flight_of_the_Conchords.mp4',
    duration: '2:40',
    tag: 'BEATS'
  },
  {
    id: 'whoomp',
    title: 'Whoomp There It Is',
    artist: 'Tag Team',
    desc: 'Unmatched 90s party anthem and analog bass waves',
    fileName: 'Whoomp_There_It_Is_by_Tag_Team.mov',
    duration: '4:01',
    tag: 'VOX'
  },
  {
    id: 'medical_love_song',
    title: 'The Medical Love Song',
    artist: 'Monty Python',
    desc: 'Classic British musical satire and dither coils',
    fileName: 'The_Medical_Love_Song_by_Monty_Python.mp4',
    duration: '3:10',
    tag: 'SATIRE'
  },
  {
    id: 'smell_yo_dick',
    title: 'Smell Yo Dick',
    artist: 'Risquay',
    desc: 'Smooth late night R&B tape distortion',
    fileName: 'Smell_Yo_Dick_by_Risquay.mov',
    duration: '3:30',
    tag: 'R&B'
  },
  {
    id: 'walk_it_out',
    title: 'Walk It Out',
    artist: 'DJ Unk',
    desc: 'Hypnotic Southern hip-hop step sync',
    fileName: 'Walk_It_Out_by_DJ_Unk.mov',
    duration: '3:15',
    tag: 'DANCE'
  },
  {
    id: '88_lines',
    title: '88 Lines About 44 Women',
    artist: 'The Nails',
    desc: 'Synthesizer wave and spoken word lyric tape',
    fileName: '88_Lines_About_44_Women_by_The_Nails.mov',
    duration: '4:20',
    tag: 'WAVE'
  },
  {
    id: 'america_fuck_this',
    title: 'America Fuck This',
    artist: '',
    desc: 'Satirical political retro mashup',
    fileName: 'America_Fuck_This.mov',
    duration: '2:50',
    tag: 'SATIRE'
  },
  {
    id: 'ballroom_blitz',
    title: 'Ballroom Blitz',
    artist: '',
    desc: 'Glam rock high energy rhythm coil',
    fileName: 'Ballroom_Blitz.mov',
    duration: '3:40',
    tag: 'CLASSIC'
  },
  {
    id: 'big_me',
    title: 'Big Me',
    artist: 'The Foo Fighters',
    desc: 'Melodic 95 alternative rock classic',
    fileName: 'Big_Me_by_The_Foo_Fighters.mov',
    duration: '2:15',
    tag: 'CLASSIC'
  },
  {
    id: 'funky_crime',
    title: 'Funky Crime',
    artist: 'The Red Hot Chili Peppers',
    desc: 'Early slap bass funk dithered video tape',
    fileName: 'Funky_Crime_by_The_Red_Hot_Chili_Peppers.mp4',
    duration: '2:58',
    tag: 'FUNK'
  },
  {
    id: 'gettin_jiggy',
    title: 'Gettin Jiggy Wit It',
    artist: 'Will Smith',
    desc: 'Late 90s gold plated party tape',
    fileName: 'Gettin_Jiggy_Wit_It_by_Will_Smith.mov',
    duration: '3:48',
    tag: 'BEATS'
  },
  {
    id: 'here_it_goes',
    title: 'Here It Goes Again',
    artist: 'OK Go',
    desc: 'Treadmill sync choreography classic',
    fileName: 'Here_It_Goes_Again_by_OK_Go.mov',
    duration: '3:00',
    tag: 'DANCE'
  },
  {
    id: 'loser',
    title: 'Loser',
    artist: 'Beck',
    desc: 'Dadaist alternative rock landmark tape',
    fileName: 'Loser_by_Beck.mov',
    duration: '3:55',
    tag: 'CLASSIC'
  },
  {
    id: 'once_in_a_lifetime',
    title: 'Once In A Lifetime',
    artist: 'The Talking Heads',
    desc: 'Slightly decaying art pop live stream',
    fileName: 'Once_In_A_Lifetime_by_The_Talking_Heads.mp4',
    duration: '4:19',
    tag: 'LIVE'
  },
  {
    id: 'one_night_in_bangkok',
    title: 'One Night In Bangkok',
    artist: 'Murray Head',
    desc: '80s theatrical pop chess master dither',
    fileName: 'One_Night_In_Bangkok_by_Murray_Head.mp4',
    duration: '3:54',
    tag: 'CLASSIC'
  },
  {
    id: 'roll_out',
    title: 'Roll Out',
    artist: 'Ludacris',
    desc: 'Heavy brass hip-hop dither loop',
    fileName: 'Roll_Out_by_Ludacris.mov',
    duration: '4:01',
    tag: 'BEATS'
  },
  {
    id: 'shakedown_street',
    title: 'Shakedown Street',
    artist: 'The Grateful Dead',
    desc: 'Disco-inflected jam band groove reel',
    fileName: 'Shakedown_Street_by_The_Grateful_Dead.mp4',
    duration: '4:55',
    tag: 'LIVE'
  },
  {
    id: 'truckin',
    title: 'Truckin',
    artist: 'The Grateful Dead',
    desc: 'Long roadtrip classic country jam spool',
    fileName: 'Truckin_by_The_Grateful_Dead.mov',
    duration: '5:05',
    tag: 'LIVE'
  }
];

function formatVideoMetadata(fileName: string) {
  // Remove extension
  let base = fileName.replace(/\.(mov|mp4|avi|mpeg|mpg|wmv)$/i, '');
  // Replace underscores with spaces
  base = base.replace(/_/g, ' ').trim();
  
  // Find " by " (case-insensitive)
  const byMatch = base.match(/\s+by\s+/i);
  if (byMatch && byMatch.index !== undefined) {
    const title = base.substring(0, byMatch.index).trim();
    const artist = base.substring(byMatch.index + byMatch[0].length).trim();
    return { title, artist };
  }
  return { title: base, artist: '' };
}

interface ShittyKaraokeProps {
  playChime: (type: 'sine' | 'triangle' | 'sawtooth' | 'square', pitchModifier: number) => void;
  preselectedVideoFileName?: string;
  clearPreselectedVideoFileName?: () => void;
}

export function ShittyKaraoke({ playChime, preselectedVideoFileName, clearPreselectedVideoFileName }: ShittyKaraokeProps) {
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
          // Verify it contains our new default first video
          const hasNewFirst = parsed.some(v => v.fileName === 'Work_It_by_Missy_Elliott.mov');
          if (hasNewFirst) {
            // Recalculate title and artist on the fly to reflect filename changes!
            return parsed.map(v => {
              const { title, artist } = formatVideoMetadata(v.fileName);
              return {
                ...v,
                title: title || v.title,
                artist: artist || v.artist
              };
            });
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
  const [isScanning, setIsScanning] = useState<boolean>(false);

  // Hover state for lag-free thumbnails
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  // Bandwidth & quality resolution toggle
  const [resolution, setResolution] = useState<'480p' | '720p' | '1080p'>('720p');

  // Edit fields
  const [editTitle, setEditTitle] = useState('');
  const [editArtist, setEditArtist] = useState('');
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

  // Dynamic Bucket XML Scanning on mount & bucketName change
  useEffect(() => {
    let active = true;
    const scanBucket = async () => {
      setIsScanning(true);
      addLog(`CONNECT_GCS: Scanning bucket [${bucketName}] for video clips...`);
      try {
        let foundKeys: string[] = [];
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
              if (keyNode && keyNode.textContent) {
                const key = keyNode.textContent;
                if (key.match(/\.(mov|mp4|avi|mpeg|mpg|wmv)$/i)) {
                  foundKeys.push(key);
                }
              }
            }
            fetchedSuccess = true;
          } else {
            throw new Error(`HTTP XML status ${response.status}`);
          }
        } catch (xmlErr) {
          addLog(`CONNECT_GCS: XML connection blocked/CORS error. Switching to JSON API proxy fallback...`);
          try {
            const response = await fetch(`https://storage.googleapis.com/storage/v1/b/${bucketName}/o`);
            if (response.ok) {
              const data = await response.json();
              const itemsList = data.items || [];
              itemsList.forEach((item: any) => {
                const key = item.name;
                if (key && key.match(/\.(mov|mp4|avi|mpeg|mpg|wmv)$/i)) {
                  foundKeys.push(key);
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

        if (foundKeys.length === 0) {
          addLog(`GCS_SCAN: No video clips detected in gs://${bucketName}`);
          setIsScanning(false);
          return;
        }

        addLog(`GCS_SCAN: Detected ${foundKeys.length} files in bucket. Recalibrating VHS rack...`);

        // Sort: topSongsOrder strictly first in exact order, then other keys
        const sortedKeys = [...topSongsOrder.filter(tk => foundKeys.includes(tk))];
        const otherKeys = foundKeys.filter(k => !topSongsOrder.includes(k));
        const combinedKeys = [...sortedKeys, ...otherKeys];

        const mappedVideos = combinedKeys.map((key, idx) => {
          // Check if it's already in our current state list to preserve descriptions/tags
          const existing = videos.find(v => v.fileName === key);
          const { title, artist } = formatVideoMetadata(key);
          
          let tag = 'VOX';
          if (key.includes('Glitch') || key.includes('glitch')) tag = 'GLITCH';
          else if (key.includes('Phish') || key.includes('Live')) tag = 'LIVE';
          else if (key.includes('Pepa') || key === 'Whatta_Man_by_Salt_n_Pepa.mov') tag = 'FAV';
          else if (key.includes('Conchords') || key.includes('Unk')) tag = 'BEATS';
          else if (key.includes('Dresden')) tag = 'PUNK';

          return {
            id: existing?.id || `gcs-${idx}-${key.substring(0, 8)}`,
            title: title, // Always prioritize the real filename title!
            artist: artist, // Always prioritize the real filename artist!
            desc: existing?.desc || (artist ? `Tape extracted with title: "${title}" by ${artist}.` : `GCS tape clip: "${title}".`),
            fileName: key,
            duration: existing?.duration || '3:30',
            tag: existing?.tag || tag
          };
        });

        setVideos(mappedVideos);
        localStorage.setItem('astraltrash_karaoke_bucket_videos', JSON.stringify(mappedVideos));
        
        // Auto-select Whatta Man or the first video if selection is invalid
        const stillExists = mappedVideos.find(v => v.fileName === selectedVideo.fileName);
        if (!stillExists && mappedVideos.length > 0) {
          setSelectedVideo(mappedVideos[0]);
        }
        addLog(`GCS_SCAN_SUCCESS: Loaded ${mappedVideos.length} cassette tapes into memory.`);
      } catch (err: any) {
        if (active) {
          addLog(`GCS_SCAN_WARNING: Could not fetch public directory list (${err.message}). Using offline backup rack.`);
        }
      } finally {
        if (active) {
          setIsScanning(false);
        }
      }
    };

    scanBucket();
    return () => {
      active = false;
    };
  }, [bucketName]);

  useEffect(() => {
    if (preselectedVideoFileName) {
      const found = videos.find(v => v.fileName === preselectedVideoFileName || v.fileName.includes(preselectedVideoFileName));
      if (found) {
        setSelectedVideo(found);
        setIsPlaying(false);
        addLog(`VCR_AUTO_LINK_LOAD: Loaded ${found.title}`);
        
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
      }
      if (clearPreselectedVideoFileName) {
        clearPreselectedVideoFileName();
      }
    }
  }, [preselectedVideoFileName, videos, clearPreselectedVideoFileName]);

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
    setEditArtist(video.artist || '');
    setEditFileName(video.fileName);
    setEditDesc(video.desc);
    setEditDuration(video.duration || '3:30');
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
          artist: editArtist,
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
      title: 'New Custom Recording',
      artist: 'Self',
      desc: 'Manual dither recording file path',
      fileName: 'new_recording.mov',
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
      <div className="border-b border-[#FF6B00]/40 pb-6 mb-2 space-y-4">
        {/* Top Status Row */}
        <div className="flex justify-between items-center text-xs">
          <div className="flex items-center gap-1.5 font-mono text-[10px] text-[#39FF14]">
            {isScanning ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>GCS LIST SCANNING...</span>
              </>
            ) : (
              <span className="text-zinc-600">VCR STANDBY</span>
            )}
          </div>
          <div className="bg-black/60 border border-[#FF6B00]/40 px-3 py-1 font-mono text-[10px] text-[#FF6B00] uppercase tracking-widest">
            VCR MODEM: ACTIVE
          </div>
        </div>

        {/* Centered Main Header */}
        <div className="text-center space-y-3">
          <h1 className="text-center uppercase select-none">
            SHITTY KARAOKE TIME
          </h1>
          <p className="text-[10px] sm:text-xs md:text-sm lg:text-base text-[#FF6B00] font-sans font-black tracking-tighter md:tracking-tight mx-auto max-w-full whitespace-nowrap overflow-x-auto py-1 uppercase scrollbar-thin select-all">
            I'm not THE BEST singer but, this is MY site &amp; i can put ANYTHING I WANT to here, so.... IT'S SHITTY KARAOKE TIME!
          </p>
        </div>
      </div>

      {/* Grid: Player Area (Left) & Current Case Details (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* TV CRT Screen Box (Vertical 9:16 aspect ratio) */}
        <div className="lg:col-span-6 md:col-span-6 space-y-4">
          <div className="relative border-4 border-zinc-900 bg-black shadow-[0_0_35px_rgba(255,107,0,0.15)] p-2 rounded-2xl overflow-hidden aspect-[9/16] w-full max-w-[340px] mx-auto flex flex-col justify-between">
            {/* Ambient Scanline Filter */}
            <div className="absolute inset-0 pointer-events-none z-10 bg-scanlines opacity-10" />
            
            {/* TV Screen Heading HUD */}
            <div className="flex justify-between items-center text-[10px] font-mono text-zinc-400 p-2 border-b border-zinc-950 bg-[#050505]/80 z-20">
              <div className="flex items-center gap-1.5">
                <span className="text-[#FF6B00] animate-pulse">● PLAY_MONITOR</span>
              </div>
              <div className="text-right text-[#39FF14]">
                {isPlaying ? '📼 PLAYING' : '📼 STANDBY'}
              </div>
            </div>

            {/* Main Video Element (Fills vertical screen perfectly with object-contain) */}
            <div className="flex-grow bg-black relative flex items-center justify-center overflow-hidden z-10">
              <video
                id="karaoke-media"
                ref={videoRef}
                src={activeUrl}
                playsInline
                controls
                width={resolution === '480p' ? 480 : resolution === '720p' ? 720 : undefined}
                className="w-full h-full object-contain bg-black z-10"
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
              />
              
              {!isPlaying && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm pointer-events-none z-0 p-4 text-center">
                  <div className="font-mono text-[11px] text-[#FF6B00] tracking-widest uppercase mb-1">
                    [ SLOTTED: {selectedVideo.title} ]
                  </div>
                  <div className="text-[9px] text-zinc-500 font-mono">
                    Press Play below or inside screen to spin tape
                  </div>
                </div>
              )}
            </div>

            {/* TV Bezel Control Strip (Clean VCR mechanical key) */}
            <div className="flex items-center justify-center border-t border-zinc-950 p-2.5 bg-[#030303] z-20">
              <button
                onClick={handlePlayPause}
                className={`w-full py-2 text-xs font-mono font-bold border transition-all flex items-center justify-center gap-2 ${
                  isPlaying 
                    ? 'bg-[#FF2BD6] text-black border-[#FF2BD6]' 
                    : 'bg-black text-[#39FF14] border-[#39FF14]/40 hover:border-[#39FF14] hover:bg-[#39FF14]/10'
                }`}
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                <span>{isPlaying ? 'STOP TAPE' : 'SPIN TAPE'}</span>
              </button>
            </div>
          </div>

          {/* VCR Stream Quality Resolution Dial (Optimizes GPU decoding overhead) */}
          <div className="bg-zinc-950 border border-zinc-900 rounded-lg p-3 max-w-[340px] mx-auto w-full space-y-2">
            <div className="flex justify-between items-center text-[9px] font-mono text-zinc-500 uppercase tracking-widest">
              <span>📺 CRT Resolution Engine</span>
              <span className="text-[#39FF14] font-bold">MODE: {resolution}</span>
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              {(['480p', '720p', '1080p'] as const).map((res) => (
                <button
                  key={res}
                  onClick={() => {
                    setResolution(res);
                    playChime('sine', res === '480p' ? 0.85 : res === '720p' ? 1.05 : 1.25);
                    addLog(`RESOLVE_SHIFT: Swapped decoder resolution ceiling to ${res}`);
                  }}
                  className={`py-1.5 px-1.5 border font-mono text-[9px] font-bold rounded transition-all text-center ${
                    resolution === res
                      ? 'bg-[#FF6B00] text-black border-[#FF6B00]'
                      : 'bg-black text-zinc-400 border-zinc-850 hover:border-zinc-700 hover:text-white'
                  }`}
                >
                  <span>{res === '480p' ? '480p (FAST)' : res === '720p' ? '720p (VHS)' : '1080p (HQ)'}</span>
                </button>
              ))}
            </div>
            <p className="text-[8px] text-zinc-500 font-mono leading-normal">
              * Caps browser hardware decode canvas size to minimize buffer lag & stuttering on slower computers.
            </p>
          </div>

          {/* External Action Row (Direct Fallbacks - perfectly centered below player) */}
          <div className="flex gap-2 justify-center max-w-[340px] mx-auto w-full">
            <button
              onClick={() => {
                playChime('triangle', 1.0);
                window.open(activeUrl, '_blank');
              }}
              className="flex-1 py-2 bg-black border border-zinc-850 hover:border-zinc-600 text-zinc-300 hover:text-white font-mono text-[10px] uppercase transition-all flex items-center justify-center gap-1.5 rounded-lg"
            >
              <span>🔗 Open in New Tab</span>
            </button>
            <a
              href={activeUrl}
              download
              className="flex-1 py-2 bg-black border border-zinc-850 hover:border-zinc-600 text-zinc-300 hover:text-white font-mono text-[10px] uppercase transition-all flex items-center justify-center gap-1.5 rounded-lg text-center"
            >
              <span>📥 Download File</span>
            </a>
          </div>
        </div>

        {/* Right Sidebar: Active Cassette Sleeve, Metadata & Options */}
        <div className="lg:col-span-6 md:col-span-6 flex flex-col justify-center items-center text-center py-2 space-y-12 h-full md:pt-24 md:pb-12">
          <div className="space-y-8 w-full max-w-2xl">
            <div className="flex items-center justify-center gap-3">
              <span className="text-xs font-mono font-bold text-[#FF6B00] bg-[#FF6B00]/10 px-2.5 py-1 rounded border border-[#FF6B00]/30 tracking-widest">
                {selectedVideo.tag || 'VOX'}
              </span>
              <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
                // CRITICAL PLAYBACK MEDIA
              </span>
            </div>

            <div className="space-y-6">
              {/* Song Title in Header Font (Jersey 10) */}
              <h2 
                className="jersey-10-regular text-6xl sm:text-7xl md:text-8xl lg:text-9xl text-white font-normal uppercase tracking-wider leading-none select-all animate-pulse-subtle text-center mx-auto"
                style={{
                  textShadow: '0 0 15px rgba(255,107,0,0.5), 0 0 30px rgba(255,107,0,0.25)',
                }}
              >
                {selectedVideo.title}
              </h2>

              {/* Artist Name in complementary pixelated/mono font */}
              <div className="space-y-3">
                {selectedVideo.artist && (
                  <h3 className="font-mono text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-[#39FF14] font-bold tracking-widest uppercase text-center">
                    by {selectedVideo.artist}
                  </h3>
                )}
                {/* Karaoke Cover indicator */}
                <div className="font-mono text-sm sm:text-base md:text-lg lg:text-xl text-[#FF2BD6]/90 tracking-[0.3em] uppercase font-bold text-center">
                  ░ Karaoke Cover ░
                </div>
              </div>

              {/* Sleeve Description (Spaced out, stylized) */}
              {selectedVideo.desc && (
                <div className="pt-6 border-t border-zinc-900/40 w-full max-w-xl mx-auto">
                  <p className="text-zinc-400 text-sm sm:text-base leading-relaxed font-mono italic text-center px-4">
                    "{selectedVideo.desc}"
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Bottom metadata details & compatibility warning */}
          <div className="space-y-6 w-full max-w-2xl">
            <div className="flex flex-wrap gap-x-6 gap-y-2 justify-center text-[10px] sm:text-xs font-mono text-zinc-500 pt-6 border-t border-zinc-900/60 w-full">
              <div>[ FILE: <span className="text-zinc-400 break-all">{selectedVideo.fileName}</span> ]</div>
              <div>[ TIME: <span className="text-zinc-400">{selectedVideo.duration || '3:30'}</span> ]</div>
              <div>[ DECODER: <span className="text-zinc-400 font-semibold">{resolution}</span> ]</div>
            </div>

            {/* Browser Compatibility Notice */}
            <div className="bg-zinc-950/40 border border-zinc-900/50 p-3.5 rounded-xl max-w-xl mx-auto text-center">
              <p className="text-[10px] text-zinc-500 leading-normal font-mono">
                💡 <span className="text-zinc-400 font-bold">CODEC ADVISORY</span>: If the player displays a blank screen or audio-only, click the <span className="text-[#FF6B00]">"Open in New Tab"</span> button to view the clip instantly, or download it to play locally.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Cassette Tape Storage Shelf */}
      <div className="border border-zinc-900 bg-black/25 p-6 rounded-2xl space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-zinc-900 pb-3 gap-2">
          <div>
            <h3 className="text-base font-bold font-mono text-white uppercase tracking-wider">📦 MAGNETIC CASSETTE STORAGE SHELF</h3>
            <p className="text-[10px] text-zinc-500 font-mono uppercase">
              Current storage shelf capacity: {videos.length} cassettes loaded
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => {
                setIsEditingDeck(!isEditingDeck);
                playChime('sine', 1.0);
              }}
              className="text-xs font-mono font-bold px-3 py-1 bg-black border border-zinc-800 hover:border-zinc-600 text-zinc-300 hover:text-white transition-all flex items-center gap-1.5 rounded-md"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>{isEditingDeck ? '🔒 CLOSE DECK MANAGER' : '⚙️ DECK CONFIG MANAGER'}</span>
            </button>
            <button
              onClick={createVideo}
              className="text-xs font-mono font-bold px-3 py-1 bg-[#39FF14]/10 border border-[#39FF14]/40 hover:border-[#39FF14] text-[#39FF14] transition-all flex items-center gap-1.5 rounded-md"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>RECORD_NEW_TAPE</span>
            </button>
          </div>
        </div>

        {/* Deck Config Editor Panel */}
        {isEditingDeck && (
          <div className="bg-[#050505] border border-zinc-900 p-4 rounded-xl space-y-4 animate-fade-in">
            <div className="flex justify-between items-center border-b border-zinc-950 pb-2">
              <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">⚙️ VHS Deck Setup Controls</span>
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
                      addLog(`BUCKET_SCAN: Re-connecting to GCS bucket gs://${bucketName}`);
                      playChime('sine', 1.0);
                    }}
                    className="bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-white px-3 py-1.5 text-xs font-mono font-bold"
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
                  <div className="md:col-span-3">
                    <label className="text-[9px] text-zinc-500 block mb-1">SONG TITLE / LABEL</label>
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-850 p-2 text-white text-xs rounded outline-none focus:border-[#FF2BD6]"
                    />
                  </div>

                  <div className="md:col-span-3">
                    <label className="text-[9px] text-zinc-500 block mb-1">ORIGINAL ARTIST</label>
                    <input
                      type="text"
                      value={editArtist}
                      onChange={(e) => setEditArtist(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-850 p-2 text-white text-xs rounded outline-none focus:border-[#FF2BD6]"
                    />
                  </div>

                  <div className="md:col-span-4">
                    <label className="text-[9px] text-zinc-500 block mb-1">GCS FILENAME / OBJECT PATH</label>
                    <input
                      type="text"
                      value={editFileName}
                      onChange={(e) => setEditFileName(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-850 p-2 text-white text-xs rounded outline-none focus:border-[#FF2BD6]"
                    />
                  </div>

                  <div className="md:col-span-1">
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
                    className="bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white px-3 py-1 rounded text-xs"
                  >
                    CANCEL
                  </button>
                  <button
                    onClick={saveEdit}
                    className="bg-[#FF2BD6] hover:bg-[#FF2BD6]/80 text-black font-bold px-4 py-1 rounded text-xs"
                  >
                    SAVE CHANGES
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* RACK VHS GRID LAYOUT */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3">
          {videos.map((item, index) => {
            const isCurrent = selectedVideo.id === item.id;
            const isHovered = hoveredId === item.id;
            
            return (
              <div
                key={item.id}
                onMouseEnter={() => setHoveredId(item.id)}
                onMouseLeave={() => setHoveredId(null)}
                onClick={() => loadTape(item)}
                className={`group border relative transition-all rounded-lg overflow-hidden flex flex-col justify-between cursor-pointer ${
                  isCurrent
                    ? 'border-[#39FF14] bg-[#39FF14]/5 shadow-[0_0_15px_rgba(57,255,20,0.12)]'
                    : 'border-zinc-900 bg-black/60 hover:border-zinc-700 hover:bg-black/80'
                }`}
              >
                {/* Visual cassette top labels */}
                <div className="p-2 space-y-1.5">
                  <div className="flex justify-between items-center text-[8px] font-mono">
                    <span className="text-zinc-500 font-semibold tracking-wider">CASSETTE</span>
                    <span className={`px-1 py-0.5 rounded text-[7px] font-bold ${
                      isCurrent ? 'bg-[#39FF14]/20 text-[#39FF14]' : 'bg-zinc-900 text-zinc-400'
                    }`}>
                      {item.tag || 'VOX'}
                    </span>
                  </div>

                  {/* Real Video Thumbnail Art with Lazy-Preview */}
                  <div className="aspect-[16/10] bg-zinc-950 border border-zinc-900 rounded relative overflow-hidden flex items-center justify-center group-hover:border-zinc-700 transition-all">
                    {isHovered ? (
                      <video
                        src={getResolvedUrl(item.fileName)}
                        preload="auto"
                        playsInline
                        muted
                        autoPlay
                        loop
                        className="absolute inset-0 w-full h-full object-cover opacity-100 transition-opacity duration-300"
                      />
                    ) : (
                      // Performance Optimization: #t=1 requests a single poster frame, avoiding concurrent decode streams
                      <video
                        src={getResolvedUrl(item.fileName) + '#t=1'}
                        preload="none"
                        playsInline
                        muted
                        className="absolute inset-0 w-full h-full object-cover opacity-60 transition-opacity duration-300 pointer-events-none"
                      />
                    )}
                    
                    {/* Tiny cassette tape reels on top corner for that retro mechanical flavor */}
                    <div className="absolute top-1 left-1.5 flex gap-1 items-center bg-black/75 px-1 py-0.5 rounded border border-zinc-900 text-[6px] text-zinc-500 font-mono tracking-tighter z-10">
                      <div className={`w-1.5 h-1.5 rounded-full border border-zinc-700 ${
                        isHovered || (isCurrent && isPlaying) ? 'animate-spin' : ''
                      }`} style={{ animationDuration: '3s' }} />
                      <div className={`w-1.5 h-1.5 rounded-full border border-zinc-700 ${
                        isHovered || (isCurrent && isPlaying) ? 'animate-spin' : ''
                      }`} style={{ animationDuration: '3s' }} />
                      <span>{isHovered ? 'PREVIEW' : 'REEL'}</span>
                    </div>

                    {/* Scanning CRT Grid Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent h-[150%] pointer-events-none opacity-25 z-10" />
                  </div>

                  {/* Handwritten label sticker */}
                  <div className="bg-zinc-100 border border-zinc-200 text-zinc-950 p-1.5 font-mono text-[10px] leading-tight select-none rotate-[-0.5deg] shadow-[1px_2px_4px_rgba(0,0,0,0.15)] h-[52px] flex flex-col justify-between">
                    <div className="font-bold uppercase tracking-wider truncate" title={item.title}>
                      {item.title}
                    </div>
                    {item.artist && (
                      <div className="text-[8px] text-zinc-600 truncate italic">
                        by {item.artist}
                      </div>
                    )}
                    <div className="text-[7px] text-zinc-500 flex justify-between border-t border-zinc-200/50 pt-0.5 mt-0.5">
                      <span>TIME: {item.duration || '3:30'}</span>
                      <span className="opacity-60"># {index + 1}</span>
                    </div>
                  </div>
                </div>

                {/* Cassette Action Controls */}
                <div className="p-1.5 border-t border-zinc-950 bg-black/40 space-y-1">
                  <div className="flex gap-1">
                    <button
                      onClick={(e) => { e.stopPropagation(); loadTape(item); }}
                      className={`flex-grow py-1 px-1 border text-[9px] uppercase font-mono font-bold transition-all flex items-center justify-center gap-1 ${
                        isCurrent
                          ? 'bg-[#39FF14] text-black border-[#39FF14]'
                          : 'bg-black text-[#39FF14] border-[#39FF14]/40 hover:border-[#39FF14] hover:bg-[#39FF14]/10'
                      }`}
                    >
                      <span>{isCurrent ? 'ACTIVE' : 'PLAY NOW'}</span>
                    </button>

                    <button
                      onClick={(e) => { e.stopPropagation(); startEditing(item); }}
                      className="p-1 border border-zinc-900 hover:border-zinc-700 hover:text-white bg-black/80 transition-all rounded text-zinc-400"
                      title="Edit labels"
                    >
                      <Settings className="w-3 h-3" />
                    </button>

                    <button
                      onClick={(e) => { e.stopPropagation(); deleteVideo(item.id); }}
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
                      onClick={(e) => { e.stopPropagation(); moveTape(index, 'left'); }}
                      className={`px-1 py-0.5 border flex-grow text-center transition-all ${
                        index === 0
                          ? 'border-zinc-950 text-zinc-800 cursor-not-allowed'
                          : 'border-zinc-900 hover:border-zinc-700 text-zinc-500 hover:text-zinc-300'
                      }`}
                    >
                      ◀ MOVE
                    </button>
                    <button
                      disabled={index === videos.length - 1}
                      onClick={(e) => { e.stopPropagation(); moveTape(index, 'right'); }}
                      className={`px-1 py-0.5 border flex-grow text-center transition-all ${
                        index === videos.length - 1
                          ? 'border-zinc-950 text-zinc-800 cursor-not-allowed'
                          : 'border-zinc-900 hover:border-zinc-700 text-zinc-500 hover:text-zinc-300'
                      }`}
                    >
                      MOVE ▶
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

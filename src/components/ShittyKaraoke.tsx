import React, { useState, useRef, useEffect } from 'react';
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

// Mounts children only once the wrapper scrolls near the viewport, so the
// cassette shelf doesn't fire two dozen GCS video fetches on page load.
function LazyMount({ children, placeholder }: { children: React.ReactNode; placeholder?: React.ReactNode }) {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    // Graceful fallback for environments without IntersectionObserver.
    if (typeof IntersectionObserver === 'undefined') {
      setVisible(true);
      return;
    }
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setVisible(true);
        obs.disconnect();
      }
    }, { rootMargin: '200px' });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return <div ref={ref} className="absolute inset-0">{visible ? children : placeholder || null}</div>;
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
    <div
      className="frame py-8 animate-fade-in"
      id="karaoke-mainframe"
      style={{ '--cab-tick': 'rgba(255,107,0,.35)' } as any}
    >
      {/* Cabinet design-system CSS, kept local to this page so it works on
          its own (the shared cab-* rules live inline in the Projects tab too). */}
      <style>{`
/* ============ CABINET DESIGN SYSTEM (shared by PROJECTS + SHADERSLOP tabs) ============ */
/* Per-element accents come from --mc / --mc-soft / --mc-faint CSS vars set inline. */
.cab-title{font-family:'Pixelmania','Bitcount Prop Double','Chakra Petch',sans-serif;font-size:clamp(1.15rem,3.4vw,2.3rem);color:#fff;line-height:1.4;letter-spacing:.05em;text-transform:uppercase;padding:.35em 0;text-shadow:3px 0 0 rgba(255,43,214,.8),-3px 0 0 rgba(0,240,255,.8)}
.cab-title:hover{animation:jitter 4s infinite}
.cab-dings{font-family:'StarThings','CircleThings2',sans-serif;font-size:22px;letter-spacing:.35em;line-height:1;user-select:none;white-space:nowrap;overflow:hidden}
.cab-dings-circle{font-family:'CircleThings2','StarThings',sans-serif}
.cab-squigs{font-family:'Slsquiggles',sans-serif;font-size:20px;letter-spacing:.3em;line-height:1;user-select:none;white-space:nowrap;overflow:hidden}
.cab-pixlabel{font-family:'Dogica Pixel','Silkscreen',monospace;font-size:8px;letter-spacing:.16em;text-transform:uppercase}
.cab-blink{animation:cab-blink 1.1s steps(2,start) infinite}
@keyframes cab-blink{0%,55%{opacity:1}56%,100%{opacity:0}}
.cab-rainbow{height:4px;background:repeating-linear-gradient(90deg,#FF2BD6 0 44px,#EFFF04 44px 88px,#39FF14 88px 132px,#00F0FF 132px 176px,#9D4DFF 176px 220px);animation:cab-slide 5s linear infinite}
@keyframes cab-slide{to{background-position:220px 0}}
.cab-ticker{overflow:hidden;white-space:nowrap;border-top:1px dashed var(--cab-tick,rgba(255,107,0,.35));border-bottom:1px dashed var(--cab-tick,rgba(255,107,0,.35));padding:5px 0;font-family:'Share Tech Mono',monospace;font-size:11px;letter-spacing:.16em;background:rgba(0,0,0,.5)}
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
.cab-ctl.is-active{background:var(--mc);color:#000;box-shadow:0 0 14px var(--mc)}
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
.cab-select{background:rgba(0,0,0,.75);border:1px solid var(--mc-soft);color:var(--mc);font-family:'Share Tech Mono',monospace;font-size:10px;letter-spacing:.06em;padding:7px 8px;width:100%;outline:none;cursor:crosshair;transition:all .2s}
.cab-select:hover,.cab-select:focus{border-color:var(--mc);box-shadow:0 0 12px var(--mc-faint)}
.cab-panel{position:relative;border:2px solid var(--mc-soft);background:var(--cab-panel-bg,rgba(20,0,17,.92));overflow:hidden}
      `}</style>

      {/* ================= 1. HEADER ================= */}
      <div className="text-center space-y-5 pt-4 pb-2">
        <div className="cab-dings text-[#FF6B00] opacity-90" aria-hidden="true">
          QRSTUVWXYZABCDEFGHIJKLMNOPQRSTUVWXYZ
        </div>
        <h1 className="cab-title select-none">
          Shitty Karaoke Time
        </h1>
        <p
          className="text-[11px] sm:text-xs text-[#FF6B00] max-w-3xl mx-auto uppercase tracking-[0.15em] font-bold leading-relaxed"
          style={{ fontFamily: "'Silkscreen', monospace" }}
        >
          🎤 I'm not THE BEST singer but, this is MY site &amp; i can put ANYTHING I WANT to here, so.... IT'S SHITTY KARAOKE TIME! 🎤
        </p>
        <div className="cab-squigs text-[#39FF14] opacity-80" aria-hidden="true">
          mnopqrstuvwxyzabcdefghijklmnopqrstuv
        </div>
        <div className="flex justify-center items-center flex-wrap gap-x-3 gap-y-1 text-[10px] text-zinc-500 font-mono uppercase tracking-widest pt-1">
          <span>VCR_MODEM: ACTIVE</span>
          <span>•</span>
          <span>{videos.length} CASSETTES ON SHELF</span>
          {isScanning && (
            <span className="text-[#39FF14] animate-pulse font-bold flex items-center gap-1">
              <RefreshCw className="w-3 h-3 animate-spin" /> [SCANNING GCS RACK...]
            </span>
          )}
        </div>
      </div>

      {/* Rainbow strip + prompt row */}
      <div className="flex flex-col gap-2 mt-4 mb-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div
            className="select-none uppercase text-[#FF6B00]"
            style={{
              fontFamily: "'Jersey 10', sans-serif",
              fontSize: 24,
              letterSpacing: '.1em',
              textShadow: '0 0 16px rgba(255,107,0,.55), 2px 0 0 rgba(255,43,214,.5), -2px 0 0 rgba(0,240,255,.5)'
            }}
          >
            ▚▚ Insert Tape To Sing <span className="cab-blink">█</span>
          </div>
          <div className="hidden md:flex items-center gap-2 font-mono text-[9px] text-zinc-500 uppercase tracking-widest">
            <span className="cab-blink text-[#39FF14]">●</span> DECK_B READY // MIC IS HOT
          </div>
        </div>
        <div className="cab-rainbow" />
      </div>

      {/* Scrolling system chatter */}
      <div className="cab-ticker text-[#ffc59e] mb-8 select-none" aria-hidden="true">
        <div className="cab-ticker-inner">
          <span>✦ {videos.length} CASSETTES LOADED ✦ SINGING: MANDATORY ✦ TALENT: OPTIONAL ✦ ALL TAPES SLIGHTLY CHEWED ✦ REWIND BEFORE RETURNING ✦ NO ADS ✦ NO ALGORITHM ✦ 100% HANDMADE SLOP ✦ BE KIND TO YOUR NEIGHBORS' EARS&nbsp;</span>
          <span>✦ {videos.length} CASSETTES LOADED ✦ SINGING: MANDATORY ✦ TALENT: OPTIONAL ✦ ALL TAPES SLIGHTLY CHEWED ✦ REWIND BEFORE RETURNING ✦ NO ADS ✦ NO ALGORITHM ✦ 100% HANDMADE SLOP ✦ BE KIND TO YOUR NEIGHBORS' EARS&nbsp;</span>
        </div>
      </div>

      {/* ================= 2. VCR STATION: TV (left) + Now Playing marquee (right) ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 items-stretch mb-12">

        {/* TV CRT cabinet */}
        <div
          className="lg:col-span-5 cab-panel p-4"
          style={{
            '--mc': '#FF6B00',
            '--mc-soft': 'rgba(255,107,0,.4)',
            '--mc-faint': 'rgba(255,107,0,.13)',
            '--cab-panel-bg': 'rgba(26,10,0,.92)'
          } as any}
        >
          <div className="cab-dither" />
          <span className="cab-corner" style={{ top: 3, left: 6 }}>╔</span>
          <span className="cab-corner" style={{ top: 3, right: 6 }}>╗</span>
          <span className="cab-corner" style={{ bottom: 4, left: 6 }}>╚</span>
          <span className="cab-corner" style={{ bottom: 4, right: 6 }}>╝</span>

          <div className="relative space-y-3">
            <div className="flex justify-between items-center gap-2 border-b pb-2.5" style={{ borderColor: 'var(--mc-faint)' }}>
              <span className="cab-chip"><i className="cab-led" />PLAY_MONITOR</span>
              <span className="cab-pixlabel" style={{ color: isPlaying ? '#39FF14' : 'var(--mc)' }}>
                {isPlaying ? '📼 PLAYING' : '📼 STANDBY'}
              </span>
            </div>

            {/* The screen — vertical tape format */}
            <div className="relative bg-black border-2 aspect-[9/16] w-full max-w-[320px] mx-auto flex items-center justify-center overflow-hidden" style={{ borderColor: 'var(--mc-soft)' }}>
              <video
                ref={videoRef}
                src={activeUrl}
                controls
                width={resolution === '480p' ? 480 : resolution === '720p' ? 720 : undefined}
                className="w-full h-full object-contain bg-black relative z-10"
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
              />
              {!isPlaying && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm pointer-events-none z-0 p-4 text-center">
                  <div className="font-mono text-[11px] text-[#FF6B00] tracking-widest uppercase mb-1">
                    [ SLOTTED: {selectedVideo.title} ]
                  </div>
                  <div className="text-[9px] text-zinc-500 font-mono uppercase">
                    press play to spin tape
                  </div>
                </div>
              )}
            </div>

            {/* Big mechanical play key */}
            <div className="flex justify-center">
              <button
                onClick={handlePlayPause}
                className="cab-boot-btn w-full max-w-[320px] justify-center"
                style={isPlaying
                  ? { '--mc': '#FF2BD6' } as any
                  : { '--mc': '#39FF14' } as any}
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
                {isPlaying ? 'STOP TAPE' : '⚡ SPIN TAPE'}
              </button>
            </div>

            {/* Resolution dial + fallbacks */}
            <div className="space-y-2 max-w-[320px] mx-auto w-full">
              <div className="flex justify-between items-center text-[9px] font-mono text-zinc-500 uppercase tracking-widest">
                <span>📺 CRT RESOLUTION ENGINE</span>
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
                    className={`cab-ctl ${resolution === res ? 'is-active' : ''}`}
                  >
                    {res === '480p' ? '480 FAST' : res === '720p' ? '720 VHS' : '1080 HQ'}
                  </button>
                ))}
              </div>
              <div className="flex gap-1.5">
                <button
                  onClick={() => {
                    playChime('triangle', 1.0);
                    window.open(activeUrl, '_blank', 'noopener,noreferrer');
                  }}
                  className="cab-ctl flex-1"
                  style={{ '--mc': '#00F0FF', '--mc-soft': 'rgba(0,240,255,.4)' } as any}
                >
                  🔗 NEW TAB
                </button>
                <a
                  href={activeUrl}
                  download
                  className="cab-ctl flex-1"
                  style={{ '--mc': '#00F0FF', '--mc-soft': 'rgba(0,240,255,.4)' } as any}
                >
                  📥 DOWNLOAD
                </a>
              </div>
              <p className="text-[8px] text-zinc-600 font-mono leading-normal uppercase">
                💡 CODEC ADVISORY: blank screen or audio-only? hit NEW TAB or DOWNLOAD — some raw tapes are too shitty even for this vcr.
              </p>
            </div>
          </div>
        </div>

        {/* NOW PLAYING — floats directly on the page background, no box */}
        <div className="lg:col-span-7 flex flex-col justify-center">
          <div
            className="text-center space-y-6 py-6"
            style={{ '--mc': '#FF2BD6', '--mc-soft': 'rgba(255,43,214,.4)', '--mc-faint': 'rgba(255,43,214,.13)' } as any}
          >
            <div className="flex items-center justify-center gap-2 flex-wrap">
              <span className="cab-chip"><i className="cab-led" />NOW_PLAYING</span>
              <span
                className="cab-chip"
                style={{ '--mc': '#FF6B00', '--mc-soft': 'rgba(255,107,0,.4)', '--mc-faint': 'rgba(255,107,0,.13)' } as any}
              >
                {selectedVideo.tag || 'VOX'}
              </span>
              <span className="cab-eq" aria-hidden="true"><i /><i /><i /><i /><i /></span>
            </div>

            <h2
              className="jersey-10-regular text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-white font-normal uppercase tracking-wider leading-none select-all"
              style={{ textShadow: '3px 0 0 rgba(255,43,214,.95), -3px 0 0 rgba(0,240,255,.95), 0 4px 16px rgba(0,0,0,.98), 0 0 32px rgba(255,107,0,.45)' }}
            >
              {selectedVideo.title}
            </h2>

            <div className="space-y-3">
              {selectedVideo.artist && (
                <h3
                  className="jersey-10-regular text-3xl sm:text-4xl md:text-5xl text-[#39FF14] font-normal tracking-wider uppercase leading-none"
                  style={{ textShadow: '0 3px 12px rgba(0,0,0,.98), 0 0 18px rgba(57,255,20,.55)' }}
                >
                  by {selectedVideo.artist}
                </h3>
              )}
              <div
                className="text-base sm:text-lg text-[#00F0FF] tracking-[0.3em] uppercase font-bold"
                style={{ fontFamily: "'Silkscreen', monospace", textShadow: '0 2px 10px rgba(0,0,0,.98), 0 0 14px rgba(0,240,255,.55)' }}
              >
                ░ KARAOKE COVER ░
              </div>
            </div>

            {selectedVideo.desc && (
              <p
                className="text-white text-lg sm:text-xl leading-relaxed max-w-xl mx-auto px-4 italic"
                style={{ fontFamily: "'Jersey 10', sans-serif", letterSpacing: '.03em', textShadow: '0 2px 10px rgba(0,0,0,.98), 0 0 6px rgba(0,0,0,.95)' }}
              >
                "{selectedVideo.desc}"
              </p>
            )}

            <div
              className="flex flex-wrap justify-center gap-x-6 gap-y-1 text-lg sm:text-xl uppercase pt-1"
              style={{ fontFamily: "'Jersey 10', sans-serif", letterSpacing: '.06em', textShadow: '0 2px 10px rgba(0,0,0,.98), 0 0 6px rgba(0,0,0,.95)' }}
            >
              <span className="text-white/70">FILE <span className="text-[#FF2BD6] break-all">{selectedVideo.fileName}</span></span>
              <span className="text-white/70">RUNTIME <span className="text-[#FF2BD6]">{selectedVideo.duration || '3:30'}</span></span>
              <span className="text-white/70">DECODER <span className="text-[#FF2BD6]">{resolution}</span></span>
            </div>
          </div>
        </div>
      </div>

      {/* ================= 3. CASSETTE SHELF ================= */}
      <div className="space-y-5">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div
            className="select-none uppercase text-[#FF6B00]"
            style={{
              fontFamily: "'Jersey 10', sans-serif",
              fontSize: 24,
              letterSpacing: '.1em',
              textShadow: '0 0 16px rgba(255,107,0,.55), 2px 0 0 rgba(255,43,214,.5), -2px 0 0 rgba(0,240,255,.5)'
            }}
          >
            ▚▚ Cassette Shelf <span className="cab-blink">█</span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => {
                setIsEditingDeck(!isEditingDeck);
                playChime('sine', 1.0);
              }}
              className={`cab-ctl ${isEditingDeck ? 'is-active' : ''}`}
              style={{ '--mc': '#EFFF04', '--mc-soft': 'rgba(239,255,4,.4)' } as any}
            >
              <Sliders className="w-3 h-3" /> {isEditingDeck ? 'CLOSE DECK MANAGER' : 'DECK MANAGER'}
            </button>
            <button
              onClick={createVideo}
              className="cab-ctl"
              style={{ '--mc': '#39FF14', '--mc-soft': 'rgba(57,255,20,.4)' } as any}
            >
              <Plus className="w-3 h-3" /> RECORD NEW TAPE
            </button>
          </div>
        </div>

        {/* Deck Config Editor Panel */}
        {isEditingDeck && (
          <div className="cab-console p-5 animate-fade-in">
            <div className="cab-console-dither" />
            <div className="relative space-y-4">
              <div className="flex justify-between items-center border-b border-[#EFFF04]/25 pb-2">
                <span className="flex items-center gap-2 text-[#EFFF04] font-bold uppercase tracking-[0.18em] text-xs" style={{ fontFamily: "'Silkscreen', monospace" }}>
                  <Settings className="w-4 h-4" /> VHS_DECK_SETUP
                </span>
                <button
                  onClick={handleReset}
                  className="cab-ctl"
                  style={{ '--mc': '#FF2B2B', '--mc-soft': 'rgba(255,43,43,.5)' } as any}
                >
                  <Trash2 className="w-3 h-3" /> FACTORY_RESET SHELF
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] text-zinc-400 block uppercase font-mono tracking-widest">📡 GCS Storage Bucket Name</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={bucketName}
                      onChange={(e) => {
                        setBucketName(e.target.value);
                        localStorage.setItem('astraltrash_karaoke_bucket_name', e.target.value);
                      }}
                      className="cab-key-input flex-grow"
                    />
                    <button
                      onClick={() => {
                        addLog(`BUCKET_SCAN: Re-connecting to GCS bucket gs://${bucketName}`);
                        playChime('sine', 1.0);
                      }}
                      className="cab-ctl"
                      style={{ '--mc': '#EFFF04', '--mc-soft': 'rgba(239,255,4,.4)' } as any}
                    >
                      SYNC
                    </button>
                  </div>
                  <span className="text-[9px] text-zinc-600 block leading-tight font-mono">
                    Default bucket is <span className="text-zinc-400">astraltrash_karaoke</span>. Set to yours to stream files directly — the bucket needs public read so browsers can play the files.
                  </span>
                </div>

                <div className="cab-specs" style={{ textTransform: 'none' }}>
                  <span className="font-bold text-zinc-400 uppercase tracking-widest text-[10px]">🔒 Bucket permission setup</span>
                  <p className="text-[9px] text-zinc-500 leading-normal">
                    Run this in your Google Cloud Console terminal to make files web-readable:
                  </p>
                  <div className="bg-black p-2 text-[10px] text-[#39FF14] font-mono select-all break-all border border-zinc-900">
                    gcloud storage buckets add-iam-policy-binding gs://astraltrash_karaoke --member=allUsers --role=roles/storage.objectViewer
                  </div>
                </div>
              </div>

              {/* Editing Slot Panel */}
              {editingVideoId && (
                <div className="border border-[#FF2BD6]/40 bg-black/60 p-4 space-y-3 animate-fade-in">
                  <div className="flex justify-between items-center text-[10px] text-[#FF2BD6] border-b border-[#FF2BD6]/20 pb-1.5 uppercase font-bold tracking-wider font-mono">
                    <span>🖋 EDITING TAPE STICKER LABELS (ID: {editingVideoId})</span>
                    <button onClick={() => setEditingVideoId(null)} className="text-zinc-500 hover:text-white font-sans text-sm">✕</button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5">
                    <div className="md:col-span-3">
                      <label className="text-[9px] text-zinc-500 block mb-1 font-mono uppercase">SONG TITLE / LABEL</label>
                      <input type="text" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} className="cab-key-input" />
                    </div>
                    <div className="md:col-span-3">
                      <label className="text-[9px] text-zinc-500 block mb-1 font-mono uppercase">ORIGINAL ARTIST</label>
                      <input type="text" value={editArtist} onChange={(e) => setEditArtist(e.target.value)} className="cab-key-input" />
                    </div>
                    <div className="md:col-span-4">
                      <label className="text-[9px] text-zinc-500 block mb-1 font-mono uppercase">GCS FILENAME / OBJECT PATH</label>
                      <input type="text" value={editFileName} onChange={(e) => setEditFileName(e.target.value)} className="cab-key-input" />
                    </div>
                    <div className="md:col-span-1">
                      <label className="text-[9px] text-zinc-500 block mb-1 font-mono uppercase">TIME</label>
                      <input type="text" value={editDuration} onChange={(e) => setEditDuration(e.target.value)} className="cab-key-input text-center" />
                    </div>
                    <div className="md:col-span-1">
                      <label className="text-[9px] text-zinc-500 block mb-1 font-mono uppercase">TAG</label>
                      <input type="text" value={editTag} onChange={(e) => setEditTag(e.target.value)} className="cab-key-input text-center" />
                    </div>
                    <div className="md:col-span-12">
                      <label className="text-[9px] text-zinc-500 block mb-1 font-mono uppercase">SLEEVE DESCRIPTION / CREDITS / NOTES</label>
                      <textarea value={editDesc} rows={2} onChange={(e) => setEditDesc(e.target.value)} className="cab-key-input resize-none" />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-2 border-t border-zinc-900">
                    <button onClick={() => setEditingVideoId(null)} className="cab-ctl" style={{ '--mc': '#888', '--mc-soft': 'rgba(140,140,140,.4)' } as any}>
                      CANCEL
                    </button>
                    <button onClick={saveEdit} className="cab-ctl is-active" style={{ '--mc': '#FF2BD6', '--mc-soft': 'rgba(255,43,214,.5)' } as any}>
                      SAVE CHANGES
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* RACK VHS GRID */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 items-start">
          {videos.map((item, index) => {
            const isCurrent = selectedVideo.id === item.id;
            const isHovered = hoveredId === item.id;
            const accent = isCurrent ? '#39FF14' : '#FF6B00';
            return (
              <div
                key={item.id}
                onMouseEnter={() => setHoveredId(item.id)}
                onMouseLeave={() => setHoveredId(prev => (prev === item.id ? null : prev))}
                onClick={() => loadTape(item)}
                className={`group cab-cart select-none flex flex-col ${isCurrent ? 'cab-maxed' : index % 2 === 0 ? 'cab-tilt-l' : 'cab-tilt-r'}`}
                style={{
                  '--mc': accent,
                  '--mc-soft': isCurrent ? 'rgba(57,255,20,.5)' : 'rgba(255,107,0,.35)',
                  '--mc-faint': isCurrent ? 'rgba(57,255,20,.14)' : 'rgba(255,107,0,.12)',
                  background: 'rgba(10,4,0,.92)',
                  ...(isCurrent ? { borderColor: '#39FF14', boxShadow: '0 0 22px rgba(57,255,20,.35)' } : {})
                } as any}
              >
                <div className="cab-dither" />
                <span className="cab-corner" style={{ top: 2, left: 5 }}>╔</span>
                <span className="cab-corner" style={{ top: 2, right: 5 }}>╗</span>

                <div className="relative p-2 space-y-1.5 flex-grow flex flex-col">
                  <div className="flex justify-between items-center">
                    <span className="cab-pixlabel text-zinc-500">CASSETTE_{String(index + 1).padStart(2, '0')}</span>
                    <span className="cab-chip">{item.tag || 'VOX'}</span>
                  </div>

                  {/* Tape window: lazy poster frame, live preview on hover */}
                  <div className="aspect-[16/10] bg-zinc-950 border relative overflow-hidden" style={{ borderColor: 'var(--mc-faint)' }}>
                    <LazyMount
                      placeholder={
                        <div className="absolute inset-0 flex items-center justify-center text-[7px] text-zinc-700 font-mono uppercase tracking-widest">
                          [TAPE_IN_RACK]
                        </div>
                      }
                    >
                      {isHovered ? (
                        <video
                          key="preview"
                          src={getResolvedUrl(item.fileName)}
                          preload="auto"
                          playsInline
                          muted
                          autoPlay
                          loop
                          className="absolute inset-0 w-full h-full object-cover"
                        />
                      ) : (
                        // #t=1 requests a single poster frame, avoiding concurrent decode streams
                        <video
                          key="poster"
                          src={getResolvedUrl(item.fileName) + '#t=1'}
                          preload="metadata"
                          playsInline
                          muted
                          className="absolute inset-0 w-full h-full object-cover opacity-60 pointer-events-none"
                        />
                      )}
                    </LazyMount>
                    <div className="absolute top-1 left-1.5 flex gap-1 items-center bg-black/75 px-1 py-0.5 border border-zinc-900 text-[6px] text-zinc-500 font-mono tracking-tighter z-10">
                      <div className={`w-1.5 h-1.5 rounded-full border border-zinc-700 ${isHovered || (isCurrent && isPlaying) ? 'animate-spin' : ''}`} style={{ animationDuration: '3s' }} />
                      <div className={`w-1.5 h-1.5 rounded-full border border-zinc-700 ${isHovered || (isCurrent && isPlaying) ? 'animate-spin' : ''}`} style={{ animationDuration: '3s' }} />
                      <span>{isHovered ? 'PREVIEW' : 'REEL'}</span>
                    </div>
                  </div>

                  {/* Handwritten label sticker */}
                  <div className="bg-zinc-100 border border-zinc-200 text-zinc-950 p-1.5 font-mono text-[10px] leading-tight select-none rotate-[-0.5deg] shadow-[1px_2px_4px_rgba(0,0,0,0.15)] min-h-[52px] flex flex-col justify-between">
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

                  {/* Controls */}
                  <div className="flex gap-1 mt-auto pt-1">
                    <button
                      onClick={(e) => { e.stopPropagation(); loadTape(item); }}
                      className={`cab-ctl flex-grow ${isCurrent ? 'is-active' : ''}`}
                    >
                      {isCurrent ? '▮ SLOTTED' : '⚡ PLAY'}
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); startEditing(item); setIsEditingDeck(true); }}
                      className="cab-ctl"
                      style={{ '--mc': '#EFFF04', '--mc-soft': 'rgba(239,255,4,.4)' } as any}
                      title="Edit labels"
                    >
                      <Settings className="w-3 h-3" />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); deleteVideo(item.id); }}
                      className="cab-ctl"
                      style={{ '--mc': '#FF2B2B', '--mc-soft': 'rgba(255,43,43,.4)' } as any}
                      title="Discard cassette"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                  <div className="flex gap-1 text-[9px] font-mono">
                    <button
                      disabled={index === 0}
                      aria-label={`Move ${item.title} left`}
                      onClick={(e) => { e.stopPropagation(); moveTape(index, 'left'); }}
                      className="cab-ctl flex-1 disabled:opacity-20 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:shadow-none"
                      style={{ '--mc': '#00F0FF', '--mc-soft': 'rgba(0,240,255,.35)' } as any}
                    >
                      ◀
                    </button>
                    <button
                      disabled={index === videos.length - 1}
                      aria-label={`Move ${item.title} right`}
                      onClick={(e) => { e.stopPropagation(); moveTape(index, 'right'); }}
                      className="cab-ctl flex-1 disabled:opacity-20 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:shadow-none"
                      style={{ '--mc': '#00F0FF', '--mc-soft': 'rgba(0,240,255,.35)' } as any}
                    >
                      ▶
                    </button>
                  </div>
                </div>

                <span className="cab-sticker">{isCurrent ? 'SINGING!!' : 'SING ME!!'}</span>
                <div className="cab-scan" />
              </div>
            );
          })}
        </div>
      </div>

      {/* ================= 4. VCR MODEM LOGS ================= */}
      <div
        className="cab-panel p-4 mt-10"
        style={{
          '--mc': '#39FF14',
          '--mc-soft': 'rgba(57,255,20,.35)',
          '--mc-faint': 'rgba(57,255,20,.1)',
          '--cab-panel-bg': 'rgba(2,10,1,.92)'
        } as any}
      >
        <div className="cab-dither" />
        <span className="cab-corner" style={{ top: 3, left: 6 }}>╔</span>
        <span className="cab-corner" style={{ top: 3, right: 6 }}>╗</span>
        <span className="cab-corner" style={{ bottom: 4, left: 6 }}>╚</span>
        <span className="cab-corner" style={{ bottom: 4, right: 6 }}>╝</span>
        <div className="relative font-mono text-[10px] text-[#FF6B00] space-y-1 max-h-[140px] overflow-y-auto custom-scrollbar">
          <div className="text-zinc-500 text-[9px] uppercase border-b pb-1 mb-2 tracking-widest flex justify-between" style={{ borderColor: 'var(--mc-faint)' }}>
            <span>KARAOKE_VCR_MODEM_LOGS</span>
            <span className="cab-blink text-[#39FF14]">●</span>
          </div>
          {terminalLogs.map((line, idx) => (
            <div key={idx} className="truncate">{line}</div>
          ))}
        </div>
      </div>

      {/* ================= 5. FOOTER ================= */}
      <div className="mt-12 text-center space-y-6 select-none">
        <div className="cab-dings text-[#FF6B00] opacity-80" aria-hidden="true">
          EFGHIJKLMNOPQRSTUVWXYZABCDEFGHIJKLMN
        </div>
        <div className="font-mono text-[10px] tracking-[.3em] text-zinc-600 uppercase">
          ── ✦ END_OF_SHELF // GO EMBARRASS YOURSELF BEAUTIFULLY ✦ ──
        </div>
      </div>
    </div>
  );
}

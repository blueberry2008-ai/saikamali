import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Music2, Volume2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Track } from '../types';

interface MusicPlayerProps {
  tracks: Track[];
  currentTrack: Track;
  onTrackChange: (track: Track) => void;
}

const MusicPlayer: React.FC<MusicPlayerProps> = ({ tracks, currentTrack, onTrackChange }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(() => setIsPlaying(false));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrack]);

  const toggleSidebar = () => {
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const duration = audioRef.current.duration;
      if (duration > 0) {
        setProgress((current / duration) * 100);
      }
    }
  };

  const handeEnded = () => {
    handleNext();
  };

  const handleNext = () => {
    const currentIndex = tracks.findIndex(t => t.id === currentTrack.id);
    const nextIndex = (currentIndex + 1) % tracks.length;
    onTrackChange(tracks[nextIndex]);
    setIsPlaying(true);
  };

  const handlePrev = () => {
    const currentIndex = tracks.findIndex(t => t.id === currentTrack.id);
    const prevIndex = (currentIndex - 1 + tracks.length) % tracks.length;
    onTrackChange(tracks[prevIndex]);
    setIsPlaying(true);
  };

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVal = parseFloat(e.target.value);
    setProgress(newVal);
    if (audioRef.current) {
      audioRef.current.currentTime = (newVal / 100) * audioRef.current.duration;
    }
  };

  return (
    <div className="w-full bg-white/5 border border-white/10 p-6 rounded-2xl backdrop-blur-md shadow-xl" id="music-player">
      <audio
        ref={audioRef}
        src={currentTrack.audioUrl}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handeEnded}
      />

      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-4">
          <motion.div 
            key={currentTrack.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-16 h-16 rounded bg-zinc-800 flex-shrink-0 overflow-hidden neon-border"
          >
            <img src={currentTrack.image} className="w-full h-full object-cover" alt="" />
          </motion.div>
          
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-bold neon-text-cyan truncate tracking-widest uppercase italic">{currentTrack.title}</h3>
            <p className="text-[9px] text-zinc-500 font-mono tracking-widest mt-1 uppercase">SOURCE // SYSTEM_AUDIO</p>
          </div>

          <button 
            id="play-pause-btn"
            onClick={toggleSidebar}
            className="w-10 h-10 flex items-center justify-center rounded-full text-black bg-[#00f3ff]"
            style={{ boxShadow: `0 0 15px rgba(0, 243, 255, 0.4)` }}
          >
            {isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" className="ml-1" />}
          </button>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1">
          <div className="h-1 bg-white/5 rounded-full overflow-hidden relative">
            <motion.div 
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#00f3ff] to-[#ff00e5]"
              style={{ width: `${progress}%` }}
            />
            <input
              type="range"
              value={progress}
              onChange={handleProgressChange}
              className="absolute inset-0 w-full opacity-0 cursor-pointer"
            />
          </div>
          <div className="flex justify-between text-[8px] font-mono text-zinc-600">
            <span>{audioRef.current ? formatTime(audioRef.current.currentTime) : '0:00'}</span>
            <span>{audioRef.current ? formatTime(audioRef.current.duration || 0) : '0:00'}</span>
          </div>
        </div>
      </div>

      <div className="mt-8 flex flex-col gap-2">
        {tracks.map(track => (
          <button
            key={track.id}
            onClick={() => onTrackChange(track)}
            className={`p-3 rounded-lg transition-all text-left group flex items-center justify-between ${
              currentTrack.id === track.id 
                ? 'bg-zinc-800/50 border-l-2 border-[#00f3ff]' 
                : 'hover:bg-zinc-800/30'
            }`}
          >
            <div className="min-w-0">
              <p className={`text-xs font-medium uppercase tracking-widest ${currentTrack.id === track.id ? 'neon-text-cyan' : 'text-zinc-300'}`}>
                {track.id.padStart(2, '0')}. {track.title}
              </p>
              <p className="text-[9px] text-zinc-500 mt-1 uppercase font-mono">
                 {track.artist} // 128 BPM
              </p>
            </div>
            {currentTrack.id === track.id && isPlaying && (
              <div className="flex gap-[2px] h-3 items-end">
                 {[1, 2, 3].map(i => (
                    <motion.div 
                      key={i}
                      animate={{ height: [2, 10, 4, 12, 6] }}
                      transition={{ duration: 0.5 + i * 0.1, repeat: Infinity }}
                      className="w-[2px] bg-[#00f3ff]"
                    />
                 ))}
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

function formatTime(seconds: number) {
  if (isNaN(seconds)) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export default MusicPlayer;

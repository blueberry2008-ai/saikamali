/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Gamepad2, Music, TrendingUp, Activity } from 'lucide-react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';
import { TRACKS } from './constants';
import { Track } from './types';

export default function App() {
  const [currentTrack, setCurrentTrack] = useState<Track>(TRACKS[0]);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);

  const handleScoreChange = (newScore: number) => {
    setScore(newScore);
    if (newScore > highScore) {
      setHighScore(newScore);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col font-sans selection:bg-[#00f3ff] selection:text-black">
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden p-6 gap-6 max-w-7xl mx-auto w-full">
        
        {/* Sidebar - Left Section */}
        <aside className="w-full lg:w-80 flex flex-col gap-6 flex-shrink-0">
          
          {/* Playlist / Music Player */}
          <div className="bg-[#0d0e14] p-5 rounded-xl neon-border flex-1 flex flex-col">
            <h2 className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-6 flex items-center gap-2">
              <Music size={12} /> Playlist
            </h2>
            <MusicPlayer 
              tracks={TRACKS}
              currentTrack={currentTrack}
              onTrackChange={setCurrentTrack}
            />
          </div>

          {/* Game Stats */}
          <div className="bg-[#0d0e14] p-5 rounded-xl neon-border">
            <h2 className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-2 flex items-center gap-2">
              <Activity size={12} /> Game Stats
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between items-end border-b border-white/5 pb-2">
                <span className="text-[10px] text-zinc-400 uppercase tracking-tighter transition-all">High Score</span>
                <span className="text-xl font-mono neon-text-magenta">
                  {highScore.toLocaleString('en-US', { minimumIntegerDigits: 6 })}
                </span>
              </div>
              <div className="flex justify-between items-end border-b border-white/5 pb-2">
                <span className="text-[10px] text-zinc-400 uppercase tracking-tighter">Current Run</span>
                <span className="text-xl font-mono neon-text-cyan">
                  {score.toLocaleString('en-US', { minimumIntegerDigits: 6 })}
                </span>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content - Snake Console */}
        <main className="flex-1 flex flex-col items-center justify-center bg-[#0d0e14] rounded-2xl neon-border relative overflow-hidden p-8 sm:p-12">
          
          {/* Header Overlays */}
          <div className="absolute top-6 left-8 flex items-center gap-4 z-10 pointer-events-none">
            <div className="w-2 h-2 rounded-full bg-[#00f3ff] animate-pulse shadow-[0_0_10px_#00f3ff]"></div>
            <h1 className="text-lg font-black tracking-tighter italic uppercase">
              NEON<span className="text-[#ff00e5]">PULSE</span>.OS
            </h1>
          </div>

          <div className="absolute top-6 right-8 text-right z-10 pointer-events-none">
            <p className="text-[10px] text-zinc-500 tracking-widest uppercase">Score.System</p>
            <p className="text-3xl font-mono leading-none tracking-tighter">
              {score.toLocaleString('en-US', { minimumIntegerDigits: 6 })}
            </p>
          </div>

          <div className="w-full max-w-2xl flex flex-col items-center">
            <SnakeGame 
              onScoreChange={handleScoreChange} 
              accentColor={currentTrack.color}
            />
          </div>

          {/* Footer Info */}
          <div className="absolute bottom-6 left-8 right-8 flex justify-between items-center pointer-events-none opacity-20">
            <p className="text-[8px] font-mono uppercase tracking-[0.4em]">Auth: AI_STUDIO_USER_CERTIFIED</p>
            <p className="text-[8px] font-mono uppercase tracking-[0.4em]">Ver: 2.0.4 - STABLE</p>
          </div>
        </main>
      </div>

      <footer className="py-4 border-t border-white/5 px-8 flex justify-between items-center text-[10px] font-mono text-zinc-600 uppercase tracking-[0.2em] bg-black">
        <span>© 2026 NEON PULSE ARCADE</span>
        <div className="flex gap-4">
          <span>{currentTrack.artist} // {currentTrack.title}</span>
        </div>
      </footer>
    </div>
  );
}

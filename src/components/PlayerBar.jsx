'use client';
import React, { useContext } from 'react';
import { PlayerContext } from '../providers/PlayerProvider';
import { Play, Pause, SkipForward, SkipBack, Volume2 } from 'lucide-react';

const PlayerBar = () => {
  const { currentSong, isPlaying, togglePlayPause, playNext, playPrev, playProgress, seek, currentTime, duration, volume, setVolume } = useContext(PlayerContext);
  
  const handleSeek = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = (x / rect.width) * 100;
    seek(percentage);
  };

  const handleVolumeChange = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    let newVolume = x / rect.width;
    if (newVolume < 0) newVolume = 0;
    if (newVolume > 1) newVolume = 1;
    setVolume(newVolume);
  };

  if (!currentSong) return null;

  const formatTime = (time) => {
    if (isNaN(time)) return '0:00';
    const min = Math.floor(time / 60);
    const sec = Math.floor(time % 60);
    return `${min}:${sec.toString().padStart(2, '0')}`;
  };

  const mNow = formatTime(currentTime);
  const mTotal = formatTime(duration);
  
  return (
    <div className="fixed bottom-0 left-0 right-0 h-auto md:h-24 bg-[#0c0c1e]/80 backdrop-blur-xl border-t border-white/5 z-[100] px-4 md:px-6 py-3 md:py-0 flex flex-col md:flex-row items-center justify-between gap-4 md:gap-0 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
      
      {/* Progress Bar */}
      <div 
        className="absolute top-0 left-0 w-full h-1 bg-white/5 cursor-pointer group"
        onClick={handleSeek}
      >
        <div 
          className="h-full bg-gradient-to-r from-[#FF3B81] to-[#7000FF] relative transition-all duration-300 group-hover:h-1.5"
          style={{ width: `${playProgress}%` }}
        >
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-[0_0_10px_#FF3B81] opacity-0 group-hover:opacity-100 transition-opacity"></div>
        </div>
      </div>

      {/* Left: Track Info */}
      <div className="flex items-center gap-4 w-full md:w-[30%] min-w-0">
        <div className="w-12 h-12 md:w-16 md:h-16 rounded-xl overflow-hidden shadow-2xl shrink-0 group">
          <img src={currentSong.coverImage || 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60'} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={currentSong.title} />
        </div>
        <div className="flex flex-col min-w-0 flex-1">
          <h4 className="text-white text-sm md:text-base font-bold truncate tracking-tight">{currentSong.title}</h4>
          <p className="text-white/40 text-[10px] md:text-xs font-semibold uppercase tracking-widest truncate">{currentSong.artist}</p>
        </div>
      </div>

      {/* Middle: Main Controls */}
      <div className="flex flex-col items-center justify-center w-full md:w-[40%] gap-2">
        <div className="flex items-center gap-6 md:gap-8">
          <button className="text-white/40 hover:text-white transition-all active:scale-90" onClick={playPrev}><SkipBack size={24} className="fill-current" /></button>
          
          <button 
            onClick={togglePlayPause}
            className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-white flex items-center justify-center text-black hover:scale-110 active:scale-95 transition-all shadow-[0_4px_15px_rgba(255,255,255,0.3)]"
          >
            {isPlaying ? <Pause size={24} className="fill-black" /> : <Play size={24} className="fill-black ml-1" />}
          </button>

          <button className="text-white/40 hover:text-white transition-all active:scale-90" onClick={playNext}><SkipForward size={24} className="fill-current" /></button>
        </div>
        
        <div className="flex items-center gap-4 text-[10px] md:text-[11px] font-black tracking-[0.2em] text-white/40 uppercase">
            <span className="min-w-[40px] text-right">{mNow}</span>
            <div className="w-1 h-1 rounded-full bg-[#FF3B81] animate-pulse"></div>
            <span className="min-w-[40px]">{mTotal}</span>
        </div>
      </div>

      {/* Right: Extra Controls */}
      <div className="hidden md:flex items-center justify-end gap-6 w-[30%]">
        <div className="flex items-center gap-3 group">
          <Volume2 
            size={20} 
            className={`transition-colors cursor-pointer ${volume === 0 ? 'text-red-500' : 'text-white/30'}`} 
            onClick={() => setVolume(volume > 0 ? 0 : 1)}
          />
          <div 
            className="w-24 h-1 bg-white/10 rounded-full relative cursor-pointer group-hover:h-1.5 transition-all"
            onClick={handleVolumeChange}
          >
             <div 
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#FF3B81] to-[#7000FF] rounded-full"
                style={{ width: `${volume * 100}%` }}
             ></div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default PlayerBar;

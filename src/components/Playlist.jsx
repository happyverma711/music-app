'use client';
import React, { useContext, useState } from 'react';
import { PlayerContext } from '../providers/PlayerProvider';
import { Play, Pause, RefreshCcw, Search } from 'lucide-react';

const Playlist = () => {
  const { songs, currentSong, isPlaying, playSong, togglePlayPause, loading, fetchSongs } = useContext(PlayerContext);
  const [hoveredSong, setHoveredSong] = useState(null);

  const handleSync = async () => {
    try {
      const res = await fetch('/api/sync');
      const data = await res.json();
      alert(`Sync successful! Found ${data.count} songs.`);
      fetchSongs(); // Re-fetch the songs from the local context
    } catch (err) {
      console.error(err);
      alert('Sync failed.');
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[50vh]">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 border-4 border-white/5 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-accent-primary border-t-transparent rounded-full animate-spin shadow-[0_0_15px_rgba(255,59,129,0.5)]"></div>
        </div>
      </div>
    );
  }

  const profilePic = "/assets/Happy.jpeg";

  return (
    <div className="flex-1 min-h-screen pb-[150px] relative overflow-x-hidden">

      {/* Top Bar / Search / Sync */}
      <div className="p-4 md:p-8 flex items-center justify-between sticky top-0 z-50 glass-dark">
        <div className="w-full flex items-center justify-between gap-2 md:gap-4">
          <button
            onClick={handleSync}
            className="flex items-center gap-2 bg-white/5 hover:bg-white/10 px-3 md:px-4 py-1.5 md:py-2 rounded-full text-[10px] md:text-sm font-bold border border-white/5 transition-all active:scale-95 group"
          >
            <RefreshCcw size={14} className="group-hover:rotate-180 transition-transform duration-500" />
            <span className="hidden sm:inline">Sync Library</span>
          </button>
          <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-tr from-accent-primary to-accent-secondary p-[1px] md:p-[2px]">
            <img src={profilePic} className="w-full h-full rounded-full border-2 border-[#0c0c1e] object-cover" alt="Profile" />
          </div>
        </div>
      </div>

      {/* Hero Content */}
      <div className="p-6 md:p-12 pt-4 md:pt-8 flex justify-center flex-col md:flex-row items-center md:items-end gap-8 md:gap-10">
        <div className="w-48 h-48 sm:w-64 sm:h-64 md:w-80 md:h-80 rounded-[32px] md:rounded-[48px] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.6)] group relative shrink-0">
          <img
            src={songs[0]?.coverImage || "https://i.pinimg.com/736x/b2/30/bd/b230bdd1857ec9a1ef610e3509540b9a.jpg"}
            alt="Playlist Cover"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div
            className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center cursor-pointer"
            onClick={() => songs.length > 0 && playSong(songs[0])}
          >
            <div className="w-16 h-16 md:w-20 md:h-20 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30 scale-50 group-hover:scale-100 transition-transform duration-500">
              <Play size={32} className="text-white fill-white ml-2" />
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-4 md:gap-6 pb-4 items-center md:items-start text-center md:text-left">
          <h1 className="text-5xl sm:text-7xl md:text-9xl font-black tracking-tighter leading-[0.8] italic uppercase">
            Arijit&nbsp;<br className="hidden md:block" />
            <span className="bg-gradient-to-r from-accent-primary to-accent-secondary bg-clip-text text-transparent">Music</span>
          </h1>
          <div className="flex flex-wrap justify-center md:justify-start items-center gap-3 md:gap-6 mt-2">
            <p className="text-white/40 text-xs md:text-sm font-medium tracking-wide">
              Curated for <span className="text-white">Happy Verma</span>
            </p>
            <div className="hidden sm:block w-1 md:w-1.5 h-1 md:h-1.5 rounded-full bg-accent-primary"></div>
            <p className="text-white/40 text-xs md:text-sm font-medium">{songs.length} Tracks</p>
            <div className="hidden sm:block w-1 md:w-1.5 h-1 md:h-1.5 rounded-full bg-accent-secondary"></div>
            <p className="text-white/40 text-[10px] md:text-sm font-medium italic">Music Stream</p>
          </div>
        </div>
      </div>

      {/* Tracks List */}
      <div className="px-4 md:px-12 mt-8 md:mt-12 pb-20">
        <div className="flex items-center justify-between mb-6 md:mb-8 pb-4 border-b border-white/5">
          <h2 className="text-xl md:text-3xl font-black italic tracking-tighter uppercase opacity-30">Tracklist</h2>
        </div>

        <div className="flex flex-col gap-2">
          {songs.map((song, index) => {
            const isCurrent = currentSong?._id === song._id;
            const isHovered = hoveredSong === song._id;

            return (
              <div
                key={song._id}
                className={`
                            group flex items-center gap-3 md:gap-6 p-2 md:p-4 py-2 md:py-3 rounded-[20px] md:rounded-[28px] cursor-pointer transition-all duration-500
                            ${isCurrent ? 'bg-white/10 shadow-xl border border-white/10' : 'hover:bg-white/5 border border-transparent'}
                        `}
                onMouseEnter={() => setHoveredSong(song._id)}
                onMouseLeave={() => setHoveredSong(null)}
                onClick={() => playSong(song)}
              >
                {/* Number / Status */}
                <div className="w-8 md:w-12 text-sm md:text-2xl font-black italic text-white/5 group-hover:text-accent-secondary transition-colors duration-500 text-center">
                  {isCurrent && isPlaying ? (
                    <div className="flex items-end justify-center gap-0.5 md:gap-1 h-3.5 md:h-5 scale-75">
                      <div className="w-0.5 md:w-1 bg-accent-secondary animate-[bounce_0.8s_infinite] h-full" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-0.5 md:w-1 bg-accent-secondary animate-[bounce_0.8s_infinite] h-3/4" style={{ animationDelay: '0.3s' }}></div>
                      <div className="w-0.5 md:w-1 bg-accent-secondary animate-[bounce_0.8s_infinite] h-full" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  ) : (
                    (index + 1).toString().padStart(2, '0')
                  )}
                </div>

                {/* Visuals / Info */}
                <div className="flex items-center gap-3 md:gap-6 flex-1 min-w-0">
                  <div className="w-10 h-10 md:w-16 md:h-16 rounded-xl md:rounded-2xl overflow-hidden shadow-lg shrink-0 scale-90 group-hover:scale-100 transition-transform duration-500 bg-white/5">
                    <img src={song.coverImage || 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60'} className="w-full h-full object-cover" alt={song.title} />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className={`text-sm md:text-xl font-bold truncate tracking-tight transition-colors ${isCurrent ? 'text-accent-secondary' : 'text-white'}`}>
                      {song.title}
                    </span>
                    <span className="text-[10px] md:text-xs text-white/30 font-bold uppercase tracking-[0.1em] md:tracking-[0.2em] mt-0.5 group-hover:text-white/50 transition-colors">
                      {song.artist}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {songs.length === 0 && (
          <div className="flex flex-col items-center justify-center py-32 gap-6 text-center animate-in fade-in duration-1000">
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-full border-4 border-dashed border-white/10 flex items-center justify-center animate-spin-slow">
              <RefreshCcw size={32} className="text-white/20" />
            </div>
            <div className="space-y-1 md:space-y-2">
              <p className="text-lg md:text-2xl font-black italic tracking-tight opacity-40 uppercase">Silence in the air...</p>
              <p className="text-white/20 text-[10px] md:text-sm font-medium">Upload songs to Cloudinary and hit sync below.</p>
            </div>
            <button
              onClick={handleSync}
              className="bg-accent-primary text-white px-6 md:px-8 py-2 md:py-3 rounded-full text-xs md:text-sm font-black uppercase tracking-widest shadow-[0_0_30px_rgba(255,59,129,0.3)] hover:scale-105 active:scale-95 transition-all outline-none"
            >
              Trigger Sync
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Playlist;

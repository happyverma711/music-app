'use client';
import React, { createContext, useState, useEffect, useRef, useMemo } from 'react';
import axios from 'axios';

export const PlayerContext = createContext();

export const PlayerProvider = ({ children }) => {
  const [songs, setSongs] = useState([]);
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playProgress, setPlayProgress] = useState(0);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1.0);

  // Audio instance
  const audioRef = useRef(null);

  useEffect(() => {
    // Initialize audio only on client side
    audioRef.current = new Audio();
  }, []);
  
  // Sync volume with audio instance
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);
  
  // 1. Initial Load
  useEffect(() => {
    fetchSongs();
  }, []);

  // 2. Audio Event Listeners Setup
  useEffect(() => {
    if (!audioRef.current) return;
    const audio = audioRef.current;
    
    const updateProgress = () => {
      if (audio.duration) {
        setDuration(audio.duration);
        setCurrentTime(audio.currentTime);
        setPlayProgress((audio.currentTime / audio.duration) * 100);
      }
    };

    const handleEnded = () => {
      playNext();
    };

    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('loadedmetadata', updateProgress);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateProgress);
      audio.removeEventListener('loadedmetadata', updateProgress);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [songs, currentSong]);

  // 3. Audio Source Management
  useEffect(() => {
    if (audioRef.current && currentSong && currentSong.audioUrl) {
      audioRef.current.src = currentSong.audioUrl;
      if (isPlaying) {
        audioRef.current.play().catch(err => console.error("Playback failed:", err));
      }
    }
  }, [currentSong]);

  // 4. Playback State Management
  useEffect(() => {
    if (!audioRef.current) return;
    if (isPlaying && currentSong) {
      audioRef.current.play().catch(err => {
        console.error("Playback failed:", err);
        setIsPlaying(false);
      });
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying]);

  const fetchSongs = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/songs');
      setSongs(response.data);
      if (response.data.length > 0 && !currentSong) {
        setCurrentSong(response.data[0]);
      }
    } catch (error) {
      console.error("Failed to fetch songs:", error);
    } finally {
      setLoading(false);
    }
  };

  const playSong = (song) => {
    if (currentSong && currentSong._id === song._id) {
      togglePlayPause();
      return;
    }
    setCurrentSong(song);
    setIsPlaying(true);
    setPlayProgress(0);
    setCurrentTime(0);
  };

  const togglePlayPause = () => {
    if (currentSong) {
      setIsPlaying(!isPlaying);
    }
  };

  const playNext = () => {
    if (!currentSong || songs.length === 0) return;
    const currentIndex = songs.findIndex(s => s._id === currentSong._id);
    const nextIndex = (currentIndex + 1) % songs.length;
    playSong(songs[nextIndex]);
  };

  const playPrev = () => {
    if (!currentSong || songs.length === 0) return;
    const currentIndex = songs.findIndex(s => s._id === currentSong._id);
    const prevIndex = (currentIndex - 1 + songs.length) % songs.length;
    playSong(songs[prevIndex]);
  };

  const seek = (percentage) => {
    if (audioRef.current && audioRef.current.duration) {
      const time = (percentage / 100) * audioRef.current.duration;
      audioRef.current.currentTime = time;
      setPlayProgress(percentage);
      setCurrentTime(time);
    }
  };

  const contextValue = useMemo(() => ({
    songs,
    currentSong,
    isPlaying,
    playProgress,
    loading,
    currentTime,
    duration,
    volume,
    playSong,
    togglePlayPause,
    playNext,
    playPrev,
    setPlayProgress,
    seek,
    setVolume,
    fetchSongs
  }), [songs, currentSong, isPlaying, playProgress, loading, currentTime, duration, volume]);

  return (
    <PlayerContext.Provider value={contextValue}>
      {children}
    </PlayerContext.Provider>
  );
};

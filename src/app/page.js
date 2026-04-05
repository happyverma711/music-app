'use client';
import Playlist from "@/components/Playlist";
import PlayerBar from "@/components/PlayerBar";

export default function Home() {
  return (
    <div className="h-screen w-full flex bg-[#0c0c1e] text-white overflow-hidden select-none font-sans relative">
      
      {/* Animated Background Blobs */}
      <div className="fixed top-[-10%] left-[-10%] w-[60%] md:w-[40%] h-[40%] bg-[#FF3B81]/10 rounded-full blur-[80px] md:blur-[120px] animate-pulse"></div>
      <div className="fixed bottom-[-10%] right-[-10%] w-[60%] md:w-[40%] h-[40%] bg-[#7000FF]/10 rounded-full blur-[80px] md:blur-[120px] animate-pulse" style={{ animationDelay: '4s' }}></div>

      {/* Main Content View */}
      <main className="flex-1 overflow-y-auto w-full relative z-10 bg-[#0c0c1e]/60 backdrop-blur-3xl border-r border-white/5 pb-32 md:pb-40 custom-scrollbar">
        <Playlist />
      </main>

      {/* Floating Player Bar */}
      <div className="relative z-[100]">
        <PlayerBar />
      </div>
      
    </div>
  );
}

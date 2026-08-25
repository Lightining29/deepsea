import React, { useState, useRef, useEffect } from 'react';
import { 
  Compass, MapPin, Calendar, Users, Search, 
  ArrowRight, Play, Sparkles, Anchor 
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function HeroSection({ onSearch, onOpenBookingModal, onOpenVideoModal, theme = 'light' }) {
  const [selectedDestination, setSelectedDestination] = useState('All');
  const [selectedZone, setSelectedZone] = useState('All');
  const [diverCount, setDiverCount] = useState('2 Divers');
  const [diveDate, setDiveDate] = useState('2026-09-20');
  const videoRef = useRef(null);

  // Guarantee instant video autoplay
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = true;
    video.defaultMuted = true;

    const playVideo = () => {
      video.play().catch((err) => {
        console.log("Autoplay waiting for initial interaction:", err);
      });
    };

    playVideo();

    const handleGesture = () => {
      if (video.paused) {
        video.play().catch(() => {});
      }
    };

    window.addEventListener('mousemove', handleGesture, { once: true });
    window.addEventListener('touchstart', handleGesture, { once: true });
    window.addEventListener('scroll', handleGesture, { once: true });

    return () => {
      window.removeEventListener('mousemove', handleGesture);
      window.removeEventListener('touchstart', handleGesture);
      window.removeEventListener('scroll', handleGesture);
    };
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    onSearch({
      destination: selectedDestination,
      zone: selectedZone,
      diverCount,
      diveDate
    });
  };

  const isLight = theme === 'light';

  return (
    <section className="relative w-full min-h-screen flex items-center justify-center pt-24 pb-20 overflow-hidden slice-hero-bottom bg-slate-950">
      
      {/* 1. FULL-SCREEN AUTOPLAYING OCEAN MP4 VIDEO (SERVED LOCALLY FROM /ocean.mp4) */}
      <div className="absolute inset-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <video
          ref={videoRef}
          src="/ocean.mp4"
          autoPlay
          loop
          muted
          playsInline
          defaultMuted
          preload="auto"
          className="w-full h-full object-cover scale-105 filter brightness-[0.92] contrast-[1.08]"
        />

        {/* Video Overlay Tint for Perfect Typography Contrast */}
        <div className="absolute inset-0 video-hero-overlay z-10" />
      </div>

      {/* 2. TEXT DIRECTLY OVERLAID WITH DROP IN & POP IN SPRING EFFECTS */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 w-full">
        
        <div className="max-w-4xl mx-auto text-center space-y-6">
          
          {/* Sliced Badge with POP IN (small -> BIG -> normal) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.2 }}
            animate={{ opacity: 1, scale: [0.2, 1.2, 0.95, 1] }}
            transition={{ duration: 0.6, times: [0, 0.6, 0.85, 1] }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-950/80 backdrop-blur-md border border-sky-400/60 text-sky-300 text-xs font-mono font-bold uppercase tracking-wider shadow-lg slice-badge-angle"
          >
            <span className="w-2 h-2 rounded-full bg-sky-400 animate-ping" />
            <span>Manned Deep Sea Submersible Expeditions • 11,000m Certified</span>
          </motion.div>

          {/* Main Title with DROP IN EFFECT (Falls from above with bouncy spring) */}
          <motion.h1
            initial={{ opacity: 0, y: -90 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              type: "spring", 
              damping: 14, 
              stiffness: 180, 
              mass: 1.1 
            }}
            className="text-4xl sm:text-6xl lg:text-7xl font-extrabold font-display tracking-tight text-white leading-[1.1] drop-shadow-[0_4px_24px_rgba(0,0,0,0.9)]"
          >
            Journey Beyond <br />
            <span className="bg-gradient-to-r from-sky-300 via-cyan-200 to-teal-300 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(56,189,248,0.7)]">
              Expectations.
            </span>
          </motion.h1>

          {/* Subtitle with DROP IN EFFECT */}
          <motion.p
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              type: "spring", 
              damping: 16, 
              stiffness: 160, 
              delay: 0.15 
            }}
            className="text-base sm:text-lg lg:text-xl text-slate-100 max-w-2xl mx-auto font-normal leading-relaxed drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]"
          >
            Discover handpicked deep sea trench destinations and unforgettable titanium submersible experiences tailored just for you.
          </motion.p>

          {/* Action CTA Buttons with SCALE IN / SCALE OUT */}
          <motion.div
            initial={{ opacity: 0, scale: 0.3 }}
            animate={{ opacity: 1, scale: [0.3, 1.15, 0.95, 1] }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="flex flex-wrap items-center justify-center gap-4 pt-2"
          >
            <button
              onClick={() => onOpenBookingModal()}
              className="px-8 py-3.5 rounded-full bg-gradient-to-r from-sky-400 via-cyan-300 to-teal-300 text-slate-950 font-display font-bold text-sm sm:text-base shadow-[0_0_30px_rgba(14,165,233,0.6)] hover:shadow-[0_0_45px_rgba(14,165,233,0.9)] transition-all flex items-center gap-2 scale-interact"
            >
              <span>Explore Missions</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onOpenVideoModal}
              className="px-6 py-3.5 rounded-full bg-slate-950/70 hover:bg-slate-950/90 border border-white/30 text-white text-sm font-medium backdrop-blur-md transition-all flex items-center gap-2 scale-interact"
            >
              <div className="w-6 h-6 rounded-full bg-sky-400/30 flex items-center justify-center">
                <Play className="w-3 h-3 text-sky-300 fill-sky-300 ml-0.5" />
              </div>
              <span>Watch 4K Hadal Film</span>
            </button>
          </motion.div>

        </div>

        {/* 3. WIPE UP REVEAL 5-FIELD GLASS SEARCH BAR OVERLAID ON FULL SCREEN VIDEO */}
        <motion.div
          initial={{ opacity: 0, y: 50, clipPath: 'polygon(0 100%, 100% 100%, 100% 100%, 0 100%)' }}
          animate={{ opacity: 1, y: 0, clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)' }}
          transition={{ duration: 0.8, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="mt-12 max-w-5xl mx-auto"
        >
          <form 
            onSubmit={handleSearchSubmit}
            className={`p-3.5 sm:p-4 rounded-3xl backdrop-blur-2xl border grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 shadow-2xl slice-cutout-double ${
              isLight 
                ? 'bg-white/90 border-sky-300/80 shadow-[0_15px_45px_rgba(14,165,233,0.22)]' 
                : 'bg-slate-950/85 border-cyan-500/40 shadow-[0_15px_45px_rgba(0,0,0,0.8)]'
            }`}
          >
            
            {/* 1. Destination */}
            <div className={`p-2.5 rounded-2xl border transition-colors scale-interact ${
              isLight ? 'bg-sky-50 border-sky-200' : 'bg-slate-900/80 border-white/10'
            }`}>
              <label className="block text-[10px] font-mono text-sky-700 dark:text-sky-400 font-bold uppercase tracking-wider mb-1 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-sky-500" />
                <span>Where to?</span>
              </label>
              <select
                value={selectedDestination}
                onChange={(e) => setSelectedDestination(e.target.value)}
                className={`w-full bg-transparent text-xs sm:text-sm font-bold focus:outline-none cursor-pointer ${
                  isLight ? 'text-slate-900' : 'text-white'
                }`}
              >
                <option value="All" className={isLight ? 'bg-white text-slate-800' : 'bg-slate-900 text-white'}>Any Deep Trench</option>
                <option value="Mariana" className={isLight ? 'bg-white text-slate-800' : 'bg-slate-900 text-white'}>Mariana Trench (10,928m)</option>
                <option value="Atlantic" className={isLight ? 'bg-white text-slate-800' : 'bg-slate-900 text-white'}>Azores Bioluminescent Plain</option>
                <option value="Titanic" className={isLight ? 'bg-white text-slate-800' : 'bg-slate-900 text-white'}>RMS Titanic Wreck (3,810m)</option>
                <option value="Galápagos" className={isLight ? 'bg-white text-slate-800' : 'bg-slate-900 text-white'}>Galápagos Hydrothermal Vents</option>
                <option value="Caribbean" className={isLight ? 'bg-white text-slate-800' : 'bg-slate-900 text-white'}>Cartagena Sunken Galleon</option>
              </select>
            </div>

            {/* 2. Depth Zone */}
            <div className={`p-2.5 rounded-2xl border transition-colors scale-interact ${
              isLight ? 'bg-sky-50 border-sky-200' : 'bg-slate-900/80 border-white/10'
            }`}>
              <label className="block text-[10px] font-mono text-sky-700 dark:text-sky-400 font-bold uppercase tracking-wider mb-1 flex items-center gap-1">
                <Compass className="w-3 h-3 text-sky-500" />
                <span>Ocean Zone</span>
              </label>
              <select
                value={selectedZone}
                onChange={(e) => setSelectedZone(e.target.value)}
                className={`w-full bg-transparent text-xs sm:text-sm font-bold focus:outline-none cursor-pointer ${
                  isLight ? 'text-slate-900' : 'text-white'
                }`}
              >
                <option value="All" className={isLight ? 'bg-white text-slate-800' : 'bg-slate-900 text-white'}>All Ocean Depths</option>
                <option value="Mesopelagic" className={isLight ? 'bg-white text-slate-800' : 'bg-slate-900 text-white'}>Twilight Zone (200-1000m)</option>
                <option value="Bathypelagic" className={isLight ? 'bg-white text-slate-800' : 'bg-slate-900 text-white'}>Midnight Zone (1000-4000m)</option>
                <option value="Abyssopelagic" className={isLight ? 'bg-white text-slate-800' : 'bg-slate-900 text-white'}>The Abyss (4000-6000m)</option>
                <option value="Hadopelagic" className={isLight ? 'bg-white text-slate-800' : 'bg-slate-900 text-white'}>Hadal Trenches (6000-11000m)</option>
              </select>
            </div>

            {/* 3. Dive Date */}
            <div className={`p-2.5 rounded-2xl border transition-colors scale-interact ${
              isLight ? 'bg-sky-50 border-sky-200' : 'bg-slate-900/80 border-white/10'
            }`}>
              <label className="block text-[10px] font-mono text-sky-700 dark:text-sky-400 font-bold uppercase tracking-wider mb-1 flex items-center gap-1">
                <Calendar className="w-3 h-3 text-sky-500" />
                <span>Expedition Date</span>
              </label>
              <input
                type="date"
                value={diveDate}
                onChange={(e) => setDiveDate(e.target.value)}
                className={`w-full bg-transparent text-xs sm:text-sm font-bold focus:outline-none cursor-pointer ${
                  isLight ? 'text-slate-900' : 'text-white'
                }`}
              />
            </div>

            {/* 4. Divers / Submersible Class */}
            <div className={`p-2.5 rounded-2xl border transition-colors scale-interact ${
              isLight ? 'bg-sky-50 border-sky-200' : 'bg-slate-900/80 border-white/10'
            }`}>
              <label className="block text-[10px] font-mono text-sky-700 dark:text-sky-400 font-bold uppercase tracking-wider mb-1 flex items-center gap-1">
                <Users className="w-3 h-3 text-sky-500" />
                <span>Diver Party</span>
              </label>
              <select
                value={diverCount}
                onChange={(e) => setDiverCount(e.target.value)}
                className={`w-full bg-transparent text-xs sm:text-sm font-bold focus:outline-none cursor-pointer ${
                  isLight ? 'text-slate-900' : 'text-white'
                }`}
              >
                <option value="1 Explorer" className={isLight ? 'bg-white text-slate-800' : 'bg-slate-900 text-white'}>1 Solo Explorer</option>
                <option value="2 Divers" className={isLight ? 'bg-white text-slate-800' : 'bg-slate-900 text-white'}>2 Divers (Tandem Sub)</option>
                <option value="3 Guests" className={isLight ? 'bg-white text-slate-800' : 'bg-slate-900 text-white'}>3 Guests (DeepFlight)</option>
                <option value="VIP Private Sub" className={isLight ? 'bg-white text-slate-800' : 'bg-slate-900 text-white'}>VIP Full Charter</option>
              </select>
            </div>

            {/* 5. Search Now CTA */}
            <div className="flex items-center">
              <button
                type="submit"
                className="w-full h-full min-h-[48px] rounded-2xl bg-gradient-to-r from-sky-400 via-cyan-300 to-teal-300 text-slate-950 font-display font-bold text-sm shadow-[0_4px_16px_rgba(14,165,233,0.4)] hover:shadow-[0_6px_25px_rgba(14,165,233,0.7)] transition-all flex items-center justify-center gap-2 scale-interact"
              >
                <Search className="w-4 h-4 stroke-[2.5]" />
                <span>Search Dives</span>
              </button>
            </div>

          </form>
        </motion.div>

      </div>
    </section>
  );
}

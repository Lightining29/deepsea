import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import MobileDrawer from './components/MobileDrawer';
import MobileBottomNav from './components/MobileBottomNav';
import HeroSection from './components/HeroSection';
import ExpeditionCard from './components/ExpeditionCard';
import SubmersibleShowcase from './components/SubmersibleShowcase';
import CutoutSliceBanner from './components/CutoutSliceBanner';
import DepthZoneExplorer from './components/DepthZoneExplorer';
import StatsCounter from './components/StatsCounter';
import TestimonialsSection from './components/TestimonialsSection';
import BookingModal from './components/BookingModal';
import ExpeditionDetailModal from './components/ExpeditionDetailModal';
import VideoModal from './components/VideoModal';
import UserDashboard from './components/UserDashboard';
import AdminPanel from './components/AdminPanel';
import AuthModal from './components/AuthModal';
import Footer from './components/Footer';
import { expeditionsData } from '../../server/data/expeditionsData.js';
import { 
  Sparkles, Filter, SlidersHorizontal, ChevronDown, 
  ArrowUpDown, Compass, Anchor, ShieldCheck, Waves 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function App() {
  const [expeditions, setExpeditions] = useState(expeditionsData);
  const [filteredExpeditions, setFilteredExpeditions] = useState(expeditionsData);
  const [activeTab, setActiveTab] = useState('home');
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const [siteLoaded, setSiteLoaded] = useState(false);

  // Trigger site open transition
  useEffect(() => {
    const t = setTimeout(() => setSiteLoaded(true), 900);
    return () => clearTimeout(t);
  }, []);

  // Theme state: defaults to light (white background + sky blue deep sea aesthetics)
  const [theme, setTheme] = useState(() => {
    try {
      const saved = localStorage.getItem('abyssx_theme');
      return saved || 'light';
    } catch {
      return 'light';
    }
  });

  const toggleTheme = () => {
    setTheme(prev => {
      const next = prev === 'light' ? 'dark' : 'light';
      localStorage.setItem('abyssx_theme', next);
      return next;
    });
  };

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  // Auth state
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('abyssx_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [pendingBookingExpedition, setPendingBookingExpedition] = useState(null);

  // Modals state
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedExpeditionForBooking, setSelectedExpeditionForBooking] = useState(null);
  const [detailExpedition, setDetailExpedition] = useState(null);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  // Filters & Sorting state
  const [selectedZone, setSelectedZone] = useState('All');
  const [sortBy, setSortBy] = useState('featured');
  const [searchQuery, setSearchQuery] = useState('');

  // Wishlist state
  const [wishlistIds, setWishlistIds] = useState(() => {
    try {
      const saved = localStorage.getItem('abyssx_wishlist');
      return saved ? JSON.parse(saved) : ['exp-1', 'exp-3'];
    } catch {
      return ['exp-1', 'exp-3'];
    }
  });

  // Fetch from Express API
  const fetchExpeditions = async () => {
    try {
      const res = await fetch('/api/expeditions');
      const json = await res.json();
      if (json.success && json.data && json.data.length > 0) {
        setExpeditions(json.data);
      }
    } catch (e) {
      console.log('Using local client seed data for expeditions');
    }
  };

  useEffect(() => {
    fetchExpeditions();
  }, []);

  // Filter & search effect
  useEffect(() => {
    let list = [...expeditions];

    if (selectedZone && selectedZone !== 'All') {
      list = list.filter(e => e.zone.toLowerCase().includes(selectedZone.toLowerCase()));
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter(e => 
        e.title.toLowerCase().includes(q) ||
        e.location.toLowerCase().includes(q) ||
        e.description.toLowerCase().includes(q)
      );
    }

    if (sortBy === 'price-low') {
      list.sort((a, b) => a.pricePerPerson - b.pricePerPerson);
    } else if (sortBy === 'price-high') {
      list.sort((a, b) => b.pricePerPerson - a.pricePerPerson);
    } else if (sortBy === 'depth') {
      list.sort((a, b) => b.depthMeters - a.depthMeters);
    } else if (sortBy === 'rating') {
      list.sort((a, b) => b.rating - a.rating);
    }

    setFilteredExpeditions(list);
  }, [expeditions, selectedZone, searchQuery, sortBy]);

  const toggleWishlist = (id) => {
    setWishlistIds(prev => {
      const next = prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id];
      localStorage.setItem('abyssx_wishlist', JSON.stringify(next));
      return next;
    });
  };

  const handleHeroSearch = (searchParams) => {
    if (searchParams.destination && searchParams.destination !== 'All') {
      setSearchQuery(searchParams.destination);
    } else {
      setSearchQuery('');
    }
    if (searchParams.zone) {
      setSelectedZone(searchParams.zone);
    }
    const el = document.getElementById('destinations-grid');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // BOOKING GUARD: If user is not logged in, show AuthModal. Otherwise proceed to booking.
  const handleOpenBooking = (exp = null) => {
    const targetExp = exp || selectedExpeditionForBooking || expeditions[0];
    if (!currentUser) {
      setPendingBookingExpedition(targetExp);
      setIsAuthModalOpen(true);
      return;
    }
    setSelectedExpeditionForBooking(targetExp);
    setIsBookingModalOpen(true);
  };

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    localStorage.setItem('abyssx_user', JSON.stringify(user));
    setIsAuthModalOpen(false);
    if (pendingBookingExpedition) {
      setSelectedExpeditionForBooking(pendingBookingExpedition);
      setIsBookingModalOpen(true);
      setPendingBookingExpedition(null);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('abyssx_user');
    if (activeTab === 'admin' || activeTab === 'dashboard') {
      setActiveTab('home');
    }
  };

  const isLight = theme === 'light';

  return (
    <div className={`relative min-h-screen transition-colors duration-300 font-sans ${
      isLight ? 'bg-white text-slate-900' : 'bg-abyss-950 text-slate-100'
    } overflow-x-hidden`}>
      
      {/* 1. WEBSITE OPENING CURTAIN / SONAR WIPE TRANSITION */}
      <AnimatePresence>
        {!siteLoaded && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ 
              opacity: 0, 
              clipPath: 'polygon(0 0, 100% 0, 100% 0%, 0 0%)',
              transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } 
            }}
            className="fixed inset-0 z-50 bg-slate-950 flex flex-col items-center justify-center text-white"
          >
            <div className="text-center space-y-4 pop-in-spring">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-sky-400 to-teal-300 flex items-center justify-center text-slate-950 font-bold mx-auto shadow-2xl animate-pulse">
                <Anchor className="w-9 h-9" />
              </div>
              <h2 className="text-3xl font-extrabold font-display tracking-wider bg-gradient-to-r from-sky-300 via-cyan-200 to-teal-300 bg-clip-text text-transparent">
                ABYSSX EXPEDITIONS
              </h2>
              <p className="text-xs font-mono text-sky-400 tracking-widest uppercase">
                CALIBRATING DEPTH TELEMETRY // 11,000M HADAL CLEARANCE
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Glassmorphic Navigation Bar */}
      <Navbar
        onOpenMobileDrawer={() => setIsMobileDrawerOpen(true)}
        onOpenBookingModal={() => handleOpenBooking()}
        wishlistCount={wishlistIds.length}
        activeTab={activeTab}
        theme={theme}
        onToggleTheme={toggleTheme}
        currentUser={currentUser}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onLogout={handleLogout}
        onSelectTab={(tab) => {
          setActiveTab(tab);
          if (tab === 'destinations' || tab === 'home') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        }}
      />

      {/* Slide-In & Slide-Out Mobile Navigation Drawer */}
      <MobileDrawer
        isOpen={isMobileDrawerOpen}
        onClose={() => setIsMobileDrawerOpen(false)}
        activeTab={activeTab}
        onSelectTab={(tab) => setActiveTab(tab)}
        onOpenBookingModal={() => handleOpenBooking()}
        wishlistCount={wishlistIds.length}
        theme={theme}
        onToggleTheme={toggleTheme}
        currentUser={currentUser}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onLogout={handleLogout}
        onSelectZone={(zone) => {
          setSelectedZone(zone);
          const el = document.getElementById('destinations-grid');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      {/* 2. DRAMATIC SCENE TRANSITIONS (CALM PAGE ➔ INSTANT! ➔ COMPLETELY DIFFERENT PAGE) */}
      <AnimatePresence mode="wait">
        
        {/* VIEW 1: ADMIN CONTROL HQ */}
        {activeTab === 'admin' && (
          <motion.div
            key="admin-page"
            initial={{ opacity: 0, scale: 0.94, filter: 'blur(10px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, scale: 1.05, filter: 'blur(12px)' }}
            transition={{ duration: 0.45, ease: "easeInOut" }}
          >
            <AdminPanel
              currentUser={currentUser}
              onLogout={handleLogout}
              theme={theme}
            />
          </motion.div>
        )}

        {/* VIEW 2: EXPLORER USER DASHBOARD */}
        {(activeTab === 'dashboard' || activeTab === 'wishlist') && (
          <motion.div
            key="dashboard-page"
            initial={{ opacity: 0, scale: 0.94, filter: 'blur(10px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, scale: 1.05, filter: 'blur(12px)' }}
            transition={{ duration: 0.45, ease: "easeInOut" }}
          >
            <UserDashboard
              currentUser={currentUser}
              onLogout={handleLogout}
              onSelectExpedition={(exp) => setDetailExpedition(exp)}
              onOpenBookingModal={(exp) => handleOpenBooking(exp)}
              wishlistIds={wishlistIds}
              allExpeditions={expeditions}
              onRemoveWishlist={toggleWishlist}
              theme={theme}
            />
          </motion.div>
        )}

        {/* VIEW 3: MAIN SEA EXPEDITIONS EXPERIENCE */}
        {activeTab !== 'admin' && activeTab !== 'dashboard' && activeTab !== 'wishlist' && (
          <motion.main
            key="home-page"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.04 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            
            {/* Full-Screen Edge-to-Edge Autoplaying Ocean MP4 Video Hero Section with Drop In & Wipe Up */}
            <HeroSection
              onSearch={handleHeroSearch}
              onOpenBookingModal={() => handleOpenBooking()}
              onOpenVideoModal={() => setIsVideoModalOpen(true)}
              theme={theme}
            />

            {/* Sliced Cutout Promo Announcement Ribbon with POP IN */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 sm:-mt-8 relative z-30">
              <div className={`p-4 sm:p-5 rounded-2xl backdrop-blur-xl border shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4 slice-badge-angle pop-in-spring ${
                isLight 
                  ? 'bg-gradient-to-r from-sky-500 via-sky-600 to-teal-500 border-sky-400 text-white shadow-[0_10px_35px_rgba(14,165,233,0.25)]' 
                  : 'bg-gradient-to-r from-cyan-950 via-slate-900 to-cyan-950 border-cyan-500/40 text-cyan-200'
              }`}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0 scale-interact">
                    <Anchor className="w-5 h-5 text-white animate-pulse" />
                  </div>
                  <div>
                    <div className="text-xs font-mono font-bold uppercase tracking-wider text-sky-100">
                      2026 Deep Trench Season
                    </div>
                    <div className="text-sm sm:text-base font-bold font-display text-white">
                      Mariana & Azores Private Submersible Descents Now Booking
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleOpenBooking()}
                  className="px-5 py-2.5 rounded-full bg-white text-sky-800 font-display font-bold text-xs sm:text-sm hover:bg-sky-50 shadow-md transition-all scale-interact shrink-0"
                >
                  Reserve Dive Seat
                </button>
              </div>
            </div>

            {/* Popular Expeditions & Destinations Grid */}
            <section id="destinations-grid" className="py-16 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              
              {/* Header with Title & Filter / Sort Controls */}
              <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
                <div className="space-y-1">
                  <div className={`inline-flex items-center gap-2 px-3.5 py-1 rounded-full border text-xs font-mono font-bold uppercase pop-in-spring ${
                    isLight ? 'bg-sky-50 border-sky-300 text-sky-700' : 'bg-cyan-400/10 border-cyan-400/30 text-cyan-300'
                  }`}>
                    <Compass className="w-3.5 h-3.5" />
                    <span>Featured Missions • Click any card for details</span>
                  </div>
                  <h2 className={`text-2xl sm:text-4xl font-extrabold font-display ${isLight ? 'text-slate-900' : 'text-white'}`}>
                    Popular Deep Sea Destinations
                  </h2>
                  <p className={`text-xs sm:text-sm ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                    Explore certified deep-sea descent sites loved by explorers around the world.
                  </p>
                </div>

                {/* Filter & Sort Controls */}
                <div className="flex flex-wrap items-center gap-2.5">
                  
                  {/* Zone Filter Pill */}
                  <div className="relative">
                    <select
                      value={selectedZone}
                      onChange={(e) => setSelectedZone(e.target.value)}
                      className={`appearance-none px-3.5 py-2.5 pr-8 rounded-xl border text-xs font-mono font-semibold focus:outline-none cursor-pointer scale-interact ${
                        isLight
                          ? 'bg-white border-sky-200 text-slate-800 hover:border-sky-400 shadow-sm'
                          : 'bg-slate-900 border-white/15 text-cyan-200 hover:border-cyan-400/50'
                      }`}
                    >
                      <option value="All" className={isLight ? 'bg-white text-slate-800' : 'bg-slate-900 text-white'}>All Depth Zones</option>
                      <option value="Mesopelagic" className={isLight ? 'bg-white text-slate-800' : 'bg-slate-900 text-white'}>Twilight (200-1000m)</option>
                      <option value="Bathypelagic" className={isLight ? 'bg-white text-slate-800' : 'bg-slate-900 text-white'}>Midnight (1000-4000m)</option>
                      <option value="Abyssopelagic" className={isLight ? 'bg-white text-slate-800' : 'bg-slate-900 text-white'}>The Abyss (4000-6000m)</option>
                      <option value="Hadopelagic" className={isLight ? 'bg-white text-slate-800' : 'bg-slate-900 text-white'}>Hadal (6000-11000m)</option>
                    </select>
                    <ChevronDown className="w-3.5 h-3.5 text-sky-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>

                  {/* Sort Pill */}
                  <div className="relative">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className={`appearance-none px-3.5 py-2.5 pr-8 rounded-xl border text-xs font-mono font-semibold focus:outline-none cursor-pointer scale-interact ${
                        isLight
                          ? 'bg-white border-sky-200 text-slate-800 hover:border-sky-400 shadow-sm'
                          : 'bg-slate-900 border-white/15 text-cyan-200 hover:border-cyan-400/50'
                      }`}
                    >
                      <option value="featured" className={isLight ? 'bg-white text-slate-800' : 'bg-slate-900 text-white'}>Sort: Featured First</option>
                      <option value="depth" className={isLight ? 'bg-white text-slate-800' : 'bg-slate-900 text-white'}>Sort: Deepest (Hadal)</option>
                      <option value="price-low" className={isLight ? 'bg-white text-slate-800' : 'bg-slate-900 text-white'}>Sort: Price (Low to High)</option>
                      <option value="price-high" className={isLight ? 'bg-white text-slate-800' : 'bg-slate-900 text-white'}>Sort: Price (High to Low)</option>
                      <option value="rating" className={isLight ? 'bg-white text-slate-800' : 'bg-slate-900 text-white'}>Sort: Highest Rating</option>
                    </select>
                    <ArrowUpDown className="w-3.5 h-3.5 text-sky-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>

                </div>

              </div>

              {/* Expedition Cards Grid with Scale In & Pull In Elastic */}
              {filteredExpeditions.length === 0 ? (
                <div className={`p-12 text-center rounded-3xl border max-w-md mx-auto ${
                  isLight ? 'bg-white border-sky-200' : 'glass-panel border-cyan-500/20'
                }`}>
                  <p className="text-sm">No expeditions found matching your criteria.</p>
                  <button
                    onClick={() => { setSelectedZone('All'); setSearchQuery(''); }}
                    className="mt-3 px-4 py-2 rounded-xl bg-sky-500 text-white font-bold text-xs"
                  >
                    Reset Filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                  {filteredExpeditions.map((exp) => (
                    <ExpeditionCard
                      key={exp.id}
                      expedition={exp}
                      onSelect={(e) => setDetailExpedition(e)}
                      onBook={(e) => handleOpenBooking(e)}
                      isWishlisted={wishlistIds.includes(exp.id)}
                      onToggleWishlist={toggleWishlist}
                      theme={theme}
                    />
                  ))}
                </div>
              )}

            </section>

            {/* Submersible Showcase & Mobile App Section */}
            <section id="submersibles">
              <SubmersibleShowcase onOpenBookingModal={() => handleOpenBooking()} theme={theme} />
            </section>

            {/* Exclusive Deep Experiences Row & Cutout Sliced Banner with Pull Effects */}
            <section id="experiences">
              <CutoutSliceBanner
                onSelectExpedition={(expId) => {
                  const found = expeditions.find(e => e.id === expId);
                  if (found) setDetailExpedition(found);
                }}
                onOpenBookingModal={() => handleOpenBooking()}
                theme={theme}
              />
            </section>

            {/* Interactive Depth Zone Explorer (0m to 11,000m) */}
            <section id="depth-zones">
              <DepthZoneExplorer 
                onFilterZone={(zone) => {
                  setSelectedZone(zone);
                  const el = document.getElementById('destinations-grid');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                theme={theme}
              />
            </section>

            {/* Diver Testimonials */}
            <TestimonialsSection theme={theme} />

            {/* Stats Bar */}
            <StatsCounter theme={theme} />

          </motion.main>
        )}

      </AnimatePresence>

      {/* Floating Mobile Bottom Navigation Bar */}
      <MobileBottomNav
        activeTab={activeTab}
        onSelectTab={(tab) => {
          setActiveTab(tab);
          if (tab === 'home' || tab === 'destinations') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        }}
        onOpenBookingModal={() => handleOpenBooking()}
        wishlistCount={wishlistIds.length}
        theme={theme}
      />

      {/* Footer */}
      <Footer
        onSelectTab={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenBookingModal={() => handleOpenBooking()}
        theme={theme}
      />

      {/* Auth Modal (Pop In small -> BIG -> normal, high-contrast inputs) */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => {
          setIsAuthModalOpen(false);
          setPendingBookingExpedition(null);
        }}
        onLoginSuccess={handleLoginSuccess}
        theme={theme}
      />

      {/* Interactive Booking Popup Modal (Pop In animation) */}
      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        selectedExpedition={selectedExpeditionForBooking}
        currentUser={currentUser}
        onBookingSuccess={() => {
          fetchExpeditions();
        }}
        theme={theme}
      />

      {/* Detailed Mission Dossier Modal (Pop In animation) */}
      <ExpeditionDetailModal
        isOpen={!!detailExpedition}
        expedition={detailExpedition}
        onClose={() => setDetailExpedition(null)}
        onBookNow={(exp) => {
          setDetailExpedition(null);
          handleOpenBooking(exp);
        }}
        theme={theme}
      />

      {/* Video / Descent Telemetry Modal */}
      <VideoModal
        isOpen={isVideoModalOpen}
        onClose={() => setIsVideoModalOpen(false)}
      />

    </div>
  );
}

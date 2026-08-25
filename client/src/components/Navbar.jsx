import React, { useState, useEffect } from 'react';
import { 
  Anchor, Compass, Heart, Bell, Menu, X, Waves, 
  Sparkles, Sun, Moon, User, ShieldAlert, LogOut, LayoutDashboard 
} from 'lucide-react';

export default function Navbar({ 
  onOpenMobileDrawer, 
  onOpenBookingModal, 
  wishlistCount, 
  onSelectTab, 
  activeTab,
  theme,
  onToggleTheme,
  currentUser,
  onOpenAuthModal,
  onLogout 
}) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [currentDepth, setCurrentDepth] = useState(0);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const scrollRatio = Math.min(1, Math.max(0, window.scrollY / (maxScroll || 1)));
      setCurrentDepth(Math.round(scrollRatio * 10928));
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isLight = theme === 'light';

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled 
          ? isLight
            ? 'py-2.5 bg-white/90 backdrop-blur-xl border-b border-sky-200 shadow-md'
            : 'py-2.5 bg-slate-950/90 backdrop-blur-xl border-b border-cyan-500/20 shadow-lg' 
          : isLight
            ? 'py-3.5 bg-gradient-to-b from-white/90 via-white/50 to-transparent'
            : 'py-3.5 bg-gradient-to-b from-slate-950/90 via-slate-950/40 to-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Brand Logo */}
          <a 
            href="#" 
            onClick={(e) => { e.preventDefault(); onSelectTab('home'); }}
            className="flex items-center gap-2.5 group focus:outline-none shrink-0"
          >
            <div className="relative">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-sky-400 via-cyan-500 to-blue-600 p-[2px] shadow-md">
                <div className={`w-full h-full rounded-[10px] flex items-center justify-center ${isLight ? 'bg-white' : 'bg-slate-950'}`}>
                  <Anchor className="w-4 h-4 sm:w-5 sm:h-5 text-sky-500 group-hover:scale-110 transition-transform duration-300" />
                </div>
              </div>
              <span className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-sky-500"></span>
              </span>
            </div>

            <div>
              <span className={`text-lg sm:text-xl font-bold font-display tracking-tight transition-all ${
                isLight 
                  ? 'text-slate-900' 
                  : 'text-white'
              }`}>
                AbyssX
              </span>
              <span className={`block text-[9px] sm:text-[10px] font-mono tracking-widest uppercase font-bold ${
                isLight ? 'text-sky-600' : 'text-cyan-400'
              }`}>
                Deep Sea Expeditions
              </span>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav className={`hidden lg:flex items-center gap-1 px-3 py-1.5 rounded-full backdrop-blur-md border shadow-inner ${
            isLight
              ? 'bg-white/80 border-sky-200/80'
              : 'bg-white/[0.04] border-white/10'
          }`}>
            {[
              { id: 'destinations', label: 'Destinations' },
              { id: 'experiences', label: 'Experiences' },
              { id: 'submersibles', label: 'Submersibles' },
              { id: 'depth-zones', label: 'Depth Zones' },
              { id: 'deals', label: 'Deals & Missions' }
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
                  activeTab === item.id 
                    ? isLight
                      ? 'bg-sky-500 text-white shadow-sm font-semibold'
                      : 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 shadow-[0_0_12px_rgba(0,240,255,0.2)]'
                    : isLight
                      ? 'text-slate-600 hover:text-sky-700 hover:bg-sky-50'
                      : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                {item.label}
              </button>
            ))}

            {/* Admin link */}
            {currentUser?.role === 'admin' && (
              <button
                onClick={() => onSelectTab('admin')}
                className={`px-3 py-1.5 rounded-full text-xs font-mono font-bold transition-all ${
                  activeTab === 'admin'
                    ? 'bg-amber-500 text-white shadow-sm'
                    : 'text-amber-500 hover:bg-amber-500/10'
                }`}
              >
                ⚡ Admin HQ
              </button>
            )}

            {currentUser && currentUser.role !== 'admin' && (
              <button
                onClick={() => onSelectTab('dashboard')}
                className={`px-3 py-1.5 rounded-full text-xs font-mono font-bold transition-all ${
                  activeTab === 'dashboard'
                    ? 'bg-sky-500 text-white shadow-sm'
                    : 'text-sky-600 hover:bg-sky-50 dark:text-cyan-300'
                }`}
              >
                My Missions
              </button>
            )}
          </nav>

          {/* Right Action Bar (Spacious and responsive for mobile) */}
          <div className="flex items-center gap-1.5 sm:gap-2.5">
            
            {/* Live Depth Indicator (Desktop only) */}
            <div className={`hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-full border backdrop-blur-md ${
              isLight 
                ? 'bg-sky-50 border-sky-200 text-sky-800' 
                : 'bg-cyan-950/40 border-cyan-500/30 text-cyan-200'
            }`}>
              <Waves className="w-3.5 h-3.5 text-sky-500 animate-pulse" />
              <span className="text-[11px] font-mono">
                DEPTH: <strong className="font-bold">{currentDepth.toLocaleString()}m</strong>
              </span>
            </div>

            {/* Theme Toggle Button */}
            <button
              onClick={onToggleTheme}
              title={isLight ? "Switch to Deep Abyss Dark Theme" : "Switch to Sky Blue Light Theme"}
              className={`p-2 rounded-full border transition-all scale-interact ${
                isLight
                  ? 'bg-sky-50 hover:bg-sky-100 border-sky-200 text-sky-700 shadow-sm'
                  : 'bg-white/5 hover:bg-white/10 border-white/10 text-amber-300'
              }`}
            >
              {isLight ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </button>

            {/* Wishlist Button */}
            <button 
              onClick={() => onSelectTab('wishlist')}
              title="View saved expeditions"
              className={`relative p-2 rounded-full border transition-all scale-interact ${
                isLight
                  ? 'bg-sky-50 hover:bg-sky-100 border-sky-200 text-slate-700 hover:text-rose-600'
                  : 'bg-white/5 hover:bg-cyan-500/10 border-white/10 text-slate-300 hover:text-cyan-300'
              }`}
            >
              <Heart className="w-4 h-4" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 text-[9px] font-bold text-white flex items-center justify-center shadow-lg animate-bounce">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* User Profile / Login (Desktop Only: md:flex) */}
            {currentUser ? (
              <div className="relative hidden md:block">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 p-1 pl-2 pr-2.5 rounded-full border border-sky-300 dark:border-cyan-400/40 bg-sky-50 dark:bg-slate-900 hover:scale-105 transition-all shadow-sm"
                >
                  <img
                    src={currentUser.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"}
                    alt={currentUser.name}
                    className="w-6 h-6 rounded-full object-cover border border-sky-400"
                  />
                  <span className="text-xs font-bold font-display max-w-[80px] truncate">
                    {currentUser.name.split(' ')[0]}
                  </span>
                </button>

                {/* Dropdown Menu */}
                {isUserMenuOpen && (
                  <div className={`absolute right-0 mt-2 w-48 rounded-2xl border shadow-xl p-2 z-50 text-xs font-medium space-y-1 ${
                    isLight ? 'bg-white border-sky-200 text-slate-800' : 'bg-slate-900 border-cyan-400/30 text-white'
                  }`}>
                    <div className="p-2 border-b border-sky-100 dark:border-white/10">
                      <div className="font-bold truncate">{currentUser.name}</div>
                      <div className="text-[10px] text-slate-400 truncate">{currentUser.email}</div>
                    </div>

                    {currentUser.role === 'admin' && (
                      <button
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          onSelectTab('admin');
                        }}
                        className="w-full text-left px-2.5 py-1.5 rounded-xl hover:bg-amber-50 dark:hover:bg-amber-950/30 text-amber-600 font-bold flex items-center gap-2"
                      >
                        <ShieldAlert className="w-3.5 h-3.5" />
                        <span>Admin Control HQ</span>
                      </button>
                    )}

                    <button
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        onSelectTab('dashboard');
                      }}
                      className="w-full text-left px-2.5 py-1.5 rounded-xl hover:bg-sky-50 dark:hover:bg-white/5 flex items-center gap-2 text-sky-600 font-semibold"
                    >
                      <LayoutDashboard className="w-3.5 h-3.5" />
                      <span>Explorer Dashboard</span>
                    </button>

                    <button
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        onLogout();
                      }}
                      className="w-full text-left px-2.5 py-1.5 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/30 text-rose-500 font-semibold flex items-center gap-2"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Log Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={onOpenAuthModal}
                className="hidden md:inline-flex px-3.5 py-2 rounded-full border border-sky-300 dark:border-cyan-400/40 text-xs font-bold font-mono text-sky-700 dark:text-cyan-300 hover:bg-sky-50 dark:hover:bg-white/5 transition-all scale-interact"
              >
                Explorer Login
              </button>
            )}

            {/* Desktop Book Dive CTA */}
            <button
              onClick={() => onOpenBookingModal()}
              className="hidden md:inline-flex relative group overflow-hidden px-4 sm:px-5 py-2 rounded-full font-medium text-xs sm:text-sm text-slate-950 font-display font-semibold transition-all shadow-[0_4px_16px_rgba(14,165,233,0.4)] hover:shadow-[0_6px_25px_rgba(14,165,233,0.7)] scale-interact"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-sky-400 via-cyan-300 to-teal-300 group-hover:scale-105 transition-transform duration-300"></span>
              <span className="relative flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-slate-950 fill-slate-950" />
                <span>Book Dive</span>
              </span>
            </button>

            {/* Mobile Hamburger Menu Toggle (Clean, properly padded, not pushed off screen) */}
            <button
              onClick={onOpenMobileDrawer}
              aria-label="Open Navigation Drawer"
              className={`p-2 sm:p-2.5 rounded-xl border lg:hidden scale-interact shrink-0 ml-1 ${
                isLight 
                  ? 'bg-sky-500 text-white border-sky-500 shadow-sm hover:bg-sky-600' 
                  : 'bg-cyan-500/20 border-cyan-400 text-cyan-300 hover:bg-cyan-500/30'
              }`}
            >
              <Menu className="w-5 h-5 stroke-[2.5]" />
            </button>

          </div>

        </div>
      </div>
    </header>
  );
}

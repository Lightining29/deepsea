import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Compass, Anchor, Waves, Layers, ShieldCheck, 
  Sparkles, Heart, Bell, Calendar, ChevronRight, MapPin, Gauge, Sun, Moon, 
  User, ShieldAlert, LogOut, LayoutDashboard 
} from 'lucide-react';

export default function MobileDrawer({ 
  isOpen, 
  onClose, 
  onSelectTab, 
  activeTab, 
  onOpenBookingModal,
  wishlistCount,
  onSelectZone,
  theme = 'light',
  onToggleTheme,
  currentUser,
  onOpenAuthModal,
  onLogout
}) {
  const isLight = theme === 'light';

  const navItems = [
    { id: 'home', label: 'Home Overview', icon: Anchor },
    { id: 'destinations', label: 'Popular Destinations', icon: MapPin },
    { id: 'experiences', label: 'Exclusive Experiences', icon: Sparkles },
    { id: 'submersibles', label: 'Submersible Fleet', icon: Compass },
    { id: 'depth-zones', label: 'Ocean Depth Zones', icon: Layers },
    { id: 'deals', label: 'Abyssal Deals', icon: Calendar },
    { id: 'about', label: 'Safety & Certifications', icon: ShieldCheck },
  ];

  const quickZones = [
    { name: "Twilight Zone (1,000m)", query: "Mesopelagic", color: "from-blue-500 to-indigo-600" },
    { name: "Midnight Zone (4,000m)", query: "Bathypelagic", color: "from-indigo-600 to-purple-800" },
    { name: "Mariana Hadal (11,000m)", query: "Hadopelagic", color: "from-sky-500 to-blue-700" },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden lg:hidden">
          
          {/* Backdrop with Blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-md"
          />

          {/* Slide-in Glassmorphic Sidebar from Left */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 240 }}
            className={`relative w-[85%] max-w-sm h-full backdrop-blur-2xl border-r shadow-2xl flex flex-col justify-between overflow-y-auto ${
              isLight 
                ? 'bg-white/95 border-sky-300 text-slate-800' 
                : 'bg-slate-950/95 border-cyan-500/30 text-white'
            }`}
          >
            {/* Top Cutout Header */}
            <div>
              <div className={`p-5 border-b flex items-center justify-between ${
                isLight ? 'border-sky-200 bg-sky-50' : 'border-cyan-500/20 bg-slate-900'
              }`}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-400 via-cyan-400 to-teal-300 flex items-center justify-center text-slate-950 font-bold shadow-md">
                    <Anchor className="w-5 h-5 animate-pulse" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-base text-slate-900 dark:text-white">AbyssX Deep Sea</h3>
                    <p className="text-[10px] font-mono text-sky-700 dark:text-cyan-300 font-bold">STATUS: HADAL READY 🟢</p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={onToggleTheme}
                    className={`p-2 rounded-xl border ${
                      isLight ? 'bg-white border-sky-200 text-sky-700' : 'bg-white/5 border-white/10 text-amber-300'
                    }`}
                  >
                    {isLight ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={onClose}
                    className={`p-2 rounded-xl border ${
                      isLight ? 'bg-white border-sky-200 text-slate-600' : 'bg-white/5 border-white/10 text-slate-300'
                    }`}
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* User Profile Bar inside Mobile Drawer */}
              <div className={`p-4 mx-4 mt-4 rounded-2xl border ${
                isLight ? 'bg-sky-50/80 border-sky-200' : 'bg-slate-900/80 border-cyan-500/20'
              }`}>
                {currentUser ? (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img
                        src={currentUser.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"}
                        alt={currentUser.name}
                        className="w-10 h-10 rounded-xl object-cover border-2 border-sky-400"
                      />
                      <div>
                        <div className="font-bold text-xs truncate max-w-[130px]">{currentUser.name}</div>
                        <div className="text-[10px] font-mono text-sky-600 dark:text-cyan-300">{currentUser.role === 'admin' ? '⚡ Fleet Commander' : '🤿 Hadal Explorer'}</div>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        onClose();
                        onLogout();
                      }}
                      className="p-2 rounded-xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                      title="Log Out"
                    >
                      <LogOut className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <div className="text-xs">
                      <div className="font-bold">Explorer Clearance</div>
                      <div className="text-[10px] text-slate-500">Sign in for dive reservations</div>
                    </div>
                    <button
                      onClick={() => {
                        onClose();
                        onOpenAuthModal();
                      }}
                      className="px-3 py-1.5 rounded-xl bg-sky-500 text-white font-bold font-mono text-[11px] shadow-sm"
                    >
                      Login
                    </button>
                  </div>
                )}
              </div>

              {/* Navigation Items */}
              <div className="p-4 space-y-1.5">
                <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 px-3 mb-2">
                  Navigation
                </div>
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        onSelectTab(item.id);
                        onClose();
                      }}
                      className={`w-full flex items-center justify-between p-3 rounded-2xl text-xs font-semibold transition-all ${
                        isActive
                          ? isLight
                            ? 'bg-sky-500 text-white shadow-md'
                            : 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40'
                          : isLight
                            ? 'hover:bg-sky-50 text-slate-700'
                            : 'hover:bg-white/5 text-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="w-4 h-4" />
                        <span>{item.label}</span>
                      </div>
                      <ChevronRight className="w-4 h-4 opacity-50" />
                    </button>
                  );
                })}

                {currentUser?.role === 'admin' && (
                  <button
                    onClick={() => {
                      onSelectTab('admin');
                      onClose();
                    }}
                    className="w-full flex items-center justify-between p-3 rounded-2xl text-xs font-bold bg-amber-500 text-white shadow-md mt-2"
                  >
                    <div className="flex items-center gap-3">
                      <ShieldAlert className="w-4 h-4" />
                      <span>Admin Control Center</span>
                    </div>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                )}

                {currentUser && currentUser.role !== 'admin' && (
                  <button
                    onClick={() => {
                      onSelectTab('dashboard');
                      onClose();
                    }}
                    className="w-full flex items-center justify-between p-3 rounded-2xl text-xs font-bold bg-sky-500 text-white shadow-md mt-2"
                  >
                    <div className="flex items-center gap-3">
                      <LayoutDashboard className="w-4 h-4" />
                      <span>My Missions Dashboard</span>
                    </div>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Quick Depth Zones filter */}
              <div className="px-4 pb-2 space-y-1.5">
                <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 px-3 mb-1">
                  Quick Dive Depths
                </div>
                {quickZones.map((z, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      onSelectZone(z.query);
                      onClose();
                    }}
                    className={`w-full text-left p-2.5 rounded-xl text-xs font-mono flex items-center justify-between border ${
                      isLight ? 'bg-white border-sky-100 hover:bg-sky-50' : 'bg-white/[0.02] border-white/5 hover:bg-white/5'
                    }`}
                  >
                    <span>{z.name}</span>
                    <span className="w-2 h-2 rounded-full bg-sky-400" />
                  </button>
                ))}
              </div>

            </div>

            {/* Bottom CTA Button */}
            <div className={`p-4 border-t ${isLight ? 'border-sky-200 bg-sky-50/50' : 'border-cyan-500/20 bg-slate-950'}`}>
              <button
                onClick={() => {
                  onClose();
                  onOpenBookingModal();
                }}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-sky-500 via-cyan-400 to-teal-400 text-slate-950 font-display font-extrabold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4 stroke-[2.5]" />
                <span>Reserve Dive Seat</span>
              </button>
            </div>

          </motion.div>

        </div>
      )}
    </AnimatePresence>
  );
}

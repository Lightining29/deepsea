import React, { useState, useEffect } from 'react';
import { 
  User, Award, Anchor, Calendar, Clock, Compass, 
  MapPin, CheckCircle2, AlertCircle, Heart, ArrowRight, ShieldCheck, Download, Trash2 
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function UserDashboard({ 
  currentUser, 
  onLogout, 
  onSelectExpedition, 
  onOpenBookingModal,
  wishlistIds = [],
  allExpeditions = [],
  onRemoveWishlist,
  theme = 'light' 
}) {
  const isLight = theme === 'light';
  const [activeTab, setActiveTab] = useState('bookings');
  const [myBookings, setMyBookings] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchMyBookings = async () => {
    if (!currentUser || !currentUser.email) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/bookings/user/${currentUser.email}`);
      const data = await res.json();
      if (data.success) {
        setMyBookings(data.data);
      }
    } catch (err) {
      console.warn("Using fallback local bookings", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyBookings();
  }, [currentUser]);

  const wishlistedExpeditions = allExpeditions.filter(e => wishlistIds.includes(e.id));

  return (
    <div className={`min-h-screen pt-28 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 ${
      isLight ? 'text-slate-900' : 'text-white'
    }`}>
      
      {/* 1. Explorer Profile Card with Ocean Watery Glass Effect */}
      <div className={`p-6 sm:p-8 rounded-3xl backdrop-blur-2xl border shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 slice-cutout-double ${
        isLight ? 'bg-white/90 border-sky-300 shadow-[0_15px_45px_rgba(14,165,233,0.18)]' : 'bg-slate-950/85 border-cyan-500/40 shadow-[0_15px_45px_rgba(0,0,0,0.8)]'
      }`}>
        
        <div className="flex items-center gap-5">
          <div className="relative">
            <img
              src={currentUser?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"}
              alt={currentUser?.name}
              className="w-20 h-20 rounded-2xl object-cover border-2 border-sky-400 shadow-md"
            />
            <span className="absolute -bottom-2 -right-2 p-1.5 rounded-full bg-emerald-500 text-white shadow">
              <ShieldCheck className="w-3.5 h-3.5" />
            </span>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-3 py-0.5 rounded-full bg-sky-500/20 text-sky-700 dark:text-cyan-300 font-mono text-[11px] font-bold uppercase">
                {currentUser?.role === 'admin' ? 'Fleet Commander (Admin)' : 'Certified Deep Explorer'}
              </span>
              <span className="text-xs text-slate-400 font-mono">ID: EXP-{currentUser?.email?.split('@')[0]?.toUpperCase()}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-display">
              {currentUser?.name || "Explorer"}
            </h1>
            <p className="text-xs text-slate-500 font-mono">
              {currentUser?.email} • {currentUser?.diverLevel || "Hadal Explorer Grade 2"}
            </p>
          </div>
        </div>

        {/* Badges / Stats Ribbon */}
        <div className="flex items-center gap-4 border-t md:border-t-0 md:border-l border-sky-200 dark:border-white/10 pt-4 md:pt-0 md:pl-6">
          <div className="text-center px-3">
            <div className="text-2xl font-mono font-bold text-sky-600">
              {myBookings.length}
            </div>
            <div className="text-[10px] font-mono text-slate-400 uppercase">Missions Booked</div>
          </div>
          <div className="text-center px-3">
            <div className="text-2xl font-mono font-bold text-teal-600">
              {wishlistIds.length}
            </div>
            <div className="text-[10px] font-mono text-slate-400 uppercase">Saved Trenches</div>
          </div>
          <div className="text-center px-3">
            <div className="text-2xl font-mono font-bold text-indigo-600">
              {currentUser?.divesLogged || 6}
            </div>
            <div className="text-[10px] font-mono text-slate-400 uppercase">Logged Descents</div>
          </div>
        </div>

      </div>

      {/* Tabs */}
      <div className="flex items-center gap-3 border-b border-sky-200 dark:border-white/10 pb-4">
        <button
          onClick={() => setActiveTab('bookings')}
          className={`px-5 py-2.5 rounded-xl font-display font-bold text-xs sm:text-sm transition-all ${
            activeTab === 'bookings'
              ? 'bg-sky-500 text-white shadow-md'
              : isLight ? 'bg-white text-slate-600 hover:bg-sky-50' : 'bg-white/5 text-slate-300 hover:bg-white/10'
          }`}
        >
          My Submersible Expeditions ({myBookings.length})
        </button>
        <button
          onClick={() => setActiveTab('wishlist')}
          className={`px-5 py-2.5 rounded-xl font-display font-bold text-xs sm:text-sm transition-all ${
            activeTab === 'wishlist'
              ? 'bg-sky-500 text-white shadow-md'
              : isLight ? 'bg-white text-slate-600 hover:bg-sky-50' : 'bg-white/5 text-slate-300 hover:bg-white/10'
          }`}
        >
          Saved Trenches & Wishlist ({wishlistedExpeditions.length})
        </button>
      </div>

      {/* 1. Bookings Tab */}
      {activeTab === 'bookings' && (
        <div className="space-y-4">
          {myBookings.length === 0 ? (
            <div className={`p-12 text-center rounded-3xl border ${isLight ? 'bg-white border-sky-200' : 'bg-slate-900 border-white/10'}`}>
              <Anchor className="w-12 h-12 text-sky-400 mx-auto mb-3 opacity-60" />
              <h3 className="text-lg font-bold font-display">No Expeditions Booked Yet</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-5">
                Ready to explore the midnight abyss? Browse our certified submersible missions and reserve your seat.
              </p>
              <button
                onClick={() => onOpenBookingModal()}
                className="px-6 py-3 rounded-full bg-gradient-to-r from-sky-500 to-teal-400 text-slate-950 font-bold font-display text-xs shadow-md hover:scale-105 active:scale-95 transition-all"
              >
                Book a Hadal Dive Now
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {myBookings.map((b) => (
                <div
                  key={b.bookingReference}
                  className={`p-6 rounded-3xl border flex flex-col justify-between space-y-4 shadow-lg ${
                    isLight ? 'bg-white border-sky-200' : 'bg-slate-900/80 border-white/10'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 font-mono text-[10px] font-bold">
                        CLEARANCE: {b.status || 'Confirmed'}
                      </span>
                      <span className="font-mono text-xs font-bold text-sky-600">
                        {b.bookingReference}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold font-display">{b.expeditionTitle}</h3>
                    
                    <div className="grid grid-cols-2 gap-2 text-xs font-mono text-slate-500 pt-2 border-t border-sky-100 dark:border-white/10">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-sky-500" />
                        <span>{b.diveDate}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Compass className="w-3.5 h-3.5 text-teal-500" />
                        <span>{b.diverCount} Diver(s)</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-sky-100 dark:border-white/10 flex items-center justify-between">
                    <div>
                      <div className="text-[10px] font-mono text-slate-400 uppercase">Paid / Secured</div>
                      <div className="text-lg font-mono font-extrabold text-sky-600">
                        ${(b.totalAmount || 0).toLocaleString()}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => alert(`Booking telemetry pass downloaded for ${b.bookingReference}`)}
                        className="px-4 py-2 rounded-xl border text-xs font-mono font-bold flex items-center gap-1.5 hover:bg-sky-50 dark:hover:bg-white/5 transition-all"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Pass</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 2. Wishlist Tab */}
      {activeTab === 'wishlist' && (
        <div className="space-y-4">
          {wishlistedExpeditions.length === 0 ? (
            <div className={`p-12 text-center rounded-3xl border ${isLight ? 'bg-white border-sky-200' : 'bg-slate-900 border-white/10'}`}>
              <Heart className="w-12 h-12 text-rose-400 mx-auto mb-3 opacity-60" />
              <h3 className="text-lg font-bold font-display">Your Wishlist is Empty</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                Tap the heart on any expedition card to save destinations for your next dive.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {wishlistedExpeditions.map((exp) => (
                <div
                  key={exp.id}
                  className={`rounded-3xl border overflow-hidden flex flex-col justify-between ${
                    isLight ? 'bg-white border-sky-200 shadow-md' : 'bg-slate-900/80 border-white/10'
                  }`}
                >
                  <div className="relative h-48">
                    <img src={exp.image} alt={exp.title} className="w-full h-full object-cover" />
                    <button
                      onClick={() => onRemoveWishlist(exp.id)}
                      className="absolute top-3 right-3 p-2 rounded-full bg-rose-500/80 text-white shadow-md hover:scale-110 active:scale-95"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    <div className="absolute bottom-3 left-3 px-3 py-1 rounded-full bg-slate-950/80 text-white text-xs font-mono font-bold">
                      {exp.depth}
                    </div>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <div className="text-[10px] font-mono text-sky-600 font-bold uppercase">{exp.location}</div>
                      <h3 className="text-lg font-bold font-display mt-0.5">{exp.title}</h3>
                    </div>

                    <div className="pt-3 border-t border-sky-100 dark:border-white/10 flex items-center justify-between">
                      <div className="text-base font-extrabold font-mono text-sky-600">
                        ${exp.pricePerPerson.toLocaleString()}
                      </div>
                      <button
                        onClick={() => onOpenBookingModal(exp)}
                        className="px-4 py-2 rounded-xl bg-gradient-to-r from-sky-500 to-teal-400 text-slate-950 font-bold text-xs shadow hover:scale-105 active:scale-95 transition-all"
                      >
                        Book Now
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

    </div>
  );
}

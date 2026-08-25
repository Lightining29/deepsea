import React, { useState, useEffect } from 'react';
import { 
  CalendarCheck, Heart, Anchor, ShieldCheck, 
  MapPin, Clock, ArrowRight, Trash2, Sparkles, CheckCircle2 
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function UserBookingsView({ 
  wishlistIds, 
  allExpeditions, 
  onSelectExpedition, 
  onBookExpedition, 
  onRemoveWishlist,
  activeSubView = 'bookings',
  theme = 'light'
}) {
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const isLight = theme === 'light';

  const fetchBookings = async () => {
    try {
      const res = await fetch('/api/bookings');
      const data = await res.json();
      if (data.success) {
        setBookings(data.data);
      }
    } catch (e) {
      console.warn("Could not load backend bookings", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const wishlistedExpeditions = allExpeditions.filter(exp => wishlistIds.includes(exp.id));

  return (
    <section className="pt-28 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Header */}
      <div className="mb-8 space-y-2">
        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-mono font-bold uppercase ${
          isLight ? 'bg-sky-50 border-sky-300 text-sky-700' : 'bg-cyan-400/10 border-cyan-400/30 text-cyan-300'
        }`}>
          <Anchor className="w-3.5 h-3.5" />
          <span>Explorer Control Station</span>
        </div>
        <h2 className={`text-3xl sm:text-4xl font-extrabold font-display ${isLight ? 'text-slate-900' : 'text-white'}`}>
          {activeSubView === 'wishlist' ? 'Saved Deep Expeditions' : 'Active Dive Missions & Bookings'}
        </h2>
        <p className={`text-xs sm:text-sm ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
          Track telemetry clearances, crew manifests, and your personalized ocean trench wishlists.
        </p>
      </div>

      {activeSubView === 'wishlist' ? (
        /* Wishlist View */
        <div>
          {wishlistedExpeditions.length === 0 ? (
            <div className={`p-12 text-center rounded-3xl border max-w-md mx-auto space-y-4 ${
              isLight ? 'bg-white/80 border-sky-200 shadow-md' : 'glass-panel border-cyan-500/20'
            }`}>
              <div className="w-16 h-16 rounded-full bg-rose-500/10 border border-rose-400/30 text-rose-500 mx-auto flex items-center justify-center">
                <Heart className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold font-display">No Saved Expeditions Yet</h3>
              <p className="text-xs text-slate-500">
                Click the heart icon on any expedition card to save it to your telemetry wishlist.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {wishlistedExpeditions.map(exp => (
                <div 
                  key={exp.id} 
                  className={`rounded-2xl border overflow-hidden p-5 flex flex-col justify-between space-y-4 shadow-lg ${
                    isLight ? 'bg-white/90 border-sky-200' : 'glass-panel border-cyan-500/20'
                  }`}
                >
                  <div className="relative h-44 rounded-xl overflow-hidden">
                    <img src={exp.image} alt={exp.title} className="w-full h-full object-cover" />
                    <div className="absolute top-2 left-2 px-2.5 py-0.5 rounded-full bg-black/70 text-sky-300 font-mono text-[10px] font-bold">
                      {exp.depth}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-lg font-bold font-display">{exp.title}</h4>
                    <p className={`text-xs mt-1 line-clamp-2 ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>{exp.description}</p>
                  </div>

                  <div className={`pt-3 border-t flex items-center justify-between ${isLight ? 'border-sky-100' : 'border-white/10'}`}>
                    <span className={`font-mono font-bold text-sm ${isLight ? 'text-sky-600' : 'text-cyan-300'}`}>
                      ${exp.pricePerPerson.toLocaleString()}
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onRemoveWishlist(exp.id)}
                        className="p-2 rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-rose-500/20 text-slate-500 hover:text-rose-600 border border-slate-200 dark:border-white/10 transition-colors"
                        title="Remove from wishlist"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onBookExpedition(exp)}
                        className="px-4 py-2 rounded-xl bg-gradient-to-r from-sky-500 to-teal-400 text-slate-950 font-bold text-xs shadow-md bounce-pop"
                      >
                        Book Dive
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        /* Bookings View */
        <div className="space-y-4">
          {bookings.length === 0 ? (
            <div className={`p-12 text-center rounded-3xl border max-w-md mx-auto space-y-4 ${
              isLight ? 'bg-white/80 border-sky-200 shadow-md' : 'glass-panel border-cyan-500/20'
            }`}>
              <CalendarCheck className="w-12 h-12 text-sky-500 mx-auto" />
              <h3 className="text-xl font-bold font-display">No Active Dive Bookings</h3>
              <p className="text-xs text-slate-500">
                You haven't reserved a submersible seat yet. Choose a deep sea mission to get started.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {bookings.map((b, idx) => (
                <div
                  key={idx}
                  className={`p-5 sm:p-6 rounded-2xl border flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-lg cutout-corner-tr ${
                    isLight ? 'bg-white/90 border-sky-200' : 'glass-panel border-cyan-400/30'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 border border-emerald-400/40 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>{b.status}</span>
                      </span>
                      <span className={`text-xs font-mono font-bold ${isLight ? 'text-sky-700' : 'text-cyan-400'}`}>
                        REF: {b.bookingReference}
                      </span>
                    </div>

                    <h4 className="text-xl font-bold font-display">
                      {b.expeditionTitle}
                    </h4>

                    <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-slate-600 dark:text-slate-300">
                      <span>Explorer: <strong className="text-slate-900 dark:text-white">{b.customerName}</strong></span>
                      <span>Divers: <strong className={isLight ? 'text-sky-600' : 'text-cyan-300'}>{b.diverCount}</strong></span>
                      <span>Launch Date: <strong className="text-teal-600 dark:text-teal-300">{b.diveDate}</strong></span>
                      <span>Vessel: <strong>{b.submersibleClass}</strong></span>
                    </div>

                    {b.addOns && b.addOns.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {b.addOns.map((add, i) => (
                          <span key={i} className={`px-2 py-0.5 rounded text-[10px] border ${
                            isLight ? 'bg-sky-50 border-sky-200 text-sky-800' : 'bg-white/5 border-white/10 text-cyan-200'
                          }`}>
                            + {add}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className={`text-left md:text-right border-t md:border-t-0 pt-3 md:pt-0 ${isLight ? 'border-sky-100' : 'border-white/10'}`}>
                    <div className="text-[10px] font-mono text-slate-400">TOTAL SECURED</div>
                    <div className={`text-2xl font-extrabold font-mono ${isLight ? 'text-sky-600' : 'text-cyan-300'}`}>
                      ${b.totalAmount.toLocaleString()}
                    </div>
                    <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono mt-0.5 font-semibold">
                      ✓ Telemetry Slot Confirmed
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

    </section>
  );
}

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, CheckCircle2, ShieldCheck, Sparkles, Calendar, 
  Users, Anchor, Compass, CreditCard, Award, ArrowRight, Loader2 
} from 'lucide-react';

export default function BookingModal({ isOpen, onClose, selectedExpedition, onBookingSuccess, currentUser, theme = 'light' }) {
  const [diverCount, setDiverCount] = useState(1);
  const [diveDate, setDiveDate] = useState('2026-09-25');
  const [submersibleClass, setSubmersibleClass] = useState('Triton Titanium Class');
  const [fullName, setFullName] = useState(currentUser?.name || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [phone, setPhone] = useState('');
  const [specialRequests, setSpecialRequests] = useState('');
  const [selectedAddons, setSelectedAddons] = useState(['4K Telemetry Video']);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingConfirmation, setBookingConfirmation] = useState(null);

  // Sync state if currentUser changes
  React.useEffect(() => {
    if (currentUser) {
      if (!fullName) setFullName(currentUser.name);
      if (!email) setEmail(currentUser.email);
    }
  }, [currentUser]);

  if (!isOpen) return null;

  const isLight = theme === 'light';
  const basePrice = selectedExpedition ? selectedExpedition.pricePerPerson : 14500;
  const expeditionTitle = selectedExpedition ? selectedExpedition.title : "Challenger Deep Hadal Descent";
  const expeditionId = selectedExpedition ? selectedExpedition.id : "exp-1";

  const addonsList = [
    { id: '4K Telemetry Video', label: '8K Telemetry & VR Recording Package', price: 1200 },
    { id: 'Hadal Champagne Toast', label: 'Ocean Floor Seabed Toast & Commemorative Medallion', price: 650 },
    { id: 'Custom Bathymetric Map', label: 'Personalized 3D Topographical Dive Plaque', price: 450 },
    { id: 'Mother Ship VIP Suite', label: '7-Day Explorer Yacht Master Stateroom Upgrade', price: 3800 },
  ];

  const addonsTotal = selectedAddons.reduce((sum, addId) => {
    const found = addonsList.find(a => a.id === addId);
    return sum + (found ? found.price : 0);
  }, 0);

  const grandTotal = (basePrice * diverCount) + addonsTotal;

  const toggleAddon = (id) => {
    setSelectedAddons(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    if (!fullName || !email) {
      alert("Please provide your name and email.");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        expeditionId,
        expeditionTitle,
        customerName: fullName,
        customerEmail: email,
        customerPhone: phone,
        diverCount,
        diveDate,
        submersibleClass,
        totalAmount: grandTotal,
        addOns: selectedAddons,
        specialRequests
      };

      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      if (data.success) {
        setBookingConfirmation(data.booking);
        if (onBookingSuccess) onBookingSuccess(data.booking);
      } else {
        alert("Booking error: " + data.message);
      }
    } catch (err) {
      console.warn("Using fallback local confirmation", err);
      const fallbackBooking = {
        bookingReference: `ABYSS-${Math.floor(10000 + Math.random() * 90000)}`,
        expeditionTitle,
        customerName: fullName,
        customerEmail: email,
        diverCount,
        diveDate,
        totalAmount: grandTotal,
        status: "Confirmed"
      };
      setBookingConfirmation(fallbackBooking);
      if (onBookingSuccess) onBookingSuccess(fallbackBooking);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetAndClose = () => {
    setBookingConfirmation(null);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-3 sm:p-6">
        
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={resetAndClose}
          className="fixed inset-0 bg-slate-950/75 backdrop-blur-xl"
        />

        {/* POP IN MODAL (Small ➔ BIG ➔ Normal) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.2 }}
          animate={{ 
            opacity: 1, 
            scale: [0.2, 1.18, 0.95, 1] 
          }}
          exit={{ opacity: 0, scale: 0.3 }}
          transition={{ 
            duration: 0.55,
            times: [0, 0.65, 0.85, 1],
            ease: "easeInOut"
          }}
          className={`relative w-full max-w-2xl rounded-3xl backdrop-blur-2xl border shadow-2xl overflow-hidden z-10 cutout-corner-tr max-h-[90vh] flex flex-col ${
            isLight
              ? 'bg-white border-sky-300 text-slate-800 shadow-[0_25px_80px_rgba(14,165,233,0.35)]'
              : 'bg-gradient-to-b from-slate-900/95 via-abyss-950/95 to-black/95 border-cyan-400/40 text-white'
          }`}
        >
          
          {/* Modal Header */}
          <div className={`p-5 sm:p-6 border-b flex items-center justify-between ${
            isLight ? 'border-sky-200 bg-sky-50/80' : 'border-cyan-500/20 bg-gradient-to-r from-cyan-950/40 to-transparent'
          }`}>
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl border flex items-center justify-center ${
                isLight ? 'bg-sky-100 border-sky-300 text-sky-700' : 'bg-cyan-400/20 border-cyan-400/40 text-cyan-300'
              }`}>
                <Anchor className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <h3 className="font-display font-bold text-lg sm:text-xl">
                  {bookingConfirmation ? "Mission Clearance Confirmed" : "Reserve Abyss Expedition"}
                </h3>
                <p className={`text-xs font-mono font-semibold ${isLight ? 'text-sky-700' : 'text-cyan-400'}`}>
                  {expeditionTitle}
                </p>
              </div>
            </div>

            <button
              onClick={resetAndClose}
              className={`p-2 rounded-xl border transition-all hover:scale-110 active:scale-90 ${
                isLight ? 'bg-white border-sky-200 text-slate-600 hover:bg-sky-50' : 'bg-white/5 border-white/10 text-slate-300 hover:text-white'
              }`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Body */}
          <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-6">
            
            {bookingConfirmation ? (
              // Confirmation View
              <div className="text-center py-6 space-y-5">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-400 text-emerald-500 mx-auto flex items-center justify-center shadow-lg animate-bounce">
                  <CheckCircle2 className="w-9 h-9" />
                </div>

                <div className="space-y-1">
                  <h4 className="text-2xl font-bold font-display">Descent Clearance Approved!</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-300 max-w-md mx-auto">
                    Your deep-sea submersible seat is confirmed. Our expedition flight coordinator will contact you for telemetry & medical clearance.
                  </p>
                </div>

                {/* Booking Receipt Card */}
                <div className={`p-4 sm:p-5 rounded-2xl border text-left space-y-3 font-mono text-xs ${
                  isLight ? 'bg-sky-50/80 border-sky-200' : 'bg-white/[0.04] border-cyan-400/30'
                }`}>
                  <div className="flex justify-between border-b border-sky-200/50 pb-2">
                    <span className="text-slate-500">BOOKING REFERENCE:</span>
                    <span className="text-sky-600 font-bold">{bookingConfirmation.bookingReference}</span>
                  </div>
                  <div className="flex justify-between border-b border-sky-200/50 pb-2">
                    <span className="text-slate-500">LEAD EXPLORER:</span>
                    <span>{bookingConfirmation.customerName}</span>
                  </div>
                  <div className="flex justify-between border-b border-sky-200/50 pb-2">
                    <span className="text-slate-500">EXPEDITION:</span>
                    <span>{bookingConfirmation.expeditionTitle}</span>
                  </div>
                  <div className="flex justify-between border-b border-sky-200/50 pb-2">
                    <span className="text-slate-500">MISSION DATE:</span>
                    <span>{bookingConfirmation.diveDate}</span>
                  </div>
                  <div className="flex justify-between pt-1 text-sm font-bold">
                    <span className="text-sky-700">TOTAL SECURED:</span>
                    <span className="text-sky-600">${bookingConfirmation.totalAmount.toLocaleString()}</span>
                  </div>
                </div>

                <button
                  onClick={resetAndClose}
                  className="px-8 py-3 rounded-full bg-gradient-to-r from-sky-500 to-teal-500 text-white font-bold font-display text-sm shadow-md hover:scale-108 active:scale-95 transition-all"
                >
                  Done / View Dive Roster
                </button>
              </div>
            ) : (
              // Booking Form View
              <form onSubmit={handleBookingSubmit} className="space-y-6">
                
                {/* 1. Diver Count & Date Selection */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  
                  <div className={`p-3.5 rounded-2xl border ${isLight ? 'bg-sky-50/50 border-sky-200' : 'bg-white/[0.03] border-white/10'}`}>
                    <label className={`block text-[11px] font-mono font-bold uppercase mb-1 flex items-center gap-1.5 ${
                      isLight ? 'text-sky-700' : 'text-cyan-400'
                    }`}>
                      <Users className="w-3.5 h-3.5" />
                      <span>Number of Divers</span>
                    </label>
                    <div className="flex items-center gap-2 mt-2">
                      {[1, 2, 3, 4].map(num => (
                        <button
                          type="button"
                          key={num}
                          onClick={() => setDiverCount(num)}
                          className={`flex-1 py-2 rounded-xl text-xs font-mono font-bold transition-all hover:scale-105 active:scale-95 ${
                            diverCount === num
                              ? 'bg-sky-500 text-white shadow-sm'
                              : isLight
                                ? 'bg-white border border-sky-200 text-slate-700 hover:bg-sky-50'
                                : 'bg-white/5 text-slate-300 hover:bg-white/10 border border-white/10'
                          }`}
                        >
                          {num} {num === 1 ? 'Diver' : 'Divers'}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className={`p-3.5 rounded-2xl border ${isLight ? 'bg-sky-50/50 border-sky-200' : 'bg-white/[0.03] border-white/10'}`}>
                    <label className={`block text-[11px] font-mono font-bold uppercase mb-1 flex items-center gap-1.5 ${
                      isLight ? 'text-sky-700' : 'text-cyan-400'
                    }`}>
                      <Calendar className="w-3.5 h-3.5" />
                      <span>Expedition Launch Date</span>
                    </label>
                    <input
                      type="date"
                      value={diveDate}
                      onChange={(e) => setDiveDate(e.target.value)}
                      className={`w-full mt-2 px-3 py-2 rounded-xl border text-xs font-mono focus:outline-none ${
                        isLight 
                          ? 'bg-white border-sky-200 text-slate-800 focus:border-sky-500' 
                          : 'bg-abyss-950/80 border-white/15 text-white focus:border-cyan-400'
                      }`}
                      required
                    />
                  </div>

                </div>

                {/* 2. Submersible Class Selection */}
                <div className={`p-3.5 rounded-2xl border ${isLight ? 'bg-sky-50/50 border-sky-200' : 'bg-white/[0.03] border-white/10'}`}>
                  <label className={`block text-[11px] font-mono font-bold uppercase mb-2 flex items-center gap-1.5 ${
                    isLight ? 'text-sky-700' : 'text-cyan-400'
                  }`}>
                    <Compass className="w-3.5 h-3.5" />
                    <span>Submersible Vessel Class</span>
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {[
                      { name: 'Triton Titanium Class', desc: 'Max 11,000m depth' },
                      { name: 'DeepFlight Falcon 3S', desc: 'Hydrobatic glider' },
                      { name: 'Seamagine Aurora-6', desc: 'Panoramic acrylic VIP' }
                    ].map((sub, i) => (
                      <button
                        type="button"
                        key={i}
                        onClick={() => setSubmersibleClass(sub.name)}
                        className={`p-2.5 rounded-xl text-left transition-all border hover:scale-105 active:scale-95 ${
                          submersibleClass === sub.name
                            ? isLight 
                              ? 'bg-sky-500 text-white border-sky-500 shadow-sm'
                              : 'bg-cyan-500/20 border-cyan-400 text-white'
                            : isLight
                              ? 'bg-white border-sky-200 text-slate-700 hover:bg-sky-50'
                              : 'bg-white/5 border-white/10 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        <div className="text-xs font-bold font-display">{sub.name}</div>
                        <div className={`text-[10px] font-mono mt-0.5 ${submersibleClass === sub.name && isLight ? 'text-sky-100' : 'text-sky-600'}`}>{sub.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 3. Add-on Upgrades */}
                <div className="space-y-2">
                  <label className={`block text-[11px] font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 ${
                    isLight ? 'text-sky-700' : 'text-cyan-400'
                  }`}>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Expedition Upgrades & Telemetry</span>
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {addonsList.map(addon => {
                      const isSelected = selectedAddons.includes(addon.id);
                      return (
                        <div
                          key={addon.id}
                          onClick={() => toggleAddon(addon.id)}
                          className={`p-3 rounded-xl border cursor-pointer transition-all hover:scale-102 active:scale-98 flex items-start justify-between gap-2 ${
                            isSelected
                              ? isLight 
                                ? 'bg-sky-50 border-sky-400 text-slate-900 shadow-sm' 
                                : 'bg-cyan-500/15 border-cyan-400 text-white'
                              : isLight
                                ? 'bg-white border-sky-200/80 text-slate-700 hover:bg-sky-50/50'
                                : 'bg-white/[0.02] border-white/10 text-slate-400 hover:border-white/20'
                          }`}
                        >
                          <div>
                            <div className="text-xs font-semibold">{addon.label}</div>
                            <div className={`text-[10px] font-mono font-bold mt-1 ${isLight ? 'text-sky-600' : 'text-cyan-300'}`}>+${addon.price.toLocaleString()}</div>
                          </div>
                          <div className={`w-4 h-4 rounded-md border flex items-center justify-center shrink-0 mt-0.5 ${
                            isSelected ? 'bg-sky-500 border-sky-500 text-white' : 'border-slate-300 dark:border-white/30'
                          }`}>
                            {isSelected && <CheckCircle2 className="w-3 h-3 stroke-[3]" />}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 4. Explorer Contact Details */}
                <div className="space-y-3 pt-2 border-t border-sky-200/60 dark:border-cyan-500/15">
                  <div className={`text-[11px] font-mono font-bold uppercase tracking-wider ${
                    isLight ? 'text-sky-700' : 'text-cyan-400'
                  }`}>
                    Lead Explorer Information
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="Full Name *"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className={`px-3.5 py-2.5 rounded-xl border text-xs focus:outline-none ${
                        isLight 
                          ? 'bg-sky-50/50 border-sky-200 text-slate-800 placeholder-slate-400 focus:border-sky-500' 
                          : 'bg-abyss-950 border-white/15 text-white placeholder-slate-500 focus:border-cyan-400'
                      }`}
                      required
                    />
                    <input
                      type="email"
                      placeholder="Email Address *"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={`px-3.5 py-2.5 rounded-xl border text-xs focus:outline-none ${
                        isLight 
                          ? 'bg-sky-50/50 border-sky-200 text-slate-800 placeholder-slate-400 focus:border-sky-500' 
                          : 'bg-abyss-950 border-white/15 text-white placeholder-slate-500 focus:border-cyan-400'
                      }`}
                      required
                    />
                  </div>
                  <input
                    type="tel"
                    placeholder="Phone (with Country Code)"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-xs focus:outline-none ${
                      isLight 
                        ? 'bg-sky-50/50 border-sky-200 text-slate-800 placeholder-slate-400 focus:border-sky-500' 
                        : 'bg-abyss-950 border-white/15 text-white placeholder-slate-500 focus:border-cyan-400'
                    }`}
                  />
                </div>

                {/* Price Breakdown & Bouncy Submit Button */}
                <div className="pt-4 border-t border-sky-200/60 dark:border-cyan-500/20 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <div className="text-[10px] font-mono text-slate-500">TOTAL EXPEDITION VALUE</div>
                    <div className="text-2xl font-extrabold font-mono flex items-baseline gap-1">
                      <span className={isLight ? 'text-sky-600' : 'text-cyan-300'}>${grandTotal.toLocaleString()}</span>
                      <span className="text-xs text-slate-500 font-sans font-normal">({diverCount} diver{diverCount > 1 ? 's' : ''})</span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-gradient-to-r from-sky-500 via-cyan-400 to-teal-400 text-slate-950 font-display font-bold text-sm shadow-md hover:shadow-lg transition-all duration-300 hover:scale-108 active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Securing Telemetry Slot...</span>
                      </>
                    ) : (
                      <>
                        <ShieldCheck className="w-4 h-4" />
                        <span>Confirm Mission Booking</span>
                      </>
                    )}
                  </button>
                </div>

              </form>
            )}

          </div>

        </motion.div>

      </div>
    </AnimatePresence>
  );
}

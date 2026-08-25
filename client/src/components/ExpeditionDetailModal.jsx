import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, MapPin, Anchor, Clock, Star, Users, 
  CheckCircle2, Compass, ArrowRight, Shield, Sparkles, ZoomIn 
} from 'lucide-react';

const FALLBACK_SEA_IMAGE = "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80";

export default function ExpeditionDetailModal({ expedition, isOpen, onClose, onBookNow, theme = 'light' }) {
  if (!isOpen || !expedition) return null;

  const isLight = theme === 'light';
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const images = expedition.gallery && expedition.gallery.length > 0 
    ? expedition.gallery 
    : [expedition.image || FALLBACK_SEA_IMAGE];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-3 sm:p-6">
        
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
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
          className={`relative w-full max-w-4xl rounded-3xl backdrop-blur-2xl border shadow-2xl overflow-hidden z-10 max-h-[90vh] flex flex-col cutout-corner-tr ${
            isLight
              ? 'bg-white border-sky-300 text-slate-800 shadow-[0_25px_80px_rgba(14,165,233,0.35)]'
              : 'bg-gradient-to-b from-slate-900/95 via-abyss-950/95 to-black border-cyan-400/40 text-white'
          }`}
        >
          
          {/* Top Bar with Close Button */}
          <div className={`p-4 sm:p-5 border-b flex items-center justify-between ${
            isLight ? 'border-sky-200 bg-sky-50/80' : 'border-cyan-500/20 bg-gradient-to-r from-cyan-950/40 to-transparent'
          }`}>
            <div className={`flex items-center gap-2 text-xs font-mono font-bold ${isLight ? 'text-sky-700' : 'text-cyan-300'}`}>
              <Anchor className="w-4 h-4 text-sky-500" />
              <span>MISSION DOSSIER // {expedition.id.toUpperCase()}</span>
            </div>

            <button
              onClick={onClose}
              className={`p-2 rounded-xl border transition-all hover:scale-110 active:scale-90 ${
                isLight ? 'bg-white border-sky-200 text-slate-600 hover:bg-sky-50' : 'bg-white/5 border-white/10 text-slate-300 hover:text-white'
              }`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Content Scroll Area */}
          <div className="p-5 sm:p-8 overflow-y-auto flex-1 space-y-6">
            
            {/* Gallery Viewer with Interactive Zoom Effect */}
            <div className="space-y-3">
              <div 
                onClick={() => setIsZoomed(!isZoomed)}
                className={`relative rounded-2xl overflow-hidden h-64 sm:h-80 border cursor-zoom-in ${
                  isLight ? 'border-sky-200' : 'border-cyan-500/30'
                }`}
              >
                <img 
                  src={images[activeImageIndex] || FALLBACK_SEA_IMAGE} 
                  alt={expedition.title}
                  onError={(e) => { e.currentTarget.src = FALLBACK_SEA_IMAGE; }}
                  className={`w-full h-full object-cover transition-transform duration-700 ease-out ${
                    isZoomed ? 'scale-150 cursor-zoom-out' : 'hover:scale-110'
                  }`} 
                />
                <div className="absolute bottom-3 left-3 px-3 py-1 rounded-full bg-slate-900/80 backdrop-blur-md border border-sky-400/30 text-xs font-mono text-sky-300 font-bold">
                  DEPTH: {expedition.depth}
                </div>

                <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-slate-950/70 text-white text-[10px] font-mono flex items-center gap-1">
                  <ZoomIn className="w-3 h-3" />
                  <span>{isZoomed ? 'Click to reset' : 'Click to zoom'}</span>
                </div>
              </div>

              {images.length > 1 && (
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setActiveImageIndex(idx);
                        setIsZoomed(false);
                      }}
                      className={`relative w-20 h-14 rounded-lg overflow-hidden shrink-0 border-2 transition-all hover:scale-105 ${
                        activeImageIndex === idx ? 'border-sky-500 scale-105 shadow-md' : 'border-transparent opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img 
                        src={img} 
                        alt="Thumbnail" 
                        onError={(e) => { e.currentTarget.src = FALLBACK_SEA_IMAGE; }}
                        className="w-full h-full object-cover" 
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Title, Location & Quick Badges */}
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className={`px-2.5 py-0.5 rounded-full border text-xs font-mono font-bold ${
                  isLight ? 'bg-sky-100 border-sky-300 text-sky-800' : 'bg-cyan-400/10 border-cyan-400/30 text-cyan-300'
                }`}>
                  {expedition.zone}
                </span>
                <span className="flex items-center gap-1 text-xs font-mono text-amber-500">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <span>{expedition.rating} ({expedition.reviewsCount} reviews)</span>
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold font-display">
                {expedition.title}
              </h2>
              <div className={`flex items-center gap-2 text-xs sm:text-sm font-medium ${isLight ? 'text-sky-700' : 'text-cyan-300/80'}`}>
                <MapPin className="w-4 h-4 text-sky-500" />
                <span>{expedition.location} ({expedition.coordinates})</span>
              </div>
            </div>

            {/* Overview Description */}
            <p className={`text-sm sm:text-base leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
              {expedition.description}
            </p>

            {/* Vessel & Mission Specs Grid */}
            <div className={`grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-2xl border text-xs font-mono ${
              isLight ? 'bg-sky-50/70 border-sky-200' : 'bg-white/[0.03] border-cyan-500/20'
            }`}>
              <div>
                <div className="text-slate-400 text-[10px]">SUBMERSIBLE</div>
                <div className="font-bold mt-0.5 truncate">{expedition.vessel}</div>
              </div>
              <div>
                <div className="text-slate-400 text-[10px]">MAX DEPTH</div>
                <div className={`font-bold mt-0.5 ${isLight ? 'text-sky-600' : 'text-cyan-300'}`}>{expedition.depth}</div>
              </div>
              <div>
                <div className="text-slate-400 text-[10px]">DURATION</div>
                <div className="font-bold mt-0.5">{expedition.duration}</div>
              </div>
              <div>
                <div className="text-slate-400 text-[10px]">GUEST CAPACITY</div>
                <div className="font-bold mt-0.5">{expedition.maxGuests} Explorers / Dive</div>
              </div>
            </div>

            {/* Mission Highlights */}
            {expedition.highlights && expedition.highlights.length > 0 && (
              <div className="space-y-3">
                <h4 className={`text-xs font-mono font-bold uppercase tracking-wider ${isLight ? 'text-sky-700' : 'text-cyan-400'}`}>
                  Expedition Highlights & Inclusions
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {expedition.highlights.map((h, i) => (
                    <div key={i} className={`flex items-start gap-2.5 p-3 rounded-xl border text-xs ${
                      isLight ? 'bg-white border-sky-200 text-slate-700' : 'bg-abyss-950/60 border-white/10 text-slate-200'
                    }`}>
                      <CheckCircle2 className="w-4 h-4 text-sky-500 shrink-0 mt-0.5" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Bottom Booking CTA Bar */}
            <div className={`pt-4 border-t flex flex-col sm:flex-row items-center justify-between gap-4 ${
              isLight ? 'border-sky-200' : 'border-cyan-500/20'
            }`}>
              <div>
                <div className="text-[10px] font-mono text-slate-400">EXPEDITION RATE</div>
                <div className="text-2xl font-extrabold font-mono">
                  <span className={isLight ? 'text-sky-600' : 'text-cyan-300'}>${expedition.pricePerPerson.toLocaleString()}</span>
                  <span className="text-xs text-slate-500 font-sans font-normal"> / person</span>
                </div>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  onClick={() => {
                    onClose();
                    onBookNow(expedition);
                  }}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-gradient-to-r from-sky-500 via-cyan-400 to-teal-400 text-slate-950 font-display font-bold text-sm shadow-md hover:shadow-lg transition-all duration-300 hover:scale-108 active:scale-95 flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4 fill-slate-950" />
                  <span>Book This Descent</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

          </div>

        </motion.div>

      </div>
    </AnimatePresence>
  );
}

import React, { useState } from 'react';
import { 
  Heart, Star, MapPin, Compass, Clock, ArrowUpRight, 
  Anchor, Layers, CheckCircle2, Sparkles, Tag 
} from 'lucide-react';

const FALLBACK_SEA_IMAGE = "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80";

export default function ExpeditionCard({ 
  expedition, 
  onSelect, 
  onBook, 
  isWishlisted, 
  onToggleWishlist,
  theme = 'light' 
}) {
  const isLight = theme === 'light';
  const [imgSrc, setImgSrc] = useState(expedition.image || FALLBACK_SEA_IMAGE);

  const handleCardClick = () => {
    onSelect(expedition);
  };

  return (
    <div
      onClick={handleCardClick}
      className={`group relative rounded-3xl overflow-hidden border-2 cursor-pointer transition-colors duration-300 flex flex-col justify-between slice-card-diagonal ${
        isLight
          ? 'bg-white border-sky-200 hover:border-sky-400 shadow-[0_8px_30px_rgba(14,165,233,0.12)]'
          : 'bg-slate-900/90 border-cyan-500/30 hover:border-cyan-400 shadow-[0_10px_30px_rgba(0,0,0,0.6)]'
      }`}
    >
      
      {/* Top Image Section (Natural, clean rendering without jarring zoom in/out) */}
      <div className="relative h-64 overflow-hidden bg-slate-900">
        <img 
          src={imgSrc} 
          alt={expedition.title} 
          onError={() => setImgSrc(FALLBACK_SEA_IMAGE)}
          className="w-full h-full object-cover transition-all duration-300 filter brightness-95 group-hover:brightness-105"
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />

        {/* Depth Badge */}
        <div className="absolute top-3 left-3 bg-slate-950/85 backdrop-blur-md border border-sky-400/60 text-sky-300 px-3.5 py-1 rounded-full text-xs font-mono font-bold flex items-center gap-1.5 shadow-lg slice-badge-angle">
          <Anchor className="w-3.5 h-3.5 text-sky-400" />
          <span>{expedition.depth}</span>
        </div>

        {/* Wishlist Heart Button with Bouncy Pop */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist(expedition.id);
          }}
          className={`absolute top-3 right-3 p-2.5 rounded-full backdrop-blur-md border transition-all duration-300 shadow-lg btn-bounce ${
            isWishlisted
              ? 'bg-rose-500 border-rose-400 text-white fill-white shadow-[0_0_15px_rgba(244,63,94,0.7)]'
              : 'bg-slate-950/70 border-white/20 text-white hover:text-rose-400 hover:bg-slate-900'
          }`}
          title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-white' : ''}`} />
        </button>

        {/* PROMOTIONAL OFFER BADGE */}
        {expedition.badge && (
          <div className="absolute bottom-3 left-3">
            <span className={`px-3 py-1 rounded-lg text-[10px] font-mono font-extrabold uppercase tracking-wider text-white bg-gradient-to-r ${expedition.badgeColor || 'from-sky-500 to-blue-600'} shadow-lg border border-white/20 flex items-center gap-1`}>
              <Tag className="w-3 h-3" />
              <span>{expedition.badge}</span>
            </span>
          </div>
        )}
      </div>

      {/* Card Content Details */}
      <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
        
        <div className="space-y-2">
          
          {/* Location & Rating */}
          <div className="flex items-center justify-between text-xs font-medium">
            <div className={`flex items-center gap-1 truncate max-w-[200px] ${
              isLight ? 'text-sky-700 font-bold' : 'text-cyan-300'
            }`}>
              <MapPin className="w-3.5 h-3.5 shrink-0 text-sky-500" />
              <span className="truncate">{expedition.location}</span>
            </div>
            <div className="flex items-center gap-1 font-mono text-amber-500 font-semibold shrink-0">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{expedition.rating}</span>
              <span className="text-slate-400 font-normal">({expedition.reviewsCount})</span>
            </div>
          </div>

          {/* Expedition Title */}
          <h3 className={`text-xl font-bold font-display transition-colors line-clamp-1 ${
            isLight 
              ? 'text-slate-900 group-hover:text-sky-600' 
              : 'text-white group-hover:text-cyan-300'
          }`}>
            {expedition.title}
          </h3>

          <p className={`text-xs sm:text-sm line-clamp-2 leading-relaxed font-normal ${
            isLight ? 'text-slate-600' : 'text-slate-300'
          }`}>
            {expedition.description}
          </p>

        </div>

        {/* Vessel & Duration Specs */}
        <div className={`pt-3 border-t grid grid-cols-2 gap-2 text-[11px] font-mono ${
          isLight ? 'border-sky-100 text-slate-600' : 'border-cyan-500/15 text-slate-300'
        }`}>
          <div className="flex items-center gap-1.5 truncate">
            <Compass className="w-3.5 h-3.5 text-sky-500 shrink-0" />
            <span className="truncate">{expedition.vessel}</span>
          </div>
          <div className="flex items-center gap-1.5 justify-end">
            <Clock className="w-3.5 h-3.5 text-teal-500 shrink-0" />
            <span>{expedition.duration.split(' ')[0]} {expedition.duration.split(' ')[1]}</span>
          </div>
        </div>

        {/* Pricing and Action Buttons with Pop & Bounce on Booking Button */}
        <div className={`pt-3 border-t flex items-center justify-between ${
          isLight ? 'border-sky-100' : 'border-cyan-500/20'
        }`}>
          <div>
            <div className="text-[10px] font-mono text-slate-400 uppercase font-bold">Price per Explorer</div>
            <div className={`text-xl font-bold font-mono flex items-baseline gap-1 ${
              isLight ? 'text-slate-900' : 'text-white'
            }`}>
              <span className={isLight ? 'text-sky-600 font-extrabold' : 'text-cyan-300'}>${expedition.pricePerPerson.toLocaleString()}</span>
              <span className="text-[10px] text-slate-400 font-normal font-sans">/ person</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onSelect(expedition);
              }}
              className={`p-2.5 rounded-xl border transition-all btn-bounce ${
                isLight 
                  ? 'bg-sky-50 hover:bg-sky-100 border-sky-200 text-sky-800' 
                  : 'bg-white/5 hover:bg-white/10 border-white/10 text-slate-200 hover:text-cyan-300'
              }`}
              title="View Mission Dossier"
            >
              <ArrowUpRight className="w-4 h-4" />
            </button>

            {/* Bouncy Pop Booking Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onBook(expedition);
              }}
              className="px-4 py-2.5 rounded-xl font-display font-bold text-xs sm:text-sm bg-gradient-to-r from-sky-500 via-cyan-400 to-teal-400 text-slate-950 shadow-md hover:shadow-lg transition-all btn-bounce"
            >
              Book Dive
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}

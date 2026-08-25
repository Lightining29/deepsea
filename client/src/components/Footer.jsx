import React, { useState } from 'react';
import { Anchor, Waves, Mail, Send, ShieldCheck, Heart, ArrowUp, Compass } from 'lucide-react';

export default function Footer({ onSelectTab, onOpenBookingModal, theme = 'light' }) {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const isLight = theme === 'light';

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setIsSubscribed(true);
      setEmail('');
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className={`pt-16 pb-28 md:pb-16 border-t relative overflow-hidden transition-colors ${
      isLight 
        ? 'bg-slate-900 text-slate-200 border-sky-300/40' 
        : 'bg-gradient-to-b from-abyss-950 via-black to-black text-slate-100 border-cyan-500/20'
    }`}>
      
      {/* Glow bottom */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-sky-500/10 blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12 pb-12 border-b border-white/10">
          
          {/* Col 1: Brand & Oceanographic Mission */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-400 via-cyan-400 to-blue-600 p-[2px] shadow-[0_0_20px_rgba(14,165,233,0.4)]">
                <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                  <Anchor className="w-5 h-5 text-sky-400" />
                </div>
              </div>
              <div>
                <span className="text-xl font-bold font-display tracking-tight text-white">
                  AbyssX Expeditions
                </span>
                <span className="block text-[10px] font-mono tracking-widest text-sky-400 uppercase font-semibold">
                  Manned Deep Ocean Exploration
                </span>
              </div>
            </div>

            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed max-w-md">
              Pioneering private access to the Hadal and Abyssal zones of Earth. Committed to 100% safety standards, oceanographic science, and deep-sea benthic habitat conservation.
            </p>

            <div className="flex items-center gap-3 text-xs font-mono text-sky-300 pt-1">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-sky-950 border border-sky-400/30">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>ALL SYSTEMS GREEN</span>
              </span>
              <span>11°22′N 142°35′E</span>
            </div>
          </div>

          {/* Col 2: Destinations */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-bold text-sky-400 uppercase tracking-wider">
              Deep Trench Dives
            </h4>
            <ul className="space-y-2 text-xs text-slate-300">
              <li><button onClick={() => onSelectTab('destinations')} className="hover:text-sky-300 transition-colors">Mariana Trench (10,928m)</button></li>
              <li><button onClick={() => onSelectTab('destinations')} className="hover:text-sky-300 transition-colors">RMS Titanic Survey (3,810m)</button></li>
              <li><button onClick={() => onSelectTab('destinations')} className="hover:text-sky-300 transition-colors">Azores Bioluminescent Plain</button></li>
              <li><button onClick={() => onSelectTab('destinations')} className="hover:text-sky-300 transition-colors">Galápagos Smoker Vents</button></li>
              <li><button onClick={() => onSelectTab('destinations')} className="hover:text-sky-300 transition-colors">Fram Strait Polar Deep</button></li>
            </ul>
          </div>

          {/* Col 3: Fleet & Science */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-bold text-sky-400 uppercase tracking-wider">
              Submersible Fleet
            </h4>
            <ul className="space-y-2 text-xs text-slate-300">
              <li><button onClick={() => onSelectTab('submersibles')} className="hover:text-sky-300 transition-colors">Triton 36,000/2 Titanium</button></li>
              <li><button onClick={() => onSelectTab('submersibles')} className="hover:text-sky-300 transition-colors">DeepFlight Super Falcon 3S</button></li>
              <li><button onClick={() => onSelectTab('submersibles')} className="hover:text-sky-300 transition-colors">Seamagine Aurora-6 Luxury</button></li>
              <li><button onClick={() => onSelectTab('depth-zones')} className="hover:text-sky-300 transition-colors">Bathymetric Sonar Tech</button></li>
              <li><button onClick={() => onSelectTab('about')} className="hover:text-sky-300 transition-colors">DNV-GL Safety Protocols</button></li>
            </ul>
          </div>

          {/* Col 4: Dispatch Newsletter */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-bold text-sky-400 uppercase tracking-wider">
              Abyssal Dispatches
            </h4>
            <p className="text-[11px] text-slate-400 leading-normal">
              Receive live mission alerts, deep-sea biological discovery reports, and slot openings.
            </p>

            {isSubscribed ? (
              <div className="p-3 rounded-xl bg-sky-950/80 border border-sky-400/40 text-sky-300 text-xs font-mono flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Telemetry Subscribed!</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <div className="relative">
                  <input
                    type="email"
                    placeholder="explorer@ocean.org"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs placeholder-slate-400 focus:outline-none focus:border-sky-400 pr-10"
                  />
                  <button
                    type="submit"
                    className="absolute right-1.5 top-1.5 p-1.5 rounded-lg bg-sky-500 text-white hover:bg-sky-400 transition-colors"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
              </form>
            )}
          </div>

        </div>

        {/* Bottom Bar with Copyright & Back to Top */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-slate-400">
          <div>
            © 2026 AbyssX Deep Sea Adventures Inc. All Hadal exploration rights reserved.
          </div>

          <div className="flex items-center gap-4">
            <span>ISO 9001 • DNV-GL Certified</span>
            <button
              onClick={scrollToTop}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-sky-400 transition-colors flex items-center gap-1"
            >
              <span>Top</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
}

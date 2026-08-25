import React, { useState } from 'react';
import { 
  ShieldCheck, Wifi, Radio, Cpu, CheckCircle2, 
  Smartphone, Eye, Layers, Zap, Navigation, ArrowRight, Sparkles 
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function SubmersibleShowcase({ onOpenBookingModal, theme = 'light' }) {
  const [activeHotspot, setActiveHotspot] = useState(0);
  const isLight = theme === 'light';

  const hotspots = [
    {
      id: 0,
      title: "Grade 5 Titanium Hull",
      detail: "90mm forged titanium pressure sphere withstands 1,100 bar of pressure at Mariana Trench depth (11,000m).",
      tag: "11,000M RATED"
    },
    {
      id: 1,
      title: "60,000 Lumen LED Array",
      detail: "Ultra-high output color-calibrated deep-sea lighting pierces through pitch-black water to illuminate shipwrecks & trenches.",
      tag: "8K BROADCAST"
    },
    {
      id: 2,
      title: "Hydraulic Manipulator Arm",
      detail: "Force-feedback robotic arm for precise scientific bio-sampling, laser measurement, and artifact exploration.",
      tag: "BIO-SAMPLING"
    },
    {
      id: 3,
      title: "Multi-Beam Bathymetric Sonar",
      detail: "Acoustic 3D seafloor mapping and real-time collision avoidance with telemetry relay to mother ship.",
      tag: "3D MAPPING"
    }
  ];

  const perks = [
    { title: "Pressurized Titanium Safety", desc: "Dual oxygen & scrubber redundancy for 96 hours" },
    { title: "Personal 8K Descent Video", desc: "Broadcast-quality personal multi-camera documentary" },
    { title: "Marine Biologist Master Guide", desc: "Live science narration by world-renowned ocean scientists" },
    { title: "24/7 Surface Mother Ship Support", desc: "Real-time acoustic underwater comms & radar positioning" }
  ];

  return (
    <section className="py-16 sm:py-24 relative overflow-hidden">
      
      {/* Glow Backdrop */}
      <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-sky-400/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-teal-400/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16 space-y-3">
          <div className={`inline-flex items-center gap-2 px-3.5 py-1 rounded-full border text-xs font-mono font-bold tracking-wider uppercase ${
            isLight ? 'bg-sky-50 border-sky-300 text-sky-700' : 'bg-cyan-400/10 border-cyan-400/30 text-cyan-300'
          }`}>
            <Radio className="w-3.5 h-3.5 text-sky-500 animate-pulse" />
            <span>Next-Generation Submersible Fleet</span>
          </div>
          <h2 className={`text-3xl sm:text-4xl lg:text-5xl font-extrabold font-display ${
            isLight ? 'text-slate-900' : 'text-white'
          }`}>
            Engineered for the <br />
            <span className="bg-gradient-to-r from-sky-600 via-cyan-500 to-teal-500 bg-clip-text text-transparent">
              Most Extreme Pressures on Earth.
            </span>
          </h2>
          <p className={`text-sm sm:text-base ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
            Every descent is piloted by certified master submersibilists in vessels certified by DNV-GL for commercial deep manned exploration.
          </p>
        </div>

        {/* Feature Grid: Left Info & Perks, Right Mobile Phone App & Vessel Mockup */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: "Your Journey, Simplified" Container */}
          <div className="lg:col-span-6 space-y-6">
            <div className={`p-6 sm:p-8 rounded-3xl backdrop-blur-2xl border shadow-2xl cutout-corner-tr ${
              isLight 
                ? 'bg-white/80 border-sky-200/90 shadow-[0_15px_45px_rgba(14,165,233,0.12)]' 
                : 'bg-gradient-to-br from-cyan-950/40 via-abyss-900/60 to-abyss-950/80 border-cyan-500/25'
            }`}>
              <span className={`text-xs font-mono font-bold uppercase tracking-widest ${
                isLight ? 'text-sky-600' : 'text-cyan-400'
              }`}>
                Seamless Abyss Exploration
              </span>
              <h3 className={`text-2xl sm:text-3xl font-bold font-display mt-1 mb-4 ${
                isLight ? 'text-slate-900' : 'text-white'
              }`}>
                Your Descent, Simplified.
              </h3>
              <p className={`text-sm leading-relaxed mb-6 ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
                Book flights, surface mother ship transfers, luxury cabin accommodation, and deep sub dives in one unified telemetry dashboard.
              </p>

              {/* Perks Checklist */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                {perks.map((p, idx) => (
                  <div key={idx} className={`flex items-start gap-3 p-3 rounded-xl border transition-colors ${
                    isLight 
                      ? 'bg-sky-50/60 border-sky-200/70 hover:border-sky-300' 
                      : 'bg-white/[0.03] border-white/10 hover:border-cyan-400/30'
                  }`}>
                    <div className="p-1 rounded-lg bg-sky-500/20 text-sky-600 dark:text-cyan-300 shrink-0 mt-0.5">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <div>
                      <div className={`text-xs font-bold ${isLight ? 'text-slate-800' : 'text-white'}`}>{p.title}</div>
                      <div className="text-[11px] text-slate-500 mt-0.5 leading-snug">{p.desc}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Interactive Hotspot Selector */}
              <div className={`space-y-2 pt-2 border-t ${isLight ? 'border-sky-200' : 'border-cyan-500/20'}`}>
                <div className={`text-[11px] font-mono font-semibold uppercase tracking-wider mb-2 ${
                  isLight ? 'text-sky-700' : 'text-cyan-400'
                }`}>
                  Inspect Submersible Systems
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {hotspots.map((h) => (
                    <button
                      key={h.id}
                      onClick={() => setActiveHotspot(h.id)}
                      className={`p-2.5 rounded-xl text-left transition-all ${
                        activeHotspot === h.id
                          ? isLight
                            ? 'bg-sky-500 text-white shadow-md'
                            : 'bg-cyan-500/25 border border-cyan-400/50 text-cyan-200 shadow-[0_0_15px_rgba(0,240,255,0.25)]'
                          : isLight
                            ? 'bg-sky-50/80 border border-sky-200 text-slate-700 hover:bg-sky-100'
                            : 'bg-white/5 border border-white/10 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <div className={`text-[10px] font-mono font-bold ${activeHotspot === h.id && isLight ? 'text-sky-100' : 'text-sky-600 dark:text-cyan-300'}`}>{h.tag}</div>
                      <div className={`text-xs font-semibold truncate mt-0.5 ${activeHotspot === h.id && isLight ? 'text-white' : 'text-slate-800 dark:text-white'}`}>{h.title}</div>
                    </button>
                  ))}
                </div>

                <div className={`mt-3 p-3 rounded-xl border text-xs flex items-start gap-2.5 ${
                  isLight 
                    ? 'bg-sky-50/90 border-sky-200 text-slate-700' 
                    : 'bg-abyss-950/70 border-cyan-500/20 text-slate-300'
                }`}>
                  <Zap className="w-4 h-4 text-sky-500 shrink-0 mt-0.5" />
                  <div>
                    <strong className={isLight ? 'text-sky-800' : 'text-cyan-300'}>{hotspots[activeHotspot].title}: </strong>
                    {hotspots[activeHotspot].detail}
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 flex flex-wrap items-center gap-4">
                <button
                  onClick={() => onOpenBookingModal()}
                  className="px-6 py-3 rounded-full bg-gradient-to-r from-sky-500 via-cyan-400 to-teal-400 text-slate-950 font-display font-bold text-xs sm:text-sm shadow-[0_4px_16px_rgba(14,165,233,0.4)] hover:shadow-[0_6px_25px_rgba(14,165,233,0.7)] transition-all flex items-center gap-2 bounce-pop"
                >
                  <Sparkles className="w-4 h-4 fill-slate-950" />
                  <span>Reserve Submersible Seat</span>
                </button>
              </div>

            </div>
          </div>

          {/* Right Column: Phone Mockup & Submarine Visual matching reference UI */}
          <div className="lg:col-span-6 flex justify-center">
            
            <div className="relative w-full max-w-sm">
              
              {/* Glowing Phone Frame */}
              <div className="relative rounded-[40px] p-4 bg-gradient-to-b from-slate-800 via-slate-900 to-black border-4 border-slate-700/80 shadow-[0_25px_60px_rgba(0,0,0,0.4),0_0_30px_rgba(14,165,233,0.2)]">
                
                {/* Phone Speaker & Camera Notch */}
                <div className="w-32 h-4 bg-black rounded-full mx-auto mb-3 flex items-center justify-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-slate-900" />
                  <div className="w-10 h-1 bg-slate-800 rounded-full" />
                </div>

                {/* Phone Screen Mockup Content */}
                <div className="rounded-[28px] overflow-hidden bg-abyss-950 border border-sky-400/30 p-4 space-y-4 text-white">
                  
                  {/* App Header */}
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-[10px] font-mono text-sky-400">ABYSSX APP</div>
                      <div className="text-xs font-bold text-white">Live Telemetry</div>
                    </div>
                    <span className="w-2 h-2 rounded-full bg-teal-400 animate-ping" />
                  </div>

                  {/* Submarine Image in App */}
                  <div className="relative rounded-xl overflow-hidden h-36 border border-white/10">
                    <img 
                      src="https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=600&q=80" 
                      alt="Triton Submersible" 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-abyss-950 via-transparent to-transparent" />
                    <div className="absolute bottom-2 left-2 text-[10px] font-mono text-sky-300 font-bold bg-black/60 px-2 py-0.5 rounded">
                      DESCENT DEPTH: 10,928M
                    </div>
                  </div>

                  {/* App Quick Action Grid */}
                  <div className="grid grid-cols-4 gap-2 text-center">
                    {[
                      { label: "Sonar", icon: Radio },
                      { label: "4K Cam", icon: Eye },
                      { label: "Oxygen", icon: Layers },
                      { label: "Nav", icon: Navigation },
                    ].map((item, idx) => {
                      const Icon = item.icon;
                      return (
                        <div key={idx} className="p-2 rounded-xl bg-white/5 border border-white/10">
                          <Icon className="w-4 h-4 text-sky-400 mx-auto mb-1" />
                          <span className="text-[9px] font-mono text-slate-300 block">{item.label}</span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Live Dive Status Pill in App */}
                  <div className="p-3 rounded-xl bg-sky-950/60 border border-sky-400/30 flex items-center justify-between">
                    <div>
                      <div className="text-[10px] text-slate-400">Current Mission</div>
                      <div className="text-xs font-bold text-white">Mariana Trench Hadal</div>
                    </div>
                    <span className="text-xs font-mono font-bold text-sky-300">$49,500</span>
                  </div>

                  {/* Download App CTA */}
                  <button 
                    onClick={() => onOpenBookingModal()}
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-sky-400 to-teal-400 text-slate-950 text-xs font-bold font-display shadow-md flex items-center justify-center gap-1.5"
                  >
                    <span>Download AbyssX App</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                </div>

                {/* Bottom Home Indicator */}
                <div className="w-28 h-1 bg-slate-700 rounded-full mx-auto mt-3" />

              </div>

              {/* Bouncy Floating Badge Over Mockup */}
              <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -bottom-4 -right-4 sm:-right-8 p-3.5 rounded-2xl bg-slate-900/90 backdrop-blur-xl border border-sky-400/50 shadow-2xl text-xs flex items-center gap-2.5 text-white"
              >
                <div className="w-8 h-8 rounded-xl bg-teal-400/20 text-teal-300 flex items-center justify-center">
                  <Smartphone className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-white">Live iOS & Android</div>
                  <div className="text-[10px] font-mono text-sky-300">Offline Depth Telemetry</div>
                </div>
              </motion.div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}

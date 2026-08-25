import React, { useState } from 'react';
import { 
  Layers, Thermometer, Gauge, Sun, Moon, 
  Sparkles, Anchor, ArrowDown, ChevronRight, Eye 
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function DepthZoneExplorer({ onFilterZone, theme = 'light' }) {
  const [activeZoneIndex, setActiveZoneIndex] = useState(4); // Default Hadal
  const isLight = theme === 'light';

  const zones = [
    {
      name: "Epipelagic Zone",
      title: "Sunlight Zone",
      depth: "0 - 200 Meters",
      pressure: "1 - 20 ATM",
      temp: "20°C to 28°C",
      light: "Full Solar Penetration",
      creatures: ["Manta Rays", "Green Sea Turtles", "Whale Sharks", "Vibrant Coral"],
      description: "Warm, sunlit surface waters teeming with 90% of all marine life, crystal-clear visibility, and photosynthetic coral reefs.",
      bgGradientLight: "from-sky-100 via-cyan-50 to-white",
      bgGradientDark: "from-cyan-400/20 via-blue-600/20 to-blue-900/30",
      accentColor: "text-sky-600 dark:text-cyan-300",
      query: "All"
    },
    {
      name: "Mesopelagic Zone",
      title: "Twilight Zone",
      depth: "200 - 1,000 Meters",
      pressure: "20 - 100 ATM",
      temp: "4°C to 12°C",
      light: "Faint Blue Dusk",
      creatures: ["Bioluminescent Lanternfish", "Vampire Squid", "Hatchetfish", "Comb Jellies"],
      description: "Sunlight fades into infinite indigo. Creatures generate their own biological neon light (bioluminescence) for camouflage and hunting.",
      bgGradientLight: "from-sky-200/70 via-blue-100/50 to-white",
      bgGradientDark: "from-blue-600/20 via-indigo-800/20 to-slate-950/40",
      accentColor: "text-blue-600 dark:text-blue-300",
      query: "Mesopelagic"
    },
    {
      name: "Bathypelagic Zone",
      title: "Midnight Zone",
      depth: "1,000 - 4,000 Meters",
      pressure: "100 - 400 ATM",
      temp: "2°C to 4°C",
      light: "Absolute Darkness (0 Lux)",
      creatures: ["Anglerfish", "Gulper Eel", "Giant Squid", "Titanic Rusticles"],
      description: "Pitch black expanse where sunlight never penetrates. Home to the RMS Titanic resting at 3,810m on the North Atlantic abyssal plain.",
      bgGradientLight: "from-blue-200/80 via-slate-100 to-white",
      bgGradientDark: "from-indigo-900/20 via-slate-900/40 to-black/60",
      accentColor: "text-indigo-600 dark:text-indigo-300",
      query: "Bathypelagic"
    },
    {
      name: "Abyssopelagic Zone",
      title: "The Abyss",
      depth: "4,000 - 6,000 Meters",
      pressure: "400 - 600 ATM",
      temp: "1°C to 2°C",
      light: "Total Blackness",
      creatures: ["Black Smoker Chimneys", "Giant Tubeworms (Riftia)", "Dumbo Octopus"],
      description: "Near freezing waters covering over 60% of the planet's surface. Hydrothermal volcanic vents boil at 350°C and sustain alien ecosystems.",
      bgGradientLight: "from-slate-200 via-sky-100 to-white",
      bgGradientDark: "from-slate-950/40 via-black to-slate-950/60",
      accentColor: "text-purple-600 dark:text-purple-300",
      query: "Abyssopelagic"
    },
    {
      name: "Hadopelagic Zone",
      title: "Hadal Trenches",
      depth: "6,000 - 11,000 Meters",
      pressure: "600 - 1,100 ATM",
      temp: "1.0°C to 2.5°C",
      light: "Cosmic Abyss",
      creatures: ["Mariana Snailfish (Pseudoliparis)", "Giant Amphipods", "Xenophyophores"],
      description: "The deepest tectonic canyons on Earth, plunging down to Challenger Deep (10,928m). Explored by only a handful of humans in history.",
      bgGradientLight: "from-sky-300/40 via-sky-100/60 to-white",
      bgGradientDark: "from-cyan-950/50 via-abyss-950 to-black",
      accentColor: "text-sky-700 dark:text-cyan-300",
      query: "Hadopelagic"
    }
  ];

  const current = zones[activeZoneIndex];

  return (
    <section className="py-16 sm:py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title */}
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <div className={`inline-flex items-center gap-2 px-3.5 py-1 rounded-full border text-xs font-mono font-bold uppercase tracking-wider ${
            isLight ? 'bg-sky-50 border-sky-300 text-sky-700' : 'bg-cyan-400/10 border-cyan-400/30 text-cyan-300'
          }`}>
            <Layers className="w-3.5 h-3.5" />
            <span>Interactive Bathymetric Depth Gauge</span>
          </div>
          <h2 className={`text-3xl sm:text-4xl font-extrabold font-display ${
            isLight ? 'text-slate-900' : 'text-white'
          }`}>
            Descend Through the <br />
            <span className="bg-gradient-to-r from-sky-600 via-cyan-500 to-blue-600 bg-clip-text text-transparent">
              Five Ocean Layers of Earth
            </span>
          </h2>
          <p className={`text-xs sm:text-sm ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
            Select a depth layer to inspect hydrostatic pressure, ambient temperature, and endemic abyssal creatures.
          </p>
        </div>

        {/* Depth Zone Interactive Controller & Display */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          
          {/* Left Vertical Depth Step Picker */}
          <div className="lg:col-span-4 space-y-2.5">
            {zones.map((z, idx) => {
              const isSelected = activeZoneIndex === idx;
              return (
                <button
                  key={idx}
                  onClick={() => setActiveZoneIndex(idx)}
                  className={`w-full p-3.5 sm:p-4 rounded-2xl text-left transition-all duration-300 flex items-center justify-between border ${
                    isSelected
                      ? isLight
                        ? 'bg-sky-500 text-white border-sky-500 shadow-md scale-[1.02]'
                        : 'bg-cyan-500/20 border-cyan-400/60 text-white shadow-[0_0_20px_rgba(0,240,255,0.25)] scale-[1.02]'
                      : isLight
                        ? 'bg-white/90 border-sky-200 text-slate-700 hover:bg-sky-50'
                        : 'bg-white/[0.03] border-white/10 text-slate-300 hover:bg-white/[0.07]'
                  }`}
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                        isSelected && isLight ? 'bg-white/20 text-white' : 'bg-sky-100 text-sky-800 dark:bg-white/10 dark:text-cyan-300'
                      }`}>
                        LAYER {idx + 1}
                      </span>
                      <span className="text-xs sm:text-sm font-bold font-display">{z.title}</span>
                    </div>
                    <div className={`text-[11px] font-mono ${isSelected && isLight ? 'text-sky-100' : 'text-sky-600 dark:text-cyan-400/80'}`}>{z.depth}</div>
                  </div>
                  <ChevronRight className={`w-4 h-4 transition-transform ${isSelected ? 'translate-x-1' : 'text-slate-400'}`} />
                </button>
              );
            })}
          </div>

          {/* Right Detailed Depth Zone Glass Card */}
          <div className="lg:col-span-8">
            <motion.div
              key={activeZoneIndex}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.35 }}
              className={`p-6 sm:p-8 rounded-3xl backdrop-blur-2xl border shadow-2xl space-y-6 cutout-corner-tr ${
                isLight
                  ? `bg-gradient-to-br ${current.bgGradientLight} border-sky-200 shadow-[0_15px_45px_rgba(14,165,233,0.12)]`
                  : `bg-gradient-to-br ${current.bgGradientDark} border-cyan-500/30`
              }`}
            >
              
              {/* Zone Header */}
              <div className={`flex flex-wrap items-start justify-between gap-4 pb-4 border-b ${
                isLight ? 'border-sky-200/80' : 'border-white/10'
              }`}>
                <div>
                  <span className={`text-xs font-mono font-bold uppercase tracking-widest ${
                    isLight ? 'text-sky-600' : 'text-cyan-400'
                  }`}>
                    {current.name}
                  </span>
                  <h3 className={`text-2xl sm:text-3xl font-extrabold font-display mt-1 ${
                    isLight ? 'text-slate-900' : 'text-white'
                  }`}>
                    {current.title}
                  </h3>
                  <p className={`text-xs sm:text-sm mt-1 max-w-xl ${
                    isLight ? 'text-slate-600' : 'text-slate-300'
                  }`}>
                    {current.description}
                  </p>
                </div>

                <button
                  onClick={() => onFilterZone(current.query)}
                  className={`px-4 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 transition-all shadow-md bounce-pop ${
                    isLight
                      ? 'bg-sky-500 text-white hover:bg-sky-600'
                      : 'bg-cyan-400/20 hover:bg-cyan-400/30 border border-cyan-400/40 text-cyan-200'
                  }`}
                >
                  <span>Filter Dives in this Zone</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className={`p-3.5 rounded-xl border flex items-center gap-3 ${
                  isLight ? 'bg-white/80 border-sky-200' : 'bg-abyss-950/70 border-white/10'
                }`}>
                  <div className="p-2 rounded-lg bg-sky-500/20 text-sky-600 dark:text-cyan-300">
                    <Gauge className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[10px] font-mono text-slate-400">HYDROSTATIC PRESSURE</div>
                    <div className={`text-xs sm:text-sm font-bold font-mono ${isLight ? 'text-slate-800' : 'text-white'}`}>{current.pressure}</div>
                  </div>
                </div>

                <div className={`p-3.5 rounded-xl border flex items-center gap-3 ${
                  isLight ? 'bg-white/80 border-sky-200' : 'bg-abyss-950/70 border-white/10'
                }`}>
                  <div className="p-2 rounded-lg bg-teal-500/20 text-teal-600 dark:text-teal-300">
                    <Thermometer className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[10px] font-mono text-slate-400">WATER TEMPERATURE</div>
                    <div className={`text-xs sm:text-sm font-bold font-mono ${isLight ? 'text-slate-800' : 'text-white'}`}>{current.temp}</div>
                  </div>
                </div>

                <div className={`p-3.5 rounded-xl border flex items-center gap-3 ${
                  isLight ? 'bg-white/80 border-sky-200' : 'bg-abyss-950/70 border-white/10'
                }`}>
                  <div className="p-2 rounded-lg bg-purple-500/20 text-purple-600 dark:text-purple-300">
                    <Sun className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[10px] font-mono text-slate-400">SOLAR PENETRATION</div>
                    <div className={`text-xs sm:text-sm font-bold font-mono ${isLight ? 'text-slate-800' : 'text-white'}`}>{current.light}</div>
                  </div>
                </div>
              </div>

              {/* Endemic Marine Life Tags */}
              <div className="space-y-2">
                <div className={`text-[11px] font-mono font-semibold uppercase tracking-wider ${
                  isLight ? 'text-sky-700' : 'text-cyan-300'
                }`}>
                  Documented Endemic Species
                </div>
                <div className="flex flex-wrap gap-2">
                  {current.creatures.map((c, i) => (
                    <span
                      key={i}
                      className={`px-3 py-1 rounded-full border text-xs font-medium flex items-center gap-1.5 ${
                        isLight 
                          ? 'bg-sky-50 border-sky-200 text-sky-800' 
                          : 'bg-white/10 border-white/15 text-slate-200'
                      }`}
                    >
                      <Sparkles className="w-3 h-3 text-sky-500 dark:text-cyan-400" />
                      <span>{c}</span>
                    </span>
                  ))}
                </div>
              </div>

            </motion.div>
          </div>

        </div>

      </div>
    </section>
  );
}

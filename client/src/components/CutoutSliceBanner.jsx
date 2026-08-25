import React, { useState } from 'react';
import { 
  Sparkles, Compass, ArrowRight, ShieldCheck, 
  ChevronRight, ChevronLeft, Anchor, Eye 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CutoutSliceBanner({ onSelectExpedition, onOpenBookingModal, theme = 'light' }) {
  const isLight = theme === 'light';
  const [currentSlide, setCurrentSlide] = useState(0);

  const featuredAdventures = [
    {
      id: "exp-1",
      title: "Mariana Trench Challenger Deep",
      tagline: "10,928m Under The Sea • The Deepest Point on Planet Earth",
      description: "Descend in a certified Grade 5 titanium sphere into absolute hadal darkness. Meet alien amphipods and translucent snailfish.",
      image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80",
      depth: "10,928 meters",
      vessel: "Triton 36,000/2",
      badge: "MOST EXTREME EXPEDITION"
    },
    {
      id: "exp-2",
      title: "Azores Bioluminescent Ocean Fireworks",
      tagline: "Living Light Safari • 1,200m Mesopelagic Night Dive",
      description: "Glide in a hydrobatic submarine with 360° acrylic views. Trigger electric-blue flashes from siphonophores and comb jellies.",
      image: "https://images.unsplash.com/photo-1559827291-72ee739d0d9a?auto=format&fit=crop&w=1200&q=80",
      depth: "1,200 meters",
      vessel: "DeepFlight Super Falcon 3S",
      badge: "SURREAL NIGHT DIVE"
    },
    {
      id: "exp-3",
      title: "RMS Titanic Abyssal Survey",
      tagline: "3,810m Titanic Wreck Site • North Atlantic Ocean",
      description: "Descend into historic stillness. Float beside the legendary forward bow, anchors, and rusticles with 60,000-lumen deep LEDs.",
      image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80",
      depth: "3,810 meters",
      vessel: "Mir-I Deep Explorer",
      badge: "HISTORIC WONDER"
    }
  ];

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % featuredAdventures.length);
  };

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev - 1 + featuredAdventures.length) % featuredAdventures.length);
  };

  const activeAdv = featuredAdventures[currentSlide];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      
      {/* Container with Sliced Cutout Shapes and PULL EFFECT */}
      <div className={`relative rounded-3xl overflow-hidden border-2 shadow-2xl slice-cutout-double ${
        isLight
          ? 'bg-white border-sky-300 shadow-[0_20px_60px_rgba(14,165,233,0.18)]'
          : 'bg-slate-950 border-cyan-500/40 shadow-[0_20px_60px_rgba(0,0,0,0.8)]'
      }`}>
        
        {/* Animated Slide Content with Elastic PULL EFFECT */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeAdv.id}
            initial={{ opacity: 0, x: 90, scaleX: 0.88 }}
            animate={{ opacity: 1, x: 0, scaleX: 1 }}
            exit={{ opacity: 0, x: -90, scaleX: 0.88 }}
            transition={{ 
              type: "spring", 
              stiffness: 260, 
              damping: 20 
            }}
            className="grid grid-cols-1 lg:grid-cols-12 min-h-[480px]"
          >
            
            {/* Left Story Column with DROP IN text */}
            <div className="lg:col-span-6 p-8 sm:p-12 flex flex-col justify-between space-y-6 z-10">
              
              <div className="space-y-4">
                
                {/* Pop In Badge */}
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-sky-500/20 text-sky-700 dark:text-cyan-300 border border-sky-400/40 text-xs font-mono font-bold tracking-wider uppercase pop-in-spring">
                  <Anchor className="w-3.5 h-3.5" />
                  <span>{activeAdv.badge}</span>
                </div>

                {/* Drop In Heading */}
                <h3 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-display leading-tight drop-in-bounce">
                  {activeAdv.title}
                </h3>

                <p className="text-sm sm:text-base font-medium text-sky-700 dark:text-cyan-300 font-mono">
                  {activeAdv.tagline}
                </p>

                <p className={`text-xs sm:text-sm leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
                  {activeAdv.description}
                </p>

              </div>

              {/* Action Buttons & Specs with Scale In/Out */}
              <div className="space-y-4 pt-4 border-t border-sky-100 dark:border-white/10">
                <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                  <div>
                    <span className="text-slate-400 text-[10px]">RECORD DEPTH:</span>
                    <div className="font-bold text-sky-600 dark:text-cyan-400">{activeAdv.depth}</div>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px]">SUBMERSIBLE:</span>
                    <div className="font-bold">{activeAdv.vessel}</div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <button
                    onClick={() => onOpenBookingModal()}
                    className="px-6 py-3 rounded-full bg-gradient-to-r from-sky-500 via-cyan-400 to-teal-400 text-slate-950 font-bold font-display text-xs sm:text-sm shadow-md hover:shadow-lg transition-all scale-interact flex items-center gap-2"
                  >
                    <span>Reserve Descent Seat</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => onSelectExpedition(activeAdv.id)}
                    className={`px-5 py-3 rounded-full border text-xs font-semibold font-mono transition-all scale-interact ${
                      isLight ? 'bg-sky-50 border-sky-200 text-sky-800' : 'bg-white/5 border-white/10 text-white'
                    }`}
                  >
                    View Telemetry
                  </button>
                </div>
              </div>

            </div>

            {/* Right Image Column with Intense Zoom Effect & Sliced Angle */}
            <div className="lg:col-span-6 relative min-h-[300px] lg:min-h-full overflow-hidden bg-slate-900">
              <img
                src={activeAdv.image}
                alt={activeAdv.title}
                className="w-full h-full object-cover transform hover:scale-115 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-slate-950/80 via-transparent to-transparent pointer-events-none" />
            </div>

          </motion.div>
        </AnimatePresence>

        {/* Carousel Slider Controls (Previous / Next with Elastic Pull) */}
        <div className="absolute bottom-4 right-4 z-20 flex items-center gap-2">
          <button
            onClick={handlePrev}
            className="p-3 rounded-full bg-slate-950/80 backdrop-blur-md border border-white/20 text-white hover:bg-slate-900 scale-interact shadow-lg"
            title="Previous Featured Mission"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={handleNext}
            className="p-3 rounded-full bg-slate-950/80 backdrop-blur-md border border-white/20 text-white hover:bg-slate-900 scale-interact shadow-lg"
            title="Next Featured Mission"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

      </div>

    </div>
  );
}

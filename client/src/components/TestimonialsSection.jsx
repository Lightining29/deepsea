import React from 'react';
import { Star, ShieldCheck, Quote, Waves } from 'lucide-react';
import { motion } from 'framer-motion';

export default function TestimonialsSection({ theme = 'light' }) {
  const isLight = theme === 'light';

  const reviews = [
    {
      name: "Dr. Elena Rostova",
      role: "Deep Sea Oceanographer & Polar Scientist",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
      expedition: "Challenger Deep Hadal Descent (10,928m)",
      rating: 5,
      quote: "Stepping onto the bottom of the Mariana Trench inside the titanium hull was the most humbling experience of my life. The acoustic silence and alien snailfish are forever imprinted in my mind."
    },
    {
      name: "Marcus Vance",
      role: "Private Explorer & Documentary Cinematographer",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
      expedition: "RMS Titanic Abyssal Survey (3,810m)",
      rating: 5,
      quote: "The 60,000-lumen light array illuminated the Titanic's Grand Staircase aperture with unprecedented clarity. The crew and telemetry systems were beyond first-class."
    },
    {
      name: "Sophia Lindqvist",
      role: "Marine Biologist, Azores Seamount Project",
      avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80",
      expedition: "Midnight Bioluminescence Safari (1,200m)",
      rating: 5,
      quote: "Turning off the submersible exterior lights and watching hundreds of bioluminescent comb jellies pulse in green and cyan neon was like floating through deep cosmos."
    }
  ];

  return (
    <section className="py-16 sm:py-20 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-mono font-bold uppercase ${
            isLight ? 'bg-sky-50 border-sky-300 text-sky-700' : 'bg-cyan-400/10 border-cyan-400/30 text-cyan-300'
          }`}>
            <Quote className="w-3.5 h-3.5" />
            <span>Voices from the Abyss</span>
          </div>
          <h2 className={`text-3xl sm:text-4xl font-extrabold font-display ${
            isLight ? 'text-slate-900' : 'text-white'
          }`}>
            What Explorers Say
          </h2>
          <p className={`text-xs sm:text-sm ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
            Read verified dispatches from explorers who have touched Earth's deepest abyssal planes.
          </p>
        </div>

        {/* Reviews 3-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((rev, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.15 }}
              className={`p-6 sm:p-7 rounded-3xl border flex flex-col justify-between space-y-6 shadow-lg cutout-corner-tr transition-all duration-300 ${
                isLight 
                  ? 'bg-white/85 backdrop-blur-xl border-sky-200 hover:border-sky-400 shadow-[0_8px_30px_rgba(14,165,233,0.08)]' 
                  : 'glass-panel border-cyan-500/20 hover:border-cyan-400/50'
              }`}
            >
              
              <div className="space-y-4">
                {/* Star rating & verified badge */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <span className={`flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded border ${
                    isLight 
                      ? 'bg-sky-50 border-sky-300 text-sky-800' 
                      : 'bg-cyan-950/60 border-cyan-500/30 text-cyan-300'
                  }`}>
                    <ShieldCheck className="w-3 h-3 text-emerald-500" />
                    <span>VERIFIED DIVER</span>
                  </span>
                </div>

                <p className={`text-xs sm:text-sm leading-relaxed italic ${
                  isLight ? 'text-slate-600' : 'text-slate-300'
                }`}>
                  "{rev.quote}"
                </p>
              </div>

              {/* Author & Mission */}
              <div className={`pt-4 border-t flex items-center gap-3 ${
                isLight ? 'border-sky-100' : 'border-cyan-500/15'
              }`}>
                <img 
                  src={rev.avatar} 
                  alt={rev.name} 
                  className={`w-11 h-11 rounded-full object-cover border ${
                    isLight ? 'border-sky-400' : 'border-cyan-400/40'
                  }`}
                />
                <div className="space-y-0.5">
                  <div className={`text-sm font-bold font-display ${isLight ? 'text-slate-900' : 'text-white'}`}>{rev.name}</div>
                  <div className={`text-[11px] truncate ${isLight ? 'text-sky-700' : 'text-cyan-300/90'}`}>{rev.role}</div>
                  <div className={`text-[10px] font-mono truncate ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>{rev.expedition}</div>
                </div>
              </div>

            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}

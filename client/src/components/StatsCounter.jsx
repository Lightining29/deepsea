import React from 'react';
import { Anchor, Users, Star, Headphones, ShieldCheck, Waves } from 'lucide-react';
import { motion } from 'framer-motion';

export default function StatsCounter({ theme = 'light' }) {
  const isLight = theme === 'light';

  const stats = [
    {
      icon: Waves,
      value: "500+",
      label: "Manned Dives Logged",
      desc: "Zero incidents in 12 years"
    },
    {
      icon: Anchor,
      value: "10,928m",
      label: "Deepest Record (Challenger)",
      desc: "Full Hadal depth certified"
    },
    {
      icon: Star,
      value: "4.98 / 5",
      label: "Explorer Rating",
      desc: "Based on 1,200+ mission reviews"
    },
    {
      icon: Headphones,
      value: "24/7",
      label: "Deep Acoustic Sonar",
      desc: "Real-time surface link"
    }
  ];

  return (
    <div className="py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Glassmorphic Stats Ribbon */}
        <div className={`rounded-3xl p-6 sm:p-8 backdrop-blur-xl border shadow-xl ${
          isLight
            ? 'bg-gradient-to-r from-sky-500 via-sky-600 to-teal-600 border-sky-400 text-white shadow-[0_15px_45px_rgba(14,165,233,0.25)]'
            : 'bg-gradient-to-r from-cyan-950/70 via-abyss-900/80 to-cyan-950/70 border-cyan-500/30'
        }`}>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {stats.map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.1 }}
                  className="flex items-center gap-3.5 sm:gap-4 group"
                >
                  <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center shrink-0 group-hover:scale-110 transition-all duration-300 ${
                    isLight 
                      ? 'bg-white/20 border-white/30 text-white shadow-md' 
                      : 'bg-cyan-400/15 border-cyan-400/30 text-cyan-300'
                  }`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-xl sm:text-2xl font-extrabold font-mono text-white tracking-tight">
                      {stat.value}
                    </div>
                    <div className={`text-xs sm:text-sm font-display font-semibold ${isLight ? 'text-sky-100' : 'text-cyan-200'}`}>
                      {stat.label}
                    </div>
                    <div className={`text-[10px] font-mono hidden sm:block ${isLight ? 'text-sky-200' : 'text-slate-400'}`}>
                      {stat.desc}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}

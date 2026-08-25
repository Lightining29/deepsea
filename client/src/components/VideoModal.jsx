import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Play, Volume2, ShieldCheck, Waves } from 'lucide-react';

export default function VideoModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center p-4 sm:p-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/90 backdrop-blur-xl"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ type: "spring", damping: 25, stiffness: 280 }}
          className="relative w-full max-w-4xl rounded-3xl bg-abyss-950 border border-cyan-400/40 overflow-hidden shadow-[0_0_50px_rgba(0,240,255,0.3)] z-10 cutout-corner-tr"
        >
          {/* Top Bar */}
          <div className="p-4 bg-gradient-to-r from-cyan-950/60 to-transparent border-b border-cyan-500/20 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-300">
              <Waves className="w-4 h-4 text-cyan-400 animate-pulse" />
              <span>CHALLENGER DEEP // 11,000M DESCENT TELEMETRY RECORDING</span>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-white/5 text-slate-300 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Embedded Cinematic Visual Presentation */}
          <div className="relative aspect-video bg-black flex items-center justify-center overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1682687220063-4742bd7c8f1b?auto=format&fit=crop&w=1200&q=80"
              alt="Hadal Descent"
              className="w-full h-full object-cover filter brightness-75"
            />

            {/* Submarine Telemetry HUD Overlay */}
            <div className="absolute inset-0 p-6 flex flex-col justify-between pointer-events-none font-mono text-xs text-cyan-300/80">
              <div className="flex justify-between">
                <div className="bg-abyss-950/70 p-2 rounded border border-cyan-500/30">
                  <div>LAT: 11°22′24″ N</div>
                  <div>LON: 142°35′30″ E</div>
                </div>
                <div className="bg-abyss-950/70 p-2 rounded border border-cyan-500/30 text-right">
                  <div className="text-cyan-200 font-bold">DEPTH: 10,928 M</div>
                  <div>PRESS: 1,098 BAR</div>
                </div>
              </div>

              {/* Center Crosshair and Simulated Descent Info */}
              <div className="text-center bg-black/60 backdrop-blur-md p-4 rounded-2xl max-w-md mx-auto border border-cyan-400/40 pointer-events-auto">
                <div className="w-12 h-12 rounded-full bg-cyan-400 text-abyss-950 flex items-center justify-center mx-auto mb-2 shadow-[0_0_20px_rgba(0,240,255,0.8)] animate-pulse">
                  <Play className="w-5 h-5 fill-abyss-950 ml-0.5" />
                </div>
                <h4 className="text-base font-bold font-display text-white">Challenger Deep 4K Descent Log</h4>
                <p className="text-xs text-slate-300 mt-1 font-sans">
                  Raw 8K footage recorded by the dual 60,000-lumen titanium array at the seafloor of the Mariana Trench.
                </p>
              </div>

              <div className="flex justify-between items-end">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span>OXYGEN: 99.8% NOMINAL</span>
                </div>
                <div>VESSEL: TRITON 36K/2</div>
              </div>
            </div>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
}

import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Waves } from 'lucide-react';

export default function AudioAmbience() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioCtxRef = useRef(null);
  const masterGainRef = useRef(null);
  const intervalRef = useRef(null);

  const toggleAudio = () => {
    if (!isPlaying) {
      startAmbientAudio();
      setIsPlaying(true);
    } else {
      stopAmbientAudio();
      setIsPlaying(false);
    }
  };

  const startAmbientAudio = () => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      const ctx = new AudioCtx();
      audioCtxRef.current = ctx;

      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0.08, ctx.currentTime);
      masterGain.connect(ctx.destination);
      masterGainRef.current = masterGain;

      // 1. Deep ocean hydrophone rumble (Brownian noise simulation)
      const bufferSize = ctx.sampleRate * 2;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      let lastOut = 0.0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        output[i] = (lastOut + (0.02 * white)) / 1.02;
        lastOut = output[i];
        output[i] *= 3.5;
      }

      const whiteNoise = ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;

      const lowpassFilter = ctx.createBiquadFilter();
      lowpassFilter.type = 'lowpass';
      lowpassFilter.frequency.setValueAtTime(140, ctx.currentTime);

      whiteNoise.connect(lowpassFilter);
      lowpassFilter.connect(masterGain);
      whiteNoise.start();

      // 2. Periodic gentle Sonar Ping effect every 10 seconds
      const triggerSonarPing = () => {
        if (!audioCtxRef.current || audioCtxRef.current.state === 'closed') return;
        const currentT = audioCtxRef.current.currentTime;
        const osc = audioCtxRef.current.createOscillator();
        const pingGain = audioCtxRef.current.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(1150, currentT);
        osc.frequency.exponentialRampToValueAtTime(800, currentT + 0.8);

        pingGain.gain.setValueAtTime(0.001, currentT);
        pingGain.gain.exponentialRampToValueAtTime(0.04, currentT + 0.05);
        pingGain.gain.exponentialRampToValueAtTime(0.0001, currentT + 1.2);

        osc.connect(pingGain);
        pingGain.connect(masterGainRef.current);

        osc.start(currentT);
        osc.stop(currentT + 1.3);
      };

      // Play initial sonar ping shortly after activation
      setTimeout(triggerSonarPing, 1000);
      intervalRef.current = setInterval(triggerSonarPing, 12000);

    } catch (e) {
      console.warn('Audio Context init prevented by browser policy until user interacts', e);
    }
  };

  const stopAmbientAudio = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (audioCtxRef.current) {
      audioCtxRef.current.close().catch(() => {});
      audioCtxRef.current = null;
    }
  };

  useEffect(() => {
    return () => {
      stopAmbientAudio();
    };
  }, []);

  return (
    <button
      onClick={toggleAudio}
      title={isPlaying ? "Mute Deep Ocean Hydrophone & Sonar" : "Listen to Deep Ocean Hydrophone & Sonar"}
      className={`fixed bottom-6 right-6 z-40 flex items-center gap-2 px-3.5 py-2.5 rounded-full backdrop-blur-xl border transition-all duration-300 shadow-2xl ${
        isPlaying 
          ? 'bg-cyan-500/20 border-cyan-400/60 text-cyan-300 shadow-[0_0_25px_rgba(0,240,255,0.4)] animate-pulse'
          : 'bg-slate-900/60 border-slate-700/60 text-slate-400 hover:text-cyan-300 hover:border-cyan-500/40'
      }`}
    >
      {isPlaying ? (
        <>
          <Waves className="w-4 h-4 animate-spin text-cyan-400" style={{ animationDuration: '6s' }} />
          <Volume2 className="w-4 h-4" />
          <span className="text-xs font-mono font-semibold tracking-wider">HYDROPHONE ON</span>
        </>
      ) : (
        <>
          <VolumeX className="w-4 h-4" />
          <span className="text-xs font-mono font-medium hidden sm:inline">Hydrophone Audio</span>
        </>
      )}
    </button>
  );
}

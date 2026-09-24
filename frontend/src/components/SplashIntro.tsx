import React, { useState, useEffect } from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';

interface SplashIntroProps {
  onComplete: () => void;
}

export const SplashIntro: React.FC<SplashIntroProps> = ({ onComplete }) => {
  const [collided, setCollided] = useState(false);
  const [fadingOut, setFadingOut] = useState(false);

  useEffect(() => {
    // Collision timing sequence
    const collisionTimer = setTimeout(() => {
      setCollided(true);
    }, 1100);

    const completeTimer = setTimeout(() => {
      setFadingOut(true);
      setTimeout(onComplete, 600);
    }, 3200);

    return () => {
      clearTimeout(collisionTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  const handleSkip = () => {
    setFadingOut(true);
    setTimeout(onComplete, 300);
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-950 text-white overflow-hidden transition-opacity duration-500 ${
        fadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Dynamic Grid Background with Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-brand-900/30 via-slate-950 to-slate-950"></div>
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-25"></div>

      {/* Skip Intro Button */}
      <button
        onClick={handleSkip}
        className="absolute top-6 right-6 px-4 py-2 text-xs font-medium text-slate-400 hover:text-white bg-slate-900/80 border border-slate-800 rounded-full backdrop-blur-md flex items-center gap-1.5 transition"
      >
        Skip Intro <ArrowRight className="w-3.5 h-3.5" />
      </button>

      {/* Center Collision Container */}
      <div className="relative z-10 flex flex-col items-center px-4">
        {/* Particle / Energy aura shockwave behind collision */}
        {collided && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-brand-500/20 rounded-full blur-3xl animate-pulse-glow"></div>
        )}

        <div className="flex items-center justify-center text-5xl md:text-7xl lg:text-8xl font-black tracking-tight select-none py-4">
          {/* Left Part: Edu */}
          <span className="inline-block animate-collide-left bg-gradient-to-r from-blue-400 via-brand-400 to-indigo-300 bg-clip-text text-transparent drop-shadow-[0_0_25px_rgba(56,189,248,0.5)]">
            Edu
          </span>

          {/* Right Part: Track */}
          <span className="inline-block animate-collide-right bg-gradient-to-r from-indigo-300 via-sky-300 to-cyan-400 bg-clip-text text-transparent drop-shadow-[0_0_25px_rgba(12,140,233,0.5)]">
            Track
          </span>
        </div>

        {/* Platform Subtitle Tagline */}
        <div
          className={`mt-4 text-center transition-all duration-700 transform ${
            collided ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-brand-500/30 text-brand-300 text-xs sm:text-sm font-semibold tracking-wider uppercase backdrop-blur-md shadow-lg">
            <Sparkles className="w-4 h-4 text-brand-400 animate-spin" />
            Student Performance Analytics Platform
          </div>
        </div>
      </div>
    </div>
  );
};

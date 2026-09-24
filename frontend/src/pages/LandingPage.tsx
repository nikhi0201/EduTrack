import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, ArrowRight, BarChart3, Users, ShieldCheck, Sparkles, Play } from 'lucide-react';

interface LandingPageProps {
  onReplayIntro?: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onReplayIntro }) => {
  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-between relative overflow-hidden">
      {/* Background Orbs & Radial Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-to-b from-brand-600/20 via-indigo-600/10 to-transparent rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_30%,#000_70%,transparent_100%)] opacity-20 pointer-events-none"></div>

      {/* Header Navigation */}
      <header className="relative z-10 max-w-7xl mx-auto w-full px-6 h-20 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-500 to-indigo-500 text-white flex items-center justify-center shadow-lg shadow-brand-500/30">
            <GraduationCap className="w-6 h-6" />
          </div>
          <span className="text-xl font-black tracking-tight text-white">
            Edu<span className="text-brand-400">Track</span>
          </span>
        </div>

        <div className="flex items-center gap-4">
          {onReplayIntro && (
            <button
              onClick={onReplayIntro}
              className="px-3.5 py-1.5 text-xs font-semibold text-slate-300 hover:text-white bg-slate-900 border border-slate-800 rounded-full flex items-center gap-1.5 transition"
            >
              <Play className="w-3.5 h-3.5 text-brand-400" /> Replay Intro
            </button>
          )}
          <Link
            to="/login"
            className="px-5 py-2 text-xs font-bold bg-brand-600 hover:bg-brand-500 text-white rounded-xl shadow-lg shadow-brand-500/25 transition flex items-center gap-1.5"
          >
            <span>Admin Portal</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 max-w-5xl mx-auto px-6 py-16 sm:py-24 text-center space-y-8 flex-1 flex flex-col justify-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/90 border border-brand-500/30 text-brand-300 text-xs font-semibold uppercase tracking-wider backdrop-blur-md mx-auto shadow-xl">
          <Sparkles className="w-4 h-4 text-brand-400" />
          Student Performance Analytics Platform
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[1.15]">
          Empower Learning with{' '}
          <span className="bg-gradient-to-r from-blue-400 via-brand-400 to-indigo-300 bg-clip-text text-transparent">
            Real-Time Data Insights
          </span>
        </h1>

        <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Track student performance trends across key academic subjects with real-time progress analytics, automated reporting, and intuitive student roster management.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link
            to="/login"
            className="w-full sm:w-auto px-8 py-3.5 text-sm font-bold bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white rounded-2xl shadow-xl shadow-brand-500/30 transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
          >
            <span>Launch Administrator Dashboard</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12 text-left">
          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-md space-y-3">
            <div className="w-10 h-10 rounded-xl bg-brand-500/10 text-brand-400 flex items-center justify-center">
              <BarChart3 className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Subject Trend Lines</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Interactive performance charts tracking student progress across monthly assessment windows.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-md space-y-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Smart Student Search</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Intelligent instant search with typo tolerance and seamless student roster pagination.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-md space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Enterprise Security</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Secure administrator portal with protected access controls and session management.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 max-w-7xl mx-auto w-full px-6 py-6 border-t border-slate-900 text-center text-xs text-slate-500">
        EduTrack Student Performance Analytics Platform • All rights reserved.
      </footer>
    </div>
  );
};

import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { apiService } from '../services/api';
import { GraduationCap, Lock, User, AlertCircle, ArrowRight, Zap, KeyRound, ShieldCheck } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { isAuthenticated, login } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  // 1-Click Instant Demo Login
  const handleQuickDemoLogin = async () => {
    setIsLoading(true);
    setError('');
    try {
      const data = await apiService.login('admin', 'password123');
      login(data.token, data.user);
      navigate('/dashboard', { replace: true });
    } catch (err: any) {
      setError(err.message || 'Demo login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAutofill = () => {
    setUsername('admin');
    setPassword('password123');
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!username.trim() || !password) {
      setError('Please enter both admin username and password');
      return;
    }

    setIsLoading(true);
    try {
      const data = await apiService.login(username, password);
      login(data.token, data.user);
      navigate('/dashboard', { replace: true });
    } catch (err: any) {
      setError(err.message || 'Invalid admin credentials');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Radial Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-600/15 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative z-10 w-full max-w-md">
        {/* Logo Card Header */}
        <div className="text-center mb-6 space-y-2">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-tr from-brand-600 to-indigo-500 text-white flex items-center justify-center shadow-xl shadow-brand-500/30">
            <GraduationCap className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-black tracking-tight text-white">
            Edu<span className="text-brand-400">Track</span> Admin Portal
          </h1>
          <p className="text-xs text-slate-400">
            Sign in with administrator credentials to access student performance analytics
          </p>
        </div>

        {/* Demo Credentials Highlight Banner */}
        <div className="mb-4 p-4 rounded-2xl bg-brand-950/70 border border-brand-500/40 backdrop-blur-md text-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-bold text-brand-300 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-brand-400" />
              Configured Admin Account
            </span>
            <span className="px-2 py-0.5 rounded-full bg-brand-500/20 text-brand-300 font-semibold text-[10px]">
              Active
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1 font-mono text-[11px] text-slate-300">
            <div className="bg-slate-900/80 px-2.5 py-1.5 rounded-lg border border-slate-800">
              <span className="text-slate-500 block text-[9px] font-sans">USERNAME</span>
              <span className="font-semibold text-white">admin</span>
            </div>
            <div className="bg-slate-900/80 px-2.5 py-1.5 rounded-lg border border-slate-800">
              <span className="text-slate-500 block text-[9px] font-sans">PASSWORD</span>
              <span className="font-semibold text-white">password123</span>
            </div>
          </div>

          {/* 1-Click Instant Demo Login Button */}
          <button
            type="button"
            onClick={handleQuickDemoLogin}
            disabled={isLoading}
            className="w-full mt-2 py-2 px-3 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-bold text-xs shadow-md shadow-brand-500/30 transition flex items-center justify-center gap-2"
          >
            <Zap className="w-4 h-4 text-amber-300 fill-amber-300" />
            <span>⚡ 1-Click Admin Login</span>
          </button>
        </div>

        {/* Login Form Card */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl space-y-6">
          {error && (
            <div className="p-3.5 rounded-xl bg-red-950/60 border border-red-800 text-red-300 text-xs flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Admin Username
              </label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm bg-slate-950 border border-slate-800 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-brand-500 transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Admin Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm bg-slate-950 border border-slate-800 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-brand-500 transition"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 rounded-xl text-xs font-bold text-white bg-brand-600 hover:bg-brand-500 shadow-lg shadow-brand-500/25 disabled:opacity-50 transition flex items-center justify-center gap-2 mt-2"
            >
              <span>{isLoading ? 'Authenticating...' : 'Sign In to Dashboard'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Autofill Helper */}
          <div className="pt-4 border-t border-slate-800 text-center">
            <button
              type="button"
              onClick={handleAutofill}
              className="w-full py-2 px-3 rounded-xl bg-slate-950/60 hover:bg-slate-800/80 border border-slate-800 text-xs font-medium text-slate-400 hover:text-brand-300 transition flex items-center justify-center gap-2"
            >
              <KeyRound className="w-3.5 h-3.5 text-brand-400" />
              <span>Fill Form Inputs with Admin Credentials</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

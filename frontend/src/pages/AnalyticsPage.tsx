import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import { DashboardStats } from '../types';
import { BarComparisonChart, LinePerformanceChart } from '../components/PerformanceChart';
import { BarChart3, Award, Users, BookOpen, RefreshCw } from 'lucide-react';

export const AnalyticsPage: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      setIsLoading(true);
      try {
        const data = await apiService.getDashboardStats();
        setStats(data);
      } catch (err) {
        // error handling
      } finally {
        setIsLoading(false);
      }
    };
    loadStats();
  }, []);

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Platform Analytics Center
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Comparative performance analytics across subjects, months, and academic classes
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 border border-brand-200 dark:border-brand-800">
            Live Analytics Sync
          </span>
        </div>
      </div>

      {/* Main Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BarComparisonChart
          data={stats?.charts.subjectComparison || []}
          title="Global Subject Performance Comparison"
        />

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
            6-Month Academic Growth Curve
          </h4>
          <LinePerformanceChart
            title="Monthly Mean Marks"
            data={stats?.charts.overallTrend.map((t) => ({ month: t.month, marks: t.average })) || []}
            color="#10b981"
          />
        </div>
      </div>

      {/* Academic Highlights */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-2">
          <Award className="w-4 h-4 text-amber-500" />
          Academic Key Performance Indicators
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800">
            <span className="text-xs font-semibold text-slate-500">Highest Individual Subject Score</span>
            <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">100%</p>
            <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium mt-0.5">Top benchmark achieved</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800">
            <span className="text-xs font-semibold text-slate-500">Tracked Monthly Assessment Windows</span>
            <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">6 Months</p>
            <p className="text-[11px] text-brand-600 dark:text-brand-400 font-medium mt-0.5">January through June</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800">
            <span className="text-xs font-semibold text-slate-500">Core Academic Subjects</span>
            <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">4 Subjects</p>
            <p className="text-[11px] text-indigo-600 dark:text-indigo-400 font-medium mt-0.5">Telugu, Hindi, English, Social</p>
          </div>
        </div>
      </div>
    </div>
  );
};

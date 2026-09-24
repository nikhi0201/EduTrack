import React from 'react';
import { StudentAnalytics } from '../types';
import { LinePerformanceChart, BarComparisonChart } from './PerformanceChart';
import { X, Award, TrendingUp, TrendingDown, BookOpen, AlertCircle, Sparkles, UserCheck } from 'lucide-react';

interface AnalyticsPanelProps {
  analytics: StudentAnalytics | null;
  onClose: () => void;
  isLoading: boolean;
}

export const AnalyticsPanel: React.FC<AnalyticsPanelProps> = ({
  analytics,
  onClose,
  isLoading,
}) => {
  if (!analytics && !isLoading) return null;

  return (
    <div className="w-full xl:w-[480px] shrink-0 bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-xl flex flex-col h-full overflow-hidden transition-all duration-200">
      {/* Drawer Header */}
      <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/60 dark:bg-slate-800/40">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-brand-500 text-white flex items-center justify-center font-bold text-sm shadow-md shadow-brand-500/20">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white leading-tight">
              {analytics?.student.name || 'Loading Student Analytics...'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              {analytics ? `${analytics.student.current_class} • Age ${analytics.student.age}` : 'Fetching metrics...'}
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          title="Close Analytics Panel"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Drawer Body - Scrollable */}
      <div className="p-5 overflow-y-auto space-y-6 flex-1">
        {isLoading ? (
          <div className="space-y-4 py-8 animate-pulse">
            <div className="h-20 bg-slate-100 dark:bg-slate-800 rounded-2xl"></div>
            <div className="h-40 bg-slate-100 dark:bg-slate-800 rounded-2xl"></div>
            <div className="h-40 bg-slate-100 dark:bg-slate-800 rounded-2xl"></div>
          </div>
        ) : analytics ? (
          <>
            {/* Quick Metrics Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3.5 rounded-xl bg-brand-50/60 dark:bg-brand-950/40 border border-brand-200 dark:border-brand-800/50">
                <span className="text-[10px] font-bold text-brand-600 dark:text-brand-400 uppercase tracking-wider block">
                  Overall Average
                </span>
                <span className="text-2xl font-black text-brand-900 dark:text-brand-200">
                  {analytics.summary.overallAverage}%
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/50">
                <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider block">
                  Best Subject
                </span>
                <span className="text-base font-bold text-emerald-900 dark:text-emerald-200 truncate block">
                  {analytics.summary.bestSubject} ({analytics.summary.bestSubjectAvg}%)
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-amber-50/60 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/50">
                <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider block">
                  Lowest Subject
                </span>
                <span className="text-base font-bold text-amber-900 dark:text-amber-200 truncate block">
                  {analytics.summary.lowestSubject} ({analytics.summary.lowestSubjectAvg}%)
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-purple-50/60 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800/50">
                <span className="text-[10px] font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider block">
                  Jan to Jun Trend
                </span>
                <span className="text-base font-bold text-purple-900 dark:text-purple-200 flex items-center gap-1">
                  {analytics.summary.performanceImprovement >= 0 ? (
                    <>
                      <TrendingUp className="w-4 h-4 text-emerald-500" />
                      <span>+{analytics.summary.performanceImprovement}%</span>
                    </>
                  ) : (
                    <>
                      <TrendingDown className="w-4 h-4 text-rose-500" />
                      <span>{analytics.summary.performanceImprovement}%</span>
                    </>
                  )}
                </span>
              </div>
            </div>

            {/* Dynamic Data Insights */}
            {analytics.insights.length > 0 && (
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 space-y-2">
                <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-brand-500" />
                  Dynamic Performance Insight
                </h4>
                <ul className="space-y-1.5">
                  {analytics.insights.map((insight, idx) => (
                    <li key={idx} className="text-xs text-slate-600 dark:text-slate-300 flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-500 mt-1.5 shrink-0"></span>
                      <span>{insight}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* 4 Required Subject Line Charts */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-brand-500" />
                Subject Performance Trends (4 Subjects)
              </h4>

              {/* Chart 1: Telugu */}
              <LinePerformanceChart
                title="1. Telugu Performance Trend"
                data={analytics.charts.teluguTrend}
                color="#0c8ce9"
              />

              {/* Chart 2: Hindi */}
              <LinePerformanceChart
                title="2. Hindi Performance Trend"
                data={analytics.charts.hindiTrend}
                color="#10b981"
              />

              {/* Chart 3: English */}
              <LinePerformanceChart
                title="3. English Performance Trend"
                data={analytics.charts.englishTrend}
                color="#6366f1"
              />

              {/* Chart 4: Social Studies */}
              <LinePerformanceChart
                title="4. Social Studies Performance Trend"
                data={analytics.charts.socialTrend}
                color="#f59e0b"
              />
            </div>

            {/* Additional Bar Chart: Subject Average Comparison */}
            <div className="pt-2">
              <BarComparisonChart data={analytics.charts.subjectComparison} />
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
};

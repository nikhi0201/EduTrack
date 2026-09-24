import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import { DashboardStats } from '../types';
import { DashboardCard } from '../components/DashboardCard';
import { LinePerformanceChart, BarComparisonChart } from '../components/PerformanceChart';
import { Users, Award, TrendingUp, AlertTriangle, RefreshCw } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';
import { useTheme } from '../context/ThemeContext';

export const DashboardPage: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const fetchStats = async () => {
    setIsLoading(true);
    setError('');
    try {
      const data = await apiService.getDashboardStats();
      setStats(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load dashboard statistics');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const CLASS_COLORS = ['#3b82f6', '#10b981', '#6366f1', '#f59e0b', '#ec4899'];

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Dashboard Overview
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Real-time aggregate performance metrics 
          </p>
        </div>

        <button
          onClick={fetchStats}
          disabled={isLoading}
          className="px-3.5 py-2 text-xs font-semibold rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition flex items-center gap-1.5 self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Refresh Data</span>
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-xs">
          {error}
        </div>
      )}

      {/* 4 Required Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <DashboardCard
          title="1. Total Students"
          value={isLoading ? '...' : stats?.summary.totalStudents ?? 0}
          subtitle="Registered students"
          icon={Users}
          badgeText="Active Roster"
          badgeType="info"
        />

        <DashboardCard
          title="2. Overall Average"
          value={isLoading ? '...' : `${stats?.summary.overallAverage ?? 0}%`}
          subtitle="Across all subjects & months"
          icon={TrendingUp}
          badgeText="Platform Mean"
          badgeType="success"
        />

        <DashboardCard
          title="3. Top Performing Student"
          value={isLoading ? '...' : stats?.summary.topStudent.name ?? 'N/A'}
          subtitle={stats ? `Avg Score: ${stats.summary.topStudent.average}%` : ''}
          icon={Award}
          badgeText="Leader"
          badgeType="warning"
        />

        <DashboardCard
          title="4. Needing Attention"
          value={isLoading ? '...' : stats?.summary.studentsNeedingAttention ?? 0}
          subtitle="Students with overall avg < 50%"
          icon={AlertTriangle}
          badgeText="Requires Intervention"
          badgeType="danger"
        />
      </div>

      {/* Platform Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Overall Monthly Trend Line Chart */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div className="mb-3">
            <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Overall Performance Trend (Jan – Jun)
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">Average score across all students monthly</p>
          </div>
          <LinePerformanceChart
            title="Monthly Platform Average"
            data={stats?.charts.overallTrend.map((t) => ({ month: t.month, marks: t.average })) || []}
            color="#36a8f7"
          />
        </div>

        {/* Subject Average Comparison Bar Chart */}
        <BarComparisonChart
          data={stats?.charts.subjectComparison || []}
          title="Subject Average Comparison (Platform-wide)"
        />
      </div>

      {/* Class Distribution Chart */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
          Class Distribution Breakdown
        </h3>
        <p className="text-[11px] text-slate-400 mb-4">Number of students enrolled per academic class</p>

        <div className="h-48 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={stats?.charts.classDistribution || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <XAxis dataKey="className" stroke={isDark ? '#64748b' : '#94a3b8'} tick={{ fontSize: 11 }} />
              <YAxis stroke={isDark ? '#64748b' : '#94a3b8'} tick={{ fontSize: 11 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: isDark ? '#0f172a' : '#ffffff',
                  borderColor: isDark ? '#334155' : '#e2e8f0',
                  borderRadius: '0.75rem',
                  fontSize: '12px',
                  color: isDark ? '#f8fafc' : '#0f172a',
                }}
                formatter={(value: any) => [`${value} Students`, 'Count']}
              />
              <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                {(stats?.charts.classDistribution || []).map((_, index) => (
                  <Cell key={`class-cell-${index}`} fill={CLASS_COLORS[index % CLASS_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

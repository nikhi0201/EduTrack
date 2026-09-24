import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
  Cell,
} from 'recharts';
import { useTheme } from '../context/ThemeContext';

interface LineTrendProps {
  data: Array<{ month: string; marks: number }>;
  color?: string;
  title: string;
}

export const LinePerformanceChart: React.FC<LineTrendProps> = ({
  data,
  color = '#0c8ce9',
  title,
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
          {title}
        </h4>
        <span className="text-[11px] font-semibold text-slate-400">
          Jan - Jun
        </span>
      </div>

      <div className="h-44 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke={isDark ? '#1e293b' : '#f1f5f9'}
              vertical={false}
            />
            <XAxis
              dataKey="month"
              tickFormatter={(m) => m.slice(0, 3)}
              stroke={isDark ? '#64748b' : '#94a3b8'}
              tick={{ fontSize: 11 }}
            />
            <YAxis
              domain={[0, 100]}
              stroke={isDark ? '#64748b' : '#94a3b8'}
              tick={{ fontSize: 11 }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: isDark ? '#0f172a' : '#ffffff',
                borderColor: isDark ? '#334155' : '#e2e8f0',
                borderRadius: '0.75rem',
                fontSize: '12px',
                color: isDark ? '#f8fafc' : '#0f172a',
              }}
              formatter={(value: any) => [`${value} Marks`, 'Marks']}
            />
            <Line
              type="monotone"
              dataKey="marks"
              stroke={color}
              strokeWidth={2.5}
              dot={{ r: 4, fill: color, strokeWidth: 2, stroke: isDark ? '#0f172a' : '#ffffff' }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

interface BarComparisonProps {
  data: Array<{ subject: string; average: number }>;
  title?: string;
}

export const BarComparisonChart: React.FC<BarComparisonProps> = ({
  data,
  title = 'Subject Average Comparison',
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const COLORS = ['#3b82f6', '#10b981', '#6366f1', '#f59e0b'];

  return (
    <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
      <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-4">
        {title}
      </h4>

      <div className="h-56 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke={isDark ? '#1e293b' : '#f1f5f9'}
              vertical={false}
            />
            <XAxis
              dataKey="subject"
              stroke={isDark ? '#64748b' : '#94a3b8'}
              tick={{ fontSize: 11 }}
            />
            <YAxis
              domain={[0, 100]}
              stroke={isDark ? '#64748b' : '#94a3b8'}
              tick={{ fontSize: 11 }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: isDark ? '#0f172a' : '#ffffff',
                borderColor: isDark ? '#334155' : '#e2e8f0',
                borderRadius: '0.75rem',
                fontSize: '12px',
                color: isDark ? '#f8fafc' : '#0f172a',
              }}
              formatter={(value: any) => [`${value}% Avg`, 'Average']}
            />
            <Bar dataKey="average" radius={[8, 8, 0, 0]}>
              {data.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

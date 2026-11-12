'use client';

import React, { useState } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';

// Custom Modern SaaS Tooltip
export const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900/95 backdrop-blur-md text-white text-xs px-3 py-2 rounded-xl shadow-xl border border-slate-800/80">
        <p className="font-bold text-slate-200 mb-1">{label || payload[0]?.name}</p>
        {payload.map((entry: any, index: number) => (
          <div key={`item-${index}`} className="flex items-center gap-2 text-[11px]">
            <span
              className="w-2 h-2 rounded-full inline-block"
              style={{ backgroundColor: entry.color || entry.fill }}
            />
            <span className="text-slate-400">{entry.name || 'ብዛት'}:</span>
            <span className="font-mono font-bold text-amber-400">{entry.value}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

// 1. Modern Bar Chart for Sectors or Categories
interface ModernBarChartProps {
  data: { name: string; count: number; color?: string }[];
  height?: number;
  barColor?: string;
}

export const ModernBarChart: React.FC<ModernBarChartProps> = ({
  data,
  height = 220,
  barColor = '#22177a',
}) => {
  return (
    <div style={{ width: '100%', height }} className="animate-fadeIn">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
          <defs>
            <linearGradient id="modernBarGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.9} />
              <stop offset="100%" stopColor="#22177a" stopOpacity={1} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
          <XAxis
            dataKey="name"
            tick={{ fontSize: 10.5, fill: '#64748b', fontWeight: 600 }}
            interval={0}
            axisLine={{ stroke: '#e2e8f0' }}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 600 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(34, 23, 122, 0.03)' }} />
          <Bar
            dataKey="count"
            name="የፋይሎች ብዛት"
            fill="url(#modernBarGrad)"
            radius={[8, 8, 0, 0]}
            maxBarSize={45}
            animationDuration={1200}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

// 2. Modern Interactive Donut Chart with Recharts
export interface DonutData {
  name: string;
  value: number;
  color: string;
}

interface ModernDonutChartProps {
  data: DonutData[];
  height?: number;
  centerLabel?: string;
  centerCount?: number | string;
}

export const ModernDonutChart: React.FC<ModernDonutChartProps> = ({
  data,
  height = 200,
  centerLabel = 'ጠቅላላ',
  centerCount,
}) => {
  const total = centerCount !== undefined ? centerCount : data.reduce((acc, curr) => acc + curr.value, 0);

  return (
    <div style={{ width: '100%', height }} className="relative flex items-center justify-center animate-fadeIn">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Tooltip content={<CustomTooltip />} />
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius="65%"
            outerRadius="88%"
            paddingAngle={3}
            dataKey="value"
            animationDuration={1200}
            strokeWidth={2}
            stroke="#ffffff"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>

      {/* Center Label for Donut */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <span className="text-2xl font-black font-mono text-slate-900 tracking-tight leading-none">
          {total}
        </span>
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1">
          {centerLabel}
        </span>
      </div>
    </div>
  );
};

// 3. Modern Split Donut Chart (Donut on left, Interactive Category Breakdown on right)
interface ModernSplitDonutChartProps {
  data: DonutData[];
  centerLabel?: string;
  centerCount?: number | string;
  totalDocs?: number;
}

export const ModernSplitDonutChart: React.FC<ModernSplitDonutChartProps> = ({
  data,
  centerLabel = 'ሰነዶች',
  centerCount,
  totalDocs,
}) => {
  const total = totalDocs !== undefined ? totalDocs : (centerCount !== undefined ? Number(centerCount) : data.reduce((acc, curr) => acc + curr.value, 0));

  return (
    <div className="flex flex-col sm:flex-row items-center gap-4 w-full h-full">
      {/* Donut Chart (Left) */}
      <div className="w-full sm:w-[45%] h-[180px] sm:h-[195px] relative shrink-0">
        <ModernDonutChart
          data={data}
          height={190}
          centerLabel={centerLabel}
          centerCount={total}
        />
      </div>

      {/* Breakdown List with Micro-Progress Bars (Right) */}
      <div className="w-full sm:w-[55%] space-y-2.5">
        {data.map((item) => {
          const pct = total > 0 ? Math.round((item.value / total) * 100) : 0;
          return (
            <div key={item.name} className="group p-1.5 rounded-lg hover:bg-slate-50 transition-colors">
              <div className="flex items-center justify-between text-xs mb-1 font-semibold">
                <div className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0 shadow-xs"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-slate-700 text-xs font-bold">{item.name}</span>
                </div>
                <div className="flex items-center gap-1.5 font-mono text-xs">
                  <span className="text-slate-900 font-extrabold">{item.value}</span>
                  <span className="text-slate-400 text-[10.5px]">({pct}%)</span>
                </div>
              </div>

              {/* Micro-Progress Bar */}
              <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                <div
                  style={{
                    width: `${pct}%`,
                    backgroundColor: item.color,
                  }}
                  className="h-full rounded-full transition-all duration-1000"
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// 4. Modern Ranked Progress List (for Sectors / Entities - Linear & Vercel SaaS style)
interface RankedItem {
  id?: string;
  name: string;
  count: number;
  total?: number;
  color?: string;
  code?: string;
}

interface ModernRankedListProps {
  items: RankedItem[];
  totalCount?: number;
  unitLabel?: string;
}

export const ModernRankedProgressList: React.FC<ModernRankedListProps> = ({
  items,
  totalCount,
  unitLabel = 'ፋይሎች',
}) => {
  const total = totalCount !== undefined ? totalCount : Math.max(1, items.reduce((acc, curr) => acc + curr.count, 0));
  const maxCount = Math.max(1, ...items.map((i) => i.count));

  // Sort by count descending
  const sorted = [...items].sort((a, b) => b.count - a.count);

  return (
    <div className="space-y-3 w-full py-1">
      {sorted.map((item, idx) => {
        const pct = Math.round((item.count / total) * 100);
        const barWidth = Math.round((item.count / maxCount) * 100);
        const isTop = idx === 0 && item.count > 0;

        return (
          <div
            key={item.name}
            className={`p-2 rounded-xl transition-all ${
              isTop ? 'bg-blue-50/40 border border-blue-100/60' : 'hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center justify-between text-xs mb-1.5">
              <div className="flex items-center gap-2">
                <span
                  className={`w-5 h-5 rounded-md flex items-center justify-center font-mono text-[10px] font-bold ${
                    isTop
                      ? 'bg-[#22177a] text-amber-300'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {idx + 1}
                </span>
                <span className="font-extrabold text-slate-800 text-xs">{item.name}</span>
                {item.code && (
                  <span className="text-[9.5px] font-mono text-slate-400 bg-white border border-slate-200 px-1.5 py-0.2 rounded">
                    {item.code}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2 font-mono">
                <span className="font-extrabold text-slate-900 text-xs">
                  {item.count} <span className="text-[10px] font-normal text-slate-500">{unitLabel}</span>
                </span>
                <span className="text-[10.5px] font-bold px-1.5 py-0.2 rounded-md bg-white border border-slate-200 text-slate-600">
                  {pct}%
                </span>
              </div>
            </div>

            {/* Horizontal Progress Bar */}
            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
              <div
                style={{ width: `${barWidth}%` }}
                className={`h-full rounded-full transition-all duration-1000 ${
                  isTop
                    ? 'bg-gradient-to-r from-[#22177a] via-[#1a1163] to-[#3b82f6]'
                    : 'bg-gradient-to-r from-[#3b82f6] to-[#60a5fa]'
                }`}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};

// 5. Modern Area Chart for Trends & Velocity
interface ModernAreaChartProps {
  data: { label: string; value: number; secondary?: number }[];
  height?: number;
  primaryColor?: string;
  secondaryColor?: string;
  name?: string;
}

export const ModernAreaChart: React.FC<ModernAreaChartProps> = ({
  data,
  height = 220,
  primaryColor = '#22177a',
  name = 'ሁነቶች',
}) => {
  return (
    <div style={{ width: '100%', height }} className="animate-fadeIn">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
          <defs>
            <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={primaryColor} stopOpacity={0.35} />
              <stop offset="95%" stopColor={primaryColor} stopOpacity={0.0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
          <XAxis
            dataKey="label"
            tick={{ fontSize: 10, fill: '#64748b', fontWeight: 600 }}
            axisLine={{ stroke: '#cbd5e1' }}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 10, fill: '#64748b', fontWeight: 600 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="value"
            name={name}
            stroke={primaryColor}
            strokeWidth={2.5}
            fillOpacity={1}
            fill="url(#areaGradient)"
            animationDuration={1400}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

'use client';

import React from 'react';
import { BarChart3, TrendingUp, AlertTriangle, CloudRain, Cpu } from 'lucide-react';
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  BarChart, Bar, LineChart, Line
} from 'recharts';

const HISTORICAL_RISK_DATA = [
  { date: '06/29', 'Avg Risk': 22, 'Peak Risk': 45 },
  { date: '06/30', 'Avg Risk': 35, 'Peak Risk': 62 },
  { date: '07/01', 'Avg Risk': 68, 'Peak Risk': 90 },
  { date: '07/02', 'Avg Risk': 45, 'Peak Risk': 78 },
  { date: '07/03', 'Avg Risk': 28, 'Peak Risk': 40 },
  { date: '07/04', 'Avg Risk': 18, 'Peak Risk': 30 },
  { date: '07/05', 'Avg Risk': 25, 'Peak Risk': 50 }
];

const WEATHER_ANOMALY_DATA = [
  { name: 'Rain Limit Check', limit: 25, actual: 32 },
  { name: 'Wind Limit Check', limit: 14, actual: 16 },
  { name: 'Heat Limit Check', limit: 38, actual: 34 },
  { name: 'Climb Wind Limit', limit: 13, actual: 15 },
  { name: 'Spray Wind Limit', limit: 5.5, actual: 4.8 }
];

const API_USAGE_DATA = [
  { day: 'Mon', Geocoding: 120, 'Risk Engine': 240 },
  { day: 'Tue', Geocoding: 150, 'Risk Engine': 310 },
  { day: 'Wed', Geocoding: 340, 'Risk Engine': 680 },
  { day: 'Thu', Geocoding: 200, 'Risk Engine': 420 },
  { day: 'Fri', Geocoding: 130, 'Risk Engine': 290 },
  { day: 'Sat', Geocoding: 80, 'Risk Engine': 150 },
  { day: 'Sun', Geocoding: 95, 'Risk Engine': 190 }
];

export default function AnalyticsPage() {
  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto pb-24 space-y-6">
      
      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold mb-1 flex items-center gap-2" style={{ color: 'rgb(var(--color-text))' }}>
          <BarChart3 className="w-6 h-6 text-indigo-400" />
          Operational Analytics
        </h1>
        <p className="text-sm" style={{ color: 'rgb(var(--color-text-3))' }}>
          Historical calculations, weather threshold triggers, and system api transaction metrics.
        </p>
      </div>

      {/* Top metrics summary grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card p-5 flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider">Average Risk Index</div>
            <div className="text-xl font-extrabold text-slate-800 dark:text-zinc-200 mt-0.5">34.5 / 100</div>
          </div>
        </div>

        <div className="card p-5 flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider">Limit Violations</div>
            <div className="text-xl font-extrabold text-slate-800 dark:text-zinc-200 mt-0.5">14 Triggers</div>
          </div>
        </div>

        <div className="card p-5 flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 flex items-center justify-center shrink-0">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider">API Core Requests</div>
            <div className="text-xl font-extrabold text-slate-800 dark:text-zinc-200 mt-0.5">3,380 Calls</div>
          </div>
        </div>
      </div>

      {/* Primary charts block */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Risk profile trend */}
        <div className="card p-5">
          <div className="mb-4">
            <h3 className="text-sm font-bold" style={{ color: 'rgb(var(--color-text))' }}>Historical Operational Risk Curve</h3>
            <p className="text-[11px]" style={{ color: 'rgb(var(--color-text-3))' }}>Overall average vs peak risk scores over the last 7 active calendar dates.</p>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={HISTORICAL_RISK_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorAvg" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorPeak" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(var(--color-border), 0.5)" vertical={false} />
                <XAxis dataKey="date" stroke="rgb(var(--color-text-3))" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="rgb(var(--color-text-3))" fontSize={11} tickLine={false} axisLine={false} domain={[0, 100]} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgb(var(--color-surface))', 
                    borderColor: 'rgb(var(--color-border))',
                    borderRadius: '8px',
                    color: 'rgb(var(--color-text))'
                  }}
                />
                <Legend verticalAlign="top" height={36} iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '11px' }} />
                <Area type="monotone" dataKey="Avg Risk" stroke="#4f46e5" strokeWidth={2} fillOpacity={1} fill="url(#colorAvg)" />
                <Area type="monotone" dataKey="Peak Risk" stroke="#ef4444" strokeWidth={2} fillOpacity={1} fill="url(#colorPeak)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* API Core Usage */}
        <div className="card p-5">
          <div className="mb-4">
            <h3 className="text-sm font-bold" style={{ color: 'rgb(var(--color-text))' }}>API Transaction Logs</h3>
            <p className="text-[11px]" style={{ color: 'rgb(var(--color-text-3))' }}>Breakdown of address geocoding lookups vs weather assessment risk evaluations.</p>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={API_USAGE_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(var(--color-border), 0.5)" vertical={false} />
                <XAxis dataKey="day" stroke="rgb(var(--color-text-3))" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="rgb(var(--color-text-3))" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgb(var(--color-surface))', 
                    borderColor: 'rgb(var(--color-border))',
                    borderRadius: '8px',
                    color: 'rgb(var(--color-text))'
                  }}
                />
                <Legend verticalAlign="top" height={36} iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '11px' }} />
                <Bar dataKey="Geocoding" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Risk Engine" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Weather Limit comparison line chart */}
        <div className="card p-5 lg:col-span-2">
          <div className="mb-4">
            <h3 className="text-sm font-bold" style={{ color: 'rgb(var(--color-text))' }}>Operational Limits vs Observed Conditions</h3>
            <p className="text-[11px]" style={{ color: 'rgb(var(--color-text-3))' }}>Analysis comparing registered threshold parameters against active measured parameters during limits checking.</p>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={WEATHER_ANOMALY_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(var(--color-border), 0.5)" vertical={false} />
                <XAxis dataKey="name" stroke="rgb(var(--color-text-3))" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="rgb(var(--color-text-3))" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgb(var(--color-surface))', 
                    borderColor: 'rgb(var(--color-border))',
                    borderRadius: '8px',
                    color: 'rgb(var(--color-text))'
                  }}
                />
                <Legend verticalAlign="top" height={36} iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '11px' }} />
                <Line type="monotone" dataKey="limit" stroke="#10b981" strokeWidth={2} name="Safe Limit Cap" />
                <Line type="monotone" dataKey="actual" stroke="#ef4444" strokeWidth={2} name="Observed Parameter" strokeDasharray="5 5" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

    </div>
  );
}

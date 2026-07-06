'use client';

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
  Legend
} from 'recharts';

const RISK_TREND_DATA = [
  { day: 'Mon', risk: 24, alerts: 0 },
  { day: 'Tue', risk: 42, alerts: 1 },
  { day: 'Wed', risk: 78, alerts: 3 },
  { day: 'Thu', risk: 50, alerts: 2 },
  { day: 'Fri', risk: 28, alerts: 0 },
  { day: 'Sat', risk: 15, alerts: 0 },
  { day: 'Sun', risk: 32, alerts: 1 },
];

const SCENARIO_COMPARISON_DATA = [
  { name: 'Const.', cleared: 88, restricted: 12 },
  { name: 'Logistics', cleared: 95, restricted: 5 },
  { name: 'Drone', cleared: 72, restricted: 28 },
  { name: 'Events', cleared: 60, restricted: 40 },
  { name: 'Agri.', cleared: 90, restricted: 10 },
  { name: 'Marine', cleared: 65, restricted: 35 },
];

export function DashboardCharts() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      {/* Risk Index Trend Chart */}
      <div className="card p-5">
        <div className="flex flex-col mb-4">
          <h3 className="text-sm font-semibold" style={{ color: 'rgb(var(--color-text))' }}>Weekly Risk Index Trend</h3>
          <p className="text-xs" style={{ color: 'rgb(var(--color-text-3))' }}>Overall weather operational risk index for Mon - Sun.</p>
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={RISK_TREND_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorRisk" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="rgb(var(--color-primary))" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="rgb(var(--color-primary))" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(var(--color-border), 0.5)" vertical={false} />
              <XAxis dataKey="day" stroke="rgb(var(--color-text-3))" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="rgb(var(--color-text-3))" fontSize={12} tickLine={false} axisLine={false} domain={[0, 100]} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgb(var(--color-surface))', 
                  borderColor: 'rgb(var(--color-border))',
                  borderRadius: '8px',
                  color: 'rgb(var(--color-text))'
                }}
              />
              <Area type="monotone" dataKey="risk" stroke="rgb(var(--color-primary))" strokeWidth={2} fillOpacity={1} fill="url(#colorRisk)" name="Risk Score" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Operational Clearances by Scenario */}
      <div className="card p-5">
        <div className="flex flex-col mb-4">
          <h3 className="text-sm font-semibold" style={{ color: 'rgb(var(--color-text))' }}>Operational Clearance Rate</h3>
          <p className="text-xs" style={{ color: 'rgb(var(--color-text-3))' }}>Percent of cleared operations vs weather-restricted ones.</p>
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={SCENARIO_COMPARISON_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }} stackOffset="expand">
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(var(--color-border), 0.5)" vertical={false} />
              <XAxis dataKey="name" stroke="rgb(var(--color-text-3))" fontSize={10} tickLine={false} axisLine={false} />
              <YAxis stroke="rgb(var(--color-text-3))" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(v) => `${Math.round(v * 100)}%`} />
              <Tooltip 
                formatter={(value) => `${value}%`}
                contentStyle={{ 
                  backgroundColor: 'rgb(var(--color-surface))', 
                  borderColor: 'rgb(var(--color-border))',
                  borderRadius: '8px',
                  color: 'rgb(var(--color-text))'
                }}
              />
              <Legend verticalAlign="top" height={36} iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '11px' }} />
              <Bar dataKey="cleared" stackId="a" fill="#10b981" name="Cleared %" />
              <Bar dataKey="restricted" stackId="a" fill="#ef4444" name="Restricted %" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

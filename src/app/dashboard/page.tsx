'use client';

import React from 'react';
import { useAuth } from '@/components/auth/AuthContext';
import { HeroBanner } from '@/components/dashboard/HeroBanner';
import { QuickAnalyzeCard } from '@/components/dashboard/QuickAnalyzeCard';
import { RecentAnalysesFeed } from '@/components/dashboard/RecentAnalysesFeed';
import { MetricCard } from '@/components/shared/MetricCard';
import { CommandCenterMap } from '@/components/dashboard/CommandCenterMap';
import { DashboardCharts } from '@/components/dashboard/DashboardCharts';
import { ShieldCheck, AlertTriangle, CheckSquare, Activity } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default function Dashboard() {
  const { user } = useAuth();
  
  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto pb-24">
      {/* Welcome Banner */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1" style={{ color: 'rgb(var(--color-text))' }}>
          Welcome back, {user?.name || 'Operator'}
        </h1>
        <p className="text-xs" style={{ color: 'rgb(var(--color-text-3))' }}>
          System active for <span className="font-semibold text-indigo-400">{user?.companyName || 'Corporate Monitored Fleet'}</span>.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="fade-in-up" style={{ animationDelay: '0.1s' }}>
          <MetricCard
            title="Overall Weather Risk"
            value="Low"
            icon={<ShieldCheck className="w-5 h-5 text-green-500" />}
            trend={{ direction: 'neutral', value: 'Current conditions stable' }}
          />
        </div>
        <div className="fade-in-up" style={{ animationDelay: '0.2s' }}>
          <MetricCard
            title="Active Warnings"
            value="0"
            icon={<AlertTriangle className="w-5 h-5 text-amber-500" />}
            subtitle="No critical weather warnings"
          />
        </div>
        <div className="fade-in-up" style={{ animationDelay: '0.3s' }}>
          <MetricCard
            title="Operations Cleared"
            value="92%"
            icon={<CheckSquare className="w-5 h-5 text-blue-500" />}
            trend={{ direction: 'up', value: '4% vs last week' }}
          />
        </div>
        <div className="fade-in-up" style={{ animationDelay: '0.4s' }}>
          <MetricCard
            title="System Status"
            value="Online"
            icon={<Activity className="w-5 h-5 text-primary" />}
            subtitle="All APIs operational"
          />
        </div>
      </div>

      {/* Corporate Asset Command Radar Center */}
      <div className="fade-in-up" style={{ animationDelay: '0.5s' }}>
        <CommandCenterMap />
      </div>

      {/* Analytics Trends and clearance stats */}
      <div className="fade-in-up" style={{ animationDelay: '0.6s' }}>
        <DashboardCharts />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="fade-in-up" style={{ animationDelay: '0.7s' }}>
          <h2 className="text-lg font-bold mb-4" style={{ color: 'rgb(var(--color-text))' }}>Start Planning</h2>
          <QuickAnalyzeCard />
        </div>
        
        <div className="fade-in-up" style={{ animationDelay: '0.8s' }}>
          <h2 className="text-lg font-bold mb-4" style={{ color: 'rgb(var(--color-text))' }}>Recent Activity</h2>
          <RecentAnalysesFeed />
        </div>
      </div>
    </div>
  );
}

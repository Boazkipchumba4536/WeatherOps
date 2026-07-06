'use client';

import React, { useState, useEffect } from 'react';
import { AlertOctagon, ShieldAlert, AlertTriangle, Info, BellOff, CheckCircle2, History, Filter } from 'lucide-react';

interface SystemAlert {
  id: string;
  title: string;
  description: string;
  severity: 'critical' | 'warning' | 'info';
  category: string;
  location: string;
  time: string;
  suggestedAction: string;
}

const DEFAULT_ALERTS: SystemAlert[] = [
  {
    id: 'alt-1',
    title: 'Severe Crane Wind Intercept',
    description: 'Sustained wind velocities have breached the maximum structural safety thresholds for elevated operations.',
    severity: 'critical',
    category: 'Construction',
    location: 'Denver Building Site 4',
    time: '15m ago',
    suggestedAction: 'Enforce structural lockouts and ground all heavy lifting cranes immediately.'
  },
  {
    id: 'alt-2',
    title: 'Drone Survey Storm Warning',
    description: 'Local lightning cells identified within the active drone airspace perimeter.',
    severity: 'critical',
    category: 'Drone Survey',
    location: 'Chicago Hub Alpha',
    time: '45m ago',
    suggestedAction: 'Halt drone inspection runs and recall all airborne survey crafts to safety bays.'
  },
  {
    id: 'alt-3',
    title: 'High Temperature Hydration Watch',
    description: 'Extreme thermal conditions are forecast to exceed safety baseline specifications.',
    severity: 'warning',
    category: 'Worker Safety',
    location: 'Houston Plant',
    time: '2h ago',
    suggestedAction: 'Schedule mandatory 15-minute cool-down hydration breaks for every hour of outdoor exposure.'
  },
  {
    id: 'alt-4',
    title: 'Precipitation Logistics Advisory',
    description: 'Sustained rain accumulation will likely affect transit routes and shipping speeds.',
    severity: 'info',
    category: 'Logistics',
    location: 'Seattle Fulfillment Center',
    time: '5h ago',
    suggestedAction: 'Notify fleet dispatchers of possible 20% delay ratios.'
  }
];

export default function AlertsPage() {
  const [activeTab, setActiveTab] = useState<'active' | 'history'>('active');
  const [alerts, setAlerts] = useState<SystemAlert[]>([]);
  const [history, setHistory] = useState<SystemAlert[]>([]);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [severityFilter, setSeverityFilter] = useState<string>('all');

  useEffect(() => {
    let savedAlertsParsed = DEFAULT_ALERTS;
    let savedHistoryParsed: SystemAlert[] = [];

    const savedAlerts = localStorage.getItem('WEATHEROPS_SYSTEM_ALERTS');
    if (savedAlerts) {
      try { savedAlertsParsed = JSON.parse(savedAlerts); } catch (e) {}
    } else {
      localStorage.setItem('WEATHEROPS_SYSTEM_ALERTS', JSON.stringify(DEFAULT_ALERTS));
    }

    const savedHistory = localStorage.getItem('WEATHEROPS_SYSTEM_ALERTS_HISTORY');
    if (savedHistory) {
      try { savedHistoryParsed = JSON.parse(savedHistory); } catch (e) {}
    }

    Promise.resolve().then(() => {
      setAlerts(savedAlertsParsed);
      setHistory(savedHistoryParsed);
    });
  }, []);

  const handleDismiss = (id: string) => {
    const alertToDismiss = alerts.find(a => a.id === id);
    if (!alertToDismiss) return;

    const updatedAlerts = alerts.filter(a => a.id !== id);
    const updatedHistory = [
      { ...alertToDismiss, time: `Resolved ${new Date().toLocaleTimeString()}` },
      ...history
    ].slice(0, 30); // Cap history

    setAlerts(updatedAlerts);
    setHistory(updatedHistory);

    localStorage.setItem('WEATHEROPS_SYSTEM_ALERTS', JSON.stringify(updatedAlerts));
    localStorage.setItem('WEATHEROPS_SYSTEM_ALERTS_HISTORY', JSON.stringify(updatedHistory));
  };

  const categories = Array.from(new Set([...alerts, ...history].map(a => a.category)));
  
  const displayList = activeTab === 'active' ? alerts : history;

  const filteredAlerts = displayList.filter(a => {
    const matchesCategory = categoryFilter === 'all' || a.category === categoryFilter;
    const matchesSeverity = severityFilter === 'all' || a.severity === severityFilter;
    return matchesCategory && matchesSeverity;
  });

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto pb-24">
      
      {/* Title */}
      <div className="mb-6 flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold mb-1 flex items-center gap-2" style={{ color: 'rgb(var(--color-text))' }}>
            <AlertOctagon className="w-6 h-6 text-red-500" />
            Weather Warnings Feed
          </h1>
          <p className="text-sm" style={{ color: 'rgb(var(--color-text-3))' }}>
            System-generated operational alarms mapping weather threats to mitigation actions.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b mb-6" style={{ borderColor: 'rgb(var(--color-border))' }}>
        <button
          onClick={() => setActiveTab('active')}
          className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-all -mb-px flex items-center gap-2 ${
            activeTab === 'active'
              ? 'border-primary text-primary'
              : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
          }`}
        >
          <ShieldAlert className="w-4 h-4" /> Active Warnings ({alerts.length})
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-all -mb-px flex items-center gap-2 ${
            activeTab === 'history'
              ? 'border-primary text-primary'
              : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
          }`}
        >
          <History className="w-4 h-4" /> Resolve History ({history.length})
        </button>
      </div>

      {/* Filters */}
      <div className="card p-4 mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Filter Feed:</span>
        </div>

        <div className="flex flex-wrap gap-3">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="input-field text-xs py-1.5 px-3 appearance-none bg-transparent"
          >
            <option value="all">All Categories</option>
            {categories.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="input-field text-xs py-1.5 px-3 appearance-none bg-transparent"
          >
            <option value="all">All Severities</option>
            <option value="critical">Critical Only</option>
            <option value="warning">Warnings Only</option>
            <option value="info">Info Advisory Only</option>
          </select>
        </div>
      </div>

      {/* Warnings List */}
      <div className="space-y-4">
        {filteredAlerts.map((alert) => {
          const isCritical = alert.severity === 'critical';
          const isWarning = alert.severity === 'warning';
          
          const icon = isCritical ? (
            <ShieldAlert className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
          ) : isWarning ? (
            <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
          ) : (
            <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
          );

          const borderStyle = isCritical 
            ? 'border-red-500/20 bg-red-500/[0.02]' 
            : isWarning 
              ? 'border-amber-500/20 bg-amber-500/[0.02]' 
              : 'border-zinc-800 bg-zinc-900/30';

          return (
            <div 
              key={alert.id} 
              className={`border rounded-2xl p-5 flex flex-col sm:flex-row justify-between gap-4 transition-all hover:scale-[1.005] duration-200 ${borderStyle}`}
            >
              <div className="flex gap-4">
                <div className="pt-0.5">{icon}</div>
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-sm font-bold text-slate-800 dark:text-zinc-200">{alert.title}</h3>
                    <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 bg-zinc-800 text-zinc-400 rounded-full border border-zinc-700">
                      {alert.category}
                    </span>
                    <span className="text-[10px] text-slate-400 flex items-center gap-1">
                      • {alert.location}
                    </span>
                  </div>

                  <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed max-w-2xl">{alert.description}</p>
                  
                  <div className="bg-zinc-950/60 p-3 rounded-lg border border-zinc-900/80 text-[11px] text-zinc-300">
                    <span className="font-bold text-zinc-400 uppercase tracking-wider block text-[9.5px] mb-1">Recommended Response Action:</span>
                    {alert.suggestedAction}
                  </div>
                </div>
              </div>

              <div className="flex sm:flex-col items-end justify-between shrink-0 text-right gap-2">
                <span className="text-[10px] text-slate-400 font-mono">{alert.time}</span>
                {activeTab === 'active' && (
                  <button
                    onClick={() => handleDismiss(alert.id)}
                    className="btn-secondary text-[11px] py-1 px-3 border border-emerald-500/20 hover:bg-emerald-500/10 text-emerald-400 flex items-center gap-1"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" /> Acknowledge
                  </button>
                )}
              </div>
            </div>
          );
        })}

        {filteredAlerts.length === 0 && (
          <div className="card p-12 text-center text-slate-400 text-xs">
            <BellOff className="w-8 h-8 opacity-45 mx-auto mb-2" />
            No weather warnings matching your search criteria.
          </div>
        )}
      </div>

    </div>
  );
}

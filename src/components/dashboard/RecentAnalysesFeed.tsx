'use client';

import { useHistory } from '@/hooks/useHistory';
import { SCENARIO_META, RISK_CONFIG } from '@/lib/constants';
import { Clock, MapPin, ChevronRight, Briefcase } from 'lucide-react';
import Link from 'next/link';

export function RecentAnalysesFeed() {
  const { entries, isLoaded } = useHistory();

  if (!isLoaded) return <div className="h-48 shimmer fade-in-up" style={{ animationDelay: '0.2s' }} />;

  if (entries.length === 0) {
    return (
      <div className="card p-6 text-center fade-in-up" style={{ animationDelay: '0.2s' }}>
        <Clock className="w-8 h-8 mx-auto mb-3" style={{ color: 'rgb(var(--color-text-muted))' }} />
        <h3 className="text-sm font-medium mb-1" style={{ color: 'rgb(var(--color-text))' }}>No recent analyses</h3>
        <p className="text-xs" style={{ color: 'rgb(var(--color-text-3))' }}>Your recent operational checks will appear here.</p>
      </div>
    );
  }

  return (
    <div className="card overflow-hidden fade-in-up" style={{ animationDelay: '0.2s' }}>
      <div className="p-4 border-b" style={{ borderColor: 'rgb(var(--color-border))', backgroundColor: 'rgb(var(--color-surface-2))' }}>
        <h3 className="text-sm font-semibold flex items-center gap-2" style={{ color: 'rgb(var(--color-text))' }}>
          <Clock className="w-4 h-4 text-primary" />
          Recent Analyses
        </h3>
      </div>
      <div className="divide-y" style={{ borderColor: 'rgb(var(--color-border))' }}>
        {entries.slice(0, 5).map((entry) => {
          const scenarioMeta = SCENARIO_META[entry.businessScenario];
          const riskConfig = RISK_CONFIG[entry.riskLevel];
          
          return (
            <Link 
              key={entry.id} 
              href="/history"
              className="flex items-center justify-between p-4 hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors group"
            >
              <div className="flex items-center gap-4 min-w-0">
                <div 
                  className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                  style={{ backgroundColor: riskConfig.color + '20', color: riskConfig.color }}
                >
                  <span className="text-sm font-bold">{entry.riskScore}</span>
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-semibold truncate mb-0.5" style={{ color: 'rgb(var(--color-text))' }}>
                    {entry.locationName.split(',')[0]}
                  </div>
                  <div className="flex items-center gap-2 text-xs truncate" style={{ color: 'rgb(var(--color-text-3))' }}>
                    <span className="flex items-center gap-1">
                      <Briefcase className="w-3 h-3" /> {scenarioMeta.label}
                    </span>
                    <span>•</span>
                    <span>{new Date(entry.analyzedAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" style={{ color: 'rgb(var(--color-text-muted))' }} />
            </Link>
          );
        })}
      </div>
      {entries.length > 5 && (
        <div className="p-3 text-center border-t" style={{ borderColor: 'rgb(var(--color-border))', backgroundColor: 'rgb(var(--color-surface-2))' }}>
          <Link href="/history" className="text-xs font-medium text-primary hover:underline">
            View all {entries.length} analyses
          </Link>
        </div>
      )}
    </div>
  );
}

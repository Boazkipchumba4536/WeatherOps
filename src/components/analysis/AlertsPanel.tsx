import { OperationalAlert } from '@/types';
import { AlertTriangle, AlertOctagon, Info } from 'lucide-react';

export function AlertsPanel({ alerts }: { alerts: OperationalAlert[] }) {
  if (alerts.length === 0) return null;

  return (
    <div className="flex flex-col gap-3 fade-in-up" style={{ animationDelay: '0.1s' }}>
      {alerts.map((alert) => {
        const isCritical = alert.severity === 'critical';
        const isWarning = alert.severity === 'warning';
        
        const colors = isCritical 
          ? { bg: 'bg-red-50 dark:bg-red-950/30', border: 'border-red-200 dark:border-red-900', icon: 'text-red-500', title: 'text-red-800 dark:text-red-300' }
          : isWarning
          ? { bg: 'bg-amber-50 dark:bg-amber-950/30', border: 'border-amber-200 dark:border-amber-900', icon: 'text-amber-500', title: 'text-amber-800 dark:text-amber-300' }
          : { bg: 'bg-blue-50 dark:bg-blue-950/30', border: 'border-blue-200 dark:border-blue-900', icon: 'text-blue-500', title: 'text-blue-800 dark:text-blue-300' };

        const Icon = isCritical ? AlertOctagon : isWarning ? AlertTriangle : Info;

        return (
          <div key={alert.id} className={`p-4 rounded-xl border ${colors.bg} ${colors.border}`}>
            <div className="flex gap-3">
              <Icon className={`w-5 h-5 shrink-0 mt-0.5 ${colors.icon}`} />
              <div>
                <h4 className={`text-sm font-bold mb-1 ${colors.title}`}>{alert.title}</h4>
                <p className="text-sm mb-2" style={{ color: 'rgb(var(--color-text-2))' }}>{alert.description}</p>
                {alert.suggestedAction && (
                  <div className="text-xs font-medium px-2 py-1 rounded inline-block" style={{ backgroundColor: 'rgb(var(--color-surface))', color: 'rgb(var(--color-text))' }}>
                    Action: {alert.suggestedAction}
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

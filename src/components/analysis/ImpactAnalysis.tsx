import { ImpactArea } from '@/types';
import { RISK_CONFIG } from '@/lib/constants';

export function ImpactAnalysis({ impacts }: { impacts: ImpactArea[] }) {
  if (impacts.length === 0) return null;

  return (
    <div className="card p-5 fade-in-up" style={{ animationDelay: '0.3s' }}>
      <h3 className="text-sm font-semibold mb-4" style={{ color: 'rgb(var(--color-text))' }}>Business Impact Areas</h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {impacts.map((impact, i) => {
          const config = RISK_CONFIG[impact.riskLevel];
          
          return (
            <div key={i} className="flex gap-3 p-3 rounded-lg border" style={{ backgroundColor: 'rgb(var(--color-surface-2))', borderColor: 'rgb(var(--color-border))' }}>
              <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5" style={{ backgroundColor: config.color + '20', color: config.color }}>
                <span className="text-sm">{impact.icon || '•'}</span>
              </div>
              <div>
                <div className="flex justify-between items-start mb-1 gap-2">
                  <h4 className="text-sm font-semibold" style={{ color: 'rgb(var(--color-text))' }}>{impact.area}</h4>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-sm uppercase tracking-wider" style={{ backgroundColor: config.color + '20', color: config.color }}>
                    {config.label}
                  </span>
                </div>
                <p className="text-xs leading-relaxed" style={{ color: 'rgb(var(--color-text-2))' }}>{impact.explanation}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

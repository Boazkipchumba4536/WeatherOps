import { TimelineSlot } from '@/types';
import { RISK_CONFIG } from '@/lib/constants';

export function TimelinePanel({ timeline }: { timeline: TimelineSlot[] }) {
  return (
    <div className="card p-5 overflow-hidden fade-in-up" style={{ animationDelay: '0.2s' }}>
      <h3 className="text-sm font-semibold mb-6" style={{ color: 'rgb(var(--color-text))' }}>24-Hour Operational Timeline</h3>
      
      <div className="flex flex-col md:flex-row gap-6 md:gap-4 relative">
        {/* Connector line for desktop */}
        <div className="hidden md:block absolute top-4 left-8 right-8 h-0.5" style={{ backgroundColor: 'rgb(var(--color-border))' }} />
        {/* Connector line for mobile */}
        <div className="md:hidden absolute left-4 top-8 bottom-8 w-0.5" style={{ backgroundColor: 'rgb(var(--color-border))' }} />
        
        {timeline.map((slot, i) => {
          const config = RISK_CONFIG[slot.riskLevel];
          
          return (
            <div key={i} className="flex-1 flex md:flex-col items-start md:items-center gap-4 md:gap-3 relative z-10">
              <div 
                className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-sm"
                style={{ backgroundColor: config.color, boxShadow: `0 0 0 4px rgb(var(--color-surface))` }}
              >
                {slot.riskScore}
              </div>
              
              <div className="flex-1 w-full md:text-center mt-1 md:mt-0">
                <div className="text-sm font-bold" style={{ color: 'rgb(var(--color-text))' }}>{slot.period}</div>
                <div className="text-xs mb-2" style={{ color: 'rgb(var(--color-text-3))' }}>{slot.timeRange}</div>
                
                <div className="p-3 rounded-lg text-left" style={{ backgroundColor: 'rgb(var(--color-surface-2))', border: '1px solid rgb(var(--color-border))' }}>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-lg leading-none">{slot.icon}</span>
                    <span className="text-xs font-semibold" style={{ color: config.color }}>{config.label}</span>
                  </div>
                  <div className="text-xs leading-relaxed" style={{ color: 'rgb(var(--color-text-2))' }}>{slot.recommendation}</div>
                  {(slot.temperature !== undefined || slot.rainProbability !== undefined) && (
                    <div className="mt-2.5 pt-2 text-[10px] flex justify-between font-medium" style={{ borderTop: '1px solid rgb(var(--color-border))', color: 'rgb(var(--color-text-3))' }}>
                      <span>{slot.temperature !== undefined ? `${Math.round(slot.temperature)}°` : ''}</span>
                      <span>{slot.rainProbability !== undefined ? `${Math.round(slot.rainProbability)}% pop` : ''}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

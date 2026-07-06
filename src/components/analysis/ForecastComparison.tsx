import { DailyForecastSummary } from '@/services/weather/forecast.service';
import { Cloud, Droplets, Sun, Wind } from 'lucide-react';

export function ForecastComparison({ forecast }: { forecast: DailyForecastSummary[] }) {
  if (!forecast || forecast.length < 3) return null;

  return (
    <div className="card p-5 fade-in-up" style={{ animationDelay: '0.5s' }}>
      <h3 className="text-sm font-semibold mb-4" style={{ color: 'rgb(var(--color-text))' }}>3-Day Outlook</h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {forecast.slice(0, 3).map((day, i) => (
          <div key={i} className="p-4 rounded-xl border" style={{ borderColor: 'rgb(var(--color-border))', backgroundColor: i === 0 ? 'rgb(var(--color-primary-light))' : 'rgb(var(--color-surface-2))' }}>
            <div className="flex justify-between items-center mb-3">
              <div className="font-semibold text-sm" style={{ color: 'rgb(var(--color-text))' }}>{day.dayLabel}</div>
              <div className="text-xs" style={{ color: 'rgb(var(--color-text-3))' }}>{new Date(day.date).toLocaleDateString([], { month: 'short', day: 'numeric' })}</div>
            </div>
            
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 shrink-0">
                <img src={`https://openweathermap.org/img/wn/${day.icon}@2x.png`} alt={day.condition} className="w-full h-full object-contain drop-shadow-md" onError={(e) => e.currentTarget.style.display = 'none'} />
              </div>
              <div>
                <div className="flex items-baseline gap-1">
                  <span className="text-xl font-bold" style={{ color: 'rgb(var(--color-text))' }}>{Math.round(day.tempMax)}°</span>
                  <span className="text-sm" style={{ color: 'rgb(var(--color-text-3))' }}>/ {Math.round(day.tempMin)}°</span>
                </div>
                <div className="text-xs font-medium" style={{ color: 'rgb(var(--color-text-2))' }}>{day.condition}</div>
              </div>
            </div>
            
            <div className="space-y-2 mt-4 pt-4 text-xs" style={{ borderTop: '1px solid rgb(var(--color-border))' }}>
              <div className="flex justify-between">
                <span className="flex items-center gap-1.5" style={{ color: 'rgb(var(--color-text-3))' }}><Droplets className="w-3.5 h-3.5" /> Rain</span>
                <span className="font-medium" style={{ color: 'rgb(var(--color-text))' }}>{Math.round(day.rainProbability)}%</span>
              </div>
              <div className="flex justify-between">
                <span className="flex items-center gap-1.5" style={{ color: 'rgb(var(--color-text-3))' }}><Wind className="w-3.5 h-3.5" /> Wind</span>
                <span className="font-medium" style={{ color: 'rgb(var(--color-text))' }}>{Math.round(day.windSpeed)} m/s</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

import { NormalizedWeather } from '@/services/weather/types';
import { Thermometer, Droplets, Wind, Eye, Cloud, Sun, Sunrise, Sunset } from 'lucide-react';

export function WeatherDetailsCard({ weather }: { weather: NormalizedWeather }) {
  const isMetric = weather.units === 'metric';
  const tempUnit = isMetric ? '°C' : '°F';
  const speedUnit = isMetric ? 'm/s' : 'mph';
  const distUnit = isMetric ? 'km' : 'mi';

  const details = [
    { label: 'Temperature', value: `${Math.round(weather.temperature)}${tempUnit}`, icon: <Thermometer className="w-4 h-4" /> },
    { label: 'Feels Like', value: `${Math.round(weather.feelsLike)}${tempUnit}`, icon: <Thermometer className="w-4 h-4" /> },
    { label: 'Humidity', value: `${Math.round(weather.humidity)}%`, icon: <Droplets className="w-4 h-4" /> },
    { label: 'Wind', value: `${Math.round(weather.windSpeed)} ${speedUnit}`, icon: <Wind className="w-4 h-4" /> },
    { label: 'Cloud Cover', value: `${Math.round(weather.cloudCover)}%`, icon: <Cloud className="w-4 h-4" /> },
    { label: 'Visibility', value: `${weather.visibility.toFixed(1)} ${distUnit}`, icon: <Eye className="w-4 h-4" /> },
    { label: 'UV Index', value: weather.uvIndex.toFixed(1), icon: <Sun className="w-4 h-4" /> },
    { label: 'Rain Prob.', value: `${Math.round(weather.rainProbability)}%`, icon: <Droplets className="w-4 h-4" /> },
  ];

  return (
    <div className="card p-5 fade-in-up">
      <h3 className="text-sm font-semibold mb-4" style={{ color: 'rgb(var(--color-text))' }}>Current Conditions</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {details.map((d, i) => (
          <div key={i} className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgb(var(--color-surface-2))', color: 'rgb(var(--color-primary))' }}>
              {d.icon}
            </div>
            <div>
              <div className="text-xs" style={{ color: 'rgb(var(--color-text-3))' }}>{d.label}</div>
              <div className="text-sm font-medium" style={{ color: 'rgb(var(--color-text))' }}>{d.value}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 pt-4 flex gap-6" style={{ borderTop: '1px solid rgb(var(--color-border))' }}>
        <div className="flex items-center gap-2">
          <Sunrise className="w-4 h-4 text-amber-500" />
          <span className="text-sm" style={{ color: 'rgb(var(--color-text-2))' }}>
            {new Date(weather.sunrise * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Sunset className="w-4 h-4 text-orange-500" />
          <span className="text-sm" style={{ color: 'rgb(var(--color-text-2))' }}>
            {new Date(weather.sunset * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      </div>
    </div>
  );
}
